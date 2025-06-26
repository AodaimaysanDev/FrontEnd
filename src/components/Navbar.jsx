import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth

const Navbar = () => {
  const { cartItems } = useCart(); // <-- Lấy cartItems từ context
  const { isAuthenticated, user, logout } = useAuth(); // <-- Lấy trạng thái từ AuthContext
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            MyShop
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-500">
              Trang Chủ
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-blue-500">
              Sản Phẩm
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-blue-500 relative">
              Giỏ Hàng
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{totalItems}</span>
              )}
            </Link>
            {isAuthenticated ? (
                // --- GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP ---
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Chào, {user?.name || 'bạn'}!</span>
                    <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600">
                        Đăng xuất
                    </button>
                </div>
            ) : (
                // --- GIAO DIỆN KHI CHƯA ĐĂNG NHẬP ---
                <Link to="/login" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg ...">
                    Đăng Nhập
                </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;