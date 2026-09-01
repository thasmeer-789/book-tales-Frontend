import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ShieldCheck, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post(
        "/Auth/forgot-password",
        { email: email.trim() }
      );

      toast.success(
        data.message || "Password reset OTP has been sent."
      );

      setStep(2);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to process password reset request.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post(
        "/Auth/verify-password-reset-otp",
        { email, otp }
      );

      toast.success(
        data.message || "OTP verified."
      );

      setStep(3);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Invalid or expired OTP.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post(
        "/Auth/reset-password",
        {
          email,
          otp,
          newPassword,
          confirmPassword,
        }
      );

      toast.success(
        data.message || "Password reset successfully."
      );

      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to reset password.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-yellow-400 rounded-full text-black">
              {step === 3 ? (
                <Lock size={40} />
              ) : (
                <ShieldCheck size={40} />
              )}
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-white">
            {step === 1 && "FORGOT PASSWORD"}
            {step === 2 && "VERIFY OTP"}
            {step === 3 && "SET NEW PASSWORD"}
          </h1>

          <p className="text-gray-400 mt-3">
            {step === 1 &&
              "Enter the email linked to your account"}
            {step === 2 &&
              "Enter the 6-digit OTP sent to"}
            {step === 3 &&
              "Choose a new password for"}
          </p>

          {step !== 1 && (
            <p className="text-yellow-400 font-bold mt-1">
              {email}
            </p>
          )}
        </div>

        {step === 1 && (
          <form
            onSubmit={handleSendOtp}
            className="bg-gray-900 border-4 border-blue-500 rounded-2xl p-8 shadow-[10px_10px_0_#2563eb]"
          >
            <label className="flex items-center gap-2 mb-2 font-bold text-white">
              <Mail className="text-yellow-400" size={18} />
              EMAIL
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hero@universe.com"
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 bg-yellow-400 text-black font-extrabold rounded-xl border-4 border-black shadow-[5px_5px_0_#000] disabled:opacity-50"
            >
              {loading ? "SENDING OTP..." : "SEND OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={handleVerifyOtp}
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
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              placeholder="123456"
              className="w-full px-4 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-yellow-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 bg-yellow-400 text-black font-extrabold rounded-xl border-4 border-black shadow-[5px_5px_0_#000] disabled:opacity-50"
            >
              {loading ? "VERIFYING..." : "VERIFY OTP"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full mt-4 text-blue-400 font-bold hover:underline"
            >
              CHANGE EMAIL
            </button>
          </form>
        )}

        {step === 3 && (
          <form
            onSubmit={handleResetPassword}
            className="bg-gray-900 border-4 border-blue-500 rounded-2xl p-8 shadow-[10px_10px_0_#2563eb] space-y-5"
          >
            <div>
              <label className="flex items-center gap-2 mb-2 font-bold text-white">
                <Lock className="text-yellow-400" size={18} />
                NEW PASSWORD
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 font-bold text-white">
                <Lock className="text-yellow-400" size={18} />
                CONFIRM PASSWORD
              </label>

              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-yellow-400 text-black font-extrabold rounded-xl border-4 border-black shadow-[5px_5px_0_#000] disabled:opacity-50"
            >
              {loading ? "RESETTING..." : "RESET PASSWORD"}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-400 font-bold hover:underline"
          >
            ← BACK TO LOGIN
          </button>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;