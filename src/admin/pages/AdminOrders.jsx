import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "../../api/api";
import Pagination from "../../Components/Pagination";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/Order/admin");

      console.log("ADMIN ORDERS:", res.data);

      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/Order/${id}/status`, {
        status: Number(status)
      });

      console.log("ORDER STATUS UPDATED");

      await loadOrders();
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error.response?.data || error
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return true;

    return String(order.id).toLowerCase().includes(term);
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const lastIndex = currentPage * ITEMS_PER_PAGE;
  const firstIndex = lastIndex - ITEMS_PER_PAGE;

  const paginatedOrders = filteredOrders.slice(
    firstIndex,
    lastIndex
  );

  const totalPages = Math.ceil(
    filteredOrders.length / ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-[#153448] mb-6">
        Orders
      </h1>

      <div className="relative mb-4 w-full sm:w-80">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3C5B6F]"
          size={18}
        />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by order ID..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#948979]/40
                     bg-white/60 font-semibold text-[#153448]
                     focus:outline-none focus:border-[#3C5B6F]"
        />
      </div>

      {paginatedOrders.length === 0 ? (
        <p className="text-[#3C5B6F] font-bold">No orders found.</p>
      ) : (
        <>
          {paginatedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white/60 p-4 rounded mb-4"
            >
              <p className="font-bold text-[#153448]">
                Order #{order.id}
              </p>

              <p className="text-sm">
                Total: ₹{order.totalAmount}
              </p>

              <p className="text-sm">
                Current Status: {order.status}
              </p>

              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order.id, e.target.value)
                }
                className="mt-2 border rounded px-2 py-1"
              >
                <option value="1">Pending</option>
                <option value="2">Confirmed</option>
                <option value="3">Shipped</option>
                <option value="4">Delivered</option>
                <option value="5">Cancelled</option>
              </select>
            </div>
          ))}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminOrders;