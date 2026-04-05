import React from "react";

const makers = [
  {
    name: "Amelia the Icing Queen",
    role: "Founder & Flavor Magician",
    bio: "Crafting joy with every swirl of frosting and a sprinkle of love.",
    image: "../src/images/amina.jpg", // Replace with your image
  },
  {
    name: "Zade the Dough Whisperer",
    role: "Co-Founder & Dough Developer",
    bio: "From fluffy to chewy, he’s the brains behind our sweet textures.",
    image: "../src/images/rahim.jpg", // Replace with your image
  },
  {
    name: "Lillian the Pastry Enchantress",
    role: " Head Pastry Chef",
    bio: "Butter, sugar, and finesse—she turns classic pastries into works of art.",
    image: "../src/images/chef-3.jpg", // Replace with your image
  },
  {
    name: " Oliver the Flavor Alchemist",
    role: "R&D and Recipe Developer",
    bio: "He balances nostalgia with innovation to craft flavors that spark joy.",
    image: "../src/images/chef-4.jpg", // Replace with your image
  },
];

const MeetTheMakers = () => {
  return (
    <section className="makers-section">
      <h2 className="section-title">
        <img
          src="../src/images/headingcupcake.png"
          alt=""
          className="left-img"
        />{" "}
        Meet the Makers{" "}
        <img
          src="../src/images/headingcupcake.png"
          alt=""
          className="left-img"
        />
      </h2>
      <div className="makers-container">
        {makers.map((maker, index) => (
          <div className="maker-card" key={index}>
            <img src={maker.image} alt={maker.name} className="maker-img" />
            <div className="maker-info">
              <h3>{maker.name}</h3>
              <p className="role">{maker.role}</p>
              <p>{maker.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MeetTheMakers;
