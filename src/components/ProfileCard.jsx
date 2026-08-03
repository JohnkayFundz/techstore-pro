import { FiMail, FiUser, FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";

function ProfileCard() {
  let user = {
    name: "Guest User",
    email: "guest@example.com",
  };

  try {
    const storedUser = localStorage.getItem("techstore-user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error(error);
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "GU";

  return (
    <div className="dashboard-panel profile-card">
      <div className="profile-avatar">
        {initials}
      </div>

      <h3>{user.name}</h3>

      <p>{user.email}</p>

      <div className="profile-details">
        <div className="profile-item">
          <FiUser />
          <span>Customer Account</span>
        </div>

        <div className="profile-item">
          <FiMail />
          <span>Email Verified</span>
        </div>
      </div>

      <Link to="/profile" className="btn btn-outline">
        <FiEdit />
        <span> Edit Profile</span>
      </Link>
    </div>
  );
}

export default ProfileCard;