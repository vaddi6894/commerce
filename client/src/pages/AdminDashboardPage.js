import { useEffect, useState } from "react";
import api from "../api/api";
import SkeletonLoader from "../components/SkeletonLoader";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => setError("Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto py-10 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-8 font-sans">Admin Dashboard</h2>
      {loading ? (
        <SkeletonLoader type="grid" count={4} />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-minimal p-6 flex flex-col items-center">
            <span className="text-gray-400 text-xs mb-2">Users</span>
            <span className="text-2xl font-bold">{stats.users}</span>
          </div>
          <div className="bg-white rounded-xl shadow-minimal p-6 flex flex-col items-center">
            <span className="text-gray-400 text-xs mb-2">Products</span>
            <span className="text-2xl font-bold">{stats.products}</span>
          </div>
          <div className="bg-white rounded-xl shadow-minimal p-6 flex flex-col items-center">
            <span className="text-gray-400 text-xs mb-2">Orders</span>
            <span className="text-2xl font-bold">{stats.orders}</span>
          </div>
          <div className="bg-white rounded-xl shadow-minimal p-6 flex flex-col items-center">
            <span className="text-gray-400 text-xs mb-2">Revenue</span>
            <span className="text-2xl font-bold">
              ₹{stats.revenue.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
