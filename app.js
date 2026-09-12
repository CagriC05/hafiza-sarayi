import * as S from './store.js';
import * as P from './ilerleme.js';
import { GRADE, planla, zayiflik, bugun, GUN } from './srs.js';
import { siraliPuan, kumePuan, satirlara, esit } from './eslestir.js';
import { DERSLER, UNITELER, dersBul, dersSira, uniteDersleri, ON_TEST_LISTESI, SON_TEST_LISTESI } from './mufredat.js';

const kap = document.getElementById('uygulama');
const nav = document.getElementById('nav');
const dlg = document.getElementById('kutu');

const kacis = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nl2br = (t) => kacis(t).replace(/\n/g, '<br>');
const git = (yol) => { location.hash = yol; };

function rota() {
  const ham = location.hash.replace(/^#\/?/, '');
  const [yol, sorgu] = ham.split('?');
  return { parca: yol ? yol.split('/') : [], q: new URLSearchParams(sorgu || '') };
}

/* ============================================================ KURS: yol haritası */

function gorKurs() {
  const gi = P.genelIlerleme();
  const siradaki = P.siradakiDers();
  const onT = P.enIyiDrill('on-test');
  const sonT = P.enIyiDrill('son-test');

  return `
    <h1>Hafıza Sarayı Kursu</h1>
    <p class="soluk">Sana saray kurmuyor; kurmayı öğretiyor. Her ders alıştırmayla ve
    otomatik puanlanan testlerle kapanır.</p>

    <div class="kart" style="margin-top:14px">
      <div class="kart-baslik">
        <strong>İlerleme</strong>
        <span class="etiket ${gi.yuzde === 100 ? 'olgun' : ''}">${gi.tamam}/${gi.toplam} ders</span>
      </div>
      <div class="ilerleme"><i style="width:${gi.yuzde}%"></i></div>
      ${onT ? `<p class="soluk">Ön test: <strong>${onT.dogru}/${onT.toplam}</strong> terim${
        sonT ? ` → Son test: <strong>${sonT.dogru}/${sonT.toplam}</strong>
        (fark ${sonT.dogru - onT.dogru >= 0 ? '+' : ''}${sonT.dogru - onT.dogru})` : ' · son test 12. derste'}</p>` : ''}
    </div>

    ${siradaki ? `<button class="birincil tam" data-eylem="ders-ac" data-id="${siradaki.id}">
      ${P.tamamAdimSayisi(siradaki.id) ? 'Devam et' : 'Başla'}: ${kacis(siradaki.ad)}</button>`
      : `<div class="kart" style="border-color:#18402a"><strong>🎓 Kursu tamamladın.</strong>
         <p class="soluk">Atölye ve Prova sekmeleri senin çalışma alanın olarak kalıyor.</p></div>`}

    ${UNITELER.map((u) => {
      const dersler = uniteDersleri(u.id);
      const tamam = dersler.filter((d) => P.dersTamamMi(d.id)).length;
      return `
        <h2>${u.g} ${kacis(u.ad)} <span style="text-transform:none;letter-spacing:0;font-weight:400">· ${tamam}/${dersler.length}</span></h2>
        <p class="soluk" style="margin:-6px 0 10px">${kacis(u.aciklama)}</p>
        ${dersler.map((d) => {
          const durum = P.dersDurumu(d.id);
          const ad = P.tamamAdimSayisi(d.id);
          const rozet = durum === 'tamam' ? `<span class="etiket olgun">✓</span>`
            : durum === 'kilitli' ? `<span class="etiket">🔒</span>`
            : ad ? `<span class="etiket vade">${ad}/${d.adimlar.length}</span>`
            : `<span class="etiket yeni">${d.sure} dk</span>`;
          return `<div class="kart ${durum === 'kilitli' ? 'kilitli' : 'tiklanir'}"
            ${durum === 'kilitli' ? '' : `data-eylem="ders-ac" data-id="${d.id}"`}>
            <div class="kart-baslik">
              <span class="sira">${dersSira(d.id) + 1}</span>
              <strong>${kacis(d.ad)}</strong>
              ${rozet}
            </div>
            <p class="soluk">${kacis(d.ozet)}</p>
          </div>`;
        }).join('')}`;
    }).join('')}`;
}

/* ============================================================ DERS OYNATICI */

let dersImleci = { dersId: null, i: 0 };

function dersAc(dersId) {
  const ders = dersBul(dersId);
  if (!ders) return;
  const ilkEksik = ders.adimlar.findIndex((a) => !P.adim(dersId, a.id)?.tamam);
  dersImleci = { dersId, i: ilkEksik < 0 ? 0 : ilkEksik };
  git('/ders/' + dersId);
}

function gorDers(dersId) {
  const ders = dersBul(dersId);
  if (!ders) return `<div class="bos"><p>Ders bulunamadı.</p></div>`;
  if (dersImleci.dersId !== dersId) {
    const ilkEksik = ders.adimlar.findIndex((a) => !P.adim(dersId, a.id)?.tamam);
    dersImleci = { dersId, i: ilkEksik < 0 ? 0 : ilkEksik };
  }
  const i = Math.min(dersImleci.i, ders.adimlar.length - 1);
  const a = ders.adimlar[i];
  const tamamSayi = P.tamamAdimSayisi(dersId);
  const yuzde = Math.round((tamamSayi / ders.adimlar.length) * 100);

  return `
    <div class="ustbar">
      <button class="ikon" data-eylem="kursa-don">←</button>
      <h1 style="font-size:1.05rem">${dersSira(dersId) + 1}. ${kacis(ders.ad)}</h1>
      <span class="etiket">${i + 1}/${ders.adimlar.length}</span>
    </div>
    <div class="ilerleme"><i style="width:${yuzde}%"></i></div>

    <div class="adim-gezinme">
      ${ders.adimlar.map((x, j) => {
        const t = P.adim(dersId, x.id)?.tamam;
        return `<button class="nokta ${j === i ? 'simdi' : ''} ${t ? 'bitti' : ''}"
          data-eylem="adim-git" data-i="${j}" title="${kacis(x.baslik)}">${t ? '✓' : j + 1}</button>`;
      }).join('')}
    </div>

    ${adimCiz(ders, a, i)}`;
}

function adimCiz(ders, a, i) {
  const kayit = P.adim(ders.id, a.id);
  const tamam = !!kayit?.tamam;
  const sonAdim = i === ders.adimlar.length - 1;
  const ileriEtiket = sonAdim ? 'Dersi bitir' : 'Devam';

  const baslik = `<h2 style="margin-top:18px">${kacis(a.baslik)}</h2>`;
  const ileri = (etkin = true) => `<button class="birincil tam ${etkin ? '' : 'pasif'}"
    data-eylem="ileri" ${etkin ? '' : 'disabled'}>${ileriEtiket} →</button>`;

  switch (a.tip) {
    case 'anlat':
      return `${baslik}<div class="kart metin">${a.metin}</div>
        <button class="birincil tam" data-eylem="anlat-tamam">${tamam ? ileriEtiket + ' →' : 'Anladım, devam →'}</button>`;

    case 'ornek':
      return `${baslik}
        <div class="kart ornek kotu"><span class="rozet">✕ zayıf</span><p>${kacis(a.kotu)}</p></div>
        <div class="kart ornek iyi"><span class="rozet">✓ güçlü</span><p>${kacis(a.iyi)}</p></div>
        <div class="kart metin"><p class="soluk">${kacis(a.aciklama)}</p></div>
        <button class="birincil tam" data-eylem="anlat-tamam">${tamam ? ileriEtiket + ' →' : 'Anladım, devam →'}</button>`;

    case 'soru': {
      const secilen = secimDurumu[ders.id + a.id];
      return `${baslik}
        <div class="kart metin"><p><strong>${a.soru}</strong></p></div>
        ${a.secenekler.map((s, j) => {
          const bu = secilen === j;
          const sinif = bu ? (s.d ? 'dogru' : 'yanlis') : '';
          return `<button class="secenek ${sinif}" data-eylem="secenek" data-ders="${ders.id}" data-adim="${a.id}" data-j="${j}">
            ${kacis(s.m)}${bu ? `<span class="geri-bildirim">${s.d ? '✓ ' : '✕ '}${kacis(s.aciklama)}</span>` : ''}
          </button>`;
        }).join('')}
        ${tamam ? ileri() : `<p class="soluk" style="text-align:center;margin-top:12px">Doğru cevabı bulunca devam açılır.</p>`}`;
    }

    case 'yaz': {
      const deger = kayit?.deger || '';
      return `${baslik}
        <div class="kart metin">${a.metin}</div>
        <textarea id="yaz-alan" rows="9" placeholder="${kacis(a.ipucu || '')}"
          data-enaz="${a.enAz}">${kacis(deger)}</textarea>
        <p class="soluk" id="yaz-sayac">en az ${a.enAz} karakter</p>
        <button class="birincil tam" data-eylem="yaz-tamam" data-enaz="${a.enAz}">
          ${tamam ? 'Kaydet ve ' + ileriEtiket.toLowerCase() + ' →' : 'Kaydet ve devam →'}</button>`;
    }

    case 'rubrik':
      return `${baslik}
        <p class="soluk">Dürüst işaretle — bu liste senin kendi işini denetlemen için.</p>
        ${a.maddeler.map((m, j) => `<label class="onay">
          <input type="checkbox" class="rubrik-kutu" ${tamam ? 'checked' : ''} data-j="${j}">
          <span>${kacis(m)}</span></label>`).join('')}
        <button class="birincil tam" data-eylem="rubrik-tamam" style="margin-top:10px">
          ${tamam ? ileriEtiket + ' →' : 'Hepsini onaylıyorum →'}</button>`;

    case 'uygula': {
      const sonuc = kontrolSonucu[ders.id + a.id];
      const hedefYol = a.hedef === 'prova' ? '/prova' : '/atolye';
      const hedefAd = a.hedef === 'prova' ? 'Prova' : 'Atölye';
      return `${baslik}
        <div class="kart metin odev"><span class="rozet">🛠 uygulama</span>${a.metin}</div>
        <button class="tam" data-eylem="hedefe-git" data-yol="${hedefYol}" style="margin-bottom:8px">${hedefAd}'ye git →</button>
        ${sonuc ? `<div class="kart ${sonuc.tamam ? 'basarili' : 'uyari'}">
          <p>${sonuc.tamam ? '✓ ' : '⚠ '}${kacis(sonuc.mesaj)}</p></div>` : ''}
        ${tamam ? ileri() : `<button class="birincil tam" data-eylem="kontrol-et">Kontrol et</button>`}`;
    }

    case 'drill': {
      const enIyi = P.enIyiDrill(a.drill);
      const gecti = P.drillGectiMi(a.drill, a.gecmeNotu);
      return `${baslik}
        <div class="kart metin">${a.metin}
          ${a.gecmeNotu > 0 ? `<p class="soluk">Geçme notu: %${a.gecmeNotu}</p>` : ''}
          ${enIyi ? `<p class="soluk">En iyi denemen: <strong>%${enIyi.yuzde}</strong> (${enIyi.dogru}/${enIyi.toplam})</p>` : ''}
        </div>
        <button class="birincil tam" data-eylem="drill-basla" data-drill="${a.drill}"
          data-ders="${ders.id}" data-adim="${a.id}" data-gecme="${a.gecmeNotu}">
          ${enIyi ? 'Yeniden dene' : 'Teste başla'}</button>
        ${(tamam || gecti) ? `<div style="height:8px"></div>${ileri()}` : ''}`;
    }

    default:
      return `${baslik}<p class="soluk">Bilinmeyen adım tipi.</p>${ileri()}`;
  }
}

const secimDurumu = {};      // soru adımlarında son seçim (kalıcı değil)
const kontrolSonucu = {};    // uygula adımlarında son kontrol mesajı

function ileriGit() {
  const ders = dersBul(dersImleci.dersId);
  if (!ders) return;
  if (dersImleci.i >= ders.adimlar.length - 1) {
    const bitti = P.dersTamamMi(ders.id);
    git('/');
    if (bitti) setTimeout(() => dersBittiKutusu(ders), 60);
    return;
  }
  dersImleci.i += 1;
  ciz();
}

function dersBittiKutusu(ders) {
  const siradaki = P.siradakiDers();
  dlg.innerHTML = `<h2 style="margin-top:0;color:var(--metin);text-transform:none;letter-spacing:0">🎉 ${kacis(ders.ad)} tamam</h2>
    <p class="soluk">${siradaki ? `Sıradaki ders açıldı: <strong>${kacis(siradaki.ad)}</strong>`
      : 'Kursun tamamını bitirdin.'}</p>
    <div class="satir" style="margin-top:12px">
      <button style="flex:1" data-kutu="kapat">Kapat</button>
      ${siradaki ? `<button class="birincil" style="flex:1" data-kutu="sonraki" data-id="${siradaki.id}">Sıradaki ders</button>` : ''}
    </div>`;
  dlg.onclick = (e) => {
    const rol = e.target.dataset.kutu;
    if (!rol) return;
    dlg.close();
    if (rol === 'sonraki') dersAc(e.target.dataset.id);
  };
  dlg.showModal();
}

/* ============================================================ TESTLER (drill) */

let drill = null;
let sayacId = null;

function sayacDurdur() { if (sayacId) { clearInterval(sayacId); sayacId = null; } }

const DRILL_ADLARI = {
  'on-test': 'Ön test',
  'son-test': 'Son test',
  'rota-ileri': 'Rota — ileri',
  'rota-ters': 'Rota — tersten',
  'rastgele-durak': 'Rastgele erişim',
};

function drillBasla(drillId, dersId, adimId, gecmeNotu) {
  const kelimeTesti = drillId === 'on-test' || drillId === 'son-test';
  drill = { id: drillId, dersId, adimId, gecmeNotu: Number(gecmeNotu) || 0, faz: 'hazir', sonuc: null };

  if (kelimeTesti) {
    drill.kelimeler = drillId === 'on-test' ? ON_TEST_LISTESI : SON_TEST_LISTESI;
    drill.kalan = 90;
  } else {
    const uygun = S.saraylar().filter((s) => s.duraklar.length >= 5);
    if (!uygun.length) {
      alert('Bu test için en az 5 durağı olan bir saray gerekiyor. Atölye\'de sarayını tamamla.');
      drill = null;
      return;
    }
    drill.sarayId = uygun[0].id;
    drill.uygunSaraylar = uygun.map((s) => ({ id: s.id, ad: s.ad }));
  }
  git('/drill');
}

function drillSorulariKur() {
  const s = S.saray(drill.sarayId);
  const adlar = s.duraklar.map((d) => d.ad);
  if (drill.id === 'rota-ileri') drill.beklenen = adlar;
  else if (drill.id === 'rota-ters') drill.beklenen = [...adlar].reverse();
  else if (drill.id === 'rastgele-durak') {
    const indeksler = adlar.map((_, i) => i);
    for (let i = indeksler.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indeksler[i], indeksler[j]] = [indeksler[j], indeksler[i]];
    }
    drill.sorular = indeksler.slice(0, Math.min(5, adlar.length)).map((i) => ({ sira: i + 1, cevap: adlar[i] }));
  }
}

