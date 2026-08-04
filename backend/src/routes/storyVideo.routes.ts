import { Router } from "express";
import multer from "multer";
import {
  deleteStoryVideo,
  getStoryVideo,
  updateStoryVideo,
  upsertStoryVideo,
} from "../controllers/storyVideo.controller";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { env } from "../config/env";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.STORY_VIDEO_MAX_MB * 1024 * 1024 },
});

// public
router.get("/", getStoryVideo);

// admin
router.post(
  "/",
  requireAuth,
  requireAdmin,
  upload.single("video"),
  upsertStoryVideo,
);
router.put("/", requireAuth, requireAdmin, updateStoryVideo);
router.delete("/", requireAuth, requireAdmin, deleteStoryVideo);

export default router;
