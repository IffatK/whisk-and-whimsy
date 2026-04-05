import React from "react";

const sweetStats = [
  {
    icon: "🍰",
    number: "150+",
    label: "Desserts Created",
    color: "#FAD2E1",
  },
  {
    icon: "🥎",
    number: "50,000+",
    label: "Whisks Stirred",
    color: "#FFF1BD",
  },
  {
    icon: "🎂",
    number: "300+",
    label: "Custom Cakes Baked",
    color: "#D8F3DC",
  },
  {
    icon: "😊",
    number: "99%",
    label: "Happy Customers",
    color: "#FCD5CE",
  },
];

const MainSection = () => {
  return (
    <div className="stats-wrapper">
      <h2 className="stats-heading">✨ Sweet Stats ✨</h2>
      <div className="stats-grid">
        {sweetStats.map((stat, index) => (
          <div
            className="stat-card"
            key={index}
            style={{ backgroundColor: stat.color }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <h3 className="stat-number">{stat.number}</h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainSection;
