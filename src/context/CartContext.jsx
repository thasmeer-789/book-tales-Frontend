import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import api from "../api/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // LOAD CART FROM BACKEND
  // =========================

  const loadCart = async () => {
    if (!isAuthenticated) {
      setCart([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.get("/Cart");

      /*
        Backend response:

        {
          id,
          userId,
          items: [
            {
              id,
              bookId,
              bookTitle,
              price,
              quantity,
              subtotal,
              imageUrl
            }
          ],
          total
        }
      */

      setCart(response.data?.items || []);
    } catch (error) {
      console.error("Failed to load cart:", error);

      if (error.response?.status !== 401) {
        toast.error("Failed to load cart");
      }

      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  // =========================
  // ADD TO CART
  // =========================

 const addToCart = async (productId, quantity = 1) => {
  if (!isAuthenticated) {
    toast.error("Please login to add items");
    return false;
  }

  try {
    await api.post("/Cart", {
      bookId: productId,
      quantity: quantity,
    });

    await loadCart();

    toast.success("Added to cart 🛒");

    return true;
  } catch (error) {
    console.error("Failed to add to cart:", error);

    const message =
      error.response?.data?.message ||
      "Failed to add item to cart";

    toast.error(message);

    return false;
  }
};

  // =========================
  // DECREMENT QUANTITY
  // =========================

  const decrementCart = async (productId) => {
    const item = cart.find(
      (item) =>
        String(item.bookId) === String(productId)
    );

    if (!item) return;

    try {
      if (item.quantity <= 1) {
        await api.delete(`/Cart/${productId}`);
      } else {
        await api.put(`/Cart/${productId}`, {
          quantity: item.quantity - 1,
        });
      }

      await loadCart();
    } catch (error) {
      console.error(
        "Failed to decrement cart item:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to update cart";

      toast.error(message);
    }
  };

  // =========================
  // REMOVE ITEM
  // =========================

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/Cart/${productId}`);

      await loadCart();

      toast.success("Item removed");
    } catch (error) {
      console.error(
        "Failed to remove cart item:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to remove item";

      toast.error(message);
    }
  };

  // =========================
  // CLEAR CART
  // =========================

  const clearCart = async () => {
    /*
      Backend currently does not have a
      DELETE /api/Cart endpoint for clearing
      the complete cart.

      So remove each item individually.
    */

    try {
      await Promise.all(
        cart.map((item) =>
          api.delete(`/Cart/${item.bookId}`)
        )
      );

      await loadCart();

      toast.success("Cart cleared 🧹");
    } catch (error) {
      console.error(
        "Failed to clear cart:",
        error
      );

      toast.error("Failed to clear cart");
    }
  };

  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQuantity = async (
    productId,
    newQty
  ) => {
    if (newQty < 1) {
      await removeFromCart(productId);
      return;
    }

    try {
      await api.put(`/Cart/${productId}`, {
        quantity: newQty,
      });

      await loadCart();
    } catch (error) {
      console.error(
        "Failed to update cart quantity:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to update quantity";

      toast.error(message);
    }
  };

  // =========================
  // CHECK ITEM IN CART
  // =========================

  const isInCart = (productId) => {
    return cart.some(
      (item) =>
        String(item.bookId) === String(productId)
    );
  };

  // =========================
  // GET PRODUCT DETAILS
  // =========================

  const getProductDetails = (productId) => {
    return cart.find(
      (item) =>
        String(item.bookId) === String(productId)
    );
  };

  // =========================
  // GET PRODUCT PRICE
  // =========================

  const getProductPrice = (productId) => {
    const item = getProductDetails(productId);

    return item?.price || 0;
  };

  // =========================
  // GET CART ITEMS
  // =========================

  const getCartItemsWithDetails = () => {
    return cart.map((item) => ({
      ...item,

      productId: item.bookId,

      title: item.bookTitle,

      price: item.price,

      image: item.imageUrl,

      qty: item.quantity,

      category: "",
    }));
  };

  // =========================
  // GET CART TOTAL
  // =========================

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) =>
        total + item.subtotal,
      0
    );
  };

  // =========================
  // GET CART COUNT
  // =========================

  const getCartCount = () => {
    return cart.reduce(
      (count, item) =>
        count + item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,

        addToCart,
        decrementCart,
        removeFromCart,
        clearCart,
        updateQuantity,

        isInCart,

        getProductPrice,
        getProductDetails,
        getCartItemsWithDetails,
        getCartTotal,
        getCartCount,

        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartContext);