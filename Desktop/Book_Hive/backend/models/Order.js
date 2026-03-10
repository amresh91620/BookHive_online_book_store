const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    title: String,
    author: String,
    coverImage: String,
    price: Number,
    quantity: Number,
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: String,
    at: { type: Date, default: Date.now },
    by: {
      type: String,
      enum: ["user", "admin", "system"],
      default: "system",
    },
    note: String,
  },
  { _id: false }
);

const paymentHistorySchema = new mongoose.Schema(
  {
    status: String,
    at: { type: Date, default: Date.now },
    by: {
      type: String,
      enum: ["user", "admin", "system"],
      default: "system",
    },
    note: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    address: addressSchema,
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "CARD"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    statusHistory: [statusHistorySchema],
    subtotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    paymentHistory: [paymentHistorySchema],
    tracking: {
      carrier: String,
      trackingNumber: String,
      trackingUrl: String,
    },
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
