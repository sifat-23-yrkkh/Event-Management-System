import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  User,
  Edit,
  Check,
  X,
  Facebook,
  Twitter,
  Instagram,
  Heart,
  Info,
  Search,
  Target,
  Calendar,
  Bookmark,
  Loader2
} from "lucide-react";

// ImageBB configuration
const image_hosting_key = '7024c2b5ee1ff1d194a16bf99e0d57f7';
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Profile = () => {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const axiosSecure = useAxiosSecure();

  const [editMode, setEditMode] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    bio: "",
    photo: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
    preferences: {
      favoriteCategories: [],
    },
  });

  const categories = [
    "Concert",
    "Conference",
    "Wedding",
    "Festival",
    "Birthday",
    "NewYearParty",
    
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(
          `/users/profile/${currentUser?.email}`
        );
        setUser(response.data);
        setFormData({
          name: response.data.name,
          mobile: response.data.mobile,
          bio: response.data.bio || "",
          photo: response.data.photo || "",
          socialLinks: response.data.socialLinks || {
            facebook: "",
            twitter: "",
            instagram: "",
          },
          preferences: response.data.preferences || {
            favoriteCategories: [],
          },
        });

        if (response.data._id && response.data.preferences?.favoriteCategories?.length > 0) {
          try {
            const recResponse = await axiosSecure.get(
              `/users/profile/${response.data._id}/recommendations`
            );
            setRecommendations(
              Array.isArray(recResponse.data) ? recResponse.data : []
            );
          } catch (recError) {
            console.error("Error fetching recommendations:", recError);
            setRecommendations([]);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.email) {
      fetchUserProfile();
    }
  }, [currentUser?.email, axiosSecure]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please select a valid image file.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Please select an image smaller than 5MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setImageUploading(true);
    try {
      const imageFormData = new FormData();
      imageFormData.append('image', file);
      
      const response = await axios.post(image_hosting_api, imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          photo: response.data.data.display_url
        }));
        
        Swal.fire({
          icon: "success",
          title: "Image Uploaded!",
          text: "Profile image uploaded successfully.",
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Failed to upload image. Please try again.",
      });
      setImagePreview(null);
    } finally {
      setImageUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const toggleCategory = async (category) => {
    const updatedFormData = { ...formData };
    const currentCategories = updatedFormData.preferences.favoriteCategories || [];
    const updatedCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];

    updatedFormData.preferences.favoriteCategories = updatedCategories;
    setFormData(updatedFormData);

    if (user?._id) {
      try {
        const recResponse = await axiosSecure.get(
          `/users/profile/${user._id}/recommendations`
        );
        setRecommendations(
          Array.isArray(recResponse.data) ? recResponse.data : []
        );
      } catch (recError) {
        console.error("Error fetching updated recommendations:", recError);
      }
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.patch(
        `/users/updateProfile/${user?._id}`,
        formData
      );
      setUser(response.data);
      setEditMode(false);
      setImagePreview(null);
      
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile has been updated successfully.",
        timer: 1500,
        showConfirmButton: false
      });

      if (response.data.preferences?.favoriteCategories?.length > 0) {
        try {
          const recResponse = await axiosSecure.get(
            `/users/profile/${response.data._id}/recommendations`
          );
          setRecommendations(
            Array.isArray(recResponse.data) ? recResponse.data : []
          );
        } catch (recError) {
          console.error("Error fetching recommendations:", recError);
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin rounded-full h-32 w-32 text-[#179ac8]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-xl">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <div className="text-xl">User not found</div>
        </div>
      </div>
    );
  }

  const safeRecommendations = Array.isArray(recommendations) ? recommendations : [];
  const hasRecommendations = safeRecommendations.length > 0;
  const hasFavoriteCategories = user.preferences?.favoriteCategories?.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Profile Info */}
        <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={imagePreview || formData.photo || user.photo || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-36 h-36 rounded-full border-4 border-[#179ac8] object-cover"
              />
              {imageUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <Loader2 className="animate-spin h-8 w-8 text-white" />
                </div>
              )}
            </div>
          </div>

          {editMode ? (
            <>
              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={imageUploading}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#179ac8] file:text-white
                    hover:file:bg-[#1479a1]
                    disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {imageUploading && (
                  <p className="mt-1 text-sm text-blue-600">Uploading image...</p>
                )}
              </div>

              <button
                onClick={handleSave}
                disabled={imageUploading || loading}
                className="w-full bg-[#179ac8] hover:bg-[#1479a1] text-white py-2 px-4 rounded flex items-center justify-center mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-5 w-5 mr-2" />
                {loading ? 'Saving...' : 'Save Profile'}
              </button>

              <button
                onClick={() => {
                  setEditMode(false);
                  setImagePreview(null);
                  setFormData({
                    name: user.name,
                    mobile: user.mobile,
                    bio: user.bio || "",
                    photo: user.photo || "",
                    socialLinks: user.socialLinks || {
                      facebook: "",
                      twitter: "",
                      instagram: "",
                    },
                    preferences: user.preferences || {
                      favoriteCategories: [],
                    },
                  });
                }}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded flex items-center justify-center mb-4"
              >
                <X className="h-5 w-5 mr-2" />
                Cancel
              </button>
            </>
          ) : (
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setEditMode(true)}
                className="bg-[#179ac8] hover:bg-[#1479a1] text-white py-2 px-4 rounded flex items-center"
              >
                <Edit className="h-5 w-5 mr-2" />
                Edit Profile
              </button>
            </div>
          )}

          <div className="border-t border-gray-300 my-4"></div>

          {/* Personal Info */}
          <div className="mb-6">
            <h3 className="text-[#179ac8] text-lg font-semibold mb-3 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Info
            </h3>

            {editMode ? (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#179ac8]"
                />
                <input
                  type="text"
                  placeholder="Mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#179ac8]"
                />
                <textarea
                  placeholder="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#179ac8]"
                  rows="3"
                ></textarea>
              </>
            ) : (
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Name:</span> {user.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-semibold">Mobile:</span> {user.mobile || 'Not provided'}
                </p>
                {user.bio && (
                  <p>
                    <span className="font-semibold">Bio:</span> {user.bio}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-300 my-4"></div>

          {/* Favorite Categories */}
          <div className="mb-6">
            <h3 className="text-[#179ac8] text-lg font-semibold mb-3 flex items-center">
              <Bookmark className="h-5 w-5 mr-2" />
              Favorite Categories
            </h3>

            {editMode ? (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                      formData.preferences.favoriteCategories?.includes(category)
                        ? "bg-[#179ac8] text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {hasFavoriteCategories ? (
                  user.preferences.favoriteCategories.map((category) => (
                    <span
                      key={category}
                      className="bg-[#179ac8] text-white px-3 py-1 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No favorite categories selected
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-300 my-4"></div>

          {/* Social Links */}
          <div>
            <h3 className="text-[#179ac8] text-lg font-semibold mb-3">
              Social Links
            </h3>

            {editMode ? (
              <div className="space-y-3">
                <div className="flex items-center border rounded overflow-hidden">
                  <span className="bg-gray-200 p-2">
                    <Facebook className="h-5 w-5 text-[#179ac8]" />
                  </span>
                  <input
                    type="text"
                    placeholder="Facebook URL"
                    name="facebook"
                    value={formData.socialLinks.facebook}
                    onChange={handleSocialLinkChange}
                    className="flex-1 p-2 focus:outline-none"
                  />
                </div>
                <div className="flex items-center border rounded overflow-hidden">
                  <span className="bg-gray-200 p-2">
                    <Twitter className="h-5 w-5 text-[#179ac8]" />
                  </span>
                  <input
                    type="text"
                    placeholder="Twitter URL"
                    name="twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleSocialLinkChange}
                    className="flex-1 p-2 focus:outline-none"
                  />
                </div>
                <div className="flex items-center border rounded overflow-hidden">
                  <span className="bg-gray-200 p-2">
                    <Instagram className="h-5 w-5 text-[#179ac8]" />
                  </span>
                  <input
                    type="text"
                    placeholder="Instagram URL"
                    name="instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleSocialLinkChange}
                    className="flex-1 p-2 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center space-x-4">
                {user.socialLinks?.facebook && (
                  <a
                    href={user.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#179ac8] hover:text-[#1479a1] transition-colors duration-200"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                )}
                {user.socialLinks?.twitter && (
                  <a
                    href={user.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#179ac8] hover:text-[#1479a1] transition-colors duration-200"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                )}
                {user.socialLinks?.instagram && (
                  <a
                    href={user.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#179ac8] hover:text-[#1479a1] transition-colors duration-200"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                )}
                {!user.socialLinks?.facebook &&
                  !user.socialLinks?.twitter &&
                  !user.socialLinks?.instagram && (
                    <p className="text-gray-500 text-sm">
                      No social links added
                    </p>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Recommendations */}
        <div className="w-full md:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#179ac8]">
              Recommended Packages
            </h2>
            {hasFavoriteCategories && (
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                {user.preferences.favoriteCategories.length} categories selected
              </span>
            )}
          </div>

          {!hasFavoriteCategories ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow p-8 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Get Personalized Recommendations!
              </h3>
              <p className="text-gray-600 mb-4">
                Select your favorite event categories in your profile to see customized package recommendations just for you.
              </p>
              <button
                onClick={() => setEditMode(true)}
                className="bg-[#179ac8] hover:bg-[#1479a1] text-white py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Add Favorite Categories
              </button>
            </div>
          ) : hasRecommendations ? (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-blue-500 mr-2" />
                  <p className="text-blue-700 text-sm">
                    Based on your favorite categories: {user.preferences.favoriteCategories.join(', ')}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {safeRecommendations.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={pkg.cart_Image || "https://via.placeholder.com/400x200"}
                        alt={pkg.package_name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                          {pkg.package_name}
                        </h3>
                        <span className="bg-[#179ac8] text-white text-sm px-3 py-1 rounded-full font-semibold">
                          ${pkg.price?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                      
                      {pkg.description && (
                        <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                          {pkg.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                          {pkg.category}
                        </span>
                        {pkg.tags && pkg.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {pkg.features && pkg.features.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Key Features:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {pkg.features.slice(0, 2).map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <Check className="w-3 h-3 text-green-500 mr-1" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-[#179ac8] hover:bg-[#1479a1] text-white py-2 px-4 rounded transition-colors duration-200 text-sm">
                          View Details
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded transition-colors duration-200">
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-lg shadow p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Packages Found
              </h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any packages matching your selected categories at the moment. 
                Try adding more categories or check back later!
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-sm text-gray-500">Your categories:</span>
                {user.preferences.favoriteCategories.map((category) => (
                  <span
                    key={category}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;