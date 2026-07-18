// Pengui — Ortak arama motoru (Faz 19)
//
// Daha önce arama mantığı üç ayrı yerde tekrarlanıyordu:
//   1) components/CommandAssistant.tsx (token-based skorlama pipeline'ı)
//   2) components/SearchBar.tsx (basit substring skorlaması)
//   3) lib/commands.ts -> searchCommands() (sade includes)
//
// Bu modül tek bir referans pipeline sağlar. Her iki tüketici de (asistan ve
// arama çubuğu) aynı veriye aynı kurallarla bakar; böylece "metin ara" gibi bir
// sorgu her ikisinde de grep'e ulaşır.

import type { Command } from "@/types/command";
import type { Task } from "@/types/task";

export interface SearchContext {
    commands: Command[];
    keywords: Record<string, string>;
    tasks: Task[];
}

export type Confidence = "high" | "medium" | "low" | "none";

export interface DisambiguationOption {
    label: string;
    slug: string;
    hint: string;
}

export interface SearchResult {
    /** Asistan: eşleşen görev kartı (varsa). */
    matchedTask: Task | null;
    /** Asistan: tek en iyi komut önerisi (görev yoksa). */
    suggestion: Command | null;
    /** Arama çubuğu: sıralı komut listesi (keyword + görev farkındalıklı). */
    results: Command[];
    /** Asistan: belirsiz tek-kelime sorgularda 2-3 seçenekli kart. */
    disambiguation: DisambiguationOption[] | null;
    /** Eşleşmenin güven seviyesi. */
    confidence: Confidence;
}

// Tek kelimelik belirsiz sorgular: tek bir "doğru" cevap yok; kullanıcıya
// 2-3 net seçenek sunmak en doğru UX'tir. Motor düzeyinde tutulur ki hem
// CommandAssistant tüketsin hem de test edilebilsin.
export const DISAMBIGUATION: Record<string, DisambiguationOption[]> = {
    "wifi": [
        { label: "WiFi ağına bağlan", slug: "nmcli", hint: "nmcli device wifi connect" },
        { label: "WiFi ağlarını tara", slug: "iw", hint: "iw dev wlan0 scan" },
    ],
    "firewall": [
        { label: "Basit güvenlik duvarı (ufw)", slug: "ufw", hint: "ufw allow 22/tcp" },
        { label: "Klasik kural motoru (iptables)", slug: "iptables", hint: "iptables -L" },
        { label: "Modern kural motoru (nft)", slug: "nft", hint: "nft list ruleset" },
    ],
    "güvenlik duvarı": [
        { label: "Basit güvenlik duvarı (ufw)", slug: "ufw", hint: "ufw allow 22/tcp" },
        { label: "Klasik kural motoru (iptables)", slug: "iptables", hint: "iptables -L" },
        { label: "Modern kural motoru (nft)", slug: "nft", hint: "nft list ruleset" },
    ],
    "swap": [
        { label: "Swap alanını oluştur", slug: "mkswap", hint: "mkswap /swapfile" },
        { label: "Swap'i etkinleştir", slug: "swapon", hint: "swapon /swapfile" },
        { label: "Swap'i kapat", slug: "swapoff", hint: "swapoff /swapfile" },
    ],
    "kullanıcı": [
        { label: "Yeni kullanıcı ekle", slug: "adduser", hint: "adduser kullanici" },
        { label: "Kullanıcı sil", slug: "deluser", hint: "deluser kullanici" },
        { label: "Parola değiştir", slug: "passwd", hint: "passwd kullanici" },
    ],
};

// Türkçe stop-word listesi: tek başlarına anlam taşımayan bağlaçlar.
const STOP_WORDS = new Set([
    "ve", "bir", "ile", "de", "da", "için", "gibi", "bu", "şu", "o",
    "ama", "hem", "ya", "ne", "mi", "mı", "mu", "mü", "en", "olan",
    "veya", "den", "dan", "ten", "tan", "ki", "deki", "daki",
]);

const MIN_TASK_SCORE = 15;
const HIGH_TASK_SCORE = 40;

/**
 * İki token eşleşiyor mu? Çok kısa token'larda (<=2 karakter, ör. "et", "al")
 * substring eşleşmesi yanlış pozitif üretir ("network" içinde "et" gibi), bu
 * yüzden kısa token'lar yalnızca birebir eşitse eşleşir.
 */
function tokenMatch(a: string, b: string): boolean {
    if (a === b) return true;
    if (a.length <= 2 || b.length <= 2) return false;
    return a.includes(b) || b.includes(a);
}

/** Sorgu metnini anlamlı token'lara ayırır. */
export function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

/** Bir görevin sorguya göre puanını hesaplar (CommandAssistant ile aynı kurallar). */
function scoreTask(task: Task, q: string, queryTokens: string[]): number {
    let score = 0;
    if (task.primary_command.toLowerCase() === q) score += 100;
    if (task.alternatives.some((alt) => alt.toLowerCase() === q)) score += 80;
    if (task.task.toLowerCase().includes(q)) score += 60;

    if (queryTokens.length > 0) {
        const titleTokens = tokenize(task.task);
        const descTokens = tokenize(task.description);
        let titleHits = 0;
        let descHits = 0;
        for (const qt of queryTokens) {
            if (titleTokens.some((tt) => tokenMatch(qt, tt))) titleHits++;
            if (descTokens.some((dt) => tokenMatch(qt, dt))) descHits++;
        }
        score += Math.round((titleHits / queryTokens.length) * 40);
        score += Math.round((descHits / queryTokens.length) * 15);
    }
    return score;
}