function gorDrill() {
  if (!drill) return `<div class="bos"><span class="g">🧪</span><p>Aktif test yok.</p>
    <button class="birincil" data-eylem="kursa-don">Kursa dön</button></div>`;

  const ad = DRILL_ADLARI[drill.id] || 'Test';
  const ust = `<div class="ustbar">
    <button class="ikon" data-eylem="drill-cik">✕</button>
    <h1 style="font-size:1rem">${ad}</h1></div>`;

  const kelimeTesti = drill.id === 'on-test' || drill.id === 'son-test';

  /* --- hazırlık --- */
  if (drill.faz === 'hazir') {
    if (kelimeTesti) {
      return `${ust}
        <div class="kart metin">
          <p><strong>15 terim</strong> göreceksin. Çalışma süresi <strong>90 saniye</strong>.</p>
          <p>Süre bitince terimler kaybolacak ve hatırladıklarını yazacaksın. Sıra önemli değil.</p>
          ${drill.id === 'son-test' ? `<p class="soluk">Bu kez sarayını kullan. Hangi sarayı kullanacağına şimdi karar ver.</p>`
            : `<p class="soluk">Hiçbir teknik kullanma — bu ham ölçüm.</p>`}
        </div>
        <button class="birincil tam" data-eylem="drill-calis">Süreyi başlat</button>`;
    }
    return `${ust}
      <div class="kart metin">
        ${drill.id === 'rota-ileri' ? '<p>Durak adlarını <strong>baştan sona</strong>, rota sırasıyla yaz.</p>' : ''}
        ${drill.id === 'rota-ters' ? '<p>Durak adlarını <strong>sondan başa</strong> yaz.</p>' : ''}
        ${drill.id === 'rastgele-durak' ? '<p>Sorulan sıradaki durağın adını yaz.</p>' : ''}
        <p class="soluk">Atölyeye bakmadan yap; amaç rotanın ne kadar oturduğunu ölçmek.</p>
      </div>
      ${drill.uygunSaraylar.length > 1 ? `<label>Saray</label>
        <select id="drill-saray">${drill.uygunSaraylar.map((s) =>
          `<option value="${s.id}" ${s.id === drill.sarayId ? 'selected' : ''}>${kacis(s.ad)}</option>`).join('')}</select>` : ''}
      <button class="birincil tam" data-eylem="drill-soru">Teste başla</button>`;
  }

  /* --- kelime çalışma --- */
  if (drill.faz === 'calisma') {
    return `${ust}
      <div class="sayac" id="sayac">${drill.kalan}</div>
      <div class="kelime-izgara">
        ${drill.kelimeler.map((k, i) => `<div class="kelime"><span>${i + 1}</span>${kacis(k)}</div>`).join('')}
      </div>
      <button class="tam" data-eylem="drill-hatirla" style="margin-top:14px">Hazırım, teste geç</button>`;
  }

  /* --- cevaplama --- */
  if (drill.faz === 'cevap') {
    if (kelimeTesti) {
      return `${ust}
        <div class="kart metin"><p>Hatırladığın terimleri yaz — her satıra bir tane. Sıra önemli değil.</p></div>
        <textarea id="drill-cevap" rows="12" placeholder="mitokondri&#10;entropi&#10;..."></textarea>
        <button class="birincil tam" data-eylem="drill-puanla">Bitir ve puanla</button>`;
    }
    if (drill.id === 'rastgele-durak') {
      return `${ust}
        <div class="kart metin"><p>${kacis(S.saray(drill.sarayId).ad)} — sorulan durakları yaz.</p></div>
        ${drill.sorular.map((s, j) => `<label>${s.sira}. durak hangisiydi?</label>
          <input class="rastgele-cevap" data-j="${j}" placeholder="durak adı">`).join('')}
        <button class="birincil tam" data-eylem="drill-puanla">Bitir ve puanla</button>`;
    }
    return `${ust}
      <div class="kart metin"><p>${kacis(S.saray(drill.sarayId).ad)} — ${drill.beklenen.length} durak.
        ${drill.id === 'rota-ters' ? 'Sondan başa' : 'Baştan sona'}, her satıra bir durak.</p></div>
      <textarea id="drill-cevap" rows="12" placeholder="1. durak&#10;2. durak&#10;..."></textarea>
      <button class="birincil tam" data-eylem="drill-puanla">Bitir ve puanla</button>`;
  }

  /* --- sonuç --- */
  const r = drill.sonuc;
  const gecti = r.yuzde >= drill.gecmeNotu;
  const notlu = drill.gecmeNotu > 0;
  const onT = drill.id === 'son-test' ? P.enIyiDrill('on-test') : null;

  return `${ust}
    <div class="kart sonuc ${notlu ? (gecti ? 'basarili' : 'uyari') : ''}">
      <div class="buyuk-skor">%${r.yuzde}</div>
      <p style="text-align:center">${r.dogru}/${r.toplam} doğru</p>
      ${notlu ? `<p style="text-align:center" class="soluk">${gecti
        ? `✓ Geçtin (gereken %${drill.gecmeNotu})`
        : `Geçme notu %${drill.gecmeNotu}. Rotayı biraz daha yürü ve tekrar dene.`}</p>` : ''}
      ${onT ? `<p style="text-align:center">Ön testte <strong>${onT.dogru}</strong> → şimdi
        <strong>${r.dogru}</strong> (fark ${r.dogru - onT.dogru >= 0 ? '+' : ''}${r.dogru - onT.dogru} terim)</p>
        <p class="soluk" style="text-align:center">İki listenin güçlüğü eşitlenmiş değil; bu fark
        kendi kaydın, kursun etkisinin ölçümü değil.</p>` : ''}
    </div>

    <h2>Döküm</h2>
    ${r.detay.map((d, j) => `<div class="dokum ${d.dogru ? 'ok' : 'hata'}">
      <span class="sira">${j + 1}</span>
      <div style="flex:1;min-width:0">
        <strong>${kacis(d.beklenen)}</strong>
        ${!d.dogru && d.verilen ? `<br><span class="soluk">yazdığın: ${kacis(d.verilen)}${d.yerBaska ? ' — doğru durak, yanlış sıra' : ''}</span>` : ''}
        ${!d.dogru && !d.verilen ? `<br><span class="soluk">boş</span>` : ''}
      </div>
      <span>${d.dogru ? '✓' : '✕'}</span>
    </div>`).join('')}
    ${r.fazla?.length ? `<p class="soluk" style="margin-top:10px">Listede olmayanlar: ${r.fazla.map(kacis).join(', ')}</p>` : ''}

    <div style="height:14px"></div>
    ${gecti && drill.dersId ? `<button class="birincil tam" data-eylem="drill-derse-don">Derse dön →</button>
      <div style="height:8px"></div><button class="tam" data-eylem="drill-tekrar">Yeniden dene</button>`
      : `<button class="birincil tam" data-eylem="drill-tekrar">Yeniden dene</button>
        <div style="height:8px"></div>
        <button class="tam" data-eylem="drill-cik">${drill.dersId ? 'Derse dön' : 'Çık'}</button>`}`;
}

