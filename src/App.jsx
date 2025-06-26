import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import các component layout chung
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import tất cả các component trang
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    // Layout flex-col để đảm bảo Footer luôn ở cuối trang
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Phần thân chính của trang, sẽ tự động co giãn */}
      <main className="flex-grow w-full py-6 md:py-8">
        {/* Container chung để bọc và căn giữa nội dung của mọi trang */}
        <div className="container mx-auto px-4 md:px-6">
          <Routes>
            {/* Routes cho các trang công khai */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Routes cho việc xác thực */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* (Trong tương lai có thể thêm các route được bảo vệ ở đây) */}
          </Routes>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
