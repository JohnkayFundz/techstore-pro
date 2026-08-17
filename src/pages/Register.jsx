import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();

  const { login: loginUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ==========================================================
     HANDLE INPUT CHANGE
  ========================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  /* ==========================================================
     PASSWORD STRENGTH
  ========================================================== */

  const getPasswordStrength = (password) => {
    if (!password) return "";

    if (password.length < 6) {
      return "Weak";
    }

    let score = 0;

    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return "Medium";
    }

    return "Strong";
  };

  /* ==========================================================
     REGISTER
  ========================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    /* --------------------------------------------------------
       VALIDATION
    -------------------------------------------------------- */

    if (!name || !email || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    /* --------------------------------------------------------
       API REQUEST
    -------------------------------------------------------- */

    try {
      setLoading(true);

      /*
        authApi.register() already returns response.data.

        Therefore DO NOT use:

        const { data } = await register(...)

        because that would incorrectly expect another
        "data" property.
      */

      const data = await register({
        name,
        email,
        password,
      });

      console.log("REGISTER RESPONSE:", data);

      /* ------------------------------------------------------
         CHECK API RESPONSE
      ------------------------------------------------------ */

      if (!data?.user || !data?.token) {
        throw new Error(
          "Registration succeeded, but the server did not return a user or token."
        );
      }

      /* ------------------------------------------------------
         SAVE AUTHENTICATION STATE
      ------------------------------------------------------ */

      loginUser(data.user, data.token);

      /* ------------------------------------------------------
         REDIRECT
      ------------------------------------------------------ */

      navigate("/");
    } catch (err) {
      console.error("Registration Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <section className="auth-page">
      <div className="container">
        <div className="auth-card">

          {/* ==================================================
             HEADER
          ================================================== */}

          <div className="auth-header">
            <h1>Create Account</h1>

            <p>
              Join TechStore Pro today.
            </p>
          </div>

          {/* ==================================================
             FORM
          ================================================== */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* ------------------------------------------------
               ERROR
            ------------------------------------------------ */}

            {error && (
              <div
                className="form-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* ------------------------------------------------
               NAME
            ------------------------------------------------ */}

            <div className="form-group">
              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                disabled={loading}
                required
              />
            </div>

            {/* ------------------------------------------------
               EMAIL
            ------------------------------------------------ */}

            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
                required
              />
            </div>

            {/* ------------------------------------------------
               PASSWORD
            ------------------------------------------------ */}

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="password-input">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              {/* PASSWORD STRENGTH */}

              {formData.password && (
                <small
                  className={`password-strength ${strength.toLowerCase()}`}
                >
                  Password Strength: {strength}
                </small>
              )}
            </div>

            {/* ------------------------------------------------
               CONFIRM PASSWORD
            ------------------------------------------------ */}

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="password-input">
                <input
                  id="confirmPassword"
                  type={
                    showConfirm
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowConfirm(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showConfirm
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirm
                    ? "Hide"
                    : "Show"}
                </button>
              </div>
            </div>

            {/* ------------------------------------------------
               SUBMIT
            ------------------------------------------------ */}

            <button
              type="submit"
              className="btn btn-primary auth-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner"
                    aria-hidden="true"
                  ></span>

                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* ==================================================
             FOOTER
          ================================================== */}

          <div className="auth-footer">
            <p>
              Already have an account?{" "}

              <Link to="/login">
                Login
              </Link>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Register;