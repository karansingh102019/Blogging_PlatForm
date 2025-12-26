"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiPenTool,
  FiBook,
  FiArchive,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { SidebarContext } from "@/context/SidebarContext";
import Silk from "../components/silk";
import DarkVeil from "../components/silk";

const navitems = [
  { name: "Dashboard", icon: <FiHome />, link: "/dashboard" },
  { name: "Create Blog", icon: <FiPenTool />, link: "/dashboard/createBlog" },
  { name: "My Blogs", icon: <FiBook />, link: "/dashboard/myBlog" },
  { name: "Drafts", icon: <FiArchive />, link: "/dashboard/drafts" },
  { name: "Profile", icon: <FiUser />, link: "/dashboard/profile" },
  { name: "HomePage", icon: <FiHome/>, link:"/"}
];

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // ⭐ Load logged-in user
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      fetch("/api/profile", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch(() => setUser(null));
    };

    loadUser();
    window.addEventListener("profile-updated", loadUser);

    return () => window.removeEventListener("profile-updated", loadUser);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="flex relative min-h-screen">
        <div className="fixed inset-0 z-0 pointer-events-none">
           <DarkVeil />
        </div>

        {/* MOBILE OVERLAY */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* SIDEBAR - FIXED */}
        <aside
          className={`fixed top-0 left-0 h-screen backdrop-blur-xl bg-black/60 shadow-2xl transition-all duration-300 z-50 flex flex-col
            ${isOpen ? "w-72" : "w-20"}
            ${
              isMobileOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
        >
          {/* Header Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              {isOpen ? (
                <Link href="/" className="-m-2 -ml-6">
                  <svg
                    width="150"
                    height="50"
                    viewBox="0 0 330 120"
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
              ) : (
                <Link href="/" className="-m-6">
                  <svg
                    width="150"
                    height="50"
                    viewBox="0 0 330 120"
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
                  </svg>
                </Link>
              )}

              {/* Toggle Button - Desktop */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="hidden -ml-15 lg:flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
              >
                {isOpen ? (
                  <FiChevronLeft size={18} />
                ) : (
                  <FiChevronRight size={12} />
                )}
              </button>

              {/* Close Button - Mobile */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden text-white -m-8"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="relative">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="user"
                    width={80}
                    height={80}
                    className={`rounded-full border-4 border-blue-400 object-cover transition-all duration-300 ${
                      isOpen ? "w-20 h-20" : "w-12 h-12"
                    }`}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.name || "User"
                      )}&background=3b82f6&color=fff&size=128`;
                    }}
                  />
                ) : (
                  <div
                    className={`rounded-full border-4 border-blue-400 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold transition-all duration-300 ${
                      isOpen ? "w-20 h-20 text-2xl" : "w-12 h-12 text-lg"
                    }`}
                  >
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                )}

                {/* Online Status Indicator */}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-black rounded-full"></div>
              </div>

              {/* User Info */}
              {isOpen && (
                <div className="mt-4 text-center">
                  <h3 className="font-bold text-white text-lg">
                    {user?.name || "Guest User"}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {user?.email || "guest@example.com"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navitems.map((item, i) => {
              const active = pathname === item.link;

              return (
                <Link
                  key={i}
                  href={item.link}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative
                    ${
                      active
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {/* Icon */}
                  <span className={`text-xl ${active ? "scale-110" : ""}`}>
                    {item.icon}
                  </span>

                  {/* Label */}
                  {isOpen && <span className="font-medium">{item.name}</span>}

                  {/* Active Indicator */}
                  {active && (
                    <div className="absolute right-4 w-2 h-2 bg-white rounded-full"></div>
                  )}

                  {/* Tooltip for Collapsed State */}
                  {!isOpen && (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.name}
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group relative`}
            >
              <FiLogOut size={20} />
              {isOpen && <span className="font-medium">Logout</span>}

              {/* Tooltip for Collapsed State */}
              {!isOpen && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  Logout
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </button>
          </div>
        </aside>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-30 lg:hidden bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg text-gray-600 hover:bg-white"
        >
          <FiMenu size={24} />
        </button>

        {/* MAIN CONTENT */}
        <main
          className={`flex-1 transition-all duration-300 relative z-10 ${
            isOpen ? "lg:ml-72" : "lg:ml-20"
          }`}
        >
          <div className="pl-6 pt-0 lg:pl-8 lg:pt-0">{children}</div>
        </main>
      </div>
    </SidebarContext.Provider>
  );
}