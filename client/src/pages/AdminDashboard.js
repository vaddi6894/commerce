import { useEffect, useState } from "react";
import api from "../api/api";
import Loader from "../components/Loader";
import Message from "../components/Message";
import SkeletonLoader from "../components/SkeletonLoader";

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({ orders: 0, users: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get("/orders"), api.get("/users")])
      .then(([ordersRes, usersRes]) => {
        const orders = ordersRes.data;
        const users = usersRes.data;
        const revenue = orders.reduce(
          (acc, o) =>
            acc + o.orderItems.reduce((a, i) => a + i.price * i.qty, 0),
          0
        );
        setMetrics({ orders: orders.length, users: users.length, revenue });
        setError("");
      })
      .catch(() => setError("Failed to load metrics"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 animate-fadeIn">
          <div className="bg-blue-100 p-6 rounded text-center">
            <div className="text-3xl font-bold">{metrics.orders}</div>
            <div className="text-gray-700">Orders</div>
          </div>
          <div className="bg-green-100 p-6 rounded text-center">
            <div className="text-3xl font-bold">{metrics.users}</div>
            <div className="text-gray-700">Users</div>
          </div>
          <div className="bg-yellow-100 p-6 rounded text-center">
            <div className="text-3xl font-bold">
              ₹{metrics.revenue.toFixed(2)}
            </div>
            <div className="text-gray-700">Revenue</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
