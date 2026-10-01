# Beyza'nın A1 Bahçesi

Start Deutsch 1 (A1 sertifika) kelimelerini çalışmak için küçük bir PWA: ders kartları, der·die·das alıştırması, quiz ve yanlışları tekrar.

## Dosyalar

- `index.html`, `css/style.css`, `js/app.js`: uygulama
- `js/words.js`: kelime listesi (`[artikel, kelime, çoğul, türkçe, örnek, tür]`)
- `sw.js`: çevrimdışı çalışma için service worker

## Çalıştırma

Build adımı yok, tüm yollar görelidir:

- **Yerelde:** `index.html`'e çift tıkla (klasördeki diğer dosyalarla birlikte durmalı).
- **Yayında:** Klasörü herhangi bir statik sunucuya koy (ör. GitHub Pages). Telefonda "Ana ekrana ekle" ile kurulur ve internetsiz de çalışır.

Önbelleğe alınan dosya listesini değiştirirsen `sw.js` içindeki `CACHE_NAME` sürümünü artır.
Service worker önce ağı denediği için normal içerik değişiklikleri zaten hemen yansır.

## Kelime ekleme / silme

Her kelimenin kimliği `artikel|kelime` şeklindedir (ör. `der|Apfel`). Listede sıra değişse de kayıtlı ilerleme bozulmaz.
Bir kelimenin yazımını değiştirirsen eski kimliği `js/words.js` içindeki `ID_ALIASES`'a ekle (ör. `"|all-": "|alle"`); yoksa o kelimenin ilerlemesi sıfırlanır.
