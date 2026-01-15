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
  FiTrash2,
  FiArchive,
  FiClock,
  FiFileText,
  FiChevronLeft,
  FiChevronRight as FiChevronRightIcon,
  FiPlus,
} from "react-icons/fi";
import GradientText from "@/app/components/GradientText";
import DashboardNav from "@/app/components/dashboardNav";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

export default function DraftsPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const draftsPerPage = 6;

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await fetch("/api/blog/draft", { credentials: "include" });

      if (!res.ok) {
        setDrafts([]);
        return;
      }

      const data = await res.json();
      setDrafts(data || []);
    } catch (err) {
      console.error("Failed to fetch drafts:", err);
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteDraft = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this draft? This action cannot be undone."
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
        setDrafts(drafts.filter((d) => d.id !== id));
        alert("Draft deleted successfully! 🗑️");
      } else {
        alert("Failed to delete draft");
      }
    } catch (err) {
      alert("Error deleting draft");
    }
  };

  // Pagination Logic
  const indexOfLastDraft = currentPage * draftsPerPage;
  const indexOfFirstDraft = indexOfLastDraft - draftsPerPage;
  const currentDrafts = drafts.slice(indexOfFirstDraft, indexOfLastDraft);
  const totalPages = Math.ceil(drafts.length / draftsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-base sm:text-lg">
            Loading drafts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 lg:px-0">
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
            <FiChevronRight
              size={12}
              className="text-gray-400 sm:w-3.5 sm:h-3.5"
            />
            <Link
              href="/dashboard"
              className="hover:text-blue-600 flex items-center gap-1 whitespace-nowrap"
            >
              <FiBookOpen size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <FiChevronRight
              size={12}
              className="text-gray-400 sm:w-3.5 sm:h-3.5"
            />
            <span className="text-orange-600 font-medium flex items-center gap-1 whitespace-nowrap">
              <FiArchive size={14} className="sm:w-4 sm:h-4" />
              Drafts
            </span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-black/40 backdrop-blur-md sm:backdrop-blur-xl border-b px-3 sm:px-6 py-4 sm:py-6 rounded-bl-lg rounded-tl-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <h1
              className={`${greatVibes.className} text-3xl sm:text-4xl lg:text-5xl mt-2 font-bold text-gray-300 flex items-center gap-2 sm:gap-3`}
            >
              My Drafts
            </h1>
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={8}
              showBorder={false}
              className={`${inter.variable} text-xs sm:text-sm lg:text-medium mt-2 sm:mt-3 ml-0 sm:ml-1`}
            >
              Continue working on your unpublished blog posts ({drafts.length}{" "}
              drafts)
            </GradientText>
          </div>

          <Link
            href="/dashboard/createBlog"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg font-medium text-sm sm:text-base"
          >
            <FiPlus size={18} className="sm:w-5 sm:h-5" />
            Create Blog
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {drafts.length === 0 ? (
          <div className="bg-black/20 backdrop-blur-md sm:backdrop-blur-xl border border-gray-20 rounded-2xl shadow-lg p-8 sm:p-12 lg:p-16 text-center">
            <div className="bg-transparent border border-orange-600 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FiArchive className="text-orange-600" size={32} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">
              No Drafts Found
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8">
              All your work is published! Start creating a new blog post.
            </p>
            <Link
              href="/dashboard/createBlog"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base"
            >
              <FiPlus size={18} className="sm:w-5 sm:h-5" />
              Create New Blog
            </Link>
          </div>
        ) : (
          <>
            {/* Drafts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {currentDrafts.map((draft) => (
                <div
                  key={draft.id}
                  className="bg-white/10 backdrop-blur-md sm:backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg overflow-hidden group hover:shadow-lg sm:hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-orange-500 relative"
                >
                  {/* Draft Badge */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
                    <span className="inline-flex items-center gap-1 bg-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      <FiClock size={10} className="sm:w-3 sm:h-3" />
                      DRAFT
                    </span>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-full h-40 sm:h-48 bg-gradient-to-br from-orange-200 to-red-200">
                    {draft.thumbnail ? (
                      <Image
                        src={draft.thumbnail}
                        fill
                        alt={draft.title}
                        className="object-cover opacity-90"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiFileText className="text-orange-400" size={48} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-300 mb-2 line-clamp-2 group-hover:text-orange-600 transition">
                      {draft.title || "Untitled Draft"}
                    </h2>

                    <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
                      {draft.description || "No description yet..."}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                      <FiClock size={12} className="sm:w-3.5 sm:h-3.5" />
                      <span className="truncate">
                        Last edited{" "}
                        {getTimeAgo(draft.updatedAt || draft.createdAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Link
                        href={`/dashboard/createBlog?edit=${Number(draft.id)}`}
                        className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-orange-50/20 text-orange-600 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-orange-100 transition font-semibold border-2 border-orange-200 text-xs sm:text-sm"
                        title="Continue Editing"
                      >
                        <FiEdit size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="hidden xs:inline">Continue</span>
                      </Link>

                      <button
                        onClick={() => deleteDraft(draft.id)}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 bg-red-50 text-red-600 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-red-100 transition font-semibold border-2 border-red-200"
                        title="Delete Draft"
                      >
                        <FiTrash2
                          size={16}
                          className="sm:w-[18px] sm:h-[18px]"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
                >
                  <FiChevronLeft
                    size={16}
                    className="sm:w-[18px] sm:h-[18px]"
                  />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0">
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
                          className={`min-w-[2.5rem] h-10 rounded-lg font-semibold transition text-sm sm:text-base ${
                            currentPage === pageNumber
                              ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg"
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
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
                >
                  Next
                  <FiChevronRightIcon
                    size={16}
                    className="sm:w-[18px] sm:h-[18px]"
                  />
                </button>
              </div>
            )}

            {/* Results Info */}
            <div className="mt-4 sm:mt-6 text-center text-gray-600 text-xs sm:text-sm lg:text-base">
              Showing {indexOfFirstDraft + 1} -{" "}
              {Math.min(indexOfLastDraft, drafts.length)} of {drafts.length}{" "}
              drafts
            </div>
          </>
        )}
      </div>
    </div>
  );
}