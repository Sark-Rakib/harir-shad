"use client";

import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const { token, user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File | undefined) => {
    if (!file || !user) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.postFormAuth<{ url: string; displayUrl: string }>(
        "/api/upload",
        formData,
        token,
      );
      onChange(res.url || res.displayUrl);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "ছবি আপলোড করা যায়নি।",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-brown-300 bg-cream dark:border-brown-700 dark:bg-brown-950/40">
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Product preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-brown-950/60 text-white backdrop-blur transition-colors hover:bg-red-600"
                aria-label="Remove image"
              >
                <Trash2 size={14} />
              </button>
            </>
          ) : (
            <UploadCloud size={26} className="text-brown-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-full border border-brown-200 bg-white px-4 py-2.5 text-sm font-medium text-brown-700 transition-colors hover:border-terracotta-500 hover:text-terracotta-600 disabled:opacity-50 dark:border-brown-700 dark:bg-brown-950/40 dark:text-cream"
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                আপলোড হচ্ছে...
              </>
            ) : (
              <>
                <ImagePlus size={16} />
                ছবি বাছাই করুন
              </>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <p className="mt-2 text-xs text-muted">
            JPG/PNG/WebP, সর্বোচ্চ ৫MB — ImageBB-তে আপলোড হবে।
          </p>
          {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
        </div>
      </div>

      {value && (
        <p className="mt-2 truncate text-xs text-muted" title={value}>
          {value}
        </p>
      )}
    </div>
  );
}
