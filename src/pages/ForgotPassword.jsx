import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    // Demo only
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  }

  return (
    <section className="auth-page">
      <div className="container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Forgot Password</h1>

            <p>
              Enter your email address and we'll
              send you a password reset link.
            </p>
          </div>

          {!success ? (
            <form
              className="auth-form"
              onSubmit={handleSubmit}
              noValidate
            >
              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    if (error) {
                      setError("");
                    }
                  }}
                  required
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          ) : (
            <div className="success-message">
              <h3>✔ Email Sent</h3>

              <p>
                If an account exists for{" "}
                <strong>{email}</strong>,
                you'll receive password reset
                instructions shortly.
              </p>

              <Link
                to="/login"
                className="btn btn-primary"
              >
                Back to Login
              </Link>
            </div>
          )}

          <div className="auth-footer">
            <p>
              Remember your password?{" "}
              <Link to="/login">
                Login
              </Link>
            </p>

            <p>
              Don't have an account?{" "}
              <Link to="/register">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;