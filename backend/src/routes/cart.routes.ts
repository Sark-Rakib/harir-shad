import { Router } from "express";
import {
  clearMyCart,
  getMyCart,
  upsertMyCart,
} from "../controllers/cart.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", getMyCart);
router.put("/", upsertMyCart);
router.delete("/", clearMyCart);

export default router;
