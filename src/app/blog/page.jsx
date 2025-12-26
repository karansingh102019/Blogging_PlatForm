"use client";

import React, { useEffect, useState } from "react";
import BlogCard from "../components/Blogcard";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Great_Vibes } from "next/font/google";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiHome,
  FiChevronRight,
  FiBook,
} from "react-icons/fi";
import Threads from "../components/Threads ";

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
  const blogsPerPage = 9;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();

        // ✅ SAFETY CHECK
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

  // Search Filter
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery, blogs]);

  // Pagination Logic
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

      {/* Hero Section */}
      <section className=" relative bg-black text-white py-32">
        <div className="absolute inset-0 z-0 pt-10">
          <Threads amplitude={2} distance={0.1} enableMouseInteraction={true} />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-10 text-center">
          <h1
            className={` ${greatVibes.className} text-4xl md:text-7xl font-bold mb-4`}
          >
            Explore Our Blog Collection
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Discover amazing stories, insights, and knowledge from our community
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <FiSearch
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                size={24}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs by title..."
                className="w-full pl-14 pr-12 py-4 rounded-full text-gray-900 text-lg focus:ring-4 focus:ring-white/30 focus:outline-none shadow-2xl"
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

            {/* Search Results Info */}
            {searchQuery && (
              <p className="mt-4 text-white/80">
                Found {filteredBlogs.length} result
                {filteredBlogs.length !== 1 ? "s" : ""} for {searchQuery}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <FiBook className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">
              All Blogs ({filteredBlogs.length})
            </h2>
          </div>

          {!searchQuery && (
            <p className="text-gray-600">
              Showing {indexOfFirstBlog + 1} -{" "}
              {Math.min(indexOfLastBlog, filteredBlogs.length)} of{" "}
              {filteredBlogs.length} blogs
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiSearch className="text-gray-400" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {searchQuery
                ? `No blogs found for "${searchQuery}"`
                : "No blogs published yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try searching with different keywords"
                : "Check back later for new content"}
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Blogs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  desc={blog.description}
                  image={blog.thumbnail}
                  author={blog.author}
                  avatar={blog.avatar}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;

                    // Show first page, last page, current page, and pages around current
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
                          className={`w-10 h-10 rounded-lg font-semibold transition ${
                            currentPage === pageNumber
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                              : "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }

                    // Show ellipsis
                    if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="w-10 h-10 flex items-center justify-center text-gray-400"
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
                  className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA Section */}
      {filteredBlogs.length > 0 && (
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 mt-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Want to Share Your Story?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join our community of writers and start creating amazing content
              today!
            </p>
            <Link
              href="/auth/signup"
              className="inline-block px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-2xl"
            >
              Start Writing Now
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
