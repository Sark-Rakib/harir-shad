import { Schema, model, type InferSchemaType } from "mongoose";

const nutritionSchema = new Schema(
  {
    serving: { type: String, default: "100g" },
    energyKcal: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    calciumMg: { type: Number, default: 0 },
  },
  { _id: false },
);

const deliverySchema = new Schema(
  {
    insideDhaka: { type: Number, default: 80 },
    outsideDhaka: { type: Number, default: 120 },
    leadTimeBn: { type: String, default: "" },
    leadTimeEn: { type: String, default: "" },
    freeOver: { type: Number, default: 1000 },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    nameBn: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    taglineBn: { type: String, default: "" },
    taglineEn: { type: String, default: "" },
    descriptionBn: { type: String, default: "" },
    descriptionEn: { type: String, default: "" },
    weight: { type: Number, required: true },
    weightLabel: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: 0 },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    image: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    ingredientsBn: { type: [String], default: [] },
    ingredientsEn: { type: [String], default: [] },
    nutrition: { type: nutritionSchema, default: () => ({}) },
    delivery: { type: deliverySchema, default: () => ({}) },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.set("toJSON", {
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export type ProductDoc = InferSchemaType<typeof productSchema>;

import mongoose from "mongoose";

export const Product = mongoose.models["Product"] || model("Product", productSchema);
