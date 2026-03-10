const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId, // reference to Book document
            ref: "Book",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId, // reference to User document
            ref: "User",
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 1000
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date
        },
        isEdited: {
            type: Boolean,
            default: false
        }
    }
);

// Pre-save hook to update 'updatedAt' automatically
reviewSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model("Review", reviewSchema);