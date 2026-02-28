import mongoose from "mongoose";

const NewsDataSchema = new mongoose.Schema(
  {
    headline: { type: String, default: "" },
    oneLiner: { type: String, default: "" },
    thumbnail: { type: mongoose.Schema.Types.Mixed, default: null },
    zonal: { type: [String], default: [] },
    author: { type: String, default: "" },
    images: { type: [mongoose.Schema.Types.Mixed], default: [] }
  },
  { _id: false }
);

const CommentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, default: "" },
    text: { type: String, default: "" },
    timestamp: { type: String, default: "" }
  },
  { _id: false }
);

const NewsSchema = new mongoose.Schema(
  {
    id: { type: Number, default: () => Date.now(), index: true },
    time: { type: String, default: () => new Date().toISOString() },
    data: { type: NewsDataSchema, default: () => ({}) },
    dataEn: { type: NewsDataSchema, default: null },
    fullContent: { type: [mongoose.Schema.Types.Mixed], default: [] },
    containerOverlays: { type: [mongoose.Schema.Types.Mixed], default: [] },
    containerSettings: {
      height: { type: Number, default: 0 },
      padding: { type: Number, default: 0 },
      gap: { type: Number, default: 0 },
      gridColumns: { type: Number, default: 0 }
    },
    layout: { type: Number, default: 1 },
    hiddenElements: {
      thumbnail: { type: Boolean, default: false },
      author: { type: Boolean, default: false },
      zonar: { type: Boolean, default: false }
    },
    comments: { type: [CommentSchema], default: [] },
    containers: { type: [mongoose.Schema.Types.Mixed], default: [] }
  },
  { timestamps: true }
);

const News = mongoose.model("News", NewsSchema);

export default News;
