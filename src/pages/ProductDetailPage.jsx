import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // <-- Import useNavigate
import axios from 'axios';
import Spinner from '../components/Spinner';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // <-- Hook để điều hướng
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth(); // <-- Lấy trạng thái đăng nhập
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Không tìm thấy sản phẩm hoặc đã có lỗi xảy ra.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (isAuthenticated) {
      addToCart(product);
    } else {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login');
    }
  };

  const formatPrice = (price) => {
      if (typeof price !== 'number') return '';
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;
  if (error) return <p className="text-center text-red-500 text-2xl mt-10">{error}</p>;
  if (!product) return <p className="text-center text-gray-500 text-2xl mt-10">Không có dữ liệu sản phẩm.</p>;

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.imageUrl || `https://placehold.co/600x400`} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-gray-500">{product.category}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 my-2">{product.name}</h1>
          <p className="text-3xl font-bold text-blue-600 my-4">{formatPrice(product.price)}</p>
          <div className="my-4">
            <h2 className="text-xl font-semibold mb-2">Mô tả sản phẩm</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
          <p className="text-md text-gray-700 mt-4">Số lượng còn lại: <span className="font-bold">{product.stock}</span></p>
          <div className="mt-auto pt-6">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-green-600 transition-colors"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetailPage;