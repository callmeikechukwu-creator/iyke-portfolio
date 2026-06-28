import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || "ikechukwualaeto.dev";
  const baseUrl = `https://${domain}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/projects/", "/skills", "/experience", "/contact", "/resume"],
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
