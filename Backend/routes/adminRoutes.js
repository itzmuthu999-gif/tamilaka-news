import express from "express";
import {
  getAdminConfig,
  getAdminConfigById,
  createAdminConfig,
  upsertAdminConfig,
  updateAdminConfig,
  deleteAdminConfig
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAdminConfig);
router.post("/", protect, adminOnly, createAdminConfig);
router.put("/", protect, adminOnly, upsertAdminConfig);
router.get("/:id", getAdminConfigById);
router.put("/:id", protect, adminOnly, updateAdminConfig);
router.delete("/:id", protect, adminOnly, deleteAdminConfig);

export default router;
