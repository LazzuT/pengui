# Progress Tracker

## Tamamlanan Özellikler (Completed Features)

### Faz 1-5 (Altyapı, İçerik, SEO & Rebranding)
- Next.js App Router, TailwindCSS v4 ve SSG mimarisi başarıyla kuruldu.
- Command Assistant (Akıllı arama tespiti) ve tam SEO altyapısı oturtuldu.
- Pengui rebranding, tasarımlar (3D Tux favicon), 404 sayfası ve `/ogren` müfredat rotası eklendi.
- Global Maintenance Mode, `/preview` protected URL'leri (Middleware ve Cookie mekanizmaları) eklendi.

### Faz 6 (Core Linux Content System)
- SSG Mimari Genişlemesi: Pengui "Eğitim Platformuna" çevrilerek yeni `/linux` (Linux Rehberi) rotası eklendi.
- Toplam 9 farklı konuda MD uyumlu teorik veri içeren `data/linuxContent.json` oluşturuldu.

### Faz 7 (Command Database Expansion)
- `data/commands.json` dosyasındaki Linux komutlarının sayısı 105'ten 300'e çıkarıldı.
- Arama asistanı desteği için her yeni komuta özel keywordler üretildi (410+ keyword/alias).

### Faz 8 (QA Sweep + Final Release Readiness - Round 1-6)
- [x] **Veri Bütünlüğü:** compile_compact offset kaynaklı veri bozulmaları onarıldı. `cron` ve `7za` flag hatası düzeltildi.
- [x] **İçerik Kalitesi:** 30 komutun açıklamaları güçlendirildi. `sponge` sözdizimi onarıldı.
- [x] **Kategori & Routing:** `sistem-yonetimi` vb. eklendi, genel `/kategori` hub sayfası yapıldı.
- [x] **SEO & Güvenlik:** `robots.ts`, kırık OG resimleri onarıldı, JSON-LD dolduruldu.
- [x] **Güvenilirlik:** Önceden kurulu gelmeyen komutlara uyarılar eklendi.
- [x] **Build & Validation:** 344 page, 0 errors, 0 warnings.
- [x] **UI/UX Review:** Warning InfoBox, mobil tablolar, empty-state gösterimleri.
- [x] **Search UI Overlap Fix:** Z-index ve bg hardcode çözümleri.
- [x] **Release Readiness:** Mobil viewport, redundant string temizliği.

### Faz 9 (Açık Kaynak Yönetişimi & Canlı Yayın)
- [x] **Vercel Deployment:** `pengui.org` domaini aktif. %100 SSG production'da çalışıyor.
- [x] **Open Source Governance:** CONTRIBUTING.md, CODEOWNERS, Issue/PR şablonları, GitHub Actions CI.

### Faz 10 (Görevden Komuta — Task-to-Command)
- [x] `data/tasks.json` ve `types/task.ts` oluşturuldu. 16 görev tanımı.
- [x] Ana sayfadaki `CommandAssistant`'a entegre edildi. TaskCard + PopularTaskChips.
- [x] `/gorevler` orphaned rotası temizlendi.

### Faz 11 (Local-First Favoriler)
- [x] `useFavorites` hook: localStorage tabanlı, dual-state koruma, Set kısıtları.
- [x] `FavoriteButton`: amber renk, toast mesajları, dinamik toggle.
- [x] `/favoriler` sayfası: Header'da rozet, filtreleme, boş/dolu durumlar.

### Faz 15 (Final Hardening & Quality Control Sweep)
- [x] Middleware kilitlenme riski giderildi (MAINTENANCE_MODE env).
- [x] tasks.json'da 16 yanlış slug düzeltildi + `validateTasks.ts` yazıldı.
- [x] XSS koruması: `dangerouslySetInnerHTML` güvenli hale getirildi.
- [x] UI Polish: Footer, mail linki, port 3001 değişikliği.
- [x] Build: 344 sayfa, 0 hata, 0 uyarı.

