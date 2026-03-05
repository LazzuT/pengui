# Active Context

## Mevcut Durum (Current State)
- Proje **Faz 5: Deployment Preparation** adımını tamamlamış ve `pengui.org` Vercel ortamına deploy edilmeye tamamen hazırdır.
- `middleware.ts` kullanılarak tüm rotalar "Maintenance Mode" kalkanı altına alınmıştır. İzinsiz tüm ziyaretçiler zorunlu şekilde minimalist hazırlanan `/maintenance` sayfasına gönderilecektir (penguen emojili gizli mod).
- `/preview` sayfası aracılığıyla ortam değişkenlerinde bulunan özel şifre (`MAINTENANCE_PASSWORD`) girilerek (Cookies üzerinden) geliştirici / tester ekibine Private Access (Özel İzin) verilebilir. Vercel env'leri sisteme entegre edilmiştir.
- `npm run build` testinde Next.js Server Actions ve Middleware ile birlikte proje başarıyla derlenmiş, 135 statik rota (SSG) oluşturulmuştur. SEO koruması (`noindex, nofollow`) aktiftir.

## Aktif Zorluklar / Kararlar (Active Challenges / Decisions)
- Şema/İçerik Code-Freeze (dondurulmuş) modundadır. Mevcut componentler, renk mimarisi ve Tailwind yapıları zedelenmeden bakım modu/önizleme ekranları eklendi. Next.js 15 Server Actions sayesinde hiçbir API'a gerek duymadan Cookie Authentication çözüldü.

## Sonraki Adımlar (Next Steps)
- Projenin (Github Reposunun) Vercel'e bağlanması. `MAINTENANCE_PASSWORD` değişkeninin production'da tanımlanması. Pengui artık v1.0 Private Launch modundadır.
