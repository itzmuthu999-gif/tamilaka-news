import AdminConfig from "../models/AdminConfig.js";

export const getAdminConfig = async (req, res) => {
  try {
    const config = await AdminConfig.findOne().sort({ createdAt: -1 });
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin config", error: error.message });
  }
};

export const getAdminConfigById = async (req, res) => {
  try {
    const config = await AdminConfig.findById(req.params.id);
    if (!config) {
      return res.status(404).json({ message: "Admin config not found" });
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin config", error: error.message });
  }
};

export const createAdminConfig = async (req, res) => {
  try {
    const created = await AdminConfig.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: "Failed to create admin config", error: error.message });
  }
};

export const upsertAdminConfig = async (req, res) => {
  try {
    const updated = await AdminConfig.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to save admin config", error: error.message });
  }
};

export const updateAdminConfig = async (req, res) => {
  try {
    const updated = await AdminConfig.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Admin config not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update admin config", error: error.message });
  }
};

export const deleteAdminConfig = async (req, res) => {
  try {
    const deleted = await AdminConfig.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Admin config not found" });
    }
    res.json({ message: "Admin config deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete admin config", error: error.message });
  }
};
