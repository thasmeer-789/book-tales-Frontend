import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/api";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // LOAD WISHLIST
  // =========================

  const loadWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.get("/Wishlist");

      /*
        Backend wishlist response can contain
        wishlist items with book information.

        We keep only book IDs in the context
        because the existing UI expects:

        wishlist = ["bookId1", "bookId2"]
      */

      const items = response.data?.items || response.data || [];

      const bookIds = items.map((item) =>
        String(item.bookId || item.id)
      );

      setWishlist(bookIds);
    } catch (error) {
      console.error(
        "Failed to load wishlist:",
        error
      );

      if (error.response?.status !== 401) {
        toast.error("Failed to load wishlist");
      }

      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [isAuthenticated]);

  // =========================
  // TOGGLE WISHLIST
  // =========================

  const toggleWishlist = async (bookId) => {
    if (!isAuthenticated) {
      toast.error("Please login to use wishlist");
      return false;
    }

    const id = String(bookId);

    const exists = wishlist.some(
      (wishlistId) =>
        String(wishlistId) === id
    );

    try {
      if (exists) {
        // REMOVE

        await api.delete(
          `/Wishlist/${bookId}`
        );

        setWishlist((prev) =>
          prev.filter(
            (wishlistId) =>
              String(wishlistId) !== id
          )
        );

        toast.success(
          "Removed from wishlist ❤️"
        );
      } else {
        // ADD

        await api.post("/Wishlist", {
          bookId: bookId,
        });

        setWishlist((prev) => [
          ...prev,
          id,
        ]);

        toast.success(
          "Added to wishlist ❤️"
        );
      }

      return true;
    } catch (error) {
      console.error(
        "Failed to update wishlist:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to update wishlist";

      toast.error(message);

      return false;
    }
  };

  // =========================
  // CLEAR WISHLIST
  // =========================

  const clearWishlist = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      /*
        Backend does not expose a
        DELETE /api/Wishlist endpoint.

        So remove each wishlist item individually.
      */

      await Promise.all(
        wishlist.map((bookId) =>
          api.delete(
            `/Wishlist/${bookId}`
          )
        )
      );

      setWishlist([]);

      toast.success(
        "Wishlist cleared ❤️"
      );
    } catch (error) {
      console.error(
        "Failed to clear wishlist:",
        error
      );

      toast.error(
        "Failed to clear wishlist"
      );

      // Reload actual backend state
      await loadWishlist();
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        toggleWishlist,
        clearWishlist,
        loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () =>
  useContext(WishlistContext);