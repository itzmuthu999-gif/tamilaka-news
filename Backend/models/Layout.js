import mongoose from "mongoose";

const LayoutSchema = new mongoose.Schema(
  {
    // Mirrors Frontend editpaper slice structure
    activePage: { type: String, default: "main" },
    activeLineId: { type: mongoose.Schema.Types.Mixed, default: null },
    presetContainers: { type: [mongoose.Schema.Types.Mixed], default: [] },
    pages: { type: [mongoose.Schema.Types.Mixed], default: [] }
  },
  {
    timestamps: true,
    minimize: false,
    strict: false
  }
);

const Layout = mongoose.model("Layout", LayoutSchema);

export default Layout;
