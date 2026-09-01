import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/api";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Wishlist = () => {
  const {
    wishlist,
    toggleWishlist,
    clearWishlist,
    isLoading: wishlistLoading,
  } = useWishlist();

  const {
    cart,
    addToCart,
  } = useCart();

  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movingId, setMovingId] = useState(null);

  // =========================
  // FETCH BOOKS
  // =========================

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/Book");

        setProducts(response.data || []);
      } catch (error) {
        console.error(
          "Failed to fetch books:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">

        <Heart className="w-16 h-16 text-gray-400" />

        <h2 className="text-3xl font-extrabold">
          Login to view wishlist
        </h2>

        <Link
          to="/login"
          className="px-6 py-3 bg-yellow-400 text-black font-bold
                     border-4 border-black rounded-xl
                     shadow-[4px_4px_0_#000]"
        >
          LOGIN
        </Link>

      </div>
    );
  }

  // =========================
  // LOADING
  // =========================

  if (loading || wishlistLoading) {
    return (
      <div className="text-center py-32 font-bold">
        Loading wishlist...
      </div>
    );
  }

  // =========================
  // MAP WISHLIST BOOKS
  // =========================

  const wishlistItems = wishlist
    .map((id) =>
      products.find(
        (book) =>
          String(book.id) === String(id)
      )
    )
    .filter(Boolean);

  // =========================
  // EMPTY WISHLIST
  // =========================

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">

        <Heart className="w-16 h-16 text-gray-400" />

        <h2 className="text-3xl font-extrabold">
          Your wishlist is empty
        </h2>

        <Link
          to="/"
          className="px-6 py-3 bg-blue-500 text-white font-bold
                     border-4 border-black rounded-xl
                     shadow-[4px_4px_0_#000]"
        >
          GO SHOPPING
        </Link>

      </div>
    );
  }

  // =========================
  // WISHLIST PAGE
  // =========================

  return (
    <div className="max-w-6xl mx-auto py-16 space-y-10">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h1 className="text-5xl font-extrabold tracking-widest">
          MY WISHLIST
        </h1>

        <button
          onClick={clearWishlist}
          className="px-4 py-2 bg-red-500 text-black font-extrabold
                     border-4 border-black rounded-lg
                     shadow-[4px_4px_0_#000]
                     hover:-translate-y-0.5 transition"
        >
          CLEAR WISHLIST
        </button>

      </div>

      {/* WISHLIST ITEMS */}

      {wishlistItems.map((item) => {

        const isInCart = cart.some(
          (cartItem) =>
            String(cartItem.productId) ===
            String(item.id)
        );

        return (
          <div
            key={item.id}
            className="flex gap-6 bg-white text-black
                       border-4 border-black rounded-2xl p-4
                       shadow-[6px_6px_0_#000]"
          >

            {/* IMAGE */}

            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-28 h-40 object-cover rounded-lg"
            />

            {/* DETAILS */}

            <div className="flex-1">

              <h2 className="text-2xl font-extrabold">
                {item.title}
              </h2>

              <p className="font-bold mt-2">
                ₹{item.price}
              </p>

              {item.author && (
                <p className="text-gray-600 font-semibold mt-1">
                  By {item.author}
                </p>
              )}

            </div>

            {/* ACTIONS */}

            <div className="flex flex-col gap-3">

              {/* MOVE TO CART */}

              <button
                disabled={
                  isInCart ||
                  movingId === item.id
                }
                onClick={async () => {
                  setMovingId(item.id);

                  const added =
                    await addToCart(item.id);

                  if (added) {
                    await toggleWishlist(
                      item.id
                    );

                    toast.success(
                      "Moved to cart 🛒"
                    );
                  }

                  setMovingId(null);
                }}
                className={`p-3 border-4 border-black rounded-xl
                  shadow-[3px_3px_0_#000]
                  ${
                    isInCart
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:-translate-y-1 transition"
                  }`}
                title={
                  isInCart
                    ? "Already in cart"
                    : "Move to cart"
                }
              >
                <ShoppingCart />
              </button>

              {/* REMOVE */}

              <button
                onClick={() =>
                  toggleWishlist(item.id)
                }
                className="p-3 bg-red-500 text-white
                           border-4 border-black rounded-xl
                           shadow-[3px_3px_0_#000]"
                title="Remove"
              >
                <Trash2 />
              </button>

            </div>

          </div>
        );
      })}

    </div>
  );
};

export default Wishlist;