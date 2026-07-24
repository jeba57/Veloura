import Service from "../models/Service.js";

export const getServices = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (featured) filter.isFeatured = featured === "true";

    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json({ count: services.length, services });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services", error: error.message });
  }
};

export const getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true });
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ service });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch service", error: error.message });
  }
};

// Admin only
export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ service });
  } catch (error) {
    res.status(400).json({ message: "Failed to create service", error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ service });
  } catch (error) {
    res.status(400).json({ message: "Failed to update service", error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service", error: error.message });
  }
};
