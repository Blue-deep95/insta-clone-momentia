import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registerUser = async (formData) => {
    const response = await fetch("/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await registerUser(form);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1495562569060-2eec283d3391?auto=format&fit=crop&w=1400&q=80"
            alt="Hero background"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/30" />
          <div className="absolute inset-0 p-12 flex flex-col justify-between text-white">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold tracking-wide text-white/90">
                Welcome to Momentia
              </span>
            </div>
            <div className="max-w-xl">
              <h1 className="text-5xl font-semibold leading-tight tracking-tight">
                Capture.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300">
                  Share.
                </span>
                <span className="block">Connect.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base text-slate-200/90">
                Your moments matter here. Join Momentia to create, connect, and share your story.
              </p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl shadow-2xl">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-200/80">Create moments that matter</p>
              <p className="mt-4 text-2xl font-semibold text-white">Find your community & share your best memories.</p>
            </div>
          </div>
        </div>

      <div className="flex items-center justify-center px-6 py-10 sm:px-12">
        <div className="w-full max-w-xl rounded-[32px] border border-slate-200/70 bg-white p-10 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white text-2xl font-bold">
              M
            </div>
            <h2 className="text-3xl font-semibold tracking-tight">Create your account</h2>
            <p className="mt-3 text-sm text-slate-500">
              Sign up to start sharing your moments and discover what others are posting.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
            />

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Registering..." : "Create account"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
            <div className="relative mx-auto inline-block bg-white px-4 text-sm text-slate-400">
              or continue with
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <button type="button" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
              Google
            </button>
            <button type="button" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
              Facebook
            </button>
            <button type="button" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
              Apple
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-semibold text-slate-900 hover:text-cyan-500"
            >
              Login
            </button>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Register;