import { createContext, useState, useEffect } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist((prev) => (prev.includes(product) ? prev : [...prev, product]));
  };

  const removeFromWishlist = (product) => {
    setWishlist((prev) => prev.filter((p) => p !== product));
  };

  // Sync wishlist with valid product IDs
  const syncWishlist = (validIds) => {
    setWishlist((prev) => prev.filter((id) => validIds.includes(id)));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, syncWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
