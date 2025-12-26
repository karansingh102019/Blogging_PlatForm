"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Great_Vibes } from "next/font/google";
import {
  FiCamera,
  FiUser,
  FiMail,
  FiFileText,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiGlobe,
  FiSave,
  FiX,
  FiHome,
  FiEdit,
  FiBookOpen,
  FiSettings,
  FiChevronRight,
} from "react-icons/fi";
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

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);

  const [social, setSocial] = useState({
    instagram: "",
    twitter: "",
    linkedin: "",
    website: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // 🔁 LOAD PROFILE FROM DB
  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
        setAvatar(data.avatar || null);
        setCover(data.cover || null);

        setSocial({
          instagram: data.instagram || "",
          twitter: data.twitter || "",
          linkedin: data.linkedin || "",
          website: data.website || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  // ☁️ UPLOAD HELPER
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    return data.url;
  };

  // 🖼 AVATAR UPLOAD
  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const url = await uploadToCloudinary(file);
      setAvatar(url);
    } catch (err) {
      alert("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // 🖼 COVER UPLOAD
  const handleCover = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const url = await uploadToCloudinary(file);
      setCover(url);
    } catch (err) {
      alert("Failed to upload cover");
    } finally {
      setUploadingCover(false);
    }
  };

  // ❌ REMOVE
  const removeAvatar = () => setAvatar(null);
  const removeCover = () => setCover(null);

  // 💾 SAVE PROFILE
  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio,
          avatar,
          cover,
          ...social,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("Profile updated successfully! ✅");

      // Trigger navbar update
      window.dispatchEvent(new Event("profile-updated"));
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading profile...</p>
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
              <FiSettings size={16} />
              Profile Settings
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="w-full">
        {/* Page Header */}
        <div className="bg-black/40 backdrop-blur-xl border-b px-6 py-6 rounded-bl-lg rounded-tl-lg">
          <div className="max-w-7xl mx-auto">
            <h1
              className={`${greatVibes.className} text-5xl mt-2 font-bold text-gray-300 flex items-center gap-3`}
            >
              Profile Settings
            </h1>
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={8}
              showBorder={false}
              className={`${inter.variable} text-medium mt-3 ml-1 `}
            >
              Manage your personal information, avatar, cover photo, and social
              links
            </GradientText>
          </div>
        </div>

        {/* Profile Card - Full Width */}
        <div className="max-w-7xl mx-auto pr-6 py-8">
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
            {/* COVER PHOTO SECTION */}
            <div className="relative w-full h-80 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30">
              {cover ? (
                <Image
                  src={cover}
                  fill
                  alt="Cover"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white">
                  <FiCamera className="text-white/40 text-8xl mb-4" />
                  <p className="text-xl font-medium opacity-60">
                    Upload your cover photo
                  </p>
                </div>
              )}

              {/* Cover Actions */}
              <div className="absolute top-6 right-6 flex gap-3">
                {cover && (
                  <button
                    onClick={removeCover}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-lg flex items-center gap-2 font-medium"
                    title="Remove Cover"
                  >
                    <FiX size={20} />
                    Remove
                  </button>
                )}

                <label className="bg-white text-gray-700 px-5 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition shadow-lg flex items-center gap-2 font-medium">
                  {uploadingCover ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FiCamera size={20} />
                      <span>Change Cover</span>
                    </>
                  )}
                  <input
                    type="file"
                    onChange={handleCover}
                    className="hidden"
                    accept="image/*"
                    disabled={uploadingCover}
                  />
                </label>
              </div>
            </div>

            {/* PROFILE BODY */}
            <div className="px-8 lg:px-12 pb-12">
              {/* Avatar Section */}
              <div className="relative -mt-24 mb-8">
                <div className="relative inline-block">
                  <div className="relative">
                    {avatar ? (
                      <Image
                        src={avatar}
                        width={200}
                        height={200}
                        alt="Avatar"
                        className="rounded-full border-4 border-white shadow-2xl w-46 h-46 object-cover"
                      />
                    ) : (
                      <div className="w-48 h-48 rounded-full border-8 border-white shadow-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-6xl font-bold">
                        {name ? name[0].toUpperCase() : <FiUser size={80} />}
                      </div>
                    )}

                    {/* Avatar Upload Button */}
                    <label className="absolute bottom-3 right-3 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-xl border-2 border-white">
                      {uploadingAvatar ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <FiCamera size={18} />
                      )}
                      <input
                        type="file"
                        onChange={handleAvatar}
                        className="hidden"
                        accept="image/*"
                        disabled={uploadingAvatar}
                      />
                    </label>
                  </div>

                  {/* Remove Avatar */}
                  {avatar && (
                    <button
                      onClick={removeAvatar}
                      className="absolute top-2 right-4 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition shadow-xl border-2 border-white"
                      title="Remove Avatar"
                    >
                      <FiX size={20} />
                    </button>
                  )}
                </div>

                {/* Upload Info */}
                <div className="mt-4">
                  <p className="text-sm text-gray-400">
                    <span className="font-medium">Tip:</span> Use a square image
                    for best results (recommended: 400x400px)
                  </p>
                </div>
              </div>

              {/* Form Grid - Full Width */}
              <div className="space-y-8">
                {/* Basic Info Section */}
                <div className="bg-gray-200 p-8 rounded-xl border-2 border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg">
                      <FiUser size={24} />
                    </div>
                    Basic Information
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <FiMail
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="email"
                          className="w-full pl-12 pr-5 py-4 border-2 border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed text-lg"
                          value={email}
                          disabled
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>

                  {/* Bio - Full Width */}
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FiFileText className="text-blue-600" size={18} />
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={500}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-40 resize-none text-lg"
                      placeholder="Tell us about yourself... What do you do? What are your interests?"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-gray-500">
                        Write a brief description about yourself
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {bio.length}/500
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links Section */}
                <div className="bg-gray-50 p-8 rounded-xl border-2 border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded-lg">
                      <FiGlobe size={24} />
                    </div>
                    Social Links
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Instagram */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FiInstagram className="text-pink-500" size={18} />
                        Instagram
                      </label>
                      <input
                        type="url"
                        placeholder="https://instagram.com/yourusername"
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition text-lg"
                        value={social.instagram}
                        onChange={(e) =>
                          setSocial({ ...social, instagram: e.target.value })
                        }
                      />
                    </div>

                    {/* Twitter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FiTwitter className="text-blue-400" size={18} />
                        Twitter
                      </label>
                      <input
                        type="url"
                        placeholder="https://twitter.com/yourusername"
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-lg"
                        value={social.twitter}
                        onChange={(e) =>
                          setSocial({ ...social, twitter: e.target.value })
                        }
                      />
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FiLinkedin className="text-blue-700" size={18} />
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/yourusername"
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition text-lg"
                        value={social.linkedin}
                        onChange={(e) =>
                          setSocial({ ...social, linkedin: e.target.value })
                        }
                      />
                    </div>

                    {/* Website */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FiGlobe className="text-green-600" size={18} />
                        Website
                      </label>
                      <input
                        type="url"
                        placeholder="https://yourwebsite.com"
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 transition text-lg"
                        value={social.website}
                        onChange={(e) =>
                          setSocial({ ...social, website: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-4 pt-6">
                  <Link
                    href="/dashboard"
                    className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold text-lg"
                  >
                    Cancel
                  </Link>
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-semibold text-lg shadow-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <FiSave size={22} />
                        <span>Save Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
