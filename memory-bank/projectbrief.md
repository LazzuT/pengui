# Proje Özeti — Pengui

## Proje Adı
**Pengui** — Türkçe Linux Komut Kütüphanesi & Öğrenim Platformu (Eski adıyla: komut.dev)

## Vizyon
Türkiye'de Linux öğrenmek isteyen yeni başlayanlara yardımcı olacak, sevimli (maskot Tux), hızlı, çok geniş çaplı, asistan destekli ve anlaşılır bir Türkçe komut referans platformu oluşturmak.

## Hedef Kitle
- Linux'a yeni başlayan kişiler
- Üniversite öğrencileri (bilgisayar mühendisliği, yazılım vb.)
- Terminal kullanmaya aşina olmak ve korkusunu yenmek isteyenler
- Özel dağıtımların (Arch, Ubuntu vb.) paket yapılarına adaptasyon sağlamaya çalışanlar
- Sertifikasyon sınavlarına (LPIC, CompTIA Linux+) hazırlananlar

## Temel Özellikler (v1.0 + Batch-001)
1. **Linux Komut Kütüphanesi & Asistan** — 350 komut (300 orijinal + 50 Batch-001): dosya, ağ, paket, sistem, disk, çekirdek modülleri, güvenlik duvarı vb.
2. **Görevden Komuta (Task-to-Command)** — "Açık portları listele" gibi Türkçe doğal görev cümleleriyle asistan üzerinden komut eşleştirmesi. Token-based scoring engine.
3. **Local-First Favoriler** — Kullanıcıların giriş yapmadan, doğrudan tarayıcı localStorage ile komutları cihaza kaydetmesi.
4. **Komut Detay Sayfaları** — Etkileşimli kod blokları, argüman tabloları, tehlike uyarıları, gerçek hayat örnekleri ve SEO JSON-LD.
5. **Dağıtım (Distro) Spesifik Yapı** — Ubuntu, Debian, Arch ve Fedora paket yöneticileri (apt, pacman, dnf) ayrıştırıldı.
6. **Öğrenim Rotası (`/ogren`)** — 6 modüllü müfredat: "İlk komutlar", "Dosya hiyerarşisi" vb.
7. **Linux Rehberi (`/linux`)** — 9 konuda teorik içerik: "Kernel nedir", "Terminal nedir" vb.
8. **Hakkında / "Build in Public"** — AI destekli geliştirme hikâyesi ve süreç şeffaflığı.
9. **Yeni Komut Pipeline'ı** — Script-driven batch komut ekleme: generate → polish → validate → merge.

## Kapsam Dışı (v1.0)
- Backend / veritabanı (Mükemmel hız için %100 SSG)
- Kullanıcı hesabı ve kimlik doğrulama
- İngilizce içerik
- Yorum / topluluk etkileşimi modülleri

## Başarı Kriterleri (Gerçekleşenler)
- **350 komut** syntax, metadata ve şema testinden geçerek eklendi.
- Komut arama `<10 ms` reaksiyon süresinde (istemci taraflı, token-based scoring).
- Glassmorphism tabanlı karanlık mod, **mobil duyarlı** tasarım.
- **~396 Route** 0 hata ile Next.js 16.1.6 build ve SSG üretimi (manifest dahil).
- Tamamen **`pengui.org`** alan adına özel SEO altyapısı (sitemap.xml, robots, canonical, og:image, JSON-LD).
- Açık kaynak yönetişimi: CONTRIBUTING.md, CODEOWNERS, Issue/PR şablonları, CI workflows.

## Marka
**Pengui** (`pengui.org`)
