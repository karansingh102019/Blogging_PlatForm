"use client";
import Link from "next/link";
import {
  FiHome,
  FiLogIn,
  FiUserPlus,
  FiUser,
  FiSearch,
  FiMenu,
  FiX,
  FiChevronDown,
  FiLogOut,
} from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load user from API
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/profile", {
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();

        if (data && data.id) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Navbar load user error:", err);
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("profile-updated", loadUser);

    return () => {
      window.removeEventListener("profile-updated", loadUser);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      setDropdownOpen(false);

      // Redirect to home
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSearch = () => {
    console.log("Searching for:", query);
  };

  return (
    <nav className="fixed py-2 px-4 sm:px-6 top-0 w-full z-50 transition-all duration-300 backdrop-blur-xl bg-black/60 border-b-[0.5px] border-white/10">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <svg width="150" height="50" viewBox="0 0 330 120" fill="none">
            <g transform="scale(0.8) translate(10, 15)">
              <path
                d="M40 100 L40 20 L70 20 L70 70 L110 20 L150 20 L150 100 L120 100 L120 50 L85 100 L40 100 Z"
                stroke="#3247e6"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            <text
              x="140"
              y="95"
              fontFamily="Inter, Poppins, sans-serif"
              fontSize="60"
              fontWeight="600"
              fill="#3247e6"
              letterSpacing="4"
            >
              EXUS
            </text>
          </svg>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-400">
          <Link
            href="/"
            className="relative px-3 lg:px-4 py-2 lg:text-[16px] font-medium text-gray-500 transition-all duration-300 group hover:text-blue-600"
          >
            Home
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#313b86]/20 to-[#313b86]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#313b86] to-[#313b86] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
          </Link>

          <Link
            href="/blog"
            className="relative px-3 lg:px-4 py-2 lg:text-[16px] font-medium text-gray-500 transition-all duration-300 group hover:text-blue-600"
          >
            Blogs
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#313b86]/20 to-[#313b86]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#313b86] to-[#313b86] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
          </Link>

          {/* 🔥 About Link */}
          <Link
            href="/#about"
            className="relative px-3 lg:px-4 py-2 lg:text-[16px] font-medium text-gray-500 transition-all duration-300 group hover:text-blue-600"
          >
            About
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#313b86]/20 to-[#313b86]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#313b86] to-[#313b86] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
          </Link>

          {/* 🔥 Contact Link */}
          <Link
            href="/#contact"
            className="relative px-3 lg:px-4 py-2 lg:text-[16px] font-medium text-gray-500 transition-all duration-300 group hover:text-blue-600"
          >
            Contact
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#313b86]/20 to-[#313b86]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#313b86] to-[#313b86] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
          </Link>

          {!user && (
            <>
              <Link
                href="/auth/login"
                className="relative px-3 lg:px-4 py-2 lg:text-[16px] font-medium text-gray-500 transition-all duration-300 group hover:text-blue-600"
              >
                Login
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#313b86]/20 to-[#313b86]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#313b86] to-[#313b86] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
              </Link>

              <Link
                href="/auth/signup"
                className="relative px-3 lg:px-4 py-2 lg:text-[16px] font-medium text-gray-500 transition-all duration-300 group hover:text-blue-600"
              >
                Signup
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#313b86]/20 to-[#313b86]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#313b86] to-[#313b86] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
              </Link>
            </>
          )}

          {user && (
            <>
              {/* Dashboard */}
              <Link
                href="/dashboard"
                className="relative px-3 lg:px-4 py-2 lg:text-[16px] font-medium text-gray-500 transition-all duration-300 group hover:text-blue-600"
              >
                Dashboard
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#313b86]/20 to-[#313b86]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#313b86] to-[#313b86] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
              </Link>

              {/* Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:text-blue-600"
                >
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      width={28}
                      height={28}
                      className="rounded-full border w-[40px] h-[40px]"
                      alt="avatar"
                      onError={(e) => {
                        e.target.src =
                          "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(user.name || "User");
                      }}
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                  )}
                  <span>{user.name}</span>
                  <FiChevronDown size={18} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-lg border py-2 animate-fadeIn">
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 flex items-center gap-2"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-400" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-4 text-gray-400">
          <Link href="/" className="block hover:text-red-600" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link href="/blogs" className="block hover:text-red-600" onClick={() => setMenuOpen(false)}>
            Blogs
          </Link>

          {/* 🔥 About - Mobile */}
          <Link href="/#about" className="block hover:text-red-600" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          {/* 🔥 Contact - Mobile */}
          <Link href="/#contact" className="block hover:text-red-600" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>

          {!user && (
            <>
              <Link href="/auth/login" className="block hover:text-red-600" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link href="/auth/signup" className="block hover:text-red-600" onClick={() => setMenuOpen(false)}>
                Signup
              </Link>
            </>
          )}

          {user && (
            <>
              <Link href="/dashboard" className="block hover:text-red-600" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>

              <Link href="/dashboard/profile" className="block hover:text-red-600" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block text-red-600 hover:text-red-700 w-full text-left"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}