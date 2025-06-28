import { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";
import api from "../api/api";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const FREE_SHIPPING_THRESHOLD = 2000;

const CheckoutPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    zip: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const stripe = useStripe();
  const elements = useElements();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [guest, setGuest] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: Shipping, 3: Payment, 4: Review
  const [showShipping, setShowShipping] = useState(false);
  const [cardValid, setCardValid] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("");

  // Quick checkout logic
  const isQuick = new URLSearchParams(location.search).get("quick") === "1";
  const [quickProduct, setQuickProduct] = useState(null);
  useEffect(() => {
    if (isQuick) {
      const quick = localStorage.getItem("quickCheckout");
      if (quick) {
        try {
          const parsed = JSON.parse(quick);
          setQuickProduct(parsed.product);
        } catch {}
      }
    }
  }, [isQuick]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const total =
    isQuick && quickProduct
      ? quickProduct.price
      : cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = promoApplied ? Math.round(total * 0.1) : 0;
  const finalTotal = total - discount;
  const freeShippingProgress = Math.min(
    (finalTotal / FREE_SHIPPING_THRESHOLD) * 100,
    100
  );

  // Promo code logic (simple demo)
  const handlePromo = (e) => {
    e.preventDefault();
    setPromoError("");
    if (promo.trim().toLowerCase() === "swift10") {
      setPromoApplied(true);
    } else {
      setPromoError("Invalid code");
      setPromoApplied(false);
    }
  };

  // Card validation
  const handleCardChange = (e) => {
    setCardValid(e.complete);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    setLoading(true);
    setError("");
    try {
      if (!stripe || !elements) {
        setError("Stripe is not loaded");
        setLoading(false);
        setShowLoader(false);
        return;
      }
      // Prepare order and payment data
      let validCart = [];
      if (isQuick && quickProduct) {
        validCart = [{ ...quickProduct, qty: 1 }];
      } else {
        validCart = cart
          .filter((item) => item && item.product)
          .map((item) => ({ ...item, qty: Number(item.qty) || 1 }))
          .filter((item) => item.qty >= 1);
      }
      const amount = validCart.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );

      if (amount <= 0) {
        setError("Your cart is empty or the total is zero.");
        setLoading(false);
        setShowLoader(false);
        return;
      }

      // 1. Create Payment Intent
      const { data } = await api.post("/payments/create-intent", {
        amount,
        shippingAddress: {
          name: form.name,
          address: form.address,
          city: form.city,
          country: form.country,
          postalCode: form.zip,
        },
      });
      // 2. Confirm Card Payment
      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: form.name,
            email: user?.email,
          },
        },
      });
      if (paymentResult.error) {
        setError(paymentResult.error.message || "Payment failed");
        setLoading(false);
        setShowLoader(false);
        return;
      }
      if (paymentResult.paymentIntent.status === "succeeded") {
        // 3. Create Order in backend
        const orderItems = validCart.map(
          ({ product, qty, price, name, image }) => ({
            product: product._id || product,
            qty,
            price,
            name,
            image,
          })
        );
        const orderRes = await api.post("/orders", {
          orderItems,
          shippingAddress: {
            name: form.name,
            address: form.address,
            city: form.city,
            country: form.country,
            postalCode: form.zip,
          },
          paymentInfo: {
            stripePaymentIntentId: paymentResult.paymentIntent.id,
          },
        });
        if (isQuick) {
          localStorage.removeItem("quickCheckout");
        } else {
          clearCart();
        }
        navigate(`/order-success?orderId=${orderRes.data._id}`);
        setShowLoader(false);
      } else {
        setError("Payment was not successful");
        setShowLoader(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Checkout failed");
      setShowLoader(false);
    } finally {
      setLoading(false);
    }
  };

  // Animate section fade/slide-in
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
  const shippingFade = useFadeIn();
  const paymentFade = useFadeIn();
  const reviewFade = useFadeIn();

  // Helper to check if all address fields are filled
  const isAddressFilled =
    form.name && form.address && form.city && form.country && form.zip;

  // Automatically update step based on progress
  useEffect(() => {
    if (!isAddressFilled) {
      setStep(1);
    } else if (isAddressFilled && !shippingMethod) {
      setStep(2);
    } else if (isAddressFilled && shippingMethod && !cardValid) {
      setStep(3);
    } else if (isAddressFilled && shippingMethod && cardValid) {
      setStep(4);
    }
  }, [isAddressFilled, shippingMethod, cardValid]);

  if (isQuick && !quickProduct) {
    return (
      <div className="container mx-auto py-10 text-gray-400">
        No product selected for quick checkout.
      </div>
    );
  }

  if (!isQuick && (!cart || cart.length === 0)) {
    return (
      <div className="container mx-auto py-10 text-gray-400">
        Your cart is empty.
      </div>
    );
  }

  // Product summary for quick checkout
  const quickSummary = quickProduct && (
    <div className="mb-6 bg-gray-50 rounded-xl p-4 flex items-center gap-4 shadow-inner">
      <img
        src={quickProduct.image}
        alt={quickProduct.name}
        className="w-20 h-20 object-contain rounded-xl bg-white border"
      />
      <div>
        <div className="font-bold text-lg">{quickProduct.name}</div>
        <div className="text-primary font-bold text-xl">
          ₹{quickProduct.price}
        </div>
        <div className="text-gray-500 text-sm">Qty: 1</div>
      </div>
    </div>
  );

  // Progress indicator
  const steps = [
    { label: "Contact & Shipping" },
    { label: "Shipping Method" },
    { label: "Payment" },
    { label: "Review" },
  ];

  return (
    <div className="container mx-auto py-10 animate-fadeIn">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-2xl p-4 xs:p-8">
        {/* Progress indicator */}
        <div className="flex justify-between items-center mb-8 animate-fadeInUp">
          {steps.map((s, i) => (
            <div key={s.label} className="flex-1 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${
                  step === i + 1 ? "bg-primary scale-110" : "bg-gray-300"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-xs mt-1 ${
                  step === i + 1
                    ? "text-primary font-semibold"
                    : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
        {error && (
          <div className="text-red-500 mb-4 animate-fadeInUp">{error}</div>
        )}
        {isQuick && quickSummary}
        {/* Contact & Shipping Info */}
        <section ref={infoFade} className="mb-8 animate-fadeInUp">
          <h3 className="text-lg font-bold mb-2">Contact & Shipping Info</h3>
          <form className="space-y-4 xs:space-y-6">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-200 px-4 py-2 focus:outline-none focus:border-primary transition-all duration-200"
              placeholder="Full Name"
              required
              autoComplete="name"
            />
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-200 px-4 py-2 focus:outline-none focus:border-primary transition-all duration-200"
              placeholder="Address"
              required
              autoComplete="street-address"
            />
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-200 px-4 py-2 focus:outline-none focus:border-primary transition-all duration-200"
              placeholder="City"
              required
              autoComplete="address-level2"
            />
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-200 px-4 py-2 focus:outline-none focus:border-primary transition-all duration-200"
              required
              autoComplete="country"
            >
              <option value="">Select Country</option>
              <option value="IN">India</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
            </select>
            <input
              name="zip"
              value={form.zip}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-200 px-4 py-2 focus:outline-none focus:border-primary transition-all duration-200"
              placeholder="ZIP"
              required
              autoComplete="postal-code"
            />
          </form>
        </section>
        {/* Shipping Method (fade in after address fields filled) */}
        {isAddressFilled && (
          <section ref={shippingFade} className="mb-8 animate-fadeInUp">
            <h3 className="text-lg font-bold mb-2">Shipping Method</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="shipping"
                  value="standard"
                  checked={shippingMethod === "standard"}
                  onChange={() => setShippingMethod("standard")}
                  className="accent-primary"
                />
                <span>Standard (3-5 days) — Free</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="shipping"
                  value="express"
                  checked={shippingMethod === "express"}
                  onChange={() => setShippingMethod("express")}
                  className="accent-primary"
                />
                <span>Express (1-2 days) — ₹199</span>
              </label>
            </div>
          </section>
        )}
        {/* Payment Section */}
        {isAddressFilled && shippingMethod && (
          <section ref={paymentFade} className="mb-8 animate-fadeInUp">
            <h3 className="text-lg font-bold mb-2">Payment</h3>
            <div className="border-b-2 border-gray-200 px-4 py-2 bg-white flex items-center focus-within:border-primary transition-all duration-200">
              <CardElement
                options={{ hidePostalCode: true }}
                onChange={handleCardChange}
                className="flex-1"
              />
              {cardValid && (
                <span className="ml-2 text-green-500 animate-fadeInUp">✔️</span>
              )}
            </div>
          </section>
        )}
        {/* Review Section */}
        {isAddressFilled && shippingMethod && (
          <section ref={reviewFade} className="mb-8 animate-fadeInUp">
            <h3 className="text-lg font-bold mb-2">Review & Place Order</h3>
            {isQuick && quickSummary}
            {/* Free shipping progress bar */}
            <div className="w-full mb-4 animate-fadeInUp">
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
            {/* Discount preview */}
            {discount > 0 && (
              <div className="text-green-600 mb-2 animate-fadeInUp">
                10% discount applied!
              </div>
            )}
            {/* Promo code */}
            <form
              onSubmit={handlePromo}
              className="flex gap-2 mt-2 w-full max-w-sm mx-auto animate-fadeInUp"
            >
              <input
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
              <div className="text-red-500 mt-1 animate-fadeInUp">
                {promoError}
              </div>
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
            {/* Loader/progress bar on CTA */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !stripe || !elements || !cardValid}
              className="bg-primary text-white rounded-full px-6 py-2 font-semibold shadow-minimal hover:scale-105 hover:bg-orange-500 active:scale-95 transition-transform duration-200 disabled:opacity-60 w-full text-lg flex items-center justify-center gap-2 mt-4"
            >
              {showLoader ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{" "}
                  Processing...
                </span>
              ) : (
                "Pay & Place Order"
              )}
            </button>
            {error && (
              <div className="text-red-500 mt-2 animate-fadeInUp">{error}</div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
