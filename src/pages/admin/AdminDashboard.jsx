import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// Một component nhỏ để hiển thị từng thẻ thống kê
const StatCard = ({ title, value, icon, colorClass }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md flex items-center ${colorClass}`}>
    <div className="mr-4 text-4xl">{icon}</div>
    <div>
      <p className="text-lg font-semibold text-gray-700">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    productCount: 0,
    orderCount: 0, // Sẽ được cập nhật khi có API đơn hàng
  });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Trong tương lai, bạn sẽ tạo các API riêng để lấy các con số này.
        // Hiện tại, chúng ta sẽ gọi API có sẵn và giả lập các số liệu khác.
        
        // 1. Lấy số lượng sản phẩm (thật)
        const productResponse = await axios.get('http://localhost:8080/api/products');
        const productCount = productResponse.data.length;
        
        // 2. Giả lập API lấy số lượng người dùng và đơn hàng
        // (Khi có API, bạn sẽ thay thế các dòng này bằng axios.get)
        const userCount = 12; // Giả lập
        const orderCount = 58; // Giả lập

        setStats({
          userCount: userCount,
          productCount: productCount,
          orderCount: orderCount,
        });

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tổng quan</h1>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Tổng số người dùng" 
            value={stats.userCount} 
            icon="👥" 
            colorClass="border-l-4 border-blue-500"
          />
          <StatCard 
            title="Tổng số sản phẩm" 
            value={stats.productCount} 
            icon="📦"
            colorClass="border-l-4 border-green-500"
          />
          <StatCard 
            title="Tổng số đơn hàng" 
            value={stats.orderCount} 
            icon="🛒"
            colorClass="border-l-4 border-yellow-500"
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;