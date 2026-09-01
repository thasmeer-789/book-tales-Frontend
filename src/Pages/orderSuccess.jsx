import { useParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-6 text-center">
      <CheckCircle className="w-20 h-20 text-green-500" />
      <h1 className="text-4xl font-extrabold">
        Order Placed Successfully 🎉
      </h1>
      <p className="font-bold text-gray-500">
        Order ID: <span className="text-black">{id}</span>
      </p>

      <div className="flex gap-4">
        <Link
          to="/orders"
          className="px-6 py-3 bg-yellow-400 border-4 border-black
                     rounded-xl font-bold shadow-[4px_4px_0_#000]"
        >
          VIEW ORDERS
        </Link>

        <Link
          to="/"
          className="px-6 py-3 bg-blue-500 text-white border-4 border-black
                     rounded-xl font-bold shadow-[4px_4px_0_#000]"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
