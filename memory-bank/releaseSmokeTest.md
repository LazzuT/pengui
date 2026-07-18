# Release Smoke Test Notları

Bu dosya `pengui.org` üzerinde `MAINTENANCE_MODE=false` ile yayına geçmeden önce manuel olarak test edilen sorgu ve akışların kayıt defteridir. Her release adayında güncellenir; geçmiş gözlemler korunarak yeni gözlemler altına eklenir.

## Status Convention

| Status | Anlamı |
|---|---|
| `PASS` | Beklenen davranış; UX'e müdahale gerekmiyor. |
| `PASS-with-note` | Kabul edilebilir, release'i bloke etmez; ileride UX iyileştirme adayı. |
| `FAIL` | Release blocker; düzelmeden bakım modu kapatılamaz. |
| `BEKLENEN` | Henüz manuel test edilmedi; bir sonraki turda doğrulanmalı. |

---

## 1. Search & Assistant — WiFi Sorgu Ailesi

İlk gözlem: 2026-05-24 (Faz 18 sonrası). Test ortamı: lokal dev server `localhost:3001`.

> **Faz 19 güncellemesi (2026-06-16):** Belirsiz tek-kelime sorgular için **disambiguation kartı** artık uygulandı (`lib/search.ts` içinde). `wifi` artık tek bir tahmin yerine **seçenek kartı** gösteriyor (Bağlan → `nmcli` / Tara → `iw`). Aşağıdaki gözlemlerin **yeniden test edilmesi** gerekiyor.

| Sorgu | Status | Mevcut çıktı (Faz 19) | Not |
|---|---|---|---|
| `wifi` | BEKLENEN | Disambiguation kartı: Bağlan (`nmcli`) / Tara (`iw`) | Yeni disambiguation davranışı; dev server'da doğrula. |
| `wifi yönet` | BEKLENEN | `nmcli` (görev/keyword) | Yeniden doğrulanmalı. |
| `wifi bağlan` | BEKLENEN | — | `nmcli device wifi connect` beklenir. |
| `wifi tara` | BEKLENEN | — | `iw dev wlan0 scan` beklenir. |

### Disambiguation kartı (Faz 19'da uygulandı)

- Belirsiz tek-kelime sorgular `wifi`, `firewall`, `güvenlik duvarı`, `swap`, `kullanıcı` için 2-3 seçenekli kart gösteriliyor. Harita `lib/search.ts` içindeki `DISAMBIGUATION` sabitinde.
- Motor düzeyinde olduğundan `npx tsx scripts/searchPlayground.ts "wifi"` ile test edilebilir.
- Smoke test'te bu sorguların **kart** gösterdiği (tek tahmin değil) gözle doğrulanmalı.

---

## 2. Search & Assistant — Diğer Sorgu Aileleri

Yer tutucu. İleride doğrulanacak aileler:

- Firewall ailesi: `firewall`, `güvenlik duvarı`, `port aç`, `iptables kuralı`
- Swap ailesi: `swap`, `swap aç`, `swap oluştur`, `swap kapat`
- Kernel module ailesi: `modül yükle`, `yüklü modüller`, `modül kaldır`, `modül bilgisi`
- Kullanıcı ailesi: `kullanıcı oluştur`, `kullanıcı sil`, `toplu şifre`, `grup oluştur`
- Donanım ailesi: `cpu bilgisi`, `donanım sıcaklığı`, `donanım envanteri`, `usb aygıtları`
- Risk listesi (geriye dönük): `linux`, `unix`, `shell`, `terminal`, `network` — golden test'te zaten kapsanıyor, manuel doğrulama yine de tavsiye edilir.

---

## 3. Bakım Modu / Preview Akışı

Yer tutucu. Test edilecek akışlar:

- `MAINTENANCE_MODE=true` iken root URL'in `/maintenance`'a redirect olması
- `/preview` sayfasında doğru `MAINTENANCE_PASSWORD` ile `pengui-access` cookie'sinin set edilmesi
- Cookie set edildikten sonra anasayfaya redirect ve diğer route'lara erişim
- Yanlış şifrenin "Hatalı şifre" mesajı vermesi
- `MAINTENANCE_MODE=false` durumunda middleware'in tüm trafiği geçirmesi (cookie olsa da olmasa da)

---

## 4. SSG Build & Sayfa Üretimi

Yer tutucu. Her release'de güncellenir.

- Son onay: 2026-06-16 (Faz 19). `npm run build` → ✓ Compiled successfully, ✓ Generating static pages (396/396), 0 hata. (Sayfa 395 → 396: yeni `manifest.webmanifest` route'u.)
- Önceki onay: 2026-05-24 (Faz 18), 395/395.

---

## 5. Validators (CI Senkronu)

Yer tutucu. Her release'de güncellenir.

- Son onay: 2026-06-16 (Faz 19). `npm run validate` → 4/4 yeşil; golden **23/23** geçti (keyword fallback + tam motor); CI artık tüm `validate` zincirini çalıştırıyor. 5 önceden var olan example warning (groupdel, batch, xzcat, dumpe2fs, tac) hâlâ uyarı olarak duruyor (bloklamıyor).
- Önceki onay: 2026-05-24 (Faz 18), 4/4 yeşil, 22/22 golden.

---

## Release Acceptance Criteria

Bakım modu kapatılmadan önce aşağıdakilerin **hepsi** sağlanmalı:

1. Bölüm 1 ve Bölüm 2 altındaki tüm sorgu satırları `PASS` veya `PASS-with-note`. Hiç `FAIL` ve hiç `BEKLENEN` olmamalı.
2. Bölüm 3 (Bakım Modu / Preview) altındaki 5 madde `PASS`.
3. Bölüm 4 (SSG Build) altında en güncel build 0 hata.
4. Bölüm 5 (Validators) altında en güncel run 0 error.
5. Memory bank (`activeContext.md`, `progress.md`) son durumla uyumlu.
