const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    preferences: {
      favoriteCategories: {
        type: [String],
        default: [],
        enum: [
          "Concert",
          "Conference",
          "Wedding",
          "Festival",
          "Birthday",
          "NewYearParty",
        ],
      },
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [] 
      },
    ],
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ "preferences.favoriteCategories": 1 });

// Virtual for profile completeness
userSchema.virtual("profileComplete").get(function () {
  return !!this.name && !!this.mobile && !!this.photo;
});

const User = mongoose.model("usersalls", userSchema);

module.exports = User;
