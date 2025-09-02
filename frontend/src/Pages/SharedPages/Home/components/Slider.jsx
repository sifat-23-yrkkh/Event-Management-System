import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      image: "https://i.ibb.co.com/kV1J2TX7/image.png",
      title: "Create Unforgettable Events",
      subtitle: "With Eventor",
      description:
        "Transform your vision into reality with our comprehensive event management platform. From intimate gatherings to grand celebrations, we make every moment count.",
      buttonText: "Start Planning",
    },
    {
      id: 2,
      image: "https://i.ibb.co.com/v6PSMMBZ/image1.png",
      title: "Wedding & Anniversary",
      subtitle: "Celebrations",
      description:
        "Make your special day extraordinary with our premium decoration services and event coordination. Every love story deserves a perfect celebration.",
      buttonText: "Book Wedding Event",
    },
    {
      id: 3,
      image: "https://i.ibb.co.com/99pdsYP4/image2.png",
      title: "Corporate Events",
      subtitle: "& Conferences",
      description:
        "Elevate your business gatherings with professional event management. From conferences to team building, create impactful experiences.",
      buttonText: "Plan Corporate Event",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide]);

  return (
    <div
      className="relative h-screen overflow-hidden group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              {/* Title */}
              <div className="space-y-4">
                <h2 className="text-lg uppercase tracking-widest text-[#179ac8] font-bold bg-white px-4 py-2 rounded-lg inline-block">
                  {slides[currentSlide].subtitle}
                </h2>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white">
                  {slides[currentSlide].title}
                </h1>
              </div>

              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <button className="group bg-[#179ac8] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-[#179ac8] transform transition-all duration-300 shadow-2xl flex items-center justify-center space-x-2 border-2 border-[#179ac8]">
                  <Calendar className="h-5 w-5" />
                  <span>{slides[currentSlide].buttonText}</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="bg-white text-[#179ac8] border-2 border-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#179ac8] hover:text-white transition-all duration-300 flex items-center justify-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Learn More</span>
                </button>
              </div>
            </div>

            {/* Right Content - Feature Cards */}
            <div className="hidden lg:block">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-[#179ac8] rounded-full px-6 py-3 border-2 border-white">
                <Sparkles className="h-5 w-5 text-white" />
                <span className="text-sm font-semibold text-white">
                  Premium Event Management
                </span>
              </div>
              <div className="flex space-x-8 py-4">
                <div className="text-center bg-white rounded-xl px-6 py-4">
                  <div className="text-3xl font-bold text-[#179ac8]">500+</div>
                  <div className="text-sm text-gray-600 font-medium">
                    Events Managed
                  </div>
                </div>
                <div className="text-center bg-white rounded-xl px-6 py-4">
                  <div className="text-3xl font-bold text-[#179ac8]">50K+</div>
                  <div className="text-sm text-gray-600 font-medium">
                    Happy Clients
                  </div>
                </div>
                <div className="text-center bg-white rounded-xl px-6 py-4">
                  <div className="text-3xl font-bold text-[#179ac8]">5★</div>
                  <div className="text-sm text-gray-600 font-medium">
                    Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white text-[#179ac8] p-4 rounded-full hover:bg-[#179ac8] hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 border-2 border-[#179ac8] shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white text-[#179ac8] p-4 rounded-full hover:bg-[#179ac8] hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 border-2 border-[#179ac8] shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-4 bg-white rounded-full px-6 py-3 border-2 border-[#179ac8]">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
              index === currentSlide
                ? "bg-[#179ac8] border-[#179ac8] scale-125"
                : "bg-white border-[#179ac8] hover:bg-[#179ac8]"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-white z-20">
        <div
          className="h-full bg-[#179ac8] transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 animate-bounce opacity-40 hidden lg:block">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-[#179ac8] shadow-lg">
          <Sparkles className="h-10 w-10 text-[#179ac8]" />
        </div>
      </div>

      <div className="absolute bottom-32 left-20 animate-pulse opacity-30 hidden lg:block">
        <div className="w-16 h-16 bg-[#179ac8] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
          <Calendar className="h-8 w-8 text-white" />
        </div>
      </div>


    </div>
  );
};

export default Slider;
