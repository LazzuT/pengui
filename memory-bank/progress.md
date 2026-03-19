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
- [x] **Build & Validation:** Uygulama tekrar derlendi. (344 page, 0 errors, 0 warnings).
- [x] **Faz 8.4 (UI/UX Review):** Warning InfoBox eklendi, mobil tablolar fixlendi, empty-state gösterimleri iyileştirildi.
- [x] **Faz 8.5 (Search UI Overlap Fix):** Arama menüsünde yaşanan stacking context ve saydamlık sorunları Z-index ve statik `bg-[#1e293b]` hardcode atamaları ile tamamen çözüldü. (Passed)
- [x] **Faz 8.6 (Release Readiness Audit & Polish):** Mobil viewport arama sonuçlarında (flex gap) düzenlemeleri yapıldı, kalan redundant "Not:" stringleri modern warning modeline taşındı. Proje %100 "Release-Ready" testinden tam skor aldı.

### Faz 9 (Açık Kaynak Yönetişimi & Canlı Yayın)
- [x] **Vercel Deployment:** Github repository'si bağlandı ve `pengui.org` domaini başarıyla aktif edilerek site canlı yayına alındı. Projenin %100 SSG altyapısı production ortamında aktif olarak çalışıyor.
- [x] **Open Source Governance:** Proje "Kontrollü Açık Kaynak" modeline geçirildi. `CONTRIBUTING.md`, Codeowners, Issue/PR şablonları ve GitHub Actions CI validasyon akışları başarıyla kurularak topluluk katkısına güvenilir bir şekilde hazırlandı.

### Faz 10 (Görev'den Komuta Özelliği - Task-to-Command)
- [x] **Data Katmanı & Bileşen:** `data/tasks.json` ve `types/task.ts` oluşturularak ana görev eşleşme motoru kuruldu.
- [x] **IA Unification:** Başlangıçta açılan `/gorevler` rotası ve menü linki, kullanıcı deneyimini tek ekranda toplamak adına (IA analizleri doğrultusunda) ana sayfadaki `CommandAssistant` arama çubuğuna entegre edildi.
- [x] **Öneri Mantığı:** Arama kutusu güçlü bir görev eşleşmesi yakaladığında açıklayıcı `TaskCard` gösterilirken, zayıf/boş durumlarda varsayılan `Popular Task Chips` veya `Fallback` komut önermeleri akıcı şekilde çalışıyor.

### Faz 11 (Local-First Favoriler Özelliği)
- [x] **LocalStorage Mimarisi:** Backend, auth veya DB kullanmadan, kullanıcının doğrudan tarayıcısında saklanan `pengui_favorites` state hook modeli (`useFavorites`) oluşturuldu. Dual-state koruması ve `Array.from(new Set())` kısıtları ile çökme/çift-kayıt sorunları izole edildi.
- [x] **Komut Sayfası Arayüzü:** `FavoriteButton` kodlanarak `app/komut/[slug]/page.tsx` başlıklarına dinamik Toast mesajları ve amber renk değişimleriyle entegre edildi.
- [x] **Favorilerim Ekranı:** Header'a dinamik kayıt rozetli "Favorilerim" bağlantısı eklendi. `/favoriler` sayfası statik + client filtreleme mimarisiyle, boş ve dolu (CommandCard tabanlı) gösterimlere hazır hale getirildi. Özellik UX olarak cilalandı.

### Faz 15 (Final Hardening & Quality Control Sweep)
- [x] **Güvenlik & Middleware:** `middleware.ts` yetkisiz erişim yönlendirmesi `MAINTENANCE_MODE` env varyasyonuna bağlanarak üretim kilitlenme riskinden kurtarıldı.
- [x] **Veri Onarımı:** `tasks.json`'da yanlış atanmış 16 komut ID slug'ı validator eşliğinde gerçek terminal komut slug'larıyla (örn `ss`, `kill`, `grep`) değiştirildi ve `validateTasks.ts` scripti yazıldı.
- [x] **XSS (Injection) Koruması:** `app/komut/[slug]/page.tsx` içindeki InfoWarning component'inde kullanılan riskli `dangerouslySetInnerHTML` React mapping ile güvenli hale getirildi.
- [x] **UI Polish:** Footer text'i Türk Linux topluluğuna adandı, `/hakkinda` eylemi için `lazzut@proton.me` tıklanabilir mail linkine (*mailto*) geçirildi. `/gorevler` orphaned rotası silindi.
- [x] **Configuration:** Local development port'u `3001` olarak değiştirildi.
- [x] **QA & Tests:** Tüm sistem 0 Hata ve 0 Uyarı ile build oldu (`344 sayfa`), Browser automation ile Tasks ve Favorites arayüzlerindeki mobile responsiveness onaylandı. 

## Kalan İşler (Remaining Tasks)
- [ ] Opsiyonel yeni araç modülleri (Ör: Regex deneme asistanı, CRON oluşturucu asistanı vb) üzerinde mutabakata varılması ve geliştirilmesi.
- [ ] Arama zekasının (A/B testing ve query analytics) zamanla iyileştirilmesi.
