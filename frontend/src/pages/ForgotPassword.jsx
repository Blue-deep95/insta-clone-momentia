import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

/* ─── Floating Status Card ──────────────────────────────────── */
const FloatCard = ({ icon, title, sub, delay, className }) => (
  <div
    className={`absolute flex items-center gap-3 rounded-2xl px-4 py-3 min-w-[200px] z-10 ${className}`}
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(110,231,183,0.12)",
      backdropFilter: "blur(20px)",
      animation: `floatUp 6s ${delay} ease-in-out infinite alternate`,
    }}
  >
    <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
    <div>
      <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.88)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginTop: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{sub}</div>
    </div>
  </div>
);

/* ─── OTP Single Box ────────────────────────────────────────── */
const OtpBox = ({ id, value, onChange, onKeyDown, focused }) => (
  <input
    id={id}
    type="text"
    inputMode="numeric"
    maxLength="1"
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    autoComplete="off"
    style={{
      width: 52,
      height: 58,
      borderRadius: 14,
      border: value ? "1.5px solid #10B981" : "1.5px solid #DDD8FF",
      background: value ? "rgba(16,185,129,0.06)" : "#F8F7FF",
      textAlign: "center",
      fontSize: 22,
      fontWeight: 700,
      color: "#0D0A26",
      fontFamily: "'Fraunces', serif",
      outline: "none",
      transition: "all 0.2s",
      boxShadow: value ? "0 0 0 4px rgba(16,185,129,0.1)" : "none",
      caretColor: "#10B981",
    }}
  />
);

/* ─── Field ─────────────────────────────────────────────────── */
const Field = ({ label, type, name, placeholder, value, onChange }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-6">
      <label style={{ display: "block", marginBottom: 8, fontSize: 10, fontWeight: 600, color: "#8896B3", letterSpacing: "0.9px", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {label}
      </label>
      <input
        type={type} name={name} placeholder={placeholder} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", borderRadius: 12, padding: "16px 20px", fontSize: 14, outline: "none",
          background: focused ? "#fff" : "#F8F7FF",
          border: focused ? "1.5px solid #10B981" : "1.5px solid #E2DCFF",
          color: "#0D0A26", fontFamily: "'Plus Jakarta Sans', sans-serif",
          boxShadow: focused ? "0 0 0 4px rgba(16,185,129,0.1)" : "none",
          transition: "all 0.2s",
        }}
      />
    </div>
  );
};

