// Component Context để quản lý giỏ hàng
// Cơ chế quản lý trạng thái giỏ hàng (cart state) toàn cục
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Khởi tạo state từ localStorage nếu có, hoặc mảng rỗng
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return [];
    }
  });

  // Trạng thái thông báo
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
  });

  // Giới hạn
  const MAX_QUANTITY_PER_ITEM = 10; // Số lượng tối đa cho mỗi sản phẩm
  const MAX_TOTAL_QUANTITY = 50; // Tổng số lượng đơn vị trong giỏ hàng
  const MAX_UNIQUE_ITEMS = 10; // Số loại sản phẩm khác nhau (theo ID)

  // Đồng bộ cartItems với localStorage mỗi khi cartItems thay đổi
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Tính tổng số lượng đơn vị hiện tại
      const currentTotalQuantity = prevItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      // Đếm số loại sản phẩm (theo ID)
      const uniqueItemCount = prevItems.length;

      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Kiểm tra giới hạn số lượng cho mỗi sản phẩm
        if (existingItem.quantity >= MAX_QUANTITY_PER_ITEM) {
          setNotification({
            open: true,
            message: `Cannot add more than ${MAX_QUANTITY_PER_ITEM} units of ${product.name} to the cart.`,
            severity: 'error',
          });
          return prevItems;
        }
        // Kiểm tra tổng số lượng đơn vị
        if (currentTotalQuantity >= MAX_TOTAL_QUANTITY) {
          setNotification({
            open: true,
            message: `Cannot add more items. Total quantity limit is ${MAX_TOTAL_QUANTITY} units.`,
            severity: 'error',
          });
          return prevItems;
        }
        // Cập nhật số lượng sản phẩm hiện có
        setNotification({
          open: true,
          message: `${product.name} has been added to the cart.`,
          severity: 'success',
        });
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Kiểm tra giới hạn số loại sản phẩm
        if (uniqueItemCount >= MAX_UNIQUE_ITEMS) {
          setNotification({
            open: true,
            message: `Cannot add more than ${MAX_UNIQUE_ITEMS} different products to the cart.`,
            severity: 'error',
          });
          return prevItems;
        }
        // Kiểm tra tổng số lượng đơn vị
        if (currentTotalQuantity >= MAX_TOTAL_QUANTITY) {
          setNotification({
            open: true,
            message: `Cannot add more items. Total quantity limit is ${MAX_TOTAL_QUANTITY} units.`,
            severity: 'error',
          });
          return prevItems;
        }
        // Thêm sản phẩm mới
        setNotification({
          open: true,
          message: `${product.name} has been added to the cart.`,
          severity: 'success',
        });
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Hàm cập nhật số lượng sản phẩm
  const updateQuantity = (id, quantity) => {
    setCartItems((prevItems) => {
      const newQuantity = Math.max(1, quantity);
      const currentTotalQuantity = prevItems.reduce(
        (total, item) => total + (item.id === id ? 0 : item.quantity),
        0
      );

      // Kiểm tra giới hạn số lượng cho mỗi sản phẩm
      if (newQuantity > MAX_QUANTITY_PER_ITEM) {
        setNotification({
          open: true,
          message: `Cannot set more than ${MAX_QUANTITY_PER_ITEM} units for this item.`,
          severity: 'error',
        });
        return prevItems;
      }
      // Kiểm tra tổng số lượng đơn vị
      if (currentTotalQuantity + newQuantity > MAX_TOTAL_QUANTITY) {
        setNotification({
          open: true,
          message: `Cannot set quantity. Total quantity limit is ${MAX_TOTAL_QUANTITY} units.`,
          severity: 'error',
        });
        return prevItems;
      }
      return prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  // Hàm xóa toàn bộ giỏ hàng (dùng khi đăng xuất nếu cần)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  // Hàm đóng thông báo
  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        notification,
        closeNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);