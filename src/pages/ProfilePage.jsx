import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  
  const fetchWithFallback = async (path, config) => {
    try {
      return await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, config);
    } catch {
      return await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, config);
    }
  };

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await fetchWithFallback('/api/orders/myorders', config);
        setOrders(data.orders);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [token]);

  useEffect(() => {
    // Lấy lịch hẹn của user
    const fetchAppointments = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await fetchWithFallback('/api/appointments/my', config);
        setAppointments(data.appointments);
      } catch {}
    };
    fetchAppointments();
  }, [token]);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

  if (loading) return <Spinner />;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Chào, {user?.name}!</h1>
      <h2 className="text-xl font-semibold mb-6">Lịch sử đơn hàng của bạn</h2>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            // Bọc toàn bộ div trong thẻ Link
            <Link to={`/order/${order._id}`} key={order._id} className="block border p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-blue-600">Đơn hàng #{order._id.substring(0, 8)}</p>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ...`}>
                    {order.orderStatus}
                </span>
              </div>
              <p>Ngày đặt: {formatDate(order.createdAt)}</p>
              <p>Tổng tiền: {formatPrice(order.totalPrice)}</p>
            </Link>
          ))}
        </div>
      )}
      <h3 className="text-xl font-semibold mt-8 mb-2">Lịch hẹn của bạn</h3>
      {appointments.length === 0 ? <div>Chưa có lịch hẹn nào.</div> : (
        <ul className="divide-y">
          {appointments.map(a => (
            <li key={a._id} className="py-2">
              <span className="font-medium">{a.date} {a.time}</span> - {a.name} - {a.phone} - {a.note} <span className="ml-2 text-sm text-gray-500">({a.status})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default ProfilePage;