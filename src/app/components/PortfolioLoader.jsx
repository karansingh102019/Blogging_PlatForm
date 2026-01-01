"use client";
import React, { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const codingSymbols = [
  "< />","{ }","( )","[ ]","</>","<div>","</div>",
  "<script>","<head>","<meta>","<link>","<span>","<p>",
];

const techIcons = [
  "BLOG",
  "WRITE",
  "POST",
  "READ",
  "Draft",
  "MARKDOWN",
  "SEO",
  "login",
  "Like",
  "Saved"
];

export default function PortfolioLoader({ onDone }) {
  const wrapRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);

  // Generate floating items once with useMemo to ensure consistency
  const floatingItems = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => {
      const item =
        i % 2 === 0
          ? codingSymbols[i % codingSymbols.length]
          : techIcons[i % techIcons.length];

      // Use deterministic values based on index
      const seed1 = (i * 73 + 17) % 100;
      const seed2 = (i * 41 + 29) % 100;
      const seed3 = (i * 97 + 13) % 100;

      return {
        id: i,
        item,
        top: seed1 + "%",
        left: seed2 + "%",
        duration: 4 + (seed3 / 100) * 3,
      };
    });
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(wrapRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 });

    tl.fromTo(
      "#logo-stroke",
      { strokeDasharray: 800, strokeDashoffset: 800 },
      { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }
    );

    tl.fromTo(
      logoRef.current,
      { scale: 0.85, opacity: 0.6 },
      { scale: 1, opacity: 1, duration: 0.8 },
      "-=1.0"
    );

    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.4"
    );

    tl.to(wrapRef.current, {
      opacity: 0,
      duration: 0.6,
      delay: 0.8,
      onComplete: () => onDone && onDone(),
    });
  }, [onDone]);

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 bg-black flex items-center justify-center z-[9999] overflow-hidden"
    >
      {/* Blue Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_70%)]" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.06]
        bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),
        linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)]
        bg-[size:50px_50px]" />

      {/* LOGO */}
      <div ref={logoRef} className="relative flex flex-col items-center select-none">
        <svg width="230" height="230" viewBox="0 0 200 200" fill="none">
          <path
            id="logo-stroke"
            d="M40 150 L40 60 L70 60 L70 110 L110 60 L150 60
               L150 150 L120 150 L120 100 L85 150 L40 150 Z"
            stroke="#38bdf8"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div
          ref={textRef}
          className="text-sky-300/80 tracking-[0.25em]
          uppercase font-semibold mt-3"
        >
          UI-DEVELOPER
        </div>
      </div>

      {/* FLOATING ITEMS */}
      {floatingItems.map((floatItem) => (
        <div
          key={floatItem.id}
          className="absolute font-mono select-none"
          style={{
            top: floatItem.top,
            left: floatItem.left,
            animation: `floatTag ${floatItem.duration}s linear infinite`,
            color: "#38bdf8",
            fontSize: "20px",
          }}
        >
          {floatItem.item}
        </div>
      ))}

      <style>{`
        @keyframes floatTag {
          0% { transform: translateY(0); opacity: 0.3; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-60px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}