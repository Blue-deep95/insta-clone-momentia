import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";


const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async (formData) => {
    const response = await api.post("/login", formData);
   

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return response.json();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await loginUser(form);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ✅ LEFT SIDE IMAGE */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/login-bg.png')" }} // 🔁 put your image in public folder
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Optional Text */}
        <div className="relative z-10 flex items-end h-full p-10 text-white">
          <h1 className="text-3xl font-bold leading-snug">
            Capture. Share. Connect.
          </h1>
        </div>
      </div>

      {/* ✅ RIGHT SIDE LOGIN */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 bg-gradient-to-br from-slate-100 to-slate-200">

        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-md border border-gray-200">

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Momentia
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back 👋
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-center text-sm mb-4">{error}</p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition"
            />

            {/* Forgot Password */}
            <div className="flex justify-end">
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-purple-600 cursor-pointer hover:underline"
              >
                Forgot Password?
              </span>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white 
              bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 
              hover:opacity-90 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-gray-400 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

         {/* Social Login */}
          {/* <div className="space-y-2">
            <button className="w-full py-2 border rounded-lg hover:bg-gray-50">
              Continue with Google
            </button>
            <button className="w-full py-2 border rounded-lg hover:bg-gray-50">
              Continue with Facebook
            </button>
          </div>*/ }

          {/* Register Link */}
          <p className="text-center text-sm mt-5">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-purple-600 font-medium cursor-pointer"
            >
              Register
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login