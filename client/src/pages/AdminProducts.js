import { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import Loader from "../components/Loader";
import Message from "../components/Message";
import SkeletonLoader from "../components/SkeletonLoader";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selected, setSelected] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [editing, setEditing] = useState({});
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const csvRef = useRef();

  const fetchProducts = () => {
    setLoading(true);
    api
      .get("/products?limit=200")
      .then((res) => setProducts(res.data.products))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesName = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory
        ? p.category === filterCategory
        : true;
      // Stock status filter
      let matchesStock = true;
      if (stockStatus === "in") matchesStock = p.stock > 5;
      else if (stockStatus === "low")
        matchesStock = p.stock > 0 && p.stock <= 5;
      else if (stockStatus === "out") matchesStock = p.stock === 0;
      // Price range filter
      let matchesMin = minPrice === "" || p.price >= Number(minPrice);
      let matchesMax = maxPrice === "" || p.price <= Number(maxPrice);
      return (
        matchesName &&
        matchesCategory &&
        matchesStock &&
        matchesMin &&
        matchesMax
      );
    });
  }, [products, search, filterCategory, stockStatus, minPrice, maxPrice]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    arr.sort((a, b) => {
      let v1 = a[sortBy],
        v2 = b[sortBy];
      if (sortBy === "name" || sortBy === "category") {
        v1 = v1?.toLowerCase() || "";
        v2 = v2?.toLowerCase() || "";
      }
      if (v1 < v2) return sortDir === "asc" ? -1 : 1;
      if (v1 > v2) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filteredProducts, sortBy, sortDir]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / pageSize);
  const pagedProducts = sortedProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Bulk select
  const toggleSelect = (id) => {
    setSelected((sel) =>
      sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]
    );
  };
  const selectAll = () => {
    setSelected(pagedProducts.map((p) => p._id));
  };
  const deselectAll = () => setSelected([]);

  // Bulk delete
  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selected.length} products?`)) return;
    for (const id of selected) {
      await api.delete(`/products/${id}`);
    }
    setSelected([]);
    fetchProducts();
  };

  // Export CSV
  const handleExport = () => {
    const rows = [
      ["Name", "Price", "Stock", "Category"],
      ...sortedProducts.map((p) => [p.name, p.price, p.stock, p.category]),
    ];
    const csv = rows
      .map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    csvRef.current.href = url;
    csvRef.current.download = `products_export.csv`;
    csvRef.current.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Inline editing
  const startEdit = (id, price, stock) =>
    setEditing({ [id]: { price, stock } });
  const cancelEdit = () => setEditing({});
  const saveEdit = async (id) => {
    const { price, stock } = editing[id];
    await api.put(`/products/${id}`, { price, stock });
    setEditing({});
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch {
      setError("Delete failed");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchProducts}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow-sm transition"
          >
            Refresh
          </button>
          <button
            onClick={() => navigate("/admin/products/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm transition"
          >
            Add Product
          </button>
        </div>
      </div>
      {/* Bulk actions and export */}
      <div className="flex flex-wrap gap-2 mb-2 items-center">
        <button
          onClick={selectAll}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs"
        >
          Select All
        </button>
        <button
          onClick={deselectAll}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs"
        >
          Deselect
        </button>
        <button
          onClick={handleBulkDelete}
          disabled={selected.length === 0}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs disabled:opacity-50"
        >
          Delete Selected
        </button>
        <button
          onClick={handleExport}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs"
        >
          Export CSV
        </button>
        <a ref={csvRef} style={{ display: "none" }}>
          Export
        </a>
      </div>
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary rounded-full px-4 py-2 w-full md:w-1/4 bg-gray-50 font-sans transition"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary rounded-full px-4 py-2 w-full md:w-1/6 bg-gray-50 font-sans transition"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={stockStatus}
          onChange={(e) => setStockStatus(e.target.value)}
          className="border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary rounded-full px-4 py-2 w-full md:w-1/6 bg-gray-50 font-sans transition"
        >
          <option value="">All Stock</option>
          <option value="in">In Stock (&gt;5)</option>
          <option value="low">Low Stock (1-5)</option>
          <option value="out">Out of Stock</option>
        </select>
        <input
          type="number"
          min="0"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary rounded-full px-4 py-2 w-full md:w-1/12 bg-gray-50 font-sans transition"
        />
        <input
          type="number"
          min="0"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary rounded-full px-4 py-2 w-full md:w-1/12 bg-gray-50 font-sans transition"
        />
      </div>
      {loading ? (
        <SkeletonLoader type="table" rows={8} cols={5} />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow animate-fadeIn">
          <table className="w-full min-w-[600px] bg-white rounded-xl">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selected.length === pagedProducts.length &&
                      pagedProducts.length > 0
                    }
                    onChange={(e) =>
                      e.target.checked ? selectAll() : deselectAll()
                    }
                  />
                </th>
                {["name", "price", "stock", "category"].map((col) => (
                  <th
                    key={col}
                    className="p-3 text-left cursor-pointer select-none"
                    onClick={() => {
                      if (sortBy === col)
                        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                      else {
                        setSortBy(col);
                        setSortDir("asc");
                      }
                    }}
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                    {sortBy === col && (sortDir === "asc" ? " ▲" : " ▼")}
                  </th>
                ))}
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(product._id)}
                      onChange={() => toggleSelect(product._id)}
                    />
                  </td>
                  <td className="p-3 font-semibold text-gray-900">
                    {product.name}
                  </td>
                  <td className="p-3 text-primary font-bold">
                    {editing[product._id] ? (
                      <input
                        type="number"
                        value={editing[product._id].price}
                        min="0"
                        step="0.01"
                        onChange={(e) =>
                          setEditing((ed) => ({
                            ...ed,
                            [product._id]: {
                              ...ed[product._id],
                              price: e.target.value,
                            },
                          }))
                        }
                        className="border rounded px-2 py-1 w-20"
                      />
                    ) : (
                      <>₹{product.price}</>
                    )}
                  </td>
                  <td className="p-3">
                    {editing[product._id] ? (
                      <input
                        type="number"
                        value={editing[product._id].stock}
                        min="0"
                        step="1"
                        onChange={(e) =>
                          setEditing((ed) => ({
                            ...ed,
                            [product._id]: {
                              ...ed[product._id],
                              stock: e.target.value,
                            },
                          }))
                        }
                        className="border rounded px-2 py-1 w-16"
                      />
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full font-semibold text-xs shadow-sm ${
                          product.stock === 0
                            ? "bg-red-100 text-red-600"
                            : product.stock <= 5
                            ? "bg-orange-100 text-orange-600"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.stock}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-gray-700">{product.category}</td>
                  <td className="p-3 flex gap-2">
                    {editing[product._id] ? (
                      <>
                        <button
                          onClick={() => saveEdit(product._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            navigate(`/admin/products/${product._id}`)
                          }
                          className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-white font-semibold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold transition"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() =>
                            startEdit(product._id, product.price, product.stock)
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Inline Edit
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-1 rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-minimal whitespace-nowrap select-none ${
              page === i + 1
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-500 hover:bg-primary/80 hover:text-white"
            }`}
            tabIndex={0}
            aria-label={`Go to page ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
