// Hatırlama testlerinin otomatik puanlanması.
// Yazım hatası ezberi bozmamalı: Türkçe normalizasyon + bulanık eşleşme kullanılır.

const TR = { 'ı': 'i', 'İ': 'i', 'ş': 's', 'ğ': 'g', 'ü': 'u', 'ö': 'o', 'ç': 'c', 'â': 'a', 'î': 'i', 'û': 'u' };

export function normalize(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[ıİşğüöçâîû]/g, (c) => TR[c] || c)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mesafe(a, b) {
  if (a === b) return 0;
  if (!a.length || !b.length) return Math.max(a.length, b.length);
  let onceki = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const satir = [i];
    for (let j = 1; j <= b.length; j++) {
      satir[j] = Math.min(
        onceki[j] + 1,
        satir[j - 1] + 1,
        onceki[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    onceki = satir;
  }
  return onceki[b.length];
}

// 0..1 benzerlik. 0.82 üstü "aynı şeyi yazmış" kabul edilir.
export function benzerlik(a, b) {
  const x = normalize(a), y = normalize(b);
  if (!x && !y) return 1;
  if (!x || !y) return 0;
  if (x === y) return 1;
  const uzun = Math.max(x.length, y.length);
  return 1 - mesafe(x, y) / uzun;
}

export const esit = (a, b, esik = 0.82) => benzerlik(a, b) >= esik;

// Sıra önemli: i. cevap i. beklenenle karşılaştırılır.
// Satır atlamayı cezalandırmamak için cevap listesi beklenen uzunluğa hizalanır.
export function siraliPuan(beklenen, verilen) {
  const detay = beklenen.map((b, i) => {
    const v = verilen[i] ?? '';
    const dogru = v ? esit(b, v) : false;
    // doğru içerik ama yanlış sırada mı?
    const yerBaska = !dogru && v && beklenen.some((x, j) => j !== i && esit(x, v));
    return { beklenen: b, verilen: v, dogru, yerBaska };
  });
  const dogru = detay.filter((d) => d.dogru).length;
  return { dogru, toplam: beklenen.length, yuzde: beklenen.length ? Math.round((dogru / beklenen.length) * 100) : 0, detay };
}

// Sıra önemsiz: kaç tanesini hatırlamış?
export function kumePuan(beklenen, verilen) {
  const kalan = [...verilen];
  const detay = beklenen.map((b) => {
    const i = kalan.findIndex((v) => esit(b, v));
    if (i >= 0) { kalan.splice(i, 1); return { beklenen: b, dogru: true }; }
    return { beklenen: b, dogru: false };
  });
  const dogru = detay.filter((d) => d.dogru).length;
  return { dogru, toplam: beklenen.length, yuzde: beklenen.length ? Math.round((dogru / beklenen.length) * 100) : 0, detay, fazla: kalan };
}

// Kullanıcının serbest yazdığı metni satır/virgül ayırarak listeye çevirir.
export function satirlara(metin) {
  return String(metin ?? '')
    .split(/[\n,;]+/)
    .map((s) => s.replace(/^\s*\d+[).\-]?\s*/, '').trim())   // baştaki "3." numarasını at
    .filter(Boolean);
}
