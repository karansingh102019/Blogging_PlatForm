"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Inter, Great_Vibes } from "next/font/google";
import Link from "next/link";
import {
  FiHome,
  FiBookOpen,
  FiChevronRight,
  FiUpload,
  FiX,
  FiEdit,
  FiSave,
  FiSend,
  FiImage,
  FiFileText,
  FiType,
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

const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });
import "suneditor/dist/css/suneditor.min.css";

export default function CreateBlogClient() {
  const searchParams = useSearchParams(); // ✅ NOW SAFE
  const router = useRouter();
  const editId = searchParams.get("edit");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(false);

  // ✅ LOAD BLOG FOR EDIT
  useEffect(() => {
    if (!editId) return;

    setLoadingBlog(true);
    fetch(`/api/blog/edit/${editId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return alert(data.error);

        setTitle(data.title || "");
        setDescription(data.description || "");
        setContent(data.content || "");
        setThumbnail(data.thumbnail || null);
        setPreview(data.thumbnail || null);
      })
      .finally(() => setLoadingBlog(false));
  }, [editId]);
  // IMAGE UPLOAD
  const handleThumbnail = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) {
        alert("Image upload failed");
        return;
      }

      setThumbnail(data.url);
    } catch (err) {
      alert("Upload error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // REMOVE THUMBNAIL
  const removeThumbnail = () => {
    setThumbnail(null);
    setPreview(null);
  };

  // SAVE / UPDATE
  const submitBlog = async (publish) => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (!description.trim()) {
      alert("Description is required");
      return;
    }

    if (!content.trim()) {
      alert("Content is required");
      return;
    }

    setLoading(true);

    const url = editId ? "/api/blog/edit" : "/api/blog/create";
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          title,
          description,
          content,
          thumbnail,
          published: publish,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert(publish ? "Blog Published Successfully! 🎉" : "Draft Saved! 📝");
      router.push(publish ? "/dashboard/myBlog" : "/dashboard/drafts");
    } catch (err) {
      alert("Failed to save blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg">
            Loading blog...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="lg:hidden">
        <DashboardNav />
      </div>
      {/* Breadcrumb Navigation */}
      <div className="hidden lg:flex items-center gap-2 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 backdrop-blur-xl bg-black/30 mb-4 sm:mb-5 md:mb-6 shadow-sm sticky z-40 top-0 rounded-bl-lg text-gray-400 text-sm">
        <div className="max-w-full px-2 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 overflow-x-auto scrollbar-hide">
            <Link
              href="/"
              className="hover:text-blue-600 flex items-center gap-1 flex-shrink-0"
            >
              <FiHome size={14} className="sm:w-4 sm:h-4" />
              <span className="">Home</span>
            </Link>
            <FiChevronRight
              size={12}
              className="text-gray-400 flex-shrink-0 sm:w-3.5 sm:h-3.5"
            />
            <Link
              href="/dashboard"
              className="hover:text-blue-600 flex items-center gap-1 flex-shrink-0"
            >
              <FiBookOpen size={14} className="sm:w-4 sm:h-4" />
              <span className="">Dashboard</span>
            </Link>
            <FiChevronRight
              size={12}
              className="text-gray-400 flex-shrink-0 sm:w-3.5 sm:h-3.5"
            />
            <span className="text-blue-600 font-medium flex items-center gap-1 flex-shrink-0">
              <FiEdit size={14} className="sm:w-4 sm:h-4" />
              <span className="truncate max-w-[100px] sm:max-w-none">
                {editId ? "Edit Blog" : "Create Blog"}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b px-2 sm:px-4 md:px-6 py-4 sm:py-6 rounded-bl-lg rounded-tl-lg">
        <div className="max-w-7xl mx-auto">
          <h1
            className={`${greatVibes.className} text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-300 mt-1 sm:mt-2 flex items-center gap-2 sm:gap-3`}
          >
            {editId ? "Edit Your Blog" : "Create New Blog"}
          </h1>

          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={8}
            showBorder={false}
            className={`${inter.variable} text-xs sm:text-sm md:text-medium mt-2 sm:mt-3 ml-0 sm:ml-1`}
          >
            {editId
              ? "Update your blog content and publish changes"
              : "Write and share your thoughts with the world"}
          </GradientText>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-8">
        <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6 md:p-8">
          {/* Thumbnail Section */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-base sm:text-lg font-semibold text-gray-300 mb-3 sm:mb-4 flex items-center gap-2">
              <FiImage
                className="text-blue-600 sm:w-5 sm:h-5 md:w-6 md:h-6"
                size={18}
              />
              <span className="text-sm sm:text-base md:text-lg">
                Featured Image
              </span>
            </label>

            {preview ? (
              <div className="relative w-full bg-black h-48 xs:h-56 sm:h-64 md:h-80 rounded-lg sm:rounded-xl overflow-hidden border-2 sm:border-4 border-gray-200">
                <Image
                  src={preview}
                  fill
                  alt="Thumbnail Preview"
                  className="object-cover"
                />

                {/* Remove Button */}
                <button
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-500 text-white p-2 sm:p-3 rounded-full hover:bg-red-600 transition shadow-lg"
                  title="Remove Image"
                >
                  <FiX size={16} className="sm:w-5 sm:h-5" />
                </button>

                {/* Uploading Overlay */}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white px-3 py-2 sm:px-6 sm:py-4 rounded-lg flex items-center gap-2 sm:gap-3 mx-2">
                      <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-blue-600 border-t-transparent"></div>
                      <span className="text-gray-700 font-medium text-sm sm:text-base">
                        Uploading...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <label className="block w-full h-48 xs:h-56 sm:h-64 md:h-80 border-2 sm:border-4 border-dashed border-gray-300 rounded-lg sm:rounded-xl hover:border-blue-400 transition cursor-pointer bg-black/20 backdrop-blur-xl">
                <div className="h-full flex flex-col items-center justify-center text-gray-500 px-2">
                  <FiUpload className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4 text-gray-400" />
                  <p className="text-sm sm:text-base md:text-lg font-medium mb-1 sm:mb-2 text-center">
                    Click to upload thumbnail
                  </p>
                  <p className="text-xs sm:text-sm text-center">
                    PNG, JPG, JPEG up to 5MB
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleThumbnail}
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}

            <p className="text-xs sm:text-sm text-red-400 mt-2">
              <span className="font-medium">Tip:</span> Use a high-quality image
              (recommended: 1200x630px)
            </p>
          </div>

          {/* Title */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <FiType className="text-blue-600" size={22} />
              Blog Title *
            </label>
            <input
              type="text"
              className="w-full text-gray-800 bg-[#ebebeb] px-6 py-4 border-2 border-gray-300 rounded-xl transition text-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an engaging title for your blog..."
              maxLength={200}
            />
            <p className="text-sm text-gray-400 mt-2 text-right">
              {title.length}/200 characters
            </p>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <FiFileText className="text-blue-600" size={22} />
              Short Description *
            </label>
            <textarea
              className="w-full text-gray-800 px-6 py-4 border-2 border-gray-300 rounded-xl bg-[#ebebeb] transition h-32 resize-none text-lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a brief description of your blog (shown in previews)..."
              maxLength={500}
            />
            <p className="text-sm text-gray-400 mt-2 text-right">
              {description.length}/500 characters
            </p>
          </div>

          {/* Content Editor */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <FiEdit className="text-blue-600" size={22} />
              Blog Content *
            </label>
            <div className="border-2 border-gray-300 rounded-xl overflow-hidden">
              <SunEditor
                setContents={content}
                onChange={setContent}
                setOptions={{
                  buttonList: [
                    ["undo", "redo"],
                    ["font", "fontSize", "formatBlock"],
                    ["bold", "underline", "italic", "strike"],
                    ["fontColor", "hiliteColor"],
                    ["removeFormat"],
                    ["outdent", "indent"],
                    ["align", "horizontalRule", "list", "table"],
                    ["link", "image", "video"],
                    ["fullScreen", "showBlocks", "codeView"],
                  ],
                  height: "700px",
                  minHeight: "400px",
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-300 transition font-semibold text-center text-sm sm:text-base"
            >
              Cancel
            </Link>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => submitBlog(false)}
                disabled={loading}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-orange-100 text-orange-700 rounded-lg sm:rounded-xl hover:bg-orange-200 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-orange-300 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-orange-700 border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave size={16} className="sm:w-5 sm:h-5" />
                    <span>Save as Draft</span>
                  </>
                )}
              </button>

              <button
                onClick={() => submitBlog(true)}
                disabled={loading}
                className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <FiSend size={16} className="sm:w-5 sm:h-5" />
                    <span>Publish Blog</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 sm:mt-8 bg-black/20 backdrop-blur-xl rounded-lg sm:rounded-xl p-4 sm:p-6">
          <h3
            className={`${greatVibes.className} text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-300 mb-2 sm:mb-3`}
          >
            Writing Tips
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={8}
                showBorder={false}
                className={`${inter.variable} text-xs sm:text-sm`}
              >
                Use a clear and engaging title that captures attention
              </GradientText>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={8}
                showBorder={false}
                className={`${inter.variable} text-xs sm:text-sm`}
              >
                Write a compelling description to hook readers
              </GradientText>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={8}
                showBorder={false}
                className={`${inter.variable} text-xs sm:text-sm`}
              >
                Use headings, images, and formatting to improve readability
              </GradientText>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={8}
                showBorder={false}
                className={`${inter.variable} text-xs sm:text-sm`}
              >
                Save drafts frequently to avoid losing your work
              </GradientText>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
