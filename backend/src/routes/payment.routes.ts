import { Router, type Request, type Response } from "express";
import { env } from "../config/env";
import { Order } from "../models/Order";

const router = Router();

function redirect(res: Response, path: string) {
  return res.redirect(`${env.FRONTEND_URL}${path}`);
}

async function findOrderByTranId(tranId: string) {
  return Order.findOne({ orderId: tranId });
}

// success — redirected by the gateway after successful payment
router.get("/success", async (req: Request, res: Response) => {
  const { tran_id: tranId } = req.query as { tran_id?: string };
  if (!tranId) return redirect(res, "/checkout/complete?status=error");

  const order = await findOrderByTranId(tranId);
  if (!order) return redirect(res, "/checkout/complete?status=error");

  await Order.updateOne(
    { orderId: tranId },
    { paymentStatus: "paid", tranId },
  );

  return redirect(res, `/checkout/complete?orderId=${tranId}&status=paid`);
});

// fail — payment failed
router.get("/fail", async (req: Request, res: Response) => {
  const { tran_id: tranId } = req.query as { tran_id?: string };
  if (tranId) {
    await Order.updateOne({ orderId: tranId }, { paymentStatus: "failed" });
  }
  return redirect(res, `/checkout/complete?orderId=${tranId ?? ""}&status=failed`);
});

// cancel — customer cancelled
router.get("/cancel", async (req: Request, res: Response) => {
  const { tran_id: tranId } = req.query as { tran_id?: string };
  if (tranId) {
    await Order.updateOne(
      { orderId: tranId },
      { paymentStatus: "failed", orderStatus: "cancelled" },
    );
  }
  return redirect(res, `/checkout/complete?orderId=${tranId ?? ""}&status=cancelled`);
});

// ipn — server-to-server notification from the gateway
router.post("/ipn", async (req: Request, res: Response) => {
  const { tran_id: tranId, status, amount } = req.body as {
    tran_id?: string;
    status?: string;
    amount?: string;
  };

  void amount;

  if (!tranId) return res.json({ status: "no_tran_id" });

  const paid = status === "VALID" || status === "VALIDATED" || status === "VALID";
  await Order.updateOne(
    { orderId: tranId },
    {
      paymentStatus: paid ? "paid" : "failed",
      tranId,
    },
  );

  return res.json({ status: "ok" });
});

export default router;