/** Sorguya en uygun görevi ve puanını bulur. */
function bestTaskFor(q: string, queryTokens: string[], tasks: Task[]): { task: Task | null; score: number } {
    let best: Task | null = null;
    let highest = 0;
    for (const t of tasks) {
        const s = scoreTask(t, q, queryTokens);
        if (s > highest) {
            highest = s;
            best = t;
        }
    }
    return { task: best, score: highest };
}

/** Longest-wins kısmi keyword eşleşmesi. */
function bestPartialKeyword(q: string, keywords: Record<string, string>): string | null {
    let bestSlug: string | null = null;
    let bestLen = 0;
    for (const [keyword, slug] of Object.entries(keywords)) {
        if ((keyword.includes(q) || q.includes(keyword)) && keyword.length > bestLen) {
            bestSlug = slug;
            bestLen = keyword.length;
        }
    }
    return bestSlug;
}

/**
 * Arama çubuğu için sıralı komut listesi üretir.
 * Komut metni skorlamasına ek olarak keyword ve görev farkındalığı eklenir,
 * böylece "metin ara" gibi doğal sorgular da doğru komutu üste taşır.
 */
function rankCommands(q: string, queryTokens: string[], ctx: SearchContext): Command[] {
    const { commands, keywords, tasks } = ctx;
    const searchTerms = q.split(/\s+/).filter(Boolean);

    const scored = commands.map((cmd) => {
        let score = 0;
        const name = cmd.command.toLowerCase();
        const desc = cmd.description_tr.toLowerCase();
        if (name === q) score += 100;
        else if (name.startsWith(q)) score += 40;
        const allTermsMatch = searchTerms.every((term) => name.includes(term) || desc.includes(term));
        if (allTermsMatch) score += 20;
        return { cmd, score };
    });

    const boost = (slug: string, amount: number) => {
        const entry = scored.find((s) => s.cmd.slug === slug);
        if (entry) entry.score += amount;
    };

    // Exact keyword eşleşmesi en güçlü sinyal
    if (keywords[q]) boost(keywords[q], 120);

    // Görev eşleşmesi: primary + alternatifleri öne çıkar
    const { task, score: taskScore } = bestTaskFor(q, queryTokens, tasks);
    if (task && taskScore >= MIN_TASK_SCORE) {
        boost(task.primary_command, 90);
        task.alternatives.forEach((alt) => boost(alt, 30));
    }

    // Longest-wins kısmi keyword
    const partial = bestPartialKeyword(q, keywords);
    if (partial) boost(partial, 50);

    return scored
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.cmd);
}

/**
 * Ortak arama girişi. Hem asistan (matchedTask/suggestion) hem arama çubuğu
 * (results) için tek geçişte sonuç üretir.
 */
export function search(query: string, ctx: SearchContext): SearchResult {
    const q = query.toLowerCase().trim();
    if (!q) {
        return { matchedTask: null, suggestion: null, results: [], disambiguation: null, confidence: "none" };
    }

    const { commands, keywords, tasks } = ctx;
    const queryTokens = tokenize(q);
    const results = rankCommands(q, queryTokens, ctx);

    // 0) Belirsiz tek-kelime sorgu → seçenek (disambiguation) kartı
    if (DISAMBIGUATION[q]) {
        return { matchedTask: null, suggestion: null, results, disambiguation: DISAMBIGUATION[q], confidence: "medium" };
    }

    // 1) Exact keyword pre-check (en yüksek güven)
    if (keywords[q]) {
        const cmd = commands.find((c) => c.slug === keywords[q]);
        if (cmd) {
            return { matchedTask: null, suggestion: cmd, results, disambiguation: null, confidence: "high" };
        }
    }

    // Görev skorlamasını önceden hesapla (exact-command kuralı için gerekli)
    const { task, score } = bestTaskFor(q, queryTokens, tasks);
    const taskIsPrimary = !!task && task.primary_command.toLowerCase() === q;

    // 2) Tam komut adı önceliği:
    // Kullanıcı tam bir komut adı yazdıysa (ör. "ls"), bu komutu yalnızca
    // "alternatif" olarak içeren bir görev (ör. du) onu gölgelememeli.
    // Görev, komutu PRIMARY olarak kullanıyorsa (ör. "grep" -> grep görevi) yine görev gösterilir.
    const exactCmd = commands.find((c) => c.command.toLowerCase() === q || c.slug === q);
    if (exactCmd && !taskIsPrimary) {
        return { matchedTask: null, suggestion: exactCmd, results, disambiguation: null, confidence: "high" };
    }

    // 3) Görev skorlaması
    if (task && score >= MIN_TASK_SCORE) {
        return {
            matchedTask: task,
            suggestion: null,
            results,
            disambiguation: null,
            confidence: score >= HIGH_TASK_SCORE ? "high" : "medium",
        };
    }

    // 4) Longest-wins kısmi keyword fallback
    const partialSlug = bestPartialKeyword(q, keywords);
    if (partialSlug) {
        const cmd = commands.find((c) => c.slug === partialSlug);
        if (cmd) {
            return { matchedTask: null, suggestion: cmd, results, disambiguation: null, confidence: "low" };
        }
    }

    // 5) Son çare: komut adı/açıklaması içinde geçiyor mu
    const found = commands.find(
        (c) =>
            c.description_tr.toLowerCase().includes(q) ||
            c.command.toLowerCase().includes(q)
    );
    return {
        matchedTask: null,
        suggestion: found || null,
        results,
        disambiguation: null,
        confidence: found ? "low" : "none",
    };
}
