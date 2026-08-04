import { Router } from "express";
import multer from "multer";
import {
  dashboardStats,
  listContactMessages,
  markContactRead,
  sendContact,
  subscribe,
  uploadImage,
} from "../controllers/misc.controller";
import { requireAdmin, requireAuth } from "../middleware/auth";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// public
router.post("/newsletter", subscribe);
router.post("/contact", sendContact);

// admin
router.get("/contacts", requireAuth, requireAdmin, listContactMessages);
router.patch(
  "/contacts/:id/read",
  requireAuth,
  requireAdmin,
  markContactRead,
);
router.post("/upload", requireAuth, requireAdmin, upload.single("image"), uploadImage);
router.get("/stats", requireAuth, requireAdmin, dashboardStats);

export default router;
