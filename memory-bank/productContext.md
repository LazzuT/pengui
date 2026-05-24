# Ürün Bağlamı — Pengui

## Neden Bu Proje Var?
Türkiye'de Linux öğrenmek isteyen kişiler için Türkçe, düzenli, modern ve kolay erişilebilir bir komut referansı bulunmuyor. Mevcut kaynaklar genellikle:
- Dağınık blog yazıları (güncelliğini yitirmiş)
- İngilizce `man` sayfaları (yeni başlayanlar için çok zorlayıcı)
- Kapsamlı ama görsel olarak yorucu, karmaşık wiki'ler (bilgi kirliliği)

**Pengui** bu boşluğu doldurmayı ve Linux öğrenimini eğlenceli, hızlı, modern bir noktaya taşımayı hedefliyor.

## Çözdüğü Problemler
| Problem | Çözüm |
|---------|-------|
| Türkçe kaynak azlığı | Tamamen Türkçe, basit jargonla yazılmış 350 komut açıklaması |
| Bilgiye hızlı erişim zorluğu | Token-based scoring engine, keyword pre-check, fuzzy search ve 598 keyword eşleştirmesi |
| "Ne yapmak istiyorum ama komutu bilmiyorum" | Görevden Komuta (Task-to-Command): "Açık portları listele" → `ss` |
| Örneksiz, kuru dokümantasyon | Her komut için 2+ pratik terminal örneği, tehlike uyarıları |
| Yeni başlayanlar için karmaşık yapı | Sadeleştirilmiş arayüz, 6 adımlı eğitim rotası (`/ogren`), 9 Linux rehberi (`/linux`) |
| Komut kaydetme ihtiyacı | Local-First favoriler: hesap açmadan, localStorage ile cihazda kayıt |

## Nasıl Çalışmalı?
1. Kullanıcı ana sayfaya gelir → sevimli penguen maskotu (Tux) ile karşılanır, kategorileri ve "Terminal öğrenmeye nereden başlamalı" eğitim modüllerini görür.
2. Arama kutusuna "metin ara" veya "ls" yazar → CommandAssistant arka planda keyword/task eşleşmesini bulur ve sonuçlar klavye destekli liste halinde çıkar.
3. "Açık portları listele" gibi doğal Türkçe görev yazarsa → TaskCard ile doğru komutu (ör: `ss`) önce gösterir.
4. Bir komuta tıklar → detay sayfasında açıklama, sözdizimi, tehlike uyarıları, parametreler ve pratik örnekleri görür.
5. Beğendiği komutu ⭐ favorilere ekler → `/favoriler` sayfasından tekrar erişir.
6. İsterse dağıtımına özel bilgileri (`/distro/arch` vb.) görebilir.

## Kullanıcı Deneyimi Hedefleri
- **Hız (SSG)**: ~394 sayfa tamamen Statik HTML (SSG) olduğu için mükemmel PageSpeed skorları (< 1s yükleme süresi).
- **Modern Tasarım**: Tailwind v4 kullanılarak tasarlanan, glassmorphism dokunuşlara sahip gece modu hissiyatlı kod blokları.
- **Mobil Öncelikli**: Telefonda metrobüste bile dokümantasyon okumak için ideal navigasyon.
- **Keşfedilebilirlik**: İlgili komutlar, kategori geçişleri, öğrenme rotaları ve özel 404 kayıp penguen sayfası bağlamayı koparmaz.

## "Build in Public" Vurgusu
Site, AI destekli geliştirme sürecini şeffaf olarak paylaşır:
- `/hakkinda` sayfasında geliştirme hikâyesi, neden "Pengui" olduğu ve kullanılan AI araçları net bir şekilde belirtilmiştir.
