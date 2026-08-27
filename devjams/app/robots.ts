import type { MetadataRoute } from "next";

export const SITE_URL = "https://devjams.dscvit.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Participant pages behind the portal login. A crawler only ever sees the
      // redirect shell, so there is nothing to index and no reason to spend
      // crawl budget on them.
      disallow: ["/portal/", "/profile", "/team", "/idea/", "/join", "/create", "/submissions/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
