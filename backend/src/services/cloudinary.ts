import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";
import { HttpError } from "../utils/HttpError";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export function isCloudinaryConfigured() {
  return (
    env.CLOUDINARY_CLOUD_NAME.length > 0 &&
    env.CLOUDINARY_API_KEY.length > 0 &&
    env.CLOUDINARY_API_SECRET.length > 0
  );
}

export interface CloudinaryVideoResult {
  secureUrl: string;
  publicId: string;
}

export function uploadVideo(buffer: Buffer): Promise<CloudinaryVideoResult> {
  if (!isCloudinaryConfigured()) {
    return Promise.reject(
      new HttpError(500, "Cloudinary সেটআপ করা হয়নি। API key যাচাই করুন।"),
    );
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "harir-shad/story",
        eager: [{ streaming_profile: "hd" }],
        eager_async: true,
      },
      (error, result) => {
        if (error) {
          reject(new HttpError(502, "ভিডিও আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"));
          return;
        }
        if (!result?.secure_url || !result?.public_id) {
          reject(new HttpError(502, "ভিডিও আপলোড ব্যর্থ হয়েছে।"));
          return;
        }
        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        });
      },
    );
    stream.end(buffer);
  });
}

export async function deleteVideo(publicId: string) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch {
    // best-effort cleanup — ignore failures so the DB record can still be removed
  }
}