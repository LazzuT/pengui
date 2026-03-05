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
| Türkçe kaynak azlığı | Tamamen Türkçe, basit jargonla yazılmış anlaşılır açıklamalar |
| Bilgiye hızlı erişim zorluğu | Klavye destekli, asistan destekli anlık ("Fuzzy") arama ve kategori filtreleme |
| Örneksiz, kuru dokümantasyon | Her komut için pratik, interaktif ve gerçek hayattan koparılmış kullanım örnekleri |
| Yeni başlayanlar için karmaşık yapı | Sadeleştirilmiş arayüz, adım adım eğitim rotası (`/ogren`) |

## Nasıl Çalışmalı?
1. Kullanıcı ana sayfaya gelir → sevimli penguen maskotu (Tux) ile karşılanır, kategorileri ve "Terminal öğrenmeye nereden başlamalı" eğitim modüllerini görür.
2. Arama kutusuna "metin ara" veya "ls" yazar → asistan arka planda eşleşmeyi bulur ve sonuçlar klavye destekli liste halinde çıkar.
3. Bir komuta tıklar → "ls komutu" detay sayfasında açıklama, sözdizimi, tehlike uyarıları, parametreler ve pratik örnekleri görür.
4. İsterse kendi dağıtımının özelliklerini öğrenmek için (`/distro/arch` vb) geçiş yapabilir.

## Kullanıcı Deneyimi Hedefleri
- **Hız (SSG)**: 130'dan fazla sayfa tamamen Statik HTML (SSG) olduğu için mükemmel PageSpeed skorları (< 1s yükleme süresi).
- **Modern Tasarım**: Tailwind v4 kullanılarak tasarlanan, glassmorphism dokunuşlara sahip gece modu hissiyatlı kod blokları.
- **Mobil Öncelikli**: Telefonda metrobüste bile dokümantasyon okumak için ideal navigasyon.
- **Keşfedilebilirlik**: İlgili komutlar, kategori geçişleri ve özel 404 kayıp penguen sayfaları bağlamayı koparmaz.

## "Build in Public" Vurgusu
Site, AI destekli geliştirme sürecini şeffaf olarak paylaşır:
- `/hakkinda` sayfasında geliştirme hikâyesi, neden "Pengui" olduğu ve kullanılan AI araçları net bir şekilde belirtilmiştir. Modern bir deney örneğidir.
