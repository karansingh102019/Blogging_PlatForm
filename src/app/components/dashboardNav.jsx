"use client";
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { FiMenu, FiSearch } from "react-icons/fi";
import { SidebarContext } from "@/context/SidebarContext";
import Link from "next/link";

export default function DashboardHome() {
  const { isOpen, setIsOpen } = useContext(SidebarContext);

  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);

  // ⭐ Load logged-in user from localStorage
useEffect(() => {
  const loadUser = () => {
    fetch("/api/profile", { credentials: "include" })
      .then(res => res.json())
      .then(data => setUser(data));
  };

  loadUser();
  window.addEventListener("profile-updated", loadUser);

  return () =>
    window.removeEventListener("profile-updated", loadUser);
}, []);



  const handleSearch = () => {
    console.log("Searching for:", query);
  };

  return (
    
     
      <nav className="flex justify-between px-6 py-4 backdrop-blur-xl bg-black/30 mb-6 shadow-sm sticky z-40 top-0 rounded-bl-lg ">

        {/* LEFT - Menu + Title */}
        <div className="flex gap-2 items-center">

          <h1 className="text-xl text-gray-300 font-semibold">Dashboard</h1>
        </div>

        {/* RIGHT — User Info */}
        <div className="flex gap-3 items-center text-gray-400">
          <h3 className="font-medium hidden md:block">
            {user?.name || "Guest"}
          </h3>
          <Link href={"/dashboard/profile"} >
          
          
       
          <Image
            src={user?.avatar || "/default-avatar.png"}
            width={10}
            height={10}
            alt="user"
            className="rounded-full border w-8 h-8  shadow cursor-pointer"
          />
             </Link>
        </div>
      </nav>
    
  );
}
