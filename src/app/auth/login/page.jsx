"use client";

import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.includes("@") || !email.includes(".")) {
      return setError("Enter a valid email");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 IMPORTANT: cookies ke liye
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return setError(data.error || "Login failed");
      }

      // localStorage.setItem("user", JSON.stringify(data.user)); // ❌ Ab zarurat nahi

      // 🔥 Navbar ko signal bhejo ki user login ho gaya
      window.dispatchEvent(new Event("profile-updated"));

      // Redirect to home
      router.push("/");

    } catch (err) {
      setError("Server error. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Login
        </h1>

        {error && (
          <p className="text-red-500 mb-2 text-sm text-center">{error}</p>
        )}

        <div className="flex flex-col gap-4">
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border outline-none"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* 🔑 Forgot Password */}
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 text-right hover:underline"
          >
            Forgot Password?
          </Link>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="text-gray-600 text-sm text-center mt-4">
          {`Don't have an account? `}
          <Link href="/auth/signup" className="underline text-blue-600">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}