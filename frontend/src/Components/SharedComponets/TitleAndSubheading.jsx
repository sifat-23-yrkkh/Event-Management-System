import React from 'react';

const TitleAndSubheading = ({ title, subheading, className = "" }) => {
  return (
    <div className={`text-center my-8 ${className}`}>
      <div className="relative">
        <div className="mt-4 flex justify-center items-center space-x-2">
          <div className="w-8 h-px bg-[#179ac8] bg-opacity-30"></div>
          <div className="w-3 h-3 rounded-full border-2 border-[#179ac8]"></div>
          <div className="w-8 h-px bg-[#179ac8] bg-opacity-30"></div>
        </div>
        <div className="absolute inset-x-0 top-1/2 flex justify-center">
          <span className="bg-white px-4 text-sm text-[#179ac8] uppercase tracking-wider">
            {subheading}
          </span>
        </div>
      </div>
      <h1 className="mt-4 text-5xl font-extrabold text-[#179ac8] tracking-tight">
        {title}
      </h1>
      <div className="mt-4 flex justify-center">
        <div className="w-16 h-1 rounded-full bg-[#179ac8] inline-flex"></div>
      </div>
    </div>
  );
};

export default TitleAndSubheading;