import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag, MapPin, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCheckout } from "../context/checkoutContext";

const Checkout = () => {
  const {
    getCartItemsWithDetails,
    getCartTotal,
    cart: rawCart,
  } = useCart();

  const { isAuthenticated } = useAuth();

  const {
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    addAddress,
    editAddress,
    deleteAddress,
  } = useCheckout();

  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // =====================================================
  // ADDRESS FORM
  // =====================================================

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  // =====================================================
  // AUTH GUARD
  // =====================================================

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (!isAuthenticated) {
    return null;
  }

  if (rawCart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <ShoppingBag className="w-16 h-16 text-gray-400" />

        <h2 className="text-3xl font-extrabold">
          Your cart is empty
        </h2>

        <Link
          to="/"
          className="px-6 py-3 bg-yellow-400 border-4 border-black
                     rounded-xl font-bold shadow-[4px_4px_0_#000]"
        >
          GO SHOPPING
        </Link>
      </div>
    );
  }

  // =====================================================
  // CART DETAILS
  // =====================================================

  const cartItemsWithDetails = getCartItemsWithDetails();
  const total = getCartTotal();

  // =====================================================
  // CONTINUE TO PAYMENT
  // =====================================================

  const handleContinue = () => {
    if (!selectedAddressId) {
      toast.error("Select a delivery address");
      return;
    }

    navigate("/payment");
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setForm({
      fullName: "",
      phoneNumber: "",
      addressLine: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isDefault: false,
    });

    setEditingId(null);
    setShowForm(false);
  };

  // =====================================================
  // EDIT ADDRESS
  // =====================================================

  const handleEdit = (address) => {
    setEditingId(address.id);

    setForm({
      fullName: address.fullName || "",
      phoneNumber: address.phoneNumber || "",
      addressLine: address.addressLine || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "India",
      isDefault: address.isDefault || false,
    });

    setShowForm(true);
  };

  // =====================================================
  // SAVE ADDRESS
  // =====================================================

  const handleSaveAddress = async () => {
    if (
      !form.fullName ||
      !form.phoneNumber ||
      !form.addressLine ||
      !form.city ||
      !form.state ||
      !form.postalCode ||
      !form.country
    ) {
      toast.error("Fill all address fields");
      return;
    }

    let success = false;

    if (editingId) {
      success = await editAddress(
        editingId,
        form
      );
    } else {
      success = await addAddress(form);
    }

    if (success) {
      resetForm();
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="max-w-7xl mx-auto py-16 space-y-12">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="text-center">
        <p className="font-extrabold text-yellow-400">
          STEP 1 OF 2
        </p>

        <h1 className="text-5xl font-extrabold">
          DELIVERY
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="lg:col-span-2 space-y-8">

          {/* =================================================
              ADDRESS LIST
          ================================================= */}

          <div
            className="bg-white text-black border-4 border-black
                       rounded-2xl p-6 shadow-[8px_8px_0_#000]"
          >

            <h2
              className="text-2xl font-extrabold flex
                         items-center gap-2 mb-6"
            >
              <MapPin />
              Delivery Address
            </h2>

            {/* NO ADDRESS */}

            {addresses.length === 0 && (
              <div
                className="border-4 border-dashed border-gray-400
                           rounded-xl p-6 text-center mb-6"
              >
                <p className="font-bold text-gray-500">
                  No address added yet.
                </p>
              </div>
            )}

            {/* ADDRESS CARDS */}

            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`border-4 rounded-xl p-4 mb-4 font-bold
                  ${
                    selectedAddressId === addr.id
                      ? "border-black bg-yellow-100"
                      : "border-gray-300 bg-white"
                  }`}
              >

                {/* ADDRESS SELECT */}

                <label className="cursor-pointer block">

                  <div className="flex items-start gap-3">

                    <input
                      type="radio"
                      className="mt-1"
                      checked={
                        selectedAddressId === addr.id
                      }
                      onChange={() =>
                        setSelectedAddressId(addr.id)
                      }
                    />

                    <div className="flex-1">

                      <div className="flex items-center gap-3 flex-wrap">

                        <p className="font-extrabold text-lg">
                          {addr.fullName}
                        </p>

                        {addr.isDefault && (
                          <span
                            className="px-2 py-1 text-xs
                                       bg-green-400 border-2
                                       border-black rounded
                                       font-extrabold"
                          >
                            DEFAULT
                          </span>
                        )}

                      </div>

                      <p className="text-sm mt-1">
                        {addr.phoneNumber}
                      </p>

                      <p className="text-sm mt-2">
                        {addr.addressLine}
                      </p>

                      <p className="text-sm">
                        {addr.city}, {addr.state} -{" "}
                        {addr.postalCode}
                      </p>

                      <p className="text-sm">
                        {addr.country}
                      </p>

                    </div>

                  </div>

                </label>

                {/* EDIT / DELETE */}

                <div className="flex gap-3 mt-4 ml-7">

                  <button
                    onClick={() =>
                      handleEdit(addr)
                    }
                    className="px-3 py-1 bg-yellow-400
                               border-2 border-black rounded
                               font-bold shadow-[2px_2px_0_#000]"
                  >
                    EDIT
                  </button>

                  <button
                    onClick={() =>
                      deleteAddress(addr.id)
                    }
                    className="px-3 py-1 bg-red-500
                               text-white border-2 border-black
                               rounded font-bold
                               shadow-[2px_2px_0_#000]"
                  >
                    DELETE
                  </button>

                </div>

              </div>
            ))}

            {/* ADD ADDRESS BUTTON */}

            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 mt-4
                         px-4 py-2 bg-blue-500 text-white
                         border-4 border-black rounded-xl
                         font-bold shadow-[4px_4px_0_#000]"
            >
              <Plus />
              Add New Address
            </button>

          </div>

          {/* =================================================
              ADDRESS FORM
          ================================================= */}

          {showForm && (
            <div
              className="bg-white text-black border-4 border-black
                         rounded-2xl p-6 shadow-[8px_8px_0_#000]
                         space-y-5"
            >

              <h2 className="text-2xl font-extrabold">
                {editingId
                  ? "Edit Address"
                  : "Add New Address"}
              </h2>

              {/* FULL NAME */}

              <input
                type="text"
                placeholder="FULL NAME"
                className="w-full p-3 border-4 border-black
                           rounded-xl font-bold"
                value={form.fullName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fullName: e.target.value,
                  })
                }
              />

              {/* PHONE */}

              <input
                type="tel"
                placeholder="PHONE NUMBER"
                className="w-full p-3 border-4 border-black
                           rounded-xl font-bold"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phoneNumber: e.target.value,
                  })
                }
              />

              {/* ADDRESS */}

              <textarea
                placeholder="ADDRESS"
                rows="3"
                className="w-full p-3 border-4 border-black
                           rounded-xl font-bold resize-none"
                value={form.addressLine}
                onChange={(e) =>
                  setForm({
                    ...form,
                    addressLine: e.target.value,
                  })
                }
              />

              {/* CITY */}

              <input
                type="text"
                placeholder="CITY"
                className="w-full p-3 border-4 border-black
                           rounded-xl font-bold"
                value={form.city}
                onChange={(e) =>
                  setForm({
                    ...form,
                    city: e.target.value,
                  })
                }
              />

              {/* STATE */}

              <input
                type="text"
                placeholder="STATE"
                className="w-full p-3 border-4 border-black
                           rounded-xl font-bold"
                value={form.state}
                onChange={(e) =>
                  setForm({
                    ...form,
                    state: e.target.value,
                  })
                }
              />

              {/* POSTAL CODE */}

              <input
                type="text"
                placeholder="POSTAL CODE"
                className="w-full p-3 border-4 border-black
                           rounded-xl font-bold"
                value={form.postalCode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    postalCode: e.target.value,
                  })
                }
              />

              {/* COUNTRY */}

              <input
                type="text"
                placeholder="COUNTRY"
                className="w-full p-3 border-4 border-black
                           rounded-xl font-bold"
                value={form.country}
                onChange={(e) =>
                  setForm({
                    ...form,
                    country: e.target.value,
                  })
                }
              />

              {/* DEFAULT ADDRESS */}

              <label className="flex items-center gap-3 font-bold">

                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isDefault: e.target.checked,
                    })
                  }
                  className="w-5 h-5"
                />

                Set as default address

              </label>

              {/* BUTTONS */}

              <div className="flex gap-4">

                <button
                  onClick={handleSaveAddress}
                  className="px-6 py-3 bg-green-500
                             text-black border-4 border-black
                             rounded-xl font-bold
                             shadow-[4px_4px_0_#000]"
                >
                  SAVE ADDRESS
                </button>

                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-300
                             text-black border-4 border-black
                             rounded-xl font-bold
                             shadow-[4px_4px_0_#000]"
                >
                  CANCEL
                </button>

              </div>

            </div>
          )}

        </div>

        {/* =================================================
            ORDER SUMMARY
        ================================================= */}

        <div
          className="bg-white text-black border-4 border-black
                     rounded-2xl p-6 shadow-[8px_8px_0_#000]
                     h-fit space-y-6"
        >

          <h2 className="text-2xl font-extrabold">
            Order Summary
          </h2>

          {/* CART ITEMS */}

          <div
            className="space-y-3 max-h-60
                       overflow-y-auto pr-2"
          >

            {cartItemsWithDetails.map((item, index) => (
              <div
                key={index}
                className="flex justify-between
                           items-center py-2 border-b"
              >

                <div>

                  <p className="font-bold text-sm">
                    {item.title}
                  </p>

                  <p className="text-xs text-gray-600">
                    Qty: {item.qty}
                  </p>

                </div>

                <p className="font-bold">
                  ₹{item.qty * item.price}
                </p>

              </div>
            ))}

          </div>

          {/* ITEM COUNT */}

          <div className="flex justify-between font-bold">
            <span>Items</span>
            <span>
              {cartItemsWithDetails.length}
            </span>
          </div>

          {/* TOTAL */}

          <div
            className="flex justify-between text-2xl
                       font-extrabold border-t pt-4"
          >
            <span>Total</span>

            <span>
              ₹{total}
            </span>
          </div>

          {/* CONTINUE */}

          <button
            onClick={handleContinue}
            className="w-full px-6 py-4 bg-green-500
                       text-black border-4 border-black
                       rounded-xl font-extrabold
                       shadow-[6px_6px_0_#000]"
          >
            CONTINUE TO PAYMENT

            <ArrowRight
              className="inline ml-2"
            />

          </button>

        </div>

      </div>

    </div>
  );
};

export default Checkout;