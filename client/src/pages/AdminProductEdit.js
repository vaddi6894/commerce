import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import SkeletonLoader from "../components/SkeletonLoader";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get(`/admin/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    api
      .put(`/admin/products/${id}`, product)
      .then(() => navigate("/admin/products"))
      .catch(() => setError("Failed to save product"))
      .finally(() => setSaving(false));
  };

  if (loading) return <SkeletonLoader type="card" />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-10 animate-fadeIn">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-minimal p-8">
        <h2 className="text-2xl font-bold mb-6 font-sans">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-500 mb-1">Name</label>
            <input
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-sans"
            />
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Price</label>
            <input
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-sans"
            />
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Stock</label>
            <input
              name="countInStock"
              type="number"
              value={product.countInStock}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-sans"
            />
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-sans"
              rows={4}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white rounded-full px-6 py-2 font-semibold shadow-minimal hover:scale-105 transition-transform disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProductEdit;
