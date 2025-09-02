import { createContext, useEffect, useState } from "react";
import {
 
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  reload,
} from "firebase/auth";
import { app } from "../firebase/firebase.configue";
import toast from "react-hot-toast";
// import { useUserStore } from '../hooks/userStore'

export const AuthContext = createContext(null);
const auth = getAuth(app);


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const { fetchUserInfo, clearUser } = useUserStore()

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Check if email is verified
      if (!result.user.emailVerified) {
        // Sign out the user immediately if email is not verified
        await signOut(auth);
        throw new Error(
          "Please verify your email before signing in. Check your inbox for the verification link."
        );
      }

      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };


  const sendVerificationEmail = async (user) => {
    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/signin`, // Redirect to signin page after verification
        handleCodeInApp: false,
      });
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error("Failed to send verification email. Please try again.");
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      try {
        await sendEmailVerification(auth.currentUser, {
          url: `${window.location.origin}/signin`,
          handleCodeInApp: false,
        });
        toast.success("Verification email sent! Please check your inbox.");
      } catch (error) {
        console.error("Error sending verification email:", error);
        toast.error("Failed to send verification email. Please try again.");
        throw error;
      }
    }
  };

  const checkEmailVerification = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      return auth.currentUser.emailVerified;
    }
    return false;
  };

  const resetPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  const logOut = async () => {
    setLoading(true);
    await signOut(auth);
    // clearUser() // Clear user store on logout
    toast.success("Logout successful");
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // if (user && !user.displayName) {
      //     return
      // }
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    setLoading,
    createUser,
    signIn,
    resetPassword,
    logOut,
    updateUserProfile,
    sendVerificationEmail,
    resendVerificationEmail,
    checkEmailVerification,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
