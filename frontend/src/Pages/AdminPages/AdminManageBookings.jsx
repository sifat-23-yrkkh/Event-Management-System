import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import TitleAndSubheading from "../../Components/SharedComponets/TitleAndSubheading";
import AdminBookingModal from "./AdminBookingModal";

const AdminManageBookings = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosSecure.get("/bookings/bookings");
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      }
    };
    fetchBookings();
  }, [axiosSecure]);

  const handleApprove = (booking) => {
    Swal.fire({
      title: "Approve Booking?",
      text: `Approve booking for ${booking.userName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#179ac8",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/bookings/${booking._id}/approve`)
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: `Booking approved. User needs to make payment.`,
                showConfirmButton: false,
                timer: 2000,
              });
              setBookings(bookings.map(b => 
                b._id === booking._id ? {...b, status: "payment_pending"} : b
              ));
            }
            
          });
      }
    });
  };

  const handleComplete = (booking) => {
    Swal.fire({
      title: "Mark Event as Completed?",
      text: `Mark ${booking.packageName} event as completed?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#179ac8",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Complete!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/bookings/${booking._id}/complete`)
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: `Event marked as completed.`,
                showConfirmButton: false,
                timer: 2000,
              });
              setBookings(bookings.map(b => 
                b._id === booking._id ? {...b, status: "event_done"} : b
              ));
            }
          });
      }
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "payment_pending": return "bg-blue-100 text-blue-800";
      case "confirmed": return "bg-green-100 text-green-800";
      case "event_done": return "bg-purple-100 text-purple-800";
      default: return "bg-red-100 text-red-800";
    }
  };

  const getPaymentBadgeClass = (paymentStatus) => {
    switch (paymentStatus) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-red-100 text-red-800";
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <TitleAndSubheading title={`Manage Bookings (${bookings.length})`} />
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#179ac8] text-white">
              <tr>
                {/* <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">#</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Package</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking, index) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {/* <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={booking.userPhoto} alt={booking.userName} />
                      </div> */}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                        <div className="text-sm text-gray-500">{booking.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={booking.cart_Image} alt={booking.packageName} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{booking.packageName}</div>
                        <div className="text-sm text-gray-500">{booking.eventId?.category}</div>
                      </div>
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.date).toLocaleDateString()}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentBadgeClass(booking.paymentStatus)}`}>
                      {booking.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${booking.finalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => { setSelectedBooking(booking); setShowModal(true); }}
                        className="text-[#179ac8] hover:text-white hover:bg-[#179ac8] border border-[#179ac8] px-3 py-1 rounded text-xs"
                      >
                        View
                      </button>
                      {booking.status === "pending" && (
                        <button
                          onClick={() => handleApprove(booking)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Approve
                        </button>
                      )}
                      {booking.status === "confirmed" && booking.paymentStatus === "paid" && (
                        <button
                          onClick={() => handleComplete(booking)}
                          className="bg-[#179ac8] hover:bg-[#1485b0] text-white px-3 py-1 rounded text-xs"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AdminBookingModal 
          booking={selectedBooking} 
          onClose={() => setShowModal(false)} 
          onApprove={handleApprove}
          onComplete={handleComplete}
        />
      )}

      {/* <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#179ac8] mb-4">Booking Status Flow</h3>
        <div className="flex flex-col lg:flex-row justify-between items-center">
          {["Pending", "Payment Pending", "Confirmed", "Event Done"].map((step, index) => (
            <div key={index} className="flex items-center mb-4 lg:mb-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index < 3 ? "bg-[#179ac8] text-white" : "bg-gray-200"}`}>
                {index + 1}
              </div>
              <div className="ml-2">
                <div className="font-medium text-gray-700">{step}</div>
                <div className="text-xs text-gray-500">
                  {index === 0 && "User submits booking request"}
                  {index === 1 && "Admin approves, user needs to pay"}
                  {index === 2 && "Payment completed, event scheduled"}
                  {index === 3 && "Event completed, user can review"}
                </div>
              </div>
              {index < 3 && <div className="hidden lg:block mx-4 w-16 h-0.5 bg-[#179ac8]"></div>}
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default AdminManageBookings;