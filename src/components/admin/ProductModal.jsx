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
    imageUrl: '',
    images: [],
    size: [],
    color: [],
  });
  const [categories, setCategories] = useState([]);
  const { token } = useAuth();

  const fetchWithFallback = async (method, path, data, config) => {
    try {
      if (method === 'get') return await axios.get(`http://localhost:8080${path}`, config);
      if (method === 'put') return await axios.put(`http://localhost:8080${path}`, data, config);
      if (method === 'post') return await axios.post(`http://localhost:8080${path}`, data, config);
    } catch {
      if (method === 'get') return await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, config);
      if (method === 'put') return await axios.put(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, data, config);
      if (method === 'post') return await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, data, config);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const response = await fetchWithFallback('get', '/api/categories', null, config);
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, [token]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category?._id || product.category || '',
        stock: product.stock || '',
        imageUrl: product.imageUrl || '',
        images: product.images || [],
        size: product.size || [],
        color: product.color || [],
      });
    } else {
        setFormData({
            name: '', description: '', price: '', category: '', stock: '', imageUrl: '', images: [], size: [], color: []
        });
    }
  }, [product, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'size' || name === 'color') {
      setFormData(prev => ({ ...prev, [name]: value.split(',').map(s => s.trim()).filter(Boolean) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageAdd = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleImageRemove = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
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
      
      const dataToSend = { ...formData };
      if (dataToSend.category === '') {
          delete dataToSend.category;
      }

      if (product) {
        await fetchWithFallback('put', `/api/products/${product._id}`, dataToSend, config);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        await fetchWithFallback('post', '/api/products', dataToSend, config);
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
                  <select name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                  </select>
              </div>
              <div className="mb-4">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá</label>
                  <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div className="mb-4">
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Số lượng tồn kho</label>
                  <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div className="mb-4">
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                    Kích thước 
                    <span className="text-xs text-gray-500">(VD: S, M, L, XL - cách nhau bởi dấu phẩy)</span>
                  </label>
                  <input 
                    type="text" 
                    name="size" 
                    id="size" 
                    value={Array.isArray(formData.size) ? formData.size.join(', ') : ''} 
                    onChange={handleChange} 
                    placeholder="S, M, L, XL"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {formData.size && formData.size.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {formData.size.map((size, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {size}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
              <div className="mb-4">
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                    Màu sắc 
                    <span className="text-xs text-gray-500">(VD: Đỏ, Xanh, Vàng - cách nhau bởi dấu phẩy)</span>
                  </label>
                  <input 
                    type="text" 
                    name="color" 
                    id="color" 
                    value={Array.isArray(formData.color) ? formData.color.join(', ') : ''} 
                    onChange={handleChange} 
                    placeholder="Đỏ, Xanh, Vàng"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {formData.color && formData.color.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {formData.color.map((color, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {color}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
              <div className="md:col-span-2 mb-4">
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">URL Hình ảnh chính (Backward compatibility)</label>
                  <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              
              <div className="md:col-span-2 mb-4">
                  <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Hình ảnh sản phẩm</label>
                      <button type="button" onClick={handleImageAdd} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">
                          + Thêm ảnh
                      </button>
                  </div>
                  {formData.images.map((image, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                          <input 
                              type="text" 
                              value={image} 
                              onChange={(e) => handleImageChange(index, e.target.value)}
                              placeholder="URL hình ảnh"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          {image && (
                              <img 
                                  src={image} 
                                  alt={`Preview ${index + 1}`} 
                                  className="w-10 h-10 object-cover rounded-md border"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                              />
                          )}
                          <button 
                              type="button" 
                              onClick={() => handleImageRemove(index)}
                              className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                          >
                              Xóa
                          </button>
                      </div>
                  ))}
                  {formData.images.length === 0 && (
                      <p className="text-sm text-gray-500 italic">Chưa có hình ảnh nào. Nhấp "Thêm ảnh" để thêm hình ảnh.</p>
                  )}
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