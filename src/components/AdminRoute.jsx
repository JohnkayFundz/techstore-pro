import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";


function AdminRoute({ children }) {

  const {
    user,
    loading,
  } = useAuth();



  // Checking authentication state
  if (loading) {
    return <Loading />;
  }



  // User not logged in
  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }



  // User logged in but not admin
  if (user.role !== "admin") {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }



  // Admin access granted
  return children;

}



AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};



export default AdminRoute;