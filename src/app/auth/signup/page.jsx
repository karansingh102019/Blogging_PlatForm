"use client";

import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || name.trim().length < 3)
      return setError("Name must be at least 3 characters");

    if (!email.includes("@") || !email.includes("."))
      return setError("Enter a valid email");

    if (password.length < 6)
      return setError("Password must be at least 6 characters");

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) return setError(data.error || "Signup failed");

      alert("Account Created Successfully!");
      router.push("/auth/login");
    } catch (err) {
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Sign Up</h1>

        {error && <p className="text-red-500 mb-2 text-sm text-center">{error}</p>}

        <div className="flex flex-col gap-4">

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full p-3 rounded-lg border outline-none"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border outline-none"
          />

          {/* Password + toggle */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
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

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Social Logins */}
          <div className="flex flex-col gap-3 mt-2">
            <button className="flex items-center justify-center gap-2 border py-2 rounded-lg">
              <FcGoogle size={22} /> Sign Up with Google
            </button>

            <button className="flex items-center justify-center gap-2 border py-2 rounded-lg">
              <FaGithub size={22} /> Sign Up with GitHub
            </button>
          </div>
        </div>

        <p className="text-gray-600 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline text-blue-600">Login</Link>
        </p>
      </div>
    </div>
  );
}
