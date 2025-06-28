import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import Message from "../components/Message";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  HeartIcon,
  ShoppingCartIcon,
  ArrowRightOnRectangleIcon,
  TruckIcon,
  StarIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import api from "../api/api";

const recommended = [
  // Example recommended products (replace with real data/fetch in production)
  {
    _id: "1",
    name: "Wireless Headphones",
    price: 1999,
    image: "/images/headphones.jpg",
    category: "Electronics",
  },
  {
    _id: "2",
    name: "Smart Watch",
    price: 2999,
    image: "/images/smartwatch.jpg",
    category: "Wearables",
  },
];

const ProfilePage = () => {
  const { user, logout, setUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const profileFormRef = useRef(null);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [settings, setSettings] = useState(
    user?.settings || { newsletter: false, darkMode: false }
  );
  const [settingsMsg, setSettingsMsg] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    address: "",
    city: "",
    country: "",
    zip: "",
  });
  const [editingAddressIdx, setEditingAddressIdx] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    message: "",
  });
  const [contactMsg, setContactMsg] = useState("");
  const [contactError, setContactError] = useState("");
  const [contactLoading, setContactLoading] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    api
      .get("/auth/settings")
      .then((res) => setSettings(res.data))
      .catch(() => {});
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const payload = { name, email };
      if (password) payload.password = password;
      const { data } = await api.put("/auth/profile", payload);
      setSuccess("Profile updated!");
      setError("");
      setUser(data); // Update AuthContext user
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Update failed");
      setSuccess(""); // Clear success on error
    }
  };

  // Address handlers (local state for now):
  const handleAddAddress = (e) => {
    e.preventDefault();
    setAddresses([...addresses, newAddress]);
    setNewAddress({ label: "", address: "", city: "", country: "", zip: "" });
  };
  const handleEditAddress = (idx) => setEditingAddressIdx(idx);
  const handleUpdateAddress = (e) => {
    e.preventDefault();
    setAddresses(
      addresses.map((a, i) => (i === editingAddressIdx ? newAddress : a))
    );
    setEditingAddressIdx(null);
    setNewAddress({ label: "", address: "", city: "", country: "", zip: "" });
  };
  const handleDeleteAddress = (idx) =>
    setAddresses(addresses.filter((_, i) => i !== idx));

  // Settings handlers (persist to backend):
  const handleToggleSetting = async (key) => {
    setSettingsLoading(true);
    setSettingsError("");
    setSettingsMsg("");
    try {
      const updated = { ...settings, [key]: !settings[key] };
      const { data } = await api.put("/auth/settings", updated);
      setSettings(data);
      setSettingsMsg("Settings updated!");
    } catch (err) {
      setSettingsError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update settings"
      );
    } finally {
      setSettingsLoading(false);
    }
  };

  // Contact form handler
  const handleContactChange = (e) =>
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactMsg("");
    setContactError("");
    setContactLoading(true);
    try {
      await api.post("/contact", contactForm);
      setContactMsg("Message sent!");
      setContactForm({
        name: user?.name || "",
        email: user?.email || "",
        message: "",
      });
    } catch (err) {
      setContactError(
        err.response?.data?.message || err.message || "Failed to send message."
      );
    } finally {
      setContactLoading(false);
    }
  };

  // Sidebar links
  const navLinks = [
    {
      key: "profile",
      label: "Profile",
      icon: UserCircleIcon,
      onClick: () => setActiveTab("profile"),
    },
    {
      key: "orders",
      label: "Orders",
      icon: TruckIcon,
      onClick: () => navigate("/orders"),
    },
    {
      key: "wishlist",
      label: "Wishlist",
      icon: HeartIcon,
      onClick: () => navigate("/wishlist"),
      count: wishlist.length,
    },
    {
      key: "addresses",
      label: "Addresses",
      icon: HomeIcon,
      onClick: () => setActiveTab("addresses"),
    },
    {
      key: "settings",
      label: "Settings",
      icon: Cog6ToothIcon,
      onClick: () => setActiveTab("settings"),
    },
  ];

  // Responsive sidebar: collapse to top nav on mobile
  // (for brevity, always show sidebar in this code; add mobile logic as needed)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header Section */}
      <div className="bg-white shadow-sm py-6 px-4 md:px-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b">
        <div className="flex items-center gap-4">
          <span className="inline-block bg-primary text-white rounded-full p-2 md:p-3 shadow">
            <UserCircleIcon className="w-10 h-10 md:w-14 md:h-14" />
          </span>
          <div>
            <div className="text-lg md:text-2xl font-bold">
              Hi, {user?.name || "User"}!
            </div>
            <div className="text-gray-500 text-sm md:text-base">
              Welcome back to your dashboard
            </div>
          </div>
        </div>
        <div className="flex gap-2 md:gap-4 mt-2 md:mt-0">
          <button
            onClick={() => {
              setActiveTab("profile");
              setTimeout(() => {
                if (profileFormRef.current) {
                  profileFormRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  profileFormRef.current.querySelector("input").focus();
                }
              }, 100);
            }}
            className="bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-accent transition focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Edit Profile
          </button>
          <button
            onClick={logout}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center gap-2"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>
      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 container mx-auto py-8 animate-fadeIn">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-1/5 bg-white rounded-xl shadow-minimal p-4 flex md:flex-col gap-2 md:gap-4 mb-4 md:mb-0 border border-gray-100">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={link.onClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary w-full text-left hover:bg-primary/10 hover:text-primary ${
                activeTab === link.key
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700"
              }`}
              aria-current={activeTab === link.key ? "page" : undefined}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
              {link.count > 0 && (
                <span className="ml-auto bg-accent text-white text-xs rounded-full px-2 py-0.5 font-bold">
                  {link.count}
                </span>
              )}
            </button>
          ))}
        </aside>
        {/* Center Content */}
        <main className="flex-1 flex flex-col gap-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center gap-2 border border-gray-100">
              <ShoppingCartIcon className="w-8 h-8 text-primary" />
              <div className="text-2xl font-bold">{cart.length}</div>
              <div className="text-gray-500 text-sm">Cart Items</div>
            </div>
            <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center gap-2 border border-gray-100">
              <HeartIcon className="w-8 h-8 text-accent" />
              <div className="text-2xl font-bold">{wishlist.length}</div>
              <div className="text-gray-500 text-sm">Wishlist</div>
            </div>
            <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center gap-2 border border-gray-100">
              <StarIcon className="w-8 h-8 text-yellow-400" />
              <div className="text-2xl font-bold">0</div>
              <div className="text-gray-500 text-sm">Loyalty Points</div>
            </div>
          </div>
          {/* Main Tab Content */}
          <section className="bg-white rounded-xl shadow p-6 border border-gray-100 min-h-[300px]">
            {activeTab === "profile" && (
              <form
                ref={profileFormRef}
                onSubmit={handleUpdate}
                className="flex flex-col gap-4 max-w-lg mx-auto"
                aria-label="Edit Profile"
              >
                <h2 className="text-xl font-bold mb-2">Profile Information</h2>
                {error && <Message type="error">{error}</Message>}
                {success && <Message type="success">{success}</Message>}
                <label className="block">
                  <span className="text-gray-600 font-medium">Name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary rounded-full px-4 py-2 w-full bg-gray-50 font-sans transition mt-1"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-600 font-medium">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary rounded-full px-4 py-2 w-full bg-gray-50 font-sans transition mt-1"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-gray-600 font-medium">Password</span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary rounded-full px-4 py-2 w-full bg-gray-50 font-sans transition mt-1 pr-10"
                      placeholder="New password (optional)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.036 3.772 6.099 6.75 9.75 6.75 1.563 0 3.06-.362 4.396-1.02M21.75 12c-.512-.949-1.246-2.1-2.25-3.223m-3.5-2.527A6.75 6.75 0 0 0 12 5.25c-3.651 0-7.714 2.978-9.75 6.75a10.477 10.477 0 0 0 1.73 3.777m3.5 2.527A6.75 6.75 0 0 0 12 18.75c3.651 0 7.714-2.978 9.75-6.75a10.477 10.477 0 0 0-1.73-3.777"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12S5.25 6.75 12 6.75 21.75 12 21.75 12 18.75 17.25 12 17.25 2.25 12 2.25 12z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </label>
                <button
                  type="submit"
                  className="w-full bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-primary-dark transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                >
                  Update
                </button>
              </form>
            )}
            {activeTab === "addresses" && (
              <div className="max-w-lg mx-auto">
                <h2 className="text-xl font-bold mb-4">Your Addresses</h2>
                <ul className="mb-4">
                  {addresses.map((addr, idx) => (
                    <li
                      key={idx}
                      className="bg-gray-50 rounded-xl p-4 mb-2 flex flex-col gap-1 border border-gray-200"
                    >
                      <div className="font-semibold">{addr.label}</div>
                      <div className="text-gray-600 text-sm">
                        {addr.address}, {addr.city}, {addr.country}, {addr.zip}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            setEditingAddressIdx(idx);
                            setNewAddress(addr);
                          }}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(idx)}
                          className="text-red-500 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <form
                  onSubmit={
                    editingAddressIdx !== null
                      ? handleUpdateAddress
                      : handleAddAddress
                  }
                  className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-200"
                >
                  <input
                    type="text"
                    placeholder="Label (e.g. Home, Work)"
                    value={newAddress.label}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, label: e.target.value })
                    }
                    className="border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={newAddress.address}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, address: e.target.value })
                    }
                    className="border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                    className="border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={newAddress.country}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, country: e.target.value })
                    }
                    className="border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="ZIP"
                    value={newAddress.zip}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, zip: e.target.value })
                    }
                    className="border rounded px-3 py-2"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white rounded-full px-4 py-2 font-semibold mt-2"
                  >
                    {editingAddressIdx !== null
                      ? "Update Address"
                      : "Add Address"}
                  </button>
                  {editingAddressIdx !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAddressIdx(null);
                        setNewAddress({
                          label: "",
                          address: "",
                          city: "",
                          country: "",
                          zip: "",
                        });
                      }}
                      className="text-gray-500 mt-1"
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>
            )}
            {activeTab === "settings" && (
              <div className="max-w-lg mx-auto">
                <h2 className="text-xl font-bold mb-4">Settings</h2>
                {settingsMsg && <Message type="success">{settingsMsg}</Message>}
                {settingsError && (
                  <Message type="error">{settingsError}</Message>
                )}
                <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.newsletter}
                      onChange={() => handleToggleSetting("newsletter")}
                      disabled={settingsLoading}
                    />
                    <span>Subscribe to newsletter</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={() => handleToggleSetting("darkMode")}
                      disabled={settingsLoading}
                    />
                    <span>Enable dark mode</span>
                  </label>
                </div>
              </div>
            )}
          </section>
        </main>
        {/* Right Panel: Recommendations/Support */}
        <aside className="w-full md:w-1/4 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
            <div className="font-bold text-lg mb-3">Contact Support</div>
            {contactMsg && <Message type="success">{contactMsg}</Message>}
            {contactError && <Message type="error">{contactError}</Message>}
            <form
              onSubmit={handleContactSubmit}
              className="flex flex-col gap-3"
            >
              <input
                name="name"
                value={contactForm.name}
                onChange={handleContactChange}
                className="border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-sans bg-gray-50"
                placeholder="Your Name"
                required
              />
              <input
                name="email"
                type="email"
                value={contactForm.email}
                onChange={handleContactChange}
                className="border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-sans bg-gray-50"
                placeholder="Your Email"
                required
              />
              <textarea
                name="message"
                value={contactForm.message}
                onChange={handleContactChange}
                className="border border-gray-200 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-sans bg-gray-50 min-h-[80px]"
                placeholder="How can we help you?"
                required
              />
              <button
                type="submit"
                disabled={contactLoading}
                className="bg-primary text-white rounded-full px-4 py-2 font-semibold mt-2 hover:bg-accent transition disabled:opacity-60"
              >
                {contactLoading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
