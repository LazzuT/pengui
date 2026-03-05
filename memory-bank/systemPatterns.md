# Sistem Desenleri — Pengui

## Mimari Genel Bakış

```
┌─────────────────────────────────────────────────┐
│                   Next.js 15 App                │
│             (App Router + 100% SSG)             │
├─────────────────────────────────────────────────┤
│  Sayfalar (Routes — Statik 133 Sayfa)           │
│  ├── / (Ana Sayfa, Asistan, Terminal Öğren)     │
│  ├── /komut/[slug] (Tasarım Detay SEO JSON-LD)  │
│  ├── /kategori/[slug] (Kategori Listesi)        │
│  ├── /distro (Dağıtımlar Ana Listesi)           │
│  ├── /distro/[slug] (Dağıtıma Özel Komutlar)    │
│  ├── /ogren/[slug] (Öğrenim Müfredatı Modülleri)│
│  ├── /hakkinda (Build in public hikayesi)       │
│  ├── /sitemap.xml & /robots.txt (Dinamik TS)    │
│  └── /not-found.tsx (Özel Kayıp Penguen 404)    │
├─────────────────────────────────────────────────┤
│  Bileşenler                                     │
│  ├── Header (Logo: 🐧 Pengui + Mobil menu)       │
│  ├── SearchBar (Asistan, Klavye ve Debounce API)│
│  ├── CommandCard (kategori + zorluk badge)      │
│  ├── Return & Nav linkleri                      │
│  ├── ...                                        │
├─────────────────────────────────────────────────┤
│  Veri Katmanı                                   │
│  ├── data/commands.json (105 dev komut dataseti)│
│  ├── data/commandKeywords.json (Optimize fuzzy) │
│  ├── lib/commands.ts & learning.ts (Getter'lar) │
│  ├── scripts/validateCommands.ts (Şema CI check)│
│  └── scripts/brandCheck.ts (Regex QA checker)   │
└─────────────────────────────────────────────────┘
```

## Temel Teknik Kararlar & Desenler
- **Tam SSG Mimarisi**: Sitenin tamamı build esnasında (`generateStaticParams`) HTML haline kodlanmaktadır. Sitede Runtime server fetch (SSR) yoktur. Kullanıcı siteye girdiğinde arama motoru verileri de JS bundle ile indirilerek sıfır gecikme (0 ms latency) aranır.
- **Dinamik Metadata Yaratımı**: Next.js App Router'in dinamik SEO API'leri kullanıldı. Layout'a konulan kalıbın üzerine (`title.template: "... | Pengui"`) dinamik OpenGraph eklenerek SEO ve Discord Rich Preview mükemmel hale getirildi.
- **Fuzzy Search & Asistan**: Kullanıcı terminale hakim değilse doğal dille arıyormuşçasına "dosya ara" yazar, `commandKeywords` lugatında bunun `find` ve `grep` anlamına geldiği bulunur. Eşleşme arayüzde ("Terminal Yeşili" highlight ile) öne çıkar.
- **Veri Sınıflandırması**: Dağıtım bazlı paket yöneticileri (Örn: `apt`) "distro" scope ile sınırlandırılır, böylece global "core" komutları (Örn: `ls`) ile çakışmazlar. Ek olarak "ilk komutlar" gibi modül rotasyonları Learning (Öğren) şemasında ele alınır.
