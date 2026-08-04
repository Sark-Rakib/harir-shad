import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { env } from "../config/env";
import { HttpError } from "../utils/HttpError";

const MIME_EXT: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/x-m4v": ".m4v",
  "video/quicktime": ".mov",
  "video/x-matroska": ".mkv",
  "video/ogg": ".ogv",
  "video/3gpp": ".3gp",
};

function ensureDir() {
  const dir = path.resolve(process.cwd(), env.UPLOAD_DIR);
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch {
    // ignore — checked again at write time
  }
  return dir;
}

function extFor(file: Express.Multer.File): string {
  const byMime = MIME_EXT[file.mimetype];
  if (byMime) return byMime;
  const fromName = path.extname(file.originalname).toLowerCase();
  return fromName && fromName.length <= 6 ? fromName : ".mp4";
}

export interface SavedVideo {
  url: string;
  fileName: string;
}

export function saveVideo(file: Express.Multer.File): SavedVideo {
  const dir = ensureDir();
  const fileName = `${randomUUID()}${extFor(file)}`;
  const filePath = path.join(dir, fileName);
  try {
    fs.writeFileSync(filePath, file.buffer);
  } catch {
    throw new HttpError(500, "ভিডিও সংরক্ষণ করা যায়নি।");
  }
  const base = env.SERVER_URL.replace(/\/+$/, "");
  return { url: `${base}/uploads/${fileName}`, fileName };
}

export function deleteVideo(fileName: string) {
  if (!fileName) return;
  const safe = path.basename(fileName);
  const filePath = path.resolve(process.cwd(), env.UPLOAD_DIR, safe);
  try {
    fs.rmSync(filePath, { force: true });
  } catch {
    // best-effort cleanup, ignore failures
  }
}