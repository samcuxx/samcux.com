"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminContactPage() {
  return (
    <div className="container py-12">
      <Link
        href="/admin"
        className="inline-flex items-center text-sm hover:underline mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold mb-8">Contact Management</h1>
      
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-medium mb-4">Coming Soon</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The contact management feature is currently under development. Check back soon!
        </p>
      </div>
    </div>
  );
}