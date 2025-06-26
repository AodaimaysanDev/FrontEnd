import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow w-full py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
          {/* Các trang con của khách hàng sẽ được render ở đây */}
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default MainLayout;