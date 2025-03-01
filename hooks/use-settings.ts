import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useSettings() {
  const settings = useQuery(api.settings.getAll);

  return {
    general: {
      siteName: settings?.["general.siteName"] || "",
      siteUrl: settings?.["general.siteUrl"] || "",
      contactEmail: settings?.["general.contactEmail"] || "",
      enableBlog: settings?.["general.enableBlog"] ?? true,
      enableComments: settings?.["general.enableComments"] ?? true,
      enableContactForm: settings?.["general.enableContactForm"] ?? true,
    },
    seo: {
      siteTitle: settings?.["seo.siteTitle"] || "",
      siteDescription: settings?.["seo.siteDescription"] || "",
      ogImage: settings?.["seo.ogImage"] || "",
      twitterHandle: settings?.["seo.twitterHandle"] || "",
      googleAnalyticsId: settings?.["seo.googleAnalyticsId"] || "",
    },
  };
} 