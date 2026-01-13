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
  FiFilter,
  FiTag,
} from "react-icons/fi";
import Threads from "../components/Threads ";
import GradientText from "../components/GradientText";
import { FaChevronDown, FaFilter, FaSearch, FaTimes } from "react-icons/fa";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

// ✅ DEFAULT CATEGORIES
const DEFAULT_CATEGORIES = [
  "Technology",
  "Programming",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "Design",
  "UI/UX",
  "Business",
  "Marketing",
  "Finance",
  "Lifestyle",
  "Health & Fitness",
  "Travel",
  "Food",
  "Entertainment",
  "Education",
  "Personal Development",
  "News",
  "Sports",
  "Gaming",
  "Science",
  "Other",
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false); // ✅ Missing state added
  const blogsPerPage = 9;

  useEffect(() => {
    const checkAuth = () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkAuth();
    fetchBlogs();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let url = "/api/blog";
      const params = new URLSearchParams();

      if (selectedCategory !== "All")
        params.append("category", selectedCategory);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();

      if (Array.isArray(data)) {
        setBlogs(data);
        setFilteredBlogs(data);

        // Extract unique categories from blogs
        const blogsCategories = [
          ...new Set(data.map((b) => b.category).filter(Boolean)),
        ];

        // Combine with default categories and remove duplicates
        const allCategories = [
          "All",
          ...new Set([...blogsCategories, ...DEFAULT_CATEGORIES]),
        ];
        setCategories(allCategories);
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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setCurrentPage(1);
    setIsCategoryOpen(false); // ✅ Close dropdown when category is selected
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-black text-white py-20 sm:pt-32">
        <div className="absolute inset-0 z-0 ">
          <Threads amplitude={3} distance={0.3} enableMouseInteraction={true} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6  text-center  relative z-10">
          <h1
            className={`${greatVibes.className} text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 px-4`}
          >
            Explore Our Blog Collection
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl opacity-90 mb-8 px-4">
            Discover amazing stories, insights, and knowledge from our community
          </p>

          {/* Search and Filter Section */}
          <div className="mb-12 flex flex-col gap-4 md:gap-6 items-center justify-center ">
            {/* Search and Category Row */}
            <div className="flex flex-col md:flex-row gap-1 md:gap-1">
              {/* Search Bar */}
              <div className="relative w-lg ">
                <FaSearch className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 z-[1] w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search blogs..."
                  className="w-full pl-11 sm:pl-14 pr-10 sm:pr-12 py-3 sm:py-3.5 rounded-2xl bg-white/10 backdrop-blur-md text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-white/40 focus:outline-none shadow-lg border border-white/10 placeholder:text-gray-400 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>

              {/* Category Dropdown Filter */}
              <div className="relative w-[300px]">
                <FaFilter className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none z-10" />
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full pl-11 sm:pl-14 pr-10 sm:pr-12 py-3 sm:py-3.5 rounded-2xl bg-white/10 backdrop-blur-md text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-white/40 focus:outline-none shadow-lg border border-white/10 transition-all text-left"
                >
                  {selectedCategory === "All"
                    ? `All Categories (${blogs.length})`
                    : `${selectedCategory} (${blogs.filter((b) => b.category === selectedCategory).length})`}
                </button>
                <FaChevronDown
                  className={`absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4 pointer-events-none transition-transform ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />

                {isCategoryOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsCategoryOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-30 max-h-64 overflow-y-auto">
                      <button
                        onClick={() => handleCategoryClick("All")}
                        className={`w-full px-4 sm:px-5 py-2.5 text-left text-sm sm:text-base transition-colors ${
                          selectedCategory === "All"
                            ? "bg-white/20 text-white font-medium"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        All Categories ({blogs.length})
                      </button>
                      {categories.slice(1).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleCategoryClick(cat)}
                          className={`w-full px-4 sm:px-5 py-2.5 text-left text-sm sm:text-base transition-colors ${
                            selectedCategory === cat
                              ? "bg-white/20 text-white font-medium"
                              : "text-gray-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {cat} ({blogs.filter((b) => b.category === cat).length})
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {selectedCategory !== "All" && (
                  <button
                    onClick={() => handleCategoryClick("All")}
                    className="absolute right-10 sm:right-11 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10"
                    title="Clear filter"
                  >
                    <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Search/Filter Results Info */}
            {(searchQuery || selectedCategory !== "All") && (
              <div className="flex justify-center">
                <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <span className="text-gray-200 text-sm sm:text-base">
                    {filteredBlogs.length} result
                    {filteredBlogs.length !== 1 ? "s" : ""}
                    {searchQuery && (
                      <span className="text-white font-medium">
                        {" "}
                        for {searchQuery}
                      </span>
                    )}
                    {selectedCategory !== "All" && (
                      <span className="text-white font-medium">
                        {" "}
                        in {selectedCategory}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Professional Blogs Section */}
      <section className="bg-[#0a0e2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Professional Stats Header */}
          <div className="mb-12 sm:mb-16">
            <div className="bg-black/10 backdrop-blur-2xl rounded-lg shadow-sm border border-gray-500 p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
                {/* Left - Title & Count */}
                <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiBook className="text-white" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-300 truncate">
                      {selectedCategory !== "All"
                        ? `${selectedCategory} Articles`
                        : "Published Articles"}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                      {filteredBlogs.length}{" "}
                      {selectedCategory !== "All"
                        ? `in ${selectedCategory}`
                        : "total articles"}
                    </p>
                  </div>
                </div>

                {/* Right - Stats Grid */}
                <div className="flex gap-6 sm:gap-8 w-full lg:w-auto justify-center lg:justify-end">
                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide mb-1">
                      Total Articles
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-400">
                      {filteredBlogs.length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide mb-1">
                      Current Page
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">
                      {currentPage}/{totalPages || 1}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 sm:p-20">
              <div className="text-center">
                <div className="inline-block relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mt-6 mb-2">
                  Loading Articles
                </h3>
                <p className="text-sm sm:text-base text-gray-500">
                  Please wait while we fetch the content...
                </p>
              </div>
            </div>
          ) : filteredBlogs.length === 0 ? (
            /* Professional Empty State */
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 lg:p-20">
              <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiFileText className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                  {searchQuery || selectedCategory !== "All"
                    ? "No Results Found"
                    : "No Articles Yet"}
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-8 leading-relaxed px-4">
                  {searchQuery || selectedCategory !== "All"
                    ? `We couldn't find any articles${
                        searchQuery ? ` matching "${searchQuery}"` : ""
                      }${
                        selectedCategory !== "All"
                          ? ` in ${selectedCategory}`
                          : ""
                      }. Try different keywords or browse all articles.`
                    : "Be the first to contribute and share your knowledge with the community."}
                </p>
                {searchQuery || selectedCategory !== "All" ? (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <Link
                    href={isLoggedIn ? "/dashboard/createblog" : "/auth/signup"}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition-colors"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
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
                    category={blog.category}
                  />
                ))}
              </div>

              {/* Professional Pagination */}
              {totalPages > 1 && (
                <div className="bg-black/30 rounded-lg shadow-sm border border-gray-800 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Previous Button */}
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                      <FiChevronLeft size={18} />
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0">
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
                              className={`min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 rounded-lg text-sm sm:text-base font-medium transition-colors ${
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
                              className="px-1 sm:px-2 text-gray-400 text-sm sm:text-base"
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
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                      Next
                      <FiChevronRight size={18} />
                    </button>
                  </div>

                  {/* Page Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                    <p className="text-xs sm:text-sm text-gray-500">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="bg-[#3247e6]/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 border border-white/20">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 rounded-full text-xs sm:text-sm font-medium text-white mb-4 sm:mb-6">
                  <FiUsers size={14} className="sm:w-4 sm:h-4" />
                  Join Our Community
                </div>

                <h2
                  className={`${greatVibes.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-4`}
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
                    className="p-4 sm:p-6"
                  >
                    Share Your Knowledge & Experience
                  </GradientText>
                </h2>

                <p className="text-sm sm:text-base lg:text-lg text-blue-50 mb-6 sm:mb-8 lg:mb-10 leading-relaxed px-4">
                  Become a contributor and help others learn from your
                  expertise. Create engaging content and grow your audience.
                </p>

                <Link
                  href={isLoggedIn ? "/dashboard/createBlog" : "/auth/signup"}
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-transparent hover:bg-gray-300 hover:text-gray-700 text-gray-400 rounded-lg text-sm sm:text-base font-semibold transition-colors shadow-black/30 shadow-xl"
                >
                  <FiEdit3 size={18} className="sm:w-5 sm:h-5" />
                  {isLoggedIn ? "Start Writing Now" : "Create New Article"}
                </Link>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-white/20">
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      {blogs.length}+
                    </p>
                    <p className="text-xs sm:text-sm text-blue-100">
                      Articles Published
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      {new Set(blogs.map((b) => b.author)).size}+
                    </p>
                    <p className="text-xs sm:text-sm text-blue-100">
                      Active Writers
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      24/7
                    </p>
                    <p className="text-xs sm:text-sm text-blue-100">
                      Community Support
                    </p>
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