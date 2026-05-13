import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

import { useDispatch } from "react-redux";
import { login } from "../slices/authSlice.js";

import loginBg from "../assets/leftimage.png";

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // LOGIN
  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const res = await api.post("/user/login", form);

      const data = res.data;

      dispatch(
        login({
          user: data.user,
          accessToken: data.accessToken,
        })
      );

      navigate("/");

    } catch (err) {

      setError(
        err.response?.data?.message || "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="relative hidden h-screen items-center justify-center bg-white lg:flex">

        <img
          src={loginBg}
          alt="Momentia"
          className="h-full w-full object-cover"
        />

      </div>

      {/* RIGHT SIDE */}
      <div className="flex h-screen items-center justify-center bg-white px-6">

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg space-y-6"
        >

          {/* HEADER */}
          <div className="text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-2xl font-bold text-white">
              M
            </div>

            <h2 className="text-4xl font-semibold text-gray-800">
              Welcome Back
            </h2>

            <p className="mt-2 text-lg text-gray-500">
              Login to continue your journey
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-center text-sm text-red-500">
              {error}
            </p>
          )}

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-purple-300"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-purple-300"
          />

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end">

            <span
              onClick={() => navigate("/forgot-password")}
              className="cursor-pointer text-sm font-medium text-purple-600 hover:underline"
            >
              Forgot Password?
            </span>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 py-4 text-lg font-semibold text-white transition hover:opacity-90"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center">

            <div className="h-px flex-1 bg-gray-300"></div>

            <span className="px-4 text-sm text-gray-400">
              or
            </span>

            <div className="h-px flex-1 bg-gray-300"></div>
          </div>

          {/* SOCIAL LOGIN */}
          {/*
          <div className="space-y-3">

            <button className="w-full rounded-xl border py-3 hover:bg-gray-50">
              Continue with Google
            </button>

            <button className="w-full rounded-xl border py-3 hover:bg-gray-50">
              Continue with Facebook
            </button>

          </div>
          */}

          {/* REGISTER LINK */}
          <p className="text-center text-base text-gray-500">

            Don’t have an account?{" "}

            <span
              onClick={() => navigate("/register")}
              className="cursor-pointer font-medium text-purple-600"
            >
              Sign Up
            </span>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;