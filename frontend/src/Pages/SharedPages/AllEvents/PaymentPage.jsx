import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCreditCard, FaSpinner, FaArrowRight, FaExclamationCircle } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [booking, setBooking] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 300);

    const initiatePayment = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(`/bookings/${id}/payment/initiate`);

        if (response.data.success && response.data.paymentUrl) {
          setPaymentUrl(response.data.paymentUrl);
          setBooking(response.data.booking);
          setProgress(100);
          
          setTimeout(() => {
            window.location.href = response.data.paymentUrl;
          }, 500);
        } else {
          throw new Error("Failed to initiate payment");
        }
      } catch (error) {
        console.error("Payment initiation error:", error);
        setProgress(100);
        setError(error.message || "Failed to initiate payment");
      } finally {
        setLoading(false);
        clearInterval(progressInterval);
      }
    };

    initiatePayment();

    return () => clearInterval(progressInterval);
  }, [id, axiosSecure, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin mb-6">
              <FaSpinner className="text-4xl text-[#179ac8]" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Preparing Your Payment</h2>
            <p className="text-gray-600 mb-6 text-center">Please wait while we connect to the payment gateway</p>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div 
                className="bg-[#179ac8] h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-3 h-3 bg-[#179ac8] rounded-full animate-bounce`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 text-red-500">
              <FaExclamationCircle className="text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            
            <div className="flex flex-col w-full space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-[#179ac8] hover:bg-[#1282b0] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Try Again <FaArrowRight />
              </button>
              
              <button
                onClick={() => navigate("/dashboard/my-orders")}
                className="text-[#179ac8] hover:text-[#1282b0] font-medium py-2 flex items-center justify-center gap-1"
              >
                Back to My Orders <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#179ac8] to-[#2ab7e3] p-6 text-white text-center">
          <div className="mb-4">
            <FaCreditCard className="text-5xl mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Complete Your Payment</h2>
          <p className="opacity-90">Secure payment processing</p>
        </div>
        
        <div className="p-6">
          {paymentUrl ? (
            <>
              <div className="mb-6">
                <p className="text-gray-700 mb-4 text-center">
                  You'll be redirected to our secure payment partner to complete your transaction.
                </p>
                
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg mb-6">
                  <span className="text-sm text-gray-600">Secure connection</span>
                  <span className="text-sm font-medium text-[#179ac8]">SSL Encrypted</span>
                </div>
              </div>
              
              <button
                onClick={() => (window.location.href = paymentUrl)}
                className="w-full bg-[#179ac8] hover:bg-[#1282b0] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Proceed to Payment <FaArrowRight />
              </button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </>
          ) : (
            <div className="text-center">
              <p className="text-red-500 mb-4">Failed to load payment page</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#179ac8] hover:bg-[#1282b0] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;