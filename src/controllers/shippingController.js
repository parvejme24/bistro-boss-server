const { ShippingZone, ShippingMethod } = require("../models/ShippingModel");

// Create shipping zone (admin only)
const createShippingZone = async (req, res) => {
  try {
    const { name, countries, states, cities } = req.body;

    // Check if zone with same name exists
    const existingZone = await ShippingZone.findOne({ name });
    if (existingZone) {
      return res.status(400).json({ message: "Shipping zone with this name already exists" });
    }

    const shippingZone = new ShippingZone({
      name,
      countries,
      states: states || [],
      cities: cities || [],
    });

    await shippingZone.save();

    res.status(201).json({
      message: "Shipping zone created successfully",
      shippingZone,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create shipping zone", error: error.message });
  }
};

// Get all shipping zones (public)
const getAllShippingZones = async (req, res) => {
  try {
    const zones = await ShippingZone.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({
      message: "Shipping zones retrieved successfully",
      zones,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get shipping zones", error: error.message });
  }
};

// Create shipping method (admin only)
const createShippingMethod = async (req, res) => {
  try {
    const {
      name,
      description,
      zone,
      pricingType,
      basePrice,
      percentageRate,
      freeShippingThreshold,
      weightRate,
      estimatedDays,
      priority,
    } = req.body;

    // Check if zone exists
    const zoneExists = await ShippingZone.findById(zone);
    if (!zoneExists) {
      return res.status(404).json({ message: "Shipping zone not found" });
    }

    // Check if method with same name exists in this zone
    const existingMethod = await ShippingMethod.findOne({ name, zone });
    if (existingMethod) {
      return res.status(400).json({ message: "Shipping method with this name already exists in this zone" });
    }

    const shippingMethod = new ShippingMethod({
      name,
      description,
      zone,
      pricingType,
      basePrice,
      percentageRate: percentageRate || 0,
      freeShippingThreshold: freeShippingThreshold || 0,
      weightRate: weightRate || 0,
      estimatedDays,
      priority: priority || 0,
    });

    await shippingMethod.save();

    // Populate zone details
    await shippingMethod.populate('zone', 'name countries states cities');

    res.status(201).json({
      message: "Shipping method created successfully",
      shippingMethod,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create shipping method", error: error.message });
  }
};

// Get shipping methods by location (public)
const getShippingMethodsByLocation = async (req, res) => {
  try {
    const { country, state, city } = req.query;

    if (!country) {
      return res.status(400).json({ message: "Country is required" });
    }

    // Find zones that match the location
    const matchingZones = await ShippingZone.find({
      isActive: true,
      countries: { $in: [country] },
      $or: [
        { states: { $size: 0 } }, // Zones with no state restrictions
        { states: { $in: [state] } }, // Zones that include this state
      ],
      $or: [
        { cities: { $size: 0 } }, // Zones with no city restrictions
        { cities: { $in: [city] } }, // Zones that include this city
      ],
    });

    const zoneIds = matchingZones.map(zone => zone._id);

    // Get shipping methods for matching zones
    const shippingMethods = await ShippingMethod.find({
      isActive: true,
      zone: { $in: zoneIds },
    })
      .populate('zone', 'name countries states cities')
      .sort({ priority: 1, basePrice: 1 });

    res.status(200).json({
      message: "Shipping methods retrieved successfully",
      shippingMethods,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get shipping methods", error: error.message });
  }
};

// Calculate shipping charge (public)
const calculateShippingCharge = async (req, res) => {
  try {
    const { methodId, subtotal, weight = 0 } = req.body;

    if (!methodId) {
      return res.status(400).json({ message: "Shipping method ID is required" });
    }

    const shippingMethod = await ShippingMethod.findById(methodId).populate('zone');
    if (!shippingMethod) {
      return res.status(404).json({ message: "Shipping method not found" });
    }

    if (!shippingMethod.isActive) {
      return res.status(400).json({ message: "Shipping method is not available" });
    }

    let shippingCharge = 0;

    switch (shippingMethod.pricingType) {
      case "fixed":
        shippingCharge = shippingMethod.basePrice;
        break;

      case "percentage":
        shippingCharge = (subtotal * shippingMethod.percentageRate) / 100;
        break;

      case "weight_based":
        shippingCharge = shippingMethod.basePrice + (weight * shippingMethod.weightRate);
        break;

      case "free_shipping_threshold":
        if (subtotal >= shippingMethod.freeShippingThreshold) {
          shippingCharge = 0;
        } else {
          shippingCharge = shippingMethod.basePrice;
        }
        break;

      default:
        shippingCharge = shippingMethod.basePrice;
    }

    res.status(200).json({
      message: "Shipping charge calculated successfully",
      shippingCharge: Math.round(shippingCharge * 100) / 100, // Round to 2 decimal places
      shippingMethod: {
        _id: shippingMethod._id,
        name: shippingMethod.name,
        description: shippingMethod.description,
        estimatedDays: shippingMethod.estimatedDays,
        zone: shippingMethod.zone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to calculate shipping charge", error: error.message });
  }
};

// Get all shipping methods (admin only)
const getAllShippingMethods = async (req, res) => {
  try {
    const methods = await ShippingMethod.find()
      .populate('zone', 'name countries states cities')
      .sort({ priority: 1, name: 1 });

    res.status(200).json({
      message: "Shipping methods retrieved successfully",
      methods,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get shipping methods", error: error.message });
  }
};

// Update shipping method (admin only)
const updateShippingMethod = async (req, res) => {
  try {
    const { methodId } = req.params;
    const updateData = req.body;

    const shippingMethod = await ShippingMethod.findByIdAndUpdate(
      methodId,
      updateData,
      { new: true, runValidators: true }
    ).populate('zone');

    if (!shippingMethod) {
      return res.status(404).json({ message: "Shipping method not found" });
    }

    res.status(200).json({
      message: "Shipping method updated successfully",
      shippingMethod,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update shipping method", error: error.message });
  }
};

// Delete shipping method (admin only)
const deleteShippingMethod = async (req, res) => {
  try {
    const { methodId } = req.params;

    const shippingMethod = await ShippingMethod.findByIdAndDelete(methodId);
    if (!shippingMethod) {
      return res.status(404).json({ message: "Shipping method not found" });
    }

    res.status(200).json({
      message: "Shipping method deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete shipping method", error: error.message });
  }
};

module.exports = {
  createShippingZone,
  getAllShippingZones,
  createShippingMethod,
  getShippingMethodsByLocation,
  calculateShippingCharge,
  getAllShippingMethods,
  updateShippingMethod,
  deleteShippingMethod,
}; 