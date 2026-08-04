import { env } from "../config/env";
import { HttpError } from "../utils/HttpError";

export interface ImgbbResult {
  url: string;
  displayUrl: string;
  deleteUrl: string;
}

export async function uploadToImgbb(
  buffer: Buffer,
  label = "ফাইল",
): Promise<ImgbbResult> {
  if (!env.IMGBB_API_KEY) {
    throw new HttpError(500, "ImageBB API key সেট করা নেই।");
  }

  const form = new FormData();
  form.append("image", buffer.toString("base64"));

  let res: Response;
  try {
    res = await fetch(`https://api.imgbb.com/1/upload?key=${env.IMGBB_API_KEY}`, {
      method: "POST",
      body: form,
    });
  } catch {
    throw new HttpError(502, "ImageBB-তে সংযোগ করা যায়নি।");
  }

  const json = (await res.json().catch(() => null)) as {
    data?: { url?: string; display_url?: string; delete_url?: string };
    error?: { message?: string };
  } | null;

  if (!res.ok || !json?.data?.url) {
    throw new HttpError(
      502,
      json?.error?.message ?? `${label} আপলোড ব্যর্থ হয়েছে।`,
    );
  }

  return {
    url: json.data.url,
    displayUrl: json.data.display_url ?? json.data.url,
    deleteUrl: json.data.delete_url ?? "",
  };
}
