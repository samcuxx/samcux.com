"use client";

import { useSettings } from "@/hooks/use-settings";
import Script from "next/script";
import { useEffect } from "react";

interface SettingsProviderProps {
  children: React.ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const { seo, general } = useSettings();

  // Update document title and meta tags
  useEffect(() => {
    if (seo.siteTitle) {
      document.title = seo.siteTitle;
    }

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', seo.siteDescription);

    // Update Open Graph meta tags
    if (seo.ogImage) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', seo.ogImage);
    }

    // Update Twitter meta tags
    if (seo.twitterHandle) {
      let twitterCard = document.querySelector('meta[name="twitter:card"]');
      if (!twitterCard) {
        twitterCard = document.createElement('meta');
        twitterCard.setAttribute('name', 'twitter:card');
        document.head.appendChild(twitterCard);
      }
      twitterCard.setAttribute('content', 'summary_large_image');

      let twitterSite = document.querySelector('meta[name="twitter:site"]');
      if (!twitterSite) {
        twitterSite = document.createElement('meta');
        twitterSite.setAttribute('name', 'twitter:site');
        document.head.appendChild(twitterSite);
      }
      twitterSite.setAttribute('content', seo.twitterHandle);
    }
  }, [seo]);

  return (
    <>
      {/* Google Analytics */}
      {seo.googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${seo.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${seo.googleAnalyticsId}');
            `}
          </Script>
        </>
      )}
      {children}
    </>
  );
} 