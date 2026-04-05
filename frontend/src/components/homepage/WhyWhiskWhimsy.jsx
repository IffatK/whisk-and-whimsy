const WhyWhiskWhimsy = () => {
  return (
    <section className="why-section">
      <div className="why-header">
        <h2 className="why-title">Why Whisk & Whimsy?</h2>
        <p className="why-subtitle">
          A little love, a lot of sweetness in every bite
        </p>
      </div>

      <div className="why-content">
        {/* LEFT SIDE */}
        <div className="why-left">
          <h3 className="why-highlight">Freshly Baked, Every Day</h3>
          <p className="why-text">
            Our desserts are baked daily in small batches, ensuring unmatched
            freshness, aroma, and flavor in every single bite.
          </p>

          <p className="why-brand-story">
            At Whisk & Whimsy, baking is more than a process — it’s a ritual.
            From carefully selected ingredients to thoughtful preparation,
            every dessert is crafted to bring comfort, joy, and a little magic
            to your day.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="why-right">
          <div className="why-point">
            <h4>Premium Ingredients</h4>
            <p>
              We choose high-quality ingredients because great desserts start
              with the best foundation.
            </p>
          </div>

          <div className="why-point">
            <h4>Made with Love</h4>
            <p>
              Each dessert is thoughtfully crafted to spread warmth, comfort,
              and happiness.
            </p>
          </div>

          <div className="why-point">
            <h4>Fast & Reliable Delivery</h4>
            <p>
              From our kitchen to your doorstep, your treats arrive fresh and
              right on time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWhiskWhimsy;
