import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto py-6 px-4 md:px-6 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} MyShop. All Rights Reserved.</p>
        <p className="text-sm">Xây dựng với React, NodeJS và Tailwind CSS.</p>
      </div>
    </footer>
  );
};
export default Footer;