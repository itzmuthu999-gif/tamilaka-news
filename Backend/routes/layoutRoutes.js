import express from "express";
import {
  getLayout,
  getLayoutById,
  createLayout,
  upsertLayout,
  updateLayout,
  deleteLayout
} from "../controllers/layoutController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getLayout);
router.post("/", protect, adminOnly, createLayout);
router.put("/", protect, adminOnly, upsertLayout);
router.get("/:id", getLayoutById);
router.put("/:id", protect, adminOnly, updateLayout);
router.delete("/:id", protect, adminOnly, deleteLayout);

export default router;
