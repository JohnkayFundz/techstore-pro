import React from "react";
import PropTypes from "prop-types";

import "../styles/error-boundary-premium.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary:", error);
    console.error("Component Stack:", errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-boundary" role="alert" aria-labelledby="error-title">
          <div className="error-card">
            <h1 id="error-title">Something went wrong</h1>

            <p>
              An unexpected error occurred. Refresh the page and try again.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details
                style={{
                  marginTop: "1rem",
                  marginBottom: "1.5rem",
                  textAlign: "left",
                  whiteSpace: "pre-wrap",
                }}
              >
                <summary>Error Details</summary>
                <pre>{this.state.error.message}</pre>
              </details>
            )}

            <button
              type="button"
              className="btn btn-primary"
              onClick={this.handleReload}
            >
              Refresh Page
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;