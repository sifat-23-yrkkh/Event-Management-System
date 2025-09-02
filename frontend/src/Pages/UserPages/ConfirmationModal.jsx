// components/ConfirmationModal.jsx
import { useState } from 'react';
import { toast } from 'react-toastify';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  bookingDetails,
  onCouponApply,
  onCheckout 
}) => {

  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  if (!isOpen) return null;



  const finalPrice = bookingDetails.totalPrice - discount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Order Confirmation</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Event Details</h3>
          <div className="flex items-start mb-4">
            <img 
              src={bookingDetails.cart_Image} 
              alt={bookingDetails.packageName} 
              className="w-24 h-24 object-cover rounded mr-4"
            />
            <div>
              <p className="font-bold">{bookingDetails.packageName}</p>
              <p>Date: {new Date(bookingDetails.date).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p><span className="font-semibold">Duration:</span> {bookingDetails.durationHours} hours</p>
              <p><span className="font-semibold">Photography Team:</span> {bookingDetails.photographyTeamSize} members</p>
            </div>
            <div>
              <p><span className="font-semibold">Staff Team:</span> {bookingDetails.staffTeamSize} members</p>
              <p><span className="font-semibold">Videography:</span> {bookingDetails.videography ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          {bookingDetails.features && bookingDetails.features.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold">Additional Features:</h4>
              <ul className="list-disc pl-5">
                {bookingDetails.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Pricing</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Base Price:</span>
              <span>{bookingDetails.totalPrice.toLocaleString()} taka</span>
            </div>
            {isCouponApplied && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({couponCode}):</span>
                <span>-{discount.toLocaleString()} taka</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total:</span>
              <span>{finalPrice.toLocaleString()} taka</span>
            </div>
          </div>
        </div>

        

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>
          <button
            onClick={() => onCheckout(finalPrice)}
            className="bg-[#179ac8] text-white px-4 py-2 rounded hover:bg-[#1482b0]"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;