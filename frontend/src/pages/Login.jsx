import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/api.js";
import { login } from "../slices/authSlice.js";

/* ─── Floating Activity Card ───────────────────────────────── */
const FloatCard = ({ avatar, title, sub, delay, className }) => (
  <div
    className={`absolute flex items-center gap-3 rounded-2xl px-4 py-3 min-w-[190px] z-10 ${className}`}
    style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(110,231,183,0.1)",
      backdropFilter: "blur(20px)",
      animation: `floatUp 6s ${delay} ease-in-out infinite alternate`,
    }}
  >
    {avatar ? (
      <img src={avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        style={{ outline: "1.5px solid rgba(110,231,183,0.2)" }} />
    ) : (
      <span className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: "#34EEB0", boxShadow: "0 0 10px 3px rgba(52,238,176,0.5)" }} />
    )}
    <div>
      <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.88)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginTop: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{sub}</div>
    </div>
  </div>
);

/* ─── Input Field ───────────────────────────────────────────── */
const Field = ({ label, type, name, placeholder, value, onChange }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-5">
      <label className="block mb-2" style={{ fontSize: 10, fontWeight: 600, color: "#8896B3", letterSpacing: "0.9px", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {label}
      </label>
      <input
        type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} required
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="w-full rounded-xl px-5 py-3.5 text-sm outline-none transition-all duration-200"
        style={{
          background: focused ? "#fff" : "#F8F7FF",
          border: focused ? "1.5px solid #10B981" : "1.5px solid #E2DCFF",
          color: "#0D0A26",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          boxShadow: focused ? "0 0 0 4px rgba(16,185,129,0.1)" : "none",
        }}
      />
    </div>
  );
};

/* ─── Social Button ─────────────────────────────────────────── */
const SocialBtn = ({ icon, label, iconBg, iconColor }) => {
  const [hov, setHov] = useState(false);
  return (
    <button type="button"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-[13px] font-medium transition-all duration-200"
      style={{
        border: hov ? "1.5px solid #10B981" : "1.5px solid #E2DCFF",
        background: hov ? "#F0FDF8" : "#fff",
        color: "#1A1535",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        cursor: "pointer",
      }}
    >
      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
        style={{ background: iconBg, color: iconColor, border: label === "Google" ? "1px solid #eee" : "none" }}>
        {icon}
      </span>
      {label}
    </button>
  );
};

