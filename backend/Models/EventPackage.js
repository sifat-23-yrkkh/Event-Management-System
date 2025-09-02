const mongoose = require("mongoose");

const eventPackageSchema = new mongoose.Schema(
  {
    package_name: {
      type: String,
      required: [true, "Package name is required"],
      trim: true,
      minlength: [2, "Package name must be at least 2 characters long"],
      maxlength: [100, "Package name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Concert",
          "Conference",
          "Wedding",
          "Festival",
          "Birthday",
          "NewYearParty",
          // "Corporate",
          // "Anniversary",
          // "Graduation"
        ],
        message: "{VALUE} is not a valid category",
      },
    },
    cart_Image: {
      type: String,
      required: [true, "Cart image is required"],
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
        },
        message: "Please provide a valid image URL",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      max: [100000, "Price cannot exceed $100,000"],
    },
    features: {
      type: [String],
      default: [],
      validate: {
        validator: function (features) {
          return features.length <= 20;
        },
        message: "Cannot have more than 20 features",
      },
    },
    images: {
      type: [String],
      default: [],
      validate: [
        {
          validator: function (images) {
            return images.length <= 10;
          },
          message: "Cannot have more than 10 images",
        },
        {
          validator: function (images) {
            return images.every((url) =>
              /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(url)
            );
          },
          message: "All images must be valid URLs",
        },
      ],
    },
    photography_team_size: {
      type: Number,
      required: [true, "Photography team size is required"],
      min: [1, "Photography team size must be at least 1"],
      max: [50, "Photography team size cannot exceed 50"],
    },
    videography: {
      type: Boolean,
      required: true,
      default: false,
    },
    duration_hours: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 hour"],
      max: [72, "Duration cannot exceed 72 hours"],
    },
    expected_attendance: {
      type: Number,
      required: [true, "Expected attendance is required"],
      min: [1, "Expected attendance must be at least 1"],
      max: [10000, "Expected attendance cannot exceed 10,000"],
    },
    staff_team_size: {
      type: Number,
      required: [true, "Staff team size is required"],
      min: [1, "Staff team size must be at least 1"],
      max: [100, "Staff team size cannot exceed 100"],
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true, // Add index for better query performance
    },
    created_by: {
      type: String,
      default: "admin",
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags) {
          return tags.length <= 10;
        },
        message: "Cannot have more than 10 tags",
      },
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
      default: 0,
    },
    reviews_count: {
      type: Number,
      min: [0, "Reviews count cannot be negative"],
      default: 0,
    },
    last_booked: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    published_at: {
      type: Date,
    },
    bookmarked_by: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usersalls",
      },
    ],
    faqs: [
      {
        question: {
          type: String,
          required: true,
          trim: true,
          maxlength: 200,
        },
        answer: {
          type: String,
          required: true,
          trim: true,
          maxlength: 1000,
        },
      },
    ],
    agenda: [
      {
        time: {
          type: String,
          required: true,
          trim: true,
        },
        activity: {
          type: String,
          required: true,
          trim: true,
          maxlength: 200,
        },
        description: {
          type: String,
          trim: true,
          maxlength: 500,
        },
      },
    ],
    organizers: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        role: {
          type: String,
          required: true,
          trim: true,
        },
        bio: {
          type: String,
          trim: true,
          maxlength: 500,
        },
        photo: {
          type: String,
          validate: {
            validator: function (v) {
              return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
            },
            message: "Please provide a valid image URL",
          }
         
        },
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    // Add version key for optimistic concurrency control
    versionKey: "__v",
  }
);

// Compound indexes for better query performance
eventPackageSchema.index({ category: 1, is_active: 1 });
eventPackageSchema.index({ price: 1, is_active: 1 });
eventPackageSchema.index({ created_at: -1, is_active: 1 });
eventPackageSchema.index({ rating: -1, is_active: 1 });

// Text index for search functionality
eventPackageSchema.index(
  {
    package_name: "text",
    category: "text",
    features: "text",
    description: "text",
    tags: "text",
  },
  {
    weights: {
      package_name: 10,
      category: 5,
      description: 3,
      features: 2,
      tags: 1,
    },
    name: "event_search_index",
  }
);

// Indexes for filtering
eventPackageSchema.index({ duration_hours: 1 });
eventPackageSchema.index({ photography_team_size: 1 });
eventPackageSchema.index({ videography: 1 });
eventPackageSchema.index({ expected_attendance: 1 });

// Virtual for formatted price
eventPackageSchema.virtual("formatted_price").get(function () {
  return `$${this.price.toLocaleString()}`;
});

// Virtual for average rating display
eventPackageSchema.virtual("rating_display").get(function () {
  return this.rating > 0 ? this.rating.toFixed(1) : "New";
});

// Pre-save middleware to update tags based on category and features
eventPackageSchema.pre("save", function (next) {
  if (
    this.isNew ||
    this.isModified("category") ||
    this.isModified("features")
  ) {
    const autoTags = [];

    // Add category as tag
    if (this.category) {
      autoTags.push(this.category.toLowerCase());
    }

    // Add videography tag
    if (this.videography) {
      autoTags.push("videography");
    }

    // Add team size tags
    if (this.photography_team_size >= 5) {
      autoTags.push("large-team");
    } else if (this.photography_team_size <= 2) {
      autoTags.push("small-team");
    }

    // Add duration tags
    if (this.duration_hours >= 8) {
      autoTags.push("full-day");
    } else if (this.duration_hours >= 4) {
      autoTags.push("half-day");
    } else {
      autoTags.push("short-event");
    }

    // Add price range tags
    if (this.price >= 5000) {
      autoTags.push("premium");
    } else if (this.price >= 2000) {
      autoTags.push("mid-range");
    } else {
      autoTags.push("budget-friendly");
    }

    // Merge with existing tags and remove duplicates
    this.tags = [...new Set([...this.tags, ...autoTags])];
  }
  next();
});

// Static method to get popular packages
eventPackageSchema.statics.getPopular = function (limit = 5) {
  return this.find({ is_active: true })
    .sort({ rating: -1, reviews_count: -1, expected_attendance: -1 })
    .limit(limit);
};

// Static method to get packages by price range
eventPackageSchema.statics.getByPriceRange = function (min, max) {
  const filter = { is_active: true };
  if (min !== undefined) filter.price = { $gte: min };
  if (max !== undefined) filter.price = { ...filter.price, $lte: max };
  return this.find(filter).sort({ price: 1 });
};

// Instance method to check if package is popular
eventPackageSchema.methods.isPopular = function () {
  return this.rating >= 4.0 && this.reviews_count >= 10;
};

// Instance method to get similar packages
eventPackageSchema.methods.getSimilar = function (limit = 3) {
  return this.constructor
    .find({
      _id: { $ne: this._id },
      is_active: true,
      $or: [
        { category: this.category },
        { price: { $gte: this.price * 0.8, $lte: this.price * 1.2 } },
      ],
    })
    .limit(limit);
};

const EventPackage = mongoose.model("eventsalls", eventPackageSchema);

module.exports = EventPackage;