### Faz 16 (Search Relevance Hardening)
- [x] **Arama motoru yeniden yazıldı:** Naive `includes()` yerine token-based scoring algoritması.
- [x] **Türkçe stop-word filtreleme** ve confidence threshold (MIN_TASK_SCORE=15) eklendi.
- [x] **Keyword pre-check:** Exact keyword match → short circuit (curated mappings öncelikli).
- [x] **Dataset cleanup:** 15+ aşırı geniş keyword eşleştirmesi temizlendi (ör: `"süreci"→bg`, `"dosya"→less`).
- [x] **Golden Test Set:** `validateSearchMappings.ts` ile 9 sorgu otomatik doğrulama. ✅ 9/9 geçiyor.
- [x] **"İzin değiştir" → `sed` bug'ı** çözüldü (exact keyword mapping ile chmod'a yönlendirme).

### Faz 17 (Batch-001 — 50 Yeni Komut)
- [x] **Kaynak analizi:** `whatis -r '.'` çıktısından (29,745 satır) section (1) ve (8) komutları filtrelendi.
- [x] **Script-driven pipeline oluşturuldu:**
  - `scripts/newCommandsConfig.json` — Küratörlü 50 komut listesi
  - `scripts/generateNewCommandsBatch.ts` — Batch JSON üretici
  - `scripts/polishBatch.ts` — Casing, uyarı, options, related düzeltmeleri (116 fix)
  - `scripts/validateNewCommandsBatch.ts` — Duplicate, schema, collision kontrolü
  - `scripts/mergeNewCommandsBatch.ts` — Backup'lı merge