function drillPuanla() {
  const kelimeTesti = drill.id === 'on-test' || drill.id === 'son-test';
  let sonuc;

  if (kelimeTesti) {
    const verilen = satirlara(document.getElementById('drill-cevap').value);
    sonuc = kumePuan(drill.kelimeler, verilen);
  } else if (drill.id === 'rastgele-durak') {
    const girisler = [...document.querySelectorAll('.rastgele-cevap')];
    const detay = drill.sorular.map((s, j) => {
      const v = girisler[j]?.value.trim() || '';
      return { beklenen: `${s.sira}. durak: ${s.cevap}`, verilen: v, dogru: !!v && esit(s.cevap, v) };
    });
    const dogru = detay.filter((d) => d.dogru).length;
    sonuc = { dogru, toplam: detay.length, yuzde: Math.round((dogru / detay.length) * 100), detay };
  } else {
    const verilen = satirlara(document.getElementById('drill-cevap').value);
    sonuc = siraliPuan(drill.beklenen, verilen);
  }

  drill.sonuc = sonuc;
  drill.faz = 'sonuc';
  P.drillKaydet(drill.id, { yuzde: sonuc.yuzde, dogru: sonuc.dogru, toplam: sonuc.toplam });

  // Geçtiyse ilgili ders adımını tamamla.
  if (drill.dersId && drill.adimId && sonuc.yuzde >= drill.gecmeNotu) {
    P.adimTamamla(drill.dersId, drill.adimId, { yuzde: sonuc.yuzde });
  }
  ciz();
}

