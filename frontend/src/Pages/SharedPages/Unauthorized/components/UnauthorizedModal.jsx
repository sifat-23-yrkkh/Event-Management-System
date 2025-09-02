import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedModal = ({ 
  roleNeeded = 'Admin', 
  currentRoles = [], 
  isLoading = false, 
  userEmail = null,
  hasRole = false
}) => {
  const [visible, setVisible] = useState(true);
  const [animatedText, setAnimatedText] = useState('');
  const fullText = `Travel Trade requires ${roleNeeded} access`;
  
  // Ensure currentRoles is always an array
  const rolesArray = Array.isArray(currentRoles) ? currentRoles : 
                    (currentRoles ? [currentRoles] : []);
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setAnimatedText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, [fullText]);

  // Determine if user is logged in based on email presence
  const isLoggedIn = !!userEmail;

  // Get personalized message based on user state
  const getPersonalizedMessage = () => {
    if (isLoading) return "Checking your access privileges...";
    
    if (!isLoggedIn) {
      return `To access this page, you need to log in and have ${roleNeeded} privileges.`;
    }
    
    if (hasRole || rolesArray.includes(roleNeeded)) {
      return "There seems to be an error. Our system indicates you should have access to this page. Please try refreshing or contact support.";
    }
    
    if (roleNeeded === 'Admin') {
      return "Admin access is restricted to authorized personnel only. If you believe you should have this access, please contact support.";
    }
    
    return `To access this page, you need to have ${roleNeeded} privileges. Please complete the registration process for this role.`;
  };

  // Get appropriate action button based on user state
  const getActionButton = () => {
    if (isLoading) {
      return (
        <button
          disabled
          className="inline-block w-full bg-gray-300 text-gray-500 font-medium py-2 px-4 rounded cursor-not-allowed">
          Loading...
        </button>
      );
    }
    
    if (!isLoggedIn) {
      return (
        <Link 
          to="/login" 
          className="inline-block w-full bg-[#009ee2] hover:bg-[#008dcb] text-white font-medium py-2 px-4 rounded transition-colors">
          Log in
        </Link>
      );
    }
    
    if (hasRole || rolesArray.includes(roleNeeded)) {
      return (
        <button
          onClick={() => window.location.reload()}
          className="inline-block w-full bg-[#009ee2] hover:bg-[#008dcb] text-white font-medium py-2 px-4 rounded transition-colors">
          Refresh page
        </button>
      );
    }
    
    if (roleNeeded === 'Admin') {
      return (
        <Link 
          to="/contact-support" 
          className="inline-block w-full bg-[#009ee2] hover:bg-[#008dcb] text-white font-medium py-2 px-4 rounded transition-colors">
          Contact support
        </Link>
      );
    }
    
    return (
      <Link 
        to={`/register/${roleNeeded.toLowerCase()}`}
        className="inline-block w-full bg-[#009ee2] hover:bg-[#008dcb] text-white font-medium py-2 px-4 rounded transition-colors">
        Register as {roleNeeded}
      </Link>
    );
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
         style={{ transition: 'opacity 0.3s ease-in-out' }}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setVisible(false)}></div>
      <div className="bg-white rounded-lg p-8 shadow-xl z-10 max-w-md w-full mx-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unauthorized Access</h2>
          
          <div className="h-16 flex items-center justify-center mb-6">
            <p className="text-xl font-medium text-[#009ee2]">{animatedText}<span className="animate-pulse">|</span></p>
          </div>
          
          {isLoggedIn && !isLoading && (
            <div className="mb-4 text-sm text-gray-500">
              Logged in as: {userEmail}
              <br />
              {rolesArray.length > 0 && `Role(s): ${rolesArray.join(', ')}`}
            </div>
          )}
          
          <p className="mb-6 text-gray-600">
            {getPersonalizedMessage()}
          </p>
          
          <div className="flex flex-col space-y-3">
            {getActionButton()}
            
            <button 
              onClick={() => setVisible(false)}
              className="inline-block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors">
              Go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedModal;