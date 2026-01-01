"use client";

import React, { useEffect, useState } from "react";
import BlogCard from "../components/Blogcard";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Great_Vibes } from "next/font/google";
import {
  FiSearch,
  FiX,
  FiBook,
  FiTrendingUp,
  FiChevronLeft,
  FiChevronRight,
  FiEdit3,
  FiUsers,
  FiFileText,
} from "react-icons/fi";
import Threads from "../components/Threads ";
import GradientText from "../components/GradientText";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const blogsPerPage = 9;

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkAuth();

    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();

        if (Array.isArray(data)) {
          setBlogs(data);
          setFilteredBlogs(data);
        } else if (Array.isArray(data.blogs)) {
          setBlogs(data.blogs);
          setFilteredBlogs(data.blogs);
        } else {
          setBlogs([]);
          setFilteredBlogs([]);
        }
      } catch (err) {
        console.error(err);
        setBlogs([]);
        setFilteredBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, blogs]);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      <Navbar />

      {/* Hero Section - UNCHANGED */}
      <section className="relative bg-black text-white py-32">
        <div className="absolute inset-0 z-0 pt-10">
          <Threads amplitude={2} distance={0.1} enableMouseInteraction={true} />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-10 text-center ">
          <h1
            className={`${greatVibes.className} text-4xl md:text-7xl font-bold mb-4`}
          >
            Explore Our Blog Collection
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Discover amazing stories, insights, and knowledge from our community
          </p>

          <div className="max-w-2xl mx-auto shadow-gray-500 shadow-md  rounded-full ">
            <div className="relative ">
              <FiSearch
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-200"
                size={24}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs by title..."
                className="w-full pl-14 pr-12 py-4 rounded-full text-gray-200 text-lg focus:ring-4 focus:ring-white/30 focus:outline-none shadow-2xl"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <FiX size={24} />
                </button>
              )}
            </div>

            {searchQuery && (
              <p className="mt-4 text-white/80">
                Found {filteredBlogs.length} result
                {filteredBlogs.length !== 1 ? "s" : ""} for {searchQuery}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Professional Blogs Section */}
      <section className="bg-[#0a0e2e] ">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Professional Stats Header */}
          <div className="mb-16">
            <div className="bg-black/10 backdrop-blur-2xl rounded-lg shadow-sm border border-gray-500 p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Left - Title & Count */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FiBook className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-300">
                      Published Articles
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {!searchQuery
                        ? `${filteredBlogs.length} total articles`
                        : `${filteredBlogs.length} results found`}
                    </p>
                  </div>
                </div>

                {/* Right - Stats Grid */}
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-1">
                      Total Articles
                    </p>
                    <p className="text-2xl font-bold text-gray-400">
                      {filteredBlogs.length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-1">
                      Current Page
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {currentPage}/{totalPages || 1}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-20">
              <div className="text-center">
                <div className="inline-block relative">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
                  Loading Articles
                </h3>
                <p className="text-gray-500">
                  Please wait while we fetch the content...
                </p>
              </div>
            </div>
          ) : filteredBlogs.length === 0 ? (
            /* Professional Empty State */
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-20">
              <div className="text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiFileText className="text-gray-400" size={40} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {searchQuery ? "No Results Found" : "No Articles Yet"}
                </h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  {searchQuery
                    ? `We couldn't find any articles matching "${searchQuery}". Try different keywords or browse all articles.`
                    : "Be the first to contribute and share your knowledge with the community."}
                </p>
                {searchQuery ? (
                  <button
                    onClick={clearSearch}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Clear Search
                  </button>
                ) : (
                  <Link
                    href={isLoggedIn ? "/dashboard/createblog" : "/auth/signup"}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <FiEdit3 size={18} />
                    Start Writing
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Blogs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {currentBlogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    id={blog.id}
                    title={blog.title}
                    desc={blog.description}
                    image={blog.thumbnail}
                    author={blog.author}
                    avatar={blog.avatar}
                    views={blog.views || 0}
                    likes={blog.likes || 0}
                  />
                ))}
              </div>

              {/* Professional Pagination */}
              {totalPages > 1 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Previous Button */}
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                      <FiChevronLeft size={18} />
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-2">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;

                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 &&
                            pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => paginate(pageNumber)}
                              className={`min-w-[40px] h-10 rounded-lg font-medium transition-colors ${
                                currentPage === pageNumber
                                  ? "bg-blue-600 text-white"
                                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }

                        if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span
                              key={pageNumber}
                              className="px-2 text-gray-400"
                            >
                              ...
                            </span>
                          );
                        }

                        return null;
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                      Next
                      <FiChevronRight size={18} />
                    </button>
                  </div>

                  {/* Page Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500">
                      Showing{" "}
                      <span className="font-medium text-gray-700">
                        {indexOfFirstBlog + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium text-gray-700">
                        {Math.min(indexOfLastBlog, filteredBlogs.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-gray-700">
                        {filteredBlogs.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Professional CTA Section */}
      {filteredBlogs.length > 0 && (
        <section className="bg-black border-t border-blue-800">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="bg-[#3247e6]/20 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium text-white mb-6">
                  <FiUsers size={16} />
                  Join Our Community
                </div>

                <h2
                  className={` ${greatVibes.className} text-3xl md:text-5xl font-bold text-white mb-4`}
                >
                  <GradientText
                    colors={[
                      "#40ffaa",
                      "#4079ff",
                      "#40ffaa",
                      "#4079ff",
                      "#40ffaa",
                    ]}
                    animationSpeed={8}
                    showBorder={false}
                    className="p-6"
                  >
                    Share Your Knowledge & Experience
                  </GradientText>
                </h2>

                <p className="text-lg text-blue-50 mb-8 leading-relaxed mb-10">
                  Become a contributor and help others learn from your
                  expertise. Create engaging content and grow your audience.
                </p>

                <Link
                  href={isLoggedIn ? "/dashboard/createBlog" : "/auth/signup"}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-transparent   hover:bg-gray-300  hover:text-gray-700 text-gray-400 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-black/30 shadow-xl"
                >
                  <FiEdit3 size={20} />
                  {isLoggedIn ? "Start Writing Now" : "Create New Article"}
                </Link>

                {/* Status */}
                <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/20">
                  <div>
                    <p className="text-3xl font-bold text-white mb-1">
                      {blogs.length}+
                    </p>
                    <p className="text-sm text-blue-100">Articles Published</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white mb-1">
                      {new Set(blogs.map((b) => b.author)).size}+
                    </p>
                    <p className="text-sm text-blue-100">Active Writers</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white mb-1">24/7</p>
                    <p className="text-sm text-blue-100">Community Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}