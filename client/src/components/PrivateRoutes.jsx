import { AuthContext } from "../context/authContext";
import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
    const { auth } = useContext(AuthContext);
    return auth.token ? <Outlet /> : <Navigate to="/" />;
  };
  
  export default PrivateRoutes;