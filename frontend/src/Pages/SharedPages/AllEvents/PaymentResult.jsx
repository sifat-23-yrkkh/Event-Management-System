import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const status = searchParams.get('status');
  const bookingId = searchParams.get('bookingId');
  const error = searchParams.get('error');

  useEffect(() => {
    const showResult = async () => {
      let title, icon, text;
      
      switch (status) {
        case 'success':
          title = 'Payment Successful!';
          icon = 'success';
          text = 'Your payment has been processed successfully.';
          
          // You might want to verify payment on backend here
          try {
            await axiosSecure.post(`/bookings/${bookingId}/payment/verify`);
          } catch (err) {
            console.error('Payment verification error:', err);
          }
          break;
          
        case 'failed':
          title = 'Payment Failed';
          icon = 'error';
          text = error || 'Your payment could not be processed.';
          break;
          
        case 'cancelled':
          title = 'Payment Cancelled';
          icon = 'warning';
          text = 'You cancelled the payment process.';
          break;
          
        default:
          title = 'Payment Status Unknown';
          icon = 'info';
          text = 'We could not determine the status of your payment.';
      }

      Swal.fire({
        title,
        text,
        icon,
        confirmButtonColor: '#179ac8',
        confirmButtonText: 'View Booking'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/bookings/${bookingId}`);
        } else {
          navigate('/my-bookings');
        }
      });
    };

    showResult();
  }, [status, bookingId, error, navigate, axiosSecure]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-4 text-gray-600">Processing payment result...</p>
      </div>
    </div>
  );
};

export default PaymentResult;