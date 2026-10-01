# Beyza'nın A1 Bahçesi

Start Deutsch 1 (A1) kelimelerini çalışmak için küçük bir PWA: ders kartları, der·die·das alıştırması, quiz ve yanlışları tekrar.

## Dosyalar

- `index.html`, `css/style.css`, `js/app.js`: uygulama
- `js/words.js`: kelime listesi (`[artikel, kelime, çoğul, türkçe, örnek, tür]`)
- `sw.js`: çevrimdışı çalışma için service worker
- `beyza-a1.html`: internetsiz, tek dosyalık sürüm. **Otomatik üretilir, elle düzenleme.**

## Geliştirme

Build adımı yok; dosyaları herhangi bir statik sunucuyla yayınlamak yeterli.

Bir şey değiştirdikten sonra:

1. Tek dosyalık sürümü yeniden üret: `node scripts/build-standalone.js`
2. Önbelleğe alınan dosya listesini değiştirdiysen `sw.js` içindeki `CACHE_NAME` sürümünü artır.
   (Service worker önce ağı denediği için normal içerik değişiklikleri zaten hemen yansır.)

## Kelime ekleme / silme

Her kelimenin kimliği `artikel|kelime` şeklindedir (ör. `der|Apfel`). Listede sıra değişse de kayıtlı ilerleme bozulmaz.
Bir kelimenin yazımını değiştirirsen o kelimenin ilerlemesi sıfırlanır.
