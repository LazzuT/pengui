# Teknik Bağlam — Pengui

## Teknoloji Yığını

| Katman | Teknoloji | Versiyon | Detay |
|--------|-----------|----------|--------|
| Framework | Next.js (App Router) | 15.1+ | Route/Layout bazlı yapılar |
| Dil | TypeScript | 5.x | Data validation'lı Strict Mode |
| Stil | TailwindCSS | v4 | Modern glassmorphism plugin'leri |
| Veri Kaynağı | Uzman JSON Mimarisi | — | `commands.json` (105 Komut) |
| Kalite Denetimi | Custom TS Scripts | — | `validateCommands`, `brandCheck` |
| Paket Yöneticisi | npm | — | NVM node=v20+ ile |

## Geliştirme Ortamı

```bash
# Proje dizini
/home/ali/Projects/Works/linuxcommandweb

# Geliştirme sunucusu
npm run dev          # http://localhost:3000

# Kalite (QA) ve Derleme Süreci
# CI/CD ortamlarında hatasız geçmesi beklenir
npx tsx scripts/validateCommands.ts # JSON test
npx tsx scripts/brandCheck.ts       # Rebrand kalıntı testi
npm run build                       # 133 Sayfalık SSG Üretimi
npm run start                       # Next.js Prod Server
```

## Mimari Klasör Yapısı (Build: 133 Sayfa)

```
linuxcommandweb/
├── app/
│   ├── layout.tsx              # Kök metadataBase(pengui.org), Inter font
│   ├── globals.css             # Tailwind v4 injects
│   ├── page.tsx                # Asistan giriş ekranı
│   ├── sitemap.ts & robots.ts  # SEO Dinamik Üretim
│   ├── not-found.tsx           # Terminalde Kaybolan Maskot Penguen
│   ├── komut/[slug]            # 105 Komut Sayfası (JSON-LD ile)
│   ├── kategori/[slug]         # Kategori Ağaçları
│   ├── distro/[slug]           # Paket Yöneticisi Rotaları
│   ├── ogren/[slug]            # 6 Adımlı Eğitim rotası
│   └── hakkinda/               # Proje vizyonu
├── components/
│   ├── Header.tsx (Pengui Mühürlü Logolar) & Footer.tsx
│   ├── SearchBar.tsx (Debounce & ArrowKey Handler)
│   ├── CommandCard, CommandDetail, vb.
├── data/
│   ├── commands.json           # ~81KB saf komut metinleri
│   ├── commandKeywords.json    # Fuzzy Match algoritmaları lugatı
├── lib/
│   ├── commands.ts             # `getAllCommandSlugs()` vs okuyucu betikler
│   └── learning.ts             # Müfredat rotaları `getNextModule()` okuyucusu
├── scripts/                    # QA ve Kalite Araçları (TSX tabanlı)
├── types/                      # Interfaces (Command, Distro vb)
└── memory-bank/                # AI & Proje Bağlam Kütüphanesi
```

## Teknik Kısıtlamalar (Felsefe)
- **Saf İstemci Optimizasyonu**: JSON verisinde fetch gecikmesini ortadan kaldırmak için, arama mekanizması ve `fuse.js` benzeri davranış `useMemo` React hook'u aracılığıyla sunucu bağımsız derlenir. Veri 1 MB'yi aşmadığı sürece muazzam ve en ucuz arama motoru sağlar.
- **Statik Üretim (SSG)**: `/distro` gibi route'lar `generateStaticParams` metoduna sahiptir. Sayfaların 1. saniyede gelmesinin sebebi budur.

## Bağımlılıklar (Dev & Prod)
- `next` — SSG
- `@tailwindcss/postcss` & `tailwindcss` — CSS derleyici
- `typescript` — Ortam Tipi Denetimi
- `tsx` — (Dev) Scripts'leri NodeJS bağımsız tek tıkla çalıştırmaya yarayan modül.
