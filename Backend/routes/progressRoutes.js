import express from "express";
import { getProgress } from "../controllers/progressController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getProgress);

export default router;
