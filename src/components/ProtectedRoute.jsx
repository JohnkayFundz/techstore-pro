import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";



function ProtectedRoute({ children }) {


  const {
    user,
    loading,
  } = useAuth();


  const location = useLocation();





  if (loading) {

    return (

      <div className="page-loader">

        <div className="spinner"></div>


        <p>
          Checking authentication...
        </p>


      </div>

    );

  }





  if (!user?.id && !user?._id) {

    return (

      <Navigate

        to="/login"

        replace

        state={{
          from: location,
        }}

      />

    );

  }





  return children;


}




ProtectedRoute.propTypes = {

  children:
    PropTypes.node.isRequired,

};



export default ProtectedRoute;