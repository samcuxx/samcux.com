"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Menu, User, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileMenu } from "./mobile-menu";

export default function Header() {
  const pathname = usePathname();
  const profile = useQuery(api.profile.get);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isAdminPage = pathname.startsWith("/admin");
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">SamCux</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-foreground/80 text-sm font-medium ${
                isActive(link.href)
                  ? "text-foreground font-bold"
                  : "text-foreground/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {isAdminPage ? (
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/admin/profile"
                className={`transition-colors hover:text-foreground/80 ${
                  isActive("/admin/profile")
                    ? "text-foreground font-bold"
                    : "text-foreground/60"
                }`}
              >
                <div className="flex items-center gap-2">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <span>Profile</span>
                </div>
              </Link>
              <Link
                href="/"
                className="rounded-md bg-primary/10 text-primary px-4 py-2 text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                View Site
              </Link>
            </div>
          ) : (
            <Link
              href="/admin"
              className="hidden md:inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Admin
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-accent"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAdminPage={isAdminPage}
        isActive={isActive}
        navLinks={navLinks}
      />
    </header>
  );
}
