import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Store Information */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">Áo Dài Cô Định</h3>
            <p className="text-gray-300 mb-4">
              Chuyên cung cấp áo dài may sẵn chất lượng cao với nhiều mẫu mã đẹp, 
              phù hợp cho mọi dịp và mọi lứa tuổi.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">Thông Tin Liên Hệ</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 mt-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <div>
                  <p className="font-semibold">Địa chỉ:</p>
                  <p>141 Đường Nguyễn Tuân, Khu phố Nam Cao, Phường Vĩnh Quang, Thành phố Rạch Giá</p>
                  <p>Kiên Giang, Việt Nam</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 mt-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <div>
                  <p className="font-semibold">Điện thoại:</p>
                  <p>+(84) 919 414 006</p>
                  <p>0919 414 006</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 mt-1 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <div>
                  <p className="font-semibold">Facebook:</p>
                  <a 
                    href="https://www.facebook.com/nguyenthidinhhmd" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Định Nguyễn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">Giờ Làm Việc</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span>Thứ 2 - Chủ nhật:</span>
                <span>8:00 - 20:00</span>
              </div>
              <div className="mt-4 p-3 bg-blue-900 rounded-lg">
                <p className="text-sm text-blue-200">
                  <strong>Lưu ý:</strong> Chúng tôi nhận đặt hàng online 24/7
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">Liên Kết Nhanh</h3>
            <div className="space-y-2 text-gray-300">
              <a href="/products" className="block hover:text-blue-400 transition-colors">Tất cả sản phẩm</a>
              <a href="/book-appointment" className="block hover:text-blue-400 transition-colors">Đặt lịch hẹn</a>
              <a href="/profile" className="block hover:text-blue-400 transition-colors">Tài khoản</a>
              <a href="/cart" className="block hover:text-blue-400 transition-colors">Giỏ hàng</a>
              <a href="/profile" className="block hover:text-blue-400 transition-colors">Đơn hàng</a>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-4 text-blue-400 text-center">Vị Trí Cửa Hàng</h3>
          <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2725.2035773422367!2d105.07988733064332!3d10.021436995736334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0b39f99885969%3A0xa68d839bd50af765!2zMTQxIE5ndXnhu4VuIFR1w6JuLCBWxKluaCBUaGFuaCwgUuG6oWNoIEdpw6EsIEtpw6puIEdpYW5nLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1751105089424!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vị trí cửa hàng Áo Dài Cô Định"
            ></iframe>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Áo Dài Cô Định. All Rights Reserved.</p>
          <p className="mt-2 text-sm">
            Được phát triển với ❤️ cho cộng đồng yêu áo dài Việt Nam
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;