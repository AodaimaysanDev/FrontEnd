import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Protected Routes
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminRoute from './components/admin/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProfilePage from './pages/ProfilePage';
import BookAppointmentPage from './pages/BookAppointmentPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement'; 
import OrderDetailPage from './pages/OrderDetailPage';
import AppointmentManagement from './pages/admin/AppointmentManagement';
import CategoryManagement from './pages/admin/CategoryManagement';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* KHU VỰC ADMIN */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="orders" element={<OrderManagement />} /> {/* <-- Route mới */}
          <Route path="order/:id" element={<OrderDetailPage />} />
          <Route path="appointments" element={<AppointmentManagement />} />
        </Route>
      </Route>

      {/* KHU VỰC KHÁCH HÀNG */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-success" element={<OrderSuccessPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="order/:id" element={<OrderDetailPage />} />
            <Route path="book-appointment" element={<BookAppointmentPage />} />
        </Route>
        
        <Route path="*" element={<div>404 - Trang không tồn tại</div>} />
      </Route>
    </Routes>
    </>
  );
}
export default App;