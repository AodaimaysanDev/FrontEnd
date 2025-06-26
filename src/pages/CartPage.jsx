import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Giỏ hàng của bạn đang trống</h1>
        <p className="text-gray-600 mb-8">Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</p>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
          Bắt đầu mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột danh sách sản phẩm */}
        <div className="lg:col-span-2">
          {cartItems.map(item => (
            <div key={item._id} className="flex items-center border-b py-4">
              <img src={item.imageUrl || `https://placehold.co/100x100`} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4"/>
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-500">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center mx-4">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1 border rounded-l-md">-</button>
                <input type="number" value={item.quantity} readOnly className="w-12 text-center border-t border-b"/>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1 border rounded-r-md">+</button>
              </div>
              <p className="w-32 text-right font-semibold">{formatPrice(item.price * item.quantity)}</p>
              <button onClick={() => removeFromCart(item._id)} className="ml-4 text-red-500 hover:text-red-700">
                &times;
              </button>
            </div>
          ))}
        </div>
        
        {/* Cột tổng kết đơn hàng */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
            <h2 className="text-xl font-bold mb-4">Tổng cộng</h2>
            <div className="flex justify-between mb-2">
              <span>Tạm tính</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Thành tiền</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <button className="w-full bg-green-500 text-white mt-6 py-3 rounded-lg font-bold hover:bg-green-600">
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;