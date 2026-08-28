import { useEffect, useState } from "react";

import "./AdminSettings.css";

import {
  getSettings,
  updateSettings,
} from "../../api/settingsApi";

import { useSettings } from "../../context/SettingsContext";

// ==========================================================
// DEFAULT SETTINGS
// ==========================================================

const DEFAULT_SETTINGS = {
  storeName: "TechStore Pro",
  storeEmail: "admin@techstorepro.com",
  currency: "USD",
  maintenanceMode: false,
  emailNotifications: true,
  orderNotifications: true,
};

// ==========================================================
// ADMIN SETTINGS
// ==========================================================

function AdminSettings() {
  const { updateSettingsState } = useSettings();

  const [settings, setSettings] = useState(
    DEFAULT_SETTINGS
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // ========================================================
  // LOAD SETTINGS FROM BACKEND
  // ========================================================

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSettings();

        if (!mounted) {
          return;
        }

        setSettings({
          ...DEFAULT_SETTINGS,
          ...data,
        });
      } catch (error) {
        console.error(
          "Failed to load settings:",
          error
        );

        if (mounted) {
          setError(
            "Failed to load settings. Please try again."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  // ========================================================
  // HANDLE INPUT CHANGES
  // ========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setSettings((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setSaved(false);
    setError("");
  };

  // ========================================================
  // SAVE SETTINGS TO BACKEND
  // ========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const response = await updateSettings(settings);

      const updatedSettings =
        response?.settings || response;

      if (updatedSettings) {
        const mergedSettings = {
          ...DEFAULT_SETTINGS,
          ...updatedSettings,
        };

        setSettings(mergedSettings);

        updateSettingsState(
          mergedSettings
        );
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to save settings:",
        error
      );

      setError(
        "Failed to save settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================================
  // LOADING STATE
  // ========================================================

  if (loading) {
    return (
      <section className="admin-settings">
        <header className="settings-header">
          <div>
            <h1>Settings</h1>

            <p>
              Loading store settings...
            </p>
          </div>
        </header>
      </section>
    );
  }

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <section className="admin-settings">

      {/* ====================================================
          PAGE HEADER
      ==================================================== */}

      <header className="settings-header">
        <div>
          <h1>Settings</h1>

          <p>
            Manage your TechStore Pro administration settings.
          </p>
        </div>
      </header>

      {/* ====================================================
          ERROR MESSAGE
      ==================================================== */}

      {error && (
        <div
          className="settings-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* ====================================================
          SUCCESS MESSAGE
      ==================================================== */}

      {saved && (
        <div
          className="settings-success"
          role="status"
        >
          Settings saved successfully.
        </div>
      )}

      {/* ====================================================
          SETTINGS FORM
      ==================================================== */}

      <form
        className="settings-form"
        onSubmit={handleSubmit}
      >

        {/* ==================================================
            STORE SETTINGS
        ================================================== */}

        <section className="settings-card">

          <div className="settings-card-header">
            <div>
              <h2>
                Store Settings
              </h2>

              <p>
                Configure your basic store information.
              </p>
            </div>
          </div>

          <div className="settings-grid">

            {/* STORE NAME */}

            <div className="settings-field">
              <label htmlFor="storeName">
                Store Name
              </label>

              <input
                id="storeName"
                name="storeName"
                type="text"
                value={settings.storeName}
                onChange={handleChange}
                placeholder="Enter store name"
              />
            </div>

            {/* STORE EMAIL */}

            <div className="settings-field">
              <label htmlFor="storeEmail">
                Store Email
              </label>

              <input
                id="storeEmail"
                name="storeEmail"
                type="email"
                value={settings.storeEmail}
                onChange={handleChange}
                placeholder="Enter store email"
              />
            </div>

            {/* CURRENCY */}

            <div className="settings-field">
              <label htmlFor="currency">
                Currency
              </label>

              <select
                id="currency"
                name="currency"
                value={settings.currency}
                onChange={handleChange}
              >
                <option value="USD">
                  USD - US Dollar
                </option>

                <option value="NGN">
                  NGN - Nigerian Naira
                </option>

                <option value="GBP">
                  GBP - British Pound
                </option>

                <option value="EUR">
                  EUR - Euro
                </option>
              </select>
            </div>

          </div>

        </section>

        {/* ==================================================
            NOTIFICATIONS
        ================================================== */}

        <section className="settings-card">

          <div className="settings-card-header">
            <div>
              <h2>
                Notifications
              </h2>

              <p>
                Choose which notifications you want to receive.
              </p>
            </div>
          </div>

          <div className="settings-options">

            {/* EMAIL NOTIFICATIONS */}

            <label className="setting-option">

              <div>
                <strong>
                  Email Notifications
                </strong>

                <span>
                  Receive important store notifications by email.
                </span>
              </div>

              <input
                type="checkbox"
                name="emailNotifications"
                checked={
                  settings.emailNotifications
                }
                onChange={handleChange}
              />

            </label>

            {/* ORDER NOTIFICATIONS */}

            <label className="setting-option">

              <div>
                <strong>
                  Order Notifications
                </strong>

                <span>
                  Receive notifications when new orders are created.
                </span>
              </div>

              <input
                type="checkbox"
                name="orderNotifications"
                checked={
                  settings.orderNotifications
                }
                onChange={handleChange}
              />

            </label>

          </div>

        </section>

        {/* ==================================================
            SYSTEM
        ================================================== */}

        <section className="settings-card">

          <div className="settings-card-header">
            <div>
              <h2>
                System
              </h2>

              <p>
                Control the availability of your store.
              </p>
            </div>
          </div>

          <label className="setting-option">

            <div>
              <strong>
                Maintenance Mode
              </strong>

              <span>
                Temporarily disable normal store access while
                performing maintenance.
              </span>
            </div>

            <input
              type="checkbox"
              name="maintenanceMode"
              checked={
                settings.maintenanceMode
              }
              onChange={handleChange}
            />

          </label>

        </section>

        {/* ==================================================
            SAVE BUTTON
        ================================================== */}

        <div className="settings-actions">

          <button
            type="submit"
            className="save-settings-btn"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : saved
                ? "Settings Saved ✓"
                : "Save Settings"}
          </button>

        </div>

      </form>

    </section>
  );
}

export default AdminSettings;