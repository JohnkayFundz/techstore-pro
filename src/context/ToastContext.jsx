import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const timeoutRef = useRef(null);

  const hideToast = useCallback(() => {
    setToast(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    ({
      type = "success",
      title = "",
      message = "",
      duration = 3000,
    }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setToast({
        id: crypto.randomUUID(),
        type,
        title,
        message,
      });

      timeoutRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    },
    [hideToast]
  );

  const success = useCallback(
    (title, message, duration = 3000) => {
      showToast({
        type: "success",
        title,
        message,
        duration,
      });
    },
    [showToast]
  );

  const error = useCallback(
    (title, message, duration = 3000) => {
      showToast({
        type: "error",
        title,
        message,
        duration,
      });
    },
    [showToast]
  );

  const warning = useCallback(
    (title, message, duration = 3000) => {
      showToast({
        type: "warning",
        title,
        message,
        duration,
      });
    },
    [showToast]
  );

  const info = useCallback(
    (title, message, duration = 3000) => {
      showToast({
        type: "info",
        title,
        message,
        duration,
      });
    },
    [showToast]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      toast,
      showToast,
      hideToast,
      success,
      error,
      warning,
      info,
    }),
    [
      toast,
      showToast,
      hideToast,
      success,
      error,
      warning,
      info,
    ]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider."
    );
  }

  return context;
}