import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const fetchWithFallback = async (path, data, config) => {
  try {
    return await axios.post(`https://nhhminh.io.vn${path}`, data, config);
  } catch {
    return await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}${path}`, data, config);
  }
};

const allowedTimes = [];
for (let h = 8; h <= 20; h++) {
  allowedTimes.push(`${h.toString().padStart(2, '0')}:00`);
  allowedTimes.push(`${h.toString().padStart(2, '0')}:30`);
}

const BookAppointmentPage = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '', note: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await fetchWithFallback('/api/appointments', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Đặt lịch hẹn thành công!');
      setForm({ name: '', phone: '', date: '', time: '', note: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Đặt lịch hẹn</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Họ tên</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Số điện thoại</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Ngày</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Giờ</label>
          <select name="time" value={form.time} onChange={handleChange} required className="w-full border rounded px-3 py-2">
            <option value="">-- Chọn giờ --</option>
            {allowedTimes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Ghi chú</label>
          <textarea name="note" value={form.note} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
          {loading ? 'Đang gửi...' : 'Đặt lịch hẹn'}
        </button>
        {success && <div className="text-green-600 mt-2">{success}</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default BookAppointmentPage; 