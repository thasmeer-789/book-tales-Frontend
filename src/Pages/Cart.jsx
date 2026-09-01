import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const {
    cart,
    addToCart,
    decrementCart,
    removeFromCart,
    clearCart,
    getCartItemsWithDetails,
    getCartTotal,
  } = useCart();

  const navigate = useNavigate();

  // Backend cart → UI-compatible cart items
  const cartItems = getCartItemsWithDetails();

  const total = getCartTotal();

  // =========================
  // EMPTY CART
  // =========================

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold mb-4">
          Cart is empty 🛒
        </h2>

        <Link
          to="/"
          className="font-bold text-blue-400"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  // =========================
  // CART
  // =========================

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8">

      {/* HEADER + CLEAR CART */}

      <div className="flex justify-between items-center">

        <h1 className="text-4xl font-extrabold">
          YOUR CART
        </h1>

        <button
          onClick={clearCart}
          className="px-4 py-2 bg-red-500 text-black font-extrabold
                     border-4 border-black rounded-lg
                     shadow-[4px_4px_0_#000]
                     hover:-translate-y-0.5 transition"
        >
          CLEAR CART
        </button>

      </div>

      {/* CART ITEMS */}

      {cartItems.map((item) => (

        <div
          key={item.productId}
          className="flex gap-6 bg-white text-black
                     border-4 border-black rounded-xl p-4"
        >

          {/* IMAGE */}

          <img
            src={item.image}
            alt={item.title}
            className="w-32 h-40 object-cover"
          />

          {/* DETAILS */}

          <div className="flex-1">

            <h2 className="text-2xl font-bold">
              {item.title}
            </h2>

            <p className="mt-2 font-bold">
              ₹{item.price}
            </p>

            {/* QUANTITY */}

            <div className="flex items-center gap-3 mt-4">

              <button
                onClick={() =>
                  decrementCart(item.productId)
                }
                className="p-2 border-2 border-black rounded-md"
              >
                <Minus />
              </button>

              <span className="font-bold">
                {item.qty}
              </span>

              <button
                onClick={() =>
                  addToCart(item.productId)
                }
                className="p-2 border-2 border-black rounded-md"
              >
                <Plus />
              </button>

            </div>

          </div>

          {/* REMOVE + SUBTOTAL */}

          <div className="flex flex-col justify-between items-end">

            <button
              onClick={() =>
                removeFromCart(item.productId)
              }
            >
              <Trash2 />
            </button>

            <p className="font-bold">
              ₹{item.price * item.qty}
            </p>

          </div>

        </div>

      ))}

      {/* TOTAL */}

      <div className="text-right text-3xl font-extrabold">
        TOTAL: ₹{total}
      </div>

      {/* CHECKOUT */}

      <div className="flex justify-end mt-10">

        <button
          onClick={() => navigate("/checkout")}
          className="px-8 py-4 bg-green-500 text-black font-extrabold
                     border-4 border-black rounded-xl
                     shadow-[6px_6px_0_#000]
                     hover:-translate-y-1 transition"
        >
          PROCEED TO CHECKOUT
        </button>

      </div>

    </div>
  );
};

export default Cart;