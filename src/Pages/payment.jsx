import { Lock, MapPin, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCheckout } from "../context/checkoutContext";
import api from "../api/api";

const Payment = () => {
  const {
    clearCart,
    getCartTotal,
    getCartItemsWithDetails,
  } = useCart();

  const { user, isAuthenticated } = useAuth();

  const {
    addresses,
    selectedAddressId,
    placeOrder,
  } = useCheckout();

  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  // =========================
  // LOAD RAZORPAY SCRIPT
  // =========================

  useEffect(() => {
    if (window.Razorpay) {
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // =========================
  // AUTH CHECK
  // =========================

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // =========================
  // SELECTED ADDRESS
  // =========================

  const address = addresses.find(
    (a) => a.id === selectedAddressId
  );

  useEffect(() => {
    if (
      isAuthenticated &&
      addresses.length > 0 &&
      !address
    ) {
      navigate("/checkout");
    }
  }, [
    isAuthenticated,
    addresses,
    address,
    navigate,
  ]);

  // =========================
  // TOTAL
  // =========================

  const total = getCartTotal();

  // =========================
  // PLACE ORDER + PAYMENT
  // =========================

  const handlePlaceOrder = async () => {
    if (isProcessing) {
      return;
    }

    if (!user) {
      toast.error("User not found.");
      return;
    }

    if (!address) {
      toast.error("Please select a delivery address.");
      navigate("/checkout");
      return;
    }

    const cartItems =
      getCartItemsWithDetails();

    if (!cartItems || cartItems.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    // Razorpay must be loaded
    if (!window.Razorpay) {
      toast.error(
        "Razorpay is still loading. Please try again."
      );
      return;
    }

    try {
      setIsProcessing(true);

      // =========================
      // 1. CREATE BOOKTALES ORDER
      // =========================

      const order = await placeOrder(cartItems);

      if (!order) {
        setIsProcessing(false);
        return;
      }

      console.log(
        "BOOKTALES ORDER:",
        order
      );

      // =========================
      // 2. CREATE RAZORPAY ORDER
      // =========================

      const paymentOrderResponse =
        await api.post(
          "/Payment/create-order",
          {
            orderId: order.id,
          }
        );

      const paymentOrder =
        paymentOrderResponse.data;

      console.log(
        "RAZORPAY ORDER:",
        paymentOrder
      );

      if (
        !paymentOrder ||
        !paymentOrder.razorpayOrderId
      ) {
        throw new Error(
          "Invalid Razorpay order response."
        );
      }

      // =========================
      // 3. OPEN RAZORPAY CHECKOUT
      // =========================

      const options = {
        key: paymentOrder.keyId,

        amount:
          paymentOrder.amount * 100,

        currency:
          paymentOrder.currency,

        name: "BookTales",

        description:
          "BookTales Book Purchase",

        order_id:
          paymentOrder.razorpayOrderId,

        prefill: {
          name: user.name || "",
          email: user.email || "",
        },

        theme: {
          color: "#FACC15",
        },

        // =========================
        // 4. PAYMENT SUCCESS
        // =========================

        handler: async (response) => {
          try {
            console.log(
              "RAZORPAY RESPONSE:",
              response
            );

            // =========================
            // 5. VERIFY PAYMENT
            // =========================

            const verifyResponse =
              await api.post(
                "/Payment/verify",
                {
                  orderId: order.id,

                  razorpayOrderId:
                    response.razorpay_order_id,

                  razorpayPaymentId:
                    response.razorpay_payment_id,

                  razorpaySignature:
                    response.razorpay_signature,
                }
              );

            console.log(
              "VERIFY RESPONSE:",
              verifyResponse.data
            );

            // =========================
            // 6. PAYMENT SUCCESS
            // =========================

            toast.success(
              "Payment successful!"
            );

            await clearCart();

            navigate(`/order-success/${order.id}`);
          } catch (error) {
            console.error(
              "Payment verification failed:",
              error
            );

            const message =
              error.response?.data?.message ||
              "Payment verification failed.";

            toast.error(message);

            setIsProcessing(false);
          }
        },

        // =========================
        // PAYMENT WINDOW CLOSED
        // =========================

        modal: {
          ondismiss: () => {
            toast.error(
              "Payment cancelled."
            );

            setIsProcessing(false);
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      // =========================
      // PAYMENT FAILED
      // =========================

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Payment failed:",
            response.error
          );

          toast.error(
            response.error?.description ||
              "Payment failed."
          );

          setIsProcessing(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Failed to start payment:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to start payment.";

      toast.error(message);

      setIsProcessing(false);
    }
  };

  // =========================
  // RENDER
  // =========================

  if (!isAuthenticated || !address) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-16 space-y-12">

      {/* HEADER */}

      <div className="text-center">
        <p className="font-extrabold text-yellow-400">
          STEP 2 OF 2
        </p>

        <h1 className="text-5xl font-extrabold">
          PAYMENT
        </h1>

        <p className="mt-3 font-bold text-gray-400">
          Secure payment powered by Razorpay
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* LEFT — RAZORPAY */}

        <div
          className="lg:col-span-2
                     bg-white text-black
                     border-4 border-black
                     rounded-2xl
                     p-8
                     shadow-[8px_8px_0_#000]"
        >
          <div className="flex items-center gap-4 mb-8">
            <div
              className="border-4 border-black
                         rounded-xl
                         p-3
                         bg-yellow-400"
            >
              <CreditCard />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold">
                Razorpay Payment
              </h2>

              <p className="text-gray-600 font-bold">
                Pay securely using UPI, Card,
                Net Banking or other Razorpay
                supported methods.
              </p>
            </div>
          </div>

          <div
            className="border-4 border-black
                       rounded-xl
                       p-6
                       space-y-4"
          >
            <h3 className="font-extrabold text-xl">
              How it works
            </h3>

            <div className="font-bold">
              1. Click "PAY WITH RAZORPAY"
            </div>

            <div className="font-bold">
              2. Razorpay Checkout will open
            </div>

            <div className="font-bold">
              3. Choose your payment method
            </div>

            <div className="font-bold">
              4. Complete the payment
            </div>

            <div className="font-bold">
              5. Your payment will be verified
              automatically
            </div>
          </div>
        </div>

        {/* RIGHT — ORDER SUMMARY */}

        <div
          className="bg-white text-black
                     border-4 border-black
                     rounded-2xl
                     p-6
                     shadow-[8px_8px_0_#000]
                     h-fit
                     space-y-6"
        >
          <h2 className="text-2xl font-extrabold">
            Order Summary
          </h2>

          {/* ADDRESS */}

          <div className="space-y-2">
            <h3
              className="font-bold
                         flex items-center gap-2"
            >
              <MapPin />
              Deliver To
            </h3>

           <p className="text-sm font-bold">
              {address.fullName},{" "}
              {address.addressLine},{" "}
              {address.city},{" "}
              {address.state} -{" "}
              {address.postalCode}
          </p>
          </div>

          {/* TOTAL */}

          <div
            className="flex justify-between
                       text-2xl
                       font-extrabold
                       border-t-4
                       border-black
                       pt-4"
          >
            <span>Total</span>

            <span>
              ₹{total}
            </span>
          </div>

          {/* SECURITY */}

          <div
            className="flex items-center
                       gap-2
                       text-sm
                       font-bold"
          >
            <Lock className="w-4 h-4" />

            100% secure & encrypted payment
          </div>

          {/* PAYMENT BUTTON */}

          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full
                       px-6
                       py-4
                       bg-yellow-400
                       text-black
                       border-4
                       border-black
                       rounded-xl
                       font-extrabold
                       shadow-[6px_6px_0_#000]
                       disabled:opacity-50
                       disabled:cursor-not-allowed"
          >
            {isProcessing
              ? "PROCESSING..."
              : "PAY WITH RAZORPAY"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;