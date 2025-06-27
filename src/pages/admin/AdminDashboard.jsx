import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';

// Một component con để hiển thị từng thẻ thống kê cho gọn
const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md flex items-center border-l-4 ${color}`}>
      <div className="mr-4 text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchWithFallback = async (path, config) => {
    try {
      return await axios.get(`http://localhost:8080${path}`, config);
    } catch {
      return await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, config);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await fetchWithFallback('/api/stats', config);
        
        if (data.success) {
          setStats(data.stats);
        } else {
          setError("Không thể tải dữ liệu thống kê.");
        }
      } catch (err) {
        console.error("Lỗi khi fetch thống kê:", err);
        setError("Đã có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng Doanh Thu"
            value={formatPrice(stats.totalRevenue)}
            icon="💰"
            color="border-green-500"
          />
          <StatCard
            title="Sản Phẩm"
            value={stats.productCount}
            icon="📦"
            color="border-blue-500"
          />
          <StatCard
            title="Đơn Hàng Chờ"
            value={stats.pendingOrdersCount}
            icon="⏳"
            color="border-yellow-500"
          />
          <StatCard
            title="Người Dùng"
            value={stats.userCount}
            icon="👥"
            color="border-purple-500"
          />
        </div>
      )}

      {/* Bạn có thể thêm các biểu đồ hoặc bảng dữ liệu khác ở đây */}
    </div>
  );
};

export default AdminDashboard;