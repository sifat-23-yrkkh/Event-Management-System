const EventPackage = require("../Models/EventPackage");
const User = require("../Models/User");
const { ObjectId } = require("mongodb");

const updateEventPackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const updates = req.body;

    // Add updated_at timestamp
    updates.updated_at = new Date();

    const updatedPackage = await EventPackage.findByIdAndUpdate(
      packageId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ error: "Event package not found" });
    }

    res.status(200).json(updatedPackage);
  } catch (error) {
    console.error("Error updating event package:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getEventPackageById = async (req, res) => {
  try {
    const packageId = req.params.id;
    const package = await EventPackage.findById(packageId);

    if (!package) {
      return res.status(404).json({ error: "Event package not found" });
    }

    res.status(200).json(package);
  } catch (error) {
    console.error("Error fetching event package:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const togglePackageStatus = async (req, res) => {
  try {
    const packageId = req.params.id;

    const existingPackage = await EventPackage.findById(packageId);
    if (!existingPackage) {
      return res.status(404).json({ error: "Event package not found" });
    }

    const updatedPackage = await EventPackage.findByIdAndUpdate(
      packageId,
      { is_active: !existingPackage.is_active },
      { new: true }
    );

    res.status(200).json(updatedPackage);
  } catch (error) {
    console.error("Error toggling package status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPackageCategories = async (req, res) => {
  try {
    const categories = await EventPackage.distinct("category");
    // console.log(categories);

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching package categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getEventPackages = async (req, res) => {
  try {
    const users = await EventPackage.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getDraftEventPackages = async (req, res) => {
  try {
    const packages = await EventPackage.find({ status: "draft" }).sort({
      created_at: -1,
    });
    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching draft event packages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const publishEventPackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const updatedPackage = await EventPackage.findByIdAndUpdate(
      packageId,
      { status: "published", is_active: true, published_at: new Date() },
      { new: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ error: "Event package not found" });
    }

    res.status(200).json(updatedPackage);
  } catch (error) {
    console.error("Error publishing event package:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPublishedEventPackages = async (req, res) => {
  try {
    const packages = await EventPackage.find({ status: "published" }).sort({
      published_at: -1,
    });
    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching published event packages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getEventPackageDetails = async (req, res) => {
  try {
    const packageId = req.params.id;
    const package = await EventPackage.findById(packageId)
      .populate("bookmarked_by", "name email photo")
      .populate("created_by", "name email photo");

    if (!package) {
      return res.status(404).json({ error: "Event package not found" });
    }

    res.status(200).json(package);
  } catch (error) {
    console.error("Error fetching event package details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const toggleEventBookmark = async (req, res) => {
  try {
    const { userEmail, eventId } = req.body;

    if (!userEmail || !eventId) {
      return res
        .status(400)
        .json({ error: "User email and event ID are required" });
    }

    const user = await User.findOne({ email: userEmail.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Initialize bookmarks if it doesn't exist
    if (!user.bookmarks) {
      user.bookmarks = [];
    }

    const bookmarkIndex = user.bookmarks.indexOf(eventId);
    console.log(bookmarkIndex);

    if (bookmarkIndex === -1) {
      // Add to bookmarks
      user.bookmarks.push(eventId);
      await user.save();
      return res.status(200).json({
        message: "Event added to bookmarks",
        bookmarks: user.bookmarks,
      });
    } else {
      // Remove from bookmarks
      user.bookmarks.splice(bookmarkIndex, 1);
      await user.save();
      return res.status(200).json({
        message: "Event removed from bookmarks",
        bookmarks: user.bookmarks,
      });
    }
  } catch (error) {
    console.error("Error toggling event bookmark:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Check if event is bookmarked by user
const checkBookmarkStatus = async (req, res) => {
  try {
    const { userEmail, eventId } = req.query;

    if (!userEmail || !eventId) {
      return res
        .status(400)
        .json({ error: "User email and event ID are required" });
    }

    const user = await User.findOne({ email: userEmail.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isBookmarked = user.bookmarks?.includes(eventId) || false;

    res.status(200).json({ isBookmarked });
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all bookmarked events for a user
const getUserBookmarks = async (req, res) => {
  try {
    const { userEmail } = req.params;
    console.log(userEmail);

    if (!userEmail) {
      return res.status(400).json({ error: "User email is required" });
    }

    const user = await User.findOne({ email: userEmail.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bookmarkedEvents = await EventPackage.find({
      _id: { $in: user.bookmarks || [] },
    }).sort({ created_at: -1 });

    res.status(200).json(bookmarkedEvents);
  } catch (error) {
    console.error("Error fetching user bookmarks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update the createEventPackage to include status
const createEventPackage = async (req, res) => {
  try {
    const packageData = req.body;
    packageData.status = packageData.status || "draft";
    console.log(packageData);

    const newPackage = new EventPackage({
      ...packageData,
      created_by: "admin", // Use the authenticated user's ID
      bookmarked_by: [],
    });

    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    console.error("Error creating event package:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedEvent = await EventPackage.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({
      message: "Event deleted successfully",
      deletedEvent: {
        id: deletedEvent._id,
        // email: deletedEvent.email,
        // name: deletedEvent.name,
      },
    });
  } catch (error) {
    console.error("Error deleting Event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update exports
module.exports = {
  createEventPackage,
  updateEventPackage,
  getEventPackages,
  getEventPackageById,
  togglePackageStatus,
  getPackageCategories,
  checkBookmarkStatus,
  getDraftEventPackages,
  publishEventPackage,
  getPublishedEventPackages,
  getEventPackageDetails,
  toggleEventBookmark,
  getUserBookmarks,
  deleteEvent,
};
