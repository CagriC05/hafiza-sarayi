// Müfredat: ders içerikleri ve her adımın nasıl doğrulandığı.
// Adım tipleri:
//   anlat  — okunacak açıklama (onaylayınca tamam)
//   soru   — çoktan seçmeli; doğru cevap verilmeden geçilmez
//   ornek  — kötü/iyi karşılaştırması
//   yaz    — serbest yazma; en az `enAz` karakter
//   rubrik — kendi işini denetleme listesi; tüm maddeler işaretlenmeli
//   uygula — ATÖLYEDE gerçek iş; `kontrol(S)` veriye bakar, yapılmadıysa geçirmez
//   drill  — otomatik puanlanan hatırlama testi; `gecmeNotu` altında geçilmez

export const ON_TEST_LISTESI = [
  'mitokondri', 'enflasyon', 'kadastro', 'sinaps', 'ipotek',
  'entropi', 'ombudsman', 'katalizör', 'tahkim', 'osmoz',
  'amortisman', 'ribozom', 'teminat', 'difüzyon', 'icra',
];

export const SON_TEST_LISTESI = [
  'alveol', 'devalüasyon', 'nefron', 'muvazaa', 'valans',
  'arbitraj', 'miyelin', 'zilyetlik', 'izotop', 'konsolidasyon',
  'homeostazi', 'irtifak', 'substrat', 'likidite', 'vesayet',
];

const ilkSaray = (S) => S.saraylar()[0] || null;

export const UNITELER = [
  {
    id: 'u1', ad: 'Temel', g: '🧭',
    aciklama: 'Yöntem neden çalışıyor ve şu an nerede duruyorsun?',
  },
  {
    id: 'u2', ad: 'Mekan', g: '🏠',
    aciklama: 'Sarayı seçmek, durakları çıkarmak, rotayı sabitlemek.',
  },
  {
    id: 'u3', ad: 'İmge', g: '🎭',
    aciklama: 'Akılda kalan imge kurmak ve soyut terimleri imgeye çevirmek.',
  },
  {
    id: 'u4', ad: 'Hatırlama', g: '🔁',
    aciklama: 'Geri çağırma teknikleri, tekrar ve ölçeklendirme.',
  },
];

