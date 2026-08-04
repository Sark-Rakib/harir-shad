import type { Request, Response } from "express";
import { z } from "zod";
import { Subscriber } from "../models/Subscriber";
import { ContactMessage } from "../models/ContactMessage";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { User } from "../models/User";
import { HttpError } from "../utils/HttpError";
import { uploadToImgbb } from "../services/imagebb";

const subscribeSchema = z.object({
  email: z.string().email("সঠিক ইমেইল দিন।"),
});

const contactSchema = z.object({
  name: z.string().min(2, "নাম দিন।"),
  email: z.string().email("সঠিক ইমেইল দিন।"),
  phone: z.string().optional().default(""),
  subject: z.string().optional().default(""),
  message: z.string().min(5, "মেসেজ লিখুন।"),
});

export async function subscribe(req: Request, res: Response) {
  const { email } = subscribeSchema.parse(req.body);
  const exists = await Subscriber.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.json({ message: "আপনি আগে থেকেই সাবস্ক্রাইবড আছেন।" });
  }
  await Subscriber.create({ email: email.toLowerCase() });
  return res.status(201).json({ message: "সাবস্ক্রিপশন সফল! ধন্যবাদ।" });
}

export async function sendContact(req: Request, res: Response) {
  const data = contactSchema.parse(req.body);
  await ContactMessage.create(data);
  return res
    .status(201)
    .json({ message: "মেসেজ পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করবো।" });
}

export async function listContactMessages(_req: Request, res: Response) {
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
  return res.json({ messages });
}

export async function markContactRead(req: Request, res: Response) {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true },
  );
  if (!message) throw new HttpError(404, "মেসেজ পাওয়া যায়নি।");
  return res.json({ message: message.toJSON() });
}

export async function uploadImage(req: Request, res: Response) {
  const file = req.file;
  if (!file) throw new HttpError(400, "ছবি ফাইল নির্বাচন করুন।");
  if (file.size > 5 * 1024 * 1024) {
    throw new HttpError(400, "ছবির সাইজ ৫MB-এর বেশি হতে পারবে না।");
  }

  const result = await uploadToImgbb(file.buffer);
  return res.json(result);
}

export async function dashboardStats(_req: Request, res: Response) {
  const [totalProducts, activeProducts, totalOrders, totalUsers, revenue, pendingOrders] =
    await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ active: true }),
      Order.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: { $in: ["paid", "pending"] }, orderStatus: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.countDocuments({ orderStatus: "pending" }),
    ]);

  const lowStock = await Product.countDocuments({ stock: { $lt: 20 } });

  return res.json({
    stats: {
      totalProducts,
      activeProducts,
      totalOrders,
      totalUsers,
      pendingOrders,
      lowStock,
      revenue: revenue[0]?.total ?? 0,
    },
  });
}
