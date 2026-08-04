"use client";

import { Loader2, PlayCircle, Save, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import {
  PageHeader,
  AdminCard,
} from "@/components/admin/PageHeader";
import {
  AdminEmpty,
  AdminError,
  AdminLoading,
} from "@/components/admin/AdminState";
import { useAdminFetch } from "@/components/admin/useAdminFetch";
import { Button } from "@/components/ui/Button";
import { api, ApiError } from "@/lib/api";
import type { StoryVideo } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";

export default function AdminStoryVideoPage() {
  const { token, user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<null | "upload" | "save" | "delete">(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actionError, setActionError] = useState("");
  const { data, loading, error, reload } = useAdminFetch<{
    video: StoryVideo | null;
  }>("/api/story-video");

  const video = data?.video ?? null;
  const [dirty, setDirty] = useState(false);

  const handleSelectFile = async (file: File | undefined) => {
    if (!file || !user) return;
    setActionError("");
    setBusy("upload");
    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", title);
      formData.append("description", description);
      const res = await api.postFormAuth<{ video: StoryVideo }>(
        "/api/story-video",
        formData,
        token,
      );
      setTitle(res.video.title);
      setDescription(res.video.description);
      setDirty(false);
      reload();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "ভিডিও আপলোড করা যায়নি।",
      );
    } finally {
      setBusy(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSaveMetadata = async () => {
    if (!user) return;
    setActionError("");
    setBusy("save");
    try {
      const res = await api.putAuth<{ video: StoryVideo }>(
        "/api/story-video",
        { title, description },
        token,
      );
      setTitle(res.video.title);
      setDescription(res.video.description);
      setDirty(false);
      reload();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "তথ্য সংরক্ষণ করা যায়নি।",
      );
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!window.confirm("ভিডিওটি মুছে ফেলবেন? এটি আর ফেরানো যাবে না।")) return;
    setActionError("");
    setBusy("delete");
    try {
      await api.deleteAuth<{ message: string }>("/api/story-video", token);
      setTitle("");
      setDescription("");
      setDirty(false);
      reload();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "ভিডিও মুছে ফেলা যায়নি।",
      );
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <AdminLoading />;
  if (error || !data)
    return (
      <AdminError message={error || "ডেটা পাওয়া যায়নি।"} onRetry={reload} />
    );

  return (
    <>
      <PageHeader
        title="আমাদের গল্প ভিডিও"
        subtitle="আমাদের গল্প পেজে প্রদর্শিত ভিডিওটি অ্যাড, রিপ্লেস বা ডিলিট করুন।"
      />

      {actionError && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {actionError}
        </div>
      )}

      {video ? (
        <AdminCard className="mb-5">
          <p className="mb-3 text-sm font-semibold text-brown-700 dark:text-cream">
            বর্তমান ভিডিও
          </p>
          <div className="overflow-hidden rounded-2xl bg-black">
            <video
              controls
              playsInline
              preload="metadata"
              src={video.videoUrl}
              className="aspect-video h-auto w-full"
            />
          </div>
        </AdminCard>
      ) : (
        <AdminCard className="mb-5">
          <AdminEmpty
            title="এখনো কোনো ভিডিও যোগ করা হয়নি"
            subtitle="নতুন ভিডিও আপলোড করে আমাদের গল্প পেজে দেখাতে শুরু করুন।"
          />
        </AdminCard>
      )}

      <AdminCard>
        <div className="space-y-5">
          <div>
            <label
              htmlFor="story-video-file"
              className="mb-2 block text-sm font-semibold text-brown-700 dark:text-cream"
            >
              ভিডিও ফাইল {!video && <span className="text-red-500">*</span>}
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileRef}
                id="story-video-file"
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-matroska,video/*"
                onChange={(e) => handleSelectFile(e.target.files?.[0])}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={busy !== null}
                className="inline-flex items-center gap-2 rounded-full border border-brown-200 bg-white px-4 py-2.5 text-sm font-medium text-brown-700 transition-colors hover:border-terracotta-500 hover:text-terracotta-600 disabled:opacity-50 dark:border-brown-700 dark:bg-brown-950/40 dark:text-cream"
              >
                {busy === "upload" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : video ? (
                  <UploadCloud size={16} />
                ) : (
                  <PlayCircle size={16} />
                )}
                {busy === "upload"
                  ? "আপলোড হচ্ছে..."
                  : video
                    ? "নতুন ভিডিও দিয়ে বদলান"
                    : "ভিডিও আপলোড করুন"}
              </button>
              <span className="text-xs text-muted">
                মাত্র একটি ভিডিও সর্বদা সক্রিয় থাকে — নতুন আপলোড পূর্বেরটি
                প্রতিস্থাপন করবে।
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="story-video-title"
              className="mb-2 block text-sm font-semibold text-brown-700 dark:text-cream"
            >
              শিরোনাম (ঐচ্ছিক)
            </label>
            <input
              id="story-video-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setDirty(true);
              }}
              placeholder="যেমন: ঘরে তৈরি দই বানানোর প্রক্রিয়া"
              maxLength={200}
              className="h-11 w-full rounded-2xl border border-brown-200 bg-white px-4 text-sm text-ink-900 outline-none transition-all focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/10 dark:border-brown-700 dark:bg-brown-950/40 dark:text-cream"
            />
          </div>

          <div>
            <label
              htmlFor="story-video-desc"
              className="mb-2 block text-sm font-semibold text-brown-700 dark:text-cream"
            >
              ছোট বিবরণ (ঐচ্ছিক)
            </label>
            <textarea
              id="story-video-desc"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setDirty(true);
              }}
              placeholder="ভিডিও সম্পর্কে কয়েক লাইন লিখুন…"
              rows={3}
              maxLength={2000}
              className="w-full rounded-2xl border border-brown-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-all focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/10 dark:border-brown-700 dark:bg-brown-950/40 dark:text-cream"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-brown-100 pt-5 dark:border-brown-800">
            <Button
              type="button"
              size="sm"
              onClick={handleSaveMetadata}
              disabled={busy !== null || (!dirty && !video)}
            >
              {busy === "save" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              তথ্য সংরক্ষণ করুন
            </Button>

            {video && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={busy !== null}
                className="border-red-200 text-red-600 hover:border-red-500 hover:bg-red-50 dark:border-red-900/50 dark:text-red-300"
              >
                {busy === "delete" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                ভিডিও মুছে ফেলুন
              </Button>
            )}
          </div>
        </div>
      </AdminCard>
    </>
  );
}