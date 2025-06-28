import { useContext, useEffect, useState, useRef } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import SkeletonLoader from "../components/SkeletonLoader";

const WishlistPage = () => {
  const { wishlist, addToWishlist, removeFromWishlist, syncWishlist } =
    useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const firstLoad = useRef(true);

  useEffect(() => {
    setLoading(true);
    const validIds = wishlist.filter(
      (id) => typeof id === "string" && id.length === 24
    );
    if (validIds.length > 0) {
      api
        .get("/products", { params: { ids: validIds.join(",") } })
        .then((res) => {
          setProducts(res.data.products);
          const returnedIds = res.data.products.map((p) => p._id);
          // Only sync if the IDs are different and not on first render
          if (
            !firstLoad.current &&
            (returnedIds.length !== wishlist.length ||
              !returnedIds.every((id, i) => id === wishlist[i]))
          ) {
            syncWishlist(returnedIds);
          }
        })
        .catch(() => setProducts([]))
        .finally(() => {
          setLoading(false);
          firstLoad.current = false;
        });
    } else {
      setProducts([]);
      setLoading(false);
      if (!firstLoad.current && wishlist.length > 0) syncWishlist([]);
      firstLoad.current = false;
    }
  }, [wishlist, syncWishlist]);

  // Toggle wishlist handler
  const toggleWishlist = (product) => {
    if (wishlist.includes(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  return (
    <div className="container mx-auto py-10 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-8 font-sans">My Wishlist</h2>
      {loading ? (
        <SkeletonLoader type="card" count={4} />
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-minimal p-10 flex flex-col items-center">
          <span className="text-accent font-semibold mb-2">
            No products in wishlist.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fadeIn">
          {products.map((product) => (
            <div key={product._id} className="relative">
              <ProductCard
                product={product}
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                inWishlist={wishlist.includes(product._id)}
              />
              <button
                onClick={() => removeFromWishlist(product._id)}
                className="absolute top-2 right-2 bg-error text-white rounded-full p-2 shadow hover:bg-red-700 transition"
                aria-label="Remove from wishlist"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
