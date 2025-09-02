import React from "react";
import Slider from "./components/Slider";
import Features from "./components/Features";
import OurEventCategories from "./components/OurEventCategories";
import Faq from "./components/Faq";
import Review from "./components/Review";

const Home = () => {
  return (
    <div>
      <Slider />
      <Features/>
      <OurEventCategories/>
      <Review></Review>
      <Faq/>
    </div>
  );
};

export default Home;
