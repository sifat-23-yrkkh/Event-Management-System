// PaymentResult.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaArrowRight, FaSpinner } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const PaymentResult = () => {
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const status = searchParams.get('status');
  const bookingId = searchParams.get('bookingId');
  const error = searchParams.get('error');
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyPayment = async () => {
      if (status === 'success') {
        setIsVerifying(true);
        try {
          const response = await axiosSecure.get(`/bookings/payment/verify/${bookingId}`);
          if (!response.data.verified) {
            throw new Error('Payment verification failed');
          }
        } catch (err) {
          console.error('Payment verification error:', err);
          Swal.fire({
            title: 'Verification Needed',
            text: 'We need to manually verify your payment',
            icon: 'info'
          });
        } finally {
          setIsVerifying(false);
        }
      }
    };

    verifyPayment();

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard/my-orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, bookingId, axiosSecure, navigate]);

  const getResultData = () => {
    switch (status) {
      case 'success':
        return {
          icon: <FaCheckCircle className="text-6xl text-green-500" />,
          title: 'Payment Successful!',
          message: 'Your payment has been processed successfully.',
          bgColor: 'bg-green-50'
        };
      case 'failed':
        return {
          icon: <FaTimesCircle className="text-6xl text-red-500" />,
          title: 'Payment Failed',
          message: error || 'Your payment could not be processed.',
          bgColor: 'bg-red-50'
        };
      case 'cancelled':
        return {
          icon: <FaExclamationTriangle className="text-6xl text-yellow-500" />,
          title: 'Payment Cancelled',
          message: 'You cancelled the payment process.',
          bgColor: 'bg-yellow-50'
        };
      default:
        return {
          icon: <FaExclamationTriangle className="text-6xl text-gray-500" />,
          title: 'Payment Status Unknown',
          message: 'We could not determine the payment status.',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const result = getResultData();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${result.bgColor}`}>
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {isVerifying ? (
          <div className="flex flex-col items-center">
            <FaSpinner className="text-4xl text-blue-500 animate-spin mb-4" />
            <p>Verifying your payment...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">{result.icon}</div>
            <h2 className="text-2xl font-bold mb-2">{result.title}</h2>
            <p className="mb-6">{result.message}</p>
            
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(5 - countdown) * 20}%` }}
                ></div>
              </div>
              <p className="text-sm mt-2">
                Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => navigate('/dashboard/my-orders')}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
              >
                View Orders <FaArrowRight />
              </button>
              {status === 'failed' && (
                <button
                  onClick={() => navigate(`/dashboard/bookings/${bookingId}/payment`)}
                  className="border border-gray-300 hover:bg-gray-100 py-2 px-4 rounded"
                >
                  Try Again
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;