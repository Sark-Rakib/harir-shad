import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function notFound(_req: Request, res: Response) {
  return res.status(404).json({ message: "রিসোর্স পাওয়া যায়নি।" });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    const issues = err.issues.length > 0 ? err.issues : (err as { errors?: { message: string }[] }).errors ?? [];
    const first = issues[0];
    return res.status(400).json({
      message: first?.message ?? "ডেটা সঠিক নয়।",
      fields: err.flatten().fieldErrors,
    });
  }

  const status = (err as { status?: number }).status ?? 500;
  const message =
    (err as { message?: string }).message || "সার্ভারে সমস্যা হয়েছে।";

  if (status >= 500) {
    console.error("❌", err);
  }

  return res.status(status).json({ message });
}
