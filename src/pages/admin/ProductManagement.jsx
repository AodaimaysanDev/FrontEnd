import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import ProductModal from '../../components/admin/ProductModal';
import { useAuth } from '../../context/AuthContext';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { token } = useAuth();

  const fetchWithFallback = async (method, path, data, config) => {
    try {
      if (method === 'get') return await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, config);
      if (method === 'delete') return await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, config);
    } catch {
      if (method === 'get') return await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, config);
      if (method === 'delete') return await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, config);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetchWithFallback('get', '/api/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi fetch sản phẩm:", err);
      setError('Không thể tải danh sách sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      try {
        await fetchWithFallback('delete', `/api/products/${productId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert('Sản phẩm đã được xóa thành công!');
        fetchProducts();
      } catch (err) {
        console.error('Lỗi khi xóa sản phẩm:', err);
        alert('Xóa sản phẩm thất bại!');
      }
    }
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) {
      return (
          <div className="flex justify-center items-center h-64">
              <Spinner />
          </div>
      );
  }
  
  if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Thêm sản phẩm mới
        </button>
      </div>

      {products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{formatPrice(product.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">
          Chưa có sản phẩm nào trong cửa hàng. Hãy thêm sản phẩm mới!
        </p>
      )}
      
      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
};

export default ProductManagement;