import { Link } from "react-router-dom";
import {
  HeartIcon as HeartOutline,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

const ProductCard = ({
  product,
  addToCart,
  toggleWishlist,
  inWishlist,
  onBuyNow,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-minimal hover:shadow-2xl transition-all duration-300 p-4 flex flex-col relative animate-fadeIn group focus-within:ring-2 focus-within:ring-primary hover:scale-[1.03] active:scale-95">
      <Link
        to={`/product/${product._id}`}
        className="block overflow-hidden rounded-xl"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-40 w-full object-cover rounded-xl transform group-hover:scale-110 transition-transform duration-300"
        />
      </Link>
      <span className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded-full bg-accent text-white shadow transition-transform duration-200 group-hover:scale-110 group-hover:bg-primary">
        {product.category}
      </span>
      <div className="flex-1 flex flex-col gap-2 mt-2">
        <Link
          to={`/product/${product._id}`}
          className="font-bold text-lg text-gray-900 hover:text-primary transition-colors duration-200 line-clamp-2"
        >
          {product.name}
        </Link>
        <span className="text-primary font-bold text-xl">
          ₹{product.price.toFixed(2)}
        </span>
        <div className="flex flex-col xs:flex-row gap-2 mt-2 w-full">
          <button
            aria-label="Add to cart"
            onClick={() =>
              addToCart({
                product: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                // add other fields as needed
              })
            }
            className="bg-primary hover:bg-accent text-white px-3 py-1 rounded-full font-semibold transition active:scale-95 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-primary w-full xs:w-auto flex-1 flex items-center justify-center gap-1"
          >
            <ShoppingCartIcon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="hidden sm:inline">Add</span>
          </button>
          <button
            aria-label="Buy now"
            onClick={() => onBuyNow && onBuyNow(product)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full font-semibold transition active:scale-95 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 w-full xs:w-auto flex-1 flex items-center justify-center gap-1"
          >
            <ShoppingCartIcon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="hidden sm:inline">Buy Now</span>
          </button>
          <button
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() => toggleWishlist(product)}
            className={`px-3 py-1 rounded-full font-semibold transition active:scale-95 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-accent w-full xs:w-auto flex-1 flex items-center justify-center gap-1 ${
              inWishlist
                ? "bg-accent text-white"
                : "bg-gray-100 text-gray-700 hover:bg-accent hover:text-white"
            }`}
          >
            {inWishlist ? (
              <HeartSolid className="w-5 h-5 text-red-500 transition-transform duration-200 group-hover:scale-110" />
            ) : (
              <HeartOutline className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            )}
            <span className="hidden sm:inline">Wishlist</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
