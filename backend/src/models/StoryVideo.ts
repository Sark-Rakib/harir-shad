import { Schema, model, type InferSchemaType } from "mongoose";

const storyVideoSchema = new Schema(
  {
    title: { type: String, default: "", trim: true, maxlength: 200 },
    description: { type: String, default: "", trim: true, maxlength: 2000 },
    videoUrl: { type: String, required: true, trim: true },
    publicId: { type: String, default: "", trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

storyVideoSchema.set("toJSON", {
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export type StoryVideoDoc = InferSchemaType<typeof storyVideoSchema>;

export const StoryVideo = model("StoryVideo", storyVideoSchema);