export const DERSLER = [
  /* ------------------------------------------------ ÜNİTE 1: TEMEL */
  {
    id: 'd01', unite: 'u1', ad: 'Başlangıç ölçümü',
    ozet: 'Önce ham halini ölç. Kursun sonunda aynı testi tekrar yapacaksın.',
    sure: 5,
    adimlar: [
      { id: 'a1', tip: 'anlat', baslik: 'Neden ölçüyoruz?', metin: `
        <p>Hafıza sarayı öğrenirken en büyük sorun şudur: ilerlediğini <strong>hissedemezsin</strong>.
        Bu yüzden işe bir ölçümle başlıyoruz.</p>
        <p>Şimdi sana 15 akademik terim göstereceğim. Hiçbir teknik kullanmadan,
        bildiğin gibi ezberleyeceksin. Sonra hatırladıklarını yazacaksın.</p>
        <p><strong>Düşük skor almak iyidir.</strong> Kursun sonunda aynı formatta ikinci bir test var;
        aradaki fark senin kazancın. Şimdi iyi bir skor almaya çalışmak sadece kendini kandırmak olur.</p>` },
      { id: 'a2', tip: 'drill', drill: 'on-test', baslik: 'Ön test: 15 terim', gecmeNotu: 0,
        metin: '<p>Tekniksiz, ham ezber. 90 saniye çalışma süresi var.</p>' },
      { id: 'a3', tip: 'anlat', baslik: 'Bu skor normal', metin: `
        <p>Çoğu insan tekniksiz 15 terimden <strong>5-8</strong> tanesini hatırlar; genelde listenin
        başındakiler ve sonundakiler akılda kalır, ortası buharlaşır.</p>
        <p>Bunun nedeni kelime listesinin hafızanın hiçbir güçlü kancasına takılmaması.
        Sıradaki derste hangi kancayı kullanacağımızı göreceksin.</p>` },
    ],
  },

  {
    id: 'd02', unite: 'u1', ad: 'Yöntem neden çalışıyor',
    ozet: 'Mekansal hafıza ile sözel hafıza arasındaki fark ve yöntemin dört parçası.',
    sure: 8,
    adimlar: [
      { id: 'a1', tip: 'anlat', baslik: 'Beynin güçlü olduğu yer', metin: `
        <p>Soyut kelime listesi tutmak beynin zayıf tarafıdır. Ama <strong>mekan</strong> konusunda
        olağanüstüdür: çocukluk evinin odalarını, her gün yürüdüğün sokağı, okulun koridorunu
        hiç "ezberlemeden" biliyorsun. Kimse sana evini çalıştırmadı.</p>
        <p>Hafıza sarayı yöntemi tam olarak bunu sömürür: hatırlamak istediğin şeyi
        zaten bedava sahip olduğun mekansal haritaya <strong>asar</strong>.</p>
        <p>Hatırlarken bir liste kurcalamıyorsun; tanıdık bir yerde <strong>yürüyorsun</strong> ve
        yol boyunca bıraktığın şeylere rastlıyorsun.</p>` },
      { id: 'a2', tip: 'anlat', baslik: 'Dört parça', metin: `
        <p><strong>1. Saray</strong> — gözü kapalı gezebildiğin gerçek bir mekan.</p>
        <p><strong>2. Durak</strong> — o mekandaki sabit noktalar, <em>belirli bir sırayla</em>.
        Giriş kapısı, ayakkabılık, mutfak tezgahı…</p>
        <p><strong>3. İmge</strong> — durağa bıraktığın çarpıcı sahne. Hatırlanacak şeyin kılık değiştirmiş hali.</p>
        <p><strong>4. Rota</strong> — durakların sırası. Hatırlama rotayı yürümekle olur; bu yüzden
        sıra rastgele olamaz.</p>
        <p>Dikkat: imgeyi <strong>sen</strong> kuracaksın. Bu uygulama sana imge vermez —
        başkasının imgesi senin kendi kurduğunun yarısı kadar tutar, çünkü imgeyi kurma çabası
        hafıza izini oluşturan şeyin kendisidir.</p>` },
      { id: 'a3', tip: 'soru', baslik: 'Kontrol', soru: 'Hafıza sarayı yöntemi temel olarak neye dayanır?',
        secenekler: [
          { m: 'Kelimeleri çok sayıda tekrar ederek pekiştirmeye', d: false,
            aciklama: 'Tekrar faydalıdır ama yöntemin özü değil; tekrar olmadan da ilk günden büyük kazanç elde edilir.' },
          { m: 'Zaten sahip olduğun mekansal haritaya içerik asmaya', d: true,
            aciklama: 'Evet. Bedava gelen güçlü bir hafıza türünü (mekan) zayıf olanın (soyut liste) hizmetine koşuyorsun.' },
          { m: 'Hızlı okuma ve göz egzersizlerine', d: false,
            aciklama: 'Alakası yok; hafıza sarayı bir kodlama ve geri çağırma yöntemidir.' },
          { m: 'Bilgiyi mantıksal olarak anlamaya', d: false,
            aciklama: 'Anlamak her zaman iyidir ama yöntem anlamadan da sıralı içerik tutmanı sağlar; bu ikisi ayrı işler.' },
        ] },
      { id: 'a4', tip: 'soru', baslik: 'Kontrol', soru: 'Uygulama sana hazır imge vermiyor. Neden?',
        secenekler: [
          { m: 'Çünkü imge üretmek teknik olarak zor', d: false,
            aciklama: 'Teknik bir kısıt değil, pedagojik bir tercih.' },
          { m: 'Çünkü imgeyi kurma çabası hafıza izini oluşturan şeyin kendisi', d: true,
            aciklama: 'Doğru. Hazır imgeyi okumak pasif; kendi imgeni kurmak kodlamanın ta kendisi.' },
          { m: 'Çünkü herkesin sarayı farklı', d: false,
            aciklama: 'Bu da doğru ama asıl sebep değil — imge evrensel olsa bile kendi kurduğun daha iyi tutar.' },
        ] },
    ],
  },

  /* ------------------------------------------------ ÜNİTE 2: MEKAN */
  {
    id: 'd03', unite: 'u2', ad: 'Mekanı seçmek',
    ozet: 'İyi saray olacak mekanın dört şartı ve kötü adayları ayıklamak.',
    sure: 10,
    adimlar: [
      { id: 'a1', tip: 'anlat', baslik: 'Dört şart', metin: `
        <p><strong>1. Gerçekten biliyor olacaksın.</strong> Ölçüt şu: gözünü kapatıp içinde
        yürüyebiliyor musun? "Bir kere gittim, güzeldi" yetmez.</p>
        <p><strong>2. Sabit olacak.</strong> Mobilyası sürekli değişen, her gün farklı görünen yerler
        zamanla duraklarını siler. Oteller, kafeler kötü adaydır.</p>
        <p><strong>3. Doğal bir sırası olacak.</strong> İçinden tek bir yol geçmeli: giriş → koridor → oda…
        Büyük açık bir salonda "sıra" uydurman gerekir, bu da unutulur.</p>
        <p><strong>4. Duygusal bağı olacak.</strong> Çocukluk evi, ilk okulun, dedenin bahçesi —
        bağ kuvvetliyse duraklar kendiliğinden canlıdır.</p>` },
      { id: 'a2', tip: 'soru', baslik: 'Aday ayıklama', soru: 'Hangisi ilk sarayın için <em>en kötü</em> aday?',
        secenekler: [
          { m: 'Geçen yaz bir hafta kaldığın tatil oteli', d: true,
            aciklama: 'Doğru. Yeterince bilmiyorsun, sabit değil ve duygusal bağ zayıf. Üç şartı birden ihlal ediyor.' },
          { m: 'Çocukluğunda büyüdüğün ev', d: false,
            aciklama: 'Bu en iyi adaylardan biri: iyi biliniyor, sabit (hafızanda donmuş) ve duygusal bağı güçlü.' },
          { m: 'Her gün yürüdüğün evden durağa rota', d: false,
            aciklama: 'Çok iyi bir aday: doğal sırası var ve her gün tazeliyorsun.' },
          { m: 'Şu anda oturduğun ev', d: false,
            aciklama: 'Güçlü aday. Tek riski mobilya değişimi ama bu yönetilebilir.' },
        ] },
      { id: 'a3', tip: 'soru', baslik: 'Kontrol', soru: 'Tek bir büyük açık ofis katı saray olarak neden zayıftır?',
        secenekler: [
          { m: 'Çok büyük olduğu için', d: false, aciklama: 'Büyüklük sorun değil; sorun yapı.' },
          { m: 'İçinden geçen doğal bir yol olmadığı için sıra uydurmak gerekir', d: true,
            aciklama: 'Evet. Uydurulmuş sıra mekanın kendisi tarafından desteklenmez, bu yüzden unutulur.' },
          { m: 'Kalabalık olduğu için dikkat dağılır', d: false,
            aciklama: 'Sarayı zihninde geziyorsun; oradaki anlık kalabalık önemli değil.' },
        ] },
      { id: 'a4', tip: 'yaz', baslik: 'Üç aday çıkar', enAz: 80, metin: `
        <p>Üç mekan adayı yaz. Her biri için tek cümleyle söyle: dört şarttan hangilerini karşılıyor,
        hangisinde zayıf?</p>`,
        ipucu: '1) Çocukluk evim — iyi biliyorum, hafızamda sabit, girişten başlayan net bir yol var.\n2) ...' },
      { id: 'a5', tip: 'uygula', baslik: 'Sarayını kur', hedef: 'atolye',
        metin: `<p>En güçlü adayı seç ve Atölye'de bir saray oluştur. Not alanına
        <strong>rotanın nereden başlayıp hangi yönde ilerlediğini</strong> yaz —
        bu cümle sonra rotayı sabit tutan şey olacak.</p>`,
        kontrol: (S) => {
          const s = ilkSaray(S);
          if (!s) return { tamam: false, mesaj: 'Henüz saray yok. Atölye > + ile bir saray oluştur.' };
          if ((s.aciklama || '').trim().length < 15) {
            return { tamam: false, mesaj: `"${s.ad}" kuruldu ama rota notu boş ya da çok kısa. Sarayı düzenleyip başlangıç noktasını ve yönü yaz.` };
          }
          return { tamam: true, mesaj: `"${s.ad}" hazır, rota notu da yazılmış.` };
        } },
    ],
  },

  {
    id: 'd04', unite: 'u2', ad: 'Durakları çıkarmak',
    ozet: 'Durak seçme kuralları ve ilk 10 durağın.',
    sure: 15,
    adimlar: [
      { id: 'a1', tip: 'anlat', baslik: 'Durak seçme kuralları', metin: `
        <p><strong>Tek yön.</strong> Rotayı bir kez belirle, hep aynı yönde yürü. Saat yönü, ya da
        girişten en uzak odaya doğru — ama her seferinde aynı.</p>
        <p><strong>Sabit ve büyük nesneler.</strong> Kapı, tezgah, buzdolabı, şömine, merdiven.
        Taşınabilir şeyler (sandalye, kumanda, çanta) durak olmaz.</p>
        <p><strong>Birbirine benzemesin.</strong> Aynı koridordaki altı tıpatıp kapı altı durak değildir;
        karışır. İkisini seç, aralarına farklı bir şey koy.</p>
        <p><strong>Göz hizası ve içine girilebilirlik.</strong> İyi durak, bir sahneyi
        <em>yerleştirebileceğin</em> yerdir: üstü, içi, önü olan bir şey.</p>
        <p><strong>Sayı: 10-20.</strong> İlk sarayda 10 durak ideal. Az gelir gibi durur ama
        10 durak × 2 imge = 20 madde, bu bir sınav konusunun listesi demektir.</p>` },
      { id: 'a2', tip: 'ornek', baslik: 'Zayıf durak → güçlü durak',
        kotu: 'Salon', iyi: 'Salonun sol köşesindeki şömine',
        aciklama: '"Salon" bir bölge, bir nokta değil — içine ne koyduğunu konumlandıramazsın. Şömine ise tek bir nokta: üstüne koyabilir, içine atabilir, önünde durdurabilirsin.' },
      { id: 'a3', tip: 'ornek', baslik: 'Karışan duraklar → ayrışan duraklar',
        kotu: 'Koridordaki 1., 2., 3. kapı', iyi: 'Koridor girişindeki ayna → 2. kapı → koridor sonundaki radyatör',
        aciklama: 'Birbirinin kopyası olan duraklar hatırlama sırasında yer değiştirir. Aralarına ayırt edici nesneler sokmak sırayı kilitler.' },
      { id: 'a4', tip: 'soru', baslik: 'Kontrol', soru: 'Hangisi kötü bir duraktır?',
        secenekler: [
          { m: 'Mutfak tezgahının üstündeki çaydanlık', d: true,
            aciklama: 'Doğru: taşınabilir bir nesne. Yerini değiştirdiğinde durak kayar. Tezgahın kendisi durak olmalı.' },
          { m: 'Banyo kapısı', d: false, aciklama: 'Sabit, tek bir nokta, ayırt edici — iyi durak.' },
          { m: 'Merdivenin ilk basamağı', d: false, aciklama: 'Sabit ve konumu net; iyi durak.' },
          { m: 'Balkon kapısı', d: false, aciklama: 'İyi durak.' },
        ] },
      { id: 'a5', tip: 'uygula', baslik: '10 durak ekle', hedef: 'atolye',
        metin: `<p>Atölye'de sarayını aç ve <strong>en az 10 durak</strong> ekle. Sırayı rotanı yürüdüğün
        gibi gir. Her durağa <strong>mekan ipucu</strong> yaz — orada ne gördüğünü bir cümleyle anlat
        ("solda ayakkabılık, üstünde oval ayna"). Bu ipucu durağı zihninde keskinleştirir.</p>`,
        kontrol: (S) => {
          const s = ilkSaray(S);
          if (!s) return { tamam: false, mesaj: 'Önce bir saray kur.' };
          const n = s.duraklar.length;
          if (n < 10) return { tamam: false, mesaj: `${n}/10 durak eklendi. ${10 - n} durak daha gerekiyor.` };
          const ipucusuz = s.duraklar.filter((d) => (d.ipucu || '').trim().length < 8);
          if (ipucusuz.length) {
            return { tamam: false, mesaj: `${n} durak var ama ${ipucusuz.length} tanesinin mekan ipucu eksik (ilki: "${ipucusuz[0].ad}").` };
          }
          return { tamam: true, mesaj: `${n} durak, hepsinin ipucu yazılmış. Rota kurulmuş sayılır.` };
        } },
      { id: 'a6', tip: 'anlat', baslik: 'Şimdi yürü', metin: `
        <p>Durakları yazmak yetmez, <strong>yürümen</strong> gerekir. Gözlerini kapat ve rotayı
        baştan sona zihninde geç; her durakta bir saniye dur ve ipucunda yazdığın şeyi gör.</p>
        <p>İki kez yap. Sonra sıradaki adıma geç — rotayı ezberleyip ezberlemediğini test edeceğim.</p>` },
      { id: 'a7', tip: 'drill', drill: 'rota-ileri', baslik: 'Test: rotayı sırayla yaz', gecmeNotu: 80,
        metin: '<p>Durak adlarını <strong>rota sırasına göre</strong> yaz. Geçme notu %80.</p>' },
    ],
  },

  {
    id: 'd05', unite: 'u2', ad: 'Rotayı sabitlemek',
    ozet: 'Rotayı içerik koymadan önce otomatikleştirmek: tersten ve rastgele erişim.',
    sure: 10,
    adimlar: [
      { id: 'a1', tip: 'anlat', baslik: 'Neden boş rota provası?', metin: `
        <p>Acemi hatası: sarayı kurar kurmaz içerik doldurmak. Sorun şu — rota henüz otomatik değilse
        hatırlama sırasında iki iş birden yaparsın: hem "sırada hangi durak vardı?" diye düşünürsün,
        hem imgeyi çözmeye çalışırsın. İkisi birden yapılmaz.</p>
        <p>Rota <strong>düşünmeden</strong> akmalı. Bunun ölçütü iki testtir:
        <strong>tersten</strong> yürüyebilmek ve <strong>rastgele erişim</strong>
        ("7. durak neydi?" sorusuna takılmadan cevap vermek).</p>
        <p>İkisini de geçiyorsan rota hazır. Geçemiyorsan içerik koymak erken.</p>` },
      { id: 'a2', tip: 'drill', drill: 'rota-ters', baslik: 'Test: rotayı tersten yaz', gecmeNotu: 70,
        metin: '<p>Sondan başa doğru. Geçme notu %70 — tersten zor olması normal.</p>' },
      { id: 'a3', tip: 'drill', drill: 'rastgele-durak', baslik: 'Test: rastgele erişim', gecmeNotu: 80,
        metin: '<p>5 soru: "N. durak hangisiydi?" Geçme notu %80.</p>' },
      { id: 'a4', tip: 'rubrik', baslik: 'Rota hazır mı?', maddeler: [
        'Gözüm kapalı baştan sona yürüyebiliyorum, duraklar kendiliğinden geliyor.',
        'Tersten yürürken durakları bulmak için zorlanmıyorum.',
        'Her durağın ne olduğunu net görüyorum; "bölge" değil "nokta" hepsi.',
        'Rotanın yönü her yürüyüşte aynı.',
      ] },
    ],
  },

  /* ------------------------------------------------ ÜNİTE 3: İMGE */
  {
    id: 'd06', unite: 'u3', ad: 'Akılda kalan imge kurmak',
    ozet: 'Beş kural: hareket, abartı, absürtlük, çok duyu, duygu.',
    sure: 15,
    adimlar: [
      { id: 'a1', tip: 'anlat', baslik: 'Beş kural', metin: `
        <p>Sıkıcı imge unutulur. İmgeyi akılda kalıcı yapan beş özellik:</p>
        <p><strong>1. Hareket.</strong> Duran resim değil, olan bir şey. Patlıyor, düşüyor, koşuyor.</p>
        <p><strong>2. Abartı.</strong> Boyutu bozup geç: ev boyunda bir hücre, tavana yığılmış binlerce madeni para.</p>
        <p><strong>3. Absürtlük.</strong> Mantıksız olan akılda kalır. Takım elbiseli bir mitokondri toplantı yönetiyor.</p>
        <p><strong>4. Çok duyu.</strong> Sadece görme değil: ses, koku, doku, tat. Çatırdama, yanık karamel, ıslak tüy.</p>
        <p><strong>5. Duygu.</strong> Güldüren, tiksindiren, utandıran, korkutan imgeler nötr olanları ezer.
        Bu yüzden kaba ve saçma imgeler şaşırtıcı derecede iyi çalışır — kimse görmüyor, çekinme.</p>` },
      { id: 'a2', tip: 'ornek', baslik: 'Nötr → çarpıcı',
        kotu: 'Mitokondri: kapının yanında bir hücre var, içinde mitokondri.',
        iyi: 'Giriş kapısını açıyorum, içeri fasulye şeklinde dev bir mitokondri yuvarlanıyor; sırtındaki kıvrımlar akordeon gibi açılıp kapanıyor ve her açılışta ev sarsılıyor, yanık elektrik kokusu yayılıyor.',
        aciklama: 'İkincisinde hareket (yuvarlanma, akordeon), abartı (dev), absürtlük (evi sarsan organel), duyu (koku, sarsıntı) var. Birincisi sadece bir bilgi cümlesi — hafızada tutunacak hiçbir çıkıntısı yok.' },
      { id: 'a3', tip: 'soru', baslik: 'Kontrol', soru: 'Hangi imge daha iyi tutar?',
        secenekler: [
          { m: 'Buzdolabının üstünde enflasyon yazan bir kağıt duruyor', d: false,
            aciklama: 'Yazı okumak sözel hafızaya geri döner — imgenin amacı tam olarak bundan kaçmaktı. Kelime yazmak en sık yapılan hatadır.' },
          { m: 'Buzdolabını açıyorum, içindeki fiyat etiketleri balon gibi şişip patlıyor, her patlamada ekmek küçülüyor', d: true,
            aciklama: 'Doğru. Hareket, abartı, ses ve kavramın özünü (fiyatlar şişer, alım gücü küçülür) taşıyan bir sahne.' },
          { m: 'Buzdolabı enflasyonu simgeliyor', d: false,
            aciklama: 'Bu bir etiketleme, imge değil. Gözünle görebileceğin bir sahne yok.' },
        ] },
      { id: 'a4', tip: 'anlat', baslik: 'En sık üç hata', metin: `
        <p><strong>Kelime yazmak.</strong> Durağa terimin yazılı olduğu bir tabela koymak işe yaramaz;
        sözel hafızaya geri dönmüş olursun.</p>
        <p><strong>Fazla kibar olmak.</strong> Nötr, düzgün, makul sahneler silinir. İmge rahatsız edici
        derecede saçma olmalı.</p>
        <p><strong>Durağı kullanmamak.</strong> Sahne durağın <em>yanında</em> değil, durağın
        üstünde/içinde/onunla çarpışarak olmalı. Bir sonraki ders tam bu konuda.</p>` },
      { id: 'a5', tip: 'yaz', baslik: 'Üç imgeyi güçlendir', enAz: 200, metin: `
        <p>Aşağıdaki üç nötr imgeyi beş kuralı kullanarak yeniden yaz:</p>
        <p class="soluk">1. "Kapıda bir sinaps var."<br>
        2. "Mutfakta osmoz oluyor."<br>
        3. "Balkonda bir ipotek belgesi duruyor."</p>
        <p>Her biri için hangi kuralları kullandığını sonunda parantezle belirt.</p>`,
        ipucu: '1) Kapının kolu iki parmağa dönüşüyor, aralarında mavi kıvılcım çatırdıyor... (hareket, absürt, ses)' },
      { id: 'a6', tip: 'rubrik', baslik: 'Yazdıklarını denetle', maddeler: [
        'Üç imgenin hepsinde bir hareket/olay var, durağan resim değil.',
        'Hiçbirinde terimin yazılı hali (tabela, kağıt, yazı) yok.',
        'En az ikisinde görme dışında bir duyu var (ses, koku, doku).',
        'En az birinde beni gülümseten ya da tiksindiren bir şey var.',
      ] },
    ],
  },

  {
    id: 'd07', unite: 'u3', ad: 'Durakla etkileşim',
    ozet: 'İmge durağın yanında durmaz; durakla çarpışır. İlk beş gerçek imgen.',
    sure: 15,
    adimlar: [
      { id: 'a1', tip: 'anlat', baslik: 'Etkileşim kuralı', metin: `
        <p>İmgeyi durağa <em>koymak</em> yetmez; imge durağı <strong>kullanmalı</strong>.
        Çünkü hatırlarken elinde sadece durak var: "mutfak tezgahı" dediğinde sahne kendiliğinden
        gelmeli. Sahne tezgahla fiziksel olarak bağlıysa gelir.</p>
        <p>Üç bağlama biçimi:</p>
        <p><strong>Üstünde:</strong> tezgahın üstünde tepiniyor, kayıyor, eriyor.</p>
        <p><strong>İçinde:</strong> buzdolabının içinden taşıyor, çekmeceden fışkırıyor.</p>
        <p><strong>Çarpışarak:</strong> kapıya çarpıyor, aynayı kırıyor, radyatöre dolanıyor.</p>
        <p>Test: durağın adını söyle, sahne 1 saniyede geliyor mu? Gelmiyorsa bağ zayıf.</p>` },
      { id: 'a2', tip: 'ornek', baslik: 'Yanında duruyor → durakla çarpışıyor',
        kotu: 'Şöminenin yanında dev bir ribozom var.',
        iyi: 'Ribozom şöminenin içine tıkılmış, alevler onu ısıtınca bir yazıcı gibi tıkır tıkır protein zinciri tükürüyor, zincir bacaya doğru uzuyor.',
        aciklama: 'İkincisinde şömine sahnenin parçası: ısı ribozomu çalıştırıyor, baca zincirin yolu oluyor. Şömineyi düşününce sahne kaçamaz. Birincisinde şömine sadece arka plan, silinir.' },
      { id: 'a3', tip: 'soru', baslik: 'Kontrol', soru: 'Durağı düşündüğünde sahne aklına gelmiyor. İlk bakacağın yer?',
        secenekler: [
          { m: 'İmge durakla fiziksel olarak etkileşiyor mu', d: true,
            aciklama: 'Doğru. Gelmeyen sahnelerin çoğunda imge durağın yanında durmaktadır, durağı kullanmaz.' },
          { m: 'Daha çok tekrar etmek gerekir', d: false,
            aciklama: 'Tekrar kötü kodlamayı kurtarmaz; zayıf imgeyi tekrar etmek zaman kaybıdır. Önce imgeyi düzelt.' },
          { m: 'Durağı değiştirmek gerekir', d: false,
            aciklama: 'Durak suçlu olabilir ama ilk şüpheli bağ eksikliğidir; durak değiştirmek son çare.' },
        ] },
      { id: 'a4', tip: 'uygula', baslik: 'İlk beş imgeni yerleştir', hedef: 'atolye',
        metin: `<p>Kendi çalıştığın bir konudan <strong>5 madde</strong> seç ve sarayının ilk beş durağına
        birer imge olarak yerleştir. Her imgede:</p>
        <p>• <strong>Terim</strong> ve <strong>içerik</strong> alanlarını doldur,<br>
        • <strong>İmge tasviri</strong>ne sahneyi yaz — durakla nasıl etkileştiğini belirt,<br>
        • <strong>Duyu notu</strong>na en az bir ses/koku/doku ekle.</p>
        <p>Bir durağa bir imge; şimdilik kalabalık yapma.</p>`,
        kontrol: (S) => {
          const s = ilkSaray(S);
          if (!s) return { tamam: false, mesaj: 'Önce sarayını kur.' };
          const imgeler = S.tumImgeler(s.id);
          if (imgeler.length < 5) return { tamam: false, mesaj: `${imgeler.length}/5 imge var. ${5 - imgeler.length} tane daha yerleştir.` };
          const tasvirsiz = imgeler.filter((x) => (x.imge.tasvir || '').trim().length < 40);
          if (tasvirsiz.length) {
            return { tamam: false, mesaj: `${imgeler.length} imge var ama ${tasvirsiz.length} tanesinin tasviri yok ya da çok kısa (ilki: "${tasvirsiz[0].imge.terim}"). Sahneyi anlat, etiket yazma.` };
          }
          const duyusuz = imgeler.filter((x) => !(x.imge.duyu || '').trim());
          if (duyusuz.length > imgeler.length - 3) {
            return { tamam: false, mesaj: `Tasvirler iyi ama duyu notu neredeyse hiç yok. En az 3 imgeye ses/koku/doku ekle.` };
          }
          return { tamam: true, mesaj: `${imgeler.length} imge, tasvirleri dolu. İlk yerleştirmen tamam.` };
        } },
    ],
  },

  {
    id: 'd08', unite: 'u3', ad: 'Soyut terimleri imgeye çevirmek',
    ozet: 'Akademik içeriğin asıl zorluğu: resmi olmayan kavramları nasıl görselleştirirsin?',
    sure: 15,
    adimlar: [
      { id: 'a1', tip: 'anlat', baslik: 'Dört strateji', metin: `
        <p>"Sandalye" kolay, "amortisman" zor. Soyut terimler için dört yol var:</p>
        <p><strong>1. Ses benzeşimi.</strong> Terimi kulağa benzeyen somut şeylere parçala.
        <em>Amortisman</em> → "amortisör + man(adam)": takım elbiseli bir adam her yıl biraz daha
        çöken amortisörlerin üstünde zıplıyor.</p>
        <p><strong>2. Sembolleştirme.</strong> Kavramın özünü tek bir nesneye indir.
        <em>Enflasyon</em> → şişen balon. <em>Tahkim</em> → masanın ortasında hakem düdüğü.</p>
        <p><strong>3. Kişileştirme.</strong> Kavramı karaktere dönüştür.
        <em>Entropi</em> → arkasından geçtiği her yeri dağıtan pasaklı bir dev.</p>
        <p><strong>4. Parçalama.</strong> Bileşik terimi anlamlı parçalara böl.
        <em>Osmoz</em> → "os-moz": kemik (os) bir mozaikten sızıyor.</p>
        <p>Ses benzeşimi kullanırken dikkat: parça <strong>somut</strong> olmalı. "Amor-tisman"
        içindeki "amor"u aşk diye kodlarsan soyutta kalırsın, aşkı bir kalp balonuna çevirmen gerekir.</p>` },
      { id: 'a2', tip: 'ornek', baslik: 'Soyut kaldı → somutlaştı',
        kotu: 'Likidite: paranın kolay harcanabilmesi, elimde akışkan para var.',
        iyi: 'Lavabonun (durak) musluğundan madeni para akıyor, elimi tutunca parmaklarımın arasından su gibi kayıyor, şıngırtıyla gidere akıyor — tıkalı gider ise bozuk paraları tutuyor (likit olmayan varlık).',
        aciklama: '"Akışkan para" hâlâ bir tanım; gözle görülür hiçbir şey yok. İkincisinde musluk, kayan para, ses ve hatta kavramın zıttı (tıkalı gider = likit olmayan) sahnede. Kavramın mantığı sahnenin içine gömülmüş.' },
      { id: 'a3', tip: 'soru', baslik: 'Kontrol', soru: '"Difüzyon" için hangisi ses benzeşimi stratejisine örnek?',
        secenekler: [
          { m: 'Moleküllerin çok yoğun yerden az yoğun yere geçişini düşünmek', d: false,
            aciklama: 'Bu tanımın kendisi, bir imge değil.' },
          { m: '"Difüzör"den yola çıkıp odaya koku püskürten bir difüzör hayal etmek', d: true,
            aciklama: 'Doğru — hem ses benzeşimi hem şans eseri kavramla uyumlu: koku yoğun yerden seyrek yere dağılır.' },
          { m: 'Difüzyonu dağınık bir karakter olarak canlandırmak', d: false,
            aciklama: 'Bu kişileştirme stratejisi; geçerli ama sorulan ses benzeşimi değil.' },
        ] },
      { id: 'a4', tip: 'yaz', baslik: 'Beş soyut terimi çevir', enAz: 250, metin: `
        <p>Kendi alanından <strong>beş soyut terim</strong> seç (çalıştığın ders olsun, uydurma).
        Her biri için:</p>
        <p>• kullandığın strateji (ses benzeşimi / sembol / kişileştirme / parçalama),<br>
        • ortaya çıkan somut sahne.</p>`,
        ipucu: 'Zilyetlik — parçalama: "zil" + "yetki". Kapı zilini çalan kişi, elinde tapu olmasa da evin içinde oturuyor... (zilyet = fiili hakimiyet)' },
      { id: 'a5', tip: 'rubrik', baslik: 'Denetle', maddeler: [
        'Beş terimin hepsi kendi çalıştığım alandan, uydurma değil.',
        'Her sahne gözümle görebileceğim somut nesnelerden kurulu; soyut kelime kalmadı.',
        'En az bir yerde ses benzeşimi, en az bir yerde sembolleştirme kullandım.',
        'Sahnelerin en az biri kavramın mantığını da taşıyor, sadece adını değil.',
      ] },
    ],
  },

  {
    id: 'd09', unite: 'u3', ad: 'Tanım ve süreç ezberi',
    ozet: 'Tek kelime değil, tanım ve sıralı adımlar: anahtar kelimeye indirme ve zincirleme.',
    sure: 15,
    adimlar: [
      { id: 'a1', tip: 'anlat', baslik: 'Tanımı imgeye sığdırmak', metin: `
        <p>Akademik içerikte asıl iş tek terim değil, <strong>tanım</strong> ve <strong>süreç</strong>.
        Bir tanımı kelime kelime imgeye çeviremezsin — gerek de yok.</p>
        <p><strong>Anahtar kelimeye indir.</strong> Tanımı oku, onu geri kurmaya yetecek
        <strong>3-4 çıpa</strong> seç. Gerisini dil kendiliğinden tamamlar.</p>
        <p class="soluk">Örnek: "Osmoz, suyun yarı geçirgen bir zardan, çözünen yoğunluğunun az olduğu
        yerden çok olduğu yere geçişidir."<br>
        Çıpalar: <strong>su · yarı geçirgen zar · seyrekten yoğuna</strong>. Üç çıpa tanımı geri getirir.</p>
        <p>Sonra bu 3-4 çıpayı <strong>tek bir sahneye</strong> sığdır; ayrı duraklara dağıtma.
        Tanım bir parçadır, bir durağa girer.</p>` },
      { id: 'a2', tip: 'anlat', baslik: 'Sıralı adımlar: zincirleme', metin: `
        <p>Sekiz adımlı bir süreç için iki yol var:</p>
        <p><strong>Durak başına bir adım.</strong> Sekiz adım, sekiz durak. Sırayı rota taşır.
        En güvenli yol; sınavda "3. adım neydi?" sorusuna doğrudan cevap verir.</p>
        <p><strong>Zincirleme.</strong> Tek durakta adımlar birbirini tetikler: birincisi ikinciye
        çarpar, ikincisi üçüncüyü fırlatır. Yer tasarrufu sağlar ama zincirin ortası kopunca
        gerisi gider. Kısa diziler (3-4) için iyi.</p>
        <p>Pratik kural: <strong>sınavda sırası sorulacaksa durak başına bir adım.</strong></p>` },
      { id: 'a3', tip: 'soru', baslik: 'Kontrol', soru: 'On iki adımlı bir süreci nasıl yerleştirirsin?',
        secenekler: [
          { m: 'On iki durağa birer adım', d: true,
            aciklama: 'Doğru. Uzun ve sırası önemli dizilerde rota en sağlam taşıyıcıdır; ortadan kopma riski yok.' },
          { m: 'Tek durakta on iki halkalı bir zincir', d: false,
            aciklama: 'Riskli: zincirin bir halkası kopunca sonrası erişilemez hale gelir ve "7. adım" sorusuna doğrudan cevap veremezsin.' },
          { m: 'Tanımı anahtar kelimeye indirip tek imge yapmak', d: false,
            aciklama: 'İndirgeme tanımlar için geçerli; sıralı adımlarda sıra bilgisini yok eder.' },
        ] },
      { id: 'a4', tip: 'yaz', baslik: 'Bir tanımı indir', enAz: 150, metin: `
        <p>Kendi dersinden bir <strong>tanım</strong> seç. Üç şeyi yaz:</p>
        <p>1. Tanımın tam hali.<br>
        2. Seçtiğin 3-4 çıpa.<br>
        3. Bu çıpaların hepsini taşıyan tek sahne.</p>` },
      { id: 'a5', tip: 'uygula', baslik: 'Sarayı 10 imgeye çıkar', hedef: 'atolye',
        metin: `<p>Sarayına, en az biri <strong>tanım</strong> ve en az biri <strong>sıralı süreç</strong>
        olacak şekilde imge eklemeye devam et — toplam <strong>10 imge</strong>.
        Süreci yerleştirirken adımları ardışık duraklara dağıt.</p>`,
        kontrol: (S) => {
          const s = ilkSaray(S);
          if (!s) return { tamam: false, mesaj: 'Önce sarayını kur.' };
          const imgeler = S.tumImgeler(s.id);
          if (imgeler.length < 10) return { tamam: false, mesaj: `${imgeler.length}/10 imge. ${10 - imgeler.length} tane daha ekle.` };
          const kullanilan = new Set(imgeler.map((x) => x.durak.id));
          if (kullanilan.size < 6) {
            return { tamam: false, mesaj: `10 imge var ama sadece ${kullanilan.size} durağa dağılmış. İmgeleri rotaya yay — bir durağa yığmak hatırlamayı bozar.` };
          }
          return { tamam: true, mesaj: `${imgeler.length} imge, ${kullanilan.size} durağa dağılmış.` };
        } },
    ],
  },

  /* ------------------------------------------------ ÜNİTE 4: HATIRLAMA */
  {
    id: 'd10', unite: 'u4', ad: 'Geri çağırma teknikleri',
    ozet: 'Rotayı yürümek, tersten gitmek, rastgele erişim ve zaman baskısı.',
    sure: 12,
    adimlar: [
      { id: 'a1', tip: 'anlat', baslik: 'Hatırlama bir yürüyüştür', metin: `
        <p>Hatırlarken içeriği <em>aramazsın</em>, rotayı yürürsün. Sıra şöyle:
        durağa gel → sahneyi gör → sahneden içeriği çöz. Üç adımı atlamaya çalışmak
        (doğrudan içeriği hatırlamaya çalışmak) yöntemi iptal eder.</p>
        <p>Sahne gelmiyorsa durakta <strong>bekle</strong>. Genelde 2-3 saniyede gelir.
        Gelmezse o imge zayıftır — daha çok tekrar değil, <strong>yeni imge</strong> gerekir.</p>
        <p>Üç prova biçimini dönüşümlü kullan: <strong>ileri</strong> (temel),
        <strong>tersten</strong> (sıraya bağımlılığı kırar), <strong>rastgele</strong>
        (sınavda soru sırası senin rotana uymaz, buna hazırlanman gerekir).</p>` },
      { id: 'a2', tip: 'soru', baslik: 'Kontrol', soru: 'Bir durakta sahne 10 saniyedir gelmiyor. Ne yapmalısın?',
        secenekler: [
          { m: 'İmgeyi yeniden kurmak: demek ki yeterince çarpıcı değil', d: true,
            aciklama: 'Doğru. Gelmeyen sahne bir kodlama hatasıdır; tekrar sayısını artırmak kötü imgeyi kurtarmaz.' },
          { m: 'O imgeyi her gün 10 kez tekrar etmek', d: false,
            aciklama: 'Zayıf imgeyi tekrarlamak pahalı ve verimsiz. Önce imgeyi düzelt, sonra tekrar et.' },
          { m: 'Durağı atlayıp devam etmek', d: false,
            aciklama: 'Atlamak sorunu büyütür; o durak kalıcı bir boşluk olur.' },
        ] },
      { id: 'a3', tip: 'uygula', baslik: 'Bir prova seansı tamamla', hedef: 'prova',
        metin: `<p>Prova sekmesine git ve sarayında <strong>rota provası</strong> yap —
        en az 8 imgeye not ver. Cevabı görmeden önce sahneyi gerçekten hatırlamaya çalış;
        kendini kandırmak sadece programın sana yanlış aralık vermesine yol açar.</p>`,
        kontrol: (S) => {
          const esik = Date.now() - 86400000;
          const bugunNot = S.tumImgeler().filter((x) => (x.imge.srs.gecmis || []).some((g) => g.t > esik));
          if (bugunNot.length < 8) {
            return { tamam: false, mesaj: `Son 24 saatte ${bugunNot.length}/8 imgeye not verilmiş. Prova sekmesinden devam et.` };
          }
          return { tamam: true, mesaj: `${bugunNot.length} imge prova edilmiş.` };
        } },
      { id: 'a4', tip: 'anlat', baslik: 'Zaman baskısı', metin: `
        <p>Son aşama: hızlanma. Rotayı acele etmeden yürüyebiliyorsan, bir de <strong>süre tutarak</strong>
        yürü. Sınav koşulu budur — acele ederken sahneler hâlâ geliyorsa kodlama sağlamdır.</p>
        <p>Hedef kabaca durak başına 3-4 saniye. 10 duraklık saray ≈ 40 saniye.</p>` },
    ],
  },

  {
    id: 'd11', unite: 'u4', ad: 'Unutma ve tekrar',
    ozet: 'İmge ilk günden sonra ne olur ve tekrarı nasıl programlarsın?',
    sure: 10,
    adimlar: [
      { id: 'a1', tip: 'anlat', baslik: 'İyi imge de solar', metin: `
        <p>Hafıza sarayı kodlamayı muazzam kolaylaştırır ama <strong>unutmayı iptal etmez</strong>.
        İyi kurulmuş bir imge günler içinde solar; farkı şu ki solmuş bir imge
        bir bakışta geri gelir — yeniden öğrenmen gerekmez.</p>
        <p>Kritik pencere <strong>ilk 24 saat</strong>. Yerleştirdiğin günün akşamı bir kez
        rotayı yürümek, o imgelerin ömrünü kat kat artırır.</p>
        <p>Sonrası aralıklı tekrar: 1 gün → 3 gün → 1 hafta → 2 hafta → 1 ay.
        Atölyedeki prova bu aralıkları senin verdiğin notlara göre kendisi hesaplar;
        "Hatırlamadım" dersen aralık sıfırlanır, "Kolay" dersen uzar.</p>
        <p><strong>Dürüst not ver.</strong> Zorlandığın halde "Kolay" demek, programın o imgeyi
        bir ay boyunca sana göstermemesine yol açar.</p>` },
      { id: 'a2', tip: 'soru', baslik: 'Kontrol', soru: 'Yeni yerleştirdiğin 10 imge için en değerli tek tekrar ne zaman?',
        secenekler: [
          { m: 'Aynı gün, akşam', d: true,
            aciklama: 'Doğru. En hızlı kayıp ilk 24 saatte olur; o penceredeki tek tekrar en yüksek getirili olandır.' },
          { m: 'Bir hafta sonra, iz soğuyunca', d: false,
            aciklama: 'Bir hafta çoğu imge için fazla uzun; geri kazanım maliyeti artar.' },
          { m: 'Hemen, yerleştirdikten iki dakika sonra', d: false,
            aciklama: 'İki dakika sonra hâlâ çalışma belleğinde; bu tekrar sana sahte bir başarı hissi verir, kalıcılığa katkısı düşük.' },
        ] },
      { id: 'a3', tip: 'rubrik', baslik: 'Tekrar alışkanlığı', maddeler: [
        'Yeni imge yerleştirdiğim günün akşamı rotayı bir kez yürüyeceğim.',
        'Prova notlarını dürüst vereceğim; zorlandığımda "Zor" diyeceğim.',
        'Sahne gelmiyorsa tekrar etmek yerine imgeyi yeniden kuracağım.',
      ] },
    ],
  },

  {
    id: 'd12', unite: 'u4', ad: 'Ölçeklemek ve son ölçüm',
    ozet: 'Birden fazla saray, sarayı yeniden kullanmak ve kursun başındaki testin tekrarı.',
    sure: 15,
    adimlar: [
      { id: 'a1', tip: 'anlat', baslik: 'Çok saraylı çalışmak', metin: `
        <p>Bir saray bir konuya ait olmalı. İki dersi aynı rotaya yığarsan imgeler birbirine karışır.</p>
        <p><strong>Saray stoku kur.</strong> Zamanla 5-10 mekanı hazır durakları çıkarılmış halde tut:
        evin, ailenin evi, okul, iş yeri, yürüyüş rotası, market, spor salonu.
        Yeni bir konu geldiğinde sıfırdan mekan aramazsın.</p>
        <p><strong>Yeniden kullanım.</strong> Sınav geçtikten sonra sarayı boşaltıp aynı durakları
        yeni içerikle kullanabilirsin. Eski imgeler bir süre hayalet gibi gelir;
        yeni imgeyi eskisinden belirgin biçimde daha çarpıcı kurarsan eskisi silinir.
        Acelesi olmayan içerik için ise ayrı bir saray tutmak daha temizdir.</p>
        <p><strong>Sınırı bil.</strong> Yöntem sıralı ve listelenebilir içerikte olağanüstüdür:
        tanımlar, sınıflandırmalar, adımlar, maddeler. Kavramı <em>anlamanın</em> yerine geçmez —
        anlamadığın bir şeyi hatırlayabilirsin ama kullanamazsın.</p>` },
      { id: 'a2', tip: 'uygula', baslik: 'İkinci sarayını kur', hedef: 'atolye',
        metin: `<p>Farklı bir mekandan <strong>ikinci bir saray</strong> kur ve en az
        <strong>8 durağını</strong> çıkar. İçerik koymak zorunda değilsin — stokta hazır dursun.</p>`,
        kontrol: (S) => {
          const liste = S.saraylar();
          if (liste.length < 2) return { tamam: false, mesaj: 'Henüz tek saray var. Atölye > + ile ikincisini kur.' };
          const uygun = liste.filter((s) => s.duraklar.length >= 8);
          if (uygun.length < 2) {
            return { tamam: false, mesaj: `${liste.length} saray var ama en az 8 durağı olan ${uygun.length} tane. İkinci sarayın duraklarını tamamla.` };
          }
          return { tamam: true, mesaj: `${uygun.length} saray hazır durumda. Stokun başladı.` };
        } },
      { id: 'a3', tip: 'anlat', baslik: 'Son ölçüm', metin: `
        <p>Sıra kursun başındaki testin eşine geldi: 15 akademik terim, aynı format, aynı süre.
        Tek fark, bu kez bir sarayın ve bir yöntemin var.</p>
        <p>Çalışma süresinde terimleri bir saraya yerleştir. Hangi sarayı kullanacağına önce karar ver —
        süre başlayınca mekan seçmekle uğraşmak istemezsin.</p>` },
      { id: 'a4', tip: 'drill', drill: 'son-test', baslik: 'Son test: 15 terim', gecmeNotu: 0,
        metin: '<p>90 saniye çalışma. Bu kez sarayını kullan.</p>' },
      { id: 'a5', tip: 'anlat', baslik: 'Bundan sonra', metin: `
        <p>Kurs bitti. Elinde kalanlar: en az iki saray, bir tekrar programı ve ölçülmüş bir ilerleme.</p>
        <p>Bundan sonrası alışkanlık: yeni konu geldiğinde stoktan bir saray seç,
        anahtar kelimeye indir, durak başına bir madde yerleştir, aynı akşam bir kez yürü,
        sonra provanın gösterdiği günlerde tekrar et.</p>
        <p>Takıldığın yeri Rapor ekranı söyler: sağlamlığı düşük imgeler kötü kurulmuş imgelerdir.
        Onları tekrar etmek yerine <strong>yeniden kur</strong>.</p>` },
    ],
  },
];

export const dersBul = (id) => DERSLER.find((d) => d.id === id) || null;
export const dersSira = (id) => DERSLER.findIndex((d) => d.id === id);
export const uniteDersleri = (uniteId) => DERSLER.filter((d) => d.unite === uniteId);
