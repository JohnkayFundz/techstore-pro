// ==========================================================
// TECHSTORE PRO
// SETTINGS CONTEXT
// ==========================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getSettings,
} from "../api/settingsApi";

// ==========================================================
// SETTINGS CONTEXT
// ==========================================================

const SettingsContext = createContext(null);

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
// SETTINGS PROVIDER
// ==========================================================

export function SettingsProvider({
  children,
}) {
  const [settings, setSettings] = useState(
    DEFAULT_SETTINGS
  );

  const [loading, setLoading] = useState(true);

  // ========================================================
  // LOAD SETTINGS FROM BACKEND
  // ========================================================

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        setLoading(true);

        const data = await getSettings();

        if (!mounted) {
          return;
        }

        // --------------------------------------------------
        // Backend returns the settings document directly.
        // --------------------------------------------------

        if (data) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...data,
          });
        }

        console.log(
          "⚙️ Store settings loaded:",
          data
        );
      } catch (error) {
        console.error(
          "❌ Failed to load store settings:",
          error
        );

        // --------------------------------------------------
        // Keep safe defaults if API fails.
        // --------------------------------------------------

        if (mounted) {
          setSettings(DEFAULT_SETTINGS);
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
  // REFRESH SETTINGS
  // ========================================================

  const refreshSettings = async () => {
    try {
      const data = await getSettings();

      if (data) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data,
        });
      }

      return data;
    } catch (error) {
      console.error(
        "❌ Failed to refresh settings:",
        error
      );

      return null;
    }
  };

  // ========================================================
  // UPDATE SETTINGS LOCALLY
  // ========================================================

  const updateSettingsState = (
    updatedSettings
  ) => {
    if (!updatedSettings) {
      return;
    }

    setSettings((previous) => ({
      ...previous,
      ...updatedSettings,
    }));
  };

  // ========================================================
  // CONTEXT VALUE
  // ========================================================

  const value = {
    settings,
    loading,

    refreshSettings,
    updateSettingsState,

    storeName: settings.storeName,
    storeEmail: settings.storeEmail,
    currency: settings.currency,

    maintenanceMode:
      settings.maintenanceMode,

    emailNotifications:
      settings.emailNotifications,

    orderNotifications:
      settings.orderNotifications,
  };

  // ========================================================
  // PROVIDER
  // ========================================================

  return (
    <SettingsContext.Provider
      value={value}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// ==========================================================
// USE SETTINGS HOOK
// ==========================================================

export function useSettings() {
  const context =
    useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used within SettingsProvider"
    );
  }

  return context;
}