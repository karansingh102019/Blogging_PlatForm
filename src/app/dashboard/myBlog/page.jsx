"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Great_Vibes } from "next/font/google";
import {
  FiHome,
  FiBookOpen,
  FiChevronRight,
  FiEdit,
  FiEye,
  FiTrash2,
  FiPlus,
  FiCalendar,
  FiFileText,
  FiChevronLeft,
  FiChevronRight as FiChevronRightIcon,
  FiClock,
} from "react-icons/fi";
import GradientText from "@/app/components/GradientText";
import { FaCheck } from "react-icons/fa";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      const res = await fetch("/api/blog/myblog", {
        credentials: "include",
      });

      if (!res.ok) {
        setBlogs([]);
        return;
      }

      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this blog? This action cannot be undone."
      )
    )
      return;

    try {
      const res = await fetch("/api/blog/delete", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setBlogs(blogs.filter((b) => b.id !== id));
        alert("Blog deleted successfully! 🗑️");
      } else {
        alert("Failed to delete blog");
      }
    } catch (err) {
      alert("Error deleting blog");
    }
  };

  // Pagination Logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading your blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Breadcrumb Navigation */}
      <div className="bg-black/50 backdrop-blur-xl border-b mb-8 rounded-bl-lg sticky top-0 z-10">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link
              href="/"
              className="hover:text-blue-600 flex items-center gap-1"
            >
              <FiHome size={16} />
              Home
            </Link>
            <FiChevronRight size={14} className="text-gray-400" />
            <Link
              href="/dashboard"
              className="hover:text-blue-600 flex items-center gap-1"
            >
              <FiBookOpen size={16} />
              Dashboard
            </Link>
            <FiChevronRight size={14} className="text-gray-400" />
            <span className="text-blue-600 font-medium flex items-center gap-1">
              <FiFileText size={16} />
              My Blogs
            </span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b px-6 py-6  rounded-bl-lg rounded-tl-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1
              className={` ${greatVibes.className} text-5xl font-bold text-gray-300 flex mt-2 items-center gap-3`}
            >
              My Published Blogs
            </h1>
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={8}
              showBorder={false}
              className={`${inter.variable} text-medium mt-3 ml-1 `}
            >
              Manage all your published blog posts ({blogs.length} total)
            </GradientText>
          </div>

          <Link
            href="/dashboard/createBlog"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg font-medium"
          >
            <FiPlus size={20} />
            Create Blog
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl py-12 pr-6">
        {blogs.length === 0 ? (
          <div className="bg-black/20 backdrop-blur-xl border border-gray-20 rounded-2xl shadow-lg p-16 text-center">
            <div className="bg-transparent border border-blue-300 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiFileText className="text-blue-400" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-3">
              No Published Blogs Yet
            </h2>
            <p className="text-gray-700 mb-8">
              Start creating amazing content and share it with the world!
            </p>
            <Link
              href="/dashboard/createBlog"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <FiPlus size={20} />
              Create Your First Blog
            </Link>
          </div>
        ) : (
          <>
            {/* Blogs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-300"
                >
                  {/* Draft Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center gap-1 bg-blue-400 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                      <FaCheck size={12} />
                      Publish
                    </span>
                  </div>
                  {/* Thumbnail */}
                  <div className="relative w-full h-48 ">
                    <div className="absolute inset-0 bg-black/20 z-[1]" />
                    {blog.thumbnail ? (
                      <Image
                        src={blog.thumbnail}
                        fill
                        alt={blog.title}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiFileText className="text-gray-400" size={64} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-400 mb-2 line-clamp-2 group-hover:text-gray-300 transition">
                      {blog.title}
                    </h2>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {blog.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-2 text-sm text-green-600 mb-4 pb-4 border-b">
                      <FiCalendar size={14} />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/blog/${blog.id}`}
                        className="flex items-center gap-2 bg-blue-600/20  text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition font-medium text-sm"
                        title="View Blog"
                      >
                        <FiEye size={16} />
                        View
                      </Link>

                      <Link
                        href={`/dashboard/createBlog?edit=${Number(blog.id)}`}
                        className="flex items-center gap-2 bg-green-600/20 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition font-medium text-sm"
                        title="Edit Blog"
                      >
                        <FiEdit size={16} />
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteBlog(blog.id)}
                        className="flex items-center gap-2 bg-red-600/20 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium text-sm"
                        title="Delete Blog"
                      >
                        <FiTrash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <FiChevronLeft size={18} />
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
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Next
                  <FiChevronRightIcon size={18} />
                </button>
              </div>
            )}

            {/* Results Info */}
            <div className="mt-6 text-center text-gray-600">
              Showing {indexOfFirstBlog + 1} -{" "}
              {Math.min(indexOfLastBlog, blogs.length)} of {blogs.length} blogs
            </div>
          </>
        )}
      </div>
    </div>
  );
}
