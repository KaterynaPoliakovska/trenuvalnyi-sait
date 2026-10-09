# Movnyi Dim — Design System v3 (коротка довідка)

> Повна версія з живими зразками: **`../Movnyi Dim — Design System v3.html`**.

Референс: **localeader.pl**. Логотип: «Мовний дім», emerald `#1F4B3A` + copper `#B07A4F`.

## Кольори
| Токен | HEX | Роль |
|---|---|---|
| `--c-ink` | #262626 | заголовки, текст |
| `--c-ink-2` | #333333 | другорядний текст |
| `--c-accent` | #C2A58A | акценти, бордери, CTA, hover |
| `--c-accent-light` / `--c-accent-deep` | #D3B79D / #A3805F | градієнти, hover CTA |
| `--c-cocoa` | #48392D | текст білих пігулок |
| `--c-taupe` | #CDBBAA | низ градієнта «Заяви» |
| `--c-hero` | #DDCDC1 | основа hero |
| `--c-beige` | #F3EDE8 | світлі картки, номери кроків |
| `--c-cream` | #F9F4F0 | фон сторінки |
| `--c-espresso` | #18120C | футер |
| `--brand-green` / `--brand-copper` | #1F4B3A / #B07A4F | лише логотип |

## Типографіка
Giant 16.25rem · Display clamp(3rem,6.6vw,6rem) · H2 clamp(2.25rem,3.8vw,3.4rem) · H2 sm 2.5rem · H1 hero 2.5rem · H3 clamp(1.8rem,2.5vw,2.25rem) · H4 1.6rem · H5 1.25rem — Playfair Display 600. Lead 1.2–1.4rem/300, Body 1rem/1.6, Small .9rem, Micro .7rem — Instrument Sans.

## Простір і форма
8-pt: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80 · 120 · 160. Радіуси 24 / 16 / 40 / 99. Тіні: card `0 5px 10px rgba(0,0,0,.1)`, soft `2px 4px 12px rgba(0,0,0,.027)`, glass `0 0 55px rgba(0,0,0,.45)`.

## Анімація
Заголовки — слова з маски (0.8s, stagger .05) · поява блоків 1.25s · скляна панель і цифри за скролом · sticky-стек (scale→.8, opacity→0) · великий текст + плаваючі слова (погойдування, глибина, курсор) · паралакс кроків і bento · слайдер з перетягуванням · clip-path форми · слоган футера по літерах · FAB. Easing `cubic-bezier(.22,.61,.36,1)`; без JS або при «зменшити рух» — без анімацій.

## Адаптив
>1240 повний · ≤1240 без підписів меню · ≤1080 без телефону, hero 1 колонка · ≤900 бургер, без sticky · ≤640 мобільний.
