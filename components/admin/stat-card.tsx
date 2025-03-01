"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  loading?: boolean;
  href?: string;
  linkText?: string;
  secondaryLink?: {
    href: string;
    text: string;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  loading = false,
  href,
  linkText,
  secondaryLink,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <span className="animate-pulse">...</span>
          ) : (
            value
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {(href || secondaryLink) && (
          <div className="mt-4 flex gap-2 text-sm">
            {href && (
              <Link
                href={href}
                className="text-primary hover:underline"
              >
                {linkText || "View all"}
              </Link>
            )}
            {href && secondaryLink && (
              <span className="text-muted-foreground">•</span>
            )}
            {secondaryLink && (
              <Link
                href={secondaryLink.href}
                className="text-primary hover:underline"
              >
                {secondaryLink.text}
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 