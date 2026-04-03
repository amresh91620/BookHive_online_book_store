const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    // Tax Settings
    taxRate: {
      type: Number,
      default: 0.18, // 18% GST
      min: 0,
      max: 1,
    },
    taxName: {
      type: String,
      default: "GST",
    },
    taxEnabled: {
      type: Boolean,
      default: true,
    },

    // Delivery Settings
    deliveryCharge: {
      type: Number,
      default: 50,
      min: 0,
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 500,
      min: 0,
    },
    deliveryEnabled: {
      type: Boolean,
      default: true,
    },

    // Payment Settings
    codEnabled: {
      type: Boolean,
      default: true,
    },
    onlinePaymentEnabled: {
      type: Boolean,
      default: true,
    },
    razorpayKeyId: {
      type: String,
      default: "",
    },

    // General Settings
    siteName: {
      type: String,
      default: "BookHive",
    },
    siteEmail: {
      type: String,
      default: "",
    },
    sitePhone: {
      type: String,
      default: "",
    },

    // Last Updated
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model("Settings", settingsSchema);
