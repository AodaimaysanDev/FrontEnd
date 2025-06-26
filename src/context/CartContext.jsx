import React, { createContext, useState, useContext } from 'react';

// 1. Tạo Context
const CartContext = createContext();

// 2. Tạo Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Hàm thêm sản phẩm vào giỏ
  const addToCart = (productToAdd) => {
    setCartItems(prevItems => {
      // Kiểm tra xem sản phẩm đã có trong giỏ chưa
      const existingItem = prevItems.find(item => item._id === productToAdd._id);

      if (existingItem) {
        // Nếu đã có, chỉ tăng số lượng
        return prevItems.map(item =>
          item._id === productToAdd._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Nếu chưa có, thêm sản phẩm mới vào giỏ với số lượng là 1
        return [...prevItems, { ...productToAdd, quantity: 1 }];
      }
    });
    alert(`${productToAdd.name} đã được thêm vào giỏ hàng!`);
  };
  
  // Hàm xóa sản phẩm khỏi giỏ
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };
  
  // Hàm cập nhật số lượng
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Giá trị sẽ được cung cấp cho các component con
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// 3. Tạo custom hook để sử dụng Context dễ dàng hơn
export const useCart = () => {
  return useContext(CartContext);
};