import { Router } from "express";
import {
  createProduct,
  getProductById,
  getProductBySlug,
  listProducts,
  removeProduct,
  updateProduct,
} from "../controllers/product.controller";
import { requireAdmin, requireAuth } from "../middleware/auth";

const router = Router();

// public
router.get("/", listProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/id/:id", requireAuth, requireAdmin, getProductById);

// admin
router.post("/", requireAuth, requireAdmin, createProduct);
router.put("/:id", requireAuth, requireAdmin, updateProduct);
router.delete("/:id", requireAuth, requireAdmin, removeProduct);

export default router;
