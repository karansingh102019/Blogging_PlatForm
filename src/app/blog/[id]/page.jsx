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
  const { id } = use(params);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [guestId, setGuestId] = useState(null);

  // Generate or get guest ID for anonymous users
  useEffect(() => {
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("guestId", id);
    }
    setGuestId(id);
  }, []);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Fetch blog data
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

        const res = await fetch(`/api/blog/${id}`, { headers });

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
  }, [id]);

  // Like toggle
  const handleLike = async () => {
    if (!guestId) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`/api/blog/${id}/like`, {
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

  // Save toggle
  const handleSave = async () => {
    if (!isAuthenticated) {
      alert("Please login to save this blog!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/blog/${id}/save`, {
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

  // Share
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
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-3 border-blue-200/30 rounded-full"></div>
              <div className="absolute inset-0 border-3 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-blue-100 text-sm font-medium">
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
            <h1 className="text-7xl font-bold text-white mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-blue-100 mb-3">
              Article Not Found
            </h2>
            <p className="text-blue-200/70 mb-6 text-sm">
              {`The article you're looking for doesn't exist or has been removed.`}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
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
            className="bg-gradient-to-br from-black-900 to-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full relative overflow-hidden border border-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-white/10 transition bg-black/50 backdrop-blur-sm"
            >
              <FiX size={20} className="text-white" />
            </button>

            {/* Cover Image */}
            <div className="relative w-full h-40 bg-gradient-to-r from-blue-600 to-purple-600">
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

            <div className="p-8 pt-0">
              <div className="flex items-start gap-6 mb-6 -mt-12">
                {blog.avatar ? (
                  <Image
                    src={blog.avatar}
                    width={100}
                    height={100}
                    className="rounded-xl border-4 border-slate-800 h-35 relative z-10"
                    alt={blog.author}
                  />
                ) : (
                  <div className="w-[100px] h-[100px] rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-slate-800 relative z-10">
                    {blog.author?.[0]?.toUpperCase()}
                  </div>
                )}

                <div className="flex-1 mt-14">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {blog.author}
                  </h2>
                  <p className="text-blue-200/80 text-sm leading-relaxed mb-4">
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

              <div className="border-t border-blue-500/20 pt-6">
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
                  Connect With Me
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: FiLinkedin, link: blog.linkedin, name: "LinkedIn" },
                    { icon: FiInstagram, link: blog.instagram, name: "instagram" },
                    { icon: FiTwitter, link: blog.twitter, name: "Twitter" },
                    { icon: FiGlobe, link: blog.website, name: "Website" },
                  ].map((social) => (
                    <div key={social.name}>
                      {social.link ? (
                        <a
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition"
                        >
                          <social.icon size={20} className="text-blue-400" />
                          <span className="text-sm font-medium text-white">
                            {social.name}
                          </span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 opacity-40">
                          <social.icon size={20} className="text-gray-500" />
                          <span className="text-sm font-medium text-gray-500">
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
        {/* Hero Section with Thumbnail */}
        <div className="relative w-full h-[60vh] bg-black">
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

          <div className="absolute bottom-15 left-6 z-10 ">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-white/20 transition border border-white/20"
            >
              <FiArrowLeft size={18} />
              <span className="font-medium text-sm">Back</span>
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-blue-200/90">
                <div className="flex items-center gap-2">
                  <FiCalendar size={16} />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock size={16} />
                  <span>{calculateReadTime(blog.content)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiEye size={16} />
                  <span>{views.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Author Card */}
          <div className="bg-black/20 backdrop-blur-xl rounded-xl p-6 mb-6 border border-blue-500/20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex-shrink-0"
                >
                  {blog.avatar ? (
                    <Image
                      src={blog.avatar}
                      width={56}
                      height={52}
                      className="rounded-lg hover:opacity-80 transition border-2 border-blue-500/50"
                      alt={blog.author}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-lg font-bold hover:opacity-80 transition border-2 border-blue-500/50">
                      {blog.author?.[0]?.toUpperCase()}
                    </div>
                  )}
                </button>

                <div className="flex-1 mt-10">
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="text-base font-semibold text-white hover:text-blue-400 transition"
                  >
                    {blog.author}
                  </button>
                  {blog.authorBio && (
                    <p className="text-sm text-blue-200/70 mt-1 line-clamp-1">
                      {blog.authorBio}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowProfileModal(true)}
                className="bg-transparent shadow-black/50 shadow-lg hover:bg-gray-700  hover:text-gray-300 text-gray-400 px-6 py-2 rounded-lg transition font-sm text-sm"
              >
                View Profile
              </button>
            </div>

            {(blog.linkedin || blog.instagram || blog.twitter || blog.website) && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                {blog.linkedin && (
                  <a
                    href={blog.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded-lg transition"
                  >
                    <FiLinkedin size={18} />
                  </a>
                )}
                {blog.instagram && (
                  <a
                    href={blog.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded-lg transition"
                  >
                    <FiInstagram size={18} />
                  </a>
                )}
                {blog.twitter && (
                  <a
                    href={blog.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded-lg transition"
                  >
                    <FiTwitter size={18} />
                  </a>
                )}
                {blog.website && (
                  <a
                    href={blog.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded-lg transition"
                  >
                    <FiGlobe size={18} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Interaction Bar */}
          <div className="bg-black/20 backdrop-blur-xl rounded-xl p-5 mb-6 border border-blue-500/20  ">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                    liked
                      ? " text-red-400 bg-white/5 "
                      : "bg-white/5 text-blue-200 "
                  }`}
                >
                  <FiHeart size={20} fill={liked ? "currentColor" : "none"} />
                  <span>{likes}</span>
                </button>

                <button
                  onClick={handleSave}
                  className={`p-2.5 rounded-lg transition ${
                    saved
                      ? "text-blue-400 bg-white/5"
                      : "bg-white/5 text-blue-200 "
                  }`}
                  title={isAuthenticated ? "Save" : "Login to save"}
                >
                  <FiBookmark
                    size={20}
                    fill={saved ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-transparent shadow-black/50 shadow-lg hover:bg-gray-700  hover:text-gray-300 text-gray-400 px-5 py-2 rounded-lg transition font-sm text-sm"
              >
                <FiShare2 size={18} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Description */}
          {blog.description && (
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-4 border-blue-500 p-5 rounded-r-xl mb-6 backdrop-blur-xl">
              <p className="text-base text-blue-100 leading-relaxed italic">
                {blog.description}
              </p>
            </div>
          )}

          {/* Blog Content */}
          <article
            className="bg-black/20 backdrop-blur-xl text-gray-300 rounded-xl p-8 mb-6 border border-blue-500/20
            prose prose-lg prose-invert max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8
            prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6
            prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-5
            prose-p:text-blue-100/90 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-img:rounded-lg prose-img:shadow-2xl prose-img:my-6 prose-img:border prose-img:border-blue-500/20
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 
            prose-blockquote:italic prose-blockquote:text-blue-200/80
            prose-code:bg-blue-500/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-blue-300 prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-slate-950 prose-pre:border prose-pre:border-blue-500/20 prose-pre:rounded-lg prose-pre:shadow-xl
            prose-ul:my-4 prose-ol:my-4
            prose-li:text-blue-100/90 prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Footer CTA */}
          <div className="bg-black/30 backdrop-blur-xl border border-blue-500/30 rounded-xl p-8 text-center">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={8}
              showBorder={false}
              className={` ${greatVibes.className} text-5xl font-bold text-white mb-3  p-2`}
            >
              Enjoyed this article?
            </GradientText>
            <p className="text-blue-200/80 mb-6">
              Discover more insights and stories from talented writers
            </p>
            <Link
              href="/blog"
              className="inline-block bg-transparent shadow-black/80 shadow-lg hover:bg-gray-700  hover:text-gray-300 text-gray-400 px-8 py-3 rounded-lg transition font-medium"
            >
              Explore More Articles
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}