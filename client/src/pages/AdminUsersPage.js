import { useEffect, useState } from "react";
import api from "../api/api";
import SkeletonLoader from "../components/SkeletonLoader";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto py-10 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-8 font-sans">Users</h2>
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
                  Name
                </th>
                <th className="px-2 xs:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-2 xs:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 xs:px-6 py-4 whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="px-2 xs:px-6 py-4 whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="px-2 xs:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isAdmin
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
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

export default AdminUsersPage;
