function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent(
      "TechStore Pro Customer Support"
    );

    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href =
      `mailto:deejayjohnkay@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="page container">
      <div className="page-header">
        <h1>Contact Us</h1>

        <p>
          We'd love to hear from you. Get in touch with the TechStore Pro team.
        </p>
      </div>

      <div className="contact-content">
        {/* Contact Information */}
        <div className="contact-info">
          <h2>Get in Touch</h2>

          <p>
            Have a question about a product, order, or your account?
            We're here to help.
          </p>

          <div className="contact-details">
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:deejayjohnkay@gmail.com">
                deejayjohnkay@gmail.com
              </a>
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              <a href="tel:+2348188840165">
                +234 818 884 0165
              </a>
            </p>

            <p>
              <strong>Location:</strong> Lagos, Nigeria
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            autoComplete="name"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            autoComplete="email"
            required
          />

          <textarea
            name="message"
            rows="6"
            placeholder="Your Message"
            required
          />

          <button type="submit" className="btn">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
