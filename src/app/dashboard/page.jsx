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
  }, [ ]);

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

      // 📝 MY BLOGS
      const blogRes = await fetch("/api/blog/myblog", {
        credentials: "include",
      });
      const blogData = await blogRes.json();

      const list = Array.isArray(blogData)
        ? blogData
        : blogData.blogs || blogData.data || [];

      // recent blogs (max 5)
      setBlogs(list.slice(0, 5));

      
      // 📊 STATS
      const total = list.length;


      const drafts = list.filter((b) => b.status === "draft").length;
      const published = list.filter((b) => b.status === "published").length;

      setStats({ total, drafts, published });
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
    <div>
      <DashboardNav />
      <div className=" flex justify-between">
        {/* big card  */}
        <div className="w-full pr-5">
          <div className=" flex justify-between rounded-xl shadow-xl items-center overflow-hidden h-65  backdrop-blur-xl  bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-6 text-white shadow mb-8">
            {/* left text side */}
            <div className="justify-center">
              <h2 className="text-2xl mb-4 font-semibold">Hello {userName}!</h2>
              <span className="text-gray-300"> 
                <p>
                  This is your blogging workspace.
                  <br /> where you can create new posts, edit existing ones, and
                  manage all your content easily. Save drafts, publish anytime,
                  and handle your blog without any hassle.
                </p>
              </span>
              <button 
              className="py-2 mt-6 px-4 text-[14px] rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 ">

                <Link href={"/dashboard/createBlog"}>
                Create Blog
                </Link>
              </button>
            </div>

            {/* right image side */}
            <Image
              src="/Cht.png"
              alt="user"
              width={500}
              height={500}
              className="  w-100 h-80 -mt-7 mr-9"
            />
          </div>

          {/*My Blogs  */}
          <div className=" backdrop-blur-xl  bg-gradient-to-r from-blue-500/20 to-purple-600/20  mb-6 p-5 rounded-xl shadow w-full">
            <div className="flex items-center justify-between mb-6 mt-3">
              <h2 className="text-xl text-gray-300 font-semibold">
                My Recent Blogs
              </h2>
              <button className=" text-blue-600 hover:underline text-sm">
                <Link href={"/dashboard/myBlog"}>View All Blogs</Link>
              </button>
            </div>

            {/* Recent Blogs — Card Style */}
            <div className="space-y-4 mt-6">
              {blogs.length === 0 && (
                <p className="text-gray-400 text-sm">No blogs created yet.</p>
              )}

              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="flex justify-between items-center bg-black/60 backdrop-blur-xl  p-4 rounded-xl shadow hover:shadow-md transition"
                >
                  {/* Left section */}
                  <div className="flex items-center gap-4">
                    <Image
                      src={blog.thumbnail || "/pancrad.png"}
                      width={45}
                      height={45}
                      alt="blog"
                      className="rounded-full w-12 h-12 object-cover"
                    />

                    <div>
                      <h3 className="font-semibold text-[17px] text-gray-400">
                        {blog.title}
                      </h3>
                      <div className="flex gap-3 mt-1">
                        <p className="text-gray-500 text-xs">
                          {new Date(blog.createdAt).toDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex gap-3">
                    <button className="text-blue-600 hover:underline text-sm">
                      <Link
                        href={`/dashboard/createBlog?edit=${Number(blog.id)}`}
                      >
                        Edit
                      </Link>
                    </button>
                    <button
                      onClick={() => deleteBlog(blog.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

         {/* RIGHT - STICKY STATS CARDS */}
          <div className="w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-xl shadow-xl rounded-xl p-5">
              <h3 className="text-lg font-bold text-gray-300 mb-4 pb-3 border-b-2 border-gray-200">
                Blog Statistics
              </h3>

              {/* Published Card */}
              <div className="bg-gradient-to-r from-green-500/2 to-green-800/2 backdrop-blur-xl border-l-4 border-green-600 p-4 rounded-lg hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-xs font-semibold mb-1 uppercase tracking-wide">
                      Published
                    </p>
                    <h2 className="text-4xl font-bold text-green-600">
                      {stats.published}
                    </h2>
                    <p className="text-green-600 text-xs mt-1">Live Blogs</p>
                  </div>
                  <div className="bg-green-600 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8 text-white"
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
              <div className="bg-gradient-to-r from-orange-50/2 to-orange-100/2 backdrop-blur-xl border-l-4 border-orange-600 p-4 rounded-lg hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-700 text-xs font-semibold mb-1 uppercase tracking-wide">
                      Drafts
                    </p>
                    <h2 className="text-4xl font-bold text-orange-600">
                      {stats.drafts}
                    </h2>
                    <p className="text-orange-600 text-xs mt-1">
                      Pending Publish
                    </p>
                  </div>
                  <div className="bg-orange-600 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8 text-white"
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

              {/* Total Card */}
              <div className="bg-gradient-to-r from-blue-50/2 to-purple-100/2 backdrop-blur-xl border-l-4 border-blue-600 p-4 rounded-lg hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-xs font-semibold mb-1 uppercase tracking-wide">
                      Total Blogs
                    </p>
                    <h2 className="text-4xl font-bold text-blue-600">
                      {stats.total}
                    </h2>
                    <p className="text-blue-600 text-xs mt-1">All Content</p>
                  </div>
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8 text-white"
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

              {/* Quick Actions */}
              <div className="pt-4 border-t-2 border-gray-200">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Link
                    href="/dashboard/createBlog"
                    className="block w-full text-center py-2 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    + Create New Blog
                  </Link>
                  <Link
                    href="/dashboard/drafts"
                    className="block w-full text-center py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition text-sm font-medium"
                  >
                    View Drafts
                  </Link>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
