function Contact() {
  return (
    <section className="page container">
      <div className="page-header">
        <h1>Contact Us</h1>

        <p>
          We'd love to hear from you.
        </p>
      </div>

      <form className="contact-form">

        <input
          type="text"
          placeholder="Your Name"
        />

        <input
          type="email"
          placeholder="Email Address"
        />

        <textarea
          rows="6"
          placeholder="Your Message"
        />

        <button className="btn">
          Send Message
        </button>

      </form>
    </section>
  );
}

export default Contact;