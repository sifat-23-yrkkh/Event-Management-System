import { useNavigate, useLocation } from 'react-router-dom';
import UnauthorizedModal from './components/UnauthorizedModal';
import useAuth from '../../../hooks/useAuth';
import useAdmin from '../../../hooks/useAdmin';
import useSender from '../../../hooks/useSender';
import useTraveler from '../../../hooks/useTraveler';

const Unauthorized = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  const [isSender, isSenderLoading] = useSender();
  const [isTraveler, isTravelerLoading] = useTraveler();

  // Get the required role from location state or default to admin
  const roleNeeded = location?.state?.role || 'Admin';

  const handleGoBack = () => {
    navigate('/');
  };

  const isLoading = isAdminLoading || isSenderLoading || isTravelerLoading;
  
  // Create proper array of user roles
  const userRolesArray = [];
  if (isAdmin) userRolesArray.push('Admin');
  if (isSender) userRolesArray.push('Sender');
  if (isTraveler) userRolesArray.push('Traveler');
  if (userRolesArray.length === 0) userRolesArray.push('Unauthorized');

  // Check if user has the required role
  const hasRole = userRolesArray.includes(roleNeeded);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Access Restricted</h1>
        <p className="text-lg text-gray-600 mb-8">
          You don't have permission to access this page
        </p>
        {!isLoading && (
          <p className="text-md text-gray-500 mb-4">
            Current role(s): {userRolesArray.join(', ')}
          </p>
        )}
        <p className="text-md text-gray-600 mb-6">
          Required role: <span className="font-semibold text-[#009ee2]">{roleNeeded}</span>
        </p>
        <button 
          onClick={handleGoBack}
          className="bg-[#009ee2] hover:bg-[#008dcb] text-white font-medium py-2 px-6 rounded-lg transition-colors">
          Return to Home
        </button>
      </div>
      
      {/* Show the modal with animation */}
      <UnauthorizedModal 
        roleNeeded={roleNeeded} 
        currentRoles={userRolesArray} 
        isLoading={isLoading}
        userEmail={user?.email}
        hasRole={hasRole}
      />
    </div>
  );
};

export default Unauthorized;