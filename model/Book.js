const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    genre: {
      type: String,
      required: true,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Biography",
        "History",
        "Technology",
        "Science",
        "Other",
      ],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    publishedYear: {
      type: Number,
      required: true,
    },

    coverImage: {
      type: String, 
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
