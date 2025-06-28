import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PreCheckoutPage from "./pages/PreCheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ContactPage from "./pages/ContactPage";
import WishlistPage from "./pages/WishlistPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminProductEdit from "./pages/AdminProductEdit";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { NotificationProvider } from "./context/NotificationContext";
import AdminNav from "./components/AdminNav";
import { useContext } from "react";
import OrderSuccessPage from "./pages/OrderSuccessPage";

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return user && user.role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

const AdminLayout = () => (
  <div className="flex">
    <AdminNav />
    <main className="flex-1 p-4">
      <Outlet />
    </main>
  </div>
);

function App() {
  const location = useLocation();
  const hideHeaderFooter = ["/login", "/register"].includes(location.pathname);
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <NotificationProvider>
            {!hideHeaderFooter && <Header />}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/pre-checkout" element={<PrivateRoute />}>
                <Route index element={<PreCheckoutPage />} />
              </Route>
              <Route path="/checkout" element={<PrivateRoute />}>
                <Route index element={<CheckoutPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<PrivateRoute />}>
                <Route index element={<ProfilePage />} />
              </Route>
              <Route path="/orders" element={<PrivateRoute />}>
                <Route index element={<OrderHistoryPage />} />
              </Route>
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              {/* Admin routes */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/:id" element={<AdminProductEdit />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                </Route>
              </Route>
            </Routes>
            {!hideHeaderFooter && <Footer />}
          </NotificationProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
