const UserBookingModal = ({ booking, onClose, onPayment }) => {
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#179ac8] text-white p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">Booking Details</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">
            &times;
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Package Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-[#179ac8] mb-3">Package Information</h4>
            <img 
              src={booking.cart_Image} 
              alt={booking.packageName}
              className="w-full h-48 object-cover rounded-lg mb-3"
            />
            <div className="space-y-2">
              <p><span className="font-medium">Package:</span> {booking.packageName}</p>
              <p><span className="font-medium">Category:</span> {booking.eventId?.category}</p>
              <p><span className="font-medium">Price:</span> ${booking.totalPrice.toLocaleString()}</p>
              {booking.discountAmount > 0 && (
                <p><span className="font-medium">Discount:</span> -${booking.discountAmount.toLocaleString()}</p>
              )}
              <p><span className="font-medium">Final Price:</span> ${booking.finalPrice.toLocaleString()}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-[#179ac8] mb-3">Booking Details</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Booking Date:</span> {new Date(booking.date).toLocaleString()}</p>
              <p><span className="font-medium">Duration:</span> {booking.durationHours} hours</p>
              <p><span className="font-medium">Expected Attendance:</span> {booking.expectedAttendance}</p>
              <p><span className="font-medium">Photography Team:</span> {booking.photographyTeamSize} member(s)</p>
              <p><span className="font-medium">Videography:</span> {booking.videography ? 'Yes' : 'No'}</p>
              <p><span className="font-medium">Staff Team:</span> {booking.staffTeamSize} member(s)</p>
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
              {booking.transactionId && (
                <div>
                  <p className="font-medium">Transaction ID:</p>
                  <p className="text-sm bg-gray-100 p-2 rounded break-all">{booking.transactionId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-[#179ac8] mb-3">Package Features</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {booking.features?.map((feature, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded px-3 py-2 text-sm">
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* User Information */}
          <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-[#179ac8] mb-3">User Information</h4>
            <div className="flex items-center space-x-4">
              <img src={booking.userPhoto} alt={booking.userName} className="w-16 h-16 rounded-full" />
              <div>
                <p><span className="font-medium">Name:</span> {booking.userName}</p>
                <p><span className="font-medium">Email:</span> {booking.userEmail}</p>
                <p><span className="font-medium">Created:</span> {new Date(booking.createdAt).toLocaleString()}</p>
                <p><span className="font-medium">Updated:</span> {new Date(booking.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          {booking.status === 'payment_pending' && booking.paymentStatus === 'pending' && (
            <button
              onClick={() => { onPayment(booking); onClose(); }}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Proceed to Payment
            </button>
          )}
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

export default UserBookingModal;