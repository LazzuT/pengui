# Teknik Bağlam — Pengui

## Teknoloji Yığını

| Katman | Teknoloji | Versiyon | Detay |
|--------|-----------|----------|--------|
| Framework | Next.js (App Router) | 16.1.6 | Route/Layout bazlı %100 SSG |
| Dil | TypeScript | 5.x | Strict Mode |
| UI | React | 19.2.3 | Server + Client Components |
| Stil | TailwindCSS | v4 | Glassmorphism, dark mode |
| Veri Kaynağı | JSON Mimarisi | — | `commands.json` (350 Komut), `commandKeywords.json` (539 keyword), `tasks.json` (22 görev) |
| Kalite Denetimi | Custom TS Scripts | — | Validate/generate/merge/polish script'leri (legacy JS'ler `scripts/_legacy/`'de). `validateSearchMappings.ts` 23 sorguluk golden test seti içerir (hem keyword fallback hem `lib/search` tam motoru simüle edilir). |
| Paket Yöneticisi | npm | — | NVM node=v24.14.0 |
| Hosting | Vercel | — | SSG deploy, `pengui.org` domain |

## Geliştirme Ortamı

```bash
# Proje dizini
/home/ali/Projects/Works/linuxcommandweb

# Geliştirme sunucusu
npm run dev          # http://localhost:3001

# Kalite (QA) ve Derleme Süreci
npx tsx scripts/validateCommands.ts       # commands.json şema testi
npx tsx scripts/validateTasks.ts          # tasks.json slug doğrulama
npx tsx scripts/validateSearchMappings.ts # Golden test set (23 sorgu)
npx tsx scripts/validateNewCommandsBatch.ts # Batch duplicate/schema
npx tsx scripts/brandCheck.ts             # Rebrand kalıntı testi
npm run build                             # ~394 Sayfalık SSG Üretimi
npm run start                             # Next.js Prod Server

# Yeni komut ekleme pipeline
npm run generate:new-commands  # Batch JSON üret
npm run validate:new-commands  # Batch doğrula
npm run merge:new-commands     # commands.json'a merge et (backup'lı)
```

## Mimari Klasör Yapısı

```
linuxcommandweb/
├── app/
│   ├── layout.tsx              # Kök metadataBase(pengui.org), Inter font
│   ├── globals.css             # Tailwind v4 injects
│   ├── page.tsx                # Ana sayfa + CommandAssistant
│   ├── sitemap.ts & robots.ts  # SEO Dinamik Üretim
│   ├── not-found.tsx           # Terminalde Kaybolan Maskot Penguen 404
│   ├── komut/[slug]            # 350 Komut Sayfası (JSON-LD ile)
│   ├── kategori/[slug]         # 12 Kategori Hub + Liste
│   ├── distro/[slug]           # 4 Dağıtım Sayfası
│   ├── ogren/[slug]            # 6 Adımlı Eğitim Rotası
│   ├── linux/[slug]            # 9 Linux Rehber Makalesi
│   ├── favoriler/              # Local Storage Favoriler Paneli
│   ├── hakkinda/               # Build in Public hikayesi
│   ├── maintenance/            # Bakım modu sayfası
│   └── preview/                # Şifreli önizleme erişimi
├── components/ (11 bileşen)
│   ├── CommandAssistant.tsx     # Token-based scoring + keyword pre-check
│   ├── SearchBar.tsx           # Debounce & ArrowKey arama
│   ├── Header.tsx              # Navigasyon + mobil menü + favori badge
│   ├── TaskCard.tsx            # Görev kartı render
│   ├── FavoriteButton.tsx      # Toggle + toast notification
│   ├── Footer.tsx, CommandCard.tsx, CopyButton.tsx,
│   │   CategoryBadge.tsx, DangerWarning.tsx, LayoutWrapper.tsx
├── data/
│   ├── commands.json           # 350 komut (387 KB)
│   ├── commandKeywords.json    # 539 keyword/alias eşleştirmesi
│   ├── tasks.json              # 22 görev tanımı (Faz 18 ile +6)
│   ├── linuxContent.json       # 9 rehber makalesi
│   ├── backups/                # Merge öncesi timestamp'li backup
│   ├── review/                 # Batch JSON dosyaları (onay için)
│   └── raw/                    # whatis çıktısı (komut adayları)
├── scripts/
│   ├── validateCommands.ts     # Şema CI check
│   ├── validateTasks.ts        # Task slug + alternatives + category doğrulama
│   ├── validateSearchMappings.ts # Golden test set (keyword fallback + tam motor)
│   ├── validateNewCommandsBatch.ts # Batch doğrulama
│   ├── generateNewCommandsBatch.ts # Batch üretici
│   ├── mergeNewCommandsBatch.ts    # Batch merge (backup'lı)
│   ├── polishBatch.ts          # Batch kalite düzeltmeleri
│   ├── polishBatch001InPlace.ts # detail_tr yeniden yazma
│   ├── brandCheck.ts           # Eski marka kalıntı kontrolü (artık exit 1)
│   ├── searchPlayground.ts     # Arama motoru manuel test aracı (CLI)
│   └── _legacy/                # Artık kullanılmayan 6 eski JS aracı (arşiv)
├── hooks/
│   └── useFavorites.ts         # localStorage hook (dual-state koruma)
├── lib/
│   ├── commands.ts             # getAllCommandSlugs(), getCommandBySlug(), searchCommands() (lib/search'i kullanır)
│   ├── search.ts               # Ortak arama motoru (CommandAssistant + SearchBar + searchCommands)
│   ├── learning.ts             # getAllLearningModules(), getLearningModuleBySlug()
│   └── linux.ts                # Linux rehber veri okuyucu
├── types/
│   ├── command.ts              # Command, Category, Distro interfaces
│   ├── task.ts                 # Task interface
│   └── linux.ts                # LinuxContent interface
├── middleware.ts               # MAINTENANCE_MODE env kontrolü
├── .github/                    # CI/CD workflows, issue/PR şablonları, CODEOWNERS
└── memory-bank/                # AI & Proje Bağlam Kütüphanesi
```

## Teknik Kısıtlamalar (Felsefe)
- **Saf İstemci Optimizasyonu**: Arama mekanizması `useMemo` hook ile client-side çalışır. commands.json tüm verisi JS bundle'a dahildir (387 KB). 500+ komuta ulaşılırsa code splitting düşünülmeli.
- **Statik Üretim (SSG)**: Tüm route'lar `generateStaticParams` ile build-time HTML'e dönüşür. Runtime SSR yoktur.

## Bağımlılıklar (Dev & Prod)
- `next` (16.1.6) — SSG framework
- `react` + `react-dom` (19.2.3) — UI
- `@tailwindcss/postcss` & `tailwindcss` (v4) — CSS derleyici
- `typescript` (5.x) — Tip denetimi
- `tsx` (dev) — Script çalıştırıcı
- `eslint` + `eslint-config-next` — Lint
- `@next/bundle-analyzer` — Bundle analizi
- `cross-env` — Çapraz platform env değişkenleri
