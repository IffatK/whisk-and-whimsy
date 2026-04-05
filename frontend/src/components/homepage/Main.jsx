const Main = () => {
  return (
    <main id="main">
      <div className="left">
        <h2>
          Who Needs a Beach Body{" "}
          <img
            src="../src/images/strawberry.png"
            alt=""
            className="strwaberry"
          />
          <br /> When You Can Have a Treat Body?
        </h2>
        <h3>Freshly Baked • Made with Love • Irresistibly Delicious</h3>

        <img
          src="../src/images/heroimgnew.png"
          alt="Donut"
          className="donut-2image"
        />

        <p className="button-section">
          Indulge guilt-free in our heavenly sweets{" "}
          <img src="../src/images/pancake.png" alt="" className="pancake" />{" "}
          <br />
          because happiness is best served with a side of sugar!
        </p>

        <button className="button">Explore Our Menu</button>
      </div>

      <div className="right">
        <img
          src="../src/images/realtart.png"
          alt="Donut"
          className="donutimage"
        />
      </div>
    </main>
  );
};

export default Main;
