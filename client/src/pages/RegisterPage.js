import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Message from "../components/Message";

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [logoAnim, setLogoAnim] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 animate-fadeIn">
      <div className="mb-8 flex flex-col items-center">
        <span
          className={`text-4xl md:text-5xl font-extrabold text-primary tracking-tight drop-shadow-lg font-sans transition-transform duration-300 ${
            logoAnim ? "scale-110 rotate-2" : "hover:scale-105 hover:-rotate-2"
          }`}
          style={{ letterSpacing: "0.05em", cursor: "pointer" }}
          onMouseDown={() => setLogoAnim(true)}
          onMouseUp={() => setLogoAnim(false)}
          onMouseLeave={() => setLogoAnim(false)}
        >
          Shop
          <span className="text-orange-500 transition-colors duration-300 hover:text-primary">
            pie
          </span>
        </span>
        <span className="text-xs text-gray-400 tracking-widest mt-1">
          Create your account
        </span>
      </div>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col gap-6 transition-transform duration-200 hover:scale-[1.02] active:scale-95">
        <h2 className="text-2xl font-bold mb-2 font-sans text-center">
          Create Account
        </h2>
        {error && <Message type="error">{error}</Message>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-500 mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-sans bg-gray-50 transition-all duration-200 focus:shadow-lg"
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-sans bg-gray-50 transition-all duration-200 focus:shadow-lg"
              autoComplete="email"
              required
            />
          </div>
          <div className="relative">
            <label className="block text-gray-500 mb-1">Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-sans bg-gray-50 transition-all duration-200 focus:shadow-lg pr-12"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary focus:outline-none transition-colors duration-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
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
                  className="w-6 h-6"
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
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white rounded-full px-6 py-2 font-semibold shadow-minimal hover:scale-105 hover:bg-orange-500 active:scale-95 transition-transform duration-200 disabled:opacity-60 w-full text-lg"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-2 text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline hover:text-orange-500 transition-colors duration-200"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
