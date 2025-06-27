import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true); // <-- THÊM STATE LOADING
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (token) {
          const decodedUser = jwtDecode(token);
          // Kiểm tra xem token đã hết hạn chưa
          if (decodedUser.exp * 1000 < Date.now()) {
            // Token đã hết hạn
            throw new Error("Token expired");
          }
          setUser({
            id: decodedUser.id,
            name: decodedUser.name,
            role: decodedUser.role,
          });
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          localStorage.setItem('token', token);
        } else {
            // Không có token
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
            setUser(null);
        }
      } catch (error) {
        console.error("Lỗi xác thực hoặc token không hợp lệ:", error);
        // Xóa token hỏng nếu có lỗi
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        // --- THAY ĐỔI QUAN TRỌNG ---
        // Sau khi kiểm tra xong, dù thành công hay thất bại, báo hiệu là đã hết loading.
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [token]);
  
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      setToken(response.data.token);
      // Kiểm tra vai trò và chuyển hướng
      const decodedUser = jwtDecode(response.data.token);
      if (decodedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert('Đăng nhập thất bại! Vui lòng kiểm tra lại email hoặc mật khẩu.');
    }
  };

  const register = async (username, name, email, password) => {
    try {
      await axios.post('http://localhost:8080/api/auth/register', { username, name, email, password });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      alert('Đăng ký thất bại! Email hoặc username có thể đã được sử dụng.');
    }
  };

  const logout = () => {
    setToken(null);
    navigate('/login');
  };

  const value = {
    user,
    token,
    isLoading, // <-- Cung cấp trạng thái loading ra ngoài
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  // Chỉ render các component con khi quá trình kiểm tra auth ban đầu đã xong
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};