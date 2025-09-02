import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import useAuth from "../../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import animationImg from "../../../assets/AnimationLottie/AnimationLogin.json";
import Lottie from 'lottie-react';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, resendVerificationEmail, checkEmailVerification } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setShowResendVerification(false);
    setLoading(true);
    
    try {
      const result = await signIn(email, password);
      
      const isVerified = await checkEmailVerification(result.user);
      
      if (!isVerified) {
        await signOut(result.user.auth);
        throw new Error(
          "Please verify your email before signing in. Check your inbox for the verification link."
        );
      }

      try {
        await axiosSecure.patch('/users/updateEmailVerified', {
          email,
          emailVerified: true
        });
      } catch (backendError) {
        console.error("Failed to update backend verification status:", backendError);
      }

      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.message.includes('verify your email')) {
        setError(err.message);
        setShowResendVerification(true);
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password");
      } else if (err.code === 'auth/user-not-found') {
        setError("No account found with this email");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Sign in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail();
      toast.success("Verification email sent! Please check your inbox.");
    } catch (err) {
      console.error('Error resending verification email:', err);
      toast.error("Failed to send verification email. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen flex items-center justify-center">
      {/* Left Section - Animation */}
      <div className="w-full lg:w-1/2 bg-cover bg-center min-h-full hidden lg:block flex items-center justify-center">
        <Lottie animationData={animationImg} loop={true} className='w-full max-w-md' />
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-between pt-8 px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-12 mt-12 relative flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-[#009ee2] mb-1">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Login with email</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-6 w-full">
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="steve@travel.com"
                  className="w-full border border-gray-300 rounded-md px-10 py-2 focus:ring-2 focus:ring-[#009ee2] focus:border-[#009ee2] focus:outline-none"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <FaEnvelope className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs text-gray-500">Password</label>
                <Link to="/forgot-password" className="text-xs text-[#009ee2] hover:underline">
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full border border-gray-300 rounded-md px-10 py-2 focus:ring-2 focus:ring-[#009ee2] focus:border-[#009ee2] focus:outline-none"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <FaLock className="text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
                {showResendVerification && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="mt-2 text-sm text-[#009ee2] hover:underline font-medium"
                  >
                    Resend Verification Email
                  </button>
                )}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#009ee2] text-white font-medium py-2 rounded-md hover:bg-blue-600 transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>

            {/* Register Link */}
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/signUpFlow" className="text-[#009ee2] hover:underline">
                Register Now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;