const express = require("express");
const { 
  getUser,
  getUserByEmail, 
  postUser, 
  getAdmin, 
  updateUsers, 
  deleteUser,
  updateUserProfile,
  getUserProfile,
  getRecommendedPackages
} = require("../Controller/UserController");

const router = express.Router();

// Public routes
router.get('/users', getUser)
router.get('/users/:email', getUserByEmail)
router.post("/addUsers", postUser);
router.get('/admin/:email', getAdmin)


// Profile routes
// Profile routes
router.get('/profile/:email', getUserProfile) // Get by email
router.patch('/updateProfile/:id', updateUserProfile)
router.get('/profile/:id/recommendations', getRecommendedPackages) // Recommendations by ID

// Admin routes
router.patch('/updateEmailVerified', updateUsers)
router.delete('/users/:id', deleteUser)

module.exports = router;