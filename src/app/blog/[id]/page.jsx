"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiHeart,
  FiBookmark,
  FiShare2,
  FiArrowLeft,
  FiClock,
  FiUser,
} from "react-icons/fi";
import Navbar from "@/app/components/Navbar";

export default function BlogDetail({ params }) {
  // 🔥 FIX: Unwrap params Promise using React.use()
  const { id } = use(params);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(0);

  // 🔹 FETCH BLOG FROM API
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog/${id}`);

        if (!res.ok) {
          setBlog(null);
          return;
        }

        const data = await res.json();
        setBlog(data);
        setLikes(data.likes || 0);
      } catch (err) {
        console.error(err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Like toggle
  const handleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  // Save toggle
  const handleSave = () => setSaved(!saved);

  // Share
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: blog.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link Copied!");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate read time (approx 200 words per minute)
  const calculateReadTime = (content) => {
    const wordCount = content?.split(/\s+/).length || 0;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading blog...</p>
          </div>
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">
              Blog Not Found
            </h2>
            <p className="text-gray-500 mb-8">
              {`The blog you're looking for doesn't exist or has been removed.`}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <FiArrowLeft /> Back to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="w-full min-h-screen bg-gray-50">
        {/* Hero Section with Thumbnail */}
        <div className="relative w-full h-[60vh] bg-gradient-to-b from-gray-900 to-gray-800">
          {blog.thumbnail && (
            <>
              <Image
                src={blog.thumbnail}
                fill
                alt={blog.title}
                className="object-cover opacity-60"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </>
          )}

          {/* Back Button */}
          <div className="absolute top-6 left-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-white bg-black/30 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-black/50 transition"
            >
              <FiArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {blog.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-gray-200">
                <div className="flex items-center gap-2">
                  <FiClock size={18} />
                  <span>{calculateReadTime(blog.content)}</span>
                </div>
                <span>•</span>
                <span>{formatDate(blog.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Author Section */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b">
            {/* Author Avatar */}
            {blog.avatar ? (
              <Image
                src={blog.avatar}
                width={60}
                height={60}
                className="rounded-full border-2 border-gray-300"
                alt={blog.author}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    blog.author
                  )}&background=3b82f6&color=fff&size=128`;
                }}
              />
            ) : (
              <div className="w-[60px] h-[60px] rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-300">
                {blog.author ? blog.author[0].toUpperCase() : "U"}
              </div>
            )}

            {/* Author Info */}
            <div>
              <div className="flex items-center gap-2">
                <FiUser size={16} className="text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {blog.author}
                </h3>
              </div>
              {blog.authorBio && (
                <p className="text-sm text-gray-600 mt-1">{blog.authorBio}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-8">
            <p className="text-lg text-gray-700 leading-relaxed italic">
              {blog.description}
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b">
            <div className="flex items-center gap-6">
              {/* Like */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 transition-all ${
                  liked
                    ? "text-red-500 scale-110"
                    : "text-gray-600 hover:text-red-500"
                }`}
              >
                <FiHeart size={24} fill={liked ? "currentColor" : "none"} />
                <span className="font-semibold">{likes}</span>
              </button>

              {/* Save */}
              <button
                onClick={handleSave}
                className={`transition-all ${
                  saved
                    ? "text-blue-600 scale-110"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <FiBookmark
                  size={24}
                  fill={saved ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <FiShare2 size={20} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          {/* Blog Content */}
          <article
            className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Footer CTA */}
          <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-10 rounded-2xl">
            <h3 className="text-3xl font-bold mb-4">Enjoyed this article?</h3>
            <p className="text-lg mb-6 opacity-90">
              Discover more amazing content from talented writers
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Explore More Blogs
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}