/* ============================================================ ATÖLYE (saray çalışma alanı) */

function gorAtolye() {
  const liste = S.saraylar();
  return `
    <div class="ustbar"><h1>Atölye</h1>
      <button class="ikon birincil" data-eylem="saray-yeni" title="Yeni saray">+</button></div>
    <p class="soluk">Kursun alıştırmalarını burada yapıyorsun. Dersler buradaki işi kontrol ediyor.</p>
    ${liste.length ? liste.map((s) => {
      const si = S.istatistik(s.id);
      return `<div class="kart tiklanir" data-eylem="saray-ac" data-id="${s.id}">
        <div class="kart-baslik"><strong>${kacis(s.ad)}</strong>
          <span class="etiket">${s.duraklar.length} durak</span></div>
        ${s.aciklama ? `<p class="soluk">${kacis(s.aciklama)}</p>` : ''}
        <p class="soluk">${si.toplam} imge · ${si.vadesiGelen} tekrar bekliyor</p>
      </div>`;
    }).join('') : `<div class="bos"><span class="g">🏛️</span><p>Henüz saray yok.</p>
      <p class="soluk">3. derste ilk sarayını kuracaksın.</p></div>`}`;
}

function gorSaray(id) {
  const s = S.saray(id);
  if (!s) return `<div class="bos"><p>Saray bulunamadı.</p></div>`;
  const ist = S.istatistik(id);

  return `
    <div class="ustbar">
      <button class="ikon" data-eylem="geri">←</button>
      <h1>${kacis(s.ad)}</h1>
      <button class="ikon" data-eylem="saray-duzenle" data-id="${s.id}">✎</button>
    </div>
    ${s.aciklama ? `<p class="soluk">${kacis(s.aciklama)}</p>` : ''}
    <div class="istatistikler">
      <div class="istatistik"><b>${s.duraklar.length}</b><span>durak</span></div>
      <div class="istatistik"><b>${ist.toplam}</b><span>imge</span></div>
      <div class="istatistik"><b>${ist.vadesiGelen}</b><span>tekrar</span></div>
      <div class="istatistik"><b>${ist.olgun}</b><span>olgun</span></div>
    </div>

    <div class="satir sar" style="margin:12px 0">
      ${ist.vadesiGelen ? `<button class="birincil" data-eylem="prova" data-mod="vade" data-saray="${s.id}">Tekrar (${ist.vadesiGelen})</button>` : ''}
      ${ist.toplam ? `<button data-eylem="prova" data-mod="rota" data-saray="${s.id}">Rota provası</button>
      <button data-eylem="prova" data-mod="ters" data-saray="${s.id}">Tersten</button>` : ''}
    </div>

    <h2>Rota</h2>
    ${s.duraklar.length ? s.duraklar.map((d, i) => {
      const kalabalik = d.imgeler.length > 2;
      return `<div class="kart">
        <div class="kart-baslik">
          <span class="sira">${i + 1}</span>
          <strong data-eylem="durak-ac" data-saray="${s.id}" data-durak="${d.id}">${kacis(d.ad)}</strong>
          <span class="etiket ${kalabalik ? 'zayif' : ''}">${d.imgeler.length} imge</span>
        </div>
        ${d.ipucu ? `<p class="soluk">${kacis(d.ipucu)}</p>` : ''}
        ${kalabalik ? `<p class="soluk" style="color:#ff8a8f">Kalabalık durak — bir durağa 1-2 imge kuralı hatırlamayı kolaylaştırır.</p>` : ''}
        <div class="satir" style="margin-top:8px">
          <button class="ufak" data-eylem="imge-yeni" data-saray="${s.id}" data-durak="${d.id}">+ İmge</button>
          <button class="ufak ikon" data-eylem="durak-yukari" data-saray="${s.id}" data-durak="${d.id}">↑</button>
          <button class="ufak ikon" data-eylem="durak-asagi" data-saray="${s.id}" data-durak="${d.id}">↓</button>
          <button class="ufak" data-eylem="durak-duzenle" data-saray="${s.id}" data-durak="${d.id}">✎</button>
        </div>
      </div>`;
    }).join('') : `<div class="bos"><span class="g">📍</span><p>Durak yok.</p>
      <p class="soluk">Mekanda her zaman aynı yönde ilerle.</p></div>`}

    <button class="birincil tam yapistir" data-eylem="durak-yeni" data-saray="${s.id}">+ Durak ekle</button>
    <div style="height:10px"></div>
    <button class="tam tehlike" data-eylem="saray-sil" data-id="${s.id}">Sarayı sil</button>`;
}

function gorDurak(sarayId, durakId) {
  const s = S.saray(sarayId);
  const d = S.durak(sarayId, durakId);
  if (!s || !d) return `<div class="bos"><p>Durak bulunamadı.</p></div>`;
  const sira = s.duraklar.findIndex((x) => x.id === durakId) + 1;

  return `
    <div class="ustbar">
      <button class="ikon" data-eylem="geri">←</button>
      <h1>${sira}. ${kacis(d.ad)}</h1>
      <button class="ikon" data-eylem="durak-duzenle" data-saray="${s.id}" data-durak="${d.id}">✎</button>
    </div>
    <p class="soluk">${kacis(s.ad)}${d.ipucu ? ` · ${kacis(d.ipucu)}` : ''}</p>

    <h2>Buradaki imgeler</h2>
    ${d.imgeler.length ? d.imgeler.map((im) => {
      const z = zayiflik(im.srs);
      const kalanGun = Math.ceil((im.srs.vade - bugun()) / GUN);
      return `<div class="kart">
        <div class="kart-baslik">
          <strong>${kacis(im.terim)}</strong>
          ${kalanGun <= 0 ? `<span class="etiket vade">tekrar</span>` : `<span class="etiket">${kalanGun} gün</span>`}
        </div>
        <p>${nl2br(im.icerik)}</p>
        ${im.tasvir ? `<p class="soluk" style="font-style:italic;color:var(--mor-soluk)">🖼️ ${nl2br(im.tasvir)}</p>` : ''}
        ${im.duyu ? `<p class="soluk">👂 ${nl2br(im.duyu)}</p>` : ''}
        <div class="satir" style="margin-top:8px">
          <span class="etiket ${z > 0.45 ? 'zayif' : 'olgun'}">sağlamlık %${Math.round((1 - z) * 100)}</span>
          <div style="flex:1"></div>
          <button class="ufak" data-eylem="imge-duzenle" data-saray="${s.id}" data-durak="${d.id}" data-imge="${im.id}">✎</button>
          <button class="ufak tehlike" data-eylem="imge-sil" data-saray="${s.id}" data-durak="${d.id}" data-imge="${im.id}">Sil</button>
        </div>
      </div>`;
    }).join('') : `<div class="bos"><span class="g">🖼️</span><p>Bu durakta imge yok.</p></div>`}

    <button class="birincil tam" data-eylem="imge-yeni" data-saray="${s.id}" data-durak="${d.id}">+ İmge ekle</button>
    <div style="height:10px"></div>
    <button class="tam tehlike" data-eylem="durak-sil" data-saray="${s.id}" data-durak="${d.id}">Durağı sil</button>`;
}

/* ============================================================ PROVA */

let prova = null;

function provaBaslat(mod, sarayId) {
  let liste = mod === 'vade' ? S.vadesiGelenler(sarayId || null) : S.tumImgeler(sarayId || null);
  if (mod === 'ters') liste = [...liste].reverse();
  if (mod === 'vade') liste = [...liste].sort((a, b) => a.sira - b.sira);
  if (!liste.length) { alert('Prova için imge yok. Atölye\'de imge yerleştir.'); return; }

  prova = {
    mod, kuyruk: liste.map((x) => ({ s: x.saray.id, d: x.durak.id, i: x.imge.id })),
    toplam: liste.length, bitti: 0, acik: false, tamamlandi: false,
  };
  // Zaten /prova üzerindeysek hash değişmediği için hashchange tetiklenmez; elle çiz.
  if ((rota().parca[0] || '') === 'prova') ciz();
  else git('/prova');
}

function gorProva() {
  if (!prova) {
    const ist = S.istatistik();
    const saraylar = S.saraylar().filter((s) => S.tumImgeler(s.id).length);
    if (!saraylar.length) {
      return `<h1>Prova</h1><div class="bos"><span class="g">🚶</span>
        <p>Prova edilecek imge yok.</p>
        <p class="soluk">7. derste ilk imgelerini yerleştireceksin.</p></div>`;
    }
    return `<h1>Prova</h1>
      <p class="soluk">Rotayı yürü, sahneyi gör, içeriği çöz. Sonra dürüst not ver.</p>
      ${ist.vadesiGelen ? `<button class="birincil tam" data-eylem="prova" data-mod="vade" style="margin:12px 0">
        Vadesi gelenler (${ist.vadesiGelen})</button>` : `<p class="soluk" style="margin:12px 0">Bugün vadesi gelen imge yok.</p>`}
      <h2>Saray seç</h2>
      ${saraylar.map((s) => {
        const si = S.istatistik(s.id);
        return `<div class="kart">
          <div class="kart-baslik"><strong>${kacis(s.ad)}</strong>
            <span class="etiket">${si.toplam} imge</span></div>
          <div class="satir sar" style="margin-top:8px">
            <button class="ufak" data-eylem="prova" data-mod="rota" data-saray="${s.id}">Rota provası</button>
            <button class="ufak" data-eylem="prova" data-mod="ters" data-saray="${s.id}">Tersten</button>
            ${si.vadesiGelen ? `<button class="ufak" data-eylem="prova" data-mod="vade" data-saray="${s.id}">Tekrar (${si.vadesiGelen})</button>` : ''}
          </div></div>`;
      }).join('')}`;
  }

  // Bitiş ekranı: durumu burada TEMİZLEMİYORUZ. Çizim fonksiyonunun yan etkisi olursa,
  // notVer içinde store aboneliğinin tetiklediği ara çizim prova nesnesini düşürüyor.
  if (prova.tamamlandi || !prova.kuyruk.length) {
    return `<div class="bos"><span class="g">✅</span><p><strong>Prova tamam.</strong></p>
      <p class="soluk">${prova.bitti} imge gözden geçirildi.</p></div>
      <button class="birincil tam" data-eylem="prova-bitir">Bitir</button>`;
  }

  const ref = prova.kuyruk[0];
  const s = S.saray(ref.s);
  const d = S.durak(ref.s, ref.d);
  const im = d?.imgeler.find((x) => x.id === ref.i);
  if (!im) { prova.kuyruk.shift(); return gorProva(); }
  const sira = s.duraklar.findIndex((x) => x.id === d.id) + 1;
  const yuzde = Math.round((prova.bitti / (prova.bitti + prova.kuyruk.length)) * 100);

  return `
    <div class="ustbar">
      <button class="ikon" data-eylem="prova-bitir">✕</button>
      <h1 style="font-size:1rem;color:var(--soluk)">${kacis(s.ad)} · ${prova.bitti + 1}/${prova.toplam}</h1>
    </div>
    <div class="ilerleme"><i style="width:${yuzde}%"></i></div>

    <div class="prova-sahne">
      <div class="prova-durak">${sira}. durak — ${kacis(d.ad)}</div>
      ${d.ipucu ? `<p class="soluk">${kacis(d.ipucu)}</p>` : ''}
      <div class="prova-terim">${kacis(im.terim)}</div>
      ${prova.acik ? `
        <div class="prova-cevap">
          <p>${nl2br(im.icerik)}</p>
          ${im.tasvir ? `<p class="tasvir">🖼️ ${nl2br(im.tasvir)}</p>` : ''}
          ${im.duyu ? `<p class="soluk">👂 ${nl2br(im.duyu)}</p>` : ''}
        </div>` : `<p class="soluk">Durağa git, sahneyi gör, içeriği kendine söyle.</p>`}
    </div>

    ${prova.acik ? `
      <div class="notlar">
        <button class="g0" data-eylem="not" data-g="0">Hatırlamadım</button>
        <button class="g1" data-eylem="not" data-g="1">Zor</button>
        <button class="g2" data-eylem="not" data-g="2">Tamam</button>
        <button class="g3" data-eylem="not" data-g="3">Kolay</button>
      </div>`
      : `<button class="birincil tam" data-eylem="prova-goster">Cevabı göster</button>`}`;
}

function notVer(grade) {
  if (!prova?.kuyruk.length || prova.tamamlandi) return;
  const ref = prova.kuyruk.shift();

  // Kuyruk durumu store'a dokunmadan ÖNCE tutarlı hale getirilir: imgeGuncelle
  // abonelere senkron haber verip ciz() çağırıyor, o çizim tutarlı durumu görmeli.
  if (grade === GRADE.AGAIN) prova.kuyruk.push(ref); else prova.bitti += 1;
  prova.acik = false;
  if (!prova.kuyruk.length) prova.tamamlandi = true;

  const im = S.durak(ref.s, ref.d)?.imgeler.find((x) => x.id === ref.i);
  if (im) S.imgeGuncelle(ref.s, ref.d, ref.i, { srs: planla(im.srs, grade) });
  ciz();
}

/* ============================================================ RAPOR */

function gorRapor() {
  const gi = P.genelIlerleme();
  const ist = S.istatistik();
  const zayif = S.zayifNoktalar(null, 15);
  const onT = P.enIyiDrill('on-test');
  const sonT = P.enIyiDrill('son-test');
  const rotaTestleri = ['rota-ileri', 'rota-ters', 'rastgele-durak'];

  return `
    <h1>Rapor</h1>

    <h2>Kurs</h2>
    <div class="kart">
      <div class="kart-baslik"><strong>${gi.tamam}/${gi.toplam} ders</strong>
        <span class="etiket ${gi.yuzde === 100 ? 'olgun' : ''}">%${gi.yuzde}</span></div>
      <div class="ilerleme"><i style="width:${gi.yuzde}%"></i></div>
    </div>

    <h2>Ölçüm</h2>
    ${onT ? `<div class="kart">
      <div class="satir" style="justify-content:space-around;text-align:center">
        <div><div class="buyuk-skor" style="font-size:2rem">${onT.dogru}</div><span class="soluk">ön test</span></div>
        <div style="font-size:1.4rem;color:var(--soluk)">→</div>
        <div><div class="buyuk-skor" style="font-size:2rem;color:${sonT ? 'var(--yesil)' : 'var(--soluk)'}">${sonT ? sonT.dogru : '—'}</div><span class="soluk">son test</span></div>
      </div>
      ${sonT ? `<p style="text-align:center;margin-top:8px">Fark: <strong>${sonT.dogru - onT.dogru >= 0 ? '+' : ''}${sonT.dogru - onT.dogru}</strong> terim</p>
      <p class="soluk" style="text-align:center">Listeler farklı ve güçlükleri eşitlenmiş değil.</p>` : ''}
    </div>` : `<p class="soluk">Ön test henüz yapılmadı (1. ders).</p>`}

    <h2>Rota testleri</h2>
    ${rotaTestleri.some((t) => P.enIyiDrill(t)) ? rotaTestleri.map((t) => {
      const e = P.enIyiDrill(t);
      const n = P.drillGecmisi(t).length;
      return `<div class="kart">
        <div class="kart-baslik"><strong>${DRILL_ADLARI[t]}</strong>
          <span class="etiket ${e && e.yuzde >= 80 ? 'olgun' : e ? 'vade' : ''}">${e ? '%' + e.yuzde : '—'}</span></div>
        <p class="soluk">${n ? `${n} deneme` : 'hiç denenmedi'}</p>
      </div>`;
    }).join('') : `<p class="soluk">Rota testleri 4. ve 5. derslerde.</p>`}

    <h2>Saraylar</h2>
    ${S.saraylar().length ? S.saraylar().map((s) => {
      const imgeler = S.tumImgeler(s.id);
      const ort = imgeler.length ? imgeler.reduce((a, x) => a + (1 - zayiflik(x.imge.srs)), 0) / imgeler.length : 0;
      const kalabalik = s.duraklar.filter((d) => d.imgeler.length > 2).length;
      return `<div class="kart">
        <div class="kart-baslik"><strong>${kacis(s.ad)}</strong>
          <span class="etiket ${ort > 0.6 ? 'olgun' : 'zayif'}">%${Math.round(ort * 100)}</span></div>
        <div class="ilerleme"><i style="width:${Math.round(ort * 100)}%"></i></div>
        <p class="soluk">${s.duraklar.length} durak · ${imgeler.length} imge${kalabalik ? ` · ${kalabalik} kalabalık durak` : ''}</p>
      </div>`;
    }).join('') : `<p class="soluk">Saray yok.</p>`}

    ${ist.toplam ? `<h2>En zayıf imgeler</h2>
    <p class="soluk">Provalarda ısrarla gelmeyen imgeler. Birkaç provaya bakıp karar ver:
    tekrarı sürdürmek mi, imgeyi yeniden kurmak mı?</p>
    ${zayif.length ? zayif.map((z) => `<div class="kart tiklanir" data-eylem="durak-ac" data-saray="${z.saray.id}" data-durak="${z.durak.id}">
      <div class="kart-baslik"><strong>${kacis(z.imge.terim)}</strong>
        <span class="etiket zayif">%${Math.round(z.skor * 100)} zayıf</span></div>
      <p class="soluk">${kacis(z.saray.ad)} · ${z.sira}. durak: ${kacis(z.durak.ad)}</p>
    </div>`).join('') : `<div class="bos"><p>Zayıf imge yok. 👏</p></div>`}` : ''}`;
}

/* ============================================================ AYARLAR */

function gorAyarlar() {
  return `
    <h1>Ayarlar</h1>

    <h2>Kurs</h2>
    <label class="onay">
      <input type="checkbox" id="kilitsiz" ${P.kilitsizMi() ? 'checked' : ''}>
      <span>Ders kilitlerini kaldır — sıradan bağımsız gezinebilirim</span>
    </label>
    <p class="soluk">Kilitler açıkken her ders öncekini tamamlamanı bekler. Kurs bu sırayla tasarlandı;
    atlamak öğrenmeyi zayıflatır.</p>
    <button class="tam" data-eylem="kilit-kaydet">Kaydet</button>

    <h2>Yedek</h2>
    <p class="soluk">Veriler yalnızca bu tarayıcıda durur. Tarayıcı verisini temizlemek
    hem sarayları hem kurs ilerlemesini siler.</p>
    <button class="tam" data-eylem="yedek-al" style="margin-bottom:8px">Yedeği indir (JSON)</button>
    <button class="tam" data-eylem="yedek-yukle">Yedekten geri yükle</button>

    <h2>Sıfırlama</h2>
    <button class="tam tehlike" data-eylem="kurs-sifirla">Kurs ilerlemesini sıfırla</button>
    <p class="soluk">Saraylar silinmez, sadece ders/test kayıtları sıfırlanır.</p>

    <h2>Hakkında</h2>
    <p class="soluk">Hafıza Sarayı Kursu · 12 ders · çevrimdışı çalışır</p>`;
}

/* ============================================================ FORMLAR */

function form(baslik, alanlar, onay) {
  dlg.innerHTML = `<h2 style="margin-top:0;color:var(--metin);text-transform:none;letter-spacing:0">${kacis(baslik)}</h2>
    ${alanlar.map((a) => `
      <label>${kacis(a.etiket)}</label>
      ${a.cok
        ? `<textarea id="f-${a.ad}" placeholder="${kacis(a.ipucu || '')}">${kacis(a.deger || '')}</textarea>`
        : `<input id="f-${a.ad}" placeholder="${kacis(a.ipucu || '')}" value="${kacis(a.deger || '')}">`}`).join('')}
    <div class="satir" style="margin-top:6px">
      <button style="flex:1" data-kutu="iptal">İptal</button>
      <button class="birincil" style="flex:1" data-kutu="tamam">Kaydet</button>
    </div>`;
  dlg.showModal();
  dlg.querySelector('input, textarea')?.focus();

  dlg.onclick = (e) => {
    const rol = e.target.dataset.kutu;
    if (!rol) return;
    if (rol === 'iptal') { dlg.close(); return; }
    const degerler = {};
    for (const a of alanlar) degerler[a.ad] = dlg.querySelector(`#f-${a.ad}`).value.trim();
    if (alanlar[0].zorunlu !== false && !degerler[alanlar[0].ad]) {
      dlg.querySelector(`#f-${alanlar[0].ad}`).focus();
      return;
    }
    dlg.close();
    onay(degerler);
  };
}

/* ============================================================ EYLEMLER */

