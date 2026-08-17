import { Schema, model, type InferSchemaType } from "mongoose";

const orderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true, trim: true },
    userId: { type: String, default: "" },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, trim: true, default: "" },
      address: { type: String, required: true, trim: true },
      district: { type: String, required: true, trim: true },
      deliveryMethod: {
        type: String,
        enum: ["standard", "express", "pickup"],
        default: "standard",
      },
    },
    items: [
      {
        productId: { type: String, required: true },
        slug: { type: String, default: "" },
        nameBn: { type: String, required: true },
        nameEn: { type: String, default: "" },
        weightLabel: { type: String, default: "" },
        image: { type: String, default: "" },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    total: { type: Number, required: true },
    coupon: { type: String, default: "" },
    note: { type: String, default: "" },
    paymentMethod: {
      type: String,
      enum: ["cod", "bkash", "nagad", "card"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    idempotencyKey: { type: String, trim: true },
  },
  { timestamps: true },
);

orderSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });

orderSchema.set("toJSON", {
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export type OrderDoc = InferSchemaType<typeof orderSchema>;

import mongoose from "mongoose";

export const Order = mongoose.models["Order"] || model("Order", orderSchema);
