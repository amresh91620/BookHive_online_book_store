const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: String,
    phone: String,
    profileImage: String,

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    address: [
      {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
