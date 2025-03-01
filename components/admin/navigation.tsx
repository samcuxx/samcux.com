"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import {
  Cog,
  LayoutDashboard,
  FileText,
  Image,
  MessageSquare,
  Folder,
  User,
  PenTool,
  Briefcase,
  Mail,
  LogOut,
  Home,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useContext, createContext } from "react";

// Create a context to track if we're in a sheet
const SheetContext = createContext(false);

interface AdminNavigationProps {
  inSheet?: boolean;
}

export function AdminNavigation({ inSheet = false }: AdminNavigationProps) {
  const pathname = usePathname();

  const isActive = (route: typeof routes[0]) => {
    if (route.exact) {
      return pathname === route.href;
    }
    return pathname.startsWith(route.href);
  };

  // Render a navigation item with or without SheetClose based on context
  const NavItem = ({ route }: { route: typeof routes[0] }) => {
    const button = (
      <Button
        variant={isActive(route) ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-2 text-sm font-medium",
          isActive(route) ? "bg-secondary" : "hover:bg-secondary/50"
        )}
        asChild
      >
        <Link href={route.href}>
          <route.icon className="h-4 w-4" />
          {route.label}
        </Link>
      </Button>
    );

    if (inSheet) {
      return <SheetClose asChild>{button}</SheetClose>;
    }
    
    return button;
  };

  // Render action buttons with or without SheetClose
  const ActionButton = ({ 
    href, 
    icon: Icon, 
    label, 
    variant = "ghost",
    className = "",
    target
  }: { 
    href: string; 
    icon: any; 
    label: string;
    variant?: string;
    className?: string;
    target?: string;
  }) => {
    const button = (
      <Button
        variant={variant as any}
        className={cn("w-full justify-start gap-2 text-sm font-medium", className)}
        asChild
      >
        <Link href={href} target={target}>
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      </Button>
    );

    if (inSheet) {
      return <SheetClose asChild>{button}</SheetClose>;
    }
    
    return button;
  };

  return (
    <div className="space-y-4 py-2">
      <div className="px-3 py-2">
        <div className="space-y-1">
          {routes.map((route) => (
            <NavItem key={route.href} route={route} />
          ))}
        </div>
      </div>
      <Separator />
      <div className="px-3 py-2">
        <div className="space-y-1">
          <ActionButton 
            href="/" 
            icon={Home} 
            label="View Site" 
            target="_blank"
          />
          <ActionButton 
            href="/api/auth/signout" 
            icon={LogOut} 
            label="Sign Out" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          />
        </div>
      </div>
    </div>
  );
}

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    exact: true,
  },
  {
    label: "Profile",
    icon: User,
    href: "/admin/profile",
  },
  {
    label: "Projects",
    icon: Briefcase,
    href: "/admin/projects",
  },
 
  {
    label: "Messages",
    icon: Mail,
    href: "/admin/messages",
  },
 

  {
    label: "Settings",
    icon: Cog,
    href: "/admin/settings",
  },
]; 