import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">SamCux</span>
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} SamCux. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="https://github.com/samcux"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            GitHub
          </Link>
          <Link
            href="https://twitter.com/samcux"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Twitter
          </Link>
          <Link
            href="https://linkedin.com/in/samcux"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
