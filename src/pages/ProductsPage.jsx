import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(30);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [categories, setCategories] = useState([]);

  const fetchWithFallback = async (path, config) => {
    try {
      return await axios.get(`http://localhost:8080${path}`, config);
    } catch {
      return await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, config);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchWithFallback('/api/products');
        setProducts(response.data);
        // Lấy danh sách danh mục duy nhất từ sản phẩm
        const uniqueCategories = Array.from(new Set(response.data.map(p => p.category).filter(Boolean)));
        setCategories(uniqueCategories);
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

  // Lọc sản phẩm theo danh mục
  const filteredProducts = selectedCategory === 'Tất cả'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 border-l-4 border-blue-600 pl-4">
        Tất Cả Sản Phẩm
      </h1>
      {/* Dropdown chọn danh mục */}
      <div className="mb-6 flex justify-end">
        <select
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={e => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1); // Reset về trang đầu khi đổi danh mục
          }}
        >
          <option value="Tất cả">Tất cả</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      {currentProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <Pagination
            productsPerPage={productsPerPage}
            totalProducts={filteredProducts.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      ) : (
         <p className="text-center text-gray-500 text-lg">Không có sản phẩm nào để hiển thị.</p>
      )}
    </div>
  );
};
export default ProductsPage;