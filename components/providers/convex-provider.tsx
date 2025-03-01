"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProvider } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // Check if Clerk publishable key is available
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured =
    clerkPublishableKey && clerkPublishableKey !== "your_clerk_publishable_key";

  // If Clerk is not configured, use the basic ConvexProvider
  if (!isClerkConfigured) {
    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
  }

  // If Clerk is configured, use ConvexProviderWithClerk
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
