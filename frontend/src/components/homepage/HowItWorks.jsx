const HowItWorks = () => {
  return (
    <section className="how-section">
      <div className="how-header">
        <h2 className="how-title">How It Works</h2>
        <p className="how-subtitle">
          Ordering your favorite treats is as easy as 1, 2, 3
        </p>
      </div>

      <div className="how-steps">
        <div className="how-step">
          <span className="step-number">01</span>
          <h3>Choose Your Treats</h3>
          <p>
            Browse our menu and pick your favorite desserts made fresh just for you.
          </p>
        </div>

        <div className="how-step">
          <span className="step-number">02</span>
          <h3>Add to Cart</h3>
          <p>
            Select quantities and add your treats to the cart in just one click.
          </p>
        </div>

        <div className="how-step">
          <span className="step-number">03</span>
          <h3>Freshly Baked & Delivered</h3>
          <p>
            We bake your order with love and deliver it fresh to your doorstep.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
