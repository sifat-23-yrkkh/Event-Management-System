const AdminBookingModal = ({ booking, onClose, onApprove, onComplete }) => {
  if (!booking) return null;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#179ac8] text-white p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">Booking Management - {booking.packageName}</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">
            &times;
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-[#179ac8] mb-3">Customer Info</h4>
            <div className="flex items-center space-x-4 mb-4">
              <img src={booking.userPhoto} alt={booking.userName} className="w-16 h-16 rounded-full" />
              <div>
                <p className="font-bold">{booking.userName}</p>
                <p className="text-sm text-gray-600">{booking.userEmail}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">User ID:</span> {booking.userId}</p>
              <p><span className="font-medium">Booking Date:</span> {new Date(booking.createdAt).toLocaleString()}</p>
              <div className="flex items-center">
                <span className="font-medium mr-2">Status:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                  {booking.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Payment:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentBadgeClass(booking.paymentStatus)}`}>
                  {booking.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-[#179ac8] mb-3">Package Details</h4>
            <img src={booking.cart_Image} alt={booking.packageName} className="w-full h-40 object-cover rounded-lg mb-3" />
            <div className="space-y-2">
              <p><span className="font-medium">Package:</span> {booking.packageName}</p>
              <p><span className="font-medium">Category:</span> {booking.eventId?.category}</p>
              <p><span className="font-medium">Event Date:</span> {new Date(booking.date).toLocaleString()}</p>
              <p><span className="font-medium">Duration:</span> {booking.durationHours} hours</p>
              <p><span className="font-medium">Attendance:</span> {booking.expectedAttendance} people</p>
              <p><span className="font-medium">Photography:</span> {booking.photographyTeamSize} person(s)</p>
              <p><span className="font-medium">Videography:</span> {booking.videography ? "Yes" : "No"}</p>
              <p><span className="font-medium">Staff Team:</span> {booking.staffTeamSize} person(s)</p>
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-[#179ac8] mb-3">Financial Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span className="font-semibold">${booking.totalPrice.toLocaleString()}</span>
              </div>
              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Discount:</span>
                  <span>-${booking.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Final Amount:</span>
                <span className="text-green-600">${booking.finalPrice.toLocaleString()}</span>
              </div>
              {booking.transactionId && (
                <div className="mt-3">
                  <p className="font-medium">Transaction ID:</p>
                  <p className="text-sm bg-gray-100 p-2 rounded break-all">{booking.transactionId}</p>
                </div>
              )}
              <div className="mt-4 text-sm text-gray-600">
                <p><span className="font-medium">Created:</span> {new Date(booking.createdAt).toLocaleString()}</p>
                <p><span className="font-medium">Updated:</span> {new Date(booking.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Package Features */}
          <div className="lg:col-span-3 bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-[#179ac8] mb-3">Package Features</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {booking.features?.map((feature, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded px-3 py-2 text-sm">
                  ✓ {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <div className="flex space-x-2">
            {booking.status === "pending" && (
              <button
                onClick={() => { onApprove(booking); onClose(); }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve Booking
              </button>
            )}
            {booking.status === "confirmed" && booking.paymentStatus === "paid" && (
              <button
                onClick={() => { onComplete(booking); onClose(); }}
                className="bg-[#179ac8] hover:bg-[#1485b0] text-white px-4 py-2 rounded"
              >
                Mark as Completed
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="border border-[#179ac8] text-[#179ac8] hover:bg-[#179ac8] hover:text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingModal;