import { useState } from "react";
import SignUpForm from "../../Pages/SignUp";
import { Luggage, Package, X } from "lucide-react";
import { Link } from "react-router-dom";

const SignUpFlow = () => {
  const [showModal, setShowModal] = useState(true);
  const [userType, setUserType] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handlePathSelection = (type) => {
    setUserType(type);
    setShowModal(false);
  };

  return (
    <>
      {!showModal && userType ? (
        <SignUpForm userType={userType} />
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 rounded-full opacity-20"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-100 rounded-full opacity-20"></div>

            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 bg-[#009ee2] bg-clip-text text-transparent">
                  Join TravelTrade
                </h2>
                <p className="text-gray-600 mt-2">
                  Are you traveling or sending products?
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <button
                onClick={() => handlePathSelection("traveler")}
                onMouseEnter={() => setHoveredCard("traveler")}
                onMouseLeave={() => setHoveredCard(null)}
                className={`p-8 border-2 rounded-2xl transition-all duration-300 group
                  ${
                    hoveredCard === "traveler" || hoveredCard === null
                      ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg"
                      : "border-gray-100 opacity-80"
                  }
                  hover:shadow-xl hover:scale-[1.02]`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-24 h-24 mb-6 flex items-center justify-center rounded-2xl transition-all
                    ${
                      hoveredCard === "traveler"
                        ? "bg-[#009ee2] text-white"
                        : "bg-blue-100 text-[#009ee2]"
                    }`}
                  >
                    <Luggage className="w-10 h-10" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-blue-700">
                    I am a Traveler
                  </h3>
                  <p className="text-gray-500 text-center text-sm max-w-[200px]">
                    I am traveling and can carry products for others
                  </p>
                  <div
                    className={`mt-4 px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${
                      hoveredCard === "traveler"
                        ? "bg-[#009ee2] text-white"
                        : "bg-blue-100 text-[#009ee2]"
                    }`}
                  >
                    Choose this path
                  </div>
                </div>
              </button>

              <button
                onClick={() => handlePathSelection("product_sender")}
                onMouseEnter={() => setHoveredCard("sender")}
                onMouseLeave={() => setHoveredCard(null)}
                className={`p-8 border-2 rounded-2xl transition-all duration-300 group
                  ${
                    hoveredCard === "sender" || hoveredCard === null
                      ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg"
                      : "border-gray-100 opacity-80"
                  }
                  hover:shadow-xl hover:scale-[1.02]`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-24 h-24 mb-6 flex items-center justify-center rounded-2xl transition-all
                    ${
                      hoveredCard === "sender"
                        ? "bg-[#009ee2] text-white"
                        : "bg-blue-100 text-[#009ee2]"
                    }`}
                  >
                    <Package className="w-10 h-10" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-blue-700">
                    I Send Products
                  </h3>
                  <p className="text-gray-500 text-center text-sm max-w-[200px]">
                    I need to send products with travelers
                  </p>
                  <div
                    className={`mt-4 px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${
                      hoveredCard === "sender"
                        ? "bg-[#009ee2] text-white"
                        : "bg-blue-100 text-[#009ee2]"
                    }`}
                  >
                    Choose this path
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500 relative z-10">
              Already have an account?{" "}
              <Link
                to="/signin"
                onClick={() => setShowModal(false)}
                className="text-[#009ee2] hover:text-blue-800 font-medium"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUpFlow;
