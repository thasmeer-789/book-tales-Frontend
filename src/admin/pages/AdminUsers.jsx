import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import api from "../../api/api";
import Pagination from "../../Components/Pagination";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/User");

      console.log("USERS RESPONSE:", response.data);

      const userList = response.data?.data || [];

      setUsers(userList);
    } catch (error) {
      console.error("Failed to load users:", error);

      const message =
        error.response?.data?.message || "Failed to load users";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlock = async (id) => {
    try {
      setActionLoadingId(id);

      const response = await api.put(`/User/${id}/block`);

      console.log("BLOCK RESPONSE:", response.data);

      toast.success("User blocked successfully");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, isBlocked: true } : u
        )
      );
    } catch (error) {
      console.error("Failed to block user:", error);

      const message =
        error.response?.data?.message || "Failed to block user";

      toast.error(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUnblock = async (id) => {
    try {
      setActionLoadingId(id);

      const response = await api.put(`/User/${id}/unblock`);

      console.log("UNBLOCK RESPONSE:", response.data);

      toast.success("User unblocked successfully");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, isBlocked: false } : u
        )
      );
    } catch (error) {
      console.error("Failed to unblock user:", error);

      const message =
        error.response?.data?.message || "Failed to unblock user";

      toast.error(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return true;

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();

    return (
      fullName.includes(term) ||
      user.email?.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const lastIndex = currentPage * ITEMS_PER_PAGE;
  const firstIndex = lastIndex - ITEMS_PER_PAGE;

  const paginatedUsers = filteredUsers.slice(
    firstIndex,
    lastIndex
  );

  const totalPages = Math.ceil(
    filteredUsers.length / ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-[#153448] mb-6">
        Users
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
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#948979]/40
                     bg-white/60 font-semibold text-[#153448]
                     focus:outline-none focus:border-[#3C5B6F]"
        />
      </div>

      {loading ? (
        <p className="text-[#3C5B6F] font-bold">Loading users...</p>
      ) : paginatedUsers.length === 0 ? (
        <p className="text-[#3C5B6F] font-bold">No users found.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {paginatedUsers.map((user) => (
              <li
                key={user.id}
                className="bg-white/60 p-4 rounded flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-bold text-[#153448]">
                    {user.firstName} {user.lastName} — {user.email}
                  </p>

                  <p className="text-sm text-[#3C5B6F]">
                    ID: {user.id}
                  </p>

                  <p className="text-sm font-bold">
                    Status:{" "}
                    <span
                      className={
                        user.isBlocked
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </p>
                </div>

                {user.isBlocked ? (
                  <button
                    onClick={() => handleUnblock(user.id)}
                    disabled={actionLoadingId === user.id}
                    className="px-4 py-2 rounded bg-green-500 text-white font-bold disabled:opacity-50"
                  >
                    {actionLoadingId === user.id ? "..." : "Unblock"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleBlock(user.id)}
                    disabled={actionLoadingId === user.id}
                    className="px-4 py-2 rounded bg-red-500 text-white font-bold disabled:opacity-50"
                  >
                    {actionLoadingId === user.id ? "..." : "Block"}
                  </button>
                )}
              </li>
            ))}
          </ul>

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

export default AdminUsers;