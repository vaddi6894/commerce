import { Link } from "react-router-dom";
import { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import {
  ShoppingCartIcon,
  HeartIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [logoAnim, setLogoAnim] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-minimal animate-fadeIn">
      <nav className="container mx-auto flex items-center justify-between py-3 px-2">
        <Link
          to="/"
          className={`text-2xl md:text-3xl font-extrabold text-primary tracking-tight font-sans transition-transform duration-300 ${
            logoAnim ? "scale-110 rotate-2" : "hover:scale-105 hover:-rotate-2"
          }`}
          style={{ letterSpacing: "0.05em", cursor: "pointer" }}
          aria-label="ShopSwift Home"
          onMouseDown={() => setLogoAnim(true)}
          onMouseUp={() => setLogoAnim(false)}
          onMouseLeave={() => setLogoAnim(false)}
        >
          Shop
          <span className="text-orange-500 transition-colors duration-300 hover:text-primary">
            Swift
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/products"
            className="hover:text-primary font-medium transition-transform duration-200 hover:scale-105"
            aria-label="Shop"
          >
            Shop
          </Link>
          <Link
            to="/cart"
            className="relative hover:text-primary flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary rounded-full px-2 py-1 transition-transform duration-200 hover:scale-110"
            aria-label="Cart"
          >
            <ShoppingCartIcon className="w-6 h-6 text-gray-700 transition-transform duration-200 group-hover:scale-110" />
            {cart.length > 0 && (
              <span className="ml-1 text-xs bg-primary text-white rounded-full px-2 py-0.5 font-semibold">
                {cart.length}
              </span>
            )}
          </Link>
          <Link
            to="/wishlist"
            className="relative hover:text-accent flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-accent rounded-full px-2 py-1 transition-transform duration-200 hover:scale-110"
            aria-label="Wishlist"
          >
            <HeartIcon className="w-6 h-6 text-gray-700 transition-transform duration-200 group-hover:scale-110" />
            {wishlist.length > 0 && (
              <span className="ml-1 text-xs bg-accent text-white rounded-full px-2 py-0.5 font-semibold">
                {wishlist.length}
              </span>
            )}
          </Link>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="px-3 py-1 rounded-full bg-gray-100 hover:bg-primary hover:text-white font-semibold transition flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="User menu"
              >
                <UserCircleIcon className="w-6 h-6 text-gray-700" />
                <span className="hidden sm:inline">{user.name}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-minimal py-2 z-50">
                  {user.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                      aria-label="Admin Dashboard"
                    >
                      <Cog6ToothIcon className="w-5 h-5 text-accent" />
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-50 text-sm"
                    aria-label="Profile"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-accent transition flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Login"
            >
              <UserCircleIcon className="w-6 h-6" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
        </div>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setMobileNav((v) => !v)}
          aria-label="Open Menu"
        >
          <Bars3Icon className="w-7 h-7 text-gray-700" />
        </button>
        {mobileNav && (
          <div className="fixed inset-0 bg-black/30 z-50 flex flex-col items-end md:hidden animate-fadeIn">
            <button
              className="m-4 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setMobileNav(false)}
              aria-label="Close Menu"
            >
              <XMarkIcon className="w-7 h-7 text-gray-700" />
            </button>
            <div className="bg-white w-4/5 max-w-xs h-full shadow-minimal p-6 flex flex-col gap-6 rounded-l-xl">
              <Link
                to="/products"
                className="hover:text-primary font-medium transition"
                onClick={() => setMobileNav(false)}
                aria-label="Shop"
              >
                Shop
              </Link>
              <Link
                to="/cart"
                className="hover:text-primary font-medium transition"
                onClick={() => setMobileNav(false)}
                aria-label="Cart"
              >
                Cart
              </Link>
              <Link
                to="/wishlist"
                className="hover:text-accent font-medium transition"
                onClick={() => setMobileNav(false)}
                aria-label="Wishlist"
              >
                Wishlist
              </Link>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="hover:text-primary font-medium transition"
                    onClick={() => setMobileNav(false)}
                    aria-label="Profile"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="text-left hover:text-primary font-medium transition"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-accent transition flex items-center gap-1"
                  onClick={() => setMobileNav(false)}
                  aria-label="Login"
                >
                  <UserCircleIcon className="w-6 h-6" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
