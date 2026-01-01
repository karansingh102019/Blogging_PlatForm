"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DashboardNav from "../components/dashboardNav";
import Link from "next/link";

export default function DashboardHome() {
  const [userName, setUserName] = useState("User");
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    drafts: 0,
    published: 0,
  });

  // 🔁 LOAD DASHBOARD DATA (REAL TIME)
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // 👤 PROFILE
      const profileRes = await fetch("/api/profile", {
        credentials: "include",
      });
      const profileData = await profileRes.json();
      if (profileData?.name) {
        setUserName(profileData.name);
      }

      // 📝 PUBLISHED BLOGS (myblog API)
      const blogRes = await fetch("/api/blog/myblog", {
        credentials: "include",
      });
      const blogData = await blogRes.json();

      const publishedList = Array.isArray(blogData)
        ? blogData
        : blogData.blogs || blogData.data || [];

      // 📝 DRAFT BLOGS
      const draftRes = await fetch("/api/blog/draft", {
        credentials: "include",
      });
      const draftData = await draftRes.json();

      const draftList = Array.isArray(draftData)
        ? draftData
        : draftData.blogs || draftData.data || [];

      // 📊 STATS
      const published = publishedList.length;
      const drafts = draftList.length;
      const total = published + drafts;

      setStats({ total, drafts, published });

      // Recent blogs: combine both (published + drafts) and show latest 5
      const allBlogs = [...publishedList, ...draftList].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBlogs(allBlogs.slice(0, 5));
    } catch (err) {
      console.error("Dashboard API error:", err);
    }
  };

  const deleteBlog = async (id) => {
    if (!confirm("Delete this blog?")) return;

    const res = await fetch("/api/blog/delete", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) setBlogs(blogs.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen">
      <DashboardNav />
      
      {/* Main Container with proper padding and max-width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        
        {/* Grid Layout: Stack on mobile, Side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Hero Card */}
            <div className="relative rounded-xl shadow-xl overflow-hidden backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
                
                {/* Text Content */}
                <div className="flex-1 text-center lg:text-left z-10">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-6  mt-6  font-semibold text-white">
                    Hello {userName}!
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base mb-9 leading-relaxed">
                    This is your blogging workspace where you can create new posts, 
                    edit existing ones, and manage all your content easily. Save drafts, 
                    publish anytime, and handle your blog without any hassle.
                  </p>
                  <Link href="/dashboard/createBlog">
                    <button className="py-2.5 sm:py-3 px-6 sm:px-8 text-sm sm:text-base rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all">
                      Create Blog
                    </button>
                  </Link>
                </div>

                {/* Image - Hidden on mobile, shown on large screens */}
                <div className="hidden  flex-shrink-0">
                  <Image
                    src="/Cht.png"
                    alt="Dashboard illustration"
                    width={300}
                    height={300}
                    className="w-64 xl:w-80 h-auto object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Recent Blogs Section */}
            <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-5 sm:p-6 rounded-xl shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl text-gray-300 font-semibold">
                  My Recent Blogs
                </h2>
                <Link 
                  href="/dashboard/myBlog"
                  className="text-blue-600 hover:underline text-sm sm:text-base font-medium"
                >
                  View All Blogs →
                </Link>
              </div>

              {/* Blogs List */}
              <div className="space-y-4">
                {blogs.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-8">
                    No blogs created yet. Start by creating your first blog!
                  </p>
                )}

                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-black/60 backdrop-blur-xl p-4 rounded-xl shadow hover:shadow-lg transition"
                  >
                    {/* Left section */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <Image
                        src={blog.thumbnail || "/pancrad.png"}
                        width={48}
                        height={48}
                        alt="blog thumbnail"
                        className="rounded-full w-10 h-10 sm:w-12 sm:h-12 object-cover flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg text-gray-300 truncate">
                          {blog.title}
                        </h3>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">
                          {new Date(blog.createdAt).toDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex gap-3 sm:gap-4 justify-end sm:justify-start flex-shrink-0">
                      <Link
                        href={`/dashboard/createBlog?edit=${Number(blog.id)}`}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteBlog(blog.id)}
                        className="text-red-500 hover:underline text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Stats Cards */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="space-y-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-xl shadow-xl rounded-xl p-5">
              <h3 className="text-lg sm:text-xl font-bold text-gray-300 mb-4 pb-3 border-b-2 border-gray-200">
                Blog Statistics
              </h3>

              {/* Stats Cards Grid - 2 columns on mobile, 1 on desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                
                {/* Published Card */}
                <div className="bg-black/50 backdrop-blur-xl border-y-4 border-green-600 p-4 rounded-lg hover:shadow-md transition">
                  <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-3">
                    <div className="text-center lg:text-left">
                      <p className="text-green-700 text-xs font-semibold mb-1 uppercase tracking-wide">
                        Published
                      </p>
                      <h2 className="text-3xl sm:text-4xl font-bold text-green-600">
                        {stats.published}
                      </h2>
                      <p className="text-green-600 text-xs mt-1">Live Blogs</p>
                    </div>
                    <div className="bg-green-600 p-2.5 sm:p-3 rounded-lg">
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Drafts Card */}
                <div className="bg-black/50 backdrop-blur-xl border-y-4 border-orange-600 p-4 rounded-lg hover:shadow-md transition">
                  <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-3">
                    <div className="text-center lg:text-left">
                      <p className="text-orange-700 text-xs font-semibold mb-1 uppercase tracking-wide">
                        Drafts
                      </p>
                      <h2 className="text-3xl sm:text-4xl font-bold text-orange-600">
                        {stats.drafts}
                      </h2>
                      <p className="text-orange-600 text-xs mt-1">Pending</p>
                    </div>
                    <div className="bg-orange-600 p-2.5 sm:p-3 rounded-lg">
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Total Card - Full width on mobile grid */}
                <div className="col-span-2 lg:col-span-1 bg-black/50 backdrop-blur-xl border-y-4 border-blue-600 p-4 rounded-lg hover:shadow-md transition">
                  <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-3">
                    <div className="text-center lg:text-left">
                      <p className="text-blue-700 text-xs font-semibold mb-1 uppercase tracking-wide">
                        Total Blogs
                      </p>
                      <h2 className="text-3xl sm:text-4xl font-bold text-blue-600">
                        {stats.total}
                      </h2>
                      <p className="text-blue-600 text-xs mt-1">All Content</p>
                    </div>
                    <div className="bg-blue-600 p-2.5 sm:p-3 rounded-lg">
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t-2 border-gray-200">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Link
                    href="/dashboard/createBlog"
                    className="block w-full text-center py-2.5 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition text-sm font-medium"
                  >
                    + Create New Blog
                  </Link>
                  <Link
                    href="/dashboard/drafts"
                    className="block w-full text-center py-2.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition text-sm font-medium"
                  >
                    View Drafts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}