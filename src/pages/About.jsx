function About() {
  return (
    <section className="page container">
      <div className="page-header">
        <h1>About TechStore Pro</h1>

        <p>
          TechStore Pro is a modern e-commerce platform built to provide
          high-quality technology products with a fast, secure, and enjoyable
          shopping experience.
        </p>
      </div>

      <div className="about-grid">
        <div className="card">
          <h2>Our Mission</h2>

          <p>
            To make premium technology accessible through an intuitive online
            shopping experience.
          </p>
        </div>

        <div className="card">
          <h2>Why Choose Us?</h2>

          <ul>
            <li>✔ Premium Products</li>
            <li>✔ Secure Checkout</li>
            <li>✔ Fast Delivery</li>
            <li>✔ Responsive Support</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default About;