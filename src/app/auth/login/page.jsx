"use client";

import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { Great_Vibes } from "next/font/google";
import FloatingLines from "@/app/components/FloatingLines ";

  const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

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

      console.log("Login successful:", data);

   
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("Token saved to localStorage");
      }


      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      window.dispatchEvent(new Event("profile-updated"));


      alert("✅ Login successful!");

 
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex justify-center items-center bg-black/80 p-4 ">
      <div className="absolute inset-0 z-0  ">
        <FloatingLines  interactive={true}
        lineCount={4}
        lineDistance={100} />
      </div>
     
<div className="absolute inset-0 bg-black/20 z-[1] pointer-events-none" />
      <div className="bg-gray/900 p-8 rounded-2xl border-t border-gray-10  relative shadow-black shadow-2xl w-full max-w-md">
        <h1 className={`${greatVibes.className} text-5xl font-bold text-gray-300  text-center mt-4 mb-8 `}>
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
            className="w-full p-3 rounded-lg border-y text-gray-300 outline-none placeholder-gray-200"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border-y  text-gray-300 outline-none placeholder-gray-200"
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-gray-300"
            >
              {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* 🔑 Forgot Password */}
          <Link
            href="/auth/forgot-password"
            className="text-sm text-gray-200 text-right hover:underline"
          >
            Forgot Password?
          </Link>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
                className="bg-transparent shadow-black/80 shadow-lg border-transparent hover:bg-blue-500 text-white py-3 rounded-lg font-semibold "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="text-gray-300 text-sm text-center mt-4">
          {`Don't have an account?  `}
          <Link href="/auth/signup" className="underline text-blue-100">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
