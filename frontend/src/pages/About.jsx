import React from "react";
import AboutusBanner from "../components/aboutus/AboutusBanner";
import StickyCards from "../components/aboutus/stickyCards";
import MainSection from "../components/aboutus/MainSection";
import MeetTheMakers from "../components/aboutus/MeetTheMakers";
import '../styles/aboutus.css'
const About = () => {
  return (
    <div className="aboutus">
      <AboutusBanner />

      <MeetTheMakers />
      <MainSection />
    </div>
  );
};

export default About;
