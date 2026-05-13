import React, { useState } from "react";
import api from "../services/api.js";
import { useNavigate } from "react-router-dom";
import bgLeft from "../assets/leftimage.png";

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
        email: formData.email.trim(),
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
        email: formData.email.trim(),
        otp: otp.trim(),
      });

      if (res.status === 200) {
        setOtpStatus("verified");
      }
    } catch (err) {
      console.error("OTP verification error:", err.response?.data);
      setError(err.response?.data?.message || "Invalid or expired OTP");
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
    <div className="grid min-h-screen lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="relative hidden h-screen lg:block">
        <img
          src={bgLeft}
          alt="Momentia"
          className="h-full w-full object-cover"
        />

        <div className="absolute left-12 top-12 text-white">
          <h1 className="text-5xl font-bold leading-tight">
            Capture. <br /> Share. <br /> Connect.
          </h1>
          <p className="mt-4 text-lg opacity-90">
            Your moments matter here.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex h-screen items-center justify-center bg-white px-6">

        <form
          onSubmit={handleRegister}
          className="w-full max-w-lg space-y-6"
        >

          {/* HEADER */}
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-2xl font-bold text-white">
              M
            </div>

            <h2 className="text-4xl font-semibold text-gray-800">
              Create your account
            </h2>

            <p className="mt-2 text-lg text-gray-500">
              Join Momentia and start sharing moments
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full name"
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-purple-300"
            required
          />

          {/* EMAIL + OTP */}
          <div className="flex gap-3">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-purple-300"
              required
            />

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpStatus === "sending" || otpStatus === "verified"}
              className="rounded-xl bg-purple-500 px-5 py-3 text-sm font-medium text-white"
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
                className="w-full rounded-xl border border-gray-300 px-5 py-4 text-lg"
              />

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpStatus === "verifying"}
                className="rounded-xl bg-green-500 px-5 py-3 text-sm text-white"
              >
                {otpStatus === "verifying" ? "Checking..." : "Verify"}
              </button>
            </div>
          )}

          {/* VERIFIED */}
          {otpStatus === "verified" && (
            <p className="text-center text-base text-green-600">
              Email verified successfully ✅
            </p>
          )}

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Create password"
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-5 py-4 text-lg"
            required
            disabled={otpStatus !== "verified"}
          />

          {/* REGISTER */}
          <button
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 py-4 text-lg font-semibold text-white"
            disabled={otpStatus !== "verified" || loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {/* LOGIN */}
          <p className="text-center text-base text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer font-medium text-purple-600"
            >
              Sign in
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}