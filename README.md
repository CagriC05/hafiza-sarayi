# Hafıza Sarayı Kursu

Hafıza sarayı (loci) yöntemini **adım adım öğreten** 12 derslik bir kurs uygulaması.
Sana saray kurmaz; kurmayı öğretir ve kurduğunu denetler.

Mobil öncelikli bir PWA'dır: derleme adımı yok, bağımlılık yok, çevrimdışı çalışır,
telefona uygulama olarak kurulabilir.

## Ne yapar

- **12 ders, 4 ünite** — Temel → Mekan → İmge → Hatırlama. Her ders öncekini tamamlamadan açılmaz.
- **Yedi adım tipi** — açıklama, gerekçeli çoktan seçmeli, kötü/iyi örnek karşılaştırması,
  yazma alıştırması, öz-denetim rubriği, uygulama ödevi ve otomatik puanlanan test.
- **Gerçek ödev denetimi** — "10 durak ekle" gibi ödevler senin verine bakılarak kontrol edilir;
  eksik ipucu, kısa tasvir veya tek durağa yığılmış imgeler reddedilir.
- **Otomatik puanlanan testler** — rota hatırlama (ileri/ters/rastgele erişim) bulanık
  eşleştirmeyle puanlanır; yazım hatası cezalandırılmaz, yanlış sıra ayrıca işaretlenir.
- **Ön test / son test** — kursun başındaki ham skorun sonunda aynı formatla karşılaştırılır.
- **Aralıklı tekrar** — yerleştirdiğin imgeler SM-2 türevi bir motorla programlanır.
- **Zayıf nokta raporu** — sürekli takıldığın imgeler "kötü kurulmuş imge" olarak işaretlenir.

## Çalıştırma

Sunucu gerektirir (ES modülleri `file://` üzerinden yüklenmez):

```bash
python3 -m http.server 8080
```

Sonra `http://localhost:8080` adresini aç. Aynı ağdaki telefondan erişmek için
`--bind 0.0.0.0` ekleyip bilgisayarın yerel IP'sini kullan.

Not: çevrimdışı çalışma ve "ana ekrana ekle" için HTTPS gerekir (service worker
güvenli bağlam ister). Yerel IP üzerinden test ederken uygulama çalışır ama
çevrimdışı olmaz.

## Dosyalar

| Dosya | İş |
|---|---|
| `index.html` | Uygulama kabuğu |
| `mufredat.js` | Ders içerikleri ve ödev denetim fonksiyonları |
| `ilerleme.js` | Kurs ilerlemesi, ders kilitleri, test skorları |
| `eslestir.js` | Türkçe normalizasyon + bulanık eşleştirme, test puanlama |
| `srs.js` | Aralıklı tekrar motoru ve imge zayıflık skoru |
| `store.js` | Saray / durak / imge veri katmanı, JSON yedek |
| `app.js` | Yönlendirme, ders oynatıcı, testler, atölye, prova, rapor |
| `styles.css` | Mobil öncelikli koyu tema |
| `sw.js`, `manifest.json` | Çevrimdışı çalışma ve kurulabilirlik |

## Veri

Her şey tarayıcının `localStorage`'ında durur; sunucuya hiçbir şey gönderilmez.
Bu yüzden veri cihaza bağlıdır ve tarayıcı verisini temizlemek her şeyi siler.
Ayarlar > "Yedeği indir" ile saray ve kurs ilerlemesini tek JSON dosyasında yedekle.
