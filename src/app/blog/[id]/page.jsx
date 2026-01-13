"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Great_Vibes } from "next/font/google";
import {
  FiHeart,
  FiBookmark,
  FiShare2,
  FiArrowLeft,
  FiClock,
  FiUser,
  FiLinkedin,
  FiGithub,
  FiTwitter,
  FiGlobe,
  FiX,
  FiEye,
  FiCalendar,
  FiMessageCircle,
  FiInstagram,
} from "react-icons/fi";
import Navbar from "@/app/components/Navbar";
import GradientText from "@/app/components/GradientText";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

export default function BlogDetail({ params }) {
  const { slug } = use(params); // Changed from 'id' to 'slug'

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [guestId, setGuestId] = useState(null);

  useEffect(() => {
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("guestId", id);
    }
    setGuestId(id);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        const guestIdFromStorage = localStorage.getItem("guestId");

        const headers = {};

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        if (guestIdFromStorage) {
          headers["X-Guest-Id"] = guestIdFromStorage;
        }

        // Changed endpoint to use slug
        const res = await fetch(`/api/blog/${slug}`, { headers });

        if (!res.ok) {
          setBlog(null);
          return;
        }

        const data = await res.json();
        setBlog(data);
        setLikes(data.likes || 0);
        setViews(data.views || 0);
        setLiked(data.isLiked || false);
        setSaved(data.isSaved || false);
      } catch (err) {
        console.error("Fetch blog error:", err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleLike = async () => {
    if (!guestId || !blog) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      // Use blog.id for API calls (backend still uses ID internally)
      const res = await fetch(`/api/blog/${blog.id}/like`, {
        method: "POST",
        headers,
        body: JSON.stringify({ guestId }),
      });

      if (!res.ok) throw new Error("Failed to like");

      const data = await res.json();
      setLiked(data.liked);
      setLikes(data.totalLikes);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      alert("Please login to save this blog!");
      return;
    }

    if (!blog) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/blog/${blog.id}/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      setSaved(data.saved);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: blog.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("✅ Link copied to clipboard!");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateReadTime = (content) => {
    const wordCount = content?.split(/\s+/).length || 0;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="text-center px-4">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-3 border-blue-200/30 rounded-full"></div>
              <div className="absolute inset-0 border-3 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-blue-100 text-xs sm:text-sm font-medium">
              Loading article...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4">
          <div className="text-center max-w-md">
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-2">404</h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-100 mb-3">
              Article Not Found
            </h2>
            <p className="text-sm sm:text-base text-blue-200/70 mb-6">
              {`The article you're looking for doesn't exist or has been removed.`}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
            >
              <FiArrowLeft size={18} />
              Back to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="bg-gradient-to-br from-black-900 to-slate-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full relative overflow-hidden border border-blue-500/20 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full hover:bg-white/10 transition bg-black/50 backdrop-blur-sm"
            >
              <FiX size={18} className="sm:w-5 sm:h-5 text-white" />
            </button>

            <div className="relative w-full h-32 sm:h-40 bg-gradient-to-r from-blue-600 to-purple-600">
              {blog.cover ? (
                <Image
                  src={blog.cover}
                  fill
                  className="object-cover"
                  alt="Cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
              )}
            </div>

            <div className="p-4 sm:p-6 lg:p-8 pt-0">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6 -mt-10 sm:-mt-12">
                {blog.avatar ? (
                  <Image
                    src={blog.avatar}
                    width={80}
                    height={80}
                    className="rounded-lg sm:rounded-xl border-4 border-slate-800 relative z-10 sm:w-[100px] sm:h-[100px]"
                    alt={blog.author}
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-[100px] sm:h-[100px] rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-4 border-slate-800 relative z-10 flex-shrink-0">
                    {blog.author?.[0]?.toUpperCase()}
                  </div>
                )}

                <div className="flex-1 mt-2 sm:mt-14 min-w-0 w-full sm:w-auto">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 truncate">
                    {blog.author}
                  </h2>
                  <p className="text-sm sm:text-base text-blue-200/80 leading-relaxed mb-4 line-clamp-3">
                    {blog.authorBio ||
                      "Passionate content creator sharing knowledge and insights."}
                  </p>
                  <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-3 py-1.5 rounded-full">
                    <FiUser className="text-blue-400" size={14} />
                    <span className="text-xs font-medium text-blue-300">
                      Content Creator
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-blue-500/20 pt-4 sm:pt-6">
                <h3 className="text-xs sm:text-sm font-semibold text-white mb-3 sm:mb-4 uppercase tracking-wide">
                  Connect With Me
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {[
                    { icon: FiLinkedin, link: blog.linkedin, name: "LinkedIn" },
                    { icon: FiInstagram, link: blog.instagram, name: "Instagram" },
                    { icon: FiTwitter, link: blog.twitter, name: "Twitter" },
                    { icon: FiGlobe, link: blog.website, name: "Website" },
                  ].map((social) => (
                    <div key={social.name}>
                      {social.link ? (
                        <a
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition"
                        >
                          <social.icon size={18} className="sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-white truncate">
                            {social.name}
                          </span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-white/5 border border-white/5 opacity-40">
                          <social.icon size={18} className="sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-500 truncate">
                            {social.name}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black-900 to-slate-900">
        <div className="relative w-full h-[50vh] sm:h-[60vh] bg-black">
          {blog.thumbnail && (
            <>
              <Image
                src={blog.thumbnail}
                fill
                alt={blog.title}
                className="object-cover opacity-40"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
            </>
          )}

          <div className="absolute top-20 sm:top-24 left-4 sm:left-6 z-10">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg hover:bg-white/20 transition border border-white/20"
            >
              <FiArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="font-medium text-xs sm:text-sm">Back</span>
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-blue-200/90">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FiCalendar size={14} className="sm:w-4 sm:h-4" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FiClock size={14} className="sm:w-4 sm:h-4" />
                  <span>{calculateReadTime(blog.content)}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FiEye size={14} className="sm:w-4 sm:h-4" />
                  <span>{views.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="bg-black/20 backdrop-blur-xl rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-blue-500/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto min-w-0">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex-shrink-0"
                >
                  {blog.avatar ? (
                    <Image
                      src={blog.avatar}
                      width={48}
                      height={48}
                      className="rounded-lg hover:opacity-80 transition border-2 border-blue-500/50 sm:w-14 sm:h-14"
                      alt={blog.author}
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-base sm:text-lg font-bold hover:opacity-80 transition border-2 border-blue-500/50">
                      {blog.author?.[0]?.toUpperCase()}
                    </div>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="text-sm sm:text-base font-semibold text-white hover:text-blue-400 transition truncate block w-full text-left"
                  >
                    {blog.author}
                  </button>
                  {blog.authorBio && (
                    <p className="text-xs sm:text-sm text-blue-200/70 mt-1 line-clamp-1">
                      {blog.authorBio}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowProfileModal(true)}
                className="w-full sm:w-auto bg-transparent shadow-black/50 shadow-lg hover:bg-gray-700 hover:text-gray-300 text-gray-400 px-4 sm:px-6 py-2 rounded-lg transition text-xs sm:text-sm font-medium"
              >
                View Profile
              </button>
            </div>

            {(blog.linkedin || blog.instagram || blog.twitter || blog.website) && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10 overflow-x-auto">
                {blog.linkedin && (
                  <a
                    href={blog.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded-lg transition flex-shrink-0"
                  >
                    <FiLinkedin size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </a>
                )}
                {blog.instagram && (
                  <a
                    href={blog.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded-lg transition flex-shrink-0"
                  >
                    <FiInstagram size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </a>
                )}
                {blog.twitter && (
                  <a
                    href={blog.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded-lg transition flex-shrink-0"
                  >
                    <FiTwitter size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </a>
                )}
                {blog.website && (
                  <a
                    href={blog.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded-lg transition flex-shrink-0"
                  >
                    <FiGlobe size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-lg sm:rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 border border-blue-500/20">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition font-medium text-sm ${
                    liked
                      ? "text-red-400 bg-white/5"
                      : "bg-white/5 text-blue-200"
                  }`}
                >
                  <FiHeart size={18} className="sm:w-5 sm:h-5" fill={liked ? "currentColor" : "none"} />
                  <span>{likes}</span>
                </button>

                <button
                  onClick={handleSave}
                  className={`p-2 sm:p-2.5 rounded-lg transition ${
                    saved
                      ? "text-blue-400 bg-white/5"
                      : "bg-white/5 text-blue-200"
                  }`}
                  title={isAuthenticated ? "Save" : "Login to save"}
                >
                  <FiBookmark
                    size={18}
                    className="sm:w-5 sm:h-5"
                    fill={saved ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 bg-transparent shadow-black/50 shadow-lg hover:bg-gray-700 hover:text-gray-300 text-gray-400 px-4 sm:px-5 py-2 rounded-lg transition text-xs sm:text-sm font-medium"
              >
                <FiShare2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {blog.description && (
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-4 border-blue-500 p-4 sm:p-5 rounded-r-lg sm:rounded-r-xl mb-4 sm:mb-6 backdrop-blur-xl">
              <p className="text-sm sm:text-base text-blue-100 leading-relaxed italic">
                {blog.description}
              </p>
            </div>
          )}

          <article
            className="bg-black/20 backdrop-blur-xl text-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 border border-blue-500/20
            prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none
            overflow-hidden break-words
            prose-headings:text-white prose-headings:font-bold prose-headings:break-words
            prose-h1:text-xl sm:prose-h1:text-2xl md:prose-h1:text-3xl prose-h1:mb-3 sm:prose-h1:mb-4 prose-h1:mt-6 sm:prose-h1:mt-8
            prose-h2:text-lg sm:prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mb-2 sm:prose-h2:mb-3 prose-h2:mt-5 sm:prose-h2:mt-6
            prose-h3:text-base sm:prose-h3:text-lg md:prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4 sm:prose-h3:mt-5
            prose-p:text-sm sm:prose-p:text-base prose-p:text-blue-100/90 prose-p:leading-relaxed prose-p:mb-3 sm:prose-p:mb-4 prose-p:break-words
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:break-all prose-a:text-sm sm:prose-a:text-base
            prose-strong:text-white prose-strong:font-semibold prose-strong:break-words
            prose-img:rounded-lg prose-img:shadow-2xl prose-img:my-4 sm:prose-img:my-6 prose-img:border prose-img:border-blue-500/20 prose-img:w-full prose-img:h-auto
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-3 sm:prose-blockquote:pl-4 md:prose-blockquote:pl-6 
            prose-blockquote:italic prose-blockquote:text-blue-200/80 prose-blockquote:my-4 prose-blockquote:text-sm sm:prose-blockquote:text-base prose-blockquote:break-words
            prose-code:bg-blue-500/10 prose-code:px-1.5 sm:prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-blue-300 prose-code:before:content-none prose-code:after:content-none prose-code:text-xs sm:prose-code:text-sm prose-code:break-all
            prose-pre:bg-slate-950 prose-pre:border prose-pre:border-blue-500/20 prose-pre:rounded-lg prose-pre:shadow-xl prose-pre:overflow-x-auto prose-pre:text-xs sm:prose-pre:text-sm prose-pre:max-w-full prose-pre:-mx-2 sm:prose-pre:mx-0 prose-pre:px-2 sm:prose-pre:px-4
            prose-ul:my-3 sm:prose-ul:my-4 prose-ul:text-sm sm:prose-ul:text-base prose-ol:my-3 sm:prose-ol:my-4 prose-ol:text-sm sm:prose-ol:text-base
            prose-li:text-blue-100/90 prose-li:my-1 prose-li:break-words prose-li:text-sm sm:prose-li:text-base
            prose-table:text-xs sm:prose-table:text-sm prose-table:overflow-x-auto prose-table:block prose-table:max-w-full
            [&_*]:max-w-full [&_*]:break-words"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <div className="bg-black/30 backdrop-blur-xl border border-blue-500/30 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={8}
              showBorder={false}
              className={`${greatVibes.className} text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 p-2`}
            >
              Enjoyed this article?
            </GradientText>
            <p className="text-sm sm:text-base text-blue-200/80 mb-4 sm:mb-6 px-2">
              Discover more insights and stories from talented writers
            </p>
            <Link
              href="/blog"
              className="inline-block bg-transparent shadow-black/80 shadow-lg hover:bg-gray-700 hover:text-gray-300 text-gray-400 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition font-medium text-sm sm:text-base"
            >
              Explore More Articles
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}