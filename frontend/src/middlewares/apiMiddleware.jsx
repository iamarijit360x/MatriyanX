import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './authContext';



export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  console.log("protecteddd",isAuthenticated)

  return isAuthenticated ? <Outlet/> : <Navigate to="/login" />;

};

export const NotProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  console.log("issssss",isAuthenticated)
  return isAuthenticated ? <Navigate to="/history" /> : <Outlet/> ;
};

