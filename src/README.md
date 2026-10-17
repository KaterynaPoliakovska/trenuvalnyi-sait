# Мовний дім — як редагувати сайт

Сайт статичний. Vercel публікує папку `public/` (див. `vercel.json`). Сторінки в `public/` **генеруються** — правте не їх, а джерела в `src/`.

| Що змінити | Де |
|---|---|
| Тексти сторінок (Title, Description, H1, H2/H3, абзаци, FAQ, таблиці) | `src/content/uk/*.txt`, `src/content/pl/*.txt` |
| Домен, телефон, e-mail, адреса, графік, мінімальна ціна | `src/siteconf.py` → `SITE_URL`, `CONTACT` |
| URL сторінок, меню, футер, тексти форми | `src/siteconf.py` → `PAGES`, `NAV`, `FOOTER`, `UI` |
| Стилі та анімації | `src/static/assets/styles.css`, `src/static/assets/app.js` |

Після змін:

```
python src/build.py
python src/check.py
```

`build.py` перезбирає `public/`, оновлює `sitemap.xml`, `robots.txt` і записує в `src/MISSING-DATA.txt` усі місця з `___` (дані, яких ще немає). `check.py` перевіряє H1, унікальність Title/Description, canonical, hreflang, биті внутрішні посилання.

## Формат файлу сторінки

```
title: …
description: …
robots: noindex, follow        (лише для службових сторінок)

# H1
Вступний абзац.
Кнопка: «Текст кнопки»          (веде на форму; «Усі послуги» тощо — на відповідну сторінку)

## H2 {layout}                  (layout необов'язковий: bento, audience, statement, stack, steps, faq)
Абзац. → Анкор посилання        (анкор шукається в siteconf.ANCHORS; можна явно: → Детальніше => sworn)
### H3
Текст картки.
| Послуга | Ціна |
| Письмовий переклад | від ___ грн |   («від ___ грн» автоматично стає «від 300 грн»)
Форма: …                         (секція стає заголовком форми внизу сторінки)
!todo: …                         (не виводиться, потрапляє в MISSING-DATA.txt)
```

Розділи «Часті запитання» стають акордеоном і FAQPage-розміткою, «Як ми працюємо» — кроками, секції з адресою й телефоном — блоком контактів із картою.
