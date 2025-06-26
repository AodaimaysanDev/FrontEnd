import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import các component layout chung
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import tất cả các component trang
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLayout from './layouts/AdminLayout';
import AdminRoute from './components/admin/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';

function App() {
  return (
    <Routes>
      {/* Routes cho trang khách hàng */}
      <Route path="/*" element={<MainLayout />} />

      {/* Routes cho trang quản trị */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/*" element={<AdminArea />} />
      </Route>
    </Routes>
  );
}

// Component cho layout chính của trang khách hàng
const MainLayout = () => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    <main className="flex-grow w-full py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-6">
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </main>
    <Footer />
  </div>
);

// Component cho khu vực admin
const AdminArea = () => (
    <AdminLayout>
        <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ProductManagement />} />
        </Routes>
    </AdminLayout>
);

export default App;