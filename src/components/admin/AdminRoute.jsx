import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../Spinner'; // Giả sử bạn đã có component Spinner

const AdminRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuth(); // <-- Lấy thêm isLoading

  // --- THAY ĐỔI QUAN TRỌNG ---
  // 1. Nếu đang trong quá trình kiểm tra auth, hiển thị một màn hình chờ
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // 2. Sau khi đã kiểm tra xong, tiến hành kiểm tra quyền
  // Nếu đã đăng nhập và có vai trò là admin
  if (isAuthenticated && user?.role === 'admin') {
    return <Outlet />; // Cho phép truy cập
  }

  // 3. Nếu không đủ điều kiện, thông báo và chuyển hướng
  // (Chúng ta có thể bỏ alert ở đây để trải nghiệm mượt hơn)
  // alert('Bạn không có quyền truy cập vào trang này!');
  return <Navigate to="/login" replace />;
};

export default AdminRoute;