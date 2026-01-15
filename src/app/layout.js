import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientShell from "./components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
 title: {
  default: "Nexus-Blogs",
  template: "%s | Nexus — Write. Think. Publish."
}
,
  description: "A platform where creativity meets community. Write, publish, and inspire millions of readers around the globe. Join thousands of writers sharing their stories.",
  keywords: ["blog", "blogging", "writing", "content creation", "articles", "stories", "community", "writers", "readers", "nexus"],
  authors: [{ name: "Karan Singh Negi" }],
  creator: "Nexus",
  publisher: "Nexus",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nexusblog.com'),
  openGraph: {
    title: "Nexus - Share Your Thoughts With The World",
    description: "A platform where creativity meets community. Write, publish, and inspire millions of readers.",
    url: "",
    siteName: "Nexus Blog",
    images: [
      {
        url: "", 
        width: 1200,
        height: 630,
        alt: "Nexus Blog Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.svg" },
      { url: "/icon.svg", type: "image/svg", sizes: "82x82" },
    ],
    apple: [
      { url: "/favicon.svg", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon.svg",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
         <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}