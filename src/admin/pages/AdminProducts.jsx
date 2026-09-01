import { useEffect, useState } from "react";
import api from "../../api/api";
import { Plus, Pencil, Trash2, Upload, Search } from "lucide-react";
import Pagination from "../../Components/Pagination";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    stock: "",
    isbn: "",
    imageUrl: "",
    publishedDate: "",
    categoryId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [booksResponse, categoriesResponse] =
        await Promise.all([
          api.get("/Book"),
          api.get("/Category"),
        ]);

      console.log("BOOK RESPONSE:", booksResponse.data);
      console.log(
        "CATEGORY RESPONSE:",
        categoriesResponse.data
      );

      const books =
        booksResponse.data?.data ||
        booksResponse.data ||
        [];

      const categoryData =
        categoriesResponse.data?.data ||
        categoriesResponse.data ||
        [];

      setProducts(
        Array.isArray(books) ? books : []
      );

      setCategories(
        Array.isArray(categoryData)
          ? categoryData
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load products:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      author: "",
      description: "",
      price: "",
      stock: "",
      isbn: "",
      imageUrl: "",
      publishedDate: "",
      categoryId: "",
    });
  };

  const openAdd = () => {
    setEditingId(null);
    resetForm();
    setOpen(true);
  };

  const openEdit = (book) => {
    setEditingId(book.id);

    setForm({
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      price: book.price ?? "",
      stock: book.stock ?? "",
      isbn: book.isbn || "",
      imageUrl: book.imageUrl || "",
      publishedDate: book.publishedDate
        ? book.publishedDate.substring(0, 10)
        : "",
      categoryId: book.categoryId || "",
    });

    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        "/CloudinaryTest/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(
        "CLOUDINARY RESPONSE:",
        response.data
      );

      const imageUrl =
        response.data?.imageUrl;

      if (!imageUrl) {
        throw new Error(
          "Image URL was not returned."
        );
      }

      setForm((prev) => ({
        ...prev,
        imageUrl,
      }));
    } catch (error) {
      console.error(
        "Image upload failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        isbn: form.isbn.trim(),
        imageUrl: form.imageUrl,
        publishedDate: form.publishedDate,
        categoryId: form.categoryId,
      };

      console.log(
        "BOOK PAYLOAD:",
        payload
      );

      if (editingId) {
        const response = await api.put(
          `/Book/${editingId}`,
          payload
        );

        console.log(
          "UPDATE BOOK RESPONSE:",
          response.data
        );
      } else {
        const response = await api.post(
          "/Book",
          payload
        );

        console.log(
          "CREATE BOOK RESPONSE:",
          response.data
        );
      }

      setOpen(false);
      resetForm();

      await loadData();
    } catch (error) {
      console.error(
        "Failed to save book:",
        error
      );

      console.error(
        "BACKEND ERROR:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          error.response?.data?.title ||
          "Failed to save book."
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    const confirmed = window.confirm(
      "Delete this book?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/Book/${id}`);

      setProducts((prev) =>
        prev.filter(
          (product) => product.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete book:",
        error
      );

      console.error(
        "DELETE ERROR:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete book."
      );
    }
  };

  const filteredProducts = products.filter((book) => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return true;

    return (
      book.title?.toLowerCase().includes(term) ||
      book.author?.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const lastIndex = currentPage * ITEMS_PER_PAGE;
  const firstIndex = lastIndex - ITEMS_PER_PAGE;

  const paginatedProducts = filteredProducts.slice(
    firstIndex,
    lastIndex
  );

  const totalPages = Math.ceil(
    filteredProducts.length / ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <p className="text-lg font-bold text-[#153448]">
        Loading products…
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#153448]">
            Products
          </h1>

          <p className="text-[#3C5B6F] font-semibold mt-1">
            Manage your bookstore inventory
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#3C5B6F] text-white px-4 py-2 rounded-xl font-bold hover:opacity-90"
        >
          <Plus size={18} />

          Add Product
        </button>
      </div>

      <div className="relative mb-4 w-full sm:w-80">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3C5B6F]"
          size={18}
        />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title or author..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#948979]/40
                     bg-white/60 font-semibold text-[#153448]
                     focus:outline-none focus:border-[#3C5B6F]"
        />
      </div>

      <div className="bg-white/60 rounded-xl border border-[#948979]/30 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#153448] text-white">
            <tr>
              <th className="p-4">
                Image
              </th>

              <th className="p-4">
                Title
              </th>

              <th className="p-4">
                Author
              </th>

              <th className="p-4">
                Category
              </th>

              <th className="p-4">
                Price
              </th>

              <th className="p-4">
                Stock
              </th>

              <th className="p-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-6 text-center font-bold text-[#3C5B6F]"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((book) => (
              <tr
                key={book.id}
                className="border-t border-[#948979]/30 hover:bg-white/40"
              >
                <td className="p-4">
                  <img
                    src={
                      book.imageUrl ||
                      "/placeholder.png"
                    }
                    alt={book.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </td>

                <td className="p-4 font-bold text-[#153448]">
                  {book.title}
                </td>

                <td className="p-4">
                  {book.author}
                </td>

                <td className="p-4">
                  {book.categoryName ||
                    categories.find(
                      (category) =>
                        category.id ===
                        book.categoryId
                    )?.name ||
                    "-"}
                </td>

                <td className="p-4 font-bold">
                  ₹{book.price}
                </td>

                <td className="p-4">
                  {book.stock}
                </td>

                <td className="p-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        openEdit(book)
                      }
                      className="text-blue-600 hover:underline"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() =>
                        remove(book.id)
                      }
                      className="text-red-600 hover:underline"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={submit}
            className="bg-[#DFD0B8] p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-extrabold mb-5 text-[#153448]">
              {editingId
                ? "Edit Product"
                : "Add Product"}
            </h2>

            <input
              name="title"
              className="w-full mb-3 p-3 rounded-lg"
              placeholder="Book Title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <input
              name="author"
              className="w-full mb-3 p-3 rounded-lg"
              placeholder="Author"
              value={form.author}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              className="w-full mb-3 p-3 rounded-lg"
              placeholder="Description"
              rows="4"
              value={form.description}
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                className="w-full mb-3 p-3 rounded-lg"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
              />

              <input
                name="stock"
                type="number"
                min="0"
                className="w-full mb-3 p-3 rounded-lg"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </div>

            <input
              name="isbn"
              className="w-full mb-3 p-3 rounded-lg"
              placeholder="ISBN"
              value={form.isbn}
              onChange={handleChange}
              required
            />

            <select
              name="categoryId"
              className="w-full mb-3 p-3 rounded-lg"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Category
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>

            <input
              name="publishedDate"
              type="date"
              className="w-full mb-3 p-3 rounded-lg"
              value={form.publishedDate}
              onChange={handleChange}
              required
            />

            <div className="mb-4">
              <label className="block font-bold mb-2 text-[#153448]">
                Book Image
              </label>

              <label className="flex items-center justify-center gap-2 cursor-pointer bg-white p-3 rounded-lg border-2 border-dashed border-[#3C5B6F]">
                <Upload size={18} />

                {uploading
                  ? "Uploading..."
                  : "Choose Image"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageUpload
                  }
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              {form.imageUrl && (
                <div className="mt-3">
                  <img
                    src={form.imageUrl}
                    alt="Book preview"
                    className="w-24 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="px-4 py-2 font-bold"
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  saving || uploading
                }
                className="px-5 py-2 bg-[#153448] text-white rounded-lg font-bold disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Book"
                  : "Save Book"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;