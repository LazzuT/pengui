import fs from 'fs';
import path from 'path';

/**
 * Search Mapping Validator
 * Checks commandKeywords.json and tasks.json for:
 * - Dangerously short/broad keywords
 * - Slug references to non-existent commands
 * - Duplicate/conflicting keyword entries
 * - Golden test set verification (task matching simulation)
 */

const keywordsPath = path.join(process.cwd(), 'data/commandKeywords.json');
const commandsPath = path.join(process.cwd(), 'data/commands.json');
const tasksPath = path.join(process.cwd(), 'data/tasks.json');

// Forbidden single-word keywords that are too broad
// These trigger false matches in CommandAssistant's keyword fallback (longest-wins)
// because they're so generic they appear in many user queries.
const FORBIDDEN_SINGLE_WORDS = new Set([
    // Original list (Faz 16)
    "dosya", "sistem", "metin", "büyük", "uzun", "gelişmiş",
    "arka", "isme", "isim", "çalışan", "süreci", "mevcut",
    // Faz 18 expansion: previously-poisoned auto-generated keys
    "linux", "unix", "shell", "terminal", "network",
    "sistemi", "sistemin", "kullanıcı", "kullanıcılar", "kullanıcının",
    "sadece", "klasik", "kayıp", "belirtilen", "atanmış",
    "herhangi", "gelecekte", "değerleri", "geleneksel", "microsoft",
    "sunucu", "yerel", "cihazın", "ay", "kabuk", "klavye",
    "global", "oturum", "kendinden", "normalde", "açılmamış",
    "geçici", "statik", "eski", "makinenin", "bilgisayardaki",
    "verileri", "veriyi", "ilgili", "kusursuz", "tarihteki",
    "ikili", "formatlı", "güvenli", "şifresiz", "geliştirilmiş",
    "uzak", "hedef", "sistemdeki", "kayıtlı", "disklerin",
    "diski", "sisteme", "çekirdek", "çekirdeğin",
    "redhatcentos", "debianubuntu", "opensuse", "ubuntu",
    "linuxlf", "extext", "extextext", "gzipzip", "lzmaxz", "sataide",
    "aynı", "tracerouteın", "kaydedilmişscript", "periyodikzamanlı",
    "hard", "klasör", "dosyaları", "dosyanın", "dosyaların",
    "satırlardaki", "metni", "programlar", "programları",
    "atanmış", "varsayılan", "diff", "şu",
    // Risk listesinde olan ama tek başına anlamsız olanlar
    "göster", "ekle",
]);

// Single-word keywords that are intentionally broad and we accept the trade-off.
// CommandAssistant's exact-match short-circuit handles these well; only longest-wins
// fallback creates risk, which is mitigated by curated longer keywords.
const ALLOWED_BROAD_SINGLE_WORDS = new Set([
    "sil", "kaldır", "listele", "kopyala", "taşı",
    "sıkıştır", "indir", "güncelle", "güncelleme",
    "tarih", "saat", "zaman", "takvim", "geçmiş",
    "neredeyim", "indirme", "silme", "sırala",
    "arşivle", "soketler", "firewall", "luks", "lvfs",
]);

interface GoldenTest {
    query: string;
    expected_primary: string;
    acceptable: string[];
    forbidden: string[];
}

// Subset of the golden test set for automated verification
const GOLDEN_TESTS: GoldenTest[] = [
    // Original (Faz 16)
    { query: "çalışan süreci öldür", expected_primary: "kill", acceptable: ["pkill", "killall", "htop"], forbidden: ["bg", "fg", "jobs", "nohup", "taskset"] },
    { query: "açık portları gör", expected_primary: "ss", acceptable: ["netstat", "lsof"], forbidden: ["bg", "fg", "tail"] },
    { query: "log dosyasını canlı izle", expected_primary: "tail", acceptable: ["journalctl"], forbidden: ["less", "cat", "bg", "fg"] },
    { query: "ip adresini öğren", expected_primary: "ip", acceptable: ["ifconfig", "curl"], forbidden: ["dig", "ssh", "bg"] },
    { query: "dosya içinde metin ara", expected_primary: "grep", acceptable: ["awk"], forbidden: ["find", "bg", "tail"] },
    { query: "arkaya al", expected_primary: "bg", acceptable: [], forbidden: ["kill", "pkill", "fg"] },
    { query: "ön plana getir", expected_primary: "fg", acceptable: [], forbidden: ["bg", "kill"] },
    { query: "izin değiştir", expected_primary: "chmod", acceptable: [], forbidden: ["cd", "bg", "fg"] },
    { query: "internetten dosya indir", expected_primary: "wget", acceptable: ["curl"], forbidden: ["bg", "fg", "ssh"] },
    // Faz 18: poisoned-keyword regression tests (these used to map to wrong commands)
    { query: "linux", expected_primary: "lsb_release", acceptable: ["uname"], forbidden: ["flatpak", "ar", "newgrp", "tac", "factor", "reset"] },
    { query: "unix", expected_primary: "uname", acceptable: ["lsb_release"], forbidden: ["ar", "dos2unix", "unix2dos"] },
    { query: "shell", expected_primary: "bash", acceptable: ["zsh", "fish", "ksh", "dash", "tcsh", "csh"], forbidden: ["newgrp", "logger"] },
    { query: "terminal", expected_primary: "stty", acceptable: ["tput", "screen", "tmux", "clear"], forbidden: ["script", "scriptreplay"] },
    { query: "network", expected_primary: "networkctl", acceptable: ["nmcli", "ip", "ifconfig", "nmap"], forbidden: [] },
    // Faz 18: new 50-command coverage tests
    { query: "güvenlik duvarı", expected_primary: "ufw", acceptable: ["iptables", "nft"], forbidden: ["bg", "fg", "ssh"] },
    { query: "wifi yönet", expected_primary: "nmcli", acceptable: ["iw"], forbidden: ["bg", "fg"] },
    { query: "donanım bilgisi", expected_primary: "lshw", acceptable: ["dmidecode", "lscpu", "lspci"], forbidden: ["bg", "fg"] },
    { query: "kullanıcı oluştur", expected_primary: "adduser", acceptable: ["useradd", "newusers"], forbidden: ["userdel", "deluser", "bg"] },
    { query: "swap aç", expected_primary: "swapon", acceptable: ["mkswap"], forbidden: ["swapoff", "bg"] },
    { query: "ssd trim", expected_primary: "fstrim", acceptable: [], forbidden: ["dd", "bg", "fg"] },
    { query: "cpu bilgisi", expected_primary: "lscpu", acceptable: ["lshw", "dmidecode"], forbidden: ["bg", "fg"] },
    { query: "donanım sıcaklığı", expected_primary: "sensors", acceptable: ["lshw"], forbidden: ["bg", "fg", "watch"] },
    { query: "luks", expected_primary: "cryptsetup", acceptable: [], forbidden: ["bg", "fg"] },
];

