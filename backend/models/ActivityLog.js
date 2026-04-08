const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "user_login",
        "user_register",
        "user_blocked",
        "user_unblocked",
        "user_deleted",
        "order_created",
        "order_updated",
        "order_cancelled",
        "book_created",
        "book_updated",
        "book_deleted",
        "review_created",
        "review_deleted",
        "blog_created",
        "blog_updated",
        "blog_deleted",
        "settings_updated",
        "message_deleted",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

// Index for faster queries
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
