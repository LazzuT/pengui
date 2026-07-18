import fs from 'fs';
import path from 'path';
import { search } from '../lib/search';

/**
 * Arama Motoru Oyun Alanı (manuel test aracı)
 *
 * Kullanım:
 *   npx tsx scripts/searchPlayground.ts                 # varsayılan sorgu bataryası
 *   npx tsx scripts/searchPlayground.ts "metin ara"     # tek bir sorgu test et
 *   npx tsx scripts/searchPlayground.ts "wifi" "swap"   # birden çok sorgu
 *
 * Her sorgu için motorun döndürdüğü:
 *   - matchedTask (görev kartı)   - suggestion (tek öneri)
 *   - results[0..2] (arama çubuğu) - confidence (güven)
 */

const dataDir = path.join(process.cwd(), 'data');
const commands = JSON.parse(fs.readFileSync(path.join(dataDir, 'commands.json'), 'utf8'));
const keywords = JSON.parse(fs.readFileSync(path.join(dataDir, 'commandKeywords.json'), 'utf8'));
const tasks = JSON.parse(fs.readFileSync(path.join(dataDir, 'tasks.json'), 'utf8'));

const ctx = { commands, keywords, tasks } as any;

// Varsayılan batarya: golden + disambiguation + doğal cümleler + uç durumlar
const DEFAULT_QUERIES = [
    // Doğal görev cümleleri
    'metin ara', 'açık portları gör', 'dosya içinde metin ara', 'log dosyasını canlı izle',
    'çalışan süreci öldür', 'en büyük dosyaları bul', 'izin değiştir', 'internetten dosya indir',
    // Belirsiz tek kelimeler (disambiguation beklenir)
    'wifi', 'firewall', 'güvenlik duvarı', 'swap', 'kullanıcı',
    // Geçmişte zehirli olan tek kelimeler
    'linux', 'unix', 'shell', 'terminal', 'network',
    // Doğrudan komut adı
    'ls', 'grep', 'chmod', 'ssh',
    // Uç durumlar
    '', 'x', 'asdfqwer', 'cpu bilgisi', 'donanım sıcaklığı',
];

const queries = process.argv.slice(2).length > 0 ? process.argv.slice(2) : DEFAULT_QUERIES;

function fmt(q: string): string {
    const r = search(q, ctx);
    const task = r.matchedTask ? `TASK:${r.matchedTask.primary_command}` : '—';
    const sug = r.suggestion ? `SUG:${r.suggestion.slug}` : '—';
    const top = r.results.slice(0, 3).map((c: any) => c.slug).join(', ') || '—';
    const disambig = r.disambiguation
        ? r.disambiguation.map((o) => o.slug).join(' | ')
        : '—';
    const label = q === '' ? '(boş)' : q;
    return [
        `🔎 "${label}"`,
        `   görev:      ${task}`,
        `   öneri:      ${sug}`,
        `   seçenekler: ${disambig}`,
        `   liste[0-2]: ${top}`,
        `   güven:      ${r.confidence}`,
    ].join('\n');
}

console.log('═══════════════════════════════════════════');
console.log(`  Arama Motoru Testi — ${queries.length} sorgu`);
console.log(`  (komut: ${commands.length}, keyword: ${Object.keys(keywords).length}, görev: ${tasks.length})`);
console.log('═══════════════════════════════════════════\n');

for (const q of queries) {
    console.log(fmt(q));
    console.log('');
}
