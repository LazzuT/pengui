import { MetadataRoute } from "next";
import { getAllCommandSlugs, getAllCategorySlugs, getAllDistroSlugs } from "@/lib/commands";
import { getAllLearningModules } from "@/lib/learning";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://pengui.org";

    // Ana sayfalar
    const pages: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/hakkinda`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/distro`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/ogren`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        }
    ];

    // Kategoriler
    const categories = getAllCategorySlugs().map((slug) => ({
        url: `${baseUrl}/kategori/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    // Dağıtımlar
    const distros = getAllDistroSlugs().map((slug) => ({
        url: `${baseUrl}/distro/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    // Öğrenme Modülleri
    const learningModules = getAllLearningModules().map((mod) => ({
        url: `${baseUrl}/ogren/${mod.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
    }));

    // Komutlar
    const commands = getAllCommandSlugs().map((slug) => ({
        url: `${baseUrl}/komut/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
    }));

    return [...pages, ...categories, ...distros, ...learningModules, ...commands];
}
