import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  /* =========================
     AUTH GUARD
  ========================= */

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  /* =========================
     FETCH ORDERS
  ========================= */

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/Order");

        setOrders(response.data?.data || []);
      } catch (error) {
        console.error("Failed to load orders:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  /* =========================
     TOGGLE ORDER
  ========================= */

  const toggleView = (id) => {
    setOpenId(openId === id ? null : id);
  };

  /* =========================
     REORDER
  ========================= */

  const handleReorder = async (order) => {
    try {
      for (const item of order.orderItems || []) {
        await addToCart(
          item.bookId,
          item.quantity
        );
      }

      navigate("/cart");
    } catch (error) {
      console.error("Failed to reorder:", error);
    }
  };

  /* =========================
     STATUS
  ========================= */

  const getOrderStatus = (status) => {
    switch (Number(status)) {
      case 1:
        return "Pending";
      case 2:
        return "Confirmed";
      case 3:
        return "Shipped";
      case 4:
        return "Delivered";
      case 5:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getPaymentStatus = (status) => {
    switch (Number(status)) {
      case 1:
        return "Pending";
      case 2:
        return "Paid";
      case 3:
        return "Failed";
      case 4:
        return "Refunded";
      default:
        return "Unknown";
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="text-center py-20 font-bold text-black">
        Loading your orders...
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <p className="font-bold text-red-600">
          {error}
        </p>

        <button
          onClick={() => navigate("/profile")}
          className="mt-6 px-6 py-3 bg-yellow-400 text-black
                     font-extrabold border-2 border-black
                     rounded-lg shadow-[3px_3px_0_#000]"
        >
          BACK TO PROFILE
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6 text-black">

      {/* HEADER */}

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-1 font-bold text-black"
        >
          <ArrowLeft />
          Back
        </button>

        <h1 className="text-3xl font-extrabold text-black">
          My Orders
        </h1>
      </div>

      {/* NO ORDERS */}

      {orders.length === 0 ? (
        <div
          className="border-2 border-black rounded-xl
                     bg-white shadow-[4px_4px_0_#000]
                     p-12 text-center"
        >
          <p className="font-extrabold text-xl">
            You haven't placed any orders yet.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 bg-yellow-400 text-black
                       font-extrabold border-2 border-black
                       rounded-lg shadow-[3px_3px_0_#000]"
          >
            START SHOPPING
          </button>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="border-2 border-black rounded-xl
                       bg-white shadow-[4px_4px_0_#000]"
          >

            {/* SUMMARY */}

            <div className="flex justify-between items-center p-4">
              <div>
                <p className="font-bold text-black">
                  Order #{order.id}
                </p>

                <p className="text-sm font-bold text-black">
                  {new Date(
                    order.orderDate
                  ).toLocaleString()}
                </p>

                <p className="text-sm font-bold text-black">
                  Total: ₹{Number(
                    order.totalAmount || 0
                  ).toFixed(2)}
                </p>

                <div className="flex gap-3 mt-2">
                  <span
                    className="px-2 py-1 rounded
                               bg-blue-100 text-blue-800
                               text-xs font-extrabold"
                  >
                    {getOrderStatus(order.status)}
                  </span>

                  <span
                    className="px-2 py-1 rounded
                               bg-green-100 text-green-800
                               text-xs font-extrabold"
                  >
                    Payment:{" "}
                    {getPaymentStatus(
                      order.paymentStatus
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleView(order.id)}
                className="px-4 py-1.5 text-sm font-extrabold
                           bg-yellow-400 text-black
                           border-2 border-black rounded-md
                           shadow-[2px_2px_0_#000]"
              >
                {openId === order.id
                  ? "Hide"
                  : "View"}
              </button>
            </div>

            {/* ORDER ITEMS */}

            {openId === order.id && (
              <div
                className="border-t-2 border-black
                           p-4 bg-white space-y-4"
              >
                {(order.orderItems || []).map(
                  (item, index) => (
                    <div
                      key={
                        item.bookId || index
                      }
                      className="flex items-center
                                 gap-4 text-black"
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={
                            item.bookTitle ||
                            "Book"
                          }
                          className="w-16 h-22
                                     object-cover
                                     border-2
                                     border-black
                                     rounded"
                        />
                      )}

                      <div>
                        <p className="font-bold">
                          {item.bookTitle ||
                            `Book #${item.bookId}`}
                        </p>

                        <p className="text-sm font-bold">
                          Qty: {item.quantity}
                        </p>

                        <p className="font-bold">
                          ₹{Number(
                            item.price || 0
                          ).toFixed(2)}
                        </p>

                        <p className="text-sm font-bold">
                          Subtotal: ₹{Number(
                            item.subtotal || 0
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )
                )}

                <button
                  onClick={() =>
                    handleReorder(order)
                  }
                  className="w-full flex
                             items-center
                             justify-center gap-2
                             px-4 py-3
                             bg-yellow-400
                             text-black
                             font-extrabold
                             border-2
                             border-black
                             rounded-lg
                             shadow-[2px_2px_0_#000]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Reorder
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;