import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  return (
    <div className="text-center py-16 bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-green-500 mb-4">Đặt hàng thành công!</h1>
      <p className="text-gray-600 mb-8">Cảm ơn bạn đã mua sắm. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể.</p>
      <div className="space-x-4">
        <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
          Tiếp tục mua sắm
        </Link>
        <Link to="/profile" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300">
          Xem lịch sử đơn hàng
        </Link>
      </div>
    </div>
  );
};
export default OrderSuccessPage;