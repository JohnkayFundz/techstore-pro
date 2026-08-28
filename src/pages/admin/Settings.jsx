import "./Settings.css";

function Settings() {
  return (
    <section className="admin-settings">
      <header className="settings-title">
        <div>
          <h1>Settings</h1>
          <p>Manage your TechStore Pro administration settings.</p>
        </div>
      </header>

      <div className="settings-grid">

        {/* Store Settings */}
        <section className="settings-card">
          <h2>Store Settings</h2>

          <div className="settings-form">

            <div className="form-group">
              <label htmlFor="store-name">
                Store Name
              </label>

              <input
                id="store-name"
                type="text"
                defaultValue="TechStore Pro"
              />
            </div>

            <div className="form-group">
              <label htmlFor="store-email">
                Store Email
              </label>

              <input
                id="store-email"
                type="email"
                defaultValue="admin@techstorepro.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">
                Currency
              </label>

              <select
                id="currency"
                defaultValue="USD"
              >
                <option value="USD">USD — US Dollar</option>
                <option value="NGN">NGN — Nigerian Naira</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
              </select>
            </div>

            <button
              type="button"
              className="settings-save-btn"
            >
              Save Changes
            </button>

          </div>
        </section>


        {/* Account Settings */}
        <section className="settings-card">
          <h2>Administrator Account</h2>

          <div className="settings-form">

            <div className="form-group">
              <label htmlFor="admin-name">
                Name
              </label>

              <input
                id="admin-name"
                type="text"
                defaultValue="Administrator"
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-email">
                Email
              </label>

              <input
                id="admin-email"
                type="email"
                defaultValue="admin@techstorepro.com"
              />
            </div>

            <button
              type="button"
              className="settings-save-btn"
            >
              Update Account
            </button>

          </div>
        </section>


        {/* Notifications */}
        <section className="settings-card">
          <h2>Notifications</h2>

          <div className="settings-options">

            <label className="settings-option">
              <input
                type="checkbox"
                defaultChecked
              />

              <span>
                <strong>New orders</strong>
                <small>
                  Notify me when a new order is placed.
                </small>
              </span>
            </label>


            <label className="settings-option">
              <input
                type="checkbox"
                defaultChecked
              />

              <span>
                <strong>Low stock</strong>
                <small>
                  Notify me when products have low inventory.
                </small>
              </span>
            </label>


            <label className="settings-option">
              <input
                type="checkbox"
                defaultChecked
              />

              <span>
                <strong>New users</strong>
                <small>
                  Notify me when a new customer registers.
                </small>
              </span>
            </label>

          </div>
        </section>


        {/* Security */}
        <section className="settings-card">
          <h2>Security</h2>

          <div className="security-content">

            <div>
              <strong>Password</strong>

              <p>
                Change your administrator password.
              </p>
            </div>

            <button
              type="button"
              className="settings-secondary-btn"
            >
              Change Password
            </button>

          </div>


          <div className="security-content">

            <div>
              <strong>Admin Access</strong>

              <p>
                Your account currently has administrator privileges.
              </p>
            </div>

            <span className="admin-status">
              Administrator
            </span>

          </div>

        </section>

      </div>
    </section>
  );
}

export default Settings;