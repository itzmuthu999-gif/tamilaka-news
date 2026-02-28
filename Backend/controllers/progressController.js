import Progress from "../models/Progress.js";

export const getProgress = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 50), 200);
    const items = await Progress.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch progress", error: error.message });
  }
};
