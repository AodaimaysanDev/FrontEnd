import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { token } = useAuth();

  // Create API instance with auth token and proper base URL
  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL || 'https://nhhminh.io.vn',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  // Log the API configuration for debugging
  console.log('API Configuration:', {
    baseURL: import.meta.env.VITE_BACKEND_API_URL || 'https://nhhminh.io.vn',
    hasAuthToken: !!token
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/categories');
      if (Array.isArray(response.data)) {
        setCategories(response.data);
        setError(null);
      } else {
        console.error("Unexpected response format:", response.data);
        setCategories([]);
        setError('Dữ liệu danh mục không đúng định dạng.');
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Log more detailed error information
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Status code:", err.response.status);
      } else if (err.request) {
        console.error("No response received");
      }
      setError('Không thể tải danh mục. Vui lòng kiểm tra kết nối hoặc đăng nhập lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await api.post('/api/categories', { name: newCategoryName });
      setNewCategoryName('');
      fetchCategories();
    } catch (err) {
      alert('Lỗi khi tạo danh mục mới.');
      console.error(err);
    }
  };

  const handleUpdate = async (category) => {
    if (!category.name.trim()) return;
    try {
      await api.put(`/api/categories/${category._id}`, { name: category.name });
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      alert('Lỗi khi cập nhật danh mục.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        await api.delete(`/api/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert('Lỗi khi xóa danh mục.');
        console.error(err);
      }
    }
  };

  const startEditing = (category) => {
    setEditingCategory({ ...category });
  };

  const cancelEditing = () => {
    setEditingCategory(null);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Quản lý Danh mục</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
          <button 
            onClick={fetchCategories} 
            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Form thêm mới */}
      <form onSubmit={handleCreate} className="mb-8 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Thêm danh mục mới</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Tên danh mục mới"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Thêm'}
          </button>
        </div>
      </form>
      
      {loading && <div className="flex justify-center my-8"><Spinner /></div>}

      {/* Bảng danh sách */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên danh mục</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(categories) ? categories.map((cat) => (
              <tr key={cat._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCategory && editingCategory._id === cat._id ? (
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      className="px-2 py-1 border rounded-md"
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingCategory && editingCategory._id === cat._id ? (
                    <>
                      <button onClick={() => handleUpdate(editingCategory)} className="text-green-600 hover:text-green-900 mr-4">Lưu</button>
                      <button onClick={cancelEditing} className="text-gray-600 hover:text-gray-900">Hủy</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(cat)} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</button>
                      <button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:text-red-900">Xóa</button>
                    </>
                  )}
                </td>
              </tr>
            )) : <tr><td colSpan="2" className="px-6 py-4 text-center">Không có dữ liệu danh mục</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManagement;
