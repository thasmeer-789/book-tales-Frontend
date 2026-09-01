import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  ArrowLeft,
  Zap,
} from "lucide-react";

import api from "../api/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart, isInCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);

      try {
        const response = await api.get(`/Book/${id}`);

        setProduct(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch book:",
          error
        );

        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-32 text-xl font-bold">
        Loading book...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32 space-y-6">

        <p className="text-2xl font-extrabold">
          Book not found
        </p>

        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-yellow-400 border-4 border-black
                     rounded-xl font-bold shadow-[4px_4px_0_#000]"
        >
          GO BACK
        </button>

      </div>
    );
  }

  const isWishlisted = wishlist.some(
    (wishlistId) =>
      String(wishlistId) === String(product.id)
  );

  const alreadyInCart = isInCart?.(product.id);

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const added = await addToCart(product.id);

    if (added) {
      navigate("/checkout");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-12">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 font-bold hover:text-yellow-400"
      >
        <ArrowLeft />
        Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-12">

        <div
          className="border-4 border-black rounded-2xl
                     shadow-[8px_8px_0_#000] overflow-hidden"
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">

          <h1 className="text-4xl font-extrabold">
            {product.title}
          </h1>

          {product.author && (
            <p className="text-gray-400 font-bold">
              By {product.author}
            </p>
          )}

          <div className="flex items-center gap-1">

            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < 4
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-300 text-gray-300"
                }`}
              />
            ))}

            <span className="ml-2 font-bold">
              4 ★
            </span>

          </div>

          <p className="text-3xl font-extrabold">
            ₹{product.price}
          </p>

          <p
            className={`font-bold ${
              product.stock > 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} available`
              : "Out of stock"}
          </p>

          <p className="text-gray-400 leading-relaxed">
            {product.description ||
              "Experience this premium comic edition with iconic artwork, rich storytelling, and collector-grade print quality. A must-have addition for every true comic fan."}
          </p>

          {product.isbn && (
            <p className="text-sm text-gray-500 font-bold">
              ISBN: {product.isbn}
            </p>
          )}

          {product.categoryName && (
            <span
              className="inline-block px-4 py-2
                         bg-purple-600 text-white
                         font-bold rounded-full"
            >
              {product.categoryName}
            </span>
          )}

          <div className="text-sm font-bold text-gray-500 space-y-1">
            <p>✔ Free delivery available</p>
            <p>✔ 7-day replacement policy</p>
            <p>✔ Secure & encrypted payments</p>
          </div>

          <div className="space-y-4 pt-4">

            <button
              onClick={handleBuyNow}
              disabled={
                !isAuthenticated ||
                product.stock <= 0
              }
              className="w-full py-4 text-lg font-extrabold
                         bg-yellow-400 text-black rounded-xl
                         border-4 border-black
                         shadow-[6px_6px_0_#000]
                         hover:-translate-y-1 transition
                         flex items-center justify-center gap-2
                         disabled:opacity-40
                         disabled:cursor-not-allowed"
            >
              BUY NOW <Zap />
            </button>

            <div className="flex gap-4">

              <button
                onClick={() =>
                  isAuthenticated &&
                  !alreadyInCart &&
                  addToCart(product.id)
                }
                disabled={
                  !isAuthenticated ||
                  product.stock <= 0 ||
                  alreadyInCart
                }
                className={`flex-1 px-6 py-3 border-4 border-black rounded-xl
                            font-bold shadow-[4px_4px_0_#000]
                            ${
                              alreadyInCart
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white"
                            }
                            ${
                              !isAuthenticated ||
                              product.stock <= 0
                                ? "opacity-40 cursor-not-allowed"
                                : ""
                            }`}
              >
                <ShoppingCart className="inline mr-2" />
                {alreadyInCart ? "IN CART" : "Add to Cart"}
              </button>

              <button
                onClick={() =>
                  isAuthenticated &&
                  toggleWishlist(product.id)
                }
                disabled={!isAuthenticated}
                className={`flex-1 px-6 py-3 border-4 border-black rounded-xl
                            font-bold shadow-[4px_4px_0_#000]
                            ${
                              isWishlisted
                                ? "bg-red-600 text-white"
                                : "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
                            }
                            ${
                              !isAuthenticated
                                ? "opacity-40 cursor-not-allowed"
                                : ""
                            }`}
              >
                <Heart
                  className={`inline mr-2 ${
                    isWishlisted
                      ? "fill-white"
                      : ""
                  }`}
                />

                Wishlist
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;