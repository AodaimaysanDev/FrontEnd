import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // <-- Import useAuth

const AdminSidebar = () => {
  const { logout } = useAuth(); // <-- Lấy hàm logout từ context

  const activeStyle = {
    backgroundColor: '#1d4ed8', // bg-blue-700
    color: 'white',
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
      logout();
    }
  };

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <NavLink 
                to="/admin/dashboard" 
                style={({isActive}) => isActive ? activeStyle : undefined} 
                className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Dashboard
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink 
                to="/admin/products" 
                style={({isActive}) => isActive ? activeStyle : undefined} 
                className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Quản lý Sản phẩm
              </NavLink>
            </li>
            {/* (Các link quản lý khác sẽ được thêm ở đây) */}
          </ul>
        </nav>
      </div>
      
      {/* Nút Đăng xuất ở cuối sidebar */}
      <div className="mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;