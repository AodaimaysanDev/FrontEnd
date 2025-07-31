import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { optimizeBase64Image, fileToBase64 } from '../../utils/imageUtils';

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
      if (method === 'get') return await axios.get(`https://nhhminh.io.vn${path}`, config);
      if (method === 'put') return await axios.put(`https://nhhminh.io.vn${path}`, data, config);
      if (method === 'post') return await axios.post(`https://nhhminh.io.vn${path}`, data, config);
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
      // When editing an existing product
      const sizeArray = Array.isArray(product.size) ? product.size : [];
      const colorArray = Array.isArray(product.color) ? product.color : [];
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category?._id || product.category || '',
        stock: product.stock || '',
        imageUrl: product.imageUrl || '',
        images: Array.isArray(product.images) ? product.images : [],
        size: sizeArray,
        color: colorArray,
      });
    } else {
      // When creating a new product
      setFormData({
        name: '', 
        description: '', 
        price: '', 
        category: '', 
        stock: '', 
        imageUrl: '', 
        images: [], 
        size: [], 
        color: []
      });
    }
  }, [product, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'size' || name === 'color') {
      // Store the raw input value for size and color instead of splitting immediately
      // This allows users to type commas and see the live input
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === 'imageUrl' && value === '') {
      // Keep the existing value if it's a base64 string and the input is cleared
      if (formData.imageUrl && formData.imageUrl.startsWith('data:image')) {
        // Do nothing, keep the base64 value
      } else {
        setFormData(prev => ({ ...prev, imageUrl: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageAdd = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };
  
  const handleFileUpload = async (index, file) => {
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file quá lớn (tối đa 5MB)');
      return;
    }
    
    try {
      // Convert to base64 and optimize
      const base64String = await fileToBase64(file);
      if (!base64String) {
        alert('Không thể đọc tập tin hình ảnh');
        return;
      }
      
      // Optimize the image
      const optimizedImage = await optimizeBase64Image(base64String, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200
      });
      
      if (!optimizedImage) {
        alert('Không thể tối ưu hình ảnh');
        return;
      }
      
      const newImages = [...formData.images];
      newImages[index] = optimizedImage;
      setFormData(prev => ({ ...prev, images: newImages }));
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Lỗi khi xử lý hình ảnh');
    }
  };

  const handleImageChange = (index, value) => {
    // For direct URL input (backward compatibility)
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

      // Ensure size and color are properly formatted arrays
      if (typeof dataToSend.size === 'string') {
        dataToSend.size = dataToSend.size.split(',').map(s => s.trim()).filter(Boolean);
      } else {
        dataToSend.size = Array.isArray(dataToSend.size) ? dataToSend.size.filter(s => s && s.trim()) : [];
      }
      
      if (typeof dataToSend.color === 'string') {
        dataToSend.color = dataToSend.color.split(',').map(c => c.trim()).filter(Boolean);
      } else {
        dataToSend.color = Array.isArray(dataToSend.color) ? dataToSend.color.filter(c => c && c.trim()) : [];
      }
      
      // Log the parsed arrays for debugging
      console.log('Parsed size array:', dataToSend.size);
      console.log('Parsed color array:', dataToSend.color);
      
      // Validate and clean up images
      dataToSend.images = Array.isArray(dataToSend.images) 
        ? dataToSend.images.filter(img => img && typeof img === 'string') 
        : [];
      
      // Make sure imageUrl is a string
      if (dataToSend.imageUrl && typeof dataToSend.imageUrl === 'string') {
        // Keep it as is (either URL or base64)
      } else {
        dataToSend.imageUrl = '';
      }
      
      // Check if images are too large
      const totalSize = JSON.stringify(dataToSend).length;
      const megabytes = totalSize / (1024 * 1024);
      
      if (megabytes > 10) {
        alert(`Kích thước tổng hợp các ảnh quá lớn (${megabytes.toFixed(2)}MB). Vui lòng giảm số lượng hoặc kích thước ảnh.`);
        return;
      }
      
      console.log(`Sending data: ${dataToSend.images.length} images, main image: ${dataToSend.imageUrl ? 'yes' : 'no'}, total size: ${megabytes.toFixed(2)}MB`);

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
                    <span className="text-xs text-gray-500">(Nhập các kích thước cách nhau bởi dấu phẩy, VD: S, M, L, XL)</span>
                  </label>
                  <input 
                    type="text" 
                    name="size" 
                    id="size" 
                    value={typeof formData.size === 'string' ? formData.size : Array.isArray(formData.size) ? formData.size.join(', ') : ''} 
                    onChange={handleChange} 
                    placeholder="Nhập kích thước: S, M, L, XL"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {formData.size && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-600 mb-1">Kích thước đã thêm:</div>
                      <div className="flex flex-wrap gap-1">
                        {(typeof formData.size === 'string' 
                          ? formData.size.split(',').map(s => s.trim()).filter(Boolean)
                          : Array.isArray(formData.size) ? formData.size : []
                        ).map((size, index) => (
                          <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs border">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
              <div className="mb-4">
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                    Màu sắc 
                    <span className="text-xs text-gray-500">(Nhập các màu sắc cách nhau bởi dấu phẩy, VD: Đỏ, Xanh, Vàng)</span>
                  </label>
                  <input 
                    type="text" 
                    name="color" 
                    id="color" 
                    value={typeof formData.color === 'string' ? formData.color : Array.isArray(formData.color) ? formData.color.join(', ') : ''} 
                    onChange={handleChange} 
                    placeholder="Nhập màu sắc: Đỏ, Xanh, Vàng"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {formData.color && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-600 mb-1">Màu sắc đã thêm:</div>
                      <div className="flex flex-wrap gap-1">
                        {(typeof formData.color === 'string' 
                          ? formData.color.split(',').map(s => s.trim()).filter(Boolean)
                          : Array.isArray(formData.color) ? formData.color : []
                        ).map((color, index) => (
                          <span key={index} className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs border">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
              <div className="md:col-span-2 mb-4">
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Hình ảnh chính</label>
                  <div className="flex gap-2 items-center">
                      <div className="flex-1 flex gap-2">
                          <input 
                              type="file" 
                              accept="image/*"
                              onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                      try {
                                          const base64String = await fileToBase64(file);
                                          if (!base64String) {
                                              alert('Không thể đọc tập tin hình ảnh');
                                              return;
                                          }
                                          
                                          const optimizedImage = await optimizeBase64Image(base64String, {
                                              maxSizeMB: 1,
                                              maxWidthOrHeight: 1200
                                          });
                                          
                                          if (!optimizedImage) {
                                              alert('Không thể tối ưu hình ảnh');
                                              return;
                                          }
                                          
                                          setFormData(prev => ({ ...prev, imageUrl: optimizedImage }));
                                      } catch (error) {
                                          console.error('Error processing main image:', error);
                                          alert('Lỗi khi xử lý hình ảnh');
                                      }
                                  }
                              }}
                              className="flex-1"
                          />
                          <div className="flex items-center text-xs text-gray-500">hoặc</div>
                          <input 
                              type="text" 
                              name="imageUrl"
                              id="imageUrl" 
                              value={typeof formData.imageUrl === 'string' && !formData.imageUrl.startsWith('data:image') ? formData.imageUrl : ''}
                              onChange={handleChange}
                              placeholder="URL hình ảnh chính" 
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                      </div>
                      {formData.imageUrl && (
                          <>
                              <img 
                                  src={formData.imageUrl}
                                  alt="Hình ảnh chính" 
                                  className="w-16 h-16 object-cover rounded-md border" 
                                  onError={(e) => { e.target.style.display = 'none'; }}
                              />
                              <button 
                                  type="button" 
                                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                  className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                              >
                                  Xóa
                              </button>
                          </>
                      )}
                  </div>
              </div>
              
              <div className="md:col-span-2 mb-4">
                  <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Hình ảnh sản phẩm
                        <span className="text-xs text-gray-500 ml-1">(Có thể tải lên tập tin hoặc nhập URL)</span>
                      </label>
                      <button type="button" onClick={handleImageAdd} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">
                          + Thêm ảnh
                      </button>
                  </div>
                  {formData.images.map((image, index) => (
                      <div key={index} className="flex gap-2 mb-4">
                          <div className="flex-1 flex gap-2">
                              <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(index, e.target.files[0])}
                                  className="flex-1"
                              />
                              <div className="flex items-center text-xs text-gray-500">hoặc</div>
                              <input 
                                  type="text" 
                                  value={typeof image === 'string' && !image.startsWith('data:image') ? image : ''}
                                  onChange={(e) => handleImageChange(index, e.target.value)}
                                  placeholder="URL hình ảnh"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              />
                          </div>
                          {image && (
                              <img 
                                  src={image} 
                                  alt={`Preview ${index + 1}`} 
                                  className="w-16 h-16 object-cover rounded-md border"
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