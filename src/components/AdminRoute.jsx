import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function AdminRoute({ children }) {

  const {
    user,
    loading,
  } = useAuth();


  if (loading) {

    return (
      <div className="page-loader">
        <div className="spinner"></div>
        <p>
          Checking permissions...
        </p>
      </div>
    );

  }


  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  if (user.role !== "admin") {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  return children;

}


AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};


export default AdminRoute;