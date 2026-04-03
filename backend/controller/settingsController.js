const Settings = require("../models/Settings");

// Get Settings (Public - for checkout page)
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    // Return only public settings
    res.json({
      taxRate: settings.taxRate,
      taxName: settings.taxName,
      taxEnabled: settings.taxEnabled,
      deliveryCharge: settings.deliveryCharge,
      freeDeliveryThreshold: settings.freeDeliveryThreshold,
      deliveryEnabled: settings.deliveryEnabled,
      codEnabled: settings.codEnabled,
      onlinePaymentEnabled: settings.onlinePaymentEnabled,
      razorpayKeyId: settings.razorpayKeyId,
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ msg: "Failed to fetch settings" });
  }
};

// Get All Settings (Admin Only)
exports.getAdminSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({ settings });
  } catch (error) {
    console.error("Get admin settings error:", error);
    res.status(500).json({ msg: "Failed to fetch settings" });
  }
};

// Update Settings (Admin Only)
exports.updateSettings = async (req, res) => {
  try {
    const {
      taxRate,
      taxName,
      taxEnabled,
      deliveryCharge,
      freeDeliveryThreshold,
      deliveryEnabled,
      codEnabled,
      onlinePaymentEnabled,
      razorpayKeyId,
      siteName,
      siteEmail,
      sitePhone,
    } = req.body;

    const settings = await Settings.getSettings();

    // Update tax settings
    if (taxRate !== undefined) {
      if (taxRate < 0 || taxRate > 1) {
        return res.status(400).json({ msg: "Tax rate must be between 0 and 1 (0% to 100%)" });
      }
      settings.taxRate = taxRate;
    }
    if (taxName !== undefined) settings.taxName = taxName;
    if (taxEnabled !== undefined) settings.taxEnabled = taxEnabled;

    // Update delivery settings
    if (deliveryCharge !== undefined) {
      if (deliveryCharge < 0) {
        return res.status(400).json({ msg: "Delivery charge cannot be negative" });
      }
      settings.deliveryCharge = deliveryCharge;
    }
    if (freeDeliveryThreshold !== undefined) {
      if (freeDeliveryThreshold < 0) {
        return res.status(400).json({ msg: "Free delivery threshold cannot be negative" });
      }
      settings.freeDeliveryThreshold = freeDeliveryThreshold;
    }
    if (deliveryEnabled !== undefined) settings.deliveryEnabled = deliveryEnabled;

    // Update payment settings
    if (codEnabled !== undefined) settings.codEnabled = codEnabled;
    if (onlinePaymentEnabled !== undefined) settings.onlinePaymentEnabled = onlinePaymentEnabled;
    if (razorpayKeyId !== undefined) settings.razorpayKeyId = razorpayKeyId;

    // Update general settings
    if (siteName !== undefined) settings.siteName = siteName;
    if (siteEmail !== undefined) settings.siteEmail = siteEmail;
    if (sitePhone !== undefined) settings.sitePhone = sitePhone;

    settings.updatedBy = req.user.id;
    await settings.save();

    res.json({
      msg: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ msg: "Failed to update settings" });
  }
};

// Reset Settings to Default (Admin Only)
exports.resetSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    settings.taxRate = 0.18;
    settings.taxName = "GST";
    settings.taxEnabled = true;
    settings.deliveryCharge = 50;
    settings.freeDeliveryThreshold = 500;
    settings.deliveryEnabled = true;
    settings.codEnabled = true;
    settings.onlinePaymentEnabled = true;
    settings.updatedBy = req.user.id;
    
    await settings.save();

    res.json({
      msg: "Settings reset to default",
      settings,
    });
  } catch (error) {
    console.error("Reset settings error:", error);
    res.status(500).json({ msg: "Failed to reset settings" });
  }
};
