import { Heart, ShoppingCart, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; 
const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  isAuthenticated,
  isWishlisted,
}) => {
  const navigate = useNavigate();
  const { isInCart } = useCart();

  const {
    id,
    title,
    imageUrl,
    price,
    rating,
    subCategory,
  } = product;

  const alreadyInCart = isInCart?.(id);
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    onAddToCart?.(id);
    navigate("/checkout");
  };

  return (
    <div className="group rounded-xl border-2 border-black bg-white 
    shadow-[4px_4px_0_#000] hover:-translate-y-1 transition">
      <img
        onClick={() => navigate(`/product/${id}`)}
        src={imageUrl}
        alt={title}
        className="h-70 w-full object-cover rounded-t-lg cursor-pointer"
      />
      <div className="p-3">

        <h3
          onClick={() => navigate(`/product/${id}`)}
          className="text-sm font-extrabold text-black mb-1 
          line-clamp-2 group-hover:text-red-600 cursor-pointer"
        >
          {title}
        </h3>
        <div className="flex items-center gap-0.5 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < Math.round(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-300 text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-lg font-extrabold text-black">
          ₹{price}
        </span>
        <button
          onClick={handleBuyNow}
          className="w-full mt-2 py-2 text-xs font-extrabold
          bg-black text-white rounded-md
          border-2 border-black
          shadow-[2px_2px_0_#000]
          hover:-translate-y-0.5 transition
          flex items-center justify-center gap-1"
        >
          BUY NOW <Zap className="w-3 h-3" />
        </button>

        {/* wishlist */}
        <div className="flex gap-1 mt-2">
          <button
            onClick={() => isAuthenticated && onAddToWishlist?.(id)}
            disabled={!isAuthenticated}
            className={`flex-1 p-1.5 border-2 border-black rounded-md 
            shadow-[2px_2px_0_#000] transition
            ${
              isWishlisted
                ? "bg-red-600 text-white"
                : "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
            }
            ${!isAuthenticated ? "opacity-40 cursor-not-allowed" : ""}
          `}
          >
            <Heart
              className={`w-3.5 h-3.5 mx-auto ${
                isWishlisted ? "fill-white" : ""
              }`}
            />
          </button>
          {/* cart */}
          <button
            onClick={() =>
              isAuthenticated && !alreadyInCart && onAddToCart?.(id)
            }
            disabled={!isAuthenticated || alreadyInCart}
            className={`flex-1 p-1.5 border-2 border-black rounded-md 
            shadow-[2px_2px_0_#000] transition
            ${
              alreadyInCart
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white"
            }
          `}
          >
            {alreadyInCart ? "IN CART" : (
              <ShoppingCart className="w-3.5 h-3.5 mx-auto" />
            )}
          </button>

        </div>
        {/* sub category */}
        {subCategory && (
          <span className="inline-block mt-2 px-2 py-0.5 
          bg-purple-600 text-white text-[10px] font-bold rounded-full">
            {subCategory}
          </span>
        )}

      </div>
    </div>
  );
};

export default ProductCard;
