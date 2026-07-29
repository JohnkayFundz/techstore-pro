import { memo } from "react";
import PropTypes from "prop-types";

import "./Skeleton.css";

function Skeleton({
  width = "100%",
  height = "1rem",
  borderRadius = "8px",
  className = "",
}) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
      aria-hidden="true"
    />
  );
}

Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
};

Skeleton.displayName = "Skeleton";

export default memo(Skeleton);