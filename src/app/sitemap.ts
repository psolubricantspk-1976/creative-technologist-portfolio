import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { allArticles, collections } from "@/content/help-center";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const helpArticles: MetadataRoute.Sitemap = allArticles().map(
    ({ collection, article }) => ({
      url: `${siteConfig.url}/help/${collection.slug}/${article.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  const helpCollections: MetadataRoute.Sitemap = collections.map((collection) => ({
    url: `${siteConfig.url}/help/${collection.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [
    {
      url: `${siteConfig.url}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/start`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/help`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...helpCollections,
    ...helpArticles,
    {
      url: `${siteConfig.url}/legal`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
