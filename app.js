(function () {
  'use strict';

  var ICONS = {
    stamp: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="15" r="7"/><path d="M20 21v6h8v-6M12 33h24v5H12zM10 42h28"/></svg>',
    clock: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="15"/><path d="M24 15v9l6 4"/></svg>',
    mail:  '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="13" width="32" height="22" rx="4"/><path d="m9 15 15 11 15-11"/></svg>',
    shield:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M24 8 11 13v10c0 8 5.5 14 13 17 7.5-3 13-9 13-17V13z"/><path d="m18 24 4.5 4.5L31 20"/></svg>'
  };

  // Placeholder photography (Unsplash, free licence) — replace with own photos before launch
  var IMG = function (id, w) { return 'https://images.unsplash.com/photo-' + id + '?w=' + (w || 1200) + '&q=75&auto=format&fit=crop'; };
  var WHY_IMG = ['1450101499163-c8848c66ca85', '1554224155-6726b3ff858f', '1434030216411-0b793f4b4173', '1589829545856-d10d557cf95f'];
  var AUD_IMG = ['1600210492486-724fe5c67fb0', '1497366216548-37526070297c'];

  // floating words around the house: [word, language, left %, top %, size, depth]
  var FLOATS = [
    ['Język', 'PL', 7, 10, 'l', 1.0], ['Мова', 'UA', 74, 6, 'l', 0.8],
    ['Tłumaczenie', 'PL', 24, 34, 's', 0.5], ['Переклад', 'UA', 62, 30, 's', 0.6],
    ['Language', 'EN', 3, 56, 'm', 1.2], ['Язык', 'RU', 80, 52, 'm', 1.1],
    ['Translation', 'EN', 12, 84, 's', 0.7], ['Apostille', '✓', 76, 82, 's', 0.9]
  ];

  var NAV_HREF =['#uslugi', '#proces', '#cennik', '#o-nas', '#kontakt'];
  var CODES = ['UA', 'PL', 'EN', 'RU'];

  var T = {
    pl: {
      title: 'Movnyi Dim — biuro tłumaczeń przysięgłych EN · PL · UA · RU',
      nav: [['Usługi', 'przysięgłe i zwykłe'], ['Jak pracujemy?', '4 proste kroki'], ['Cennik', 'od 49 zł za stronę'], ['O nas', 'poznaj Movnyi Dim'], ['Kontakt', 'napisz do nas']],
      eyebrow: 'Tłumaczenia przysięgłe EN · PL · UA · RU',
      h1: 'Przetłumaczymy Twoje dokumenty bez stresu.',
      lead: '<b>Zajmiemy się wszystkim</b> – od wyceny po odbiór gotowego tłumaczenia.<br>Ekspres w 24 h, wycena w 15 minut.',
      more: 'Chcę wiedzieć więcej',
      sideA: 'Tłumacz<br>przysięgły', sideB: 'EN · PL<br>UA · RU',
      barQ: 'Potrzebuję<br>tłumaczenia:',
      barA: 'Przysięgłego', barB: 'Zwykłego',
      stat1: 'stron rocznie', stat2u: 'h', stat2: 'tryb ekspres',
      whyTitle: '<span class="accent">Dlaczego</span> Movnyi Dim?',
      why: [
        { t: 'Tłumacz <span class="accent">przysięgły</span>', d: 'Uwierzytelnione tłumaczenia akceptowane przez urzędy, sądy i uczelnie. Pieczęć i podpis tłumacza przysięgłego.', i: 'stamp' },
        { t: 'Wycena <span class="accent">w 15 minut</span>', d: 'Wyślij skan lub zdjęcie — odpowiemy z ceną i terminem jeszcze w tym samym kwadransie. Bez zobowiązań.', i: 'clock' },
        { t: 'Odbiór <span class="accent">online</span>', d: 'Skan z pieczęcią mailem, oryginał kurierem lub osobiście w biurze. Nawet jeśli jesteś za granicą, zajmiemy się wszystkim.', i: 'mail' },
        { t: 'Pełna <span class="accent">poufność</span>', d: 'Twoje dokumenty są bezpieczne. Pracujemy zgodnie z RODO, a pliki usuwamy po zakończeniu zlecenia.', i: 'shield' }
      ],
      stTitle: '<span class="accent">Język</span><br>nie ma<br>dla nas tajemnic',
      stText: 'Tłumaczymy z angielskiego, polskiego, ukraińskiego i rosyjskiego — we wszystkich kierunkach. Znamy wymagania polskich urzędów, dlatego nasze tłumaczenia przechodzą bez poprawek. Tłumacz i korektor sprawdzają każdy dokument co do przecinka.',
      stBtn: 'Poznaj nas',
      marquee: 'Język nie ma dla nas tajemnic',
      howTitle: '<span class="accent">Jak</span><br>pracujemy?',
      howSub: 'Nasz proces opiera się na 4 krokach.',
      steps: [
        ['Wysyłasz dokument', 'Zdjęcie lub skan przez formularz, e-mail albo WhatsApp. Wystarczy czytelna kopia.'],
        ['Otrzymujesz wycenę', 'Cena i termin w 15 minut. Bez zobowiązań — decydujesz, czy zlecasz.'],
        ['Tłumaczymy i sprawdzamy', 'Tłumacz + korektor. Zgodność z oryginałem co do przecinka, poprawna terminologia.'],
        ['Odbierasz gotowe', 'Online, kurierem lub w biurze — jak Ci wygodnie. Ty tylko składasz dokumenty w urzędzie.']
      ],
      logosLabel: 'Nasze tłumaczenia składasz w',
      logos: ['Urząd Wojewódzki', 'USC', 'ZUS', 'Sąd Okręgowy', 'Uczelnie', 'Urząd Skarbowy', 'Notariusz', 'Bank'],
      b1Title: 'Ekspres<br>w 24 godziny', b1Text: 'Tyle zajmuje tłumaczenie typowego dokumentu w trybie ekspres', b1Unit: 'godziny',
      b2Title: 'Cztery języki', b2Text: 'EN · PL · UA · RU — we wszystkich kierunkach', b2Unit: 'języki',
      b3Title: 'Szybka wycena', b3Text: 'Odpowiadamy z ceną i terminem w godzinach pracy biura', b3Unit: 'minut',
      revTitle: '<span class="accent">Historie</span> naszych klientów',
      revSub: 'Cieszymy się zaufaniem osób takich, jak Ty',
      reviews: [
        ['Olena Kovalenko', 'Tłumaczenie aktu urodzenia gotowe w jeden dzień, urząd przyjął bez pytań. Bardzo miła obsługa po ukraińsku i po polsku.'],
        ['Miejsce na opinię', 'Tu pojawi się kolejna prawdziwa opinia klienta z Google. Podmień ten tekst przed publikacją strony.']
      ],
      audTitle: '<span class="accent">Potrzebuję</span>tłumaczenia<br>dla...',
      aud: [
        ['Osoby prywatnej', 'Akty stanu cywilnego, dyplomy, prawo jazdy, dokumenty do karty pobytu i obywatelstwa. Zajmiemy się wszystkim — od wyceny po odbiór.'],
        ['Firmy', 'Umowy, dokumenty rejestrowe, dokumentacja techniczna i korespondencja. Stała współpraca, faktura VAT i terminy, na których możesz polegać.']
      ],
      audBtn: 'Chcę wiedzieć więcej',
      formTitle: 'Porozmawiajmy',
      formSub: 'Wycenimy Twoje tłumaczenie.<br>Zostaw wiadomość — odpiszemy w 15 minut.',
      from: 'Z języka', to: 'Na język', type: 'Rodzaj tłumaczenia',
      types: ['Przysięgłe (uwierzytelnione)', 'Zwykłe', 'Specjalistyczne (prawo, medycyna)'],
      fileLabel: 'Dokument do wyceny', fileBtn: 'Wybierz plik', fileHint: 'PDF, DOCX, JPG · do 25 MB',
      msg: 'Twoja wiadomość', name: 'Imię', email: 'Email', phone: 'Numer telefonu',
      agree: 'Akceptuję <a href="#">politykę prywatności</a>',
      send: 'Wyślij wiadomość',
      errName: 'Wpisz imię', errEmail: 'Wpisz poprawny e-mail', errPhone: 'Wpisz pełny numer, np. +48 600 000 000',
      errFile: 'Dozwolone: PDF, DOCX, JPG, PNG do 25 MB', errAgree: 'Zaznacz zgodę',
      okTitle: 'Dziękujemy!', okText: 'Wiadomość dotarła. Odpiszemy z wyceną w ciągu 15 minut w godzinach pracy biura.', okAgain: 'Wyślij kolejną',
      slogan: '<i>Znamy</i> język urzędów<br>jak nikt <em>inny.</em>',
      addr: 'Warszawa, Polska',
      fcols: [
        ['Na skróty', [['Strona główna', '#top'], ['O nas', '#o-nas'], ['Blog', '#'], ['Kontakt', '#kontakt']]],
        ['Usługi', [['Tłumaczenia przysięgłe', '#uslugi'], ['Tłumaczenia zwykłe', '#uslugi'], ['Tłumaczenia specjalistyczne', '#uslugi'], ['Ekspres 24 h', '#kontakt']]],
        ['Języki', [['Angielski', '#kontakt'], ['Polski', '#kontakt'], ['Ukraiński', '#kontakt'], ['Rosyjski', '#kontakt']]]
      ],
      contactBtn: 'Kontakt z nami', privacy: 'Polityka prywatności', callNow: 'Zadzwoń teraz',
      langNames: { UA: 'ukraiński', PL: 'polski', EN: 'angielski', RU: 'rosyjski' }
    },

    ua: {
      title: 'Мовний дім — бюро присяжних перекладів EN · PL · UA · RU',
      nav: [['Послуги', 'присяжні та звичайні'], ['Як ми працюємо?', '4 прості кроки'], ['Ціни', 'від 49 зл за сторінку'], ['Про нас', 'знайомтеся з нами'], ['Контакти', 'напишіть нам']],
      eyebrow: 'Присяжні переклади EN · PL · UA · RU',
      h1: 'Перекладемо ваші документи без стресу.',
      lead: '<b>Візьмемо все на себе</b> – від розрахунку до отримання готового перекладу.<br>Експрес за 24 год, розрахунок за 15 хвилин.',
      more: 'Хочу дізнатися більше',
      sideA: 'Присяжний<br>перекладач', sideB: 'EN · PL<br>UA · RU',
      barQ: 'Мені потрібен<br>переклад:',
      barA: 'Присяжний', barB: 'Звичайний',
      stat1: 'сторінок на рік', stat2u: 'год', stat2: 'експрес-режим',
      whyTitle: '<span class="accent">Чому</span> Мовний дім?',
      why: [
        { t: 'Присяжний <span class="accent">перекладач</span>', d: 'Завірені переклади, які приймають уряди, суди та університети Польщі. Печатка й підпис присяжного перекладача.', i: 'stamp' },
        { t: 'Розрахунок <span class="accent">за 15 хвилин</span>', d: 'Надішліть скан чи фото — відповімо з ціною та терміном протягом чверті години. Без зобов’язань.', i: 'clock' },
        { t: 'Отримання <span class="accent">онлайн</span>', d: 'Скан з печаткою на e-mail, оригінал кур’єром або особисто в офісі. Навіть якщо ви за кордоном — візьмемо все на себе.', i: 'mail' },
        { t: 'Повна <span class="accent">конфіденційність</span>', d: 'Ваші документи в безпеці. Працюємо відповідно до RODO, а файли видаляємо після завершення замовлення.', i: 'shield' }
      ],
      stTitle: '<span class="accent">Мова</span><br>не має<br>для нас таємниць',
      stText: 'Перекладаємо з англійської, польської, української та російської — в усіх напрямках. Знаємо вимоги польських установ, тому наші переклади приймають без виправлень. Перекладач і коректор перевіряють кожен документ до коми.',
      stBtn: 'Знайомтеся з нами',
      marquee: 'Мова не має для нас таємниць',
      howTitle: '<span class="accent">Як</span><br>ми працюємо?',
      howSub: 'Наш процес складається з 4 кроків.',
      steps: [
        ['Надсилаєте документ', 'Фото чи скан через форму, e-mail або WhatsApp. Достатньо розбірливої копії.'],
        ['Отримуєте розрахунок', 'Ціна й термін за 15 хвилин. Без зобов’язань — ви вирішуєте, чи замовляти.'],
        ['Перекладаємо й перевіряємо', 'Перекладач + коректор. Точно до оригіналу, до коми, з правильною термінологією.'],
        ['Забираєте готове', 'Онлайн, кур’єром або в офісі — як вам зручно. Вам лишається тільки подати документи.']
      ],
      logosLabel: 'Наші переклади подають до',
      logos: ['Urząd Wojewódzki', 'USC', 'ZUS', 'Sąd Okręgowy', 'Університети', 'Urząd Skarbowy', 'Нотаріус', 'Банк'],
      b1Title: 'Експрес<br>за 24 години', b1Text: 'Стільки займає переклад типового документа в експрес-режимі', b1Unit: 'години',
      b2Title: 'Чотири мови', b2Text: 'EN · PL · UA · RU — в усіх напрямках', b2Unit: 'мови',
      b3Title: 'Швидкий розрахунок', b3Text: 'Відповідаємо з ціною та терміном у робочий час бюро', b3Unit: 'хвилин',
      revTitle: '<span class="accent">Історії</span> наших клієнтів',
      revSub: 'Нам довіряють такі люди, як ви',
      reviews: [
        ['Olena Kovalenko', 'Переклад свідоцтва про народження був готовий за день, ужонд прийняв без питань. Дуже приємне обслуговування українською та польською.'],
        ['Місце для відгуку', 'Тут з’явиться ще один справжній відгук клієнта з Google. Замініть цей текст перед публікацією сайту.']
      ],
      audTitle: '<span class="accent">Мені потрібен</span>переклад<br>для...',
      aud: [
        ['Приватної особи', 'Свідоцтва, дипломи, посвідчення водія, документи для карти побиту та громадянства. Візьмемо все на себе — від розрахунку до отримання.'],
        ['Бізнесу', 'Договори, реєстраційні документи, технічна документація та листування. Постійна співпраця, фактура VAT і терміни, на які можна покластися.']
      ],
      audBtn: 'Хочу дізнатися більше',
      formTitle: 'Поговорімо',
      formSub: 'Розрахуємо вартість перекладу.<br>Залиште повідомлення — відповімо за 15 хвилин.',
      from: 'З мови', to: 'На мову', type: 'Тип перекладу',
      types: ['Присяжний (завірений)', 'Звичайний', 'Спеціалізований (право, медицина)'],
      fileLabel: 'Документ для розрахунку', fileBtn: 'Оберіть файл', fileHint: 'PDF, DOCX, JPG · до 25 МБ',
      msg: 'Ваше повідомлення', name: 'Ім’я', email: 'Email', phone: 'Номер телефону',
      agree: 'Приймаю <a href="#">політику конфіденційності</a>',
      send: 'Надіслати повідомлення',
      errName: 'Введіть ім’я', errEmail: 'Введіть правильний e-mail', errPhone: 'Введіть повний номер, напр. +48 600 000 000',
      errFile: 'Дозволено: PDF, DOCX, JPG, PNG до 25 МБ', errAgree: 'Позначте згоду',
      okTitle: 'Дякуємо!', okText: 'Повідомлення отримано. Відповімо з розрахунком протягом 15 хвилин у робочий час бюро.', okAgain: 'Надіслати ще одне',
      slogan: '<i>Знаємо</i> мову установ<br>як ніхто <em>інший.</em>',
      addr: 'Варшава, Польща',
      fcols: [
        ['Швидкі посилання', [['Головна', '#top'], ['Про нас', '#o-nas'], ['Блог', '#'], ['Контакти', '#kontakt']]],
        ['Послуги', [['Присяжні переклади', '#uslugi'], ['Звичайні переклади', '#uslugi'], ['Спеціалізовані переклади', '#uslugi'], ['Експрес 24 год', '#kontakt']]],
        ['Мови', [['Англійська', '#kontakt'], ['Польська', '#kontakt'], ['Українська', '#kontakt'], ['Російська', '#kontakt']]]
      ],
      contactBtn: 'Зв’язатися з нами', privacy: 'Політика конфіденційності', callNow: 'Зателефонуйте',
      langNames: { UA: 'українська', PL: 'польська', EN: 'англійська', RU: 'російська' }
    }
  };

  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = 'pl';
  var slide = 0;
  var chosen = null;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  // ---------- Render ----------
  function render() {
    var t = T[lang];
    document.documentElement.lang = lang === 'ua' ? 'uk' : 'pl';
    document.title = t.title;

    $$('[data-t]').forEach(function (n) { var v = t[n.dataset.t]; if (typeof v === 'string') n.textContent = v; });
    $$('[data-html]').forEach(function (n) { var v = t[n.dataset.html]; if (typeof v === 'string') n.innerHTML = v; });
    $$('[data-ph]').forEach(function (n) { n.placeholder = t[n.dataset.ph]; });
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });

    $('[data-nav]').innerHTML = t.nav.map(function (n, i) {
      return '<a href="' + NAV_HREF[i] + '"><span>' + esc(n[0]) + '</span><small>' + esc(n[1]) + '</small></a>';
    }).join('');

    $('[data-stack]').innerHTML = t.why.map(function (c, i) {
      return '<div class="stack-item"><article class="stack-card">' +
        '<div class="stack-copy"><h3 class="split">' + c.t + '</h3><p class="fade">' + esc(c.d) + '</p></div>' +
        '<div class="stack-media"><div class="ph" style="--img:url(\'' + IMG(WHY_IMG[i], 1100) + '\')"></div><div class="dots"></div>' +
        '<div class="icon-tile">' + ICONS[c.i] + '</div></div>' +
        '</article></div>';
    }).join('');

    var mtext = new Array(4).join(t.marquee + '  ');
    $$('[data-mtext]').forEach(function (n) { n.innerHTML = '<span class="mq">' + esc(mtext + mtext) + '</span>'; });

    var fl = $('[data-floats]');
    if (fl) fl.innerHTML = FLOATS.map(function (f, i) {
      return '<div class="fw fw-' + f[4] + '" data-depth="' + f[5] + '" style="left:' + f[2] + '%;top:' + f[3] + '%">' +
        '<div class="pop" style="transition-delay:' + (0.15 + i * 0.12).toFixed(2) + 's">' +
        '<div class="chip" style="--d:' + (6 + (i % 4) * 1.3).toFixed(1) + 's;--dl:-' + (i * 0.9).toFixed(1) + 's;--r:' + (i % 2 ? 2 : -2) + 'deg">' +
        esc(f[0]) + '<b>' + esc(f[1]) + '</b></div></div></div>';
    }).join('');

    $('[data-steps]').innerHTML = t.steps.map(function (s, i) {
      return '<div class="step fade-up"><span class="step-num" aria-hidden="true" data-sy="30,-30">0' + (i + 1) + '</span><h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p></div>';
    }).join('');

    var logos = t.logos.map(function (l) { return '<span>' + esc(l) + '</span>'; }).join('');
    $('[data-logos]').innerHTML = logos + logos;

    $('[data-slides]').innerHTML = '<div class="track">' + t.reviews.map(function (r) {
      var initials = r[0].split(' ').map(function (p) { return p[0]; }).join('').slice(0, 2);
      return '<div class="slide"><div class="reviewer"><span class="avatar">' + esc(initials) + '</span>' +
        '<div><div class="stars">★★★★★</div><b>' + esc(r[0]) + '</b></div></div><blockquote>' + esc(r[1]) + '</blockquote></div>';
    }).join('') + '</div>';
    go(0);

    $('[data-aud]').innerHTML = t.aud.map(function (a, i) {
      return '<a class="aud-card fade" href="#kontakt"><div class="bg" style="--img:url(\'' + IMG(AUD_IMG[i], 1300) + '\')"></div>' +
        '<h3>' + esc(a[0]) + '</h3><p>' + esc(a[1]) + '</p><span class="btn btn-outline-light">' + esc(t.audBtn) + '</span></a>';
    }).join('');

    $('[data-fcols]').innerHTML = t.fcols.map(function (c) {
      return '<div><h4>' + esc(c[0]) + '</h4><ul>' + c[1].map(function (l) {
        return '<li><a href="' + l[1] + '">' + esc(l[0]) + '</a></li>';
      }).join('') + '</ul></div>';
    }).join('');

    // form selects
    var from = $('#from'), to = $('#to');
    var fv = from.value || 'UA', tv = to.value || 'PL';
    [from, to].forEach(function (s) {
      s.innerHTML = CODES.map(function (c) { return '<option value="' + c + '">' + c + ' — ' + esc(t.langNames[c]) + '</option>'; }).join('');
    });
    from.value = fv; to.value = tv;
    var type = $('#type'), tyv = type.selectedIndex;
    type.innerHTML = t.types.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('');
    type.selectedIndex = tyv < 0 ? 0 : tyv;
    if (chosen) $('[data-filename]').textContent = chosen.name;

    observeReveals();
    initMotion();
  }

  function setLang(l) { lang = l; store('md-lang', l); render(); onScroll(); }
  $$('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.lang); }); });

  // ---------- Reveal on scroll (fadeIn / fadeInUp) + counters ----------
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
  function observeReveals() {
    $$('.fade:not(.in), .fade-up:not(.in), .rise:not(.in)').forEach(function (n) { if (io && !REDUCED) io.observe(n); else n.classList.add('in'); });
  }

  function fmt(n, sep) { return sep ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep) : String(n); }
  function countUp(el) {
    var end = +el.dataset.count, sep = el.dataset.sep, dur = 1800, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(end * e), sep);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var cio = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.5 }) : null;
  $$('[data-count]').forEach(function (n) {
    if (cio && !matchMedia('(prefers-reduced-motion: reduce)').matches) cio.observe(n);
    else n.textContent = fmt(n.dataset.count, n.dataset.sep);
  });

  // ---------- Header hide/show, FAB ----------
  var header = $('#header'), fab = $('#fab');
  var lastY = window.scrollY;

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    header.classList.toggle('hide', y > 400 && y > lastY && !$('#nav').classList.contains('open'));
    fab.classList.toggle('show', y > 600);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Motion engine (mirrors the reference's GSAP ScrollTrigger setup) ----------
  // .split   — words rise from a mask, stagger .05s, when the heading centre passes 95% of the viewport
  // .type1   — footer slogan: letters unfold (rotateY 90° → 0) scrubbed between centre 80% → 40%
  // data-sy / data-sx="from,to" — translate in % of own size, scrubbed while the parent crosses the viewport
  // .stack-item — card scales 1 → .8 and fades out from its bottom at 60% of the viewport until it leaves
  // [data-clip] — section shrinks into a rounded card (inset 0 → 8% / 4%, radius 0 → 40px)
  var M = { splits: [], scrubs: [], cards: [], chars: [], slogan: null, clip: null, rows: [], scene: null, floats: [], mx: 0, my: 0, tx: 0, ty: 0, run: false };
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    M.tx = e.clientX / window.innerWidth * 2 - 1;
    M.ty = e.clientY / window.innerHeight * 2 - 1;
  }, { passive: true });

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function mix(a, b, p) { return a + (b - a) * p; }

  function splitWords(el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var m = document.createElement('span'), w = document.createElement('span');
            m.className = 'wm'; w.className = 'wi'; w.textContent = part;
            w.style.transitionDelay = (i++ * 0.05).toFixed(2) + 's';
            m.appendChild(w); frag.appendChild(m);
          });
          c.parentNode.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
      });
    })(el);
    el.classList.remove('in');
  }

  function splitChars(el) {
    var chars = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var wd = document.createElement('span'); wd.className = 'wd';
            Array.prototype.forEach.call(part, function (ch) {
              var s = document.createElement('span'); s.className = 'ch'; s.textContent = ch;
              wd.appendChild(s); chars.push(s);
            });
            frag.appendChild(wd);
          });
          c.parentNode.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
      });
    })(el);
    return chars;
  }

  function measureCards() {
    M.cards.forEach(function (c) {
      c.item.style.position = 'relative';
      var r = c.item.getBoundingClientRect();
      c.bottom = r.top + window.scrollY + r.height;
      c.item.style.position = '';
    });
  }

  function initMotion() {
    M.splits = $$('.split');
    M.splits.forEach(splitWords);
    M.scrubs = $$('[data-sy],[data-sx]').map(function (el) {
      var y = el.dataset.sy ? el.dataset.sy.split(',').map(Number) : null;
      var x = el.dataset.sx ? el.dataset.sx.split(',').map(Number) : null;
      return { el: el, ref: el.parentElement, x: x, y: y, k: +(el.dataset.k || 0.1), cur: null };
    });
    M.cards = $$('.stack-item').map(function (item) { return { item: item, card: item.firstElementChild, cur: 0 }; });
    measureCards();
    M.slogan = $('.type1');
    M.chars = M.slogan ? splitChars(M.slogan) : [];
    M.sloganP = 0;
    M.clip = $('[data-clip]');
    M.scene = $('[data-marquee]');
    M.rows = M.scene ? $$('.marquee-row', M.scene) : [];
    M.floats = $$('.fw').map(function (el) { return { el: el, d: +el.dataset.depth }; });
    if (REDUCED) {
      M.splits.forEach(function (n) { n.classList.add('in'); });
      M.chars.forEach(function (c) { c.style.opacity = 1; });
      if (M.scene) M.scene.classList.add('in');
      return;
    }
    if (!M.run) { M.run = true; requestAnimationFrame(frame); }
  }

  function frame() {
    var vh = window.innerHeight, vw = window.innerWidth, sy = window.scrollY;

    // headings: words rise once their centre passes 95% of the viewport
    M.splits.forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.height && r.top + r.height / 2 < vh * 0.95) el.classList.add('in');
    });

    // scrubbed translations ("top bottom" → "bottom top"), smoothed like GSAP scrub
    M.scrubs.forEach(function (s) {
      var r = s.ref.getBoundingClientRect();
      var p = clamp((vh - r.top) / (vh + r.height));
      s.cur = s.cur === null ? p : s.cur + (p - s.cur) * s.k;
      var t = '';
      if (s.x) t += 'translateX(' + mix(s.x[0], s.x[1], s.cur).toFixed(2) + '%) ';
      if (s.y) t += 'translateY(' + mix(s.y[0], s.y[1], s.cur).toFixed(2) + '%)';
      s.el.style.transform = t;
    });

    // stacked cards: scale 1 → .8, opacity 1 → 0 (start: bottom at 60% vh, end: bottom at top)
    M.cards.forEach(function (c) {
      if (vw <= 900) { c.card.style.transform = ''; c.card.style.opacity = ''; return; }
      var p = clamp((sy + vh * 0.6 - c.bottom) / (vh * 0.6));
      c.cur += (p - c.cur) * 0.1;
      c.card.style.transform = 'scale(' + (1 - 0.2 * c.cur).toFixed(4) + ')';
      c.card.style.opacity = (1 - c.cur).toFixed(3);
    });

    // giant text rows: scroll offset on top of their own endless loop
    if (M.scene) {
      var prog = vh - M.scene.getBoundingClientRect().top;
      M.rows.forEach(function (row) {
        var sp = parseFloat(row.dataset.speed);
        var base = sp < 0 ? -vw * 0.1 : -row.scrollWidth / 4 + vw * 0.1;
        row.style.transform = 'translate3d(' + (base + prog * sp).toFixed(1) + 'px,0,0)';
      });
    }

    // floating words: pop in when the scene arrives, then drift with scroll depth + cursor
    if (M.scene && M.floats.length) {
      var rf = M.scene.getBoundingClientRect();
      if (rf.top < vh * 0.75 && rf.bottom > 0) M.scene.classList.add('in');
      var pf = clamp((vh - rf.top) / (vh + rf.height)) - 0.5;
      M.mx += (M.tx - M.mx) * 0.06; M.my += (M.ty - M.my) * 0.06;
      M.floats.forEach(function (f) {
        var x = M.mx * f.d * 26, y = -pf * f.d * 160 + M.my * f.d * 18;
        f.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      });
    }

    // footer slogan: letters unfold, scrubbed centre 80% → 40%
    if (M.slogan && M.chars.length) {
      var rs = M.slogan.getBoundingClientRect(), cy = rs.top + rs.height / 2;
      var ps = clamp((vh * 0.8 - cy) / (vh * 0.4));
      M.sloganP += (ps - M.sloganP) * 0.06;
      var n = M.chars.length, st = 0.6 / n;
      M.chars.forEach(function (ch, i) {
        var e = clamp((M.sloganP - i * st) / 0.4);
        e = 1 - Math.pow(1 - e, 3);
        ch.style.opacity = e.toFixed(3);
        ch.style.transform = 'rotateY(' + ((1 - e) * 90).toFixed(1) + 'deg)';
      });
    }

    // contact section shrinks into a rounded card as it scrolls away
    if (M.clip) {
      var rc = M.clip.getBoundingClientRect();
      var pc = vw > 640 ? clamp(-rc.top / rc.height) : 0;
      M.clip.style.clipPath = pc > 0
        ? 'inset(0 ' + (8 * pc).toFixed(2) + '% ' + (4 * pc).toFixed(2) + '% ' + (8 * pc).toFixed(2) + '% round ' + (40 * pc).toFixed(1) + 'px)'
        : '';
    }

    requestAnimationFrame(frame);
  }
  window.addEventListener('resize', function () { measureCards(); });
  window.addEventListener('load', function () { measureCards(); });

  // ---------- Mobile menu ----------
  var burger = $('.burger'), nav = $('#nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  // ---------- Reviews slider ----------
  // track slides like Flickity: drag / swipe, arrows, progress bar
  function go(d) {
    var track = $('.track'), slides = $$('.slide');
    if (!track || !slides.length) return;
    slide = (slide + d + slides.length) % slides.length;
    track.style.transition = '';
    track.style.transform = 'translateX(' + (-slide * 100) + '%)';
    slides.forEach(function (s, i) { s.classList.toggle('active', i === slide); });
    var bar = $('.slider-progress i');
    if (bar) bar.style.width = ((slide + 1) / slides.length * 100) + '%';
  }
  $('[data-prev]').addEventListener('click', function () { go(-1); });
  $('[data-next]').addEventListener('click', function () { go(1); });
  (function () {
    var box = $('[data-slides]'), x0 = null, dx = 0;
    box.addEventListener('pointerdown', function (e) { x0 = e.clientX; dx = 0; box.setPointerCapture(e.pointerId); });
    box.addEventListener('pointermove', function (e) {
      if (x0 === null) return;
      dx = e.clientX - x0;
      var track = $('.track');
      track.style.transition = 'none';
      track.style.transform = 'translateX(calc(' + (-slide * 100) + '% + ' + dx + 'px))';
    });
    function end() { if (x0 === null) return; x0 = null; go(dx < -50 ? 1 : dx > 50 ? -1 : 0); }
    box.addEventListener('pointerup', end);
    box.addEventListener('pointercancel', end);
  })();

  // ---------- Form ----------
  var fileInput = $('#file');
  fileInput.addEventListener('change', function () {
    chosen = fileInput.files[0] || null;
    $('[data-filename]').textContent = chosen ? chosen.name : T[lang].fileHint;
    check('file');
  });
  var rules = {
    name: function () { return $('#name').value.trim().length > 1; },
    email: function () { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#email').value.trim()); },
    phone: function () { return /^\+\d{9,15}$/.test($('#phone').value.replace(/[\s\-()]/g, '')); },
    agree: function () { return $('#agree').checked; },
    file: function () { return !chosen || (/\.(pdf|docx|jpe?g|png)$/i.test(chosen.name) && chosen.size <= 25 * 1024 * 1024); }
  };
  function check(k) { var ok = rules[k](); $('[data-f="' + k + '"]').classList.toggle('err', !ok); return ok; }
  ['name', 'email', 'phone'].forEach(function (k) {
    $('#' + k).addEventListener('blur', function () { check(k); });
    $('#' + k).addEventListener('input', function () { if ($('[data-f="' + k + '"]').classList.contains('err')) check(k); });
  });
  $('#agree').addEventListener('change', function () { check('agree'); });
  $('#form').addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = Object.keys(rules).map(check).every(Boolean);
    if (!ok) { var f = $('.f.err input, .f.err textarea'); if (f) f.focus(); return; }
    // TODO: send to e-mail / CRM endpoint
    $('#formCard').classList.add('done');
  });
  $('[data-reset]').addEventListener('click', function () {
    $('#form').reset(); chosen = null; $('[data-filename]').textContent = T[lang].fileHint;
    $('#formCard').classList.remove('done');
  });

  // ---------- Init ----------
  var saved = store('md-lang');
  if (saved && T[saved]) lang = saved;
  render();
  onScroll();
  window.__mdReady = true;
})();
