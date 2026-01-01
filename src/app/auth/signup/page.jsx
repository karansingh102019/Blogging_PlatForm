"use client";

import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";
import FloatingLines from "@/app/components/FloatingLines ";
import { Great_Vibes } from "next/font/google";


const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

export default function Signup() {
  const router = useRouter();

  const [step, setStep] = useState(1); // 1: Signup Form, 2: OTP Verification
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tempUserId, setTempUserId] = useState(null);

  // Step 1: Send OTP
  const handleSignup = async () => {
    if (!name || name.trim().length < 3) {
      return setError("Name must be at least 3 characters");
    }

    if (!email.includes("@") || !email.includes(".")) {
      return setError("Enter a valid email");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return setError(data.error || "Failed to send OTP");
      }

      console.log("OTP sent successfully:", data);
      setTempUserId(data.tempUserId);
      setStep(2); // Move to OTP verification step
      alert("✅ OTP sent to your email! Check your inbox.");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      return setError("Please enter 6-digit OTP");
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tempUserId,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return setError(data.error || "Invalid OTP");
      }

      console.log("OTP verified:", data);
      alert("✅ Account created successfully! Please login.");
      router.push("/auth/login");
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tempUserId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return setError(data.error || "Failed to resend OTP");
      }

      alert("✅ New OTP sent to your email!");
    } catch (err) {
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="absolute inset-0 z-0  ">
              <FloatingLines  interactive={true}
              lineCount={4}
              lineDistance={100} />
            </div>
      <div className="absolute inset-0 bg-black/20 z-[1] pointer-events-none" />
      <div className="bg-gray/80 p-8 rounded-2xl border-t border-gray-10 relative shadow-black shadow-2xl w-full max-w-md">
        {step === 1 ? (
          // Step 1: Signup Form
          <>
            <div className="text-center mb-10">
              <h1 className={`text-5xl font-bold text-gray-200 ${greatVibes.className} my-4 `}>
                Create Account
              </h1>
              <p className="text-gray-300 text-sm mt-2">
                Join us today and start your journey
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4 ">
              {/* Name */}
              <div className="relative  ">
                <FiUser
                  className="absolute left-3 top-4 text-gray-300"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-medium pl-10 pr-4 py-3 rounded-lg border-y text-gray-300 outline-none placeholder-gray-200 "
                />
              </div>

              {/* Email */}
              <div className="relative">
                <FiMail
                  className="absolute left-3 top-4 text-gray-300"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full  text-medium pl-10 pr-4 py-3 rounded-lg border-y text-gray-300 outline-none placeholder-gray-200 "
                />
              </div>

              {/* Password */}
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-4 text-gray-300"
                  size={18}
                />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-medium pl-10 pr-4 py-3 rounded-lg border-y text-gray-300  placeholder-text-sm placeholder-gray-200 "
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              {/* Signup Button */}
              <button
                onClick={handleSignup}
                disabled={loading}
                className="bg-transparent mt-4 shadow-black shadow-lg border-transparent hover:bg-blue-500 text-white py-3 rounded-lg font-semibold "
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>

            <p className="text-gray-400 text-sm text-center mt-6">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </>
        ) : (
          // Step 2: OTP Verification
          <>
            <div className="text-center mb-6">
             
              <h1 className="text-3xl font-bold text-gray-200 mb-6 ">Verify OTP</h1>
              <p className="text-gray-300 text-sm mt-2">
                We sent a 6-digit code to
              </p>
              <p className="text-green-500 font-semibold">{email}</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* OTP Input */}
              <div>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(value);
                  }}
                  maxLength={6}
                  className="w-full px-4 py-3 text-gray-100 placeholder-gray-200 rounded-lg border-y border-gray-300  text-center text-2xl font-bold tracking-widest"
                />
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </span>
                ) : (
                  "Verify & Create Account"
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-blue-600 text-sm font-semibold hover:underline disabled:opacity-50"
                >
                  {`Didn't receive code? Resend OTP`}
                </button>
              </div>

              {/* Back Button */}
              <button
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setError("");
                }}
                className="text-gray-300 text-sm"
              >
                ← Back to signup
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
