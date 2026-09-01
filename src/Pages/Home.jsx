import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { ArrowRight, Zap, X } from "lucide-react";

import ProductCard from "../Components/productCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTen, setShowTen] = useState(false);

  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const featuredRef = useRef(null);


    //  FETCH PRODUCTS
  useEffect(() => {
  api
    .get("/Book")
    .then((res) => {
      setProducts(res.data || []);
    })
    .catch((error) => {
      console.error("Failed to fetch books:", error);
      setProducts([]);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-bold">
        Loading Book-Tales Universe...
      </div>
    );
  }

    //  DISPLAY LOGIC
  const initialFive = products.slice(0, 5);
  const fixedTen = products.slice(0, 10);

  const displayedProducts = showTen ? fixedTen : initialFive;

    //  SCROLL HELPERS
  const scrollToFeatured = () => {
    const yOffset = -80; 
    const y =
      featuredRef.current.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="space-y-20 pb-16">

      {/*HERO*/}
      <section className="rounded-3xl border-4 border-black bg-gradient-to-br from-black via-gray-900 to-black shadow-[12px_12px_0_#000] px-8 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-widest mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500">
            BOOK-TALES
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 font-bold max-w-3xl mx-auto mb-10">
          A universe of{" "}
          <span className="text-red-400">SuperHero Comics</span>,{" "}
          <span className="text-blue-400">Manga</span> &{" "}
          <span className="text-purple-400">Graphic Novels</span> comics
        </p>

        <button
          onClick={scrollToFeatured}
          className="px-8 py-4 bg-yellow-400 text-black font-extrabold
          rounded-xl border-4 border-black shadow-[6px_6px_0_#000]
          hover:-translate-y-1 transition inline-flex items-center gap-2"
        >
          EXPLORE COLLECTION <Zap />
        </button>
      </section>

      {/*CATEGORIES*/}
      <section>
        <h2 className="text-3xl font-extrabold border-b-4 border-yellow-400 inline-block pb-2">
          CATEGORIES
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-10">

          <Link
            to="/category/superhero-comics"
            className="group rounded-2xl border-4 border-blue-600 bg-gradient-to-br from-blue-600 to-blue-800 p-6 shadow-[8px_8px_0_#2563eb] hover:-translate-y-2 transition"
          >
            <h3 className="text-3xl font-extrabold text-white mb-2">
              SUPERHERO COMICS
            </h3>
            <p className="text-white/90 font-bold">
              Marvel • DC • IMAGE COMICS
            </p>
            <div className="mt-6 flex justify-between items-center text-white font-bold">
              SHOP SUPERHERO <ArrowRight />
            </div>
          </Link>

          <Link
            to="/category/graphic-novels"
            className="group rounded-2xl border-4 border-purple-600 bg-gradient-to-br from-purple-600 to-pink-600 p-6 shadow-[8px_8px_0_#a855f7] hover:-translate-y-2 transition"
          >
            <h3 className="text-3xl font-extrabold text-white mb-2">
              GRAPHIC NOVELS
            </h3>
            <p className="text-white/90 font-bold">
              Fantasy • Mystery • Adventure
            </p>
            <div className="mt-6 flex justify-between items-center text-white font-bold">
              SHOP GRAPHIC NOVELS <ArrowRight />
            </div>
          </Link>
          
           <Link
            to="/category/manga"
            className="group rounded-2xl border-4 border-red-600 bg-gradient-to-br from-red-600 to-red-800 p-6 shadow-[8px_8px_0_#dc2626] hover:-translate-y-2 transition"
          >
            <h3 className="text-3xl font-extrabold text-white mb-2">
              MANGA
            </h3>
            <p className="text-white/90 font-bold">
              Naruto • One Piece • AOT
            </p>
            <div className="mt-6 flex justify-between items-center text-white font-bold">
              SHOP MANGA <ArrowRight />
            </div>
          </Link>
          
        </div>
      </section>

      {/*FEATURED COMICS*/}
      <section ref={featuredRef}>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold border-b-4 border-red-500 inline-block pb-2">
            FEATURED BOOKS
          </h2>

          {!showTen ? (
            <button
              onClick={() => {
                setShowTen(true);
                setTimeout(scrollToFeatured, 100);
              }}
              className="px-4 py-2 text-sm font-bold bg-black text-white
              border-2 border-black rounded-lg
              shadow-[3px_3px_0_#000] hover:-translate-y-0.5 transition"
            >
              VIEW MORE
            </button>
          ) : (
            <button
              onClick={() => {
                setShowTen(false);
                setTimeout(scrollToFeatured, 100);
              }}
              className="px-3 py-2 text-sm font-bold bg-red-600 text-white
              border-2 border-black rounded-lg
              shadow-[3px_3px_0_#000] hover:-translate-y-0.5 transition
              inline-flex items-center gap-1"
            >
              <X className="w-4 h-4" /> CLOSE
            </button>
          )}
        </div>

        <div
          className={`grid gap-8 mt-10 ${
            showTen
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
          }`}
        >
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onAddToWishlist={toggleWishlist}
              isAuthenticated={isAuthenticated}
              isWishlisted={wishlist.includes(product.id)}
            />
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