const eylemler = {
  geri: () => history.back(),
  'kursa-don': () => git('/'),
  'hedefe-git': (el) => git(el.dataset.yol),

  /* --- ders oynatıcı --- */
  'ders-ac': (el) => dersAc(el.dataset.id),
  'adim-git': (el) => { dersImleci.i = Number(el.dataset.i); ciz(); },
  ileri: () => ileriGit(),

  'anlat-tamam': () => {
    const ders = dersBul(dersImleci.dersId);
    const a = ders.adimlar[dersImleci.i];
    if (!P.adim(ders.id, a.id)?.tamam) P.adimTamamla(ders.id, a.id);
    ileriGit();
  },

  secenek: (el) => {
    const { ders: dersId, adim: adimId, j } = el.dataset;
    const ders = dersBul(dersId);
    const a = ders.adimlar.find((x) => x.id === adimId);
    const secim = Number(j);
    secimDurumu[dersId + adimId] = secim;
    if (a.secenekler[secim].d && !P.adim(dersId, adimId)?.tamam) P.adimTamamla(dersId, adimId, { secim });
    ciz();
  },

  'yaz-tamam': (el) => {
    const alan = document.getElementById('yaz-alan');
    const enAz = Number(el.dataset.enaz);
    const deger = alan.value.trim();
    const ders = dersBul(dersImleci.dersId);
    const a = ders.adimlar[dersImleci.i];
    if (deger.length < enAz) {
      P.adimTaslak(ders.id, a.id, deger);
      alert(`Biraz daha yaz: ${deger.length}/${enAz} karakter. Taslağın kaydedildi.`);
      return;
    }
    P.adimTamamla(ders.id, a.id, deger);
    ileriGit();
  },

  'rubrik-tamam': () => {
    const kutular = [...document.querySelectorAll('.rubrik-kutu')];
    const ders = dersBul(dersImleci.dersId);
    const a = ders.adimlar[dersImleci.i];
    if (!kutular.every((k) => k.checked)) {
      alert('Tüm maddeleri işaretlemen gerekiyor. İşaretleyemediğin madde varsa o kısmı düzeltip geri dön.');
      return;
    }
    if (!P.adim(ders.id, a.id)?.tamam) P.adimTamamla(ders.id, a.id);
    ileriGit();
  },

  'kontrol-et': () => {
    const ders = dersBul(dersImleci.dersId);
    const a = ders.adimlar[dersImleci.i];
    const sonuc = a.kontrol(S);
    kontrolSonucu[ders.id + a.id] = sonuc;
    if (sonuc.tamam && !P.adim(ders.id, a.id)?.tamam) P.adimTamamla(ders.id, a.id);
    ciz();
  },

  /* --- testler --- */
  'drill-basla': (el) => drillBasla(el.dataset.drill, el.dataset.ders, el.dataset.adim, el.dataset.gecme),

  'drill-calis': () => {
    drill.faz = 'calisma';
    ciz();
    sayacDurdur();
    sayacId = setInterval(() => {
      drill.kalan -= 1;
      const e = document.getElementById('sayac');
      if (e) e.textContent = drill.kalan;
      if (drill.kalan <= 0) { sayacDurdur(); drill.faz = 'cevap'; ciz(); }
    }, 1000);
  },

  'drill-hatirla': () => { sayacDurdur(); drill.faz = 'cevap'; ciz(); },

  'drill-soru': () => {
    const sec = document.getElementById('drill-saray');
    if (sec) drill.sarayId = sec.value;
    drillSorulariKur();
    drill.faz = 'cevap';
    ciz();
  },

  'drill-puanla': () => drillPuanla(),

  'drill-tekrar': () => {
    const { id, dersId, adimId, gecmeNotu } = drill;
    sayacDurdur();
    drillBasla(id, dersId, adimId, gecmeNotu);
    ciz();
  },

  'drill-derse-don': () => {
    const d = drill;
    sayacDurdur();
    drill = null;
    if (d.dersId) { dersImleci = { dersId: d.dersId, i: dersBul(d.dersId).adimlar.findIndex((x) => x.id === d.adimId) }; git('/ders/' + d.dersId); }
    else git('/');
  },

  'drill-cik': () => {
    const d = drill;
    sayacDurdur();
    drill = null;
    if (d?.dersId) { dersImleci = { dersId: d.dersId, i: dersBul(d.dersId).adimlar.findIndex((x) => x.id === d.adimId) }; git('/ders/' + d.dersId); }
    else git('/');
  },

  /* --- atölye --- */
  'saray-yeni': () => form('Yeni saray', [
    { ad: 'ad', etiket: 'Saray adı', ipucu: 'Örn. Çocukluk evim' },
    { ad: 'aciklama', etiket: 'Rota notu: nereden başlıyor, hangi yönde gidiyor?', ipucu: 'Giriş kapısından başlayıp saat yönünde', cok: true },
  ], (v) => { const s = S.sarayEkle({ ad: v.ad, aciklama: v.aciklama }); git('/saray/' + s.id); }),

  'saray-ac': (el) => git('/saray/' + el.dataset.id),

  'saray-duzenle': (el) => {
    const s = S.saray(el.dataset.id);
    form('Sarayı düzenle', [
      { ad: 'ad', etiket: 'Saray adı', deger: s.ad },
      { ad: 'aciklama', etiket: 'Rota notu', deger: s.aciklama, cok: true },
    ], (v) => S.sarayGuncelle(s.id, { ad: v.ad, aciklama: v.aciklama }));
  },

  'saray-sil': (el) => {
    const s = S.saray(el.dataset.id);
    if (confirm(`"${s.ad}" sarayı ve içindeki her şey silinecek. Emin misin?`)) { S.saraySil(s.id); git('/atolye'); }
  },

  'durak-yeni': (el) => {
    const sid = el.dataset.saray;
    form('Yeni durak', [
      { ad: 'ad', etiket: 'Durak adı', ipucu: 'Örn. Salondaki şömine' },
      { ad: 'ipucu', etiket: 'Mekan ipucu: orada ne görüyorsun?', ipucu: 'Solda ayakkabılık, üstünde oval ayna', cok: true },
    ], (v) => S.durakEkle(sid, { ad: v.ad, ipucu: v.ipucu }));
  },

  'durak-ac': (el) => git(`/saray/${el.dataset.saray}/durak/${el.dataset.durak}`),
  'durak-yukari': (el) => S.durakTasi(el.dataset.saray, el.dataset.durak, -1),
  'durak-asagi': (el) => S.durakTasi(el.dataset.saray, el.dataset.durak, 1),

  'durak-duzenle': (el) => {
    const d = S.durak(el.dataset.saray, el.dataset.durak);
    form('Durağı düzenle', [
      { ad: 'ad', etiket: 'Durak adı', deger: d.ad },
      { ad: 'ipucu', etiket: 'Mekan ipucu', deger: d.ipucu, cok: true },
    ], (v) => S.durakGuncelle(el.dataset.saray, el.dataset.durak, { ad: v.ad, ipucu: v.ipucu }));
  },

  'durak-sil': (el) => {
    const d = S.durak(el.dataset.saray, el.dataset.durak);
    if (confirm(`"${d.ad}" durağı ve üzerindeki ${d.imgeler.length} imge silinecek.`)) {
      S.durakSil(el.dataset.saray, el.dataset.durak);
      git('/saray/' + el.dataset.saray);
    }
  },

  'imge-yeni': (el) => {
    const { saray: sid, durak: did } = el.dataset;
    form('Yeni imge', [
      { ad: 'terim', etiket: 'Terim / soru', ipucu: 'Örn. Glikoliz' },
      { ad: 'icerik', etiket: 'İçerik / cevap (anahtar kelimelere indir)', ipucu: 'şeker · 10 adım · ATP', cok: true },
      { ad: 'tasvir', etiket: 'İmge tasviri — durakla nasıl etkileşiyor?', ipucu: 'Tezgahın üstünde dev şeker küpü 10 parçaya bölünüp zıplıyor', cok: true },
      { ad: 'duyu', etiket: 'Ses / koku / doku', ipucu: 'Çatırdama, yanık karamel kokusu', cok: true },
    ], (v) => { S.imgeEkle(sid, did, v); git(`/saray/${sid}/durak/${did}`); });
  },

  'imge-duzenle': (el) => {
    const { saray: sid, durak: did, imge: iid } = el.dataset;
    const im = S.durak(sid, did).imgeler.find((x) => x.id === iid);
    form('İmgeyi düzenle', [
      { ad: 'terim', etiket: 'Terim / soru', deger: im.terim },
      { ad: 'icerik', etiket: 'İçerik / cevap', deger: im.icerik, cok: true },
      { ad: 'tasvir', etiket: 'İmge tasviri', deger: im.tasvir, cok: true },
      { ad: 'duyu', etiket: 'Ses / koku / doku', deger: im.duyu, cok: true },
    ], (v) => S.imgeGuncelle(sid, did, iid, v));
  },

  'imge-sil': (el) => {
    const { saray: sid, durak: did, imge: iid } = el.dataset;
    if (confirm('Bu imge silinecek.')) S.imgeSil(sid, did, iid);
  },

  /* --- prova --- */
  prova: (el) => provaBaslat(el.dataset.mod, el.dataset.saray),
  'prova-goster': () => { prova.acik = true; ciz(); },
  'prova-bitir': () => { prova = null; ciz(); },
  not: (el) => notVer(Number(el.dataset.g)),

  /* --- ayarlar --- */
  'kilit-kaydet': () => {
    P.kilitsizAyarla(document.getElementById('kilitsiz').checked);
    alert('Kaydedildi.');
  },

  'kurs-sifirla': () => {
    if (confirm('Tüm ders ve test kayıtları silinecek. Saraylar kalır. Emin misin?')) {
      P.sifirla();
      git('/');
    }
  },

  'yedek-al': () => {
    const paket = JSON.stringify({ saray: JSON.parse(S.disaAktar()), kurs: P.disaAktar() }, null, 2);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([paket], { type: 'application/json' }));
    a.download = `hafiza-sarayi-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  },

  'yedek-yukle': () => {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'application/json,.json';
    inp.onchange = async () => {
      const dosya = inp.files?.[0];
      if (!dosya) return;
      try {
        const metin = await dosya.text();
        const paket = JSON.parse(metin);
        if (paket.saray) {
          S.iceAktar(JSON.stringify(paket.saray), { birlestir: false });
          if (paket.kurs) P.iceAktar(paket.kurs);
        } else {
          S.iceAktar(metin, { birlestir: false });   // eski sürüm yedeği
        }
        alert('Yedek yüklendi.');
        git('/');
      } catch (e) {
        alert('Yüklenemedi: ' + e.message);
      }
    };
    inp.click();
  },
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-eylem]');
  if (!el || dlg.contains(el)) return;
  const f = eylemler[el.dataset.eylem];
  if (f) { e.preventDefault(); f(el); }
});

// Yazma alanı: karakter sayacı ve taslak kaydı (yeniden çizim yapmadan).
document.addEventListener('input', (e) => {
  if (e.target.id !== 'yaz-alan') return;
  const enAz = Number(e.target.dataset.enaz);
  const n = e.target.value.trim().length;
  const sayac = document.getElementById('yaz-sayac');
  if (sayac) {
    sayac.textContent = n >= enAz ? `${n} karakter — yeterli` : `${n}/${enAz} karakter`;
    sayac.style.color = n >= enAz ? 'var(--yesil)' : '';
  }
});
document.addEventListener('blur', (e) => {
  if (e.target.id === 'yaz-alan' && dersImleci.dersId) {
    const ders = dersBul(dersImleci.dersId);
    const a = ders?.adimlar[dersImleci.i];
    if (a) P.adimTaslak(ders.id, a.id, e.target.value.trim());
  }
}, true);

/* ============================================================ ÇİZİM */

const sekmeler = [
  { yol: '/', kok: '', g: '🎓', ad: 'Kurs' },
  { yol: '/atolye', kok: 'atolye', g: '🏛️', ad: 'Atölye' },
  { yol: '/prova', kok: 'prova', g: '🚶', ad: 'Prova' },
  { yol: '/rapor', kok: 'rapor', g: '📊', ad: 'Rapor' },
  { yol: '/ayarlar', kok: 'ayarlar', g: '⚙️', ad: 'Ayarlar' },
];

function ciz() {
  const { parca } = rota();
  const kok = parca[0] || '';

  let html;
  if (kok === '') html = gorKurs();
  else if (kok === 'ders') html = gorDers(parca[1]);
  else if (kok === 'drill') html = gorDrill();
  else if (kok === 'atolye') html = gorAtolye();
  else if (kok === 'saray' && parca[2] === 'durak') html = gorDurak(parca[1], parca[3]);
  else if (kok === 'saray') html = gorSaray(parca[1]);
  else if (kok === 'prova') html = gorProva();
  else if (kok === 'rapor') html = gorRapor();
  else if (kok === 'ayarlar') html = gorAyarlar();
  else html = gorKurs();

  kap.innerHTML = html;

  const etkin = kok === 'ders' || kok === 'drill' ? '' : (kok === 'saray' ? 'atolye' : kok);
  nav.innerHTML = sekmeler.map((s) =>
    `<a href="#${s.yol}" class="${s.kok === etkin ? 'etkin' : ''}"><span class="g">${s.g}</span>${s.ad}</a>`).join('');

  if (kok !== 'prova' && kok !== 'drill') window.scrollTo({ top: 0 });
}

addEventListener('hashchange', () => {
  const kok = rota().parca[0] || '';
  if (kok !== 'drill') sayacDurdur();
  ciz();
});
S.abone(ciz);
ciz();

if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
