import React from "react";

const Banner = () => {
  return (
    <div className="banner">
      <div className="left">
        <h1>
          One Bite and You'll Hear{" "}
          <span className="highlight">
            Angels Singing{" "}
            <img
              src="../src/images/banner-img-2.png"
              alt="Delicious dessert"
              className="bannerimg2"
            />
            <img
              src="../src/images/swiss.png"
              alt="Delicious dessert"
              className="swiss"
            />
          </span>
        </h1>
        <p>--- Desserts so good, they should come with a warning label! ---</p>
        <img
          src="../src/images/macroon.png"
          alt="Macaron"
          className="macroon"
        />
        <img
          src="../src/images/cakebanner.png"
          alt="Macaron"
          className="cakebanner"
        />
      </div>
    </div>
  );
};

export default Banner;
