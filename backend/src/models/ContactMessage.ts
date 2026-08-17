import { Schema, model, type InferSchemaType } from "mongoose";

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true },
    subject: { type: String, default: "" },
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

contactMessageSchema.set("toJSON", {
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export type ContactMessageDoc = InferSchemaType<typeof contactMessageSchema>;

import mongoose from "mongoose";

export const ContactMessage = mongoose.models["ContactMessage"] || model("ContactMessage", contactMessageSchema);
