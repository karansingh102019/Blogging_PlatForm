"use client";

import { useEffect, useState } from "react";
import BlogCard from "./Blogcard";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Great_Vibes } from "next/font/google";
import {
  FiEdit,
  FiUsers,
  FiTrendingUp,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import SplitText from "./SplitText";
import GradientText from "./GradientText";
import CountUp from "./countup";
import FloatingLines from "./FloatingLines ";
import ElectricBorder from "./ElectricBorder ";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

export default function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkAuth();

    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();

        if (Array.isArray(data)) {
          setBlogs(data);
        } else if (Array.isArray(data.blogs)) {
          setBlogs(data.blogs);
        } else {
          setBlogs([]);
        }
      } catch (err) {
        console.error(err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setFormStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({
          type: "success",
          message: "Message sent successfully! We'll get back to you soon.",
        });
        setContactForm({ name: "", email: "", message: "" });
      } else {
        setFormStatus({
          type: "error",
          message: data.error || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      setFormStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* HOME SECTION */}
      <section
        id="home"
        className="relative w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 py-16 sm:py-20 md:py-24 lg:py-32 flex items-center bg-black justify-center overflow-hidden min-h-screen"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <FloatingLines interactive={false} />
        </div>

        <div className="absolute inset-0 bg-black/30 z-[1]" />

        <div className="max-w-6xl mx-auto text-center text-white relative z-10 w-full">
          <h1
            className={`${greatVibes.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-extrabold px-4`}
          >
            <SplitText
              text={`Share Your Thoughts With the world`}
              className="block leading-tight"
              delay={50}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="100px"
              textAlign="center"
            />
          </h1>

          <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col items-center text-center space-y-8 sm:space-y-10 md:space-y-13 px-4">
            {/* Description */}
            <div>
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={8}
                showBorder={false}
                className={`${inter.variable} text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 max-w-3xl m-1`}
              >
                A platform where creativity meets community. Write, publish, and
              </GradientText>
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={8}
                showBorder={false}
                className={`${inter.variable} text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 max-w-3xl`}
              >
                inspire millions of readers around the globe.
              </GradientText>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center w-full sm:w-auto">
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-purple-600 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition shadow-2xl hover:scale-105 transform duration-300"
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
                >
                  Get Started Free
                </GradientText>
              </Link>

              <Link
                href="#blogs"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-base sm:text-lg hover:bg-white/10 transition"
              >
                Explore Blogs
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl w-full px-4">
              <div className="text-center">
                <CountUp
                  from={0}
                  to={blogs.length}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text text-3xl sm:text-4xl font-bold mb-1"
                />
                <p className="text-white/80 text-sm sm:text-base">
                  Published Blogs
                </p>
              </div>

              <div className="text-center">
                <CountUp
                  from={0}
                  to={10}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text text-3xl sm:text-4xl font-bold mb-1"
                />
                <span className="text-3xl sm:text-4xl font-bold mb-1">K</span>
                <p className="text-white/80 text-sm sm:text-base">
                  Active Writers
                </p>
              </div>

              <div className="text-center">
                <CountUp
                  from={0}
                  to={50}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text text-3xl sm:text-4xl font-bold mb-1"
                />
                <span className="text-3xl sm:text-4xl font-bold mb-1">K</span>
                <p className="text-white/80 text-sm sm:text-base">
                  Monthly Readers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="pt-16 sm:pt-20 md:pt-24 lg:pt-30 pb-16 sm:pb-20 bg-[#101828]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20 md:mb-30">
            <h2
              className={`${greatVibes.className} text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold text-gray-300 mb-6 sm:mb-8 md:mb-10`}
            >
              Why Choose Nexus?
            </h2>

            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={8}
              showBorder={false}
              className={`${inter.variable} text-base sm:text-lg md:text-xl opacity-90 max-w-3xl mx-auto px-4`}
            >
              Everything you need to Create, Manage, and Grow your blog
            </GradientText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <ElectricBorder
              color="#3a8bff"
              chaos={0.5}
              thickness={0}
              style={{ borderRadius: 16 }}
            >
              <div className="group relative bg-black/30 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform overflow-hidden border-2 border-transparent hover:border-blue-400 h-full">
                <div className="relative z-10">
                  <div className="relative mb-10 sm:mb-14">
                    <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <FiEdit className="text-white text-3xl sm:text-4xl" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-400 mb-3 sm:mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    Easy Writing
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-4 sm:mb-6">
                    Powerful rich-text editor with formatting options, image
                    uploads, and draft saving. Write with ease and publish with
                    confidence.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-500">
                    <li className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      Rich text formatting
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      Auto-save drafts
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      Image uploads
                    </li>
                  </ul>
                  <div className="mt-4 sm:mt-6 flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-xs sm:text-sm">Learn More</span>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </ElectricBorder>

            {/* Feature 2 */}
            <ElectricBorder
              color="#00bb51"
              speed={1}
              chaos={0.5}
              thickness={0}
              style={{ borderRadius: 16 }}
            >
              <div className="group relative bg-black/30 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-green-400 h-full">
                <div className="relative z-10">
                  <div className="relative mb-10 sm:mb-14">
                    <div className="relative bg-gradient-to-br from-green-400 to-green-600 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <FiUsers className="text-white text-3xl sm:text-4xl" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-400 mb-3 sm:mb-4 group-hover:text-green-600 transition-colors duration-300">
                    Build Community
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-4 sm:mb-6">
                    Connect with readers and fellow writers. Share ideas, get
                    feedback, and grow your audience organically.
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-500">
                    <li className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Reader engagement
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Social sharing
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Follow writers
                    </li>
                  </ul>
                  <div className="mt-4 sm:mt-6 flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-xs sm:text-sm">Learn More</span>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </ElectricBorder>

            {/* Feature 3 */}
            <ElectricBorder
              color="#ae58ff"
              speed={1}
              chaos={0.5}
              thickness={0}
              style={{ borderRadius: 16 }}
            >
              <div className="group relative bg-black/30 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-purple-400 h-full">
                <div className="relative z-10">
                  <div className="relative mb-10 sm:mb-14">
                    <div className="relative bg-gradient-to-br from-purple-400 to-purple-600 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <FiTrendingUp className="text-white text-3xl sm:text-4xl" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-400 mb-3 sm:mb-4 group-hover:text-purple-600 transition-colors duration-300">
                    Track Growth
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-4 sm:mb-6">
                    {`Analytics dashboard to monitor your blog's performance. See what resonates with your audience and optimize your content.`}
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-500">
                    <li className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      Real-time analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      Audience insights
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      Performance reports
                    </li>
                  </ul>
                  <div className="mt-4 sm:mt-6 flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-xs sm:text-sm">Learn More</span>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </ElectricBorder>
          </div>
        </div>
      </section>

      {/* BLOGS SECTION */}
      <section id="blogs" className="py-16 sm:py-20 bg-[#101828] relative">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/50 z-[1] pointer-events-none" />
          <FloatingLines interactive={true} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 sm:mb-16 md:mb-18 gap-4">
            <div>
              <h2
                className={`${greatVibes.className} text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-100 mb-3 sm:mb-4`}
              >
                Latest Blogs
              </h2>
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={8}
                showBorder={false}
                className={`${inter.variable} text-base sm:text-lg md:text-xl opacity-90 max-w-3xl`}
              >
                Discover amazing stories from our community
              </GradientText>
            </div>
            <Link
              href="/auth/login"
              className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-base lg:text-lg group mt-4 md:mt-0"
            >
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={8}
                showBorder={false}
                className={`${inter.variable} text-sm`}
              >
                View All
              </GradientText>
              <FiArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 sm:py-16">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-sm sm:text-base">
                Loading blogs...
              </p>
            </div>
          ) : blogs.length === 0 ? (
            <p className="text-center text-gray-500 py-12 sm:py-16 text-sm sm:text-base">
              No blogs published yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogs.slice(0, 6).map((blog) => (
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
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section
        id="about"
        className="py-12 sm:py-16 md:py-20 bg-[#101828] text-white relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2
            className={`${greatVibes.className} text-3xl sm:text-5xl md:text-7xl font-bold mb-12 sm:mb-16 md:mb-25 text-center`}
          >
            About Nexus
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-30 items-center">
            <div className="">
              <p
                className={`${inter.variable} text-base sm:text-lg md:text-xl mb-4 sm:mb-6 leading-relaxed opacity-90`}
              >
                {`Nexus is more than just a blogging platform—it's a community
              of passionate writers and curious readers coming together to
              share knowledge, stories, and experiences.`}
              </p>
              <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 leading-relaxed opacity-80">
                Founded in 2025, we believe everyone has a story worth telling.
                Our mission is to provide the tools and platform to make
                publishing easy, accessible, and enjoyable for everyone.
              </p>
              <Link
                href="/auth/signup"
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white text-purple-600 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition shadow-xl"
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
                >
                  Join Our Community
                </GradientText>
              </Link>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border-2 border-white/20">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                Our Values
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-2 rounded-lg mt-1 flex-shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg">
                      Freedom of Expression
                    </h4>
                    <p className="text-white/80 text-sm sm:text-base">
                      Your voice, your story, your way.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-2 rounded-lg mt-1 flex-shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg">
                      Community First
                    </h4>
                    <p className="text-white/80 text-sm sm:text-base">
                      Building connections that matter.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-white/20 p-2 rounded-lg mt-1 flex-shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg">
                      Quality Content
                    </h4>
                    <p className="text-white/80 text-sm sm:text-base">
                      Promoting meaningful conversations.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="max-w-9xl mx-auto mt-12 sm:mt-16 md:mt-20">
            <div className="text-center bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 backdrop-blur-xl p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-white/20">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={8}
                showBorder={false}
                className={`${inter.variable} text-2xl sm:text-3xl md:text-4xl font-bold pb-6 sm:pb-8`}
              >
                Ready to Share Your Story?
              </GradientText>

              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Join thousands of writers who are already making their mark.
                Your journey starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
                <Link
                  href={isLoggedIn ? "/dashboard/createBlog" : "/auth/signup"}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
                    className={`${inter.variable} font-bold text-base sm:text-lg`}
                  >
                    {isLoggedIn ? "Start Writing Now" : "Create New Article"}
                  </GradientText>
                </Link>
                <Link
                  href="/blog"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full font-bold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  Explore Stories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section
        id="contact"
        className="py-12 sm:py-16 md:py-20 bg-gray-50 relative"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <FloatingLines interactive={true} />
        </div>
        <div className="absolute inset-0 bg-black/20 z-[1] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2
              className={`${greatVibes.className} text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 sm:mb-6`}
            >
              Get In Touch
            </h2>
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={8}
              showBorder={false}
              className={`${inter.variable} text-base sm:text-lg md:text-xl lg:text-2xl px-4`}
            >
              {`Have questions? We'd love to hear from you.`}
            </GradientText>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            <div className="p-6 sm:p-8 rounded-2xl shadow-xl relative z-20 bg-black/30 backdrop-blur-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Send Us a Message
              </h3>

              {formStatus.message && (
                <div
                  className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg relative z-30 text-sm sm:text-base ${
                    formStatus.type === "success"
                      ? "bg-green-500/20 border border-green-500 text-green-100"
                      : "bg-red-500/20 border border-red-500 text-red-100"
                  }`}
                >
                  {formStatus.message}
                </div>
              )}

              <form
                onSubmit={handleContactSubmit}
                className="space-y-4 sm:space-y-6"
              >
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    className="placeholder:text-gray-400 w-full px-3 sm:px-4 py-2.5 sm:py-3 border-1 border-gray-300 rounded-lg transition text-gray-300 relative z-30 text-sm sm:text-base"
                    placeholder="Enter your name"
                    required
                    suppressHydrationWarning
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    className="placeholder:text-gray-400 w-full px-3 sm:px-4 py-2.5 sm:py-3 border-1 border-gray-300 rounded-lg transition text-gray-300 relative z-30 text-sm sm:text-base"
                    placeholder="john@example.com"
                    required
                    suppressHydrationWarning
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    className="placeholder:text-gray-400 w-full px-3 sm:px-4 py-2.5 sm:py-3 border-1 border-gray-300 rounded-lg transition h-28 sm:h-32 resize-none text-gray-300 relative z-30 text-sm sm:text-base"
                    placeholder="Tell us what's on your mind..."
                    required
                    suppressHydrationWarning
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full placeholder:text-gray-400 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold text-base sm:text-lg shadow-lg disabled:opacity-50 relative z-30"
                  suppressHydrationWarning
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="text-base sm:text-lg" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6 sm:space-y-8 md:space-y-16 relative z-20">
              <div className="px-6 sm:px-8 py-6 sm:py-10 rounded-2xl shadow-lg space-y-6 sm:space-y-10 bg-black/30 backdrop-blur-lg">
                <div className="flex items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="bg-white/10 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                    <FiMail className="text-blue-600 text-xl sm:text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg text-gray-300 mb-1">
                      Email
                    </h4>
                    <p className="text-gray-400 text-sm sm:text-base break-all">
                      support@blogify.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="bg-white/10 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                    <FiPhone className="text-green-600 text-xl sm:text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg text-gray-300 mb-1">
                      Phone
                    </h4>
                    <p className="text-gray-400 text-sm sm:text-base">
                      +91 12345 67890
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="bg-white/10 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                    <FiMapPin className="text-purple-600 text-xl sm:text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg text-gray-300 mb-1">
                      Location
                    </h4>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Delhi, India
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-black/30 backdrop-blur-lg p-6 sm:p-8 md:p-10 rounded-2xl text-white">
                <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  Follow Us
                </h4>
                <p className="mb-4 sm:mb-6 opacity-90 text-sm sm:text-base">
                  Stay connected with us on social media
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <a
                    href="#"
                    className="bg-white/10 p-2.5 sm:p-3 rounded-lg hover:bg-white/30 transition"
                  >
                    <FiTwitter size={20} className="sm:w-6 sm:h-6" />
                  </a>

                  <a
                    href="#"
                    className="bg-white/10 p-2.5 sm:p-3 rounded-lg hover:bg-white/30 transition"
                  >
                    <FiLinkedin size={20} className="sm:w-6 sm:h-6" />
                  </a>

                  <a
                    href="#"
                    className="bg-white/10 p-2.5 sm:p-3 rounded-lg hover:bg-white/30 transition"
                  >
                    <FiInstagram size={20} className="sm:w-6 sm:h-6" />
                  </a>

                  <a
                    href="#"
                    className="bg-white/10 p-2.5 sm:p-3 rounded-lg hover:bg-white/30 transition"
                  >
                    <FiGithub size={20} className="sm:w-6 sm:h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-white py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Nexus
              </h3>
              <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                Empowering writers and readers to share stories that matter.
              </p>
              <div className="flex gap-2 sm:gap-3">
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition"
                >
                  <FiTwitter size={18} className="sm:w-5 sm:h-5" />
                </a>
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition"
                >
                  <FiLinkedin size={18} className="sm:w-5 sm:h-5" />
                </a>
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition"
                >
                  <FiInstagram size={18} className="sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
                Quick Links
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <a href="#home" className="hover:text-white transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#blogs" className="hover:text-white transition">
                    Blogs
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
                Resources
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <Link
                    href="/auth/signup"
                    className="hover:text-white transition"
                  >
                    Get Started
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
                Newsletter
              </h4>
              <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                Subscribe to get the latest updates
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
            <p>2025 Nexus. All rights reserved. Made in India</p>
          </div>
        </div>
      </footer>
    </>
  );
}
