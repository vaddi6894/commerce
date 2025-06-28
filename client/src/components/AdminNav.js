import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
];

const AdminNav = () => {
  const { pathname } = useLocation();
  return (
    <aside className="w-60 bg-gray-900 min-h-screen p-6 hidden md:block shadow-xl">
      <div className="mb-8 text-center">
        <span className="text-lg font-bold text-primary tracking-wide uppercase">
          Admin Panel
        </span>
      </div>
      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-4 py-2 rounded font-semibold transition-colors text-white hover:bg-primary/80 hover:text-white ${
              pathname === link.to ? "bg-primary text-white" : "bg-gray-800"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminNav;
