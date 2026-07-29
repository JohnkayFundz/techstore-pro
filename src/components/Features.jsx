import {
  FaShippingFast,
  FaLock,
  FaUndoAlt,
  FaHeadset,
} from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaShippingFast />,
      title: "Free Shipping",
      description:
        "Free delivery on orders over $100 anywhere in the country.",
    },
    {
      icon: <FaLock />,
      title: "Secure Payments",
      description:
        "Safe and encrypted payments with trusted payment gateways.",
    },
    {
      icon: <FaUndoAlt />,
      title: "Easy Returns",
      description:
        "30-day hassle-free returns on eligible products.",
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      description:
        "Friendly customer support available whenever you need help.",
    },
  ];

  return (
    <section className="features section">
      <div className="container">
        <div className="section-header">
          <h2>Why Shop With Us?</h2>

          <p>
            We provide the best shopping experience with premium products,
            fast delivery, secure checkout, and dedicated customer support.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card"
            >
              <div className="feature-card-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;