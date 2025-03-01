"use client";

import Link from "next/link";
import { useSettings } from "@/hooks/use-settings";

export function Header() {
  const { general } = useSettings();

  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          {general.siteName || "Portfolio"}
        </Link>
        <nav className="space-x-4">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          {general.enableBlog && (
            <Link href="/blog" className="hover:text-primary">
              Blog
            </Link>
          )}
          {general.enableContactForm && (
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
} 