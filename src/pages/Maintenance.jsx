import "./Maintenance.css";
import "./MaintenancePremium.css";

function Maintenance() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <main className="maintenance-page" aria-labelledby="maintenance-title">
      <div className="maintenance-card">
        <div className="maintenance-icon" aria-hidden="true">✦</div>

        <h1 id="maintenance-title">We'll Be Back Soon</h1>

        <p>
          TechStore Pro is temporarily unavailable while we perform scheduled maintenance.
        </p>

        <p>
          We're making improvements to give you a better shopping experience. Please check back shortly.
        </p>

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