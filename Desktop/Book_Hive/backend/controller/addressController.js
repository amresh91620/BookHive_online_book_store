const User = require("../models/User");

const requiredFields = [
  "fullName",
  "phone",
  "street",
  "city",
  "state",
  "pincode",
];

const hasMissingFields = (payload) =>
  requiredFields.some((field) => !payload?.[field]);

exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("address");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ addresses: user.address || [] });
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({ msg: "Failed to fetch addresses" });
  }
};

exports.addAddress = async (req, res) => {
  try {
    if (hasMissingFields(req.body)) {
      return res.status(400).json({ msg: "All address fields are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.address.push({
      fullName: req.body.fullName,
      phone: req.body.phone,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
    });

    await user.save();

    res.status(201).json({
      msg: "Address added",
      addresses: user.address,
    });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({ msg: "Failed to add address" });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const address = user.address.id(id);
    if (!address) {
      return res.status(404).json({ msg: "Address not found" });
    }

    requiredFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        address[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      msg: "Address updated",
      addresses: user.address,
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ msg: "Failed to update address" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const addressIndex = user.address.findIndex(addr => addr._id.toString() === id);
    if (addressIndex === -1) {
      return res.status(404).json({ msg: "Address not found" });
    }

    user.address.splice(addressIndex, 1);
    await user.save();

    res.json({
      msg: "Address removed",
      addresses: user.address,
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ msg: "Failed to delete address" });
  }
};
