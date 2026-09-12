// Aralıklı tekrar motoru (SM-2 türevi, saf fonksiyonlar).
// Her içerik (item) kendi tekrar durumunu taşır; rota provası bunu besler.

export const GRADE = { AGAIN: 0, HARD: 1, GOOD: 2, EASY: 3 };

export const GUN = 86400000;

export function bugun() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function yeniDurum() {
  return { kolaylik: 2.5, aralik: 0, tekrar: 0, hata: 0, vade: bugun(), sonNot: null, gecmis: [] };
}

// Not verildiğinde yeni tekrar durumunu döndürür (girdiyi değiştirmez).
export function planla(durum, grade, simdi = Date.now()) {
  const d = { ...durum, gecmis: [...(durum.gecmis || [])] };
  d.gecmis.push({ t: simdi, g: grade });
  if (d.gecmis.length > 40) d.gecmis = d.gecmis.slice(-40);
  d.sonNot = grade;

  if (grade === GRADE.AGAIN) {
    d.hata += 1;
    d.tekrar = 0;
    d.aralik = 0;                       // aynı seansta tekrar sorulur
    d.kolaylik = Math.max(1.3, d.kolaylik - 0.2);
    d.vade = bugun();
    return d;
  }

  d.tekrar += 1;
  if (d.tekrar === 1) {
    d.aralik = grade === GRADE.HARD ? 1 : grade === GRADE.GOOD ? 2 : 4;
  } else if (d.tekrar === 2) {
    d.aralik = grade === GRADE.HARD ? 3 : grade === GRADE.GOOD ? 6 : 10;
  } else {
    const carpan = grade === GRADE.HARD ? 1.2 : grade === GRADE.EASY ? d.kolaylik * 1.3 : d.kolaylik;
    d.aralik = Math.max(1, Math.round(d.aralik * carpan));
  }
  if (grade === GRADE.HARD) d.kolaylik = Math.max(1.3, d.kolaylik - 0.15);
  if (grade === GRADE.EASY) d.kolaylik = Math.min(3.2, d.kolaylik + 0.15);
  d.aralik = Math.min(d.aralik, 365);
  d.vade = bugun() + d.aralik * GUN;
  return d;
}

export function vadesiGeldi(durum, gun = bugun()) {
  return (durum?.vade ?? 0) <= gun;
}

// İmgenin ne kadar "zayıf" olduğu: son notlar ve hata oranı.
// 0 = sağlam, 1 = tamamen çürük. Zayıf nokta raporunu besler.
export function zayiflik(durum) {
  const g = durum?.gecmis || [];
  if (!g.length) return 0.5;
  const son = g.slice(-6);
  const ortalama = son.reduce((a, x) => a + x.g, 0) / son.length;   // 0..3
  const hataOrani = g.filter((x) => x.g === GRADE.AGAIN).length / g.length;
  return Math.min(1, Math.max(0, (1 - ortalama / 3) * 0.65 + hataOrani * 0.35));
}
