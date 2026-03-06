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

## Temel Özellikler (Faz 4.7 İtibarıyla Tamamlanmıştır)
1. **Linux Komut Kütüphanesi & Asistan** — En popüler, geniş çaplı 300 komut (Dosya, Ağ, Paket, vb.)
2. **Akıllı Fuzzy Komut Arama** — Klavye navigasyonlu, debounce destekli ve asistan tabanlı (Örn: "ip adresi" -> `ifconfig`, "dizine git" -> `cd`)
3. **Komut Detay Sayfaları** — Etkileşimli terminal kod blokları, argüman tabloları, gerçek hayat senaryoları ve SEO (Structured Data JSON-LD TechArticle)
4. **Dağıtım (Distro) Spesifik Yapı** — Ubuntu, Debian, Arch ve Fedora paket yöneticileri (apt, pacman, dnf) özel mimariyle ayrıştırıldı.
5. **Öğrenim Rotası (`/ogren`)** — "İlk komutlar", "Dosya hiyerarşisi" şeklinde müfredata adım adım dahil olma modülleri.
6. **Hakkında / "Build in Public"** — UI tasarımlarını yapan asistanların dahil olduğu, AI ile tamamen açık geliştirme hikâyesi.

## Kapsam Dışı (v1.0 Launch Pakedi)
- Backend / veritabanı (Mükemmel hız için %100 SSG hedeflendi)
- Kullanıcı hesabı ve kimlik doğrulama
- İngilizce içerik
- Yorum / topluluk etkileşimi modülleri

## Başarı Kriterleri (Gerçekleşenler)
- **300 komut** eksiksiz ve syntax, metadata testinden geçerek eklendi.
- Komut arama `<10 ms` reaksiyon süresinde (istemci taraflı).
- Harika karanlık mod / glassmorphism tabanlı **Mobil duyarlı** site.
- **344 Route** 0 warning ve mükemmel Next.js build (`< 1s` optimizasyon süresi) çıktı.
- Tamamen **`pengui.org`** alan adına özel SEO (sitemap.xml, robots, canonical ve og:image) altyapısı hazırlandı.

## Marka
**Pengui** (`pengui.org`)
