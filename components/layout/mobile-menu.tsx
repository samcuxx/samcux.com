"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { User } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminPage: boolean;
  isActive: (path: string) => boolean;
  navLinks: Array<{ href: string; label: string }>;
}

export function MobileMenu({
  isOpen,
  onClose,
  isAdminPage,
  isActive,
  navLinks,
}: MobileMenuProps) {
  const profile = useQuery(api.profile.get);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full max-w-xs p-0">
        <SheetHeader className="p-6 border-b border-border/10">
          <SheetTitle className="text-lg font-semibold">
            Menu
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full p-6">
          <nav className="flex-1">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors hover:bg-accent ${isActive(link.href)
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-foreground/70 hover:text-foreground"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-border/40">
              {isAdminPage ? (
                <div className="space-y-3">
                  <Link
                    href="/admin/profile"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-accent"
                  >
                    {profile?.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{profile?.name || "Profile"}</span>
                      <span className="text-sm text-muted-foreground">{profile?.title || "View Profile"}</span>
                    </div>
                  </Link>
                  <Link
                    href="/"
                    onClick={onClose}
                    className="block px-4 py-3 text-base font-medium text-primary rounded-lg transition-colors hover:bg-primary/10"
                  >
                    View Site
                  </Link>
                </div>
              ) : (
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="block px-4 py-3 text-base font-medium text-primary rounded-lg transition-colors hover:bg-primary/10"
                >
                  Admin
                </Link>
              )}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}