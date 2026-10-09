(function () {
  'use strict';

  var NAV_HREF = ['#uslugi', '#jezyki', '#wycena', '#o-nas', '#kontakt'];
  var CODES = ['UA', 'PL', 'EN', 'RU'];

  var T = {
    pl: {
      title: 'Movnyi Dim — biuro tłumaczeń',
      tagline: 'biuro tłumaczeń',
      nav: [
        { l: 'Usługi', s: 'przysięgłe i zwykłe' },
        { l: 'Języki', s: 'EN · PL · UA · RU' },
        { l: 'Cennik', s: 'od 49 zł za stronę' },
        { l: 'O nas', s: 'poznaj tłumaczy' },
        { l: 'Kontakt', s: 'napisz do nas' }
      ],
      cta: 'Wyceń tłumaczenie',
      eyebrow: 'Tłumaczenia przysięgłe i specjalistyczne',
      h1: 'Przetłumaczymy Twoje dokumenty bez stresu.',
      lead: 'Angielski, polski, ukraiński i rosyjski. Tłumacz przysięgły, ekspres w 24 h i wycena w 15 minut.',
      secondary: 'Jak to działa?',
      call: 'Zadzwoń teraz',
      send: 'Wyślij zapytanie',
      stats: [
        { v: '12 000+', l: 'stron rocznie' },
        { v: '4', l: 'języki' },
        { v: '24 h', l: 'tryb ekspres' }
      ],
      heroImg: 'photo · tłumacz przy biurku',
      pairsLabel: 'Najczęstsze pary',
      from: 'Z języka',
      to: 'Na język',
      swap: 'Zamień',
      type: 'Rodzaj tłumaczenia',
      opt1: 'Przysięgłe (uwierzytelnione)',
      opt2: 'Zwykłe',
      opt3: 'Specjalistyczne (prawo, medycyna)',
      upload: 'Przeciągnij plik lub wybierz z dysku',
      uploadHint: 'PDF, DOCX, JPG · do 25 MB',
      name: 'Imię i nazwisko',
      email: 'E-mail',
      phone: 'Telefon',
      msg: 'Wiadomość',
      err: 'Wpisz pełny numer telefonu',
      errName: 'Wpisz imię i nazwisko',
      errEmail: 'Wpisz poprawny adres e-mail',
      errFile: 'Dozwolone pliki: PDF, DOCX, JPG do 25 MB',
      errAgree: 'Zaznacz zgodę, aby wysłać zapytanie',
      privacy: 'Akceptuję politykę prywatności',
      answerTime: 'Odpowiemy w 15 minut',
      b1: 'Przysięgłe', b2: 'Ekspres 24 h', b3: 'Online', b4: 'Gotowe',
      tabs: ['Osoby prywatne', 'Firmy', 'Urzędy'],
      pricelists: [
        [['Akt urodzenia, małżeństwa', 'od 49 zł'], ['Dyplom i suplement', 'od 49 zł / str.'], ['Prawo jazdy, dowód rejestracyjny', 'od 49 zł'], ['Zaświadczenia, wyroki', 'od 49 zł / str.']],
        [['Umowy i regulaminy', 'od 49 zł / str.'], ['Dokumenty rejestrowe KRS', 'od 49 zł / str.'], ['Dokumentacja techniczna', 'wycena indywidualna'], ['Stała współpraca', 'wycena indywidualna']],
        [['Akta sądowe i prokuratorskie', 'od 49 zł / str.'], ['Korespondencja urzędowa', 'od 49 zł / str.'], ['Tłumaczenia ustne', 'wycena indywidualna'], ['Faktura VAT', 'zawsze']]
      ],
      priceNote: 'Strona rozliczeniowa: 1125 znaków ze spacjami. Ostateczną cenę podajemy po obejrzeniu dokumentu.',
      whyEyebrow: 'Usługi',
      whyTitle: 'Dlaczego Movnyi Dim?',
      features: [
        { t: 'Tłumacz przysięgły', d: 'Uwierzytelnione tłumaczenia akceptowane przez urzędy, sądy i uczelnie.', img: 'photo · pieczęć', b: 'b1', bc: 'accent' },
        { t: 'Wycena w 15 minut', d: 'Wyślij skan — odpowiemy z ceną i terminem jeszcze w tym samym kwadransie.', img: 'photo · telefon', b: 'b2', bc: 'solid' },
        { t: 'Odbiór online', d: 'Skan z pieczęcią mailem, oryginał kurierem lub osobiście w biurze.', img: 'photo · koperta', b: 'b3', bc: 'neutral' }
      ],
      langsEyebrow: 'Języki',
      langsTitle: 'Tłumaczymy we wszystkich kierunkach między czterema językami.',
      howTitle: 'Jak pracujemy?',
      howSub: 'Nasz proces opiera się na 4 krokach.',
      steps: [
        { n: '01', t: 'Wysyłasz dokument', d: 'Zdjęcie lub skan przez formularz, e-mail albo WhatsApp.' },
        { n: '02', t: 'Otrzymujesz wycenę', d: 'Cena i termin w 15 minut. Bez zobowiązań.' },
        { n: '03', t: 'Tłumaczymy i sprawdzamy', d: 'Tłumacz + korektor. Zgodność z oryginałem co do przecinka.' },
        { n: '04', t: 'Odbierasz gotowe', d: 'Online, kurierem lub w biurze — jak Ci wygodnie.' }
      ],
      quote: 'Tłumaczenie aktu urodzenia gotowe w jeden dzień, urząd przyjął bez pytań. Bardzo miła obsługa po ukraińsku i po polsku.',
      darkA: 'Tłumaczenie potrzebne',
      darkB: 'na wczoraj?',
      darkText: 'Zadzwoń — od razu powiemy, czy zdążymy.',
      formEyebrow: 'Cennik i wycena',
      formTitle: 'Wyceń tłumaczenie',
      formLead: 'Dołącz plik, wybierz parę językową — w ciągu 15 minut odpiszemy z ceną i terminem.',
      okTitle: 'Dziękujemy!',
      okText: 'Zapytanie dotarło. Odpowiemy z wyceną w ciągu 15 minut w godzinach pracy biura.',
      okAgain: 'Wyślij kolejne zapytanie',
      footerLine: 'Tłumaczenia przysięgłe EN · PL · UA · RU.',
      footerCols: [
        { h: 'Na skróty', items: [['Strona główna', '#top'], ['O nas', '#o-nas'], ['Blog', '#'], ['Kontakt', '#wycena']] },
        { h: 'Usługi', items: [['Tłumaczenia przysięgłe', '#uslugi'], ['Tłumaczenia zwykłe', '#uslugi'], ['Ekspres 24 h', '#wycena']] },
        { h: 'Kontakt', items: [['+48 600 000 000', 'tel:+48600000000'], ['biuro@movnyidim.pl', 'mailto:biuro@movnyidim.pl']] }
      ],
      privacyLink: 'Polityka prywatności',
      languageNames: { UA: 'ukraiński', PL: 'polski', EN: 'angielski', RU: 'rosyjski' }
    },

    ua: {
      title: 'Мовний дім — бюро перекладів',
      tagline: 'бюро перекладів',
      nav: [
        { l: 'Послуги', s: 'присяжні та звичайні' },
        { l: 'Мови', s: 'EN · PL · UA · RU' },
        { l: 'Ціни', s: 'від 49 зл за сторінку' },
        { l: 'Про нас', s: 'наші перекладачі' },
        { l: 'Контакти', s: 'напишіть нам' }
      ],
      cta: 'Розрахувати вартість',
      eyebrow: 'Присяжні та спеціалізовані переклади',
      h1: 'Перекладемо ваші документи без стресу.',
      lead: 'Англійська, польська, українська та російська. Присяжний перекладач, експрес за 24 год і розрахунок за 15 хвилин.',
      secondary: 'Як це працює?',
      call: 'Зателефонувати',
      send: 'Надіслати запит',
      stats: [
        { v: '12 000+', l: 'сторінок на рік' },
        { v: '4', l: 'мови' },
        { v: '24 год', l: 'експрес-режим' }
      ],
      heroImg: 'photo · перекладач за столом',
      pairsLabel: 'Найпопулярніші пари',
      from: 'З мови',
      to: 'На мову',
      swap: 'Поміняти',
      type: 'Тип перекладу',
      opt1: 'Присяжний (завірений)',
      opt2: 'Звичайний',
      opt3: 'Спеціалізований (право, медицина)',
      upload: 'Перетягніть файл або оберіть з диска',
      uploadHint: 'PDF, DOCX, JPG · до 25 МБ',
      name: 'Ім’я та прізвище',
      email: 'E-mail',
      phone: 'Телефон',
      msg: 'Повідомлення',
      err: 'Введіть повний номер телефону',
      errName: 'Введіть ім’я та прізвище',
      errEmail: 'Введіть правильну адресу e-mail',
      errFile: 'Дозволені файли: PDF, DOCX, JPG до 25 МБ',
      errAgree: 'Позначте згоду, щоб надіслати запит',
      privacy: 'Приймаю політику конфіденційності',
      answerTime: 'Відповімо за 15 хвилин',
      b1: 'Присяжний', b2: 'Експрес 24 год', b3: 'Онлайн', b4: 'Готово',
      tabs: ['Приватним особам', 'Бізнесу', 'Установам'],
      pricelists: [
        [['Свідоцтво про народження, шлюб', 'від 49 зл'], ['Диплом і додаток', 'від 49 зл / стор.'], ['Посвідчення водія, техпаспорт', 'від 49 зл'], ['Довідки, рішення суду', 'від 49 зл / стор.']],
        [['Договори та регламенти', 'від 49 зл / стор.'], ['Реєстраційні документи KRS', 'від 49 зл / стор.'], ['Технічна документація', 'індивідуальний розрахунок'], ['Постійна співпраця', 'індивідуальний розрахунок']],
        [['Судові та прокурорські матеріали', 'від 49 зл / стор.'], ['Офіційне листування', 'від 49 зл / стор.'], ['Усні переклади', 'індивідуальний розрахунок'], ['Фактура VAT', 'завжди']]
      ],
      priceNote: 'Розрахункова сторінка: 1125 знаків з пробілами. Остаточну ціну називаємо після перегляду документа.',
      whyEyebrow: 'Послуги',
      whyTitle: 'Чому Мовний дім?',
      features: [
        { t: 'Присяжний перекладач', d: 'Завірені переклади, які приймають уряди, суди та університети Польщі.', img: 'photo · печатка', b: 'b1', bc: 'accent' },
        { t: 'Розрахунок за 15 хвилин', d: 'Надішліть скан — відповімо з ціною та терміном протягом чверті години.', img: 'photo · телефон', b: 'b2', bc: 'solid' },
        { t: 'Отримання онлайн', d: 'Скан з печаткою на e-mail, оригінал кур’єром або особисто в офісі.', img: 'photo · конверт', b: 'b3', bc: 'neutral' }
      ],
      langsEyebrow: 'Мови',
      langsTitle: 'Перекладаємо в усіх напрямках між чотирма мовами.',
      howTitle: 'Як ми працюємо?',
      howSub: 'Наш процес складається з 4 кроків.',
      steps: [
        { n: '01', t: 'Надсилаєте документ', d: 'Фото чи скан через форму, e-mail або WhatsApp.' },
        { n: '02', t: 'Отримуєте розрахунок', d: 'Ціна й термін за 15 хвилин. Без зобов’язань.' },
        { n: '03', t: 'Перекладаємо й перевіряємо', d: 'Перекладач + коректор. Точно до оригіналу, до коми.' },
        { n: '04', t: 'Забираєте готове', d: 'Онлайн, кур’єром або в офісі — як вам зручно.' }
      ],
      quote: 'Переклад свідоцтва про народження був готовий за день, ужонд прийняв без питань. Дуже приємне обслуговування українською та польською.',
      darkA: 'Потрібен переклад',
      darkB: 'на вчора?',
      darkText: 'Зателефонуйте — одразу скажемо, чи встигнемо.',
      formEyebrow: 'Ціни та розрахунок',
      formTitle: 'Розрахувати вартість',
      formLead: 'Додайте файл, оберіть мовну пару — протягом 15 хвилин відповімо з ціною та терміном.',
      okTitle: 'Дякуємо!',
      okText: 'Запит отримано. Відповімо з розрахунком протягом 15 хвилин у робочий час бюро.',
      okAgain: 'Надіслати ще один запит',
      footerLine: 'Присяжні переклади EN · PL · UA · RU.',
      footerCols: [
        { h: 'Швидкі посилання', items: [['Головна', '#top'], ['Про нас', '#o-nas'], ['Блог', '#'], ['Контакти', '#wycena']] },
        { h: 'Послуги', items: [['Присяжні переклади', '#uslugi'], ['Звичайні переклади', '#uslugi'], ['Експрес 24 год', '#wycena']] },
        { h: 'Контакти', items: [['+48 600 000 000', 'tel:+48600000000'], ['biuro@movnyidim.pl', 'mailto:biuro@movnyidim.pl']] }
      ],
      privacyLink: 'Політика конфіденційності',
      languageNames: { UA: 'українська', PL: 'польська', EN: 'англійська', RU: 'російська' }
    }
  };

  var state = { lang: 'pl', from: 'UA', to: 'PL', tab: 0 };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function readSavedLang() {
    try { return localStorage.getItem('md-lang'); } catch (e) { return null; }
  }
  function saveLang(l) {
    try { localStorage.setItem('md-lang', l); } catch (e) { /* ignore */ }
  }

  function renderPair() {
    var t = T[state.lang];
    ['from', 'to'].forEach(function (side) {
      var btn = $('.pair-btn[data-side="' + side + '"]');
      $('[data-code]', btn).textContent = state[side];
      $('[data-name]', btn).textContent = t.languageNames[state[side]];
    });
    $('[data-swap]').setAttribute('aria-label', t.swap);
  }

  function renderTabs() {
    var t = T[state.lang];
    var tabs = $('[data-tabs]');
    tabs.innerHTML = '';
    t.tabs.forEach(function (label, i) {
      var b = el('button', null, label);
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(i === state.tab));
      b.addEventListener('click', function () { state.tab = i; renderTabs(); });
      tabs.appendChild(b);
    });
    var list = $('[data-pricelist]');
    list.innerHTML = '';
    t.pricelists[state.tab].forEach(function (row) {
      var li = el('li');
      li.appendChild(el('span', null, row[0]));
      li.appendChild(el('b', null, row[1]));
      list.appendChild(li);
    });
  }

  function render() {
    var t = T[state.lang];
    var isUa = state.lang === 'ua';

    document.documentElement.lang = isUa ? 'uk' : 'pl';
    document.title = t.title;

    $$('[data-t]').forEach(function (n) {
      var v = t[n.getAttribute('data-t')];
      if (typeof v === 'string') n.textContent = v;
    });

    $$('[data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === state.lang));
    });

    var suffix = isUa ? 'ua' : 'en';
    $$('[data-logo]').forEach(function (img) {
      img.src = 'assets/logo/logo-horizontal-' + suffix + '-' + img.getAttribute('data-logo') + '.svg';
      img.alt = (isUa ? 'Мовний дім — ' : 'Movnyi Dim — ') + t.tagline;
    });

    // Nav
    var nav = $('[data-nav]');
    nav.innerHTML = '';
    t.nav.forEach(function (item, i) {
      var a = el('a');
      a.href = NAV_HREF[i];
      a.appendChild(el('span', 'l', item.l));
      a.appendChild(el('span', 's', item.s));
      nav.appendChild(a);
    });

    // Stats
    var stats = $('[data-stats]');
    stats.innerHTML = '';
    t.stats.forEach(function (s) {
      var d = el('div');
      d.appendChild(el('div', 'stat-v', s.v));
      d.appendChild(el('div', 'stat-l', s.l));
      stats.appendChild(d);
    });

    // Features
    var cards = $('[data-features]');
    cards.innerHTML = '';
    t.features.forEach(function (f) {
      var c = el('article', 'card');
      var ph = el('div', 'ph');
      ph.appendChild(el('span', null, f.img));
      c.appendChild(ph);
      c.appendChild(el('span', 'badge badge-' + f.bc, t[f.b]));
      c.appendChild(el('h3', 'card-t', f.t));
      c.appendChild(el('p', 'card-d', f.d));
      cards.appendChild(c);
    });

    // Language chips
    var langs = $('[data-langs]');
    langs.innerHTML = '';
    ['EN', 'PL', 'UA', 'RU'].forEach(function (code) {
      var chip = el('span', 'chip');
      chip.appendChild(el('i', null, code));
      chip.appendChild(document.createTextNode(t.languageNames[code]));
      langs.appendChild(chip);
    });

    // Steps
    var steps = $('[data-steps]');
    steps.innerHTML = '';
    t.steps.forEach(function (s) {
      var d = el('div', 'step');
      d.appendChild(el('span', 'step-n', s.n));
      d.appendChild(el('h3', 'step-t', s.t));
      d.appendChild(el('p', 'step-d', s.d));
      steps.appendChild(d);
    });

    // Footer columns
    var cols = $('[data-footer-cols]');
    cols.innerHTML = '';
    t.footerCols.forEach(function (col) {
      var d = el('div');
      d.appendChild(el('h4', null, col.h));
      var ul = el('ul');
      col.items.forEach(function (it) {
        var li = el('li');
        var a = el('a', null, it[0]);
        a.href = it[1];
        li.appendChild(a);
        ul.appendChild(li);
      });
      d.appendChild(ul);
      cols.appendChild(d);
    });

    renderPair();
    renderTabs();
  }

  function setLang(l) {
    if (!T[l]) return;
    state.lang = l;
    saveLang(l);
    render();
  }

  // ---------- Events ----------
  $$('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

  var toggle = $('.menu-toggle');
  var nav = $('#nav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Pair picker: click cycles to the next language, skipping the other side's
  $$('.pair-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var side = btn.getAttribute('data-side');
      var other = side === 'from' ? 'to' : 'from';
      var i = CODES.indexOf(state[side]);
      do { i = (i + 1) % CODES.length; } while (CODES[i] === state[other]);
      state[side] = CODES[i];
      renderPair();
    });
  });
  $('[data-swap]').addEventListener('click', function () {
    var f = state.from; state.from = state.to; state.to = f;
    renderPair();
  });

  // File drop zone
  var fileInput = $('#file');
  var drop = $('.drop');
  var MAX = 25 * 1024 * 1024;
  var ALLOWED = /\.(pdf|docx|jpe?g)$/i;
  var chosenFile = null;

  function setFile(f) {
    chosenFile = f || null;
    $('[data-filename]').textContent = f ? f.name : '';
    validateFile();
  }
  function validateFile() {
    var bad = chosenFile && (!ALLOWED.test(chosenFile.name) || chosenFile.size > MAX);
    $('[data-field="file"]').classList.toggle('has-error', !!bad);
    return !bad;
  }
  fileInput.addEventListener('change', function () { setFile(fileInput.files[0]); });
  ['dragenter', 'dragover'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('drag'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('drag'); });
  });
  drop.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files.length) setFile(e.dataTransfer.files[0]);
  });

  // Validation
  var form = $('#form');
  var checks = {
    name: function () { return $('#name').value.trim().length > 1; },
    email: function () { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#email').value.trim()); },
    phone: function () { return /^\+\d{9,15}$/.test($('#phone').value.replace(/[\s\-()]/g, '')); },
    agree: function () { return $('#agree').checked; }
  };
  function validate(key) {
    var ok = checks[key]();
    $('[data-field="' + key + '"]').classList.toggle('has-error', !ok);
    return ok;
  }
  Object.keys(checks).forEach(function (key) {
    var input = $('#' + key);
    var evt = key === 'agree' ? 'change' : 'blur';
    input.addEventListener(evt, function () { validate(key); });
    input.addEventListener('input', function () {
      if ($('[data-field="' + key + '"]').classList.contains('has-error')) validate(key);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = Object.keys(checks).map(validate).every(Boolean) && validateFile();
    if (!ok) {
      var first = $('.has-error input, .has-error .drop', form);
      if (first) first.focus();
      return;
    }
    // TODO: send to e-mail / CRM endpoint
    form.classList.add('done');
  });
  $('[data-reset]').addEventListener('click', function () {
    form.reset();
    setFile(null);
    form.classList.remove('done');
  });

  // ---------- Init ----------
  var saved = readSavedLang();
  if (saved && T[saved]) state.lang = saved;
  render();
})();
