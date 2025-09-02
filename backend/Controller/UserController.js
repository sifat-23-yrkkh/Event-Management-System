const User = require("../Models/User");
const { ObjectId } = require("mongodb");
const EventPackage = require("../Models/EventPackage")
const getUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const userEmail = req.params.email.toLowerCase();
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const postUser = async (req, res) => {
  try {
    const userData = req.body;

   
    const existingUser = await User.findOne({
      $or: [
        { email: userData.email.toLowerCase() },
      ],
    });


    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      ...userData,
      email: userData.email.toLowerCase(),
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAdmin = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ admin: false });
    }

    res.status(200).json({ admin: user.role === "admin" });
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getModerator = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ moderator: false });
    }

    res.status(200).json({ moderator: user.role === "moderator" });
  } catch (error) {
    console.error("Error checking moderator status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUsers = async (req, res) => {
  try {
    const { email, emailVerified } = req.body;

    console.log(email,emailVerified);
    

    // Validate input
    if (!email || typeof emailVerified !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "email and emailVerified (boolean) are required",
      });
    }

    // Update user in database by email
    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() }, // Query filter by email
      { emailVerified }, // Update document
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    res.status(200).json({
      success: true,
      message: "Email verification status updated successfully",
      user: {
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
      },
    });
  } catch (error) {
    console.error("Error updating email verification status:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};


const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    console.log(userId,updates);
    

    // Allowed fields to update
    const allowedUpdates = ['name', 'mobile', 'photo', 'bio', 'socialLinks', 'preferences'];
    const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates!" });
    }

    const user = await User.findByIdAndUpdate(userId, updates, { 
      new: true, 
      runValidators: true 
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userEmail = req.params.email;
    const user = await User.findOne({ email: userEmail.toLowerCase() }).select(
      "-emailVerified -__v -createdAt -updatedAt"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRecommendedPackages = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    // console.log(user);
    
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const favoriteCategories = user.preferences?.favoriteCategories || [];
    console.log(favoriteCategories);
    
    if (favoriteCategories.length === 0) {
      return res.status(200).json([]);
    }

    const packages = await EventPackage.find({
      category: { $in: favoriteCategories },
      // is_active: true
    }).limit(10);
    console.log(packages);
    

    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching recommended packages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Enhanced deleteUser method for admin
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ 
      message: "User deleted successfully",
      deletedUser: {
        id: deletedUser._id,
        email: deletedUser.email,
        name: deletedUser.name
      }
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUser,
  getUserByEmail,
  postUser,
  getAdmin,
  getModerator,
  updateUsers,
  // makeModerator,
  deleteUser,
  updateUserProfile,
  getUserProfile,
  getRecommendedPackages
};