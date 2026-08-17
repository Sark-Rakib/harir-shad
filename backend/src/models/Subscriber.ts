import { Schema, model, type InferSchemaType } from "mongoose";

const subscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true },
);

export type SubscriberDoc = InferSchemaType<typeof subscriberSchema>;

import mongoose from "mongoose";

export const Subscriber = mongoose.models["Subscriber"] || model("Subscriber", subscriberSchema);
