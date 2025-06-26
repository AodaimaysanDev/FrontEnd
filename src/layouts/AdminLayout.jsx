import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-grow p-6 bg-gray-100">
        {/* Các trang con của admin (Dashboard, ProductManagement) sẽ được render ở đây */}
        <Outlet />
      </main>
    </div>
  );
};
export default AdminLayout;