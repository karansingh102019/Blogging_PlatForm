"use client";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiEye, FiHeart } from "react-icons/fi";

export default function BlogCard({
  id,
  title,
  desc,
  image,
  author,
  avatar,
  views = 0,
  likes = 0,
}) {
  // ✅ Fallback image agar image empty ho
  const blogImage = image && image.trim() !== "" 
    ? image 
    : "/placeholder-blog.svg"; // Ya koi default image

  const authorAvatar = avatar && avatar.trim() !== "" 
    ? avatar 
    : "/default-avatar.svg";

  return (
    <div className="
       bg-black/20 backdrop-blur-md sm:backdrop-blur-lg rounded-xl overflow-hidden shadow-md hover:shadow-lg sm:hover:shadow-xl transition-all duration-300
       hover:border-blue-400 cursor-pointer group
    ">
      
      {/* Thumbnail */}
      <div className="overflow-hidden h-48 bg-gray-800">
        {blogImage ? (
          <Image 
            src={blogImage} 
            width={500} 
            height={300} 
            alt={title || "Blog thumbnail"}
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
            quality={75}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/placeholder-blog.svg"; 
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-purple-900/50">
            <span className="text-red-400 text-sm">No Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-300 group-hover:text-gray-100 transition-colors">
            {title || "Untitled Blog"}
          </h2>

          {/* Views and Likes Stats */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-blue-500">
              <FiEye size={16} />
              <span className="text-xs font-medium">{views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-500">
              <FiHeart size={16} />
              <span className="text-xs font-medium">{likes.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-sm line-clamp-3">
          {desc || "No description available"}
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 mt-3">
          <Image 
            src={authorAvatar}
            width={32}
            height={32}
            className="rounded-full w-8 h-8 object-cover border"
            alt={author || "Author"}
            quality={75}
            sizes="32px"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/default-avatar.svg";
            }}
          />

          <div className="text-[13px] leading-tight flex justify-between w-full">
            <p className="font-sm text-gray-300">{author}</p>
            <span className="text-gray-300 text-xs">Feb 5, 2025</span>
          </div>
        </div>

        {/* Read More */}
        <Link href={`/blog/${id}`}>
          <div className="flex items-center gap-2 text-blue-400 font-sm mt-4 group-hover:underline">
            Read More 
            <FiArrowRight size={16} className="group-hover:translate-x-1 transition"/>
          </div>
        </Link>
      </div>
    </div>
  );
}
