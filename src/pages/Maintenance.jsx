// ==========================================================
// TECHSTORE PRO
// MAINTENANCE PAGE
// ==========================================================

import "./Maintenance.css";

function Maintenance() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <main className="maintenance-page">
      <div className="maintenance-card">

        {/* Maintenance Icon */}
        <div
          className="maintenance-icon"
          aria-hidden="true"
        >
          🔧
        </div>

        {/* Heading */}
        <h1>We'll Be Back Soon</h1>

        {/* Message */}
        <p>
          TechStore Pro is temporarily unavailable while we
          perform scheduled maintenance.
        </p>

        <p>
          We're making improvements to provide you with a
          better shopping experience. Please check back shortly.
        </p>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={handleRefresh}
          className="maintenance-refresh-btn"
        >
          Refresh Page
        </button>

      </div>
    </main>
  );
}

export default Maintenance;