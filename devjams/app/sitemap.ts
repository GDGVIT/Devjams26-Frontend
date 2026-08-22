import type { MetadataRoute } from "next";
import { SITE_URL } from "./robots";

/**
 * Only the two publicly meaningful entry points. Every other route is behind
 * the portal login and is disallowed in robots.ts, so listing them here would
 * just point crawlers at a redirect.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/portal`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
