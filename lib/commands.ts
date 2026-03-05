// Pengui — Veri erişim katmanı

import commandsData from "@/data/commands.json";
import { Command, CATEGORIES, Category, DISTROS, Distro } from "@/types/command";

// Tüm komutları getir
export function getAllCommands(): Command[] {
    return commandsData as Command[];
}

// Slug'a göre tek komut getir
export function getCommandBySlug(slug: string): Command | undefined {
    return getAllCommands().find((cmd) => cmd.slug === slug);
}

// Kategoriye göre komutları getir
export function getCommandsByCategory(categorySlug: string): Command[] {
    return getAllCommands().filter((cmd) => cmd.category === categorySlug);
}

// Tüm kategorileri getir
export function getAllCategories(): Category[] {
    return CATEGORIES;
}

// Slug'a göre kategori getir
export function getCategoryBySlug(slug: string): Category | undefined {
    return CATEGORIES.find((cat) => cat.slug === slug);
}

// Komut arama (isim ve açıklama üzerinden)
export function searchCommands(query: string): Command[] {
    const q = query.toLowerCase().trim();
    if (!q) return getAllCommands();

    return getAllCommands().filter(
        (cmd) =>
            cmd.command.toLowerCase().includes(q) ||
            cmd.description_tr.toLowerCase().includes(q)
    );
}

// Tüm komut slug'larını getir (SSG için)
export function getAllCommandSlugs(): string[] {
    return getAllCommands().map((cmd) => cmd.slug);
}

// Tüm kategori slug'larını getir (SSG için)
export function getAllCategorySlugs(): string[] {
    return CATEGORIES.map((cat) => cat.slug);
}

// Kategori başına komut sayısını getir
export function getCommandCountByCategory(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const cat of CATEGORIES) {
        counts[cat.slug] = getCommandsByCategory(cat.slug).length;
    }
    return counts;
}

// İlişkili komutları getir
export function getRelatedCommands(command: Command): Command[] {
    return command.related
        .map((slug) => getCommandBySlug(slug))
        .filter((cmd): cmd is Command => cmd !== undefined);
}

// Zorluk seviyesine göre komutları getir
export function getCommandsByDifficulty(
    difficulty: "kolay" | "orta" | "zor"
): Command[] {
    return getAllCommands().filter((cmd) => cmd.difficulty === difficulty);
}

// Tehlikeli komutları getir
export function getDangerousCommands(): Command[] {
    return getAllCommands().filter((cmd) => cmd.dangerous);
}

// Popüler komutları getir (ilk N)
export function getPopularCommands(limit: number = 6): Command[] {
    const popularSlugs = ["ls", "cd", "grep", "cat", "chmod", "ssh", "find", "ps", "curl", "tar"];
    return popularSlugs
        .map((slug) => getCommandBySlug(slug))
        .filter((cmd): cmd is Command => cmd !== undefined)
        .slice(0, limit);
}

// Yeni başlayanlar için komutları getir
export function getBeginnerCommands(limit: number = 6): Command[] {
    return getAllCommands()
        .filter((cmd) => cmd.difficulty === "kolay")
        .slice(0, limit);
}

// --- Distro fonksiyonları ---

// Tüm distro'ları getir
export function getAllDistros(): Distro[] {
    return DISTROS;
}

// Slug'a göre distro getir
export function getDistroBySlug(slug: string): Distro | undefined {
    return DISTROS.find((d) => d.slug === slug);
}

// Tüm distro slug'larını getir (SSG için)
export function getAllDistroSlugs(): string[] {
    return DISTROS.map((d) => d.slug);
}

// Belirli bir distroya ait komutları getir
export function getCommandsByDistro(distroSlug: string): Command[] {
    return getAllCommands().filter(
        (cmd) => cmd.distros && cmd.distros.includes(distroSlug)
    );
}

// Distro başına komut sayısını getir
export function getCommandCountByDistro(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const distro of DISTROS) {
        counts[distro.slug] = getCommandsByDistro(distro.slug).length;
    }
    return counts;
}

// Core komutları getir
export function getCoreCommands(): Command[] {
    return getAllCommands().filter((cmd) => cmd.scope === "core");
}
