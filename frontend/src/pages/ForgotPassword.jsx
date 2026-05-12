import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

import forgotBg from "../assets/leftimage.png";

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

  // TIMER
  useEffect(() => {

    if (step === 2 && timer > 0) {

      const interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);

      return () => clearInterval(interval);
    }

  }, [step, timer]);

  // SEND OTP
  const handleSendOtp = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {

      const res = await api.post("/user/forgot-password", {
        email,
      });

      setMessage(
        res.data.message || "OTP sent to email 📩"
      );

      setStep(2);
      setTimer(30);

    } catch (err) {

      setError(
        err.response?.data?.message || "User not found"
      );

    } finally {

      setLoading(false);
    }
  };

  // RESET PASSWORD
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
        password,
      });

      setMessage(
        res.data.message ||
        "Password reset successful ✅"
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Invalid or expired OTP"
      );

    } finally {

      setLoading(false);
    }
  };

  // OTP HANDLER
  const handleOtpChange = (value, index) => {

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="relative hidden h-screen items-center justify-center bg-white lg:flex">

        <img
          src={forgotBg}
          alt="Momentia"
          className="h-full w-full object-cover"
        />

      </div>

      {/* RIGHT SIDE */}
      <div className="flex h-screen items-center justify-center bg-white px-6">

        <div className="w-full max-w-lg space-y-6">

          {/* HEADER */}
          <div className="text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-2xl font-bold text-white">
              M
            </div>

            <h2 className="text-4xl font-semibold text-gray-800">

              {step === 1
                ? "Forgot Password"
                : "Reset Password"}

            </h2>

            <p className="mt-2 text-lg text-gray-500">

              {step === 1
                ? "Enter your email to receive OTP"
                : "Enter OTP and create new password"}

            </p>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-center text-sm text-red-500">
              {error}
            </p>
          )}

          {/* SUCCESS */}
          {message && (
            <p className="text-center text-sm text-green-600">
              {message}
            </p>
          )}

          {/* STEP 1 */}
          {step === 1 && (

            <form
              onSubmit={handleSendOtp}
              className="space-y-5"
            >

              {/* EMAIL */}
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="w-full rounded-xl border border-gray-300 px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-purple-300"
              />

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 py-4 text-lg font-semibold text-white transition hover:opacity-90"
              >
                {loading
                  ? "Sending..."
                  : "Send OTP"}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (

            <form
              onSubmit={handleResetPassword}
              className="space-y-5"
            >

              {/* OTP BOXES */}
              <div className="flex justify-between gap-2">

                {otp.map((digit, index) => (

                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(
                        e.target.value,
                        index
                      )
                    }
                    className="h-14 w-14 rounded-xl border border-gray-300 text-center text-xl outline-none focus:ring-2 focus:ring-purple-300"
                  />
                ))}
              </div>

              {/* PASSWORD */}
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                className="w-full rounded-xl border border-gray-300 px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-purple-300"
              />

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 py-4 text-lg font-semibold text-white transition hover:opacity-90"
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>

              {/* TIMER */}
              <div className="text-center text-sm text-gray-500">

                {timer > 0 ? (
                  <span>
                    Resend OTP in {timer}s
                  </span>
                ) : (
                  <span
                    onClick={handleSendOtp}
                    className="cursor-pointer font-medium text-purple-600"
                  >
                    Resend OTP
                  </span>
                )}
              </div>
            </form>
          )}

          {/* BACK */}
          <p className="text-center text-base text-gray-500">

            Back to{" "}

            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer font-medium text-purple-600"
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