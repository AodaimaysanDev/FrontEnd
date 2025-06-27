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

    // State cho mobile menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Chỉ chạy 1 lần

    // Đóng mobile menu khi chuyển route
    useEffect(() => {
        if (isMobileMenuOpen) {
            const closeMenu = () => setIsMobileMenuOpen(false);
            window.addEventListener('popstate', closeMenu);
            return () => window.removeEventListener('popstate', closeMenu);
        }
    }, [isMobileMenuOpen]);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="text-3xl font-bold text-blue-600 tracking-tight">
                        Áo dài may sẵn cô Định
                    </Link>
                    {/* Desktop menu */}
                    <nav className="hidden md:flex items-center space-x-8 text-lg">
                        <NavLink to="/" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="text-gray-600 hover:text-blue-600 transition-colors">
                            Trang Chủ
                        </NavLink>
                        <NavLink to="/products" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="text-gray-600 hover:text-blue-600 transition-colors">
                            Sản Phẩm
                        </NavLink>
                        {isAuthenticated && (
                            <NavLink to="/book-appointment" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="text-gray-600 hover:text-blue-600 transition-colors">
                                Đặt lịch hẹn
                            </NavLink>
                        )}
                        {isAuthenticated && user?.role === 'admin' && (
                             <NavLink to="/admin" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="text-gray-600 hover:text-blue-600 transition-colors">
                                Admin Panel
                            </NavLink>
                        )}
                    </nav>
                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Mở menu"
                    >
                        <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    <div className="flex items-center space-x-4">
                        <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{totalItems}</span>
                            )}
                        </Link>
                        {/* Desktop user menu */}
                        {isAuthenticated ? (
                            <div className="relative hidden md:block" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(prev => !prev)}
                                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                                >
                                    <span className="text-gray-700">Chào, {user?.name}!</span>
                                    <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                                {isDropdownOpen && ( 
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border">
                                        <Link 
                                            to="/profile" 
                                            onClick={() => setIsDropdownOpen(false)}
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
                            <Link to="/login" className="hidden md:inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105">
                                Đăng Nhập
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            {/* Overlay và mobile menu */}
            {isMobileMenuOpen && (
                <>
                    {/* Overlay */}
                    <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setIsMobileMenuOpen(false)}></div>
                    {/* Off-canvas menu */}
                    <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 flex flex-col p-6 animate-slide-in">
                        <button
                            className="self-end mb-6 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-label="Đóng menu"
                        >
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <nav className="flex flex-col space-y-4 text-lg">
                            <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="text-gray-700 hover:text-blue-600 transition-colors">
                                Trang Chủ
                            </NavLink>
                            <NavLink to="/products" onClick={() => setIsMobileMenuOpen(false)} style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="text-gray-700 hover:text-blue-600 transition-colors">
                                Sản Phẩm
                            </NavLink>
                            {isAuthenticated && user?.role === 'admin' && (
                                <NavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)} style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className="text-gray-700 hover:text-blue-600 transition-colors">
                                    Admin Panel
                                </NavLink>
                            )}
                            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Giỏ hàng {totalItems > 0 && <span className="ml-1 text-xs bg-red-600 text-white rounded-full px-2 py-0.5">{totalItems}</span>}
                            </Link>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 transition-colors">
                                        Tài khoản & Đơn hàng
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="text-gray-700 hover:text-blue-600 transition-colors text-left"
                                    >
                                        Đăng xuất
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105 mt-4">
                                    Đăng Nhập
                                </Link>
                            )}
                        </nav>
                    </div>
                </>
            )}
            {/* Thêm animation cho off-canvas */}
            <style>{`
                @keyframes slide-in {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slide-in 0.25s cubic-bezier(0.4,0,0.2,1);
                }
            `}</style>
        </header>
    );
};

export default Navbar;
