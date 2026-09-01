import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/api";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const verifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP.");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please register again.");
      navigate("/register");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post(
        "/Auth/verify-registration-otp",
        {
          email,
          otp,
        }
      );

      if (data.success) {
        toast.success(
          data.message || "Email verified successfully!"
        );

        navigate("/login");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Invalid or expired OTP.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!email) {
      toast.error("Email not found.");
      return;
    }

    setResending(true);

    try {
      const { data } = await api.post(
        `/Auth/resend-registration-otp?email=${encodeURIComponent(email)}`
      );

      toast.success(
        data.message || "A new OTP has been sent."
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to resend OTP.";

      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-yellow-400 rounded-full text-black">
              <ShieldCheck size={40} />
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-white">
            VERIFY YOUR EMAIL
          </h1>

          <p className="text-gray-400 mt-3">
            Enter the 6-digit OTP sent to
          </p>

          <p className="text-yellow-400 font-bold mt-1">
            {email}
          </p>
        </div>

        <form
          onSubmit={verifyOtp}
          className="bg-gray-900 border-4 border-blue-500 rounded-2xl p-8 shadow-[10px_10px_0_#2563eb]"
        >

          <label className="block text-white font-bold mb-2">
            OTP
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(/\D/g, "")
              )
            }
            placeholder="123456"
            className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-yellow-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-4 bg-yellow-400 text-black font-extrabold rounded-xl border-4 border-black shadow-[5px_5px_0_#000] disabled:opacity-50"
          >
            {loading ? "VERIFYING..." : "VERIFY EMAIL"}
          </button>

          <button
            type="button"
            onClick={resendOtp}
            disabled={resending}
            className="w-full mt-5 flex items-center justify-center gap-2 text-blue-400 font-bold hover:underline disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={resending ? "animate-spin" : ""}
            />

            {resending
              ? "SENDING..."
              : "RESEND OTP"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;