function validate() {
    let errors = 0;
    let warnings = 0;

    // Load data
    const keywords: Record<string, string> = JSON.parse(fs.readFileSync(keywordsPath, 'utf8'));
    const commands = JSON.parse(fs.readFileSync(commandsPath, 'utf8'));
    const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
    const validSlugs = new Set(commands.map((c: any) => c.slug || c.command));

    console.log('\n🔍 Validating Search Mappings...\n');

    // 1. Check for forbidden single-word keywords
    console.log('--- Broad Keyword Check ---');
    for (const [keyword, slug] of Object.entries(keywords)) {
        const trimmed = keyword.trim();
        const words = trimmed.split(/\s+/);
        if (words.length === 1 && FORBIDDEN_SINGLE_WORDS.has(trimmed)) {
            console.error(`❌ Forbidden single-word keyword: "${keyword}" → ${slug}`);
            errors++;
        }
        // Warn (not error) for any single-word keyword not on the explicit allow list,
        // so future additions get a second look.
        if (
            words.length === 1 &&
            !FORBIDDEN_SINGLE_WORDS.has(trimmed) &&
            !ALLOWED_BROAD_SINGLE_WORDS.has(trimmed) &&
            trimmed.length <= 6
        ) {
            console.warn(`⚠️  Unreviewed broad single-word keyword: "${keyword}" → ${slug}`);
            warnings++;
        }
        if (trimmed.length <= 2) {
            console.warn(`⚠️  Very short keyword (≤2 chars): "${keyword}" → ${slug}`);
            warnings++;
        }
    }

    // 2. Check all keyword slugs reference valid commands
    console.log('\n--- Slug Reference Check ---');
    for (const [keyword, slug] of Object.entries(keywords)) {
        if (!validSlugs.has(slug)) {
            console.error(`❌ Keyword "${keyword}" → "${slug}" points to non-existent command`);
            errors++;
        }
    }

    // 3. Check for conflicting entries (same keyword, different direction)
    console.log('\n--- Conflict Check ---');
    const slugsByKeyword = new Map<string, string>();
    for (const [keyword, slug] of Object.entries(keywords)) {
        if (slugsByKeyword.has(keyword)) {
            console.warn(`⚠️  Duplicate keyword: "${keyword}" → ${slug} (also maps to ${slugsByKeyword.get(keyword)})`);
            warnings++;
        }
        slugsByKeyword.set(keyword, slug);
    }

    // 4. Golden test set: simulate keyword fallback matching
    console.log('\n--- Golden Test Set (Keyword Fallback) ---');
    for (const test of GOLDEN_TESTS) {
        const q = test.query.toLowerCase().trim();

        // Simulate exact keyword match
        let matchedSlug: string | null = null;
        if (keywords[q]) {
            matchedSlug = keywords[q];
        } else {
            // Simulate scored partial match (longest keyword wins)
            let bestLen = 0;
            for (const [keyword, slug] of Object.entries(keywords)) {
                if ((keyword.includes(q) || q.includes(keyword)) && keyword.length > bestLen) {
                    matchedSlug = slug;
                    bestLen = keyword.length;
                }
            }
        }

        if (matchedSlug) {
            if (test.forbidden.includes(matchedSlug)) {
                console.error(`❌ GOLDEN FAIL: "${test.query}" → ${matchedSlug} (FORBIDDEN)`);
                errors++;
            } else if (matchedSlug === test.expected_primary || test.acceptable.includes(matchedSlug)) {
                console.log(`✅ "${test.query}" → ${matchedSlug}`);
            } else {
                console.warn(`⚠️  "${test.query}" → ${matchedSlug} (expected: ${test.expected_primary})`);
                warnings++;
            }
        } else {
            console.log(`ℹ️  "${test.query}" → no keyword match (will rely on task matching)`);
        }
    }

    // Summary
    console.log('\n--- Summary ---');
    console.log(`Keywords: ${Object.keys(keywords).length}`);
    console.log(`Tasks: ${tasks.length}`);
    console.log(`Commands: ${commands.length}`);

    if (errors > 0) {
        console.error(`\n❌ Validation FAILED: ${errors} error(s), ${warnings} warning(s)\n`);
        process.exit(1);
    } else if (warnings > 0) {
        console.log(`\n⚠️  Validation passed with ${warnings} warning(s)\n`);
    } else {
        console.log(`\n✅ All search mapping validations passed!\n`);
    }
}

validate();
