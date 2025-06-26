import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ProductModal = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: ''
  });
  
  const { token } = useAuth();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
        imageUrl: product.imageUrl || ''
      });
    } else {
        setFormData({
            name: '', description: '', price: '', category: '', stock: '', imageUrl: ''
        });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      if (product) {
        await axios.put(`http://localhost:8080/api/products/${product._id}`, formData, config);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        await axios.post('http://localhost:8080/api/products', formData, config);
        alert('Thêm sản phẩm mới thành công!');
      }
      onSuccess();
    } catch (error) {
      console.error('Lỗi khi lưu sản phẩm:', error.response ? error.response.data : error.message);
      alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{product ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Danh mục</label>
                  <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div className="mb-4">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá</label>
                  <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div className="mb-4">
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Số lượng tồn kho</label>
                  <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div className="md:col-span-2 mb-4">
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">URL Hình ảnh</label>
                  <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div className="md:col-span-2 mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả</label>
                  <textarea name="description" id="description" rows="4" value={formData.description} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
              </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
              Hủy
            </button>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;