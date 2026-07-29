import { useState } from "react";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) return;

    setIsSubscribed(true);
    setEmail("");

    setTimeout(() => {
      setIsSubscribed(false);
    }, 3000);
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter-box">
          <div className="newsletter-content">
            <span className="newsletter-badge">
              📧 Newsletter
            </span>

            <h2>
              Stay Updated With TechStore Pro
            </h2>

            <p>
              Get the latest product launches, exclusive discounts,
              flash sales, and technology news delivered straight to
              your inbox.
            </p>
          </div>

          <form
            className="newsletter-form"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

            <button type="submit">
              Subscribe
            </button>
          </form>

          {isSubscribed && (
            <p className="newsletter-success">
              🎉 Thank you for subscribing!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Newsletter;