import { useEffect, useState } from "react";
import api from "../api/api";
import Message from "../components/Message";
import SkeletonLoader from "../components/SkeletonLoader";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = () => {
      setLoading(true);
      api
        .get("/orders/my")
        .then((res) => setOrders(res.data))
        .catch((err) =>
          setError(err.response?.data?.message || "Error loading orders")
        )
        .finally(() => setLoading(false));
    };
    // Check for refresh flag
    if (localStorage.getItem("orderHistoryNeedsRefresh") === "true") {
      fetchOrders();
      localStorage.removeItem("orderHistoryNeedsRefresh");
    } else {
      fetchOrders();
    }
  }, []);

  return (
    <div className="container mx-auto py-10 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-8 font-sans">Order History</h2>
      {loading ? (
        <SkeletonLoader type="list" count={4} />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : orders.length === 0 ? (
        <p className="text-gray-400">No orders found.</p>
      ) : (
        <ul className="space-y-4 animate-fadeIn">
          {orders.map((order) => (
            <li
              key={order._id}
              className="bg-white rounded-xl shadow-minimal p-6"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">
                  Order #{order._id.slice(-6)}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                Status:{" "}
                <span className="font-semibold text-primary">
                  {order.orderStatus}
                </span>
              </div>
              <div>
                Total:{" "}
                <span className="font-semibold">
                  ₹
                  {order.orderItems
                    .reduce((acc, i) => acc + i.price * i.qty, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                {order.orderItems.length} items
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistoryPage;
