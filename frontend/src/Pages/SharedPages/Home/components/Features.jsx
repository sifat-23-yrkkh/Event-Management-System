import React from "react";
import { Calendar, Users, Sparkles, Award, Clock, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: "Easy Planning",
      description:
        "Streamlined tools for effortless event management with intuitive drag-and-drop interfaces.",
    },
    {
      icon: Users,
      title: "Expert Support",
      description:
        "Professional team to bring your vision to life with 24/7 dedicated support.",
    },
    {
      icon: Sparkles,
      title: "Premium Quality",
      description:
        "Exceptional service for memorable experiences with attention to every detail.",
    },
    {
      icon: Award,
      title: "Award Winning",
      description:
        "Recognized excellence in event management with industry-leading innovations.",
    },
    {
      icon: Clock,
      title: "On-Time Delivery",
      description:
        "Punctual execution ensuring your events start and end exactly as planned.",
    },
    {
      icon: Shield,
      title: "Trusted Platform",
      description:
        "Secure and reliable service trusted by thousands of satisfied clients worldwide.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#179ac8] rounded-full px-6 py-2 mb-6">
            <Sparkles className="h-5 w-5 text-white" />
            <span className="text-white font-semibold">Why Choose Eventor</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Excellence in Every Event
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine creativity, technology, and expertise to deliver
            exceptional event experiences that exceed your expectations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isHighlighted = index === 2; // Highlight the 3rd card (Premium Quality)

            return (
              <div
                key={index}
                className={`group ${
                  isHighlighted
                    ? "bg-[#179ac8] text-white border-4 border-white"
                    : "bg-white text-gray-900 border-4 border-[#179ac8]"
                } rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
              >
                <div
                  className={`${
                    isHighlighted ? "bg-white" : "bg-[#179ac8]"
                  } w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent
                    className={`h-8 w-8 ${
                      isHighlighted ? "text-[#179ac8]" : "text-white"
                    }`}
                  />
                </div>

                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isHighlighted ? "text-white" : "text-[#179ac8]"
                  }`}
                >
                  {feature.title}
                </h3>

                <p
                  className={`text-lg leading-relaxed ${
                    isHighlighted ? "text-blue-100" : "text-gray-600"
                  }`}
                >
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <div
                  className={`mt-6 w-12 h-1 ${
                    isHighlighted ? "bg-white" : "bg-[#179ac8]"
                  } rounded-full group-hover:w-20 transition-all duration-300`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
