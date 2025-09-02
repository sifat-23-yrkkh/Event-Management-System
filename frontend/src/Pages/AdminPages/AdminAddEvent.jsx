import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const image_hosting_key = "7024c2b5ee1ff1d194a16bf99e0d57f7";
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AdminAddEvent = () => {
  const axiosSecure = useAxiosSecure();
  const [isLoading, setIsLoading] = useState(false);
  const [cartImagePreview, setCartImagePreview] = useState(null);
  const [packageImagesPreview, setPackageImagesPreview] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const packageCategories = [
    "Concert",
    "Conference",
    "Wedding",
    "Festival",
    "Birthday",
    "NewYearParty",
  ];

  const handleCartImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("cart_image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCartImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePackageImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setValue("images", files);

      const previews = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) {
            setPackageImagesPreview(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Step 1: Upload cart image
      const cartImageFormData = new FormData();
      cartImageFormData.append("image", data.cart_image);

      const cartImageResponse = await axios.post(
        image_hosting_api,
        cartImageFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!cartImageResponse.data.success) {
        throw new Error("Cart image upload failed");
      }

      // Step 2: Upload package images if they exist
      let packageImagesUrls = [];
      if (data.images && data.images.length > 0) {
        const uploadPromises = data.images.map(async (image) => {
          const formData = new FormData();
          formData.append("image", image);
          const response = await axios.post(image_hosting_api, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          return response.data.data.display_url;
        });

        packageImagesUrls = await Promise.all(uploadPromises);
      }

      // Step 3: Save the package data with the image URLs
      const packageData = {
        package_name: data.package_name,
        category: data.category,
        cart_Image: cartImageResponse.data.data.display_url,
        price: Number(data.price),
        features: data.features.split(",").map((s) => s.trim()),
        images: packageImagesUrls,
        photography_team_size: Number(data.photography_team_size),
        videography: data.videography === "true",
        duration_hours: Number(data.duration_hours),
        expected_attendance: Number(data.expected_attendance),
        staff_team_size: Number(data.staff_team_size),
        is_active: data.is_active === "true",
        created_at: new Date(),
        status: data.status,
      };

      const response = await axiosSecure.post("/events", packageData);

      if (response.data._id) {
        reset();
        setCartImagePreview(null);
        setPackageImagesPreview([]);
        Swal.fire({
          icon: "success",
          title: "Event Package Saved as Draft!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to add package",
        text: error.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#179ac8]">
        Add New Event Package
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Package Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Package Name*
          </label>
          <input
            type="text"
            {...register("package_name", {
              required: "Package name is required",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#179ac8]"
            placeholder="Enter package name"
          />
          {errors.package_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.package_name.message}
            </p>
          )}
        </div>
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category*
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#179ac8]"
          >
            <option value="">Select a category</option>
            {packageCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>
        {/* Cart Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cart Image*
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleCartImageChange}
                required
                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#179ac8] file:text-white
                                hover:file:bg-[#1482ac]"
              />
              {errors.cart_image && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.cart_image.message}
                </p>
              )}
            </div>
            {cartImagePreview && (
              <div className="w-20 h-20 border rounded-md overflow-hidden">
                <img
                  src={cartImagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price*
          </label>
          <input
            type="number"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#179ac8]"
            placeholder="Enter price"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>
        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Features (comma separated)*
          </label>
          <input
            type="text"
            {...register("features", { required: "Features are required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#179ac8]"
            placeholder="E.g.: 10 hours coverage, 200 photos, 1 videographer"
          />
          {errors.features && (
            <p className="mt-1 text-sm text-red-600">
              {errors.features.message}
            </p>
          )}
        </div>
        {/* Package Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Package Images
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePackageImagesChange}
                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#179ac8] file:text-white
                                hover:file:bg-[#1482ac]"
              />
            </div>
          </div>
          {packageImagesPreview.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {packageImagesPreview.map((preview, index) => (
                <div
                  key={index}
                  className="w-20 h-20 border rounded-md overflow-hidden"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Photography Team Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photography Team Size*
          </label>
          <input
            type="number"
            {...register("photography_team_size", {
              required: "Team size is required",
              min: { value: 0, message: "Must be 0 or more" },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#179ac8]"
            placeholder="Enter team size"
          />
          {errors.photography_team_size && (
            <p className="mt-1 text-sm text-red-600">
              {errors.photography_team_size.message}
            </p>
          )}
        </div>
        {/* Videography */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Includes Videography?*
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register("videography", {
                  required: "This field is required",
                })}
                value="true"
                className="text-[#179ac8] focus:ring-[#179ac8]"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register("videography")}
                value="false"
                className="text-[#179ac8] focus:ring-[#179ac8]"
                defaultChecked
              />
              <span className="ml-2">No</span>
            </label>
          </div>
          {errors.videography && (
            <p className="mt-1 text-sm text-red-600">
              {errors.videography.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#179ac8]"
            placeholder="Detailed description of the event package"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            {...register("status")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#179ac8]"
          >
            <option value="draft">Draft</option>
            <option value="published">Publish Immediately</option>
          </select>
        </div>
        {/* Duration Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (hours)*
          </label>
          <input
            type="number"
            {...register("duration_hours", {
              required: "Duration is required",
              min: { value: 1, message: "Must be at least 1 hour" },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#179ac8]"
            placeholder="Enter duration in hours"
          />
          {errors.duration_hours && (
            <p className="mt-1 text-sm text-red-600">
              {errors.duration_hours.message}
            </p>
          )}
        </div>
        {/* Expected Attendance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Attendance*
          </label>
          <input
            type="number"
            {...register("expected_attendance", {
              required: "Expected attendance is required",
              min: { value: 1, message: "Must be at least 1" },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#179ac8]"
            placeholder="Enter expected attendance"
          />
          {errors.expected_attendance && (
            <p className="mt-1 text-sm text-red-600">
              {errors.expected_attendance.message}
            </p>
          )}
        </div>
        {/* Staff Team Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Staff Team Size*
          </label>
          <input
            type="number"
            {...register("staff_team_size", {
              required: "Staff team size is required",
              min: { value: 1, message: "Must be at least 1" },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#179ac8]"
            placeholder="Enter staff team size"
          />
          {errors.staff_team_size && (
            <p className="mt-1 text-sm text-red-600">
              {errors.staff_team_size.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Staff Team Size*
          </label>
          <input
            type="number"
            {...register("staff_team_size", {
              required: "Staff team size is required",
              min: { value: 1, message: "Must be at least 1" },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#179ac8]"
            placeholder="Enter staff team size"
          />
          {errors.staff_team_size && (
            <p className="mt-1 text-sm text-red-600">
              {errors.staff_team_size.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Staff Team Size*
          </label>
          <input
            type="number"
            {...register("staff_team_size", {
              required: "Staff team size is required",
              min: { value: 1, message: "Must be at least 1" },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#179ac8]"
            placeholder="Enter staff team size"
          />
          {errors.staff_team_size && (
            <p className="mt-1 text-sm text-red-600">
              {errors.staff_team_size.message}
            </p>
          )}
        </div>
        {/* Is Active */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Is Active?*
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register("is_active", {
                  required: "This field is required",
                })}
                value="true"
                className="text-[#179ac8] focus:ring-[#179ac8]"
                defaultChecked
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register("is_active")}
                value="false"
                className="text-[#179ac8] focus:ring-[#179ac8]"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
          {errors.is_active && (
            <p className="mt-1 text-sm text-red-600">
              {errors.is_active.message}
            </p>
          )}
        </div>
        {/* Submit Button */}
        <div className="pt-4" >
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#179ac8] hover:bg-[#1482ac] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#179ac8] ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Adding Package..." : "Add Event Package"}
          </button>
        </div>
      </form>
    </div>
  );
};



export default AdminAddEvent;