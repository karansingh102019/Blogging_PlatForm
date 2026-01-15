"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Great_Vibes } from "next/font/google";
import {
  FiBookmark,
  FiHeart,
  FiClock,
  FiTrash2,
  FiSearch,
  FiArrowRight,
  FiHome,
  FiBookOpen,
  FiChevronRight,
} from "react-icons/fi";
import GradientText from "@/app/components/GradientText";
import DashboardNav from "@/app/components/dashboardNav";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

export default function SavedBlogsPage() {
  const router = useRouter();
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token check:", token ? "Token exists" : "No token");
    
    if (!token) {
      alert("Please login first!");
      router.push("/auth/login");
      return;
    }
    fetchSavedBlogs(token);
  }, [router]);

  const fetchSavedBlogs = async (token) => {
    try {
      console.log("Fetching saved blogs...");
      
      const res = await fetch("/api/user/saved-blogs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Saved blogs response status:", res.status);

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          alert("Session expired. Please login again!");
          router.push("/auth/login");
          return;
        }
        throw new Error("Failed to fetch saved blogs");
      }

      const data = await res.json();
      console.log("Saved blogs data:", data);
      console.log("Number of saved blogs:", data.savedBlogs?.length || 0);
      
      setSavedBlogs(data.savedBlogs || []);
    } catch (err) {
      console.error("Error fetching saved blogs:", err);
      alert("Failed to load saved blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (blogId) => {
    if (!confirm("Remove this blog from saved list?")) return;

    try {
      const token = localStorage.getItem("token");
      
      console.log("Unsaving blog:", blogId);
      
      const res = await fetch(`/api/blog/${blogId}/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to unsave");

      const data = await res.json();
      console.log("Unsave response:", data);

      // Remove from local state
      setSavedBlogs(savedBlogs.filter((blog) => blog.id !== blogId));
      alert("✅ Blog removed from saved list!");
    } catch (err) {
      console.error("Unsave error:", err);
      alert("Failed to remove blog");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateReadTime = (content) => {
    if (!content) return "5 min read";
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  // Filter blogs based on search query
  const filteredBlogs = savedBlogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-base sm:text-lg">Loading saved blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
     <div className="lg:hidden">
                   <DashboardNav />
                 </div>
           {/* Breadcrumb Navigation */}
           <div className="hidden lg:flex items-center gap-2 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 backdrop-blur-md sm:backdrop-blur-xl bg-black/30 mb-4 sm:mb-5 md:mb-6 shadow-sm sticky z-40 top-0 rounded-bl-lg text-gray-400 text-sm">
        <div className="max-w-full px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 overflow-x-auto">
            <Link
              href="/"
              className="hover:text-blue-600 flex items-center gap-1 whitespace-nowrap"
            >
              <FiHome size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <FiChevronRight size={12} className="text-gray-400 sm:w-3.5 sm:h-3.5" />
            <Link
              href="/dashboard"
              className="hover:text-blue-600 flex items-center gap-1 whitespace-nowrap"
            >
              <FiBookOpen size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <FiChevronRight size={12} className="text-gray-400 sm:w-3.5 sm:h-3.5" />
            <span className="text-blue-600 font-medium flex items-center gap-1 whitespace-nowrap">
              <FiBookmark size={14} className="sm:w-4 sm:h-4" />
              Saved Blogs
            </span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-black/40 backdrop-blur-md sm:backdrop-blur-xl border-b px-3 sm:px-6 py-4 sm:py-6 rounded-bl-lg rounded-tl-lg">
        <div className="max-w-7xl mx-auto">
          <h1
            className={`${greatVibes.className} text-3xl sm:text-4xl lg:text-5xl mt-2 font-bold text-gray-300 flex items-center gap-2 sm:gap-3`}
          >
            Saved Blogs
          </h1>
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={8}
            showBorder={false}
            className={`${inter.variable} text-xs sm:text-sm lg:text-medium mt-2 sm:mt-3 ml-0 sm:ml-1`}
          >
            {savedBlogs.length} {savedBlogs.length === 1 ? "blog" : "blogs"} saved for later reading
          </GradientText>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {/* Search Bar & Explore Button */}
        {savedBlogs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <FiSearch
                className="absolute  z-[1] left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-200"
                size={18}
              />
              <input
                type="text"
                placeholder="Search saved blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md sm:backdrop-blur-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-gray-300 placeholder-gray-400"
              />
            </div>

            {/* Explore Button */}
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition shadow-lg font-semibold text-sm sm:text-base whitespace-nowrap"
            >
              Explore More
              <FiArrowRight size={18} />
            </Link>
          </div>
        )}

        {/* Empty State */}
        {savedBlogs.length === 0 ? (
          <div className="bg-black/20 backdrop-blur-md sm:backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FiBookmark className="text-blue-600 sm:w-10 sm:h-10 lg:w-12 lg:h-12" size={32}  />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-300 mb-2 sm:mb-3">
              No Saved Blogs Yet
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto">
              Start saving blogs you want to read later. Click the bookmark icon
              on any blog to save it here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Explore Blogs
              <FiArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            {/* No Search Results */}
            {filteredBlogs.length === 0 ? (
              <div className="bg-black/20 backdrop-blur-md sm:backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-8 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="text-gray-400 sm:w-8 sm:h-8 " size={24} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-300 mb-2">
                  No Results Found
                </h3>
                <p className="text-sm sm:text-base text-gray-400">Try adjusting your search query</p>
              </div>
            ) : (
              /* Blog Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-white/10 backdrop-blur-md sm:backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-500"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/blog/${blog.id}`}
                      className="block relative h-40 sm:h-48 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 overflow-hidden group"
                    >
                      {blog.thumbnail ? (
                        <Image
                          src={blog.thumbnail}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiBookmark className="text-blue-400 sm:w-12 sm:h-12" size={40}  />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <div className="bg-white/90 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                          Saved
                        </div>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-4 sm:p-5">
                      {/* Author Info */}
                      <div className="flex items-center gap-2 sm:gap-3 mb-3">
                        {blog.authorAvatar ? (
                          <Image
                            src={blog.authorAvatar}
                            alt={blog.author}
                            width={36}
                            height={36}
                            className="rounded-full border-2 border-gray-300 w-8 h-8 sm:w-9 sm:h-9"
                          />
                        ) : (
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                            {blog.author[0].toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-gray-300 truncate">
                            {blog.author}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(blog.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Title */}
                      <Link href={`/blog/${blog.id}`}>
                        <h3 className="text-base sm:text-lg font-bold text-gray-300 mb-2 line-clamp-2 hover:text-blue-600 transition">
                          {blog.title}
                        </h3>
                      </Link>

                      {/* Description */}
                      {blog.description && (
                        <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                          {blog.description}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs sm:text-sm text-red-500 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-600">
                        <span className="flex items-center gap-1">
                          <FiHeart size={12} className="sm:w-3.5 sm:h-3.5" />
                          {blog.likes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock size={12} className="sm:w-3.5 sm:h-3.5" />
                          {calculateReadTime(blog.content)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/blog/${blog.id}`}
                          className="flex-1 bg-blue-600 text-white py-2 sm:py-2.5 rounded-lg font-semibold text-center text-xs sm:text-sm hover:bg-blue-700 transition"
                        >
                          Read Now
                        </Link>
                        <button
                          onClick={() => handleUnsave(blog.id)}
                          className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition border border-red-500"
                          title="Remove from saved"
                        >
                          <FiTrash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}