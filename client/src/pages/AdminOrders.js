import { useEffect, useState } from "react";
import api from "../api/api";
import Loader from "../components/Loader";
import Message from "../components/Message";
import SkeletonLoader from "../components/SkeletonLoader";

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = () => {
    setLoading(true);
    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch {
      setError("Update failed");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      {loading ? (
        <SkeletonLoader type="table" rows={8} cols={5} />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : (
        <table className="w-full bg-white rounded shadow animate-fadeIn">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Order ID</th>
              <th className="p-2">User</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Total</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="p-2">{order._id.slice(-6)}</td>
                <td className="p-2">{order.user?.name || "User"}</td>
                <td className="p-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2">{order.orderStatus}</td>
                <td className="p-2">
                  ₹
                  {order.orderItems
                    .reduce((acc, i) => acc + i.price * i.qty, 0)
                    .toFixed(2)}
                </td>
                <td className="p-2">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
