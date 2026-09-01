import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User, LogOut, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const wishlistCount = wishlist.length;

  return (
    <nav className="sticky top-0 z-50 bg-black border-b-4 border-yellow-400 shadow-[0_8px_0_#000]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link
          to="/"
          className="text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500 hover:scale-105 transition"
        >
          BOOK-TALES
        </Link>
        {/* category */}
        <div className="hidden md:flex items-center gap-6 ml-10">
            <Link
              to="/category/superhero-comics"
              className="font-extrabold text-yellow-400 hover:text-red-500 transition"
            >
              SUPERHERO COMICS
            </Link>

            <Link
              to="/category/graphic-novels"
              className="font-extrabold text-blue-400 hover:text-white transition"
            >
              GRAPHIC NOVELS
            </Link>

            <Link
              to="/category/manga"
              className="font-extrabold text-purple-400 hover:text-pink-400 transition"
            >
              MANGA
            </Link>
        </div>

        <div className="flex items-center gap-4">

          {isAuthenticated ? (
            <>
            {/* wishlist */}
              <Link to="/wishlist" className="relative comic-icon border-pink-500 text-pink-500">
                <Heart />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-black">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              {/* Cart */}
              <Link to="/cart" className="relative comic-icon border-blue-500 text-blue-500">
                <ShoppingCart />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-black">
                    {cartCount}
                  </span>
                )}
              </Link>
              {/* profile */}
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 bg-yellow-400 border-4 border-black text-black rounded-xl shadow-[4px_4px_0_#000] font-bold hover:-translate-y-1 transition"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:block">{user?.username}</span>
              </Link>
              {/* logout */}
              <button
                onClick={logout}
                className="comic-icon border-red-600 text-red-600"
                title="Logout"
              >
                <LogOut />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-red-500 text-white font-extrabold border-4 border-black rounded-xl shadow-[4px_4px_0_#000] hover:-translate-y-1 transition"
            >
              LOGIN
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
