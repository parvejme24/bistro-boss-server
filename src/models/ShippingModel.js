const mongoose = require("mongoose");

const shippingZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  countries: [{
    type: String,
    required: true,
  }],
  states: [{
    type: String,
    required: false,
  }],
  cities: [{
    type: String,
    required: false,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const shippingMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShippingZone",
    required: true,
  },
  pricingType: {
    type: String,
    enum: ["fixed", "percentage", "weight_based", "free_shipping_threshold"],
    default: "fixed",
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  percentageRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  freeShippingThreshold: {
    type: Number,
    min: 0,
    default: 0,
  },
  weightRate: {
    type: Number,
    min: 0,
    default: 0,
  },
  estimatedDays: {
    min: {
      type: Number,
      required: true,
      min: 1,
    },
    max: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  priority: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const shippingZone = mongoose.model("ShippingZone", shippingZoneSchema);
const shippingMethod = mongoose.model("ShippingMethod", shippingMethodSchema);

module.exports = {
  ShippingZone: shippingZone,
  ShippingMethod: shippingMethod,
}; 