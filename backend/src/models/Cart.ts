import { Schema, model, type InferSchemaType } from "mongoose";

const cartItemSchema = new Schema(
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
  { _id: false },
);

const cartSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items: { type: [cartItemSchema], default: [] },
    appliedCode: { type: String, default: "" },
  },
  { timestamps: true },
);

cartSchema.set("toJSON", {
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export type CartDoc = InferSchemaType<typeof cartSchema>;

export const Cart = model("Cart", cartSchema);
