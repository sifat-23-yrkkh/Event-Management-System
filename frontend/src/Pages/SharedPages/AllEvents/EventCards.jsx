import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import TitleAndSubheading from "../../../Components/SharedComponets/TitleAndSubheading";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import {
  FiFilter,
  FiX,
  FiDollarSign,
  FiClock,
  FiUsers,
  FiVideo,
  FiChevronDown,
  FiSearch,
  FiGrid,
  FiList,
} from "react-icons/fi";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const EventCard = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    videography: "",
    minDuration: "",
    maxDuration: "",
    minTeamSize: "",
    maxTeamSize: "",
    sortBy: "newest",
    search: "",
  });

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosSecure.get("/events/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [axiosSecure]);

  useEffect(() => {
    const fetchAllEvents = async () => {
      setLoading(true);
      try {
        const response = await axiosSecure.get("/events/published");
        setAllEvents(response.data.data || response.data);
        setFilteredEvents(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, [axiosSecure]);
  useEffect(() => {
    const fetchUserBookmarks = async () => {
      if (!user?.email) return;

      try {
        const response = await axiosSecure.get(
          `/events/bookmarks/${user.email}`
        );
       
        const bookmarkIds = response.data.map((event) => event._id);
        setUserBookmarks(bookmarkIds);
      } catch (error) {
        console.error("Error fetching user bookmarks:", error);
      }
    };

    fetchUserBookmarks();
  }, [axiosSecure, user?.email]);
  const handleBookmark = async (eventId) => {
    if (!user) {
      toast.error("Please login to bookmark events");
      return;
    }

    const isCurrentlyBookmarked = userBookmarks.includes(eventId);

    try {
      const response = await axiosSecure.post(
        "/events/bookmark",
        {
          userEmail: user.email,
          eventId: eventId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update local bookmarks state
      if (isCurrentlyBookmarked) {
        setUserBookmarks((prev) => prev.filter((id) => id !== eventId));
        toast.success("Removed from bookmarks");
      } else {
        setUserBookmarks((prev) => [...prev, eventId]);
        toast.success("Added to bookmarks");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

  // Helper function to check if event is bookmarked
  const isEventBookmarked = (eventId) => {
    return userBookmarks.includes(eventId);
  };

  useEffect(() => {
    if (allEvents.length === 0) return;

    let results = [...allEvents];

    if (selectedCategory) {
      results = results.filter(
        (event) =>
          event.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(
        (event) =>
          event.package_name.toLowerCase().includes(searchTerm) ||
          event.category.toLowerCase().includes(searchTerm) ||
          (event.features &&
            event.features.some((feature) =>
              feature.toLowerCase().includes(searchTerm)
            )) ||
          (event.description &&
            event.description.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.minPrice) {
      const minPrice = Number(filters.minPrice);
      results = results.filter((event) => event.price >= minPrice);
    }
    if (filters.maxPrice) {
      const maxPrice = Number(filters.maxPrice);
      results = results.filter((event) => event.price <= maxPrice);
    }

    if (filters.minDuration) {
      const minDuration = Number(filters.minDuration);
      results = results.filter((event) => event.duration_hours >= minDuration);
    }
    if (filters.maxDuration) {
      const maxDuration = Number(filters.maxDuration);
      results = results.filter((event) => event.duration_hours <= maxDuration);
    }

    if (filters.minTeamSize) {
      const minTeamSize = Number(filters.minTeamSize);
      results = results.filter(
        (event) => event.photography_team_size >= minTeamSize
      );
    }
    if (filters.maxTeamSize) {
      const maxTeamSize = Number(filters.maxTeamSize);
      results = results.filter(
        (event) => event.photography_team_size <= maxTeamSize
      );
    }

    if (filters.videography !== "") {
      const wantsVideography = filters.videography === "true";
      results = results.filter(
        (event) => event.videography === wantsVideography
      );
    }

    switch (filters.sortBy) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        results.sort((a, b) => a.package_name.localeCompare(b.package_name));
        break;
      case "name-desc":
        results.sort((a, b) => b.package_name.localeCompare(a.package_name));
        break;
      case "duration-asc":
        results.sort((a, b) => a.duration_hours - b.duration_hours);
        break;
      case "duration-desc":
        results.sort((a, b) => b.duration_hours - a.duration_hours);
        break;
      case "popular":
        results.sort((a, b) => b.expected_attendance - a.expected_attendance);
        break;
      case "newest":
      default:
        results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredEvents(results);
  }, [allEvents, selectedCategory, filters]);

  const toggleFilter = () => {
    setFilterOpen(!isFilterOpen);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      videography: "",
      minDuration: "",
      maxDuration: "",
      minTeamSize: "",
      maxTeamSize: "",
      sortBy: "newest",
      search: "",
    });
    setSelectedCategory("");
  };

  
  const activeFiltersCount =
    Object.values(filters).filter((val) => val !== "" && val !== "newest")
      .length + (selectedCategory ? 1 : 0);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A-Z" },
    { value: "name-desc", label: "Name: Z-A" },
    { value: "duration-asc", label: "Duration: Shortest" },
    { value: "duration-desc", label: "Duration: Longest" },
    { value: "popular", label: "Most Popular" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <TitleAndSubheading
            title="Our Event Packages"
            subheading="Find the perfect package for your special occasion"
          />
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          {/* Top Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#179ac8] focus:border-transparent transition-colors"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-[#179ac8] focus:border-transparent text-gray-700 min-w-[180px]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#179ac8] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-[#179ac8] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FiList size={18} />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={toggleFilter}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isFilterOpen
                    ? "bg-[#179ac8] text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-[#179ac8] hover:text-[#179ac8]"
                }`}
              >
                {isFilterOpen ? <FiX size={20} /> : <FiFilter size={20} />}
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Categories Quick Filter */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => handleCategoryClick("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === ""
                  ? "bg-[#179ac8] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Categories
            </button>
            {categories?.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-[#179ac8] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Advanced Filters Panel */}
          {isFilterOpen && (
            <div className="border-t border-gray-100 pt-6 mt-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FiDollarSign className="text-[#179ac8]" />
                    Price Range
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Min Price
                      </label>
                      <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        placeholder="$0"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#179ac8] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Max Price
                      </label>
                      <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        placeholder="$5000+"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#179ac8] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FiClock className="text-[#179ac8]" />
                    Duration (Hours)
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Min Hours
                      </label>
                      <input
                        type="number"
                        name="minDuration"
                        value={filters.minDuration}
                        onChange={handleFilterChange}
                        placeholder="1"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#179ac8] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Max Hours
                      </label>
                      <input
                        type="number"
                        name="maxDuration"
                        value={filters.maxDuration}
                        onChange={handleFilterChange}
                        placeholder="12+"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#179ac8] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Team Size */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FiUsers className="text-[#179ac8]" />
                    Photography Team
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Min Team
                      </label>
                      <input
                        type="number"
                        name="minTeamSize"
                        value={filters.minTeamSize}
                        onChange={handleFilterChange}
                        placeholder="1"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#179ac8] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Max Team
                      </label>
                      <input
                        type="number"
                        name="maxTeamSize"
                        value={filters.maxTeamSize}
                        onChange={handleFilterChange}
                        placeholder="10+"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#179ac8] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FiVideo className="text-[#179ac8]" />
                    Features
                  </h3>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Videography
                    </label>
                    <select
                      name="videography"
                      value={filters.videography}
                      onChange={handleFilterChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#179ac8] focus:border-transparent"
                    >
                      <option value="">All Options</option>
                      <option value="true">With Videography</option>
                      <option value="false">Photography Only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  {filteredEvents?.length || 0} events found
                </div>
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX size={16} />
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredEvents?.length > 0 ? (
              <div
                className={`grid gap-8 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 max-w-4xl mx-auto"
                }`}
              >
                {filteredEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 ${
                      viewMode === "list" ? "flex flex-col md:flex-row" : ""
                    }`}
                  >
                    {/* Event Image */}
                    <div
                      className={`relative overflow-hidden ${
                        viewMode === "list" ? "md:w-80 h-64 md:h-auto" : "h-56"
                      }`}
                    >
                      <img
                        src={event?.cart_Image}
                        alt={event?.package_name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {event?.package_name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="bg-[#179ac8]/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {event?.category}
                          </span>
                          <div className="bg-white/95 text-[#179ac8] font-bold px-4 py-1 rounded-full shadow-lg">
                            ${event?.price}
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleBookmark(event._id);
                          }}
                          className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-[#179ac8] hover:text-white transition-colors"
                          title={
                            isEventBookmarked(event._id)
                              ? "Remove bookmark"
                              : "Add bookmark"
                          }
                        >
                          {isEventBookmarked(event._id) ? (
                            <FaBookmark className="text-[#179ac8]" size={18} />
                          ) : (
                            <FaRegBookmark
                              className="text-gray-600"
                              size={18}
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6 flex-1">
                      {/* Features */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">
                          What's Included:
                        </h4>
                        <ul className="space-y-2">
                          {event?.features && Array.isArray(event.features) ? (
                            event.features
                              .slice(0, viewMode === "list" ? 6 : 4)
                              .map((feature, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start text-sm text-gray-600"
                                >
                                  <span className="text-[#179ac8] mr-2 mt-1 font-bold">
                                    •
                                  </span>
                                  {feature}
                                </li>
                              ))
                          ) : (
                            <div className="text-gray-500 text-sm">
                              No features available
                            </div>
                          )}
                          {event?.features?.length >
                            (viewMode === "list" ? 6 : 4) && (
                            <li className="text-sm text-[#179ac8] font-medium">
                              +{" "}
                              {event.features.length -
                                (viewMode === "list" ? 6 : 4)}{" "}
                              more features
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <FiUsers className="text-[#179ac8]" size={16} />
                          <div>
                            <div className="font-medium text-gray-800">
                              {event?.photography_team_size}
                            </div>
                            <div className="text-gray-500 text-xs">
                              Photographers
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <FiVideo
                            className={
                              event?.videography
                                ? "text-[#179ac8]"
                                : "text-gray-400"
                            }
                            size={16}
                          />
                          <div>
                            <div className="font-medium text-gray-800">
                              {event?.videography ? "Included" : "Not Included"}
                            </div>
                            <div className="text-gray-500 text-xs">
                              Videography
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <FiClock className="text-[#179ac8]" size={16} />
                          <div>
                            <div className="font-medium text-gray-800">
                              {event?.duration_hours}h
                            </div>
                            <div className="text-gray-500 text-xs">
                              Duration
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <FiUsers className="text-[#179ac8]" size={16} />
                          <div>
                            <div className="font-medium text-gray-800">
                              {event?.staff_team_size}
                            </div>
                            <div className="text-gray-500 text-xs">
                              Staff Members
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-between items-center">
                        <Link
                          to={`/events/${event._id}`}
                          className="bg-[#179ac8] hover:bg-[#1482ac] text-white px-4 py-2 rounded-md transition-colors duration-300 inline-block"
                        >
                          View Details
                        </Link>

                        <Link
                          to={`/event/${event._id}`}
                          className="text-[#179ac8] hover:text-[#1482ac] font-medium inline-block"
                        >
                          Customize Event
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    No Events Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    No events match your current filters. Try adjusting your
                    search criteria.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-[#179ac8] hover:bg-[#147a9e] text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

     
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EventCard;
