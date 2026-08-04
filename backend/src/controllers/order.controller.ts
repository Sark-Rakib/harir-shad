import type { Request, Response } from "express";
import { z } from "zod";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { HttpError } from "../utils/HttpError";
import { initPayment } from "../services/sslcommerz";

const itemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().optional().default(""),
  nameBn: z.string().min(1),
  nameEn: z.string().optional().default(""),
  weightLabel: z.string().optional().default(""),
  image: z.string().optional().default(""),
  unitPrice: z.coerce.number().min(0),
  quantity: z.coerce.number().min(1),
});

const orderSchema = z.object({
  customer: z.object({
    name: z.string().min(2, "নাম দিন।"),
    phone: z.string().min(6, "সঠিক ফোন নম্বর দিন।"),
    email: z.string().email().optional().or(z.literal("")),
    address: z.string().min(5, "সম্পূর্ণ ঠিকানা দিন।"),
    district: z.string().min(2, "জেলা দিন।"),
    deliveryMethod: z
      .enum(["standard", "express", "pickup"])
      .optional()
      .default("standard"),
  }),
  items: z.array(itemSchema).min(1, "অন্তত একটি পণ্য দিন।"),
  subtotal: z.coerce.number().min(0),
  discount: z.coerce.number().optional().default(0),
  deliveryCharge: z.coerce.number().optional().default(0),
  total: z.coerce.number().min(1),
  coupon: z.string().optional().default(""),
  note: z.string().optional().default(""),
  paymentMethod: z.enum(["cod", "bkash", "nagad", "card"]),
  idempotencyKey: z.string().optional(),
});

const statusSchema = z.object({
  orderStatus: z
    .enum(["pending", "processing", "shipped", "delivered", "cancelled"])
    .optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
});

function generateOrderId(): string {
  const d = new Date();
  const pad = (n: number, l = 2) => String(n).padStart(l, "0");
  const ts = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(
    d.getHours(),
  )}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  return `HS-${ts}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: number }).code === 11000
  );
}

export async function createOrder(req: Request, res: Response) {
  const data = orderSchema.parse(req.body);

  const key = data.idempotencyKey?.trim();
  if (key) {
    const existing = await Order.findOne({ idempotencyKey: key });
    if (existing) {
      return res.status(201).json({
        order: existing.toJSON(),
        orderId: existing.orderId,
        gatewayUrl: null,
        paymentUrl: null,
      });
    }
  }

  const orderId = generateOrderId();
  const userId = (req as Request & { user?: { id: string } }).user?.id ?? "";

  let tranId = "";
  let gatewayUrl: string | undefined;

  if (data.paymentMethod !== "cod") {
    try {
      const payment = await initPayment({
        tranId: orderId,
        total: data.total,
        name: data.customer.name,
        email: data.customer.email || undefined,
        phone: data.customer.phone,
        address: data.customer.address,
        city: data.customer.district,
        customerId: orderId,
        itemName: data.items.map((i) => i.nameBn).join(", ").slice(0, 100),
      });
      tranId = orderId;
      gatewayUrl = payment.GatewayPageURL;
    } catch {
      throw new HttpError(
        400,
        "অনলাইন পেমেন্ট শুরু করা যায়নি। ক্যাশ অন ডেলিভারি বেছে নিন অথবা পরে আবার চেষ্টা করুন।",
      );
    }
  }

  let order;
  try {
    order = await Order.create({
      ...data,
      orderId,
      tranId,
      userId,
      paymentStatus: "pending",
    });
  } catch (err) {
    if (isDuplicateKeyError(err) && key) {
      const existing = await Order.findOne({ idempotencyKey: key });
      if (existing) {
        return res.status(201).json({
          order: existing.toJSON(),
          orderId: existing.orderId,
          gatewayUrl: null,
          paymentUrl: null,
        });
      }
    }
    throw err;
  }

  // reduce stock for each item (skip invalid product ids)
  const updateStocks = data.items
    .filter((item) => /^[0-9a-fA-F]{24}$/.test(item.productId))
    .map((item) =>
      Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: -item.quantity } },
      ),
    );
  await Promise.all(updateStocks);

  return res.status(201).json({
    order: order.toJSON(),
    orderId,
    gatewayUrl,
    paymentUrl: gatewayUrl ?? null,
  });
}

export async function listOrders(req: Request, res: Response) {
  const { status, q, page = "1", limit = "20" } = req.query as {
    status?: string;
    q?: string;
    page?: string;
    limit?: string;
  };

  const filter: Record<string, unknown> = {};
  if (status && status !== "all") {
    if (["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
      filter.orderStatus = status;
    } else {
      filter.paymentStatus = status;
    }
  }
  if (q) {
    const rx = new RegExp(q.trim(), "i");
    filter.$or = [{ orderId: rx }, { "customer.name": rx }, { "customer.phone": rx }];
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return res.json({
    orders,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  });
}

export async function myOrders(req: Request, res: Response) {
  const userId = (req as Request & { user?: { id: string } }).user?.id ?? "";
  const orders = await Order.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return res.json({ orders });
}

export async function getOrder(req: Request, res: Response) {
  const order = await Order.findOne({ orderId: req.params.id }).lean();
  if (!order) throw new HttpError(404, "অর্ডার পাওয়া যায়নি।");
  return res.json({ order });
}

export async function updateOrderStatus(req: Request, res: Response) {
  const data = statusSchema.parse(req.body);
  if (!data.orderStatus && !data.paymentStatus) {
    throw new HttpError(400, "কোনো পরিবর্তন পাওয়া যায়নি।");
  }

  const order = await Order.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!order) throw new HttpError(404, "অর্ডার পাওয়া যায়নি।");
  return res.json({ order: order.toJSON() });
}
