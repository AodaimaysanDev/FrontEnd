import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const allowedTimes = [];
for (let h = 8; h <= 20; h++) {
  allowedTimes.push(`${h.toString().padStart(2, '0')}:00`);
  allowedTimes.push(`${h.toString().padStart(2, '0')}:30`);
}

const AppointmentManagement = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', date: '', time: '', note: '', status: 'pending' });
  const [editError, setEditError] = useState('');

  const fetchWithFallback = async (method, path, data, config) => {
    try {
      if (method === 'get') return await axios.get(`https://nhhminh.io.vn${path}`, config);
      if (method === 'put') return await axios.put(`https://nhhminh.io.vn${path}`, data, config);
      if (method === 'delete') return await axios.delete(`https://nhhminh.io.vn${path}`, config);
    } catch {
      if (method === 'get') return await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, config);
      if (method === 'put') return await axios.put(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, data, config);
      if (method === 'delete') return await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, config);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await fetchWithFallback('get', '/api/appointments', null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(data.appointments);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await fetchWithFallback('put', `/api/appointments/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAppointments();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa lịch hẹn này?')) return;
    try {
      await fetchWithFallback('delete', `/api/appointments/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAppointments();
    } catch {}
  };

  const handleEdit = (a) => {
    setEditId(a._id);
    setEditForm({ name: a.name, phone: a.phone, date: a.date, time: a.time, note: a.note || '', status: a.status });
    setEditError('');
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    setEditError('');
    if (!allowedTimes.includes(editForm.time)) {
      setEditError('Chỉ được chọn các mốc giờ chẵn hoặc 30 phút (VD: 8:00, 8:30, ...)');
      return;
    }
    try {
      await fetchWithFallback('put', `/api/appointments/${editId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditId(null);
      fetchAppointments();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Quản lý Lịch hẹn</h2>
      {loading ? <div>Đang tải...</div> : error ? <div className="text-red-600">{error}</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Tên</th>
                <th className="p-2 border">SĐT</th>
                <th className="p-2 border">Ngày</th>
                <th className="p-2 border">Giờ</th>
                <th className="p-2 border">Ghi chú</th>
                <th className="p-2 border">Trạng thái</th>
                <th className="p-2 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a._id} className="border-b">
                  <td className="p-2 border">{editId === a._id ? <input name="name" value={editForm.name} onChange={handleEditChange} className="border rounded px-2 py-1 w-28" /> : a.name}</td>
                  <td className="p-2 border">{editId === a._id ? <input name="phone" value={editForm.phone} onChange={handleEditChange} className="border rounded px-2 py-1 w-24" /> : a.phone}</td>
                  <td className="p-2 border">{editId === a._id ? <input type="date" name="date" value={editForm.date} onChange={handleEditChange} className="border rounded px-2 py-1 w-28" /> : a.date}</td>
                  <td className="p-2 border">{editId === a._id ? (
                    <select name="time" value={editForm.time} onChange={handleEditChange} className="border rounded px-2 py-1 w-20">
                      {allowedTimes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  ) : a.time}</td>
                  <td className="p-2 border">{editId === a._id ? <input name="note" value={editForm.note} onChange={handleEditChange} className="border rounded px-2 py-1 w-32" /> : a.note}</td>
                  <td className="p-2 border">{editId === a._id ? (
                    <select name="status" value={editForm.status} onChange={handleEditChange} className="border rounded px-2 py-1">
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  ) : a.status}</td>
                  <td className="p-2 border space-x-2">
                    {editId === a._id ? (
                      <>
                        <button onClick={handleEditSubmit} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">Lưu</button>
                        <button onClick={() => setEditId(null)} className="px-2 py-1 bg-gray-400 text-white rounded text-sm">Hủy</button>
                        {editError && <div className="text-red-600 text-xs mt-1">{editError}</div>}
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(a)} className="px-2 py-1 bg-yellow-500 text-white rounded text-sm">Sửa</button>
                        <button onClick={() => handleStatus(a._id, 'confirmed')} className="px-2 py-1 bg-green-500 text-white rounded text-sm">Xác nhận</button>
                        <button onClick={() => handleStatus(a._id, 'cancelled')} className="px-2 py-1 bg-yellow-500 text-white rounded text-sm">Hủy</button>
                        <button onClick={() => handleDelete(a._id)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">Xóa</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement; 