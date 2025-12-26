"use client";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function BlogCard({
  id,
  title,
  desc,
  image,
  author = "John Doe",
  avatar = "/avatar.png", // default avatar
}) {
  return (
    <div className="
       bg-black/20 backdrop-blur-lg rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300
       hover:border-blue-400 cursor-pointer group
    ">
      
      {/* Thumbnail */}
      <div className="overflow-hidden h-48">
        <Image 
          src={image} 
          width={500} 
          height={300} 
          alt={title}
          className="w-full h-full  object-cover group-hover:scale-110 transition-all duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-300 group-hover:text-gray-100 transition-colors">
          {title}
        </h2>

        <p className="text-gray-400 text-sm line-clamp-3">
          {desc}
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 mt-3">
          <Image 
            src={avatar}
            width={32}
            height={32}
            className="rounded-full w-8 h-8 object-cover border"
            alt="Author"
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
