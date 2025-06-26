import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // Nếu đã đăng nhập, cho phép truy cập
  if (isAuthenticated) {
    return <Outlet />;
  }

  // Nếu chưa đăng nhập, chuyển hướng về trang login
  return <Navigate to="/login" replace />;
};
export default ProtectedRoute;