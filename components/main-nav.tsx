import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      <Link
        href="/"
        className={cn(
          "transition-colors hover:text-foreground/80",
          pathname === "/" ? "text-foreground" : "text-foreground/60"
        )}
      >
        Home
      </Link>
      <Link
        href="/projects"
        className={cn(
          "transition-colors hover:text-foreground/80",
          pathname?.startsWith("/projects")
            ? "text-foreground"
            : "text-foreground/60"
        )}
      >
        Projects
      </Link>
      <Link
        href="/about"
        className={cn(
          "transition-colors hover:text-foreground/80",
          pathname === "/about" ? "text-foreground" : "text-foreground/60"
        )}
      >
        About
      </Link>
      <Link
        href="/contact"
        className={cn(
          "transition-colors hover:text-foreground/80",
          pathname === "/contact" ? "text-foreground" : "text-foreground/60"
        )}
      >
        Contact
      </Link>
    </nav>
  );
}
