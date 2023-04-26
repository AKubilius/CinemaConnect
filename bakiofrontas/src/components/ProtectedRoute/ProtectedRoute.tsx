import { Navigate, Route } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import React from 'react';

interface ProtectedRoutesProps {
  children: React.ReactNode;
}
const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {


  const isAuthenticated = localStorage.getItem('token') ? true : false;

  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }
  return <>{children}</>;
};

export default ProtectedRoutes;


