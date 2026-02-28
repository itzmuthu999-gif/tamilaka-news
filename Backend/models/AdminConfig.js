import mongoose from "mongoose";

const AdminConfigSchema = new mongoose.Schema(
  {
    allPages: { type: [mongoose.Schema.Types.Mixed], default: [] },
    topNavHeaders1: { type: [String], default: [] },
    topNavHeaders2: { type: [String], default: [] },
    dropdownPosition1: { type: Number, default: 0 },
    dropdownPosition2: { type: Number, default: 0 },
    selectedDistrict1: { type: String, default: "" },
    selectedDistrict2: { type: String, default: "" }
  },
  { timestamps: true }
);

const AdminConfig = mongoose.model("AdminConfig", AdminConfigSchema);

export default AdminConfig;
