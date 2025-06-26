import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // <-- Import useNavigate
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const OrderDetailPage = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate(); // <-- Hook để điều hướng
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`http://localhost:8080/api/orders/${id}`, config);
                if (data.success) {
                    setOrder(data.order);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể tải chi tiết đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        if (token && id) {
            fetchOrderDetails();
        }
    }, [id, token]);
    
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    const formatDate = (dateString) => new Date(dateString).toLocaleString('vi-VN');

    if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;
    if (error) return <p className="text-center text-red-500 text-2xl mt-10">{error}</p>;
    if (!order) return <p className="text-center text-gray-500 text-2xl mt-10">Không tìm thấy đơn hàng.</p>;

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
            {/* --- NÚT QUAY LẠI ĐÃ ĐƯỢC THÊM --- */}
            <button
                onClick={() => navigate(-1)} // navigate(-1) sẽ quay lại trang trước đó
                className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Quay lại
            </button>

            <h1 className="text-2xl font-bold mb-4">Chi tiết Đơn hàng #{order._id.substring(0, 8)}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                    <h2 className="text-lg font-semibold mb-2">Địa chỉ giao hàng</h2>
                    <p className="text-gray-700">{order.user.name}</p>
                    <p className="text-gray-700">{order.shippingInfo.phoneNo}</p>
                    <p className="text-gray-700">{order.shippingInfo.address}, {order.shippingInfo.city}</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-2">Thông tin Đơn hàng</h2>
                    <p className="text-gray-700">Ngày đặt: {formatDate(order.createdAt)}</p>
                    <p className="text-gray-700">Trạng thái: <span className="font-semibold">{order.orderStatus}</span></p>
                    {order.deliveredAt && <p className="text-gray-700">Ngày giao: {formatDate(order.deliveredAt)}</p>}
                </div>
            </div>

            <h2 className="text-lg font-semibold mb-2 border-t pt-4">Các sản phẩm đã đặt</h2>
            <div className="space-y-4">
                {order.orderItems.map(item => (
                    <div key={item.product} className="flex items-center border-b pb-4">
                        <div className="ml-4 flex-grow">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-600">{formatPrice(item.price)} x {item.quantity}</p>
                        </div>
                        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-end mt-6">
                <div className="w-full max-w-xs">
                    <div className="flex justify-between font-bold text-xl">
                        <span>Tổng cộng:</span>
                        <span>{formatPrice(order.totalPrice)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default OrderDetailPage;
