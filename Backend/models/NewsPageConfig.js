import mongoose from "mongoose";

const NewsPageSectionSchema = new mongoose.Schema(
  {
    header: {
      tam: { type: String, default: "" },
      eng: { type: String, default: "" }
    },
    deliveryType: { type: String, enum: ["shuffle", "custom"], default: "shuffle" },
    count: { type: Number, default: 5 },
    category: { type: String, default: "" },
    selectedIds: { type: [Number], default: [] },
    resolvedIds: { type: [Number], default: [] }
  },
  { _id: false }
);

const NewsPageConfigSchema = new mongoose.Schema(
  {
    side: { type: NewsPageSectionSchema, default: () => ({}) },
    slider: { type: NewsPageSectionSchema, default: () => ({}) }
  },
  { timestamps: true }
);

const NewsPageConfig = mongoose.model("NewsPageConfig", NewsPageConfigSchema);

export default NewsPageConfig;
