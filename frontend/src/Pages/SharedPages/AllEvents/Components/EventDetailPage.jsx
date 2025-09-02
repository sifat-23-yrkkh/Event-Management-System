import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import {
  FaBookmark,
  FaRegBookmark,
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaVideo,
  FaDollarSign,
} from "react-icons/fa";
import useAuth from "../../../../hooks/useAuth";
import Swal from "sweetalert2";
import DatePickerModal from "./DatePickerModal";

const EventDetailPage = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosSecure.get(`/events/${id}`);
        setEvent(response.data);
        setIsBookmarked(
          response.data.bookmarked_by?.includes(user?._id) || false
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, axiosSecure, user]);

  const toggleBookmark = async () => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to bookmark events",
        icon: "warning",
        confirmButtonColor: "#179ac8",
      });
      return;
    }

    try {
      const response = await axiosSecure.patch(`/events/${id}/bookmark`);
      setEvent(response.data);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to book events",
        icon: "warning",
        confirmButtonColor: "#179ac8",
      });
      return;
    }
    setModalOpen(true);
  };
console.log('user',user)
  // In EventDetailPage.jsx, update the handleConfirmBooking function:

  const handleConfirmBooking = async () => {
    try {
      const bookingData = {
        eventId: event._id,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        userPhoto: user.photoURL,
        packageName: event.package_name,
        cart_Image: event.cart_Image,
        date: selectedDate,
        totalPrice: event.price,
        features: event.features || [],
        photographyTeamSize: event.photography_team_size,
        videography: event.videography,
        durationHours: event.duration_hours,
        expectedAttendance: event.expected_attendance,
        staffTeamSize: event.staff_team_size,
        status: "pending",
        paymentStatus: "pending",
        finalPrice: event.price, // Same as totalPrice for simple booking
      };

      const response = await axiosSecure.post("/bookings", bookingData);
      if (response.data._id) {
        Swal.fire({
          title: "Booking Request Submitted!",
          text: "Your booking request has been submitted for admin approval",
          icon: "success",
          confirmButtonColor: "#179ac8",
        });
        setModalOpen(false);
        // Optionally navigate to user bookings page
        // navigate('/my-bookings');
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to submit booking request",
        icon: "error",
        confirmButtonColor: "#179ac8",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen">
        Event not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Event Header */}
        <div className="relative">
          <img
            src={event.cart_Image}
            alt={event.package_name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {event.package_name}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="bg-[#179ac8] text-white px-4 py-1 rounded-full text-sm font-medium">
                    {event.category}
                  </span>
                  <span className="bg-white/90 text-[#179ac8] font-bold px-4 py-1 rounded-full shadow-lg">
                    ${event.price?.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={toggleBookmark}
                className="bg-white/90 p-3 rounded-full shadow-lg hover:bg-[#179ac8] hover:text-white transition-colors"
                title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                {isBookmarked ? (
                  <FaBookmark className="text-[#179ac8]" />
                ) : (
                  <FaRegBookmark className="text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Event Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-[#179ac8]">
              Package Details
            </h2>
            <p className="text-gray-700 mb-6">
              {event.description || "No description available"}
            </p>

            <h3 className="text-xl font-semibold mb-3 text-[#179ac8]">
              What's Included
            </h3>
            <ul className="space-y-2 mb-6">
              {event.features?.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#179ac8] mr-2 mt-1">•</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-[#179ac8]">
              Event Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <FaClock className="text-[#179ac8] mr-3 text-xl" />
                <div>
                  <p className="text-gray-500 text-sm">Duration</p>
                  <p className="font-medium">{event.duration_hours} hours</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <FaUsers className="text-[#179ac8] mr-3 text-xl" />
                <div>
                  <p className="text-gray-500 text-sm">Photography Team</p>
                  <p className="font-medium">
                    {event.photography_team_size} members
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <FaVideo className="text-[#179ac8] mr-3 text-xl" />
                <div>
                  <p className="text-gray-500 text-sm">Videography</p>
                  <p className="font-medium">
                    {event.videography ? "Included" : "Not included"}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <FaUsers className="text-[#179ac8] mr-3 text-xl" />
                <div>
                  <p className="text-gray-500 text-sm">Staff Team</p>
                  <p className="font-medium">{event.staff_team_size} members</p>
                </div>
              </div>
            </div>

            {event.images?.length > 0 && (
              <>
                <h3 className="text-xl font-semibold mb-3 text-[#179ac8]">
                  Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {event.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="rounded-lg object-cover h-48 w-full"
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
              <h3 className="text-xl font-semibold mb-4 text-[#179ac8]">
                Book This Package
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-bold">
                    ${event.price?.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleBookNow}
                  className="w-full bg-[#179ac8] hover:bg-[#1482ac] text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FaCalendarAlt />
                  Book Now
                </button>

                <div className="text-sm text-gray-500 mt-4">
                  <p>Need help or have questions?</p>
                  <Link
                    to="/contact"
                    className="text-[#179ac8] hover:underline"
                  >
                    Contact our team
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
};

export default EventDetailPage;
