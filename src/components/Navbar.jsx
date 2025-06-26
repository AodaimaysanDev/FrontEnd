import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { cartItems } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // --- LOGIC MỚI CHO DROPDOWN ---
    // State để quản lý menu đang mở hay đóng
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // Ref để tham chiếu đến div của dropdown, giúp phát hiện click bên ngoài
    const dropdownRef = useRef(null);

    const activeLinkStyle = {
        color: '#2563eb', // text-blue-600
        fontWeight: '600',
    };

    // Effect để lắng nghe sự kiện click ra bên ngoài dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Nếu dropdown đang mở và người dùng click ra ngoài nó
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false); // Đóng dropdown
            }
        };

        // Thêm event listener vào document
        document.addEventListener('mousedown', handleClickOutside);

        // Dọn dẹp event listener khi component bị unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Chỉ chạy 1 lần

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="text-3xl font-bold text-blue-600 tracking-tight">
                        MyShop
                    </Link>
                    <nav className="hidden md:flex items-center space-x-8 text-lg">
                        <NavLink to="/" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="text-gray-600 hover:text-blue-600 transition-colors">
                            Trang Chủ
                        </NavLink>
                        <NavLink to="/products" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="text-gray-600 hover:text-blue-600 transition-colors">
                            Sản Phẩm
                        </NavLink>
                        {/* Thêm link Admin nếu user là admin */}
                        {isAuthenticated && user?.role === 'admin' && (
                             <NavLink to="/admin" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="text-gray-600 hover:text-blue-600 transition-colors">
                                Admin Panel
                            </NavLink>
                        )}
                    </nav>
                    <div className="flex items-center space-x-4">
                        <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{totalItems}</span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            // --- DROPDOWN ĐÃ SỬA LỖI ---
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(prev => !prev)} // Bật/tắt menu khi click
                                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                                >
                                    <span className="text-gray-700">Chào, {user?.name}!</span>
                                    <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>

                                {/* Hiển thị menu nếu isDropdownOpen là true */}
                                {isDropdownOpen && ( 
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border">
                                        <Link 
                                            to="/profile" 
                                            onClick={() => setIsDropdownOpen(false)} // Đóng menu sau khi click
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Tài khoản & Đơn hàng
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105">
                                Đăng Nhập
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
