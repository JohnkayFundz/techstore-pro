import { X, CircleCheck, CircleAlert, TriangleAlert, Info } from "lucide-react";
import { useToast } from "../context/ToastContext";

function Toast() {
  const { toast, hideToast } = useToast();

  if (!toast) return null;

  const icons = {
    success: <CircleCheck size={22} />,
    error: <CircleAlert size={22} />,
    warning: <TriangleAlert size={22} />,
    info: <Info size={22} />,
  };

  return (
    <div
      className="toast-container"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div
        className={`toast toast-${toast.type}`}
        role="alert"
      >
        <div className="toast-icon">
          {icons[toast.type]}
        </div>

        <div className="toast-content">
          {toast.title && (
            <h4 className="toast-title">
              {toast.title}
            </h4>
          )}

          {toast.message && (
            <p className="toast-message">
              {toast.message}
            </p>
          )}
        </div>

        <button
          className="toast-close"
          onClick={hideToast}
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

export default Toast;