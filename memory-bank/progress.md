# Progress Tracker

## Tamamlanan Özellikler (Completed Features)

### Faz 1-5 (Altyapı, İçerik, SEO & Rebranding)
- Next.js 15 App Router, TailwindCSS v4 ve SSG mimarisi başarıyla kuruldu.
- Command Assistant (Akıllı arama tespiti) ve tam SEO altyapısı oturtuldu.
- Pengui rebranding, tasarımlar (3D Tux favicon), 404 sayfası ve `/ogren` müfredat rotası eklendi.
- Global Maintenance Mode, `/preview` protected URL'leri (Middleware ve Cookie mekanizmaları) eklendi.

### Faz 6 (Core Linux Content System)
- SSG Mimari Genişlemesi: Pengui "Eğitim Platformuna" çevrilerek yeni `/linux` (Linux Rehberi) rotası eklendi.
- Toplam 9 farklı konuda MD uyumlu teorik veri içeren `data/linuxContent.json` oluşturuldu.

### Faz 7 (Command Database Expansion)
- `data/commands.json` dosyasındaki Linux komutlarının sayısı 105'ten tam olarak 300'e çıkarıldı.
- Arama asistanı desteği için her yeni komuta özel keywordler üretildi (410+ keyword / alias).

### Faz 8 (QA Sweep + Final Release Readiness - Round 1, 2, 3, 4)
- [x] **Veri Bütünlüğü (Data Integrity):** compile_compact offset kaynaklı veri bozulmaları (related ve scope alanları) onarıldı. `cron` ve `7za` komutlarındaki 46 adet flag/desc ters dönme hatası düzeltildi.
- [x] **İçerik Kalitesi:** 30 komutun çok kısa olan açıklamaları güçlendirildi. `sponge` sözdizimi onarıldı.
- [x] **Kategori & Routing İyileştirmesi:** Tanımsız `sistem-yonetimi` vb. eklendi, genel `/kategori` hub sayfası yapıldı.
- [x] **SEO & Güvenlik:** `robots.ts` ile index korumaları eklendi, kırık OG resimleri onarıldı, JSON-LD dolduruldu.
- [x] **Güvenilirlik Revizyonu:** Önceden kurulu gelmeyen komutlara uyarılar eklendi (htop, telnet vs).
- [x] **Build & Validation:** Uygulama tekrar derlendi. (344 page, 0 errors, 0 warnings). Frontend UI kırılmaları test edilip tamir edildi.

### Faz 9 (Sürüm 1.0 Canlı Yayın - Production Launch)
- [x] **Vercel Deployment:** Github repository'si bağlandı ve `pengui.org` domaini başarıyla aktif edilerek site canlı yayına alındı. Projenin %100 SSG altyapısı production ortamında aktif olarak çalışıyor.

## Kalan İşler (Remaining Tasks)
- [ ] Roadmap dahilinde Linux Quiz sistemi, İnteraktif Terminal vb. modül tasarımlarına başlanması.
