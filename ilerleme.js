// Kurs ilerlemesi: hangi adım tamam, hangi ders açık, test/drill skorları.
// Saray verisinden ayrı anahtarda durur; biri bozulsa diğeri ayakta kalır.
import { DERSLER, dersBul, dersSira } from './mufredat.js';

const ANAHTAR = 'hafiza-sarayi-kurs-v1';
let ilerleme = yukle();
const dinleyiciler = new Set();

function bos() {
  return { surum: 1, dersler: {}, drills: {}, kilitsiz: false };
}

function yukle() {
  try {
    const v = JSON.parse(localStorage.getItem(ANAHTAR) || 'null');
    if (!v || typeof v.dersler !== 'object') return bos();
    return { ...bos(), ...v };
  } catch {
    return bos();
  }
}

function kaydet() {
  try { localStorage.setItem(ANAHTAR, JSON.stringify(ilerleme)); } catch {}
  dinleyiciler.forEach((f) => f());
}

export function abone(f) { dinleyiciler.add(f); return () => dinleyiciler.delete(f); }
export function ham() { return ilerleme; }

function dersKaydi(dersId) {
  if (!ilerleme.dersler[dersId]) ilerleme.dersler[dersId] = { adimlar: {}, tamamTarih: null };
  return ilerleme.dersler[dersId];
}

/* ---------- Adımlar ---------- */

export function adim(dersId, adimId) {
  return ilerleme.dersler[dersId]?.adimlar?.[adimId] || null;
}

export function adimTamamla(dersId, adimId, deger = null) {
  const k = dersKaydi(dersId);
  k.adimlar[adimId] = { tamam: true, deger, tarih: Date.now() };
  // Tüm adımlar bittiyse dersi tamamla.
  const ders = dersBul(dersId);
  if (ders && ders.adimlar.every((a) => k.adimlar[a.id]?.tamam) && !k.tamamTarih) {
    k.tamamTarih = Date.now();
  }
  kaydet();
}

// Yazma adımlarında taslağı kaybetmemek için: tamamlamadan da saklanır.
export function adimTaslak(dersId, adimId, deger) {
  const k = dersKaydi(dersId);
  const mevcut = k.adimlar[adimId];
  k.adimlar[adimId] = { tamam: mevcut?.tamam || false, deger, tarih: Date.now() };
  kaydet();
}

export function tamamAdimSayisi(dersId) {
  const k = ilerleme.dersler[dersId];
  if (!k) return 0;
  const ders = dersBul(dersId);
  return ders ? ders.adimlar.filter((a) => k.adimlar[a.id]?.tamam).length : 0;
}

/* ---------- Ders durumu ve kilitler ---------- */

export function dersTamamMi(dersId) {
  return !!ilerleme.dersler[dersId]?.tamamTarih;
}

// Bir ders, kendinden önceki ders tamamlanınca açılır.
export function dersDurumu(dersId) {
  if (dersTamamMi(dersId)) return 'tamam';
  const i = dersSira(dersId);
  if (i <= 0) return 'acik';
  if (ilerleme.kilitsiz) return 'acik';
  return dersTamamMi(DERSLER[i - 1].id) ? 'acik' : 'kilitli';
}

export function kilitsizMi() { return !!ilerleme.kilitsiz; }
export function kilitsizAyarla(v) { ilerleme.kilitsiz = !!v; kaydet(); }

export function siradakiDers() {
  return DERSLER.find((d) => dersDurumu(d.id) === 'acik' && !dersTamamMi(d.id)) || null;
}

export function genelIlerleme() {
  const tamam = DERSLER.filter((d) => dersTamamMi(d.id)).length;
  return { tamam, toplam: DERSLER.length, yuzde: Math.round((tamam / DERSLER.length) * 100) };
}

/* ---------- Drill / test sonuçları ---------- */

export function drillKaydet(drillId, sonuc) {
  if (!ilerleme.drills[drillId]) ilerleme.drills[drillId] = [];
  ilerleme.drills[drillId].push({ ...sonuc, tarih: Date.now() });
  if (ilerleme.drills[drillId].length > 30) ilerleme.drills[drillId] = ilerleme.drills[drillId].slice(-30);
  kaydet();
}

export function drillGecmisi(drillId) { return ilerleme.drills[drillId] || []; }

export function enIyiDrill(drillId) {
  const g = drillGecmisi(drillId);
  return g.length ? g.reduce((a, b) => (b.yuzde > a.yuzde ? b : a)) : null;
}

export function drillGectiMi(drillId, gecmeNotu) {
  const e = enIyiDrill(drillId);
  return !!e && e.yuzde >= gecmeNotu;
}

export function sifirla() {
  ilerleme = bos();
  kaydet();
}

export function disaAktar() { return ilerleme; }

export function iceAktar(v) {
  if (!v || typeof v.dersler !== 'object') return;
  ilerleme = { ...bos(), ...v };
  kaydet();
}
