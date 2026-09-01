import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import { MapPin, CreditCard } from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  if (!order) {
    return (
      <div className="text-center py-32 font-bold">
        Loading order...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-16 space-y-10">

      <h1 className="text-5xl font-extrabold tracking-widest">
        ORDER DETAILS
      </h1>

      {/* ITEMS */}
      <div className="bg-white border-4 border-black
                      rounded-2xl p-6
                      shadow-[6px_6px_0_#000] space-y-3">

        <h2 className="text-2xl font-extrabold">
          Items
        </h2>

        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between font-bold border-b pb-2"
          >
            <span>Product ID: {item.productId}</span>
            <span>Qty: {item.qty}</span>
          </div>
        ))}
      </div>

      {/* ADDRESS */}
      <div className="bg-white border-4 border-black
                      rounded-2xl p-6
                      shadow-[6px_6px_0_#000] space-y-2">

        <h2 className="text-2xl font-extrabold flex items-center gap-2">
          <MapPin /> Delivery Address
        </h2>

        <p className="font-bold">
          {order.address.name}, {order.address.street},
          {order.address.city}, {order.address.state} - {order.address.pincode}
        </p>
      </div>

      {/* PAYMENT */}
      <div className="bg-white border-4 border-black
                      rounded-2xl p-6
                      shadow-[6px_6px_0_#000] space-y-2">

        <h2 className="text-2xl font-extrabold flex items-center gap-2">
          <CreditCard /> Payment
        </h2>

        <p className="font-bold">
          Method: {order.paymentMethod}
        </p>
        <p className="font-bold">
          Total Paid: ₹{order.total}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
