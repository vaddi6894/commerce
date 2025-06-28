import { useEffect, useState } from "react";
import api from "../api/api";
import SkeletonLoader from "../components/SkeletonLoader";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/orders")
      .then((res) => setOrders(res.data))
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto py-10 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-8 font-sans">Orders</h2>
      {loading ? (
        <SkeletonLoader type="table" count={5} />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-minimal text-sm xs:text-base">
            <thead className="sticky top-0 bg-gray-50">
              <tr>
                <th className="px-2 xs:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-2 xs:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-2 xs:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-2 xs:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-2 xs:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 xs:px-6 py-4 whitespace-nowrap">
                    {order._id.slice(-6)}
                  </td>
                  <td className="px-2 xs:px-6 py-4 whitespace-nowrap">
                    {order.user?.name || "-"}
                  </td>
                  <td className="px-2 xs:px-6 py-4 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 xs:px-6 py-4 whitespace-nowrap">
                    ₹{order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-2 xs:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.orderStatus === "Delivered"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
