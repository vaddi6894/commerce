import { useContext, useState, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import {
  TrashIcon,
  ShoppingCartIcon,
  ArrowRightIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const FREE_SHIPPING_THRESHOLD = 2000;

const CartPage = () => {
  const { cart, updateQty, removeFromCart, clearCart } =
    useContext(CartContext);
  const navigate = useNavigate();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [removing, setRemoving] = useState({});
  const [saving, setSaving] = useState({});
  const [animQty, setAnimQty] = useState({});
  const promoInput = useRef();

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = promoApplied ? Math.round(total * 0.1) : 0;
  const finalTotal = total - discount;
  const freeShippingProgress = Math.min(
    (finalTotal / FREE_SHIPPING_THRESHOLD) * 100,
    100
  );

  // Animate quantity change
  const handleQtyChange = (productId, newQty) => {
    setAnimQty((a) => ({ ...a, [productId]: true }));
    setTimeout(() => setAnimQty((a) => ({ ...a, [productId]: false })), 300);
    updateQty(productId, newQty);
  };

  // Animate remove
  const handleRemove = (productId) => {
    setRemoving((r) => ({ ...r, [productId]: true }));
    setTimeout(() => {
      removeFromCart(productId);
      setRemoving((r) => ({ ...r, [productId]: false }));
    }, 350);
  };

  // Animate save for later
  const handleSave = (productId) => {
    setSaving((s) => ({ ...s, [productId]: true }));
    setTimeout(() => {
      removeFromCart(productId);
      setSaving((s) => ({ ...s, [productId]: false }));
      // Here you would add to wishlist or a "saved" list
    }, 350);
  };

  // Promo code logic (simple demo)
  const handlePromo = (e) => {
    e.preventDefault();
    setPromoError("");
    if (promo.trim().toLowerCase() === "shoppie10") {
      setPromoApplied(true);
    } else {
      setPromoError("Invalid code");
      setPromoApplied(false);
    }
  };

  return (
    <div className="container mx-auto py-10 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl p-6 flex flex-col items-center w-full max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 font-sans">Your Cart</h2>
        {/* Free shipping progress bar */}
        <div className="w-full mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Free shipping at ₹{FREE_SHIPPING_THRESHOLD}</span>
            <span>
              {finalTotal < FREE_SHIPPING_THRESHOLD
                ? `₹${FREE_SHIPPING_THRESHOLD - finalTotal} left`
                : "You get free shipping!"}
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                finalTotal < FREE_SHIPPING_THRESHOLD
                  ? "bg-primary"
                  : "bg-green-500"
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>
        {/* Cart items */}
        <div className="w-full flex flex-col gap-4">
          {cart.length === 0 && (
            <div className="text-gray-400 text-center py-10">
              Your cart is empty.
            </div>
          )}
          {cart.map((item) => (
            <div
              key={item.product}
              className={`flex items-center gap-4 bg-gray-50 rounded-xl p-4 shadow transition-all duration-300 relative ${
                removing[item.product]
                  ? "opacity-0 scale-95 pointer-events-none"
                  : "opacity-100 scale-100"
              } ${saving[item.product] ? "opacity-50" : ""}`}
            >
              <img
                src={item.image}
                alt={item.name}
                className={`w-16 h-16 object-cover rounded-xl transition-transform duration-300 ${
                  animQty[item.product] ? "scale-110" : ""
                }`}
                loading="lazy"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{item.name}</div>
                <div className="text-gray-400 text-sm">
                  ₹{item.price.toFixed(2)}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  aria-label="Decrease quantity"
                  className="bg-gray-200 hover:bg-primary hover:text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg transition active:scale-90"
                  onClick={() =>
                    handleQtyChange(item.product, Math.max(1, item.qty - 1))
                  }
                >
                  -
                </button>
                <span
                  className={`w-8 text-center font-semibold text-lg transition-all duration-300 ${
                    animQty[item.product] ? "text-primary scale-110" : ""
                  }`}
                >
                  {item.qty}
                </span>
                <button
                  aria-label="Increase quantity"
                  className="bg-gray-200 hover:bg-primary hover:text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg transition active:scale-90"
                  onClick={() => handleQtyChange(item.product, item.qty + 1)}
                >
                  +
                </button>
              </div>
              <button
                aria-label="Save for later"
                className="text-accent hover:bg-accent hover:text-white rounded-full p-2 transition flex items-center focus:outline-none focus:ring-2 focus:ring-accent"
                onClick={() => handleSave(item.product)}
              >
                <HeartIcon className="w-5 h-5" />
              </button>
              <button
                aria-label="Remove from cart"
                className="text-red-600 hover:text-white hover:bg-error rounded-full p-2 transition flex items-center focus:outline-none focus:ring-2 focus:ring-error"
                onClick={() => handleRemove(item.product)}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        {/* Promo code */}
        <form
          onSubmit={handlePromo}
          className="flex gap-2 mt-6 w-full max-w-sm mx-auto animate-fadeInUp"
        >
          <input
            ref={promoInput}
            type="text"
            placeholder="Promo code"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            className={`border border-gray-200 rounded-full px-4 py-2 w-full font-sans transition focus:outline-none focus:ring-2 focus:ring-primary ${
              promoApplied
                ? "border-green-400 bg-green-50"
                : promoError
                ? "border-red-400 bg-red-50"
                : ""
            }`}
            disabled={promoApplied}
          />
          <button
            type="submit"
            className={`bg-primary text-white rounded-full px-6 py-2 font-semibold shadow-minimal hover:scale-105 transition-transform disabled:opacity-60 ${
              promoApplied ? "bg-green-500" : ""
            }`}
            disabled={promoApplied}
          >
            {promoApplied ? "Applied" : "Apply"}
          </button>
        </form>
        {promoError && (
          <div className="text-red-500 mt-1 animate-fadeInUp">{promoError}</div>
        )}
        {promoApplied && (
          <div className="text-green-600 mt-1 animate-fadeInUp">
            10% discount applied!
          </div>
        )}
        {/* Cart totals */}
        <div className="w-full flex flex-col items-end mt-6 gap-1 animate-fadeInUp">
          <div className="text-gray-500">Subtotal: ₹{total.toFixed(2)}</div>
          {discount > 0 && (
            <div className="text-green-600">
              Discount: -₹{discount.toFixed(2)}
            </div>
          )}
          <div className="text-xl font-bold text-primary">
            Total: ₹{finalTotal.toFixed(2)}
          </div>
        </div>
        {/* Actions */}
        <div className="w-full flex flex-col md:flex-row gap-4 mt-8 animate-fadeInUp">
          <Link
            to="/products"
            className="w-full md:w-auto bg-gray-100 hover:bg-primary hover:text-white rounded-full px-6 py-2 font-semibold text-center transition active:scale-95"
          >
            Continue Shopping
          </Link>
          <button
            aria-label="Checkout"
            className="w-full md:w-auto bg-primary text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-accent transition active:scale-95 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => navigate("/pre-checkout")}
            disabled={cart.length === 0}
          >
            <ShoppingCartIcon className="w-6 h-6" />
            Checkout
          </button>
          <button
            aria-label="Clear cart"
            className="w-full md:w-auto bg-red-100 hover:bg-red-500 hover:text-white text-red-600 px-6 py-2 rounded-full font-semibold transition active:scale-95"
            onClick={clearCart}
            disabled={cart.length === 0}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
