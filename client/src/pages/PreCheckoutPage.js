import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRightIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

const PreCheckoutPage = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="container mx-auto py-10 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-minimal p-6 flex flex-col items-center w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 font-sans">Order Summary</h2>
        {cart.length > 0 ? (
          <>
            <div className="w-full flex flex-col gap-4">
              {cart.map((item) => (
                <div
                  key={item.product}
                  className="flex items-center gap-4 bg-gray-50 rounded-xl p-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {item.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {item.qty} x ₹{item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="font-semibold text-lg text-primary">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-bold text-xl">Total:</span>
              <span className="font-bold text-xl text-primary">
                ₹{total.toFixed(2)}
              </span>
            </div>
            <button
              aria-label="Proceed to Payment"
              className="mt-6 bg-primary text-white px-6 py-3 rounded-full font-semibold text-lg shadow hover:bg-accent transition active:scale-95 w-full flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Payment
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="text-center text-gray-500">
            <ShoppingCartIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Your cart is empty.</p>
            <Link
              to="/"
              className="mt-4 inline-block text-primary hover:underline"
            >
              Go Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreCheckoutPage;
