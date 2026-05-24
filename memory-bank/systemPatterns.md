# Sistem Desenleri — Pengui

## Mimari Genel Bakış

```
┌─────────────────────────────────────────────────────┐
│              Next.js 16.1.6 App Router              │
│             (App Router + 100% SSG)                 │
├─────────────────────────────────────────────────────┤
│  Sayfalar (Routes — ~394 Statik Sayfa)              │
│  ├── / (Ana Sayfa, CommandAssistant, TaskChips)     │
│  ├── /komut/[slug] (350 Komut Detay, JSON-LD)       │
│  ├── /kategori (Hub) + /kategori/[slug] (12 Liste)  │
│  ├── /distro (Hub) + /distro/[slug] (4 Dağıtım)    │
│  ├── /ogren (Hub) + /ogren/[slug] (6 Modül)         │
│  ├── /linux (Hub) + /linux/[slug] (9 Rehber)         │
│  ├── /favoriler (Local-First Bookmark Hub)           │
│  ├── /hakkinda (Build in Public hikayesi)            │
│  ├── /maintenance + /preview (Bakım/Önizleme)       │
│  ├── /sitemap.xml & /robots.txt (Dinamik TS)         │
│  └── /not-found.tsx (Kayıp Penguen 404)              │
├─────────────────────────────────────────────────────┤
│  Bileşenler (11 adet)                               │
│  ├── CommandAssistant (Token scoring + keyword pre)  │
│  ├── SearchBar (Debounce + ArrowKey + Fuzzy)         │
│  ├── Header (Pengui logo + mobil menü + fav badge)   │
│  ├── TaskCard, FavoriteButton, CopyButton            │
│  ├── CommandCard, CategoryBadge, DangerWarning       │
│  └── Footer, LayoutWrapper                           │
├─────────────────────────────────────────────────────┤
│  Veri Katmanı                                        │
│  ├── data/commands.json (350 komut, 387 KB)          │
│  ├── data/commandKeywords.json (537 keyword/alias)   │
│  ├── data/tasks.json (22 görev tanımı)               │
│  ├── data/linuxContent.json (9 rehber makalesi)      │
│  ├── lib/commands.ts & learning.ts & linux.ts        │
│  └── hooks/useFavorites.ts (localStorage hook)       │
├─────────────────────────────────────────────────────┤
│  Kalite & Pipeline (17 script)                       │
│  ├── validateCommands.ts (Şema CI check)             │
│  ├── validateSearchMappings.ts (Golden test set)     │
│  ├── generate/validate/merge NewCommandsBatch.ts     │
│  ├── polishBatch.ts & polishBatch001InPlace.ts       │
│  └── brandCheck.ts (Rebrand kalıntı kontrolü)        │
└─────────────────────────────────────────────────────┘
```

## Temel Teknik Kararlar & Desenler

- **Tam SSG Mimarisi**: Tüm sayfalar build esnasında (`generateStaticParams`) HTML'e dönüşür. Runtime SSR yoktur. Kullanıcı siteye girdiğinde arama verileri JS bundle ile yüklenir ve sıfır gecikmeyle aranır.

- **Dinamik Metadata Yaratımı**: Next.js App Router'in SEO API'leri kullanılır. `title.template: "... | Pengui"` + dinamik OpenGraph + JSON-LD ile Discord/Twitter Rich Preview ve Google arama sonuçları optimize edilmiştir.

- **Token-Based Search Engine**: CommandAssistant bileşeni çok katmanlı arama yapar:
  1. **Keyword pre-check**: Sorgu tam bir keyword ise anında sonuç döner (short circuit)
  2. **Task scoring**: Türkçe stop-word filtreleme + token bazlı puanlama (MIN_TASK_SCORE=15 eşiği)
  3. **Fuzzy fallback**: commandKeywords.json'dan keyword/alias eşleştirmesi

- **Veri Sınıflandırması**: Dağıtım bazlı paket yöneticileri "distro" scope, evrensel komutlar "core" scope ile ayrılır. 12 kategori ve 3 zorluk seviyesi (kolay/orta/zor) mevcut.

- **Local-First Favoriler**: `useFavorites` hook'u localStorage üzerinden `pengui_favorites` anahtarıyla çalışır. Backend/auth gerektirmez. Dual-state koruma ve `Array.from(new Set())` ile çift kayıt önlenir.

- **Yeni Komut Pipeline'ı**: Toplu komut ekleme scriptlerle yönetilir:
  1. `generateNewCommandsBatch.ts` → config + raw file'dan batch JSON üretir
  2. `polishBatch.ts` → casing, uyarı, options düzeltmeleri
  3. `validateNewCommandsBatch.ts` → duplicate, schema, collision kontrolü
  4. `mergeNewCommandsBatch.ts` → backup alıp commands.json'a merge eder
  5. `polishBatch001InPlace.ts` → merge sonrası detail_tr yeniden yazma

- **Bakım Modu**: `middleware.ts` içinde `MAINTENANCE_MODE=true` env ile kontrol edilir. Aktifken tüm trafik `/maintenance`'a yönlenir, `/preview` şifreli erişim sağlar.
