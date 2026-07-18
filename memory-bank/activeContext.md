# Active Context

## Mevcut Durum (Current State)
- Proje **Faz 19+ (Search Convergence + SEO + A11y + Hijyen) tamamlandı** durumunda (detaylar aşağıdaki "Faz 19+ Oturumu" bölümünde). Bir önceki kilometre taşı Faz 18'di; Faz 17 (Batch-001) merge'i ve detail_tr polish'i `commands.json`'a yansımış durumda — `data/commands.json` 350 komut, polish edilmiş `detail_tr` alanları `scripts/polishDetailData.json` ile birebir eşleşiyor.
- **Son doğrulama:** `npm run build` → 396 sayfa, 0 hata · `npm run validate` → yeşil (golden 23/23; yalnızca 5 önceden var olan örnek uyarısı).
- **Bakım modu açık:** `pengui.org` bilinçli olarak `MAINTENANCE_MODE=true` ile bakımda. Faz 18 tamamlanana ve smoke test geçene kadar kapatılmayacak. `middleware.ts` ve `app/preview/actions.ts` değişmedi.
- **Search hardening 2 (yeni):**
  - `data/commandKeywords.json` 598 → 537 (Faz 18 temizliği) → **539** (Faz 19'da curated `unix`/`terminal` eklendi).
  - 50 yeni komut için curated Türkçe keyword eşleştirmeleri eklendi (ör: "güvenlik duvarı"→ufw, "wifi yönet"→nmcli, "donanım bilgisi"→lshw, "swap aç"→swapon, "ssd trim"→fstrim, "cpu bilgisi"→lscpu, "luks"→cryptsetup).
  - `scripts/validateSearchMappings.ts` `FORBIDDEN_SINGLE_WORDS` listesi 12 → **70+** girişe çıktı; ek olarak `ALLOWED_BROAD_SINGLE_WORDS` allow-list ile yeni eklenecek tek-kelime anahtarlar warning olarak işaretleniyor.
  - Golden test set 9 → **22 sorgu**: poisoned-keyword regression testleri (`linux`, `unix`, `shell`, `terminal`, `network`) + yeni 50-komut coverage testleri (`güvenlik duvarı`, `wifi yönet`, `donanım sıcaklığı` …).
  - `data/tasks.json` 16 → **22 görev**: ufw, nmcli, adduser, sensors, lshw, mkswap için yeni Türkçe görev tanımları.
- **Repo durumu:** Yeni komut pipeline script'leri (`generateNewCommandsBatch.ts`, `mergeNewCommandsBatch.ts`, `polishBatch.ts`, `polishBatch001InPlace.ts`, `polishDetailData.json`, `newCommandsConfig.json`, `validateNewCommandsBatch.ts`, `validateSearchMappings.ts`) ve `data/review/new-commands-batch-001.json` lokalde mevcut ama henüz git'e commit'lenmemiş (untracked). CI workflow'u (`.github/workflows/validate.yml`) sadece `validateCommands.ts` + `npm run build` çalıştırdığı için CI yeşil; ancak `npm run validate` lokal zinciri tüm script'lerin commit edilmesini gerektiriyor.
- `package.json` adı zaten `pengui` (rebranding tamamlanmış).

## Faz 19+ Oturumu (Search Convergence + SEO + A11y + Hijyen) — TAMAMLANDI
Bu oturumda raporun (`pengui-analiz-raporu-2026-06-15.md`) borçları 7 fazda uygulandı:
- **Faz 19 / Ortak arama motoru:** `lib/search.ts` çıkarıldı; `CommandAssistant`, `SearchBar` ve `lib/commands.searchCommands()` artık aynı motoru kullanıyor. SearchBar artık keyword/görev farkındalıklı ("metin ara" → grep). Golden test 23 sorgu için hem keyword-fallback hem tam motoru simüle ediyor (23/23 geçer).
- **Motor iyileştirmeleri (Faz 19 sonrası):**
  - **Disambiguation motora taşındı:** `wifi`/`firewall`/`güvenlik duvarı`/`swap`/`kullanıcı` seçenek haritası artık `lib/search.ts` içinde; `search()` sonucu `disambiguation` alanı döndürüyor. Böylece `CommandAssistant` kendi kopyasını tutmuyor ve davranış `searchPlayground.ts`/golden ile test edilebiliyor.
  - **Tam komut adı önceliği:** Tam bir komut adı yazıldığında (ör. `ls`), o komutu yalnızca *alternatif* olarak içeren görev (ör. `du`) onu gölgelemiyor; komutun kendisi öneriliyor. Görev, komutu *primary* olarak kullanıyorsa (ör. `grep`) yine görev gösteriliyor.
- **Test aracı:** `scripts/searchPlayground.ts` — motoru sorgu bataryası veya tekil sorgularla CLI'dan test etmek için (`npx tsx scripts/searchPlayground.ts "metin ara"`).
- **Veri/validatör:** `validateTasks.ts` artık `alternatives` slug + `category` namespace denetliyor; `systemd→systemctl`, `iwctl` kaldırıldı; task kategorileri 12'li namespace'e hizalandı. `brandCheck.ts` artık `exit 1` veriyor. CI tüm `validate` zincirini + `push`/`workflow_dispatch` çalıştırıyor.
- **Keyword:** 537 → **539** (curated `unix→uname`, `terminal→stty` eklendi; exact-match short-circuit ile güvenli).
- **SEO:** Tüm hub/alt sayfalara `canonical` override (kök canonical sızıntısı kapatıldı), `og-image.png` (1200×630) + metadata, `app/manifest.ts` + viewport/theme-color, `BreadcrumbList` + `CollectionPage` JSON-LD, `loading.tsx`/`error.tsx` (kök + komut). `linux/[slug]` kod bloğu artık render ediliyor + palet hizalandı.
- **A11y:** CopyButton klavye/touch görünürlüğü, FavoriteButton dinamik `aria-label`/`aria-pressed`, CommandAssistant `aria-live`, SearchBar `combobox`/`listbox` rolleri, belirsiz sorgular için disambiguation kartı.
- **Hijyen:** `factor`/`echo`/`tput` `detail_tr` yeniden yazıldı; `terminal-nedir` öğren modülü `terminal-temelleri`'ne taşındı (slug çakışması çözüldü); 6 legacy JS `scripts/_legacy/`'ye taşındı; `penguizz.zip` silindi; `.env.example` izlenebilir yapıldı.
- **Build:** `npm run build` → 396 sayfa, 0 hata; `npm run validate` → yeşil (5 önceden var olan örnek uyarısı dışında).

## Aktif Zorluklar / Kararlar (Active Challenges / Decisions)
- **Commit bekliyor:** Bu oturumdaki tüm değişiklikler commit'lenmedi (kullanıcı kendisi commit'leyecek). `scripts/*` pipeline dosyaları, `data/review/`, `.env.example` ve memory-bank dahil.
- **Bundle boyutu:** `commands.json` ~381 KB; 500+ komutta code splitting gündeme gelecek.
- **Bakım modu kararı:** Hâlâ açık. P0 release smoke test (`releaseSmokeTest.md`) tamamlanınca Vercel'de `MAINTENANCE_MODE=false`.

## Sonraki Adımlar (Next Steps)
1. Bu oturumdaki değişiklikleri gözden geçir ve commit'le (kullanıcı).
2. Release smoke test check-listini tamamla (özellikle `wifi bağlan`/`wifi tara` ve disambiguation kartı doğrulaması).
3. Smoke test geçince Vercel'de `MAINTENANCE_MODE=false` ile yayına geç.
4. Roadmap: Regex asistanı, CRON oluşturucu, İnteraktif Terminal, Quiz sistemi.
