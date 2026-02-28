import NewsPageConfig from "../models/NewsPageConfig.js";

const defaultConfig = () => ({
  side: {
    header: { tam: "மேலும் செய்திகள்", eng: "More News" },
    deliveryType: "shuffle",
    count: 5,
    category: "",
    selectedIds: [],
    resolvedIds: []
  },
  slider: {
    header: { tam: "முக்கிய செய்திகள்", eng: "Top News" },
    deliveryType: "shuffle",
    count: 6,
    category: "",
    selectedIds: [],
    resolvedIds: []
  }
});

export const getNewsPageConfig = async (req, res) => {
  try {
    let config = await NewsPageConfig.findOne();
    if (!config) {
      config = await NewsPageConfig.create(defaultConfig());
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch news page config", error: error.message });
  }
};

export const upsertNewsPageConfig = async (req, res) => {
  try {
    const payload = req.body || {};
    const updated = await NewsPageConfig.findOneAndUpdate(
      {},
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update news page config", error: error.message });
  }
};
