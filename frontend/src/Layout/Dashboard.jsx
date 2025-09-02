import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBox,
  FaMoneyBillWave,
  FaHome,
  FaSignOutAlt,
  FaUsersCog,
  FaChartLine,
  FaShieldAlt,
  FaStar,
  FaCalendarAlt,
  FaTicketAlt,
  FaRegCalendarCheck,
  FaBookmark,
} from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { GiTargetPoster } from "react-icons/gi";
import useAuth from "../hooks/useAuth";
import UseAdmin from "../hooks/useAdmin";

const Dashboard = () => {
  const { user, logOut } = useAuth();
  const [isAdmin] = UseAdmin();
  const navigate = useNavigate();

  const userRole = isAdmin ? "admin" : "user";

  const userLinks = [
    { name: "My Profile", path: "/dashboard/profile", icon: <FaUser /> },
    { name: "My Orders", path: "/dashboard/my-orders", icon: <FaBox /> },
    {
      name: "Payments",
      path: "/dashboard/payments",
      icon: <FaMoneyBillWave />,
    },
    {
      name: "My Bookmarks",
      path: "/dashboard/my-bookmarkedEvents",
      icon: <FaBookmark />,
    },
    { name: "My Reviews", path: "/dashboard/user/reviews", icon: <FaStar /> },
  ];

  const adminLinks = [
    { name: "Admin Profile", path: "/dashboard/profile", icon: <FaUser /> },
    {
      name: "User Management",
      path: "/dashboard/manage-users",
      icon: <FaUsersCog />,
    },
    {
      name: "Add Events",
      path: "/dashboard/addEvents",
      icon: <FaMoneyBillWave />,
    },
    {
      name: "All Orders",
      path: "/dashboard/all-orders",
      icon: <FaChartLine />,
    },
    {
      name: "All Payments",
      path: "/dashboard/all-payments",
      icon: <FaShieldAlt />,
    },
    // { name: "Platform Analytics", path: "/dashboard/analytics", icon: <FaChartLine /> },
    // { name: "Content Moderation", path: "/dashboard/moderation", icon: <FaShieldAlt /> },
    { name: "All Reviews", path: "/dashboard/reviews", icon: <FaStar /> },

    // // Admin Event Management
    { name: "Event Management", path: "admin/events", icon: <FaCalendarAlt /> },
    // { name: "Event Categories", path: "/dashboard/event-categories", icon: <GiTargetPoster /> },
    // { name: "Ticket Sales", path: "/dashboard/ticket-sales", icon: <FaTicketAlt /> },
    // { name: "Event Reports", path: "/dashboard/event-reports", icon: <FaChartLine /> },
  ];

  // Get appropriate links based on user role
  const getLinksForRole = () => {
    switch (userRole) {
      case "admin":
        return adminLinks;
      default:
        return userLinks;
    }
  };

  const linksToShow = getLinksForRole();

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Always visible now */}
      <aside
        className="flex flex-col w-64 px-4 py-6"
        style={{ backgroundColor: "#179ac8" }}
      >
        {/* Logo and Title */}
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-2xl font-bold text-white">Eventor</h1>
        </div>

        {/* User Profile Section */}
        <div className="flex flex-col items-center mt-2 -mx-2">
          <img
            className="object-cover w-16 h-16 mx-2 rounded-full border-4 border-white"
            src={user?.photoURL || "https://via.placeholder.com/40"}
            alt="user avatar"
          />
          <h4 className="mx-2 mt-3 font-medium text-white">
            {user?.displayName || "User"}
          </h4>
          <p className="mx-2 mt-1 text-xs font-medium text-white/90">
            {user?.email}
          </p>
          <div className="mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-white text-[#179ac8]">
            {userRole.toUpperCase()}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-8">
          <ul className="flex flex-col gap-1">
            {linksToShow.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 transition-all duration-200 ease-in-out rounded-lg hover:bg-blue-400 hover:bg-opacity-30 ${isActive
                      ? "bg-white text-[#179ac8] font-semibold"
                      : "text-white"
                    }`
                  }
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                    {link.icon}
                  </span>
                  <span className="text-sm">{link.name}</span>
                </NavLink>
              </li>
            ))}

            {/* Divider */}
            <div className="border-t border-white/20 my-3"></div>

            {/* Home Link */}
            <li>
              <NavLink
                to="/"
                className="flex items-center px-4 py-3 text-white transition-all duration-200 ease-in-out rounded-lg hover:bg-blue-400 hover:bg-opacity-30"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                  <FaHome />
                </span>
                <span className="text-sm">Home</span>
              </NavLink>
            </li>

            {/* Logout Button */}
            <li>
              <button
                onClick={handleLogOut}
                className="w-full flex items-center px-4 py-3 text-white transition-all duration-200 ease-in-out rounded-lg hover:bg-blue-400 hover:bg-opacity-30 text-left"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                  <FaSignOutAlt />
                </span>
                <span className="text-sm">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm min-h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
