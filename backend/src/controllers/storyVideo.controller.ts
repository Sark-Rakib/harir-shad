import type { Request, Response } from "express";
import { z } from "zod";
import { StoryVideo } from "../models/StoryVideo";
import { HttpError } from "../utils/HttpError";
import { deleteVideo, uploadVideo } from "../services/cloudinary";
import { env } from "../config/env";

const metadataSchema = z.object({
  title: z.string().trim().max(200, "শিরোনাম ২০০ অক্ষরের বেশি হতে পারবে না।").optional().default(""),
  description: z.string().trim().max(2000, "বিবরণ ২০০০ অক্ষরের বেশি হতে পারবে না।").optional().default(""),
});

const VIDEO_MIME_PREFIX = "video/";

function assertVideoFile(
  file: Express.Multer.File | undefined,
): asserts file is Express.Multer.File {
  if (!file) {
    throw new HttpError(400, "ভিডিও ফাইল নির্বাচন করুন।");
  }
  if (!file.mimetype.startsWith(VIDEO_MIME_PREFIX)) {
    throw new HttpError(400, "সঠিক ভিডিও ফাইল নির্বাচন করুন (MP4, WebM ইত্যাদি)।");
  }
  const maxBytes = env.STORY_VIDEO_MAX_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new HttpError(400, `ভিডিওর সাইজ ${env.STORY_VIDEO_MAX_MB}MB-এর বেশি হতে পারবে না।`);
  }
}

export async function getStoryVideo(_req: Request, res: Response) {
  const video = await StoryVideo.findOne({ active: true }).sort({ createdAt: -1 }).lean();
  return res.json({ video: video ?? null });
}

export async function upsertStoryVideo(req: Request, res: Response) {
  assertVideoFile(req.file);

  const metadata = metadataSchema.parse(req.body);
  const uploaded = await uploadVideo(req.file.buffer);

  // Replace: deactivate any other record and reuse the current active one so
  // only a single video stays live.
  const previous = await StoryVideo.findOne({ active: true }).sort({ createdAt: -1 });
  if (previous) {
    const oldPublicId = previous.publicId;
    await StoryVideo.updateMany(
      { _id: { $ne: previous._id }, active: true },
      { active: false },
    );
    previous.active = true;
    previous.videoUrl = uploaded.secureUrl;
    previous.publicId = uploaded.publicId;
    previous.title = metadata.title;
    previous.description = metadata.description;
    await previous.save();
    if (oldPublicId && oldPublicId !== uploaded.publicId) {
      await deleteVideo(oldPublicId);
    }
    return res.json({ video: previous.toJSON() });
  }

  const created = await StoryVideo.create({
    title: metadata.title,
    description: metadata.description,
    videoUrl: uploaded.secureUrl,
    publicId: uploaded.publicId,
    active: true,
  });
  return res.status(201).json({ video: created.toJSON() });
}

export async function updateStoryVideo(req: Request, res: Response) {
  const metadata = metadataSchema.parse(req.body);
  const video = await StoryVideo.findOne({ active: true }).sort({ createdAt: -1 });
  if (!video) throw new HttpError(404, "কোনো ভিডিও পাওয়া যায়নি।");

  video.title = metadata.title;
  video.description = metadata.description;
  await video.save();
  return res.json({ video: video.toJSON() });
}

export async function deleteStoryVideo(_req: Request, res: Response) {
  const video = await StoryVideo.findOne({ active: true }).sort({ createdAt: -1 });
  if (!video) throw new HttpError(404, "কোনো ভিডিও পাওয়া যায়নি।");

  const publicId = video.publicId;
  await StoryVideo.deleteOne({ _id: video._id });
  await deleteVideo(publicId);
  return res.json({ message: "ভিডিও মুছে ফেলা হয়েছে।" });
}
