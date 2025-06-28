import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Message from "../components/Message";
import Review from "../components/Review";
import { AuthContext } from "../context/AuthContext";
import { ShoppingCartIcon, StarIcon } from "@heroicons/react/24/solid";
import { CartContext } from "../context/CartContext";
import { HeartIcon } from "@heroicons/react/24/outline";

const ProductPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [showStickyCart, setShowStickyCart] = useState(false);
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const imgRef = useRef();

  // Add a helper to check if the user has already reviewed
  const userReview =
    user &&
    reviews.find(
      (r) => r.user && (r.user._id === user._id || r.user === user._id)
    );

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Error loading product")
      );
    api
      .get(`/reviews/product/${id}`)
      .then((res) => setReviews(res.data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        setShowStickyCart(true);
      } else {
        setShowStickyCart(false);
      }
    };
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reviews", {
        productId: id,
        rating,
        comment,
      });
      setComment("");
      setRating(5);
      setReviewError("");
      setReviewSuccess("Review submitted successfully!");
      // Refresh reviews from backend
      api.get(`/reviews/product/${id}`).then((res) => setReviews(res.data));
      setTimeout(() => setReviewSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      if (
        (err.response?.data?.message || "")
          .toLowerCase()
          .includes("already reviewed")
      ) {
        setReviewError("");
      } else {
        setReviewError(
          err.response?.data?.message ||
            err.message ||
            "Error submitting review"
        );
      }
      setReviewSuccess("");
    }
  };

  // Helper for average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : product?.ratings?.toFixed(1) || "0.0";

  // Star widget for review input
  const StarInput = ({ value, onChange }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          onClick={() => onChange(n)}
          className={`focus:outline-none ${
            n <= value ? "text-yellow-400" : "text-gray-300"
          }`}
          aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
        >
          <StarIcon className="w-7 h-7 transition-transform hover:scale-110" />
        </button>
      ))}
    </div>
  );

  // Buy Now handler
  const handleBuyNow = () => {
    // Store quick checkout info in localStorage
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

  // Image zoom handlers
  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    imgRef.current.style.transformOrigin = `${x}% ${y}%`;
  };
  const handleMouseLeave = () => {
    if (imgRef.current) imgRef.current.style.transformOrigin = "center center";
  };

  // Fade-in on scroll (simple intersection observer)
  const useFadeIn = () => {
    const ref = useRef();
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const obs = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("animate-fadeInUp");
            obs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, []);
    return ref;
  };
  const infoFade = useFadeIn();
  const reviewFade = useFadeIn();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <Message type="error">{error}</Message>;
  }

  return (
    <div className="container mx-auto py-10 animate-fadeIn">
      {product && (
        <div className="bg-white rounded-xl shadow-minimal p-6 md:p-10 flex flex-col md:flex-row gap-10">
          {/* Left: Image with zoom and lightbox */}
          <div className="flex-1 flex flex-col items-center md:items-start justify-center">
            <div className="w-full flex justify-center mb-6 relative cursor-zoom-in group">
              <img
                ref={imgRef}
                src={product.image}
                alt={product.name}
                loading="lazy"
                className={`w-full max-w-xs md:max-w-md h-80 object-contain rounded-xl bg-gray-50 shadow-minimal transition-transform duration-300 group-hover:scale-110 ${
                  zoomed ? "scale-150 z-20" : ""
                }`}
                onMouseMove={(e) => {
                  setZoomed(true);
                  handleMouseMove(e);
                }}
                onMouseLeave={(e) => {
                  setZoomed(false);
                  handleMouseLeave(e);
                }}
                onClick={() => setLightboxOpen(true)}
                style={{ transition: "transform 0.3s, box-shadow 0.3s" }}
              />
              {/* Zoom hint */}
              <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                Zoom & Click
              </span>
            </div>
            {product.badge && (
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-accent text-white shadow mb-2 animate-fadeInUp">
                {product.badge}
              </span>
            )}
          </div>
          {/* Right: Info */}
          <div className="flex-1 flex flex-col gap-4" ref={infoFade}>
            <h2 className="text-2xl md:text-3xl font-bold font-sans mb-2">
              {product.name}
            </h2>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1">
                {[...Array(Math.round(averageRating))].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
                {[...Array(5 - Math.round(averageRating))].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-gray-200" />
                ))}
              </span>
              <span className="text-gray-600 text-sm font-semibold ml-2">
                {averageRating} / 5
              </span>
              <span className="text-gray-400 text-xs ml-2">
                ({reviews.length} reviews)
              </span>
            </div>
            <p className="text-gray-500 mb-2">{product.description}</p>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-2xl font-bold text-primary">
                ₹{product.price}
              </span>
              <span className="text-gray-400 text-sm">
                Stock: {product.stock}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-500 text-sm">
                Category: {product.category}
              </span>
            </div>
            <div className="flex gap-2 mt-4 w-full">
              <button
                aria-label="Add to cart"
                className="bg-primary text-white px-6 py-3 rounded-full font-semibold text-lg shadow hover:bg-accent transition active:scale-95 hover:scale-105 focus:scale-105 w-full md:w-max focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2"
                onClick={() => {
                  addToCart({
                    product: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                  });
                }}
              >
                <ShoppingCartIcon className="w-6 h-6" />
                Add to Cart
              </button>
              <button
                aria-label="Buy now"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold text-lg shadow transition active:scale-95 hover:scale-105 focus:scale-105 w-full md:w-max focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center gap-2"
                onClick={handleBuyNow}
              >
                <ShoppingCartIcon className="w-6 h-6" />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fadeIn">
          <div
            className="absolute inset-0"
            onClick={() => setLightboxOpen(false)}
          />
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-2xl border-4 border-white animate-fadeInUp"
            style={{ objectFit: "contain" }}
          />
          <button
            className="absolute top-6 right-6 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-lg transition"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      {/* Reviews */}
      <div className="mt-12 max-w-2xl mx-auto" ref={reviewFade}>
        <h3 className="text-xl font-semibold mb-4 font-sans">Reviews</h3>
        {reviews.length === 0 && (
          <p className="text-gray-400 mb-4">No reviews yet.</p>
        )}
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center gap-2 border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-1 md:mb-0">
                <span className="font-semibold text-primary">
                  {r.user?.name || "User"}
                </span>
                <span className="flex items-center gap-0.5 ml-2">
                  {[...Array(r.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                  {[...Array(5 - r.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-gray-200" />
                  ))}
                </span>
              </div>
              <div className="flex-1 text-gray-700">{r.comment}</div>
              <span className="text-xs text-gray-400 ml-auto md:ml-0">
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
        {/* Only show review form if user is logged in and hasn't reviewed */}
        {user && !userReview && (
          <form
            onSubmit={submitReview}
            className="mt-6 bg-gray-50 p-6 rounded-xl shadow-minimal flex flex-col gap-3"
          >
            <h4 className="font-semibold mb-2">Leave a Review</h4>
            {reviewSuccess && <Message type="success">{reviewSuccess}</Message>}
            <div className="flex flex-col sm:flex-row gap-3 items-center mb-2">
              <StarInput value={rating} onChange={setRating} />
              <textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary rounded-xl px-3 py-2 w-full font-sans transition resize-none min-h-[48px]"
                required
                maxLength={300}
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-dark transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary mt-2 sm:mt-0"
              >
                Submit
              </button>
            </div>
            {reviewError && <Message type="error">{reviewError}</Message>}
          </form>
        )}
      </div>
      {/* Sticky Add to Cart for mobile */}
      {showStickyCart && product && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg p-4 flex justify-center md:hidden animate-fadeIn">
          <button
            className="bg-primary text-white px-6 py-3 rounded-full font-semibold text-lg shadow hover:bg-primary-dark transition active:scale-95 w-full flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() =>
              addToCart({
                product: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
              })
            }
          >
            <ShoppingCartIcon className="w-6 h-6" /> Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
