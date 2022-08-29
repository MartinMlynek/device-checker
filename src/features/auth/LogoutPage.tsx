import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks/redux-hooks";
import { logout } from "./authSlice";

const LogoutPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);
  return <Navigate to="/login" />;
};

export default LogoutPage;
