import React from "react";
import PropTypes from "prop-types";

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
        <main className="error-boundary" role="alert">
          <div className="error-card">
            <h2>⚠️ Something went wrong</h2>

            <p>
              An unexpected error occurred. Please refresh the page and try
              again.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details
                style={{
                  marginTop: "1rem",
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