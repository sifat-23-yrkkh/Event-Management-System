import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import TitleAndSubheading from "../../Components/SharedComponets/TitleAndSubheading";
import UserBookingModal from "./UserBookingModal";
import { useNavigate } from "react-router-dom";

const UserBookings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  // Add this function
  const handleReview = (booking) => {
    setSelectedBookingForReview(booking);
    setShowReviewModal(true);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosSecure.get(`/bookings/user/${user?.email}`);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      }
    };

    if (user?.email) fetchBookings();
  }, [user?.email, axiosSecure]);

  const handlePayment = (booking) => {
    Swal.fire({
      title: "Proceed to Payment",
      text: `Pay $${booking.finalPrice} for ${booking.packageName}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#179ac8",
      cancelButtonColor: "#d33",
      confirmButtonText: "Pay Now",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/dashboard/bookings/${booking._id}/payment`);
      }
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "payment_pending":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "event_done":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getPaymentBadgeClass = (paymentStatus) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#179ac8]"></div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <TitleAndSubheading title={`My Bookings (${bookings.length})`} />
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            You don't have any bookings yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#179ac8] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking, index) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={booking.cart_Image}
                            alt={booking.packageName}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.packageName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.eventId?.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          booking.status
                        )}`}
                      >
                        {booking.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentBadgeClass(
                          booking.paymentStatus
                        )}`}
                      >
                        {booking.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${booking.finalPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowModal(true);
                          }}
                          className="text-[#179ac8] hover:text-white hover:bg-[#179ac8] border border-[#179ac8] px-3 py-1 rounded text-xs"
                        >
                          Details
                        </button>
                        {booking.status === "payment_pending" &&
                          booking.paymentStatus === "pending" && (
                            <button
                              onClick={() => handlePayment(booking)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Pay Now
                            </button>
                          )}
                        {booking.status === "event_done" && (
                          <button 
                            onClick={() => handleReview(booking)}
                            className="bg-[#179ac8] hover:bg-[#1485b0] text-white px-3 py-1 rounded text-xs"
                          >
                            Review
                          </button>
                        )}
                        {booking.status === "completed" && (
                          <span className="text-green-600 text-xs px-3 py-1">
                            Reviewed ✓
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Booking Details Modal */}
      {showModal && (
        <UserBookingModal
          booking={selectedBooking}
          onClose={() => setShowModal(false)}
          onPayment={handlePayment}
        />
      )}
      
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Leave a Review</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Package Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <img
                  src={selectedBookingForReview?.cart_Image}
                  alt={selectedBookingForReview?.packageName}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">
                    {selectedBookingForReview?.packageName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Event Date: {new Date(selectedBookingForReview?.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const rating = form.rating.value;
                const reviewText = form.reviewText.value;

                if (!rating || !reviewText.trim()) {
                  Swal.fire({
                    title: "Error!",
                    text: "Please provide both rating and review text",
                    icon: "error",
                  });
                  return;
                }

                try {
                  await axiosSecure.post(
                    `/review/bookings/${selectedBookingForReview._id}/reviews`,
                    {
                      rating: parseInt(rating),
                      reviewText: reviewText.trim(),
                    }
                  );
                  Swal.fire({
                    title: "Success!",
                    text: "Your review has been submitted for approval",
                    icon: "success",
                  });
                  setShowReviewModal(false);
                  // Refresh bookings
                  const response = await axiosSecure.get(
                    `/bookings/user/${user?.email}`
                  );
                  setBookings(response.data);
                } catch (err) {
                  console.error("Error submitting review:", err);
                  Swal.fire({
                    title: "Error!",
                    text:
                      err.response?.data?.error || "Failed to submit review",
                    icon: "error",
                  });
                }
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <select
                  name="rating"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#179ac8] focus:border-[#179ac8]"
                  required
                >
                  <option value="">Select rating</option>
                  <option value="5">⭐⭐⭐⭐⭐ (5) - Excellent</option>
                  <option value="4">⭐⭐⭐⭐ (4) - Very Good</option>
                  <option value="3">⭐⭐⭐ (3) - Good</option>
                  <option value="2">⭐⭐ (2) - Fair</option>
                  <option value="1">⭐ (1) - Poor</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reviewText"
                  rows="4"
                  maxLength="500"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#179ac8] focus:border-[#179ac8] resize-none"
                  placeholder="Share your experience with this event package..."
                  required
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Maximum 500 characters</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#179ac8] text-white rounded-md text-sm font-medium hover:bg-[#1485b0]"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookings;