"use client";
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { SidebarContext } from "@/context/SidebarContext";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";

export default function DashboardNav() {
  const { isOpen, setIsOpen, isMobileOpen, setIsMobileOpen } =
    useContext(SidebarContext);
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

  return (
    <nav className="flex justify-between items-center px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 backdrop-blur-md sm:backdrop-blur-xl bg-black/30 mb-4 sm:mb-5 md:mb-6 shadow-sm sticky z-40 top-0 rounded-bl-lg">
      {/* LEFT - Hamburger + Title */}
      <div className="flex gap-2 sm:gap-3 items-center">
        {/* Hamburger Menu - Mobile Only */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden text-gray-300 hover:text-white transition p-1"
        >
          <FiMenu size={24} />
        </button>

        {/* <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg  text-white"
        >
          <FiMenu size={24} />
        </button> */}

        <h1 className="text-base sm:text-lg md:text-xl text-gray-300 font-semibold">
          Dashboard
        </h1>
      </div>

      {/* RIGHT — User Info */}
      <div className="flex gap-2 sm:gap-2.5 md:gap-3 items-center text-gray-400">
        <h3 className="font-medium text-xs sm:text-sm md:text-base hidden md:block">
          {user?.name || "Guest"}
        </h3>
        <Link href={"/dashboard/profile"}>
          <Image
            src={user?.avatar || "/default-avatar.png"}
            width={32}
            height={32}
            alt="user"
            className="rounded-full border w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8 shadow cursor-pointer object-cover"
            quality={75}
            sizes="(max-width: 768px) 28px, 32px"
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "User"
              )}&background=3b82f6&color=fff&size=128`;
            }}
          />
        </Link>
      </div>
    </nav>
  );
}
