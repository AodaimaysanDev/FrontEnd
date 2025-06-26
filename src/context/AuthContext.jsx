import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();

  // Thiết lập token cho các header của axios mỗi khi token thay đổi
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      // Bạn có thể thêm một hàm để lấy thông tin user từ token ở đây nếu cần
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);
  
  // Hàm đăng nhập
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      navigate('/'); // Chuyển hướng về trang chủ sau khi đăng nhập thành công
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert('Đăng nhập thất bại! Vui lòng kiểm tra lại email hoặc mật khẩu.');
    }
  };

  // Hàm đăng ký
  const register = async (name, email, password) => {
    try {
      await axios.post('http://localhost:8080/api/auth/register', { name, email, password });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login'); // Chuyển hướng đến trang đăng nhập
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      alert('Đăng ký thất bại! Email có thể đã được sử dụng.');
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};