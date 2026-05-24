# Active Context

## Mevcut Durum (Current State)
- Proje **Faz 18 (Search Hardening 2 + Release Hardening)** aşamasında. Faz 17 (Batch-001) merge'i ve detail_tr polish'i hâlihazırda commands.json'a yansımış durumda — `data/commands.json` 350 komut, polish edilmiş `detail_tr` alanları (ör. `lscpu` → "lscpu, işlemcinin mimarisi, çekirdek sayısı, iş parçacığı (thread) sayısı...") `scripts/polishDetailData.json` ile birebir eşleşiyor.
- **Bakım modu açık:** `pengui.org` bilinçli olarak `MAINTENANCE_MODE=true` ile bakımda. Faz 18 tamamlanana ve smoke test geçene kadar kapatılmayacak. `middleware.ts` ve `app/preview/actions.ts` değişmedi.
- **Search hardening 2 (yeni):**
  - `data/commandKeywords.json` 598 → **537 keyword** (~60+ otomatik üretilmiş açıklama parçası ve typo artefaktı temizlendi).
  - 50 yeni komut için curated Türkçe keyword eşleştirmeleri eklendi (ör: "güvenlik duvarı"→ufw, "wifi yönet"→nmcli, "donanım bilgisi"→lshw, "swap aç"→swapon, "ssd trim"→fstrim, "cpu bilgisi"→lscpu, "luks"→cryptsetup).
  - `scripts/validateSearchMappings.ts` `FORBIDDEN_SINGLE_WORDS` listesi 12 → **70+** girişe çıktı; ek olarak `ALLOWED_BROAD_SINGLE_WORDS` allow-list ile yeni eklenecek tek-kelime anahtarlar warning olarak işaretleniyor.
  - Golden test set 9 → **22 sorgu**: poisoned-keyword regression testleri (`linux`, `unix`, `shell`, `terminal`, `network`) + yeni 50-komut coverage testleri (`güvenlik duvarı`, `wifi yönet`, `donanım sıcaklığı` …).
  - `data/tasks.json` 16 → **22 görev**: ufw, nmcli, adduser, sensors, lshw, mkswap için yeni Türkçe görev tanımları.
- **Repo durumu:** Yeni komut pipeline script'leri (`generateNewCommandsBatch.ts`, `mergeNewCommandsBatch.ts`, `polishBatch.ts`, `polishBatch001InPlace.ts`, `polishDetailData.json`, `newCommandsConfig.json`, `validateNewCommandsBatch.ts`, `validateSearchMappings.ts`) ve `data/review/new-commands-batch-001.json` lokalde mevcut ama henüz git'e commit'lenmemiş (untracked). CI workflow'u (`.github/workflows/validate.yml`) sadece `validateCommands.ts` + `npm run build` çalıştırdığı için CI yeşil; ancak `npm run validate` lokal zinciri tüm script'lerin commit edilmesini gerektiriyor.
- `package.json` adı zaten `pengui` (rebranding tamamlanmış).

## Aktif Zorluklar / Kararlar (Active Challenges / Decisions)
- **Untracked pipeline script'lerini commit etme zamanı:** Pipeline kalsın, dosyalar commit'lensin (önerilen yol). `data/review/new-commands-batch-001.json` repo'ya alınmalı veya `.gitignore`'a eklenmeli + `npm run validate` zinciri buna göre düzenlenmeli — şu an yapılan değişiklik bu kararı bekliyor.
- **SearchBar ↔ CommandAssistant tutarsızlığı:** SearchBar `commandKeywords.json` ve `tasks.json`'ı kullanmıyor; "metin ara" yazınca grep gelmiyor. Faz 19 hedefi: `lib/search.ts` ortak motorunu çıkarmak veya SearchBar'a hafif keyword desteği eklemek.
- **Bundle boyutu:** `commands.json` 387 KB; 500+ komutta code splitting gündeme gelecek.
- **Bakım modu kararı:** Faz 18 doğrulanana kadar açık. Smoke test check-listi tanımlandıktan sonra release.

## Sonraki Adımlar (Next Steps)
1. `npm run validate` zincirini lokalde çalıştır (validateCommands → validateSearchMappings → validateTasks → brandCheck) ve hepsinin yeşil olduğunu onayla.
2. Pipeline script'lerini, `polishDetailData.json`'u, `validateSearchMappings.ts`'i ve `data/review/new-commands-batch-001.json`'u commit'le (kullanıcı onayıyla).
3. `npm run build` ile ~394 sayfanın hâlâ temiz üretildiğini doğrula.
4. Faz 19 — SearchBar/CommandAssistant birleşimi (`lib/search.ts` çıkar).
5. Release smoke test check-listi yaz, ardından Vercel'de `MAINTENANCE_MODE=false` ile yayına geç.
6. Roadmap: Regex asistanı, CRON oluşturucu, İnteraktif Terminal, Quiz sistemi.
