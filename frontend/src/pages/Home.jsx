import React from "react";
import Main from "../components/homepage/Main";
import FeaturedDessert from "../components/homepage/FeaturedDessert";
import WhyWhiskWhimsy from "../components/homepage/WhyWhiskWhimsy";
import HowItWorks from "../components/homepage/HowItWorks";
import '../styles/home.css'
const Home = () => {
  return (
    <div>
      <Main />
      <FeaturedDessert />
      <WhyWhiskWhimsy/>
      <HowItWorks/>
    </div>
  );
};

export default Home;
