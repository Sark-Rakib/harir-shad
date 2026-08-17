import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, default: "", trim: true },
    passwordHash: { type: String, select: false },
    image: { type: String, default: "" },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    status: {
      type: String,
      enum: ["active", "blocked", "suspended"],
      default: "active",
    },
    active: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    provider: { type: String, default: "credentials" },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  },
});

export type UserDoc = InferSchemaType<typeof userSchema>;

import mongoose from "mongoose";

export const User = mongoose.models["User"] || model("User", userSchema);
