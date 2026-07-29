import {
  FaStar,
  FaQuoteLeft,
} from "react-icons/fa";

function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "John D.",
      role: "Verified Buyer",
      rating: 5,
      image: "👨",
      comment:
        "Excellent products and incredibly fast delivery. My laptop arrived in perfect condition, and the shopping experience was smooth from start to finish.",
    },
    {
      id: 2,
      name: "Sarah M.",
      role: "Tech Enthusiast",
      rating: 5,
      image: "👩",
      comment:
        "The customer service was outstanding. I found exactly what I needed at a great price. Highly recommended!",
    },
    {
      id: 3,
      name: "Michael T.",
      role: "Content Creator",
      rating: 5,
      image: "🧑",
      comment:
        "Premium quality products, secure checkout, and quick shipping. This has become my favorite online tech store.",
    },
  ];

  return (
    <section className="testimonials section">
      <div className="container">
        <div className="section-header">
          <h2>What Our Customers Say</h2>

          <p>
            Thousands of customers trust TechStore Pro for quality
            electronics and outstanding service.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="testimonial-card"
            >
              <FaQuoteLeft className="quote-icon" />

              <p className="testimonial-text">
                {testimonial.comment}
              </p>

              <div className="testimonial-rating">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <FaStar key={index} />
                ))}
              </div>

              <div className="testimonial-user">
                <div className="testimonial-avatar">
                  {testimonial.image}
                </div>

                <div>
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;