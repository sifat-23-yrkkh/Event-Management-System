import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import useAuth from '../hooks/useAuth';

const EmailVerificationPage = () => {
  const [verificationStatus, setVerificationStatus] = useState('checking'); // 'checking', 'verified', 'error'
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkEmailVerification } = useAuth();
  const auth = getAuth();

  useEffect(() => {
    const checkVerification = async () => {
      try {
        // Check if user is logged in and email is verified
        if (auth.currentUser) {
          const isVerified = await checkEmailVerification();
          if (isVerified) {
            setVerificationStatus('verified');
            setMessage('Your email has been verified successfully!');
            // Redirect to home page after 3 seconds
            setTimeout(() => {
              navigate('/');
            }, 3000);
          } else {
            setVerificationStatus('error');
            setMessage('Email verification is still pending. Please check your email and click the verification link.');
          }
        } else {
          // If no user is logged in, check for verification parameters
          const mode = searchParams.get('mode');
          const oobCode = searchParams.get('oobCode');
          
          if (mode === 'verifyEmail' && oobCode) {
            setVerificationStatus('verified');
            setMessage('Your email has been verified! You can now sign in to your account.');
          } else {
            setVerificationStatus('error');
            setMessage('Invalid verification link. Please try again or contact support.');
          }
        }
      } catch (error) {
        console.error('Error checking verification:', error);
        setVerificationStatus('error');
        setMessage('An error occurred while verifying your email. Please try again.');
      }
    };

    checkVerification();
  }, [auth.currentUser, checkEmailVerification, navigate, searchParams]);

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'checking':
        return (
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#009ee2]"></div>
        );
      case 'verified':
        return (
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'checking':
        return 'Verifying Your Email...';
      case 'verified':
        return 'Email Verified!';
      case 'error':
        return 'Verification Failed';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6 flex justify-center">
          {getStatusIcon()}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {getStatusTitle()}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="space-y-4">
          {verificationStatus === 'verified' && (
            <Link 
              to="/signin" 
              className="block w-full bg-[#009ee2] text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Go to Sign In
            </Link>
          )}
          
          {verificationStatus === 'error' && (
            <div className="space-y-2">
              <Link 
                to="/signin" 
                className="block w-full bg-[#009ee2] text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Go to Sign In
              </Link>
              <Link 
                to="/signup" 
                className="block w-full border border-[#009ee2] text-[#009ee2] font-medium py-2 px-4 rounded-md hover:bg-blue-50 transition-colors"
              >
                Create New Account
              </Link>
            </div>
          )}
          
          {verificationStatus === 'checking' && (
            <p className="text-sm text-gray-500">
              Please wait while we verify your email...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;