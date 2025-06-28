import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWithFallback = async (path, config) => {
    try {
      return await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, config);
    } catch {
      return await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, config);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchWithFallback('/api/products');
        // Lấy 15 sản phẩm ngẫu nhiên
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        const randomProducts = shuffled.slice(0, 15);
        setProducts(randomProducts);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi fetch sản phẩm:", err);
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Chào mừng đến với Shop áo dài may sẵn
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Nơi mua sắm áo dài tốt nhất dành cho bạn
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-blue-600 font-bold py-4 px-8 rounded-lg text-lg hover:bg-blue-50 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Xem các sản phẩm áo dài
          </Link>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Sản phẩm nổi bật
          </h2>
          <p className="text-lg text-gray-600">
            Khám phá những mẫu áo dài đẹp nhất của chúng tôi
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Đa dạng mẫu mã</h3>
              <p className="text-gray-600">Nhiều kiểu dáng áo dài phù hợp với mọi dịp</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Chất lượng cao</h3>
              <p className="text-gray-600">Sản phẩm được may từ chất liệu tốt nhất</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Giao hàng nhanh</h3>
              <p className="text-gray-600">Giao hàng toàn quốc với dịch vụ tốt nhất</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;