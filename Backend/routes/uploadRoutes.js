import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadVideo } from "../controllers/uploadController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.join(__dirname, "..", "uploads");
const videoDir = path.join(uploadsRoot, "videos");
const thumbDir = path.join(uploadsRoot, "thumbnails");

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDir(videoDir);
ensureDir(thumbDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "video") {
      return cb(null, videoDir);
    }
    if (file.fieldname === "thumbnail") {
      return cb(null, thumbDir);
    }
    return cb(new Error("Invalid upload field"), null);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const safeExt = ext || (file.mimetype?.includes("image") ? ".jpg" : ".mp4");
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "video") {
    if (file.mimetype?.startsWith("video/")) return cb(null, true);
    return cb(new Error("Only video files are allowed for video."));
  }

  if (file.fieldname === "thumbnail") {
    if (file.mimetype?.startsWith("image/")) return cb(null, true);
    return cb(new Error("Only image files are allowed for thumbnail."));
  }

  return cb(new Error("Invalid upload field"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});

router.post(
  "/video",
  protect,
  adminOnly,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadVideo
);

export default router;
