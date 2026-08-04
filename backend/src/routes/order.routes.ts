import { Router } from "express";
import {
  createOrder,
  getOrder,
  listOrders,
  myOrders,
  updateOrderStatus,
} from "../controllers/order.controller";
import {
  optionalAuth,
  requireAdmin,
  requireAuth,
} from "../middleware/auth";

const router = Router();

// public (optionally authenticated — captures userId for logged-in customers)
router.post("/", optionalAuth, createOrder);

// user dashboard
router.get("/mine", requireAuth, myOrders);

// admin
router.get("/", requireAuth, requireAdmin, listOrders);
router.get("/:id", requireAuth, requireAdmin, getOrder);
router.put("/:id", requireAuth, requireAdmin, updateOrderStatus);

export default router;
