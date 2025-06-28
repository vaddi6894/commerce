import { useEffect, useState, useMemo, useContext } from "react";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import Message from "../components/Message";
import SkeletonLoader from "../components/SkeletonLoader";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: { keyword, category, page } })
      .then((res) => {
        setProducts(res.data.products);
        setCount(res.data.count);
        setError("");
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Error loading products")
      )
      .finally(() => setLoading(false));
  }, [keyword, category, page]);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [products]);

  // Toggle wishlist handler
  const toggleWishlist = (product) => {
    if (wishlist.includes(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  // Buy Now handler
  const handleBuyNow = (product) => {
    localStorage.setItem(
      "quickCheckout",
      JSON.stringify({
        product: {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1,
        },
      })
    );
    navigate("/checkout?quick=1");
  };

  return (
    <div className="container mx-auto py-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary rounded-full px-4 py-2 w-full md:w-1/2 bg-gray-50 font-sans transition"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary rounded-full px-4 py-2 w-full md:w-1/4 bg-gray-50 font-sans transition"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <SkeletonLoader type="card" count={8} />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fadeIn">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              inWishlist={wishlist.includes(product._id)}
              onBuyNow={handleBuyNow}
            />
          ))}
        </div>
      )}
      <div
        className="flex justify-center mt-10 gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {Array.from({ length: Math.ceil(count / 10) }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-1 rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-minimal whitespace-nowrap select-none ${
              page === i + 1
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-500 hover:bg-primary/80 hover:text-white"
            }`}
            tabIndex={0}
            aria-label={`Go to page ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
