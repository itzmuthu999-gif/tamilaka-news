import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: String, default: "" },
    newsId: { type: mongoose.Schema.Types.Mixed, default: null },
    newsTitle: { type: String, default: "" },
    newsImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Progress", progressSchema);