/* ─── Step Indicator ─────────────────────────────────────────── */
const StepDots = ({ step }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
    {[1, 2, 3].map((s) => (
      <React.Fragment key={s}>
        <div style={{
          width: s <= step ? 28 : 8, height: 8, borderRadius: 6,
          background: s <= step ? "linear-gradient(90deg, #059669, #10B981)" : "#DDD8FF",
          transition: "all 0.4s cubic-bezier(.22,1,.36,1)",
          boxShadow: s === step ? "0 0 12px rgba(16,185,129,0.5)" : "none",
        }} />
        {s < 3 && <div style={{ width: 20, height: 1, background: s < step ? "#10B981" : "#DDD8FF", transition: "all 0.4s" }} />}
      </React.Fragment>
    ))}
    <span style={{ marginLeft: 8, fontSize: 11, color: "#8896B3", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      Step {step} of 3
    </span>
  </div>
);

/* ─── Main Component ─────────────────────────────────────────── */
const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setLoading(true); setError(""); setMessage("");
    try {
      const res = await api.post("/user/forgot-password", { email });
      setMessage(res.data.message || "OTP sent to your email!");
      setStep(2); setTimer(30);
    } catch (err) {
      setError(err.response?.data?.message || "No account found with that email.");
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.join("").length < 6) { setError("Please enter the complete 6-digit OTP."); return; }
    setError(""); setMessage(""); setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true); setError(""); setMessage("");
    try {
      const res = await api.post("/user/reset-password", { email, otp: otp.join(""), password });
      setMessage(res.data.message || "Password reset successfully!");
      setStep(4);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally { setLoading(false); }
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      document.getElementById(`otp-5`)?.focus();
    }
  };

  const ringCount = 20;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes floatUp { 0% { transform: translateY(0) } 100% { transform: translateY(-14px) } }
    @keyframes fadeForm { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes pulse { 0%,100% { opacity:1; transform:scale(1) } 50% { opacity:.35; transform:scale(.7) } }
    @keyframes spin { to { transform: rotate(360deg) } }
    @keyframes rotateSlow { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
    @keyframes rotateSlowR { from { transform: rotate(0deg) } to { transform: rotate(-360deg) } }
    @keyframes gridPulse { 0%,100% { opacity: 0.05 } 50% { opacity: 0.12 } }
    @keyframes radarSweep {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes radarPing {
      0% { transform: scale(0.3); opacity: 0.9; }
      100% { transform: scale(1); opacity: 0; }
    }
    @keyframes orbitDot {
      0% { transform: rotate(0deg) translateX(155px); }
      100% { transform: rotate(360deg) translateX(155px); }
    }
    @keyframes orbitDot2 {
      0% { transform: rotate(200deg) translateX(230px); }
      100% { transform: rotate(560deg) translateX(230px); }
    }
    @keyframes successPop {
      0% { transform: scale(0.5); opacity: 0; }
      60% { transform: scale(1.15); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes checkDraw {
      from { stroke-dashoffset: 60; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .fp-root { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }
    .right-form { animation: fadeForm .75s cubic-bezier(.22,1,.36,1) both; }
    .step-content { animation: slideIn 0.4s cubic-bezier(.22,1,.36,1) both; }
    .submit-btn:hover:not(:disabled) { transform: translateY(-1.5px) !important; box-shadow: 0 14px 40px -8px rgba(16,185,129,0.5) !important; }
    .submit-btn:active:not(:disabled) { transform: translateY(0) !important; }
    input::placeholder { color: #B0AACF; }

    @media (max-width: 1023px) {
      .fp-root { grid-template-columns: 1fr !important; }
      .left-panel { display: none !important; }
      .right-panel { min-height: 100vh; padding: 36px 24px !important; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="fp-root">

        {/* ── LEFT PANEL — Radar / Signal Theme ── */}
        <div className="left-panel" style={{ position: "relative", background: "#04050F", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>

          {/* Animated grid */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0, animation: "gridPulse 5s ease-in-out infinite",
            backgroundImage: "linear-gradient(rgba(110,231,183,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(110,231,183,0.07) 1px, transparent 1px)",
            backgroundSize: "52px 52px"
          }} />

          {/* SVG lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }} preserveAspectRatio="none">
            <line x1="0" y1="40%" x2="100%" y2="60%" stroke="rgba(110,231,183,0.05)" strokeWidth="1" />
            <line x1="30%" y1="0" x2="70%" y2="100%" stroke="rgba(99,102,241,0.04)" strokeWidth="0.8" />
          </svg>

          {/* Outer ring with ticks */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            width: 520, height: 520, marginLeft: -260, marginTop: -260,
            borderRadius: "50%", border: "1px solid rgba(110,231,183,0.06)",
            animation: "rotateSlow 60s linear infinite"
          }}>
            {[...Array(ringCount)].map((_, i) => (
              <div key={i} style={{
                position: "absolute", width: i % 5 === 0 ? 3 : 1.5, height: i % 5 === 0 ? 12 : 7,
                background: i % 5 === 0 ? "rgba(110,231,183,0.5)" : "rgba(110,231,183,0.15)",
                left: "50%", top: 0, transformOrigin: `${i % 5 === 0 ? 1.5 : 0.75}px 260px`,
                transform: `rotate(${i * (360 / ringCount)}deg) translateX(-${i % 5 === 0 ? 1.5 : 0.75}px)`,
              }} />
            ))}
          </div>

          {/* Radar rings */}
          {[320, 220, 130].map((size, i) => (
            <div key={size} style={{
              position: "absolute", top: "50%", left: "50%",
              width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2,
              borderRadius: "50%",
              border: i === 0 ? "1px dashed rgba(99,102,241,0.2)" : i === 1 ? "1px solid rgba(110,231,183,0.1)" : "1px solid rgba(110,231,183,0.2)",
              animation: i === 0 ? "rotateSlowR 25s linear infinite" : "none",
            }} />
          ))}

          {/* Radar sweep */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", width: 0, height: 0, zIndex: 3,
            animation: "radarSweep 4s linear infinite"
          }}>
            <div style={{
              position: "absolute", width: 160, height: 160, top: -160, left: 0, transformOrigin: "0 160px",
              background: "conic-gradient(from -5deg, rgba(110,231,183,0.22) 0%, rgba(110,231,183,0.08) 30deg, transparent 60deg)",
              borderRadius: "50% 50% 0 0 / 50% 50% 0 0",
            }} />
          </div>

          {/* Radar ping dots — blips */}
          {[
            { top: "35%", left: "60%", delay: "0s" },
            { top: "58%", left: "38%", delay: "1.3s" },
            { top: "44%", left: "52%", delay: "2.6s" },
          ].map((pos, i) => (
            <div key={i} style={{ position: "absolute", ...pos, zIndex: 4 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", background: "#6EE7B7",
                boxShadow: "0 0 10px 3px rgba(110,231,183,0.6)",
                animation: `radarPing 4s ${pos.delay} ease-out infinite`
              }} />
            </div>
          ))}

          {/* Orbiting dots */}
          <div style={{ position: "absolute", top: "50%", left: "50%", width: 0, height: 0, zIndex: 3 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", background: "#6EE7B7",
              boxShadow: "0 0 12px 4px rgba(110,231,183,0.6)",
              animation: "orbitDot 9s linear infinite"
            }} />
          </div>
          <div style={{ position: "absolute", top: "50%", left: "50%", width: 0, height: 0, zIndex: 3 }}>
            <div style={{
              width: 5, height: 5, borderRadius: "50%", background: "#818CF8",
              boxShadow: "0 0 8px 3px rgba(129,140,248,0.5)",
              animation: "orbitDot2 16s linear infinite"
            }} />
          </div>

          {/* Center glow + logo */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 4 }}>
            <div style={{
              width: 100, height: 100, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(110,231,183,0.2) 0%, rgba(99,102,241,0.08) 55%, transparent 75%)"
            }} />
          </div>
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: 52, height: 52, borderRadius: "50%", zIndex: 5,
            background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: "#6EE7B7"
          }}>
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
          <FloatCard icon="🔐" title="Secure recovery" sub="End-to-end encrypted" delay="0s" className="top-[14%] left-[8%]" />
          <FloatCard icon="⚡" title="OTP delivered" sub="Check your inbox" delay="-3s" className="top-[65%] right-[6%]" />
          <FloatCard icon="✅" title="Account secured" sub="2-step verification" delay="-5s" className="bottom-[10%] left-[10%]" />

          {/* Brand text */}
          <div style={{ position: "relative", zIndex: 5, textAlign: "center", padding: "0 52px", marginTop: -20 }}>
            <div style={{
              marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 8,
              padding: "4px 13px", borderRadius: 20,
              background: "rgba(110,231,183,0.06)", border: "1px solid rgba(110,231,183,0.14)"
            }}>
              <span style={{
                width: 5.5, height: 5.5, borderRadius: "50%", background: "#6EE7B7",
                display: "inline-block", animation: "pulse 2s ease infinite"
              }} />
              <span style={{ fontSize: 9.5, color: "#6EE7B7", letterSpacing: "1.6px", textTransform: "uppercase", fontWeight: 500, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Secure mode active</span>
            </div>

            <h1 style={{
              fontFamily: "'Fraunces', serif", fontSize: 48, fontWeight: 300, color: "#fff",
              lineHeight: 1.13, letterSpacing: "-1px", marginBottom: 14
            }}>
              We'll find<br />
              <em style={{ fontStyle: "italic", color: "#6EE7B7" }}>your account,</em><br />
              <span style={{ color: "rgba(255,255,255,0.32)" }}>safely & fast</span>
            </h1>

            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.32)", fontWeight: 300, lineHeight: 1.85, marginBottom: 30, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Military-grade recovery with<br />zero-knowledge architecture.
            </p>

            <div style={{ display: "flex", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(110,231,183,0.09)" }}>
              {[["30s", "OTP Speed"], ["256-bit", "Encryption"], ["99.9%", "Uptime"]].map(([n, l], i) => (
                <div key={l} style={{
                  flex: 1, textAlign: "center", padding: "13px 10px",
                  background: "rgba(255,255,255,0.02)",
                  borderRight: i < 2 ? "1px solid rgba(110,231,183,0.07)" : "none"
                }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: "#6EE7B7" }}>{n}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", marginTop: 3, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel" style={{ background: "#F4F2FF", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 52px", position: "relative", overflow: "hidden" }}>

          {/* BG glows */}
          <div style={{
            position: "absolute", top: -130, right: -130, width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(110,231,183,0.09) 0%, transparent 70%)", pointerEvents: "none"
          }} />
          <div style={{
            position: "absolute", bottom: -100, left: -100, width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", pointerEvents: "none"
          }} />

          <div className="right-form" style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 2 }}>

            {/* Mobile brand */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, background: "#04050F",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Fraunces', serif", fontSize: 20, color: "#6EE7B7", fontWeight: 700
              }}>M</div>
              <span style={{ fontWeight: 600, color: "#0D0A26", fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Momentia</span>
              <div style={{ marginLeft: "auto", padding: "4px 10px", borderRadius: 20, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <span style={{ fontSize: 10.5, color: "#059669", fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>🔒 Secure Recovery</span>
              </div>
            </div>

            {/* Step dots */}
            {step < 4 && <StepDots step={step} />}

            {/* ── SUCCESS STATE ── */}
            {step === 4 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #059669, #10B981)",
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px",
                  animation: "successPop 0.6s cubic-bezier(.22,1,.36,1) both",
                  boxShadow: "0 16px 40px -8px rgba(16,185,129,0.5)"
                }}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <path d="M8 18L15 25L28 11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray="60" strokeDashoffset="0" style={{ animation: "checkDraw 0.5s 0.3s ease both" }} />
                  </svg>
                </div>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 400, color: "#0D0A26", marginBottom: 12 }}>
                  All done! 🎉
                </h2>
                <p style={{ fontSize: 14, color: "#8896B3", marginBottom: 32, lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Your password has been reset successfully.<br />Redirecting you to login...
                </p>
                <div style={{ width: "100%", height: 4, borderRadius: 2, background: "#E2DCFF", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", background: "linear-gradient(90deg, #059669, #10B981)",
                    animation: "slideIn 2.5s linear both", width: "100%", borderRadius: 2
                  }} />
                </div>
              </div>

            ) : step === 1 ? (
              /* ── STEP 1: Email ── */
              <div className="step-content padding-bottom-10">
                <h2 style={{
                  fontFamily: "'Fraunces', serif", fontSize: 40, fontWeight: 400, color: "#0D0A26",
                  letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 6
                }}>Forgot<br /><em style={{ color: "#10B981", fontStyle: "italic" }}>password?</em></h2>
                <p style={{ fontSize: 13, color: "#8896B3", marginBottom: 28, fontWeight: 300, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  No worries. Enter your email and we'll send a 6-digit code.
                </p>

                {error && <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{error}</div>}

                <Field label="Email address" type="email" name="email" placeholder="teddy@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />

                <button onClick={handleSendOtp} disabled={loading || !email} className="submit-btn"
                  style={{
                    width: "100%", padding: "15px", borderRadius: 14, border: "none",
                    background: "linear-gradient(135deg, #059669 0%, #10B981 55%, #34D399 100%)",
                    color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 14, fontWeight: 600, cursor: loading || !email ? "not-allowed" : "pointer",
                    opacity: loading || !email ? 0.65 : 1, marginBottom: 22,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "all 0.2s", boxShadow: "0 8px 28px -6px rgba(16,185,129,0.4)"
                  }}>
                  {loading ? (
                    <><span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Sending OTP...</>
                  ) : "Send OTP →"}
                </button>

                <p style={{ textAlign: "center", fontSize: 13, color: "#8896B3", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Remember it?{" "}
                  <span onClick={() => navigate("/login")} style={{ color: "#059669", fontWeight: 600, cursor: "pointer" }}>Back to login</span>
                </p>
              </div>

            ) : step === 2 ? (
              /* ── STEP 2: OTP ── */
              <div className="step-content">
                <h2 style={{
                  fontFamily: "'Fraunces', serif", fontSize: 40, fontWeight: 400, color: "#0D0A26",
                  letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 6
                }}>Check your<br /><em style={{ color: "#10B981", fontStyle: "italic" }}>inbox</em></h2>
                <p style={{ fontSize: 13, color: "#8896B3", marginBottom: 6, fontWeight: 300, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  We sent a 6-digit code to
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#0D0A26", marginBottom: 34, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {email}
                  <span onClick={() => setStep(1)} style={{ marginLeft: 10, fontSize: 12, color: "#059669", fontWeight: 500, cursor: "pointer" }}>Change ↩</span>
                </p>

                {error && <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{error}</div>}
                {message && <div style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#059669", marginBottom: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{message}</div>}

                {/* OTP boxes */}
                <div style={{ display: "flex", gap: 12, marginBottom: 32, justifyContent: "space-between" }} onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <OtpBox key={index} id={`otp-${index}`} value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)} />
                  ))}
                </div>

                <button onClick={handleVerifyOtp} disabled={otp.join("").length < 6} className="submit-btn"
                  style={{
                    width: "100%", padding: "15px", borderRadius: 14, border: "none",
                    background: "linear-gradient(135deg, #059669 0%, #10B981 55%, #34D399 100%)",
                    color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 14, fontWeight: 600, cursor: otp.join("").length < 6 ? "not-allowed" : "pointer",
                    opacity: otp.join("").length < 6 ? 0.65 : 1, marginBottom: 20,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s", boxShadow: "0 8px 28px -6px rgba(16,185,129,0.4)"
                  }}>
                  Verify Code →
                </button>

                {/* Timer + Resend */}
                <div style={{ textAlign: "center" }}>
                  {timer > 0 ? (
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 20,
                      background: "#F8F7FF", border: "1px solid #E2DCFF"
                    }}>
                      {/* Progress arc */}
                      <svg width="20" height="20" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" fill="none" stroke="#E2DCFF" strokeWidth="2" />
                        <circle cx="10" cy="10" r="8" fill="none" stroke="#10B981" strokeWidth="2"
                          strokeDasharray={`${(timer / 30) * 50.3} 50.3`}
                          strokeLinecap="round" transform="rotate(-90 10 10)" style={{ transition: "stroke-dasharray 1s linear" }} />
                      </svg>
                      <span style={{ fontSize: 12, color: "#8896B3", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Resend in <strong style={{ color: "#0D0A26" }}>{timer}s</strong>
                      </span>
                    </div>
                  ) : (
                    <span onClick={handleSendOtp} style={{ fontSize: 13, color: "#059669", fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Resend OTP ↺
                    </span>
                  )}
                </div>
              </div>

            ) : step === 3 ? (
              /* ── STEP 3: New Password ── */
              <div className="step-content">
                <h2 style={{
                  fontFamily: "'Fraunces', serif", fontSize: 40, fontWeight: 400, color: "#0D0A26",
                  letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 6
                }}>New<br /><em style={{ color: "#10B981", fontStyle: "italic" }}>password</em></h2>
                <p style={{ fontSize: 13, color: "#8896B3", marginBottom: 28, fontWeight: 300, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Create a strong password for your account.
                </p>

                {error && <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{error}</div>}

                {/* Password strength */}
                {password && (() => {
                  const score = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
                  const label = ["", "Weak", "Fair", "Good", "Strong"][score];
                  const color = ["", "#EF4444", "#F59E0B", "#3B82F6", "#10B981"][score];
                  return (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i <= score ? color : "#E2DCFF", transition: "all 0.3s" }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 11, color, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {label} password
                      </span>
                    </div>
                  );
                })()}

                <div style={{ position: "relative", marginBottom: 20 }}>
                  <Field label="New Password" type={showPass ? "text" : "password"} name="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <span onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: 38, cursor: "pointer", fontSize: 16, opacity: 0.5 }}>
                    {showPass ? "🙈" : "👁️"}
                  </span>
                </div>

                <Field label="Confirm Password" type="password" name="confirm" placeholder="Repeat your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                {/* Match indicator */}
                {confirmPassword && (
                  <div style={{
                    marginBottom: 16, fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: password === confirmPassword ? "#059669" : "#EF4444"
                  }}>
                    {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
                  </div>
                )}

                <button onClick={handleResetPassword} disabled={loading || !password || !confirmPassword} className="submit-btn"
                  style={{
                    width: "100%", padding: "15px", borderRadius: 14, border: "none",
                    background: "linear-gradient(135deg, #059669 0%, #10B981 55%, #34D399 100%)",
                    color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 14, fontWeight: 600, cursor: loading || !password || !confirmPassword ? "not-allowed" : "pointer",
                    opacity: loading || !password || !confirmPassword ? 0.65 : 1, marginBottom: 20,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "all 0.2s", boxShadow: "0 8px 28px -6px rgba(16,185,129,0.4)"
                  }}>
                  {loading ? (
                    <><span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Resetting...</>
                  ) : "Reset Password →"}
                </button>
              </div>
            ) : null}

          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
