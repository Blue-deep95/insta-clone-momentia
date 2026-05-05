import React, { useState } from "react";
import api from "../services/api.js";
import { useNavigate } from "react-router-dom";
import bgLeft from "../assets/ChatGPT Image May 1, 2026, 02_49_14 PM.png";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpStatus, setOtpStatus] = useState("idle");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input
  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  // Send OTP
  async function handleSendOtp(e) {
    e.preventDefault();

    if (!formData.email) {
      setError("Please enter your email first");
      return;
    }

    try {
      setError("");
      setOtpStatus("sending");

      const res = await api.post("/user/send-otp", {
        email: formData.email,
      });

      if (res.status === 200 || res.status === 201) {
        setOtpStatus("sent");
      }
    } catch {
      setError("Failed to send OTP");
      setOtpStatus("idle");
    }
  }

  // Verify OTP
  async function handleVerifyOtp(e) {
    e.preventDefault();

    try {
      setError("");
      setOtpStatus("verifying");

      const res = await api.post("/user/verify-otp", {
        email: formData.email,
        otp,
      });

      if (res.status === 200) {
        setOtpStatus("verified");
      }
    } catch {
      setError("Invalid or expired OTP");
      setOtpStatus("sent");
    }
  }

  // Register
  async function handleRegister(e) {
    e.preventDefault();

    if (otpStatus !== "verified") {
      setError("Please verify your email before continuing");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/user/register", formData);

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="hidden lg:block relative h-screen">
        <img
          src={bgLeft}
          alt="Momentia"
          className="w-full h-full object-cover"
        />

        <div className="absolute top-12 left-12 text-white">
          <h1 className="text-5xl font-bold leading-tight">
            Capture. <br /> Share. <br /> Connect.
          </h1>
          <p className="mt-4 text-lg opacity-90">
            Your moments matter here.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center h-screen px-6 bg-white">

        <form
          onSubmit={handleRegister}
          className="w-full max-w-lg space-y-6"
        >

          {/* HEADER */}
          <div className="text-center">
            <div className="mx-auto mb-5 h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white text-2xl font-bold">
              M
            </div>

            <h2 className="text-4xl font-semibold text-gray-800">
              Create your account
            </h2>

            <p className="text-lg text-gray-500 mt-2">
              Join Momentia and start sharing moments
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full name"
            onChange={handleChange}
            className="w-full px-5 py-4 text-lg rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none"
            required
          />

          {/* EMAIL + OTP */}
          <div className="flex gap-3">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              className="w-full px-5 py-4 text-lg rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-300 outline-none"
              required
            />

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpStatus === "sending" || otpStatus === "verified"}
              className="px-5 py-3 rounded-xl bg-purple-500 text-white text-sm font-medium"
            >
              {otpStatus === "sending" ? "Sending..." : "Send OTP"}
            </button>
          </div>

          {/* OTP FIELD */}
          {otpStatus === "sent" && (
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-5 py-4 text-lg rounded-xl border border-gray-300"
              />

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpStatus === "verifying"}
                className="px-5 py-3 rounded-xl bg-green-500 text-white text-sm"
              >
                {otpStatus === "verifying" ? "Checking..." : "Verify"}
              </button>
            </div>
          )}

          {/* VERIFIED */}
          {otpStatus === "verified" && (
            <p className="text-green-600 text-base text-center">
              Email verified successfully ✅
            </p>
          )}

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Create password"
            onChange={handleChange}
            className="w-full px-5 py-4 text-lg rounded-xl border border-gray-300"
            required
            disabled={otpStatus !== "verified"}
          />

          {/* REGISTER */}
          <button
            className="w-full py-4 text-lg rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold"
            disabled={otpStatus !== "verified" || loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {/* LOGIN */}
          <p className="text-center text-base text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-purple-600 cursor-pointer font-medium"
            >
              Sign in
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}