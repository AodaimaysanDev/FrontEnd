import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    phoneNo: '',
  });

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const orderData = {
      shippingInfo,
      orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
      })),
      totalPrice: cartTotal,
    };
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/orders`, orderData, config);
      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      alert('Đặt hàng thất bại. Vui lòng thử lại.');
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Thông tin giao hàng</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Địa chỉ</label>
            <input type="text" name="address" value={shippingInfo.address} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg"/>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Thành phố / Tỉnh</label>
            <input type="text" name="city" value={shippingInfo.city} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg"/>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Số điện thoại</label>
            <input type="text" name="phoneNo" value={shippingInfo.phoneNo} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg"/>
          </div>
          <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600">
            Xác nhận và Đặt hàng
          </button>
        </form>
      </div>
      <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
        <h2 className="text-xl font-bold mb-4">Đơn hàng của bạn</h2>
        {cartItems.map(item => (
          <div key={item._id} className="flex justify-between items-center mb-2 text-sm">
            <span>{item.name} x {item.quantity}</span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
          <span>Thành tiền</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;