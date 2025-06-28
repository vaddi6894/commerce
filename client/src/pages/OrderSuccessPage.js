import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/api";
import SkeletonLoader from "../components/SkeletonLoader";

const OrderSuccessPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  // Helper to get orderId from query params
  const getOrderId = () => {
    const params = new URLSearchParams(location.search);
    return params.get("orderId");
  };

  useEffect(() => {
    const orderId = getOrderId();
    if (!orderId) {
      setError("No order ID found. Unable to fetch order details.");
      setLoading(false);
      return;
    }
    api
      .get(`/orders/${orderId}`)
      .then((res) => {
        setOrder(res.data);
        // Set flag for order history refresh
        localStorage.setItem("orderHistoryNeedsRefresh", "true");
      })
      .catch(() => setError("Order not found or not yet processed."))
      .finally(() => setLoading(false));
  }, [location.search]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center border border-orange-100 relative">
        {loading ? (
          <SkeletonLoader type="card" />
        ) : error ? (
          <div className="text-red-500 mb-4 text-lg font-semibold">{error}</div>
        ) : order ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4 shadow-lg animate-bounce">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-10 h-10 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-primary mb-2 tracking-tight">
              Thank you for your order!
            </h2>
            <p className="text-gray-600 mb-4 text-lg">
              Your payment was successful and your order has been placed.
              <br />
              <span className="font-bold text-xl text-green-600">
                Order #{order._id.slice(-6)}
              </span>
            </p>
            <div className="text-left my-6 bg-gray-50 rounded-xl p-5 shadow-inner">
              <div className="mb-3">
                <span className="font-semibold text-gray-700">
                  Shipping Address:
                </span>
                <br />
                <span className="text-gray-500">
                  {order.shippingAddress.name && (
                    <>{order.shippingAddress.name}, </>
                  )}
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </span>
              </div>
              <div className="mb-3">
                <span className="font-semibold text-gray-700">Items:</span>
                <ul className="ml-4 list-disc text-gray-600">
                  {order.orderItems.map((item) => (
                    <li key={item.product} className="mb-1">
                      <span className="font-medium">{item.name}</span> x{" "}
                      {item.qty}{" "}
                      <span className="text-gray-400">
                        – ₹{item.price} each
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-3">
                <span className="font-semibold text-gray-700">Total:</span>{" "}
                <span className="text-primary font-bold">
                  ₹
                  {order.orderItems
                    .reduce((acc, i) => acc + i.price * i.qty, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="mb-1">
                <span className="font-semibold text-gray-700">Status:</span>{" "}
                <span className="text-blue-600 font-semibold">
                  {order.orderStatus}
                </span>
              </div>
            </div>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-orange-400 to-primary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform mt-4 text-lg"
            >
              Continue Shopping
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default OrderSuccessPage;
