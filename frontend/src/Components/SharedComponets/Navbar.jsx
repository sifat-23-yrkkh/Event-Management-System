import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, Home, Calendar, Mail, User2 } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/logo.png";
const Navbar = () => {
  const { logOut, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <nav className="px-8 flex items-center justify-between relative bg-white text-[#179ac8] shadow-lg">
      {/* Logo */}
      <Link to="/">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Eventor Logo" className="w-24" />
          {/* <h1 className="text-2xl font-bold text-[#179ac8]">Eventor</h1> */}
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-8">
        <Link
          to="/"
          className="flex items-center text-[#179ac8] hover:bg-[#179ac8] hover:text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Link>
        <Link
          to="/events"
          className="flex items-center text-[#179ac8] hover:bg-[#179ac8] hover:text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Events
        </Link>
        <Link
          to="/contact"
          className="flex items-center text-[#179ac8] hover:bg-[#179ac8] hover:text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <Mail className="mr-2 h-4 w-4" />
          Contact Us
        </Link>

        {user?.email ? (
          <div className="relative flex items-center ml-4">
            {/* Avatar and Dropdown */}
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2"
              aria-label="User menu"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="rounded-full w-10 h-10 border-2 border-[#179ac8]"
                />
              ) : (
                <User className="text-white rounded-full bg-[#179ac8] p-1 h-8 w-8" />
              )}
            </button>

            {isDropdownOpen && (
              <div
                className="absolute bg-white text-[#179ac8] rounded-lg shadow-lg right-0 mt-2 w-48 z-50 border border-gray-200"
                style={{ top: "100%" }}
              >
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium">
                    {user.displayName || user.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                <Link
                  to="/dashboard"
                  className="px-4 py-2 hover:bg-[#179ac8] hover:text-white w-full text-left flex items-center space-x-2 transition-colors duration-200"
                >
                  <Calendar className="text-current h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 hover:bg-[#179ac8] hover:text-white text-[#179ac8] transition-colors duration-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User2 className="text-current h-4 w-4 mr-3" />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={logOut}
                  className="px-4 py-2 hover:bg-red-50 hover:text-red-600 w-full text-left flex items-center space-x-2 transition-colors duration-200 border-t border-gray-200"
                >
                  <X className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/signUpFlow"
            className="bg-[#179ac8] text-white hover:bg-[#147a9a] px-4 py-2 rounded-lg font-medium flex items-center transition-colors duration-200"
          >
            <User className="mr-2 h-4 w-4" />
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center space-x-4">
        {user?.email && (
          <button
            onClick={toggleDropdown}
            className="flex items-center"
            aria-label="User menu"
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "User"}
                className="rounded-full w-8 h-8 border-2 border-[#179ac8]"
              />
            ) : (
              <User className="text-[#179ac8] h-6 w-6" />
            )}
          </button>
        )}

        <button
          className="text-xl text-[#179ac8] p-1"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full flex flex-col items-start space-y-1 p-4 z-50 shadow-lg bg-white border-t border-gray-200">
          <Link
            to="/"
            className="flex items-center text-[#179ac8] hover:bg-[#179ac8] hover:text-white px-3 py-2 rounded-lg w-full transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
          <Link
            to="/events"
            className="flex items-center text-[#179ac8] hover:bg-[#179ac8] hover:text-white px-3 py-2 rounded-lg w-full transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </Link>
          <Link
            to="/contact"
            className="flex items-center text-[#179ac8] hover:bg-[#179ac8] hover:text-white px-3 py-2 rounded-lg w-full transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact Us
          </Link>

          {!user?.email && (
            <Link
              to="/signUpFlow"
              className="bg-[#179ac8] text-white hover:bg-[#147a9a] px-3 py-2 rounded-lg w-full flex items-center mt-2 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          )}
        </div>
      )}

      {/* Mobile User Dropdown */}
      {isDropdownOpen && user?.email && (
        <div className="md:hidden absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg z-50 w-60 mr-2 border border-gray-200">
          <div className="p-3 border-b border-gray-200">
            <p className="font-medium text-[#179ac8]">
              {user.displayName || "User"}
            </p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>

          <Link
            to="/dashboard"
            className="flex items-center px-4 py-3 hover:bg-[#179ac8] hover:text-white text-[#179ac8] transition-colors duration-200"
            onClick={() => setIsDropdownOpen(false)}
          >
            <Calendar className="text-current h-4 w-4 mr-3" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/profile"
            className="flex items-center px-4 py-3 hover:bg-[#179ac8] hover:text-white text-[#179ac8] transition-colors duration-200"
            onClick={() => setIsDropdownOpen(false)}
          >
            <User2 className="text-current h-4 w-4 mr-3" />
            <span>Profile</span>
          </Link>

          <button
            onClick={() => {
              logOut();
              setIsDropdownOpen(false);
            }}
            className="flex items-center px-4 py-3 hover:bg-red-50 hover:text-red-600 text-[#179ac8] w-full border-t border-gray-200 transition-colors duration-200"
          >
            <X className="h-4 w-4 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
