import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  ArrowUpRight,
  TrendingUp,
  Trophy,
} from "lucide-react";
import api from "../../api/api";

/* ---------------- STAT CARD ---------------- */

const StatCard = ({ label, value, icon: Icon, hint }) => (
  <div className="relative bg-white/60 rounded-2xl p-6 border border-[#948979]/30 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-[#3C5B6F] uppercase tracking-wide">
          {label}
        </p>

        <p className="text-3xl font-extrabold text-[#153448] mt-2">
          {value}
        </p>
      </div>

      <div className="p-3 rounded-xl bg-[#3C5B6F]/10">
        <Icon className="text-[#153448]" />
      </div>
    </div>

    {hint && (
      <div className="flex items-center gap-1 mt-3 text-sm text-green-700 font-bold">
        <ArrowUpRight size={16} />
        {hint}
      </div>
    )}
  </div>
);

/* ---------------- DASHBOARD ---------------- */

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [salesReport, setSalesReport] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topSellingBooks, setTopSellingBooks] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          statisticsResponse,
          salesResponse,
          recentOrdersResponse,
          topBooksResponse,
        ] = await Promise.all([
          api.get("/Admin/dashboard/statistics"),
          api.get("/Admin/dashboard/sales-report"),
          api.get("/Admin/dashboard/recent-orders"),
          api.get("/Admin/dashboard/top-selling-books"),
        ]);

        console.log(
          "ADMIN STATISTICS:",
          statisticsResponse.data
        );

        console.log(
          "ADMIN SALES REPORT:",
          salesResponse.data
        );

        console.log(
          "ADMIN RECENT ORDERS:",
          recentOrdersResponse.data
        );

        console.log(
          "ADMIN TOP SELLING BOOKS:",
          topBooksResponse.data
        );

        setStats(
          statisticsResponse.data?.data ||
            statisticsResponse.data
        );

        setSalesReport(
          salesResponse.data?.data ||
            salesResponse.data
        );

        const recentOrders =
          recentOrdersResponse.data?.data ||
          recentOrdersResponse.data ||
          [];

        const topBooks =
          topBooksResponse.data?.data ||
          topBooksResponse.data ||
          [];

        setRecentOrders(
          Array.isArray(recentOrders)
            ? recentOrders
            : []
        );

        setTopSellingBooks(
          Array.isArray(topBooks)
            ? topBooks
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load admin dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="text-lg font-bold text-[#153448]">
        Loading dashboard…
      </div>
    );
  }

  /* ---------------- DASHBOARD ---------------- */

  return (
    <div className="space-y-10">

      {/* HEADER */}

      <div>
        <h1 className="text-4xl font-extrabold text-[#153448]">
          Admin Dashboard
        </h1>

        <p className="text-[#3C5B6F] font-semibold mt-1">
          Store overview & performance
        </p>
      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <StatCard
          label="Products"
          value={stats?.totalBooks ?? 0}
          icon={Package}
          hint="Inventory active"
        />

        <StatCard
          label="Orders"
          value={stats?.totalOrders ?? 0}
          icon={ShoppingCart}
          hint="Total orders"
        />

        <StatCard
          label="Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          hint="Registered users"
        />

        <StatCard
          label="Revenue"
          value={`₹${Number(
            stats?.totalRevenue ?? 0
          ).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}`}
          icon={IndianRupee}
          hint="Total earnings"
        />

      </div>

      {/* SALES REPORT */}

      {salesReport && (
        <div className="bg-white/60 rounded-2xl border border-[#948979]/30 p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-3 rounded-xl bg-[#3C5B6F]/10">
              <TrendingUp className="text-[#153448]" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#153448]">
                Sales Report
              </h2>

              <p className="text-sm text-[#3C5B6F] font-semibold">
                Store sales performance
              </p>
            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="bg-white rounded-xl p-4 border border-[#948979]/20">
              <p className="text-sm font-bold text-[#3C5B6F]">
                Total Revenue
              </p>

              <p className="text-2xl font-extrabold text-[#153448] mt-2">
                ₹
                {Number(
                  salesReport.totalRevenue ?? 0
                ).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#948979]/20">
              <p className="text-sm font-bold text-[#3C5B6F]">
                Total Orders
              </p>

              <p className="text-2xl font-extrabold text-[#153448] mt-2">
                {salesReport.totalOrders ?? 0}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#948979]/20">
              <p className="text-sm font-bold text-[#3C5B6F]">
                Paid Orders
              </p>

              <p className="text-2xl font-extrabold text-green-700 mt-2">
                {salesReport.paidOrders ?? 0}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#948979]/20">
              <p className="text-sm font-bold text-[#3C5B6F]">
                Average Order
              </p>

              <p className="text-2xl font-extrabold text-[#153448] mt-2">
                ₹
                {Number(
                  salesReport.averageOrderValue ?? 0
                ).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

          </div>
        </div>
      )}

       {/* TOP SELLING BOOKS */}

      <div className="bg-white/60 rounded-2xl border border-[#948979]/30 p-6">

        <div className="flex items-center gap-3 mb-6">

          <div className="p-3 rounded-xl bg-[#3C5B6F]/10">
            <Trophy className="text-[#153448]" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-[#153448]">
              Top Selling Books
            </h2>

            <p className="text-sm text-[#3C5B6F] font-semibold">
              Best performing books
            </p>
          </div>

        </div>

        {topSellingBooks.length === 0 ? (
          <p className="text-[#3C5B6F] font-semibold">
            No sales data available
          </p>
        ) : (
          <div className="space-y-3">

            {topSellingBooks.map((book, index) => (
              <div
                key={book.bookId}
                className="flex items-center justify-between bg-white rounded-xl p-4 border border-[#948979]/20"
              >

                <div className="flex items-center gap-4">

                  <div className="w-10 h-10 rounded-full bg-[#153448] text-white flex items-center justify-center font-extrabold">
                    {index + 1}
                  </div>

                  <div>

                    <p className="font-bold text-[#153448]">
                      {book.bookTitle}
                    </p>

                    <p className="text-sm text-[#3C5B6F]">
                      {book.totalQuantitySold ?? 0} copies sold
                    </p>

                  </div>

                </div>

                <p className="font-extrabold text-[#153448]">
                  ₹
                  {Number(
                    book.totalSales ?? 0
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* RECENT ORDERS */}

      <div className="bg-white/60 rounded-2xl border border-[#948979]/30 p-6">

        <h2 className="text-xl font-extrabold text-[#153448] mb-4">
          Recent Orders
        </h2>

        {recentOrders.length === 0 ? (
          <p className="text-[#3C5B6F] font-semibold">
            No orders yet
          </p>
        ) : (
          <div className="space-y-3">

            {recentOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-xl p-4 border border-[#948979]/20"
              >

                <div className="flex justify-between items-start gap-4">

                  <div>

                    <p className="font-bold text-[#153448]">
                      Order #
                      {order.orderId}
                    </p>

                    <p className="text-sm text-[#3C5B6F] mt-1">
                      {order.customerName}
                    </p>

                    <p className="text-xs text-[#3C5B6F] mt-1">
                      {order.orderDate
                        ? new Date(
                            order.orderDate
                          ).toLocaleDateString("en-IN")
                        : ""}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="font-extrabold text-[#153448]">
                      ₹
                      {Number(
                        order.totalAmount ?? 0
                      ).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </p>

                    <p className="text-xs font-bold text-[#3C5B6F] mt-1">
                      {order.status}
                    </p>

                    <p className="text-xs font-bold text-green-700 mt-1">
                      {order.paymentStatus}
                    </p>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default AdminDashboard;