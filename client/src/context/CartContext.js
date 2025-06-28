import { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.product === item.product);
      if (exists) {
        return prev.map((i) =>
          i.product === item.product ? { ...i, qty: Number(i.qty) + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.product !== productId));
  };

  const updateQty = (productId, qty) => {
    setCart((prev) =>
      prev.map((i) => (i.product === productId ? { ...i, qty } : i))
    );
  };

  const clearCart = () => setCart([]);

  const checkout = async (shippingAddress) => {
    // Map 'zip' to 'postalCode' and ensure 'name' is included
    const { zip, name, ...rest } = shippingAddress;
    const shippingAddressForOrder = { ...rest, postalCode: zip, name };
    const orderItems = cart.map(({ product, qty, price, name, image }) => ({
      product,
      qty,
      price,
      name,
      image,
    }));
    const { data } = await api.post("/orders", {
      orderItems,
      shippingAddress: shippingAddressForOrder,
    });
    clearCart();
    return data;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
