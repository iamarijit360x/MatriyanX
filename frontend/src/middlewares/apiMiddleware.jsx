import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './authContext';



export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated,"PROTECTED")
  return isAuthenticated ? <Outlet/> : <Navigate to="/login" />;

};

export const NotProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/history" /> : <Outlet/> ;
};

