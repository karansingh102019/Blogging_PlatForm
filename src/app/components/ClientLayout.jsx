"use client";

import { useEffect, useState } from "react";
import PortfolioLoader from "./PortfolioLoader";


export default function ClientShell({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety: ensure splash hides even if GSAP callback fails
    const fallback = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(fallback);
  }, []);

  return (
    <>
      {/* APP CONTENT (ALWAYS MOUNTED) */}
      <div
        className={`transition-opacity duration-700 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>

      {/* SPLASH OVERLAY */}
      {loading && <PortfolioLoader onDone={() => setLoading(false)} />}
    </>
  );
}
