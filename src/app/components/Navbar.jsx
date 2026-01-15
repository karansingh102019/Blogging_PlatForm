"use client";
import Link from "next/link";
import { FiMenu, FiX, FiChevronDown, FiLogOut } from "react-icons/fi";
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

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="fixed py-2 px-4 sm:px-6 top-0 w-full z-50 transition-all duration-300 backdrop-blur-md sm:backdrop-blur-xl bg-black/60 border-b-[0.5px] border-white/10">
      <div className="flex items-center justify-between">
        {/* Logo - Responsive sizing */}
        <Link href="/" className="flex-shrink-0">
          <svg
            viewBox="0 0 360 130"
            className="w-[120px] h-[40px] sm:w-[150px] sm:h-[50px]"
            fill="none"
          >
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
              x={isDesktop ? 140 : 160}
              y={isDesktop ? 95 : 100}
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
        <div className="hidden md:flex items-center gap-3 lg:gap-8 text-gray-400">
          <Link
            href="/"
            className="relative px-2 lg:px-4 py-2 text-sm lg:text-[16px] font-medium text-gray-500 transition-all duration-300 group hover:text-blue-600 whitespace-nowrap"
          >
            Home
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#313b86]/20 to-[#313b86]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#313b86] to-[#313b86] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
          </Link>

          <Link
            href="/blog"
            className="relative px-2 lg:px-4 py-2 text-sm lg:text-[16px] font-medium text-gray-500 transition-all duration-300 group hover:text-blue-600 whitespace-nowrap"
          >
            Blogs
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#313b86]/20 to-[#313b86]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#313b86] to-[#313b86] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
          </Link>

          <Link
            href="/#about"
            className="relative px-2 lg:px-4 py-2 text-sm lg:text-[16px] font-medium text-gray-500 transition-all duration-300 group hover:text-blue-600 whitespace-nowrap"
          >
            About
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#313b86]/20 to-[#313b86]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#313b86] to-[#313b86] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
          </Link>

          <Link
            href="/#contact"
            className="relative px-2 lg:px-4 py-2 text-sm lg:text-[16px] font-medium text-gray-500 transition-all duration-300 group hover:text-blue-600 whitespace-nowrap"
          >
            Contact
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#313b86]/20 to-[#313b86]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#313b86] to-[#313b86] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
          </Link>

          {!user && (
            <>
              <Link
                href="/auth/login"
                className="relative px-2 lg:px-4 py-2 text-sm lg:text-[16px] font-medium text-gray-500 transition-all duration-300 group hover:text-blue-600 whitespace-nowrap"
              >
                Login
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#313b86]/20 to-[#313b86]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#313b86] to-[#313b86] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
              </Link>

              <Link
                href="/auth/signup"
                className="relative px-2 lg:px-4 py-2 text-sm lg:text-[16px] font-medium text-gray-500 transition-all duration-300 group hover:text-blue-600 whitespace-nowrap"
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
                className="relative px-2 lg:px-4 py-2 text-sm lg:text-[16px] font-medium text-gray-500 transition-all duration-300 group hover:text-blue-600 whitespace-nowrap"
              >
                Dashboard
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#313b86]/20 to-[#313b86]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#313b86] to-[#313b86] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
              </Link>

              {/* Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 lg:gap-2 hover:text-blue-600 whitespace-nowrap"
                >
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      width={32}
                      height={32}
                      className="rounded-full border w-[28px] h-[28px] lg:w-[32px] lg:h-[32px]"
                      alt="avatar"
                      quality={75}
                      sizes="(max-width: 768px) 28px, 32px"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src =
                          "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(user.name || "User");
                      }}
                    />
                  ) : (
                    <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs lg:text-sm font-bold">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                  )}
                  <span className="text-sm lg:text-base max-w-[80px] lg:max-w-none truncate">
                    {user.name}
                  </span>
                  <FiChevronDown
                    size={16}
                    className="lg:w-[18px] lg:h-[18px]"
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute -right-3 backdrop-blur-md sm:backdrop-blur-xl top-12 mt-3 w-48 bg-white/10 shadow-lg rounded-lg py-2 animate-slideDown">
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 hover:bg-gray-800 text-gray-300"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-200 flex items-center gap-2"
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
        <button
          className="md:hidden text-gray-400 flex-shrink-0"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-black/20 rounded-lg shadow-lg border border-gray-100 overflow-hidden max-h-[calc(100vh-80px)] overflow-y-auto">
          {/* Navigation Links */}
          <div>
            <Link
              href="/"
              className="flex items-center justify-between px-5 py-4 hover:bg-white/20 transition-colors group"
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-gray-300 font-medium group-hover:text-blue-600 transition-colors">
                Home
              </span>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            <Link
              href="/blog"
              className="flex items-center justify-between px-5 py-4 hover:bg-white/20 transition-colors group"
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-gray-300 font-medium group-hover:text-blue-600 transition-colors">
                Blogs
              </span>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            <Link
              href="/#about"
              className="flex items-center justify-between px-5 py-4 hover:bg-white/20 transition-colors group"
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-gray-300 font-medium group-hover:text-blue-600 transition-colors">
                About
              </span>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            <Link
              href="/#contact"
              className="flex items-center justify-between px-5 py-4 hover:bg-white/20 transition-colors group"
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-gray-300 font-medium group-hover:text-blue-600 transition-colors">
                Contact
              </span>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* Auth Section */}
          {!user && (
            <div className="p-4 bg-black/20 space-y-3">
              <Link
                href="/auth/login"
                className="flex items-center justify-center w-full px-5 py-3 bg-black text-gray-300 font-semibold rounded-lg border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center justify-center w-full px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* User Menu */}
          {user && (
            <div className="bg-black/10">
              <div>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-5 py-4 hover:bg-white/20 transition-colors group"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg
                    className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  <span className="text-gray-300 font-medium group-hover:text-blue-600 transition-colors">
                    Dashboard
                  </span>
                </Link>

                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-5 py-4 hover:bg-white/20 transition-colors group"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg
                    className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-gray-300 font-medium group-hover:text-blue-600 transition-colors">
                    Profile
                  </span>
                </Link>
              </div>

              <div className="p-4">
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
