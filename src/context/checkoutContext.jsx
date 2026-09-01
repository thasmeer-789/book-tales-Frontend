import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const { user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");

  const fetchAddresses = async () => {
    if (!user) {
      setAddresses([]);
      setSelectedAddressId(null);
      return;
    }

    try {
      const response = await api.get("/Address");

      console.log("ADDRESS RESPONSE:", response.data);

      const addressData =
        response.data?.data ||
        response.data ||
        [];

      const addressList = Array.isArray(addressData)
        ? addressData
        : [];

      setAddresses(addressList);

      const defaultAddress =
        addressList.find(
          (address) => address.isDefault
        );

      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (addressList.length > 0) {
        setSelectedAddressId(addressList[0].id);
      } else {
        setSelectedAddressId(null);
      }
    } catch (error) {
      console.error(
        "Failed to load addresses:",
        error
      );

      setAddresses([]);
      setSelectedAddressId(null);
    }
  };

  useEffect(() => {
    if (!user) {
      setAddresses([]);
      setSelectedAddressId(null);
      return;
    }

    fetchAddresses();
  }, [user]);

  const addAddress = async (form) => {
    if (!user) {
      toast.error("User not found");
      return false;
    }

    try {
      const payload = {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        addressLine: form.addressLine,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country || "India",
        isDefault: form.isDefault || false,
      };

      console.log(
        "CREATE ADDRESS PAYLOAD:",
        payload
      );

      const response = await api.post(
        "/Address",
        payload
      );

      console.log(
        "CREATE ADDRESS RESPONSE:",
        response.data
      );

      const createdAddress =
        response.data?.data;

      await fetchAddresses();

      if (createdAddress?.id) {
        setSelectedAddressId(
          createdAddress.id
        );
      }

      toast.success("Address added successfully");

      return true;
    } catch (error) {
      console.error(
        "Failed to add address:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to add address";

      toast.error(message);

      return false;
    }
  };

  const editAddress = async (
    id,
    form
  ) => {
    if (!user) {
      toast.error("User not found");
      return false;
    }

    try {
      const payload = {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        addressLine: form.addressLine,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country || "India",
        isDefault: form.isDefault || false,
      };

      console.log(
        "UPDATE ADDRESS PAYLOAD:",
        payload
      );

      const response = await api.put(
        `/Address/${id}`,
        payload
      );

      console.log(
        "UPDATE ADDRESS RESPONSE:",
        response.data
      );

      await fetchAddresses();

      toast.success(
        "Address updated successfully"
      );

      return true;
    } catch (error) {
      console.error(
        "Failed to update address:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to update address";

      toast.error(message);

      return false;
    }
  };

  const deleteAddress = async (id) => {
    if (!user) {
      toast.error("User not found");
      return false;
    }

    try {
      await api.delete(
        `/Address/${id}`
      );

      await fetchAddresses();

      toast.success(
        "Address deleted successfully"
      );

      return true;
    } catch (error) {
      console.error(
        "Failed to delete address:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to delete address";

      toast.error(message);

      return false;
    }
  };

  const placeOrder = async (
    cartItems
  ) => {
    if (!user) {
      toast.error("User not found");
      return null;
    }

    if (
      !cartItems ||
      cartItems.length === 0
    ) {
      toast.error("Cart is empty");
      return null;
    }

    try {
      const orderPayload = {
        userId: user.id,

        orderItems: cartItems.map(
          (item) => ({
            bookId:
              item.bookId ||
              item.productId,

            quantity:
              item.quantity ||
              item.qty,

            price: item.price,
          })
        ),
      };

      console.log(
        "ORDER PAYLOAD:",
        orderPayload
      );

      const response = await api.post(
        "/Order",
        orderPayload
      );

      console.log(
        "ORDER RESPONSE:",
        response.data
      );

      return response.data?.data;
    } catch (error) {
      console.error(
        "Failed to create order:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to create order";

      toast.error(message);

      return null;
    }
  };

  const createPaymentOrder = async (
    orderId
  ) => {
    if (!orderId) {
      toast.error("Order ID is missing");
      return null;
    }

    try {
      const response = await api.post(
        "/Payment/create-order",
        {
          orderId: orderId,
        }
      );

      console.log(
        "RAZORPAY ORDER RESPONSE:",
        response.data
      );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to create Razorpay order:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to create payment order";

      toast.error(message);

      return null;
    }
  };

  const verifyPayment = async ({
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  }) => {
    if (!orderId) {
      toast.error("Order ID is missing");
      return false;
    }

    if (!razorpayOrderId) {
      toast.error(
        "Razorpay Order ID is missing"
      );
      return false;
    }

    if (!razorpayPaymentId) {
      toast.error(
        "Razorpay Payment ID is missing"
      );
      return false;
    }

    if (!razorpaySignature) {
      toast.error(
        "Razorpay signature is missing"
      );
      return false;
    }

    try {
      const response = await api.post(
        "/Payment/verify",
        {
          orderId,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        }
      );

      console.log(
        "PAYMENT VERIFICATION RESPONSE:",
        response.data
      );

      toast.success(
        "Payment successful!"
      );

      return true;
    } catch (error) {
      console.error(
        "Payment verification failed:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Payment verification failed";

      toast.error(message);

      return false;
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        addresses,

        selectedAddressId,
        setSelectedAddressId,

        paymentMethod,
        setPaymentMethod,

        addAddress,
        editAddress,
        deleteAddress,

        placeOrder,
        createPaymentOrder,
        verifyPayment,

        fetchAddresses,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () =>
  useContext(CheckoutContext);