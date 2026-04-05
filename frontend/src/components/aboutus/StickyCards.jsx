import React from "react";
const StickyCards = () => {
  const stickynotes = [
    {
      title: "Our Story",
      Subtitle: "Once upon a whisk",
      color: "#f8eed5", // matches your site palette
      rotate: "-5deg",
      fontColor: "#714d1a", // your main warm brown
    },
    {
      title: "Our Mission",
      Subtitle: "Spread sweetness one dessert at a time.",
      color: "#fde8ec", // soft version of your rosy pink
      rotate: "4deg",
      fontColor: "#752031", // plum for contrast
    },
    {
      title: "What We Make",
      Subtitle: "Fluffy, chewy, melty magic",
      color: "#D6F7E1", // creamy caramel pastel
      rotate: "-4.5deg",
      fontColor: "#714d1a", // works beautifully
    },
    {
      title: "Why We Bake",
      Subtitle: "Because smiles are our secret ingredient",
      color: "#f9e1dd", // warm blush
      rotate: "3.5deg",
      fontColor: "#752031", // again plum for contrast
    },
  ];

  return (
    <div className="sticky-container">
      <div className="sticky-card">
        {stickynotes.map((elem, index) => (
          <div
            className="content"
            key={index}
            style={{
              backgroundColor: elem.color,
              color: elem.fontColor,
              transform: `rotate(${elem.rotate})`,
            }}
          >
            <img src="lollipop.png" className="circle" />
            <h1 className="stickytitle">{elem.title}</h1>
            <p className="stickysubtitle">{elem.Subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StickyCards;
