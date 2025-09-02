import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";


const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const bookingId = searchParams.get("bookingId");
  const status = searchParams.get("status");

  useEffect(() => {
    const processPayment = async () => {
      try {
        if (status === "success" && bookingId) {
          // Verify payment with backend
          await axiosSecure.get(`/bookings/payment/verify/${bookingId}`);
        }
        navigate(`/dashboard/payment-result/${bookingId}?status=${status}`);
      } catch (error) {
        navigate(`/dashboard/payment-result/${bookingId}?status=failed`);
      }
    };

    processPayment();
  }, [status, bookingId, navigate, axiosSecure]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-4 text-gray-600">Processing your payment...</p>
      </div>
    </div>
  );
};

export default PaymentCallback;