import { useEffect, useState } from "react";

import {
  FaBookmark,
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";
import { MdCategory, MdOutlineFeaturedPlayList } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";

const BookmarkedEvents = () => {
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchBookmarkedEvents = async () => {
      try {
        const response = await axiosSecure.get(
          `/events/bookmarks/${user?.email}`
        );
        setBookmarkedEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching bookmarked events:", err);
      }
    };

    fetchBookmarkedEvents();
  }, [user?.email]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#179ac8]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
        role="alert"
      >
        <p>Error loading bookmarked events: {error}</p>
      </div>
    );
  }

  if (bookmarkedEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <FaBookmark className="mx-auto text-4xl text-[#179ac8] mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">
          No Bookmarked Events
        </h3>
        <p className="text-gray-500">You haven't bookmarked any events yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#179ac8]">
          Your Bookmarked Events
        </h1>
        <p className="text-gray-600">All events you've saved for later</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarkedEvents.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative">
              <img
                src={event.cart_Image}
                alt={event.package_name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-[#179ac8] text-white px-2 py-1 rounded-full text-xs font-semibold">
                <FaBookmark className="inline mr-1" /> Bookmarked
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {event.package_name}
              </h3>

              <div className="flex items-center text-gray-600 mb-2">
                <MdCategory className="mr-2 text-[#179ac8]" />
                <span>{event.category}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-2">
                <FaDollarSign className="mr-2 text-[#179ac8]" />
                <span>${event.price.toLocaleString()}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-2">
                <FaClock className="mr-2 text-[#179ac8]" />
                <span>{event.duration_hours} hours</span>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <FaUsers className="mr-2 text-[#179ac8]" />
                <span>Up to {event.expected_attendance} attendees</span>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                  <MdOutlineFeaturedPlayList className="mr-2 text-[#179ac8]" />
                  Features
                </h4>
                <ul className="list-disc list-inside text-gray-600 text-sm">
                  {event.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

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
    </div>
  );
};

export default BookmarkedEvents;
