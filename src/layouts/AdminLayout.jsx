import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-grow p-6 bg-gray-100">
        {/* Outlet sẽ render component con tương ứng với route */}
        <Outlet />
      </main>
    </div>
  );
};
export default AdminLayout;