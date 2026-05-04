import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);

  // ⏱️ Timer
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  // ✅ STEP 1 → SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/user/forgot-password", { email });

      setMessage(res.data.message || "OTP sent to email 📩");
      setStep(2);
      setTimer(30);
    } catch (err) {
      setError(err.response?.data?.message || "User not found");
    } finally {
      setLoading(false);
    }
  };

  // ✅ STEP 2 → VERIFY OTP + RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const finalOtp = otp.join("");

      const res = await api.post("/user/reset-password", {
        email,
        otp: finalOtp,
        password, // 🔥 IMPORTANT: must match backend
      });

      setMessage(res.data.message || "Password reset successful ✅");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔢 OTP handler
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT IMAGE */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/login-bg.png')" }}
      />

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 bg-gradient-to-br from-slate-100 to-slate-200">

        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-md">

          <h2 className="text-3xl font-bold text-center mb-2">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h2>

          <p className="text-center text-gray-500 mb-6 text-sm">
            {step === 1
              ? "Enter your email to receive OTP"
              : "Enter OTP & new password"}
          </p>

          {/* Messages */}
          {error && <p className="text-red-500 text-center mb-3">{error}</p>}
          {message && <p className="text-green-600 text-center mb-3">{message}</p>}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold 
                bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">

              {/* OTP */}
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(e.target.value, index)
                    }
                    className="w-12 h-12 text-center text-xl border rounded-xl focus:ring-2 focus:ring-purple-400"
                  />
                ))}
              </div>

              {/* PASSWORD */}
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400"
              />

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold 
                bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              {/* RESEND */}
              <div className="text-center text-sm text-gray-500">
                {timer > 0 ? (
                  <span>Resend OTP in {timer}s</span>
                ) : (
                  <span
                    onClick={handleSendOtp}
                    className="text-purple-600 cursor-pointer"
                  >
                    Resend OTP
                  </span>
                )}
              </div>
            </form>
          )}

          {/* BACK */}
          <p className="text-center text-sm mt-5">
            Back to{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-purple-600 cursor-pointer"
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;