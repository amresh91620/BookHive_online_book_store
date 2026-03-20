const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    // ============ BASIC INFO ============
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
    isbn: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // ============ DESCRIPTION ============
    aboutBook: {
      type: String,
      required: true,
      trim: true,
    },
    aboutAuthor: {
      type: String,
      trim: true,
    },

    // Keeping old description field for backward compatibility
    description: {
      type: String,
      trim: true,
    },

    // ============ PRICING ============
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ============ PHYSICAL DETAILS ============
    pages: {
      type: Number,
      required: true,
      min: 1,
    },
    language: {
      type: String,
      default: 'English',
    },
    format: {
      type: String,
      enum: ['Hardcover', 'Paperback', 'eBook', 'Audiobook'],
      default: 'Paperback',
    },

    // ============ PUBLICATION INFO ============
    publisher: {
      type: String,
      trim: true,
    },
    publishedDate: {
      type: Date,
    },

    // ============ CATEGORIZATION ============
    categories: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
    },

    // ============ IMAGES ============
    coverImage: {
      type: String,
      required: true,
    },

    // ============ INVENTORY ============
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // ============ RATINGS & REVIEWS ============
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

    // ============ STATUS ============
    status: {
      type: String,
      enum: ['active', 'inactive', 'out-of-stock', 'discontinued'],
      default: 'active',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },

    // ============ ADDITIONAL INFO ============
    ageGroup: {
      type: String,
      enum: ['Children', 'Young Adult', 'Adult', 'All Ages'],
    },

    // ============ SALES DATA ============
    totalSales: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Performance Indexes
bookSchema.index({ categories: 1 });
bookSchema.index({ featured: 1 });
bookSchema.index({ bestseller: 1 });
bookSchema.index({ newArrival: 1 });
bookSchema.index({ title: "text", author: "text" }); // For optimized text search (optional, but good for large datasets)

// Auto-calculate discount percentage and set newArrival
bookSchema.pre('save', function (next) {
  if (this.originalPrice && this.price < this.originalPrice) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  
  // Auto-set newArrival if book created in last 7 days
  if (this.isNew) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    this.newArrival = true;
  }
  
  next();
});

// Virtual field to check if book is truly a new arrival
bookSchema.virtual('isNewArrival').get(function() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return this.createdAt >= sevenDaysAgo;
});

module.exports = mongoose.model("Book", bookSchema);