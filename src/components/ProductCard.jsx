import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth(); // <-- Lấy trạng thái đăng nhập
  const navigate = useNavigate(); // <-- Hook để điều hướng

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  // Lấy hình ảnh đầu tiên từ mảng images, nếu không có thì dùng imageUrl, nếu vẫn không có thì dùng placeholder
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return product.imageUrl || `https://placehold.co/600x400/e2e8f0/e2e8f0?text=Image`;
  };
  
  const imageUrl = getProductImage();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Ngăn thẻ Link bên ngoài hoạt động khi bấm nút
    if (isAuthenticated) {
      // Nếu đã đăng nhập, thêm vào giỏ
      addToCart(product);
    } else {
      // Nếu chưa, thông báo và chuyển đến trang đăng nhập
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login');
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="block bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5 flex flex-col">
        <p className="text-sm text-gray-500 mb-1">
          {typeof product.category === 'object' && product.category !== null 
            ? product.category.name 
            : product.category}
        </p>
        <h3 className="text-lg font-semibold text-gray-800 truncate mb-2" title={product.name}>
          {product.name}
        </h3>
        <div className="mt-auto">
          <p className="text-xl font-bold text-blue-600 mb-4">
            {formatPrice(product.price)}
          </p>
          <button 
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;