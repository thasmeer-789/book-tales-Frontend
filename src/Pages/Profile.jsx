import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Package,
  LogOut,
  Calendar,
  Trophy,
  Pencil,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import api from "../api/api";

const Profile = () => {
  const navigate = useNavigate();

  const { user, logout, loading } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);

  const [profileLoading, setProfileLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        setProfileLoading(true);

        const response = await api.get("/Profile");

        console.log("PROFILE RESPONSE:", response.data);

        const profileData = response.data?.data;

        setProfile(profileData);

        if (profileData) {
          setEditedFirstName(profileData.firstName || "");
          setEditedLastName(profileData.lastName || "");
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      try {
        setOrdersLoading(true);

        const response = await api.get("/Order");

        console.log("PROFILE ORDERS RESPONSE:", response.data);

        setOrders(response.data?.data || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!editedFirstName.trim() || !editedLastName.trim()) {
      return;
    }

    try {
      setSaving(true);

      const response = await api.put("/Profile", {
        firstName: editedFirstName.trim(),
        lastName: editedLastName.trim(),
      });

      console.log("UPDATED PROFILE:", response.data);

      setProfile(response.data?.data);

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (
    loading ||
    profileLoading ||
    ordersLoading
  ) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-xl font-bold">
          LOADING PROFILE...
        </p>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const totalOrders = orders.length;

  const totalSpent = orders.reduce(
    (sum, order) =>
      sum + Number(order.totalAmount || 0),
    0
  );

  const cartItemsCount = cart.reduce(
    (sum, item) =>
      sum + Number(item.qty || 0),
    0
  );

  const wishlistCount = wishlist.length;

  const recentOrders = orders.slice(0, 3);

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

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const initials =
    `${profile.firstName?.charAt(0) || ""}${profile.lastName?.charAt(0) || ""}`
      .toUpperCase();

  return (
    <div className="space-y-8 pb-16">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-4xl font-extrabold">
            MY PROFILE
          </h1>

          <p className="text-gray-400">
            Your comic journey
          </p>
        </div>

        <button
          onClick={logout}
          className="px-6 py-2 bg-red-600 text-white
                     font-bold border-4 border-black
                     rounded-xl shadow-[4px_4px_0_#000]"
        >
          <LogOut className="inline mr-2" />
          LOGOUT
        </button>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        <div className="space-y-6">

          <div
            className="border-4 border-black
                       rounded-2xl bg-black p-6
                       text-center shadow-[8px_8px_0_#000]"
          >

            <div
              className="w-24 h-24 mx-auto mb-4
                         rounded-full bg-yellow-400
                         flex items-center justify-center
                         border-4 border-white"
            >
              <span className="text-3xl font-extrabold text-black">
                {initials}
              </span>
            </div>

            {!isEditing ? (
              <h2 className="text-2xl font-bold">
                {profile.firstName}{" "}
                {profile.lastName}
              </h2>
            ) : (
              <div className="space-y-3">

                <input
                  value={editedFirstName}
                  onChange={(e) =>
                    setEditedFirstName(e.target.value)
                  }
                  placeholder="First name"
                  className="w-full text-center
                             text-lg font-bold
                             bg-gray-800
                             border-2 border-yellow-400
                             rounded-lg px-3 py-2
                             text-white
                             focus:outline-none"
                />

                <input
                  value={editedLastName}
                  onChange={(e) =>
                    setEditedLastName(e.target.value)
                  }
                  placeholder="Last name"
                  className="w-full text-center
                             text-lg font-bold
                             bg-gray-800
                             border-2 border-yellow-400
                             rounded-lg px-3 py-2
                             text-white
                             focus:outline-none"
                />

              </div>
            )}

            <p
              className="flex justify-center
                         items-center gap-2
                         text-gray-400 mt-3"
            >
              <Mail className="w-4 h-4" />
              {profile.email}
            </p>

            {profile.phoneNumber && (
              <p
                className="flex justify-center
                           items-center gap-2
                           text-gray-400 mt-2"
              >
                <Phone className="w-4 h-4" />
                {profile.phoneNumber}
              </p>
            )}

            <div className="mt-5 flex gap-3 justify-center">

              {!isEditing ? (

                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2
                             bg-yellow-400 text-black
                             font-bold border-2 border-black
                             rounded-lg
                             shadow-[3px_3px_0_#000]"
                >
                  <Pencil className="inline w-4 h-4 mr-1" />
                  EDIT PROFILE
                </button>

              ) : (

                <>
                  <button
                    disabled={saving}
                    onClick={handleSaveProfile}
                    className="px-4 py-2
                               bg-green-500 text-black
                               font-bold border-2 border-black
                               rounded-lg
                               shadow-[3px_3px_0_#000]
                               disabled:opacity-50"
                  >
                    {saving ? "SAVING..." : "SAVE"}
                  </button>

                  <button
                    disabled={saving}
                    onClick={() => {
                      setEditedFirstName(
                        profile.firstName || ""
                      );

                      setEditedLastName(
                        profile.lastName || ""
                      );

                      setIsEditing(false);
                    }}
                    className="px-4 py-2
                               bg-red-500 text-black
                               font-bold border-2 border-black
                               rounded-lg
                               shadow-[3px_3px_0_#000]"
                  >
                    CANCEL
                  </button>
                </>

              )}

            </div>

          </div>

          <div
            className="border-4 border-black
                       rounded-2xl bg-black p-6
                       shadow-[8px_8px_0_#000]"
          >

            <h3
              className="text-xl font-extrabold
                         flex items-center gap-2 mb-6"
            >
              <Trophy className="text-yellow-400" />
              COLLECTOR STATS
            </h3>

            <Stat
              label="Total Orders"
              value={totalOrders}
            />

            <Stat
              label="Total Spent"
              value={`₹${totalSpent.toFixed(2)}`}
            />

            <Stat
              label="Cart Items"
              value={cartItemsCount}
            />

            <Stat
              label="Wishlist"
              value={wishlistCount}
            />

          </div>

        </div>

        <div
          className="lg:col-span-2
                     border-4 border-black
                     rounded-2xl bg-black p-6
                     shadow-[8px_8px_0_#000]"
        >

          <div
            className="flex justify-between
                       items-center mb-6"
          >

            <h3
              className="text-2xl font-extrabold
                         flex items-center gap-2"
            >
              <Package />
              RECENT ORDERS
            </h3>

            <span
              className="bg-yellow-400
                         text-black px-3 py-1
                         font-bold rounded-full"
            >
              {totalOrders}
            </span>

          </div>

          {recentOrders.length === 0 ? (

            <div className="text-center py-12">

              <p className="font-bold">
                No orders yet
              </p>

              <button
                onClick={() => navigate("/")}
                className="mt-5 px-5 py-2
                           bg-yellow-400 text-black
                           font-bold border-2 border-black
                           rounded-lg
                           shadow-[3px_3px_0_#000]"
              >
                START SHOPPING
              </button>

            </div>

          ) : (

            <div className="space-y-4">

              {recentOrders.map((order) => (

                <div
                  key={order.id}
                  className="border-2 border-gray-700
                             rounded-xl p-4"
                >

                  <div
                    className="flex justify-between
                               items-center mb-2"
                  >

                    <span className="font-bold">
                      ORDER #{order.id}
                    </span>

                    <span className="font-bold">
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toFixed(2)}
                    </span>

                  </div>

                  <div
                    className="flex items-center
                               justify-between
                               mb-2"
                  >
                    <span
                      className="flex items-center
                                 gap-2 text-sm
                                 text-gray-400"
                    >
                      <Calendar className="w-4 h-4" />

                      {formatDate(order.orderDate)}
                    </span>

                    <span
                      className="px-3 py-1 text-xs font-bold
                                 rounded-full bg-yellow-400
                                 text-black"
                    >
                      {getOrderStatus(order.status)}
                    </span>
                  </div>

                </div>

              ))}

            </div>

          )}

          {orders.length > 3 && (

            <div className="text-center mt-6">

              <button
                onClick={() => navigate("/orders")}
                className="px-6 py-3
                           bg-blue-500 text-black
                           font-bold border-4 border-black
                           rounded-xl
                           shadow-[4px_4px_0_#000]"
              >
                VIEW ALL ORDERS
              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="flex justify-between items-center mb-3">
    <span className="text-gray-400">
      {label}
    </span>

    <span className="text-xl font-bold">
      {value}
    </span>
  </div>
);

export default Profile;