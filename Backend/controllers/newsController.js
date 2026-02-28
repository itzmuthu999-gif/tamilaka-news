import mongoose from "mongoose";
import News from "../models/News.js";
import Progress from "../models/Progress.js";

const isObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value) && String(new mongoose.Types.ObjectId(value)) === value;
};

const buildNewsQuery = (idParam) => {
  if (isObjectId(idParam)) {
    return { _id: idParam };
  }

  const asNumber = Number(idParam);
  return Number.isNaN(asNumber) ? { id: idParam } : { id: asNumber };
};

export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch news", error: error.message });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const news = await News.findOne(buildNewsQuery(req.params.id));
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch news", error: error.message });
  }
};

export const createNews = async (req, res) => {
  try {
    const created = await News.create(req.body);

    if (req.user) {
      try {
        const thumb = created?.data?.thumbnail;
        await Progress.create({
          userId: req.user._id,
          userName: req.user.name || "Unknown",
          action: "news_create",
          details: "Created news",
          newsId: created._id || created.id,
          newsTitle:
            created?.data?.headline ||
            created?.title ||
            created?.data?.oneLiner ||
            "News",
          newsImage: typeof thumb === "string" ? thumb : "",
        });
      } catch (logError) {
        console.error("Failed to log progress for news create:", logError.message);
      }
    }

    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: "Failed to create news", error: error.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const updated = await News.findOneAndUpdate(
      buildNewsQuery(req.params.id),
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "News not found" });
    }

    if (req.user) {
      try {
        const thumb = updated?.data?.thumbnail;
        await Progress.create({
          userId: req.user._id,
          userName: req.user.name || "Unknown",
          action: "news_update",
          details: "Updated news",
          newsId: updated._id || updated.id,
          newsTitle:
            updated?.data?.headline ||
            updated?.title ||
            updated?.data?.oneLiner ||
            "News",
          newsImage: typeof thumb === "string" ? thumb : "",
        });
      } catch (logError) {
        console.error("Failed to log progress for news update:", logError.message);
      }
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update news", error: error.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const deleted = await News.findOneAndDelete(buildNewsQuery(req.params.id));

    if (!deleted) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json({ message: "News deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete news", error: error.message });
  }
};