- [x] **50 yeni komut merge edildi:** commands.json 300 → 350 komut.
- [x] **Kategoriler:** sistem-izleme (6), sistem-yonetimi (15), disk-yonetimi (7), ag (9), kullanici-yonetimi (7), dosya-yonetimi (4), metin-isleme (1).
- [x] **Build başarılı:** ~394 sayfa, 0 hata.
- [x] **Polish uygulandı:** `polishBatch001InPlace.ts` çalıştırıldı; 50 komutun `detail_tr` alanları doğal Türkçeye çevrildi (`scripts/polishDetailData.json` içeriği `commands.json`'a yansımış durumda).

### Faz 18 (Search Hardening 2 + Release Hardening)
- [x] **commandKeywords.json temizliği:** 598 → 537 keyword. Otomatik üretilmiş açıklama parçaları, typo artefaktları (`debianubuntu`, `extext`, `gzipzip`, `lzmaxz`, `periyodikzamanlı`, `klavye onayınıyesy`, `tracerouteın` …) ve aşırı geniş tek-kelime girişleri (`linux→flatpak`, `unix→ar`, `shell→newgrp`, `terminal→screen`, `network→nmap`, `kayıp→reset`, `klasik→tac` vb.) kaldırıldı.
- [x] **50 yeni komut için curated keyword eşleştirmeleri:** lscpu, lspci, lsusb, lsmod, modprobe, modinfo, depmod, rmmod, insmod, sensors, dmidecode, hwclock, sysctl, ldconfig, logrotate, mkswap, swapon, swapoff, fstrim, losetup, blockdev, cryptsetup, nmcli, ethtool, iptables, ufw, nft, tc, iw, resolvectl, networkctl, adduser, deluser, addgroup, delgroup, chpasswd, vipw, newusers, mktemp, fallocate, rename, xdg-open, tput, stty, lsb_release, efibootmgr, b2sum, base32, fwupdmgr, lshw için Türkçe sorgu eşleştirmeleri eklendi.
- [x] **`validateSearchMappings.ts` güçlendirildi:** `FORBIDDEN_SINGLE_WORDS` 12 → 70+ giriş; `ALLOWED_BROAD_SINGLE_WORDS` allow-list eklendi; gözden geçirilmemiş kısa tek-kelime keyword'ler için warning üretiliyor.
- [x] **Golden test set 9 → 22 sorgu:** poisoned-keyword regression (`linux`, `unix`, `shell`, `terminal`, `network`) + yeni-50 coverage (`güvenlik duvarı`, `wifi yönet`, `donanım bilgisi`, `kullanıcı oluştur`, `swap aç`, `ssd trim`, `cpu bilgisi`, `donanım sıcaklığı`, `luks`).
- [x] **tasks.json zenginleştirildi:** 16 → 22 görev (ufw güvenlik duvarı, nmcli wifi, adduser, sensors sıcaklık, lshw donanım envanteri, mkswap swap dosyası).
- [ ] **Pipeline script'leri commit'lenmeli:** `generateNewCommandsBatch.ts`, `mergeNewCommandsBatch.ts`, `polishBatch.ts`, `polishBatch001InPlace.ts`, `polishDetailData.json`, `newCommandsConfig.json`, `validateNewCommandsBatch.ts`, `validateSearchMappings.ts`, `data/review/new-commands-batch-001.json` halen untracked.
- [ ] **Build doğrulama:** Faz 18 sonrası `npm run build` ve `npm run validate` lokal yeşil onayı.

### Faz 19 (Search Convergence + SEO + A11y + Hijyen)
- [x] **Ortak arama motoru `lib/search.ts`:** CommandAssistant + SearchBar + `searchCommands()` tek motoru kullanıyor. SearchBar artık keyword/görev farkındalıklı.
- [x] **Motor iyileştirmeleri:** Disambiguation (`wifi`/`firewall`/`swap`/`kullanıcı`) motora taşındı (`search()` artık `disambiguation` döndürüyor). Tam komut adı önceliği eklendi (`ls`→ls komutu; `grep`→grep görevi korunur).
- [x] **Test aracı:** `scripts/searchPlayground.ts` — motoru CLI'dan sorgu bataryası/tekil sorgu ile test etmek için.
- [x] **Golden test genişletildi:** 23 sorgu için hem keyword-fallback hem tam motor (task-scoring) simüle ediliyor; 23/23 geçer. Kısa-token yanlış pozitifi (`network→df`) düzeltildi; `unix→uname`, `terminal→stty` curated.
- [x] **Validatör + CI sertleştirme:** `validateTasks.ts` alternatives + category denetliyor; `brandCheck.ts` exit 1; CI tam `validate` zinciri + push/workflow_dispatch. `systemd→systemctl`, `iwctl` kaldırıldı; task kategorileri 12'li namespace'e hizalandı.
- [x] **SEO paketi:** Canonical override (kök sızıntısı kapatıldı), `og-image.png` + metadata, `manifest.ts` + viewport, `BreadcrumbList` + `CollectionPage` JSON-LD, `loading.tsx`/`error.tsx`, `linux/[slug]` kod bloğu render + palet.
- [x] **A11y:** CopyButton görünürlük, FavoriteButton dinamik aria-label/aria-pressed, CommandAssistant aria-live, SearchBar combobox/listbox, disambiguation kartı.
- [x] **İçerik/hijyen:** `factor`/`echo`/`tput` yeniden yazıldı; `terminal-nedir`→`terminal-temelleri`; 6 legacy JS `scripts/_legacy/`'ye; `penguizz.zip` silindi; `.env.example` izlenebilir.
- [x] **Doğrulama:** build 396 sayfa 0 hata; validate yeşil (5 önceden var olan örnek uyarısı hariç).
- [ ] **Commit:** Oturum değişiklikleri kullanıcı tarafından commit'lenecek.

## Kalan İşler (Remaining Tasks)

### Acil (Faz 18 Kapanışı)
- [ ] Untracked pipeline ve script dosyalarını commit'le (`scripts/*` ve `data/review/new-commands-batch-001.json`).
- [ ] `npm run validate` ve `npm run build` çıktılarını doğrula.
- [ ] Release smoke test check-listi yaz; bakım modunu (MAINTENANCE_MODE=false) kapatma kararı al.

### Orta Vadeli
- [x] `lib/search.ts` ortak arama motoru çıkarıldı (Faz 19).
- [ ] Bundle boyutu izleme: commands.json ~381 KB; 500+ komutta code splitting düşünülmeli.
- [ ] 5 pre-existing example warning'i düzeltilmeli (groupdel, batch, xzcat, dumpe2fs, tac) — validate'te uyarı olarak görünüyor, bloklamıyor.

### Uzun Vadeli (Roadmap)
- [ ] Opsiyonel araç modülleri: Regex deneme asistanı, CRON oluşturucu asistanı vb.
- [ ] Arama zekası iyileştirmesi: A/B testing ve query analytics.
- [ ] İnteraktif Terminal simülasyonu.
- [ ] Quiz/sertifika sistemi.
- [ ] Next.js 16+ `middleware → proxy` migrasyonu (deprecation warning'ı bekleniyor).
