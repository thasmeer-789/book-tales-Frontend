import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../api/api";
import ProductCard from "../Components/productCard";
import Pagination from "../Components/Pagination";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const Category = () => {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const trimmedSearch = searchTerm.trim();

    const fetchBooks = async () => {
      setLoading(true);

      try {
        const response = trimmedSearch
          ? await api.get("/Book/search", {
              params: { search: trimmedSearch },
            })
          : await api.get("/Book");

        setProducts(response.data || []);
      } catch (error) {
        console.error("Failed to fetch books:", error);

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchBooks, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    let result = products.filter(
      (product) =>
        product.categoryName
          ?.toLowerCase()
          .replace(/\s+/g, "-") === id?.toLowerCase()
    );

    if (sortOrder === "lowToHigh") {
      result = [...result].sort(
        (a, b) => a.price - b.price
      );
    } else if (sortOrder === "highToLow") {
      result = [...result].sort(
        (a, b) => b.price - a.price
      );
    }

    setFiltered(result);

    setCurrentPage(1);
  }, [products, id, sortOrder]);

  const lastIndex = currentPage * ITEMS_PER_PAGE;
  const firstIndex = lastIndex - ITEMS_PER_PAGE;

  const paginatedProducts = filtered.slice(
    firstIndex,
    lastIndex
  );

  const totalPages = Math.ceil(
    filtered.length / ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-12 pb-16">

      <div className="text-center">

        <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-widest">
          {id?.replace(/-/g, " ")}
        </h1>

        <p className="text-gray-400 font-bold mt-2">

          {id === "superhero-comics" &&
            "Marvel • DC • Superheroes"}

          {id === "graphic-novels" &&
            "Fantasy • Mystery • Adventure"}

          {id === "manga" &&
            "Naruto • One Piece • AOT • More"}

        </p>

      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">

        <div className="relative w-full sm:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search comics..."
            className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-xl
                       font-bold focus:outline-none focus:border-yellow-400"
          />
        </div>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 border-2 border-black rounded-xl font-bold text-gray-500
                     focus:outline-none focus:border-yellow-400 bg-white"
        >
          <option value="default">Sort: Default</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>

      </div>

      {loading ? (

        <div className="text-center py-20 text-xl font-bold">
          Loading Comics...
        </div>

      ) : (

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

          {paginatedProducts.length === 0 ? (

            <p className="text-center col-span-full font-bold">
              No comics found.
            </p>

          ) : (

            paginatedProducts.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onAddToWishlist={toggleWishlist}
                isAuthenticated={isAuthenticated}
                isWishlisted={wishlist.includes(
                  product.id
                )}
              />

            ))

          )}

        </div>

      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

    </div>
  );
};

export default Category;