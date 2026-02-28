import express from "express";
import { getNewsPageConfig, upsertNewsPageConfig } from "../controllers/newsPageConfigController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getNewsPageConfig);
router.put("/", protect, adminOnly, upsertNewsPageConfig);

export default router;
