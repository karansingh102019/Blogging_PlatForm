"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FiUsers,
  FiFileText,
  FiActivity,
  FiTrash2,
  FiEdit,
  FiEye,
  FiSearch,
  FiHeart,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiTrendingUp,
} from "react-icons/fi";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalUsers: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
  });
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    checkAdminAndFetchData();
  }, []);

  const checkAdminAndFetchData = async () => {
    const token = localStorage.getItem("token");
    
    // ✅ CRITICAL: If no token, immediately redirect
    if (!token) {
      alert("⛔ Please login first!");
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch("/api/admin/check", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Admin check response:", res.status);

      if (!res.ok) {
        const error = await res.json();
        console.error("Admin check failed:", error);
        alert("⛔ Access Denied! Admin only.");
        router.push("/");
        return;
      }

      // If admin check passed, fetch data
      await Promise.all([
        fetchStats(token),
        fetchBlogs(token),
        fetchUsers(token),
      ]);
    } catch (err) {
      console.error("Admin check error:", err);
      alert("⛔ Error loading admin dashboard. Please login.");
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (token) => {
    const res = await fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setStats(data);
  };

  const fetchBlogs = async (token) => {
    const res = await fetch("/api/admin/blogs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setBlogs(data.blogs || []);
  };

  const fetchUsers = async (token) => {
    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data.users || []);
  };

  const handleDeleteBlog = async (blogId) => {
    if (!confirm("⚠️ Permanently delete this blog? This cannot be undone!")) return;

    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`/api/admin/blogs/${blogId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete");

      alert("✅ Blog deleted successfully!");
      setBlogs(blogs.filter((b) => b.id !== blogId));
      fetchStats(token);
    } catch (err) {
      alert("❌ Failed to delete blog");
    }
  };

  const handleTogglePublish = async (blogId, currentStatus) => {
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`/api/admin/blogs/${blogId}/toggle-publish`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (!res.ok) throw new Error("Failed to update");

      alert(`✅ Blog ${!currentStatus ? "published" : "unpublished"}!`);
      fetchBlogs(token);
      fetchStats(token);
    } catch (err) {
      alert("❌ Failed to update blog status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("⚠️ Delete this user and ALL their blogs? This cannot be undone!")) return;

    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        alert("❌ " + (data.error || "Failed to delete"));
        return;
      }

      alert("✅ User deleted successfully!");
      setUsers(users.filter((u) => u.id !== userId));
      fetchStats(token);
      fetchBlogs(token);
    } catch (err) {
      alert("❌ Failed to delete user");
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "published" && blog.published === 1) ||
      (filterStatus === "draft" && blog.published === 0);

    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <FiActivity className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-blue-100 text-sm">Complete Platform Control</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
            >
              Back to Site
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <FiFileText size={32} className="opacity-80" />
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Total</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalBlogs}</h3>
            <p className="text-blue-100">Total Blogs</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <FiCheckCircle size={32} className="opacity-80" />
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Live</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.publishedBlogs}</h3>
            <p className="text-green-100">Published</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <FiClock size={32} className="opacity-80" />
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Pending</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.draftBlogs}</h3>
            <p className="text-orange-100">Drafts</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <FiUsers size={32} className="opacity-80" />
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Active</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalUsers}</h3>
            <p className="text-purple-100">Total Users</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-xl shadow-xl mb-6">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
                activeTab === "overview"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <FiTrendingUp size={20} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("blogs")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
                activeTab === "blogs"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <FiFileText size={20} />
              Manage Blogs
              <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs">
                {blogs.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
                activeTab === "users"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <FiUsers size={20} />
              Manage Users
              <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full text-xs">
                {users.length}
              </span>
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top Blogs by Views */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FiTrendingUp className="text-blue-400" />
                Top Performing Blogs
              </h2>
              <div className="space-y-4">
                {[...blogs]
                  .sort((a, b) => (b.views || 0) - (a.views || 0))
                  .slice(0, 5)
                  .map((blog, index) => (
                    <div key={blog.id} className="flex items-center gap-4 bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg text-white font-bold">
                        #{index + 1}
                      </div>
                      {blog.thumbnail ? (
                        <Image
                          src={blog.thumbnail}
                          alt={blog.title}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-[60px] h-[60px] bg-gray-600 rounded-lg flex items-center justify-center">
                          <FiFileText className="text-gray-400" size={24} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate">{blog.title}</h3>
                        <p className="text-gray-400 text-sm">By {blog.author}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-blue-400">
                          <FiEye size={16} />
                          <span className="font-semibold">{blog.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-400">
                          <FiHeart size={16} />
                          <span className="font-semibold">{blog.likes || 0}</span>
                        </div>
                      </div>
                      {blog.published ? (
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                          Published
                        </span>
                      ) : (
                        <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                          Draft
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent Blogs */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Blogs</h2>
              <div className="space-y-4">
                {blogs.slice(0, 5).map((blog) => (
                  <div key={blog.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      {blog.thumbnail ? (
                        <Image
                          src={blog.thumbnail}
                          alt={blog.title}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-[60px] h-[60px] bg-gray-600 rounded-lg flex items-center justify-center">
                          <FiFileText className="text-gray-400" size={24} />
                        </div>
                      )}
                      <div>
                        <h3 className="text-white font-semibold">{blog.title}</h3>
                        <p className="text-gray-400 text-sm">By {blog.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {blog.published ? (
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                          Published
                        </span>
                      ) : (
                        <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === "blogs" && (
          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            {/* Search and Filter */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search blogs by title, author, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Showing {filteredBlogs.length} of {blogs.length} blogs
              </p>
            </div>

            {/* Blogs Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="text-left text-gray-300 font-semibold px-6 py-4">Blog</th>
                    <th className="text-left text-gray-300 font-semibold px-6 py-4">Author</th>
                    <th className="text-center text-gray-300 font-semibold px-6 py-4">Views</th>
                    <th className="text-center text-gray-300 font-semibold px-6 py-4">Likes</th>
                    <th className="text-left text-gray-300 font-semibold px-6 py-4">Status</th>
                    <th className="text-center text-gray-300 font-semibold px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {blog.thumbnail ? (
                            <Image
                              src={blog.thumbnail}
                              alt={blog.title}
                              width={50}
                              height={50}
                              className="rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-[50px] h-[50px] bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FiFileText className="text-gray-400" size={20} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate">{blog.title}</p>
                            <p className="text-gray-400 text-sm truncate">{blog.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{blog.author}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-blue-400">
                          <FiEye size={16} />
                          <span className="font-semibold">{blog.views || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-red-400">
                          <FiHeart size={16} />
                          <span className="font-semibold">{blog.likes || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {blog.published ? (
                          <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                            <FiCheckCircle size={14} />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                            <FiClock size={14} />
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => window.open(`/blog/${blog.id}`, "_blank")}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                            title="View"
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            onClick={() => handleTogglePublish(blog.id, blog.published)}
                            className={`p-2 rounded-lg transition ${
                              blog.published
                                ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                                : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            }`}
                            title={blog.published ? "Unpublish" : "Publish"}
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBlogs.length === 0 && (
              <div className="text-center py-12">
                <FiAlertCircle className="mx-auto text-gray-500 mb-4" size={48} />
                <p className="text-gray-400">No blogs found</p>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-700">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Showing {filteredUsers.length} of {users.length} users
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="text-left text-gray-300 font-semibold px-6 py-4">User</th>
                    <th className="text-left text-gray-300 font-semibold px-6 py-4">Email</th>
                    <th className="text-center text-gray-300 font-semibold px-6 py-4">Blogs</th>
                    <th className="text-left text-gray-300 font-semibold px-6 py-4">Joined</th>
                    <th className="text-center text-gray-300 font-semibold px-6 py-4">Role</th>
                    <th className="text-center text-gray-300 font-semibold px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name[0].toUpperCase()}
                          </div>
                          <span className="text-white font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
                          {user.blogCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.is_admin ? (
                          <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-semibold">
                            Admin
                          </span>
                        ) : (
                          <span className="bg-gray-600 text-gray-300 px-3 py-1 rounded-full text-sm">
                            User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          {!user.is_admin && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                              title="Delete User"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <FiAlertCircle className="mx-auto text-gray-500 mb-4" size={48} />
                <p className="text-gray-400">No users found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}