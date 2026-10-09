(function () {
  'use strict';

  var ICONS = {
    stamp: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="15" r="7"/><path d="M20 21v6h8v-6M12 33h24v5H12zM10 42h28"/></svg>',
    clock: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="15"/><path d="M24 15v9l6 4"/></svg>',
    mail:  '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="13" width="32" height="22" rx="4"/><path d="m9 15 15 11 15-11"/></svg>',
    shield:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M24 8 11 13v10c0 8 5.5 14 13 17 7.5-3 13-9 13-17V13z"/><path d="m18 24 4.5 4.5L31 20"/></svg>'
  };

  var NAV_HREF = ['#uslugi', '#proces', '#cennik', '#o-nas', '#kontakt'];
  var CODES = ['UA', 'PL', 'EN', 'RU'];

  var T = {
    pl: {
      title: 'Movnyi Dim — biuro tłumaczeń przysięgłych EN · PL · UA · RU',
      nav: [['Usługi', 'przysięgłe i zwykłe'], ['Jak pracujemy?', '4 proste kroki'], ['Cennik', 'od 49 zł za stronę'], ['O nas', 'poznaj Movnyi Dim'], ['Kontakt', 'napisz do nas']],
      eyebrow: 'Tłumaczenia przysięgłe EN · PL · UA · RU',
      h1: 'Przetłumaczymy Twoje dokumenty bez stresu.',
      lead: '<b>Zajmiemy się wszystkim</b> – od wyceny po odbiór gotowego tłumaczenia. Ekspres w 24 h, wycena w 15 minut.',
      more: 'Chcę wiedzieć więcej',
      barQ: 'Potrzebuję tłumaczenia:',
      barA: 'Przysięgłego', barB: 'Zwykłego',
      stat1: 'stron rocznie', stat2v: '24 h', stat2: 'tryb ekspres',
      phHero: 'zdjęcie · tłumacz przy biurku', phCity: 'zdjęcie · dokumenty', phOffice: 'zdjęcie · biuro',
      whyTitle: '<span class="accent">Dlaczego</span> Movnyi Dim?',
      why: [
        { t: 'Tłumacz <span class="accent">przysięgły</span>', d: 'Uwierzytelnione tłumaczenia akceptowane przez urzędy, sądy i uczelnie. Pieczęć i podpis tłumacza przysięgłego.', i: 'stamp', ph: 'zdjęcie · pieczęć' },
        { t: 'Wycena w <span class="accent">15 minut</span>', d: 'Wyślij skan lub zdjęcie — odpowiemy z ceną i terminem jeszcze w tym samym kwadransie. Bez zobowiązań.', i: 'clock', ph: 'zdjęcie · telefon' },
        { t: 'Odbiór <span class="accent">online</span>', d: 'Skan z pieczęcią mailem, oryginał kurierem lub osobiście w biurze. Nawet jeśli jesteś za granicą.', i: 'mail', ph: 'zdjęcie · koperta' },
        { t: 'Pełna <span class="accent">poufność</span>', d: 'Twoje dokumenty są bezpieczne. Pracujemy zgodnie z RODO, a pliki usuwamy po zakończeniu zlecenia.', i: 'shield', ph: 'zdjęcie · dokumenty' }
      ],
      stTitle: '<span class="accent">Język</span><br>nie ma<br>dla nas tajemnic',
      stText: 'Tłumaczymy z angielskiego, polskiego, ukraińskiego i rosyjskiego — we wszystkich kierunkach. Znamy wymagania polskich urzędów, dlatego nasze tłumaczenia przechodzą bez poprawek. Tłumacz i korektor sprawdzają każdy dokument co do przecinka.',
      stBtn: 'Poznaj nas',
      marquee: 'Język nie ma dla nas tajemnic · ',
      howTitle: '<span class="accent">Jak</span><br>pracujemy?',
      howSub: 'Nasz proces opiera się na 4 krokach.',
      steps: [
        ['Wysyłasz<br>dokument', 'Zdjęcie lub skan przez formularz, e-mail albo WhatsApp. Wystarczy czytelna kopia.'],
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
      audTitle: '<span class="accent">Potrzebuję</span><br>tłumaczenia dla...',
      aud: [
        ['Osoby prywatnej', 'Akty stanu cywilnego, dyplomy, prawo jazdy, dokumenty do karty pobytu i obywatelstwa. Zajmiemy się wszystkim — od wyceny po odbiór.', 'zdjęcie · dokumenty', 'dark'],
        ['Firmy', 'Umowy, dokumenty rejestrowe, dokumentacja techniczna i korespondencja. Stała współpraca, faktura VAT i terminy, na których możesz polegać.', 'zdjęcie · biuro', 'grey']
      ],
      audBtn: 'Chcę wiedzieć więcej',
      formTitle: 'Porozmawiajmy',
      formSub: 'Wycenimy Twoje tłumaczenie. Zostaw wiadomość — odpiszemy w 15 minut.',
      from: 'Z języka', to: 'Na język', type: 'Rodzaj tłumaczenia',
      types: ['Przysięgłe (uwierzytelnione)', 'Zwykłe', 'Specjalistyczne (prawo, medycyna)'],
      fileLabel: 'Dokument do wyceny', fileBtn: 'Wybierz plik', fileHint: 'PDF, DOCX, JPG · do 25 MB',
      msg: 'Twoja wiadomość', name: 'Imię', email: 'Email', phone: 'Numer telefonu',
      agree: 'Akceptuję <a href="#">politykę prywatności</a>',
      send: 'Wyślij wiadomość',
      errName: 'Wpisz imię', errEmail: 'Wpisz poprawny e-mail', errPhone: 'Wpisz pełny numer, np. +48 600 000 000',
      errFile: 'Dozwolone: PDF, DOCX, JPG, PNG do 25 MB', errAgree: 'Zaznacz zgodę',
      okTitle: 'Dziękujemy!', okText: 'Wiadomość dotarła. Odpiszemy z wyceną w ciągu 15 minut w godzinach pracy biura.', okAgain: 'Wyślij kolejną',
      slogan: '<i>Znamy</i> język urzędów<br>jak nikt inny.',
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
      lead: '<b>Візьмемо все на себе</b> – від розрахунку до отримання готового перекладу. Експрес за 24 год, розрахунок за 15 хвилин.',
      more: 'Хочу дізнатися більше',
      barQ: 'Мені потрібен переклад:',
      barA: 'Присяжний', barB: 'Звичайний',
      stat1: 'сторінок на рік', stat2v: '24 год', stat2: 'експрес-режим',
      phHero: 'фото · перекладач за столом', phCity: 'фото · документи', phOffice: 'фото · офіс',
      whyTitle: '<span class="accent">Чому</span> Мовний дім?',
      why: [
        { t: 'Присяжний <span class="accent">перекладач</span>', d: 'Завірені переклади, які приймають уряди, суди та університети Польщі. Печатка й підпис присяжного перекладача.', i: 'stamp', ph: 'фото · печатка' },
        { t: 'Розрахунок за <span class="accent">15 хвилин</span>', d: 'Надішліть скан чи фото — відповімо з ціною та терміном протягом чверті години. Без зобов’язань.', i: 'clock', ph: 'фото · телефон' },
        { t: 'Отримання <span class="accent">онлайн</span>', d: 'Скан з печаткою на e-mail, оригінал кур’єром або особисто в офісі. Навіть якщо ви за кордоном.', i: 'mail', ph: 'фото · конверт' },
        { t: 'Повна <span class="accent">конфіденційність</span>', d: 'Ваші документи в безпеці. Працюємо відповідно до RODO, а файли видаляємо після завершення замовлення.', i: 'shield', ph: 'фото · документи' }
      ],
      stTitle: '<span class="accent">Мова</span><br>не має<br>для нас таємниць',
      stText: 'Перекладаємо з англійської, польської, української та російської — в усіх напрямках. Знаємо вимоги польських установ, тому наші переклади приймають без виправлень. Перекладач і коректор перевіряють кожен документ до коми.',
      stBtn: 'Знайомтеся з нами',
      marquee: 'Мова не має для нас таємниць · ',
      howTitle: '<span class="accent">Як</span><br>ми працюємо?',
      howSub: 'Наш процес складається з 4 кроків.',
      steps: [
        ['Надсилаєте<br>документ', 'Фото чи скан через форму, e-mail або WhatsApp. Достатньо розбірливої копії.'],
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
      audTitle: '<span class="accent">Мені потрібен</span><br>переклад для...',
      aud: [
        ['Приватної особи', 'Свідоцтва, дипломи, посвідчення водія, документи для карти побиту та громадянства. Візьмемо все на себе — від розрахунку до отримання.', 'фото · документи', 'dark'],
        ['Бізнесу', 'Договори, реєстраційні документи, технічна документація та листування. Постійна співпраця, фактура VAT і терміни, на які можна покластися.', 'фото · офіс', 'grey']
      ],
      audBtn: 'Хочу дізнатися більше',
      formTitle: 'Поговорімо',
      formSub: 'Розрахуємо вартість перекладу. Залиште повідомлення — відповімо за 15 хвилин.',
      from: 'З мови', to: 'На мову', type: 'Тип перекладу',
      types: ['Присяжний (завірений)', 'Звичайний', 'Спеціалізований (право, медицина)'],
      fileLabel: 'Документ для розрахунку', fileBtn: 'Оберіть файл', fileHint: 'PDF, DOCX, JPG · до 25 МБ',
      msg: 'Ваше повідомлення', name: 'Ім’я', email: 'Email', phone: 'Номер телефону',
      agree: 'Приймаю <a href="#">політику конфіденційності</a>',
      send: 'Надіслати повідомлення',
      errName: 'Введіть ім’я', errEmail: 'Введіть правильний e-mail', errPhone: 'Введіть повний номер, напр. +48 600 000 000',
      errFile: 'Дозволено: PDF, DOCX, JPG, PNG до 25 МБ', errAgree: 'Позначте згоду',
      okTitle: 'Дякуємо!', okText: 'Повідомлення отримано. Відповімо з розрахунком протягом 15 хвилин у робочий час бюро.', okAgain: 'Надіслати ще одне',
      slogan: '<i>Знаємо</i> мову установ<br>як ніхто інший.',
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

  var lang = 'pl';
  var slide = 0;

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
    $$('[data-label-t]').forEach(function (n) { n.dataset.label = t[n.dataset.labelT]; });
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });

    // headline split into words for the reveal
    $$('[data-words]').forEach(function (n) {
      n.innerHTML = t[n.dataset.words].split(' ').map(function (w, i) {
        return '<span class="w" style="transition-delay:' + (i * 0.08).toFixed(2) + 's">' + esc(w) + '</span>';
      }).join(' ');
    });

    $('[data-nav]').innerHTML = t.nav.map(function (n, i) {
      return '<a href="' + NAV_HREF[i] + '"><span>' + esc(n[0]) + '</span><small>' + esc(n[1]) + '</small></a>';
    }).join('');

    $('[data-stack]').innerHTML = t.why.map(function (c) {
      return '<div class="stack-item"><article class="stack-card">' +
        '<div class="stack-copy"><h3>' + c.t + '</h3><p>' + esc(c.d) + '</p></div>' +
        '<div class="stack-media"><div class="photo" data-label="' + esc(c.ph) + '"></div><div class="icon-tile">' + ICONS[c.i] + '</div></div>' +
        '</article></div>';
    }).join('');

    var mtext = new Array(5).join(t.marquee);
    $$('[data-mtext]').forEach(function (n) { n.textContent = mtext + mtext; });

    $('[data-steps]').innerHTML = t.steps.map(function (s, i) {
      return '<div class="step reveal up"><span class="step-num" aria-hidden="true">0' + (i + 1) + '</span><h3>' + s[0] + '</h3><p>' + esc(s[1]) + '</p></div>';
    }).join('');

    var logos = t.logos.map(function (l) { return '<span>' + esc(l) + '</span>'; }).join('');
    $('[data-logos]').innerHTML = logos + logos;

    $('[data-slides]').innerHTML = t.reviews.map(function (r, i) {
      var initials = r[0].split(' ').map(function (p) { return p[0]; }).join('').slice(0, 2);
      return '<div class="slide' + (i === slide ? ' active' : '') + '"><div class="reviewer"><span class="avatar">' + esc(initials) + '</span>' +
        '<div><div class="stars">★★★★★</div><b>' + esc(r[0]) + '</b></div></div><blockquote>' + esc(r[1]) + '</blockquote></div>';
    }).join('');

    $('[data-aud]').innerHTML = t.aud.map(function (a) {
      return '<a class="aud-card reveal up" href="#kontakt"><div class="photo-bg photo ' + a[3] + '" data-label="' + esc(a[2]) + '"></div>' +
        '<h3>' + esc(a[0]) + '</h3><p>' + esc(a[1]) + '</p><span class="btn btn-ghost-light">' + esc(t.audBtn) + '</span></a>';
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
    // re-show anything already revealed
    requestAnimationFrame(function () { $$('.words').forEach(function (n) { n.classList.add('in'); }); });
  }

  function setLang(l) { lang = l; store('md-lang', l); render(); onScroll(); }
  $$('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.lang); }); });

  // ---------- Reveal on scroll (fadeIn / fadeInUp) ----------
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
  function observeReveals() {
    $$('.reveal:not(.in)').forEach(function (n) { if (io) io.observe(n); else n.classList.add('in'); });
  }

  // ---------- Header hide/show, FAB, sticky cards, marquee ----------
  var header = $('#header'), fab = $('#fab');
  var lastY = window.scrollY, ticking = false;

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    header.classList.toggle('hide', y > 400 && y > lastY && !$('#nav').classList.contains('open'));
    fab.classList.toggle('show', y > 600);
    lastY = y;

    // stacked cards: each card shrinks to .8 and fades as the next one slides over it
    var items = $$('.stack-item');
    items.forEach(function (item, i) {
      var card = item.firstElementChild, next = items[i + 1];
      if (!next || window.innerWidth <= 900) { card.style.transform = ''; card.style.opacity = ''; return; }
      var nTop = next.getBoundingClientRect().top, iTop = item.getBoundingClientRect().top;
      var dist = item.offsetHeight + 96;
      var p = Math.min(1, Math.max(0, 1 - (nTop - iTop) / dist));
      card.style.transform = 'scale(' + (1 - 0.2 * p).toFixed(4) + ')';
      card.style.opacity = (1 - p).toFixed(3);
    });

    // big text rows move horizontally with scroll
    var scene = $('[data-marquee]');
    if (scene) {
      var r = scene.getBoundingClientRect();
      var prog = (window.innerHeight - r.top);
      $$('.marquee-row', scene).forEach(function (row) {
        var sp = parseFloat(row.dataset.speed);
        var base = sp < 0 ? 0 : -row.scrollWidth / 2 + window.innerWidth * 0.2;
        row.style.transform = 'translate3d(' + (base + prog * sp).toFixed(1) + 'px,0,0)';
      });
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);

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
  function go(d) {
    var slides = $$('.slide');
    slide = (slide + d + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('active', i === slide); });
  }
  $('[data-prev]').addEventListener('click', function () { go(-1); });
  $('[data-next]').addEventListener('click', function () { go(1); });

  // ---------- Form ----------
  var chosen = null;
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
})();
