import { Link } from "react-router-dom";
import { FiCpu } from "react-icons/fi";

function Logo() {
  return (
    <Link
      to="/"
      className="logo"
      aria-label="TechStore Pro Home"
    >
      <span className="logo-icon">
        <FiCpu />
      </span>

      <span className="logo-text">
        TechStore <span>Pro</span>
      </span>
    </Link>
  );
}

export default Logo;