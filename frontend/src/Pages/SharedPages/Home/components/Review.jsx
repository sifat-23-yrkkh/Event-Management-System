import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import TitleAndSubheading from "../../../../Components/SharedComponets/TitleAndSubheading";

const Review = () => {
  const axiosSecure = useAxiosSecure();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.get("/review");
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-lg text-gray-600">No reviews available</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TitleAndSubheading title="User Reviews"></TitleAndSubheading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200"
          >
            {/* User Info */}
            <div className="flex items-center mb-4">
              {/* <img
                src={review.userPhoto}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 mr-3"
                alt={review.userName}
              /> */}
              <div>
                <h3 className="font-semibold text-gray-800">
                  {review.userName}
                </h3>
                <div className="flex items-center">
                  <span className="text-yellow-500 text-sm mr-1">
                    {"★".repeat(Math.floor(review.rating))}
                    {"☆".repeat(5 - Math.floor(review.rating))}
                  </span>
                  <span className="text-xs text-gray-600">
                    {review.rating}/5
                  </span>
                </div>
              </div>
            </div>

            {/* Package Name */}
            <div className="mb-3">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {review.packageName}
              </span>
            </div>

            {/* Review Text */}
            <p className="text-gray-700 text-sm leading-relaxed">
              {review.reviewText}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;