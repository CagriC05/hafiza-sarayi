// Veri katmanı: localStorage üzerinde tek JSON belgesi.
// Kişisel ölçekte (binlerce imge) rahat yeter; yedek için JSON dışa/içe aktarma var.
import { yeniDurum, bugun, vadesiGeldi, zayiflik } from './srs.js';

const ANAHTAR = 'hafiza-sarayi-v1';
const SURUM = 1;

let db = yukle();
const dinleyiciler = new Set();

function bos() {
  return { surum: SURUM, saraylar: [], ayarlar: { gunlukHedef: 20 } };
}

function yukle() {
  try {
    const raw = localStorage.getItem(ANAHTAR);
    if (!raw) return bos();
    const veri = JSON.parse(raw);
    if (!veri || !Array.isArray(veri.saraylar)) return bos();
    veri.ayarlar = { gunlukHedef: 20, ...(veri.ayarlar || {}) };
    return veri;
  } catch (e) {
    console.error('Veri okunamadı, boş başlatılıyor', e);
    return bos();
  }
}

function kaydet() {
  try {
    localStorage.setItem(ANAHTAR, JSON.stringify(db));
  } catch (e) {
    alert('Kaydedilemedi (depolama dolu olabilir). Ayarlar > Yedek al ile verini dışa aktar.');
  }
  dinleyiciler.forEach((f) => f());
}

export function abone(f) { dinleyiciler.add(f); return () => dinleyiciler.delete(f); }
export function veri() { return db; }
export function ayarlar() { return db.ayarlar; }

export function ayarYaz(yama) {
  db.ayarlar = { ...db.ayarlar, ...yama };
  kaydet();
}

const kimlik = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

/* ---------- Saray ---------- */

export function saraylar() { return db.saraylar; }
export function saray(id) { return db.saraylar.find((s) => s.id === id) || null; }

export function sarayEkle({ ad, aciklama = '' }) {
  const s = { id: kimlik(), ad: ad.trim(), aciklama, olusturma: Date.now(), duraklar: [] };
  db.saraylar.push(s);
  kaydet();
  return s;
}

export function sarayGuncelle(id, yama) {
  const s = saray(id);
  if (!s) return;
  Object.assign(s, yama);
  kaydet();
}

export function saraySil(id) {
  db.saraylar = db.saraylar.filter((s) => s.id !== id);
  kaydet();
}

/* ---------- Durak ---------- */

export function durakEkle(sarayId, { ad, ipucu = '' }) {
  const s = saray(sarayId);
  if (!s) return null;
  const d = { id: kimlik(), ad: ad.trim(), ipucu, imgeler: [] };
  s.duraklar.push(d);
  kaydet();
  return d;
}

export function durak(sarayId, durakId) {
  return saray(sarayId)?.duraklar.find((d) => d.id === durakId) || null;
}

export function durakGuncelle(sarayId, durakId, yama) {
  const d = durak(sarayId, durakId);
  if (!d) return;
  Object.assign(d, yama);
  kaydet();
}

export function durakSil(sarayId, durakId) {
  const s = saray(sarayId);
  if (!s) return;
  s.duraklar = s.duraklar.filter((d) => d.id !== durakId);
  kaydet();
}

export function durakTasi(sarayId, durakId, yon) {
  const s = saray(sarayId);
  if (!s) return;
  const i = s.duraklar.findIndex((d) => d.id === durakId);
  const j = i + yon;
  if (i < 0 || j < 0 || j >= s.duraklar.length) return;
  [s.duraklar[i], s.duraklar[j]] = [s.duraklar[j], s.duraklar[i]];
  kaydet();
}

/* ---------- İmge (durağa yerleştirilen içerik) ---------- */

export function imgeEkle(sarayId, durakId, { terim, icerik, tasvir = '', duyu = '' }) {
  const d = durak(sarayId, durakId);
  if (!d) return null;
  const im = {
    id: kimlik(),
    terim: terim.trim(),          // hatırlanacak başlık/soru
    icerik: icerik.trim(),        // tanım/cevap
    tasvir,                       // duraktaki görsel tasvir
    duyu,                         // ses/koku/hareket notu
    olusturma: Date.now(),
    srs: yeniDurum(),
  };
  d.imgeler.push(im);
  kaydet();
  return im;
}

export function imgeGuncelle(sarayId, durakId, imgeId, yama) {
  const im = durak(sarayId, durakId)?.imgeler.find((x) => x.id === imgeId);
  if (!im) return;
  Object.assign(im, yama);
  kaydet();
}

export function imgeSil(sarayId, durakId, imgeId) {
  const d = durak(sarayId, durakId);
  if (!d) return;
  d.imgeler = d.imgeler.filter((x) => x.id !== imgeId);
  kaydet();
}

/* ---------- Sorgular ---------- */

// Tüm imgeleri saray/durak bağlamıyla düzleştirir.
export function tumImgeler(sarayId = null) {
  const liste = [];
  for (const s of db.saraylar) {
    if (sarayId && s.id !== sarayId) continue;
    s.duraklar.forEach((d, sira) => {
      for (const im of d.imgeler) {
        liste.push({ saray: s, durak: d, sira: sira + 1, imge: im });
      }
    });
  }
  return liste;
}

export function vadesiGelenler(sarayId = null) {
  const g = bugun();
  return tumImgeler(sarayId).filter((x) => vadesiGeldi(x.imge.srs, g));
}

export function zayifNoktalar(sarayId = null, limit = 10) {
  return tumImgeler(sarayId)
    .map((x) => ({ ...x, skor: zayiflik(x.imge.srs) }))
    .filter((x) => x.skor > 0.45 && (x.imge.srs.gecmis?.length || 0) > 0)
    .sort((a, b) => b.skor - a.skor)
    .slice(0, limit);
}

export function istatistik(sarayId = null) {
  const hepsi = tumImgeler(sarayId);
  const g = bugun();
  return {
    toplam: hepsi.length,
    yeni: hepsi.filter((x) => x.imge.srs.tekrar === 0 && !(x.imge.srs.gecmis || []).length).length,
    vadesiGelen: hepsi.filter((x) => vadesiGeldi(x.imge.srs, g)).length,
    olgun: hepsi.filter((x) => x.imge.srs.aralik >= 21).length,
  };
}

/* ---------- Yedek ---------- */

export function disaAktar() {
  return JSON.stringify(db, null, 2);
}

export function iceAktar(metin, { birlestir = false } = {}) {
  const gelen = JSON.parse(metin);
  if (!gelen || !Array.isArray(gelen.saraylar)) throw new Error('Geçersiz yedek dosyası.');
  if (birlestir) {
    const mevcut = new Set(db.saraylar.map((s) => s.id));
    for (const s of gelen.saraylar) {
      if (mevcut.has(s.id)) s.id = kimlik();
      db.saraylar.push(s);
    }
  } else {
    db = { ...bos(), ...gelen, surum: SURUM };
  }
  kaydet();
}