/* ─── Main Login Component ──────────────────────────────────── */
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/user/login", form);
      dispatch(login({ user: res.data.user, accessToken: res.data.accessToken }));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap');
    * { box-sizing: border-box; }

    @keyframes floatUp { 0% { transform: translateY(0) } 100% { transform: translateY(-16px) } }
    @keyframes fadeForm { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes pulse { 0%,100% { opacity:1; transform:scale(1) } 50% { opacity:.35; transform:scale(.7) } }
    @keyframes spin { to { transform: rotate(360deg) } }
    @keyframes rotateSlow { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
    @keyframes rotateSlowR { from { transform: rotate(0deg) } to { transform: rotate(-360deg) } }
    @keyframes scanLine { 0% { top: -2px } 100% { top: 100% } }
    @keyframes gridPulse { 0%,100% { opacity: 0.05 } 50% { opacity: 0.11 } }
    @keyframes orbitDot { 0% { transform: rotate(0deg) translateX(170px) } 100% { transform: rotate(360deg) translateX(170px) } }
    @keyframes orbitDot2 { 0% { transform: rotate(120deg) translateX(250px) } 100% { transform: rotate(480deg) translateX(250px) } }

    .login-root { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }
    .right-form { animation: fadeForm .75s cubic-bezier(.22,1,.36,1) both; }
    .submit-btn:hover:not(:disabled) { transform: translateY(-1.5px) !important; box-shadow: 0 14px 40px -8px rgba(16,185,129,0.5) !important; }
    .submit-btn:active:not(:disabled) { transform: translateY(0) !important; }
    input::placeholder { color: #B0AACF; }

    @media (max-width: 1023px) {
      .login-root { grid-template-columns: 1fr !important; }
      .left-panel { display: none !important; }
      .right-panel { min-height: 100vh; padding: 36px 24px !important; }
    }
    @media (max-width: 480px) {
      .right-panel { padding: 28px 20px !important; }
    }
  `;

  const ringCount = 24;

  return (
    <>
      <style>{css}</style>
      <div className="login-root">

        {/* ── LEFT PANEL — Geometric Sci-Fi ── */}
        <div className="left-panel" style={{ position: "relative", background: "#04050F", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>

          {/* Animated grid */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0, animation: "gridPulse 5s ease-in-out infinite",
            backgroundImage: "linear-gradient(rgba(110,231,183,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(110,231,183,0.07) 1px, transparent 1px)",
            backgroundSize: "52px 52px" }} />

          {/* Diagonal SVG lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }} preserveAspectRatio="none">
            <line x1="0" y1="30%" x2="100%" y2="72%" stroke="rgba(110,231,183,0.06)" strokeWidth="1" />
            <line x1="0" y1="65%" x2="100%" y2="18%" stroke="rgba(110,231,183,0.04)" strokeWidth="0.8" />
            <line x1="25%" y1="0" x2="75%" y2="100%" stroke="rgba(99,102,241,0.05)" strokeWidth="1" />
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(99,102,241,0.03)" strokeWidth="0.5" />
          </svg>

          {/* Scan line */}
          <div style={{ position: "absolute", left: 0, right: 0, height: "1px", zIndex: 2,
            background: "linear-gradient(90deg, transparent 0%, rgba(110,231,183,0.4) 50%, transparent 100%)",
            animation: "scanLine 9s linear infinite" }} />

          {/* Outer rotating ring with tick marks */}
          <div style={{ position: "absolute", top: "50%", left: "50%",
            width: 560, height: 560, marginLeft: -280, marginTop: -280,
            borderRadius: "50%", border: "1px solid rgba(110,231,183,0.07)",
            animation: "rotateSlow 50s linear infinite" }}>
            {[...Array(ringCount)].map((_, i) => (
              <div key={i} style={{
                position: "absolute", width: i % 6 === 0 ? 3 : 1.5, height: i % 6 === 0 ? 14 : 8,
                background: i % 6 === 0 ? "rgba(110,231,183,0.55)" : "rgba(110,231,183,0.18)",
                left: "50%", top: 0, transformOrigin: `${i % 6 === 0 ? 1.5 : 0.75}px 280px`,
                transform: `rotate(${i * (360 / ringCount)}deg) translateX(-${i % 6 === 0 ? 1.5 : 0.75}px)`,
              }} />
            ))}
          </div>

          {/* Middle ring dashed */}
          <div style={{ position: "absolute", top: "50%", left: "50%",
            width: 360, height: 360, marginLeft: -180, marginTop: -180,
            borderRadius: "50%", border: "1px dashed rgba(99,102,241,0.18)",
            animation: "rotateSlowR 30s linear infinite" }} />

          {/* Inner ring solid */}
          <div style={{ position: "absolute", top: "50%", left: "50%",
            width: 200, height: 200, marginLeft: -100, marginTop: -100,
            borderRadius: "50%", border: "1px solid rgba(110,231,183,0.12)" }} />

          {/* Orbiting dots */}
          <div style={{ position: "absolute", top: "50%", left: "50%", width: 0, height: 0, zIndex: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6EE7B7",
              boxShadow: "0 0 12px 4px rgba(110,231,183,0.6)",
              animation: "orbitDot 8s linear infinite" }} />
          </div>
          <div style={{ position: "absolute", top: "50%", left: "50%", width: 0, height: 0, zIndex: 3 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#818CF8",
              boxShadow: "0 0 8px 3px rgba(129,140,248,0.5)",
              animation: "orbitDot2 14s linear infinite" }} />
          </div>

          {/* Center glow + logo */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 4 }}>
            <div style={{ width: 110, height: 110, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(110,231,183,0.18) 0%, rgba(99,102,241,0.08) 55%, transparent 75%)" }} />
          </div>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: 52, height: 52, borderRadius: "50%", zIndex: 5,
            background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: "#6EE7B7" }}>
            M
          </div>

          {/* Corner brackets */}
          {[
            { top: 20, left: 20, borderTop: "2px solid rgba(110,231,183,0.35)", borderLeft: "2px solid rgba(110,231,183,0.35)" },
            { top: 20, right: 20, borderTop: "2px solid rgba(110,231,183,0.35)", borderRight: "2px solid rgba(110,231,183,0.35)" },
            { bottom: 20, left: 20, borderBottom: "2px solid rgba(110,231,183,0.35)", borderLeft: "2px solid rgba(110,231,183,0.35)" },
            { bottom: 20, right: 20, borderBottom: "2px solid rgba(110,231,183,0.35)", borderRight: "2px solid rgba(110,231,183,0.35)" },
          ].map((s, i) => (
            <div key={i} style={{ position: "absolute", width: 28, height: 28, ...s }} />
          ))}

          {/* Floating cards */}
          <FloatCard avatar="https://picsum.photos/seed/fc1/80/80" title="@Spark-just posted" sub="Santorini, Greece" delay="0s" className="top-[17%] left-[8%]" />
          <FloatCard avatar={null} title="@Spark-just posted" sub="shared today" delay="-3s" className="top-[62%] right-[7%]" />
          <FloatCard avatar="https://picsum.photos/seed/fc3/80/80" title="@Teddy.photo liked" sub="your latest story" delay="-5s" className="bottom-[12%] left-[12%]" />

          {/* Brand text — sits above center-left */}
          <div style={{ position: "relative", zIndex: 5, textAlign: "center", padding: "0 52px", marginTop: -20 }}>
            <div style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 8,
              padding: "4px 13px", borderRadius: 20,
              background: "rgba(110,231,183,0.06)", border: "1px solid rgba(110,231,183,0.14)" }}>
              <span style={{ width: 5.5, height: 5.5, borderRadius: "50%", background: "#6EE7B7",
                display: "inline-block", animation: "pulse 2s ease infinite" }} />
              <span style={{ fontSize: 9.5, color: "#6EE7B7", letterSpacing: "1.6px", textTransform: "uppercase", fontWeight: 500, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Live now</span>
            </div>

            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 50, fontWeight: 300, color: "#fff",
              lineHeight: 1.13, letterSpacing: "-1px", marginBottom: 14 }}>
              Capture your<br />
              <em style={{ fontStyle: "italic", color: "#6EE7B7" }}>moments,</em><br />
              <span style={{ color: "rgba(255,255,255,0.32)" }}>share your world</span>
            </h1>

            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.32)", fontWeight: 300, lineHeight: 1.85, marginBottom: 30, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Join millions of creators sharing<br />their stories every day.
            </p>

            <div style={{ display: "flex", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(110,231,183,0.09)" }}>
              {[["2.1M", "Creators"], ["14M", "Moments"], ["98%", "Happiness"]].map(([n, l], i) => (
                <div key={l} style={{ flex: 1, textAlign: "center", padding: "13px 10px",
                  background: "rgba(255,255,255,0.02)",
                  borderRight: i < 2 ? "1px solid rgba(110,231,183,0.07)" : "none" }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: "#6EE7B7" }}>{n}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", marginTop: 3, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel" style={{ background: "#F4F2FF", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 52px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -130, right: -130, width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(110,231,183,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -100, left: -100, width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

          <form onSubmit={handleSubmit} className="right-form w-full" style={{ maxWidth: 400, position: "relative", zIndex: 2 }}>

            {/* Mobile brand — only shows on small screens */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "#04050F",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Fraunces', serif", fontSize: 20, color: "#6EE7B7", fontWeight: 700 }}>M</div>
              <span style={{ fontWeight: 600, color: "#0D0A26", fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Momentia</span>
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, borderRadius: 20, padding: "5px 14px",
              fontSize: 10.5, fontWeight: 500, background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)", color: "#059669", marginBottom: 20, letterSpacing: "0.3px",
              fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span style={{ width: 5.5, height: 5.5, borderRadius: "50%", background: "#10B981", display: "inline-block", animation: "pulse 2s ease infinite" }} />
              Welcome back to Momentia
            </div>

            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 42, fontWeight: 400, color: "#0D0A26",
              letterSpacing: "-1px", lineHeight: 1.08, marginBottom: 4 }}>Sign in</h2>
            <p style={{ fontSize: 13, color: "#8896B3", marginBottom: 30, fontWeight: 300, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Continue your creative journey
            </p>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)",
                borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 20,
                fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {error}
              </div>
            )}

            <Field label="Email address" type="email" name="email" placeholder="teddy@gmail.com" value={form.email} onChange={handleChange} />
            <Field label="Password" type="password" name="password" placeholder="••••••••••" value={form.password} onChange={handleChange} />

            <div style={{ textAlign: "right", marginBottom: 24 }}>
              <span onClick={() => navigate("/forgot-password")} style={{ fontSize: 12, color: "#059669", fontWeight: 500, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Forgot password?
              </span>
            </div>

            <button type="submit" disabled={loading} className="submit-btn"
              style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none",
                background: "linear-gradient(135deg, #059669 0%, #10B981 55%, #34D399 100%)",
                color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.75 : 1, letterSpacing: "0.2px", marginBottom: 22,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "all 0.2s", boxShadow: "0 8px 28px -6px rgba(16,185,129,0.4)" }}>
              {loading ? (
                <>
                  <span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  Signing in...
                </>
              ) : "Sign In →"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{ flex: 1, height: 1, background: "#DDD8FF" }} />
              <span style={{ fontSize: 11, color: "#A09BC4", whiteSpace: "nowrap", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: "#DDD8FF" }} />
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
              <SocialBtn icon="G" label="Google" iconBg="#fff" iconColor="#EA4335" />
              <SocialBtn icon="f" label="Facebook" iconBg="#1877F2" iconColor="#fff" />
            </div>

            <p style={{ textAlign: "center", fontSize: 13, color: "#8896B3", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")} style={{ color: "#059669", fontWeight: 600, cursor: "pointer" }}>
                Create one free
              </span>
            </p>
          </form>
        </div>

      </div>
    </>
  );
};

export default Login;
