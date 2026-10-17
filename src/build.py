"""Static site generator for Movnyi Dim.

    python src/build.py

Reads src/content/<lang>/<page>.txt, renders HTML into public/ (served by Vercel).
Prints warnings for unresolved links and a list of missing data (___).
"""
import datetime
import html
import json
import pathlib
import re
import shutil
import sys
from urllib.parse import quote

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from siteconf import (SITE_URL, CONTACT, LANGS, DEFAULT_LANG, PAGES, ANCHORS, NAV, NAV_SUB, FOOTER, UI)  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'
OUT = ROOT / 'public'
ASSET_VER = '11'
TODAY = datetime.date.today().isoformat()

WARN = []
TODO = {}


def esc(s):
    return html.escape(s, quote=True)


def url(key, lang):
    return PAGES[key][0 if lang == 'uk' else 1]


def name(key, lang):
    return PAGES[key][2 if lang == 'uk' else 3]


def img(id_, w=1600):
    return f'https://images.unsplash.com/photo-{id_}?w={w}&q=75&auto=format&fit=crop'


# ---------------------------------------------------------------- parsing

def parse(text):
    """DSL → {meta, h1, intro[], sections[{h2, layout, blocks[], items[{h3, blocks[]}], buttons[]}]}"""
    page = {'meta': {}, 'h1': '', 'intro': [], 'intro_buttons': [], 'sections': []}
    lines = text.splitlines()
    sec = None
    item = None
    buf = []

    def flush():
        nonlocal buf
        if not buf:
            return
        blocks = to_blocks(buf)
        buf = []
        for b in blocks:
            if b['t'] == 'buttons':
                (sec['buttons'] if sec else page['intro_buttons']).extend(b['items'])
            elif sec is not None and b['t'] == 'link' and re.match(r'^(Послуга|Usługa):', b['label']):
                sec.setdefault('after', []).append(b)
            elif sec is None:
                page['intro'].append(b)
            elif item is not None:
                item['blocks'].append(b)
            else:
                sec['blocks'].append(b)

    for raw in lines:
        line = raw.rstrip()
        m = re.match(r'^(title|description|robots|hero|schema):\s*(.*)$', line)
        if m and not page['h1']:
            page['meta'][m.group(1)] = m.group(2).strip()
            continue
        if line.startswith('# '):
            flush(); page['h1'] = line[2:].strip(); continue
        if line.startswith('## '):
            flush()
            h2 = line[3:].strip()
            lm = re.search(r'\s*\{([\w-]+)\}$', h2)
            layout = lm.group(1) if lm else ''
            h2 = h2[:lm.start()] if lm else h2
            sec = {'h2': h2, 'layout': layout, 'blocks': [], 'items': [], 'buttons': []}
            item = None
            page['sections'].append(sec)
            continue
        if line.startswith('### '):
            flush()
            item = {'h3': line[4:].strip(), 'blocks': []}
            if sec is None:
                sec = {'h2': '', 'layout': '', 'blocks': [], 'items': [], 'buttons': []}
                page['sections'].append(sec)
            sec['items'].append(item)
            continue
        if not line.strip():
            flush(); continue
        buf.append(line.strip())
    flush()
    return page


def to_blocks(lines):
    out = []
    para = []

    def end_para():
        nonlocal para
        if para:
            if len(para) > 1 and all(re.match(r'^[^:]{2,30}:\s', p) for p in para):
                out.append({'t': 'kv', 'rows': [p.split(':', 1) for p in para]})
            elif len(para) > 1:
                out.append({'t': 'list', 'items': [p.rstrip(';').rstrip('.') if i < len(para) - 1 else p.rstrip(';') for i, p in enumerate(para)]})
            else:
                out.append({'t': 'p', 'text': para[0]})
            para = []

    rows = []
    for l in lines:
        if l.startswith('|'):
            end_para()
            rows.append([c.strip() for c in l.strip('|').split('|')])
            continue
        if rows:
            out.append({'t': 'table', 'rows': rows}); rows = []
        m = re.match(r'^(Кнопка|Кнопки|Przycisk|Przyciski):\s*(.*)$', l)
        if m:
            end_para()
            body = m.group(2)
            target = None
            if '→' in body:
                body, target = [x.strip() for x in body.split('→', 1)]
            labels = re.findall(r'«([^»]+)»', body)
            out.append({'t': 'buttons', 'items': [{'label': x, 'target': target} for x in labels]})
            continue
        m = re.match(r'^(Посилання|Link):\s*«([^»]+)»\s*→\s*(.+)$', l)
        if m:
            end_para(); out.append({'t': 'link', 'label': m.group(2), 'target': m.group(3).strip()}); continue
        if re.match(r'^(Форма|Formularz):', l):
            end_para(); out.append({'t': 'form'}); continue
        if re.match(r'^(Інтент:|Футер\b|Stopka\b|Intencja:)', l):
            end_para(); continue
        if re.match(r'^(Тут розмістіть|Розмістіть тут|Під [^.]{0,40}розмістіть|TUTAJ UMIEŚĆ|Tutaj umieść|Umieść tutaj|Pod [^.]{0,40}umieść)', l, re.I):
            end_para(); out.append({'t': 'todo', 'text': l}); continue
        m = re.match(r'^!(review|cert|demo):\s*(.*)$', l)
        if m:
            end_para()
            if m.group(1) == 'demo':
                out.append({'t': 'demo', 'text': m.group(2)})
            else:
                out.append({'t': m.group(1), 'parts': [x.strip() for x in m.group(2).split('|')]})
            continue
        if l.startswith('!todo:'):
            end_para(); out.append({'t': 'todo', 'text': l[6:].strip()}); continue
        if l.startswith('!map'):
            end_para(); out.append({'t': 'map'}); continue
        if l.startswith('→'):
            end_para()
            body = l[1:].strip()
            target = None
            if '=>' in body:
                body, target = [x.strip() for x in body.split('=>', 1)]
            out.append({'t': 'link', 'label': body, 'target': target}); continue
        para.append(l)
    end_para()
    if rows:
        out.append({'t': 'table', 'rows': rows})
    return out


# ---------------------------------------------------------------- inline text

def resolve(anchor, lang, ctx_key=None):
    a = anchor.strip().rstrip('.').strip()
    table = ANCHORS[lang]
    for k in sorted(table, key=len, reverse=True):
        if a.lower() == k.lower():
            return table[k]
    if a.lower().startswith(('детальніше', 'więcej')) and ctx_key:
        return ctx_key
    return None


def split_anchor(seg, lang):
    """'Юридичний переклад. Медичні тексти…' → ('Юридичний переклад', '. Медичні тексти…')"""
    table = ANCHORS[lang]
    s = seg.strip()
    for k in sorted(table, key=len, reverse=True):
        if s.lower().startswith(k.lower()) and (len(s) == len(k) or not s[len(k)].isalnum()):
            return s[:len(k)], s[len(k):]
    return s, ''


def fill(text, lang, page_key):
    """Escape + replace data placeholders. Returns safe HTML."""
    t = text
    t = re.sub(r'(від|od)\s+___\s+(грн|UAH)', lambda m: f'{m.group(1)} {CONTACT["price_from"]} {m.group(2)}', t)
    t = t.replace('#ERROR!', ('від ' if lang == 'uk' else 'od ') + CONTACT['price_from'] + (' грн' if lang == 'uk' else ' UAH'))
    t = t.replace('#NAME?', UI[lang]['urgent_price'])
    t = re.sub(r'(на|o)\s+___\s*%', lambda m: m.group(1) + ' 50 %', t)
    t = esc(t)
    if '___' in t:
        TODO.setdefault(f'{lang}:{page_key}', []).append(text)
        t = t.replace('___', f'<span class="todo" title="{esc(UI[lang]["todo"])}">___</span>')
    return t


def inline(text, lang, page_key, ctx_key=None):
    """Paragraph text with ' → Anchor' links."""
    parts = text.split('→')
    out = fill(parts[0].rstrip(), lang, page_key)
    for seg in parts[1:]:
        m = re.match(r'^\s*(.+?)\s*=>\s*([\w-]+)(.*)$', seg)
        if m:
            out += ' ' + link_html(m.group(1), m.group(2), lang, page_key) + fill(m.group(3), lang, page_key)
            continue
        anchor, rest = split_anchor(seg, lang)
        key = resolve(anchor, lang, ctx_key)
        out += ' ' + link_html(anchor, key, lang, page_key) + fill(rest, lang, page_key)
    return out


def link_html(label, key, lang, page_key, cls='more'):
    lab = fill(label.strip().rstrip('.'), lang, page_key)
    if key is None:
        WARN.append(f'{lang}:{page_key}: unresolved link «{label.strip()}»')
        return f'<span class="{cls}">{lab}</span>'
    if key == page_key:
        return f'<span class="{cls} self">{lab}</span>'
    return f'<a class="{cls}" href="{url(key, lang)}">{lab} <span aria-hidden="true">→</span></a>'


def accent_first(text):
    """Design rule: first word of a section title in italic accent."""
    t = esc(text)
    m = re.match(r'^(\S+)(\s+.*)?$', t)
    if not m:
        return t
    return f'<span class="accent">{m.group(1)}</span>{m.group(2) or ""}'


def accent_last(text):
    t = esc(text)
    m = re.match(r'^(.*\s)?(\S+)$', t)
    if not m or not m.group(1):
        return t
    return f'{m.group(1)}<span class="accent">{m.group(2)}</span>'


# ---------------------------------------------------------------- blocks → html

def render_blocks(blocks, lang, key, ctx_key=None):
    h = []
    for b in blocks:
        t = b['t']
        if t == 'p':
            h.append(f'<p>{inline(b["text"], lang, key, ctx_key)}</p>')
        elif t == 'list':
            h.append('<ul class="ticks">' + ''.join(f'<li>{inline(i, lang, key, ctx_key)}</li>' for i in b['items']) + '</ul>')
        elif t == 'kv':
            h.append('<dl class="kv">' + ''.join(f'<div><dt>{fill(k, lang, key)}</dt><dd>{inline(v.strip(), lang, key)}</dd></div>' for k, v in b['rows']) + '</dl>')
        elif t == 'table':
            rows = b['rows']
            head = '<tr>' + ''.join(f'<th scope="col">{fill(c, lang, key)}</th>' for c in rows[0]) + '</tr>'
            body = ''.join('<tr>' + ''.join((f'<th scope="row">{fill(c, lang, key)}</th>' if i == 0 else f'<td>{fill(c, lang, key)}</td>') for i, c in enumerate(r)) + '</tr>' for r in rows[1:])
            h.append(f'<div class="ptable-wrap"><table class="ptable"><thead>{head}</thead><tbody>{body}</tbody></table></div>')
        elif t == 'link':
            tg = b.get('target')
            k = (tg if tg in PAGES else resolve(tg, lang)) if tg else resolve(b['label'], lang, ctx_key)
            h.append(f'<p class="link-line">{link_html(b["label"], k, lang, key)}</p>')
        elif t == 'todo':
            TODO.setdefault(f'{lang}:{key}', []).append('[блок] ' + b['text'])
        elif t == 'demo':
            h.append(f'<p class="demo-note"><span class="demo-badge">{UI[lang]["demo"]}</span> {esc(b["text"])}</p>')
        elif t in ('review', 'cert'):
            TODO.setdefault(f'{lang}:{key}', []).append(f'[демо, замінити реальним] {b["parts"][0]}')
            badge = f'<span class="demo-badge">{UI[lang]["demo"]}</span>'
            if t == 'review':
                name_, service, text = (b['parts'] + ['', '', ''])[:3]
                card = (f'<figure class="review-card">{badge}<blockquote>{esc(text)}</blockquote>'
                        f'<figcaption><b>{esc(name_)}</b><span>{esc(service)}</span></figcaption></figure>')
            else:
                title, text = (b['parts'] + ['', ''])[:2]
                card = (f'<div class="cert-card">{badge}<div class="cert-ico">{ICONS["stamp"]}</div>'
                        f'<h3>{esc(title)}</h3><p>{esc(text)}</p></div>')
            grid = f'<div class="{t}-grid">'
            if h and h[-1].startswith(grid):
                h[-1] = h[-1][:-len('</div>')] + card + '</div>'
            else:
                h.append(grid + card + '</div>')
        elif t in ('form', 'map'):
            pass
    return '\n'.join(h)


def buttons_html(btns, lang, key, light=False):
    if not btns:
        return ''
    out = []
    for i, b in enumerate(btns):
        if re.search(r'Google|відгук на сайті|opinię na stronie', b['label']):
            TODO.setdefault(f'{lang}:{key}', []).append(f'[кнопка прихована] {b["label"]} — немає посилання на профіль Google / форми відгуку')
            continue
        k = resolve(b['target'], lang) if b.get('target') else resolve(b['label'], lang)
        href = url(k, lang) if k and k != key else '#kontakt'
        if b.get('target') and not k:
            if 'Google' in b['target']:
                href = route_url()
            else:
                WARN.append(f'{lang}:{key}: unresolved button target «{b["target"]}»')
        cls = ('btn btn-outline-light' if light else 'btn btn-outline') if i else 'btn btn-accent'
        out.append(f'<a class="{cls}" href="{href}">{esc(b["label"])}</a>')
    return '<div class="btn-row">' + ''.join(out) + '</div>'


def route_url():
    return 'https://www.google.com/maps/dir/?api=1&destination=' + quote(CONTACT['map_query'])


def section_is(sec, *words):
    return any(w.lower() in sec['h2'].lower() for w in words)


def has_block(sec, t):
    return any(b['t'] == t for b in sec['blocks']) or any(b['t'] == t for it in sec['items'] for b in it['blocks'])


def is_contacts(sec):
    allb = sec['blocks'] + [b for it in sec['items'] for b in it['blocks']]
    txt = ' '.join(b.get('text', '') for b in allb) + ' '.join(' '.join(r) for b in allb if b['t'] == 'kv' for r in b['rows'])
    txt += ' '.join(i for b in allb if b['t'] == 'list' for i in b['items'])
    return sec['layout'] == 'contacts' or bool(re.search(r'(Адреса|Adres)', txt) and re.search(r'(Телефон|Telefon)', txt))


def is_empty(sec):
    real = [b for b in sec['blocks'] if b['t'] != 'todo']
    real += [b for it in sec['items'] for b in it['blocks'] if b['t'] != 'todo']
    return not real and not sec['items'] and not sec['buttons']


def contacts_html(lang, key, h3=None):
    u = UI[lang]
    addr = f'{CONTACT["city"][lang]}, {CONTACT["district"][lang]}, {CONTACT["street"][lang]}'
    map_src = 'https://maps.google.com/maps?q=' + quote(CONTACT['map_query']) + '&z=15&output=embed'
    title = f'<h3>{esc(h3)}</h3>' if h3 else ''
    return f'''<div class="contacts-grid">
  <div class="contact-card">
    {title}
    <dl class="kv">
      <div><dt>{u["c_address"]}</dt><dd>{esc(addr)}</dd></div>
      <div><dt>{u["c_phone"]}</dt><dd><a href="tel:{CONTACT["tel"]}">{CONTACT["phone"]}</a></dd></div>
      <div><dt>{u["c_email"]}</dt><dd><a href="mailto:{CONTACT["email"]}">{CONTACT["email"]}</a></dd></div>
      <div><dt>{u["c_hours"]}</dt><dd>{CONTACT["hours"][lang]}</dd></div>
    </dl>
    <a class="btn btn-outline" href="{route_url()}" target="_blank" rel="noopener">{u["route"]}</a>
  </div>
  <div class="map-card"><iframe src="{map_src}" title="{esc(u["map_title"])}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
</div>'''


ICONS = {
    'stamp': '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="15" r="7"/><path d="M20 21v6h8v-6M12 33h24v5H12zM10 42h28"/></svg>',
    'clock': '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="15"/><path d="M24 15v9l6 4"/></svg>',
    'mail': '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="13" width="32" height="22" rx="4"/><path d="m9 15 15 11 15-11"/></svg>',
    'shield': '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M24 8 11 13v10c0 8 5.5 14 13 17 7.5-3 13-9 13-17V13z"/><path d="m18 24 4.5 4.5L31 20"/></svg>',
}
WHY_IMG = ['1450101499163-c8848c66ca85', '1589829545856-d10d557cf95f', '1554224155-6726b3ff858f', '1434030216411-0b793f4b4173']
AUD_IMG = ['1497366216548-37526070297c', '1600210492486-724fe5c67fb0']
FLOATS = [
    ['Мова', 'UA', 7, 10, 'l', 1.0], ['Język', 'PL', 74, 6, 'l', 0.8],
    ['Переклад', 'UA', 24, 34, 's', 0.5], ['Tłumaczenie', 'PL', 62, 30, 's', 0.6],
    ['Language', 'EN', 3, 56, 'm', 1.2], ['Язык', 'RU', 80, 52, 'm', 1.1],
    ['Translation', 'EN', 12, 84, 's', 0.7], ['Apostille', '✓', 76, 82, 's', 0.9],
]


def section_html(sec, lang, key, idx):
    """Render one H2 section according to its layout."""
    u = UI[lang]
    h2 = accent_first(sec['h2'])
    ctx = resolve(sec['h2'], lang)
    intro = render_blocks(sec['blocks'], lang, key, ctx)
    btns = buttons_html(sec['buttons'], lang, key)
    lay = sec['layout']
    items = sec['items']
    if not lay:
        if section_is(sec, 'часті запитання', 'najczęściej zadawane', 'faq'):
            lay = 'faq'
        elif section_is(sec, 'як ми працюємо', 'jak działamy', 'jak pracujemy', 'як замовити', 'jak zamówić') and 2 < len(items) <= 6:
            lay = 'steps'
    alt = ' alt' if idx % 2 else ''

    if lay == 'faq':
        qa = ''.join(
            f'<details class="qa"><summary><h3>{esc(it["h3"])}</h3><span class="qa-ico" aria-hidden="true"></span></summary>'
            f'<div class="qa-a">{render_blocks(it["blocks"], lang, key, resolve(it["h3"], lang))}</div></details>' for it in items)
        return f'<section class="sec{alt}"><div class="sec-in narrow"><h2 class="h2-sm split">{h2}</h2>{intro}<div class="faq">{qa}</div>{btns}</div></section>'

    if lay == 'steps':
        steps = ''.join(
            f'<div class="step fade-up"><span class="step-num" aria-hidden="true" data-sy="30,-30">0{i + 1}</span><h3>{esc(it["h3"])}</h3>{render_blocks(it["blocks"], lang, key)}</div>'
            for i, it in enumerate(items))
        return f'<section class="process"><div class="process-head center"><h2 class="h2 split">{h2}</h2>{intro}</div><div class="steps">{steps}</div>{btns}</section>'

    if lay == 'stack':
        icons = ['stamp', 'shield', 'mail', 'clock']
        cards = ''.join(
            f'<div class="stack-item"><article class="stack-card"><div class="stack-copy"><h3 class="split">{accent_last(it["h3"])}</h3>'
            f'<div class="fade">{render_blocks(it["blocks"], lang, key)}</div></div>'
            f'<div class="stack-media"><div class="ph" style="--img:url(\'{img(WHY_IMG[i % 4], 1100)}\')"></div><div class="dots"></div>'
            f'<div class="icon-tile">{ICONS[icons[i % 4]]}</div></div></article></div>' for i, it in enumerate(items))
        return f'<section class="why"><h2 class="h2 center split">{h2}</h2>{intro}<div class="stack">{cards}</div>{btns}</section>'

    if lay == 'bento':
        codes = ['PL', 'EN', 'RU']
        cls = ['b-tall', 'b-gold', 'b-sand']
        cards = []
        for i, it in enumerate(items[:3]):
            ik = resolve(it['h3'], lang)
            body = render_blocks(it['blocks'], lang, key, ik)
            style = f' style="--img:url(\'{img("1481627834876-b7833e8f5570" if i == 0 else "1522202176988-66273c2fd55f", 1100)}\')"' if i != 1 else ''
            text = f'<div class="b-text"><h3>{esc(it["h3"])}</h3>{body}</div>'
            giant = f'<div class="giant" data-sy="10,-10" data-k=".05"><b>{codes[i]}</b></div>'
            if i == 0:
                cards.append(f'<div class="b-card {cls[i]} fade"{style}>{text}{giant}</div>')
            elif i == 1:
                cards.append(f'<div class="b-card {cls[i]} fade">{giant}{text}</div>')
            else:
                cards.append(f'<div class="b-card {cls[i]} fade"{style}>{text}{giant}<div class="b-photo"></div></div>')
        return (f'<section class="bento-sec"><div class="sec-in"><h2 class="h2-sm center split">{h2}</h2>{intro}</div>'
                f'<div class="bento">{"".join(cards)}</div><div class="sec-in center">{btns}</div></section>')

    if lay == 'audience':
        cards = []
        for i, it in enumerate(items[:2]):
            ik = None
            for b in it['blocks']:
                if b['t'] == 'p' and '→' in b['text']:
                    ik = resolve(b['text'].split('→')[-1], lang)
            ik = ik or resolve(sec['h2'], lang)
            text = ' '.join(fill(b['text'].split('→')[0].strip(), lang, key) for b in it['blocks'] if b['t'] == 'p')
            href = url(ik, lang) if ik else '#kontakt'
            cards.append(f'<a class="aud-card fade" href="{href}"><div class="bg" style="--img:url(\'{img(AUD_IMG[i], 1300)}\')"></div>'
                         f'<h3>{esc(it["h3"])}</h3><p>{text}</p><span class="btn btn-outline-light">{u["more"]}</span></a>')
        return (f'<section class="audience"><h2 class="h2-sm center split">{h2}</h2><div class="sec-intro center">{intro}</div>'
                f'<div class="aud-grid">{"".join(cards)}</div><div class="center">{btns}</div></section>')

    if lay == 'statement':
        mtext = esc((u['marquee'] + '  ') * 3)
        floats = ''.join(
            f'<div class="fw fw-{f[4]}" data-depth="{f[5]}" style="left:{f[2]}%;top:{f[3]}%"><div class="pop" style="transition-delay:{0.15 + i * 0.12:.2f}s">'
            f'<div class="chip" style="--d:{6 + (i % 4) * 1.3:.1f}s;--dl:-{i * 0.9:.1f}s;--r:{2 if i % 2 else -2}deg">{esc(f[0])}<b>{esc(f[1])}</b></div></div></div>'
            for i, f in enumerate(FLOATS))
        return f'''<section class="statement">
    <div class="statement-copy">
      <h2 class="display split">{h2}</h2>
      <div class="lead-lg fade-up">{intro}</div>
      {btns}
    </div>
    <div class="marquee-scene" data-marquee aria-hidden="true">
      <div class="marquee-row r1" data-speed="-0.45"><span class="mq">{mtext}{mtext}</span></div>
      <div class="marquee-row r2" data-speed="0.45"><span class="mq">{mtext}{mtext}</span></div>
      <div class="float-words" data-floats>{floats}</div>
      <div class="tower"><img src="/assets/logo/mark-color.svg" width="460" height="460" alt="" loading="lazy"></div>
    </div>
  </section>'''

    if is_contacts(sec):
        h3 = items[0]['h3'] if items else None
        def keep(b):
            if b['t'] in ('kv', 'list'):
                return False
            return not re.match(r'^(Адреса|Телефон|E-mail|Графік|Adres|Telefon|Godziny|Viber|Бюро перекладів «|Biuro tłumaczeń «)', b.get('text', ''))
        extra = ''.join(render_blocks([b for b in it['blocks'] if keep(b)], lang, key) for it in items)
        intro2 = render_blocks([b for b in sec['blocks'] if keep(b)], lang, key)
        return f'<section class="sec{alt}" id="kontakty"><div class="sec-in"><h2 class="h2-sm split">{h2}</h2>{intro2}{contacts_html(lang, key, h3)}{extra}{btns}</div></section>'

    # default: intro + cards grid
    cards = ''
    if len(items) == 1:
        it = items[0]
        cards = f'<div class="sub-block"><h3>{esc(it["h3"])}</h3>{render_blocks(it["blocks"], lang, key, resolve(it["h3"], lang))}</div>'
    elif items:
        many = len(items) > 3
        n = len(items)
        cards = '<div class="cards' + (f' cards-{n}' if n in (2, 3, 4) else '') + '">' + ''.join(
            f'<article class="card fade-up"><h3>{esc(it["h3"])}</h3>{render_blocks(it["blocks"], lang, key, resolve(it["h3"], lang))}</article>'
            for it in items) + '</div>'
    after = render_blocks(sec.get('after', []), lang, key)
    return f'<section class="sec{alt}"><div class="sec-in"><h2 class="h2-sm split">{h2}</h2>{intro}{cards}{after}{btns}</div></section>'


# ---------------------------------------------------------------- page chrome

def logo_img(lang, variant='color'):
    lg = UI[lang]['logo']
    w = 468 if lg == 'ua' else 434
    return f'<img src="/assets/logo/logo-horizontal-{lg}-{variant}.svg" width="{w}" height="158" alt="{esc(UI[lang]["brand_full"])}">'


def header_html(lang, key):
    u = UI[lang]
    items = []
    for k in NAV:
        cur = ' aria-current="page"' if k == key else ''
        top = f'<a href="{url(k, lang)}"{cur}><span>{esc(name(k, lang))}</span><small>{esc(u["nav_sub"][k])}</small></a>'
        subs = NAV_SUB.get(k)
        if not subs:
            items.append(top)
            continue
        links = ''.join(
            f'<a href="{url(s, lang)}"{" aria-current=\"page\"" if s == key else ""}>{esc(name(s, lang))}</a>' for s in subs)
        items.append(f'<div class="nav-item has-sub">{top}'
                     f'<button class="sub-toggle" type="button" aria-expanded="false" aria-label="{esc(name(k, lang))}: {u["submenu"]}"><span aria-hidden="true"></span></button>'
                     f'<div class="sub">{links}</div></div>')
    nav = ''.join(items)
    return f'''<header class="header" id="header">
  <div class="header-bar">
    <a class="logo" href="{url('home', lang)}">{logo_img(lang)}</a>
    <nav class="nav" id="nav" aria-label="{u['menu']}">{nav}</nav>
    <div class="header-actions">
      <a class="phone-pill" href="tel:{CONTACT['tel']}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>
        {CONTACT['phone']}
      </a>
      {lang_switch(lang, key)}
      <button class="burger" type="button" aria-controls="nav" aria-expanded="false" aria-label="{u['menu']}"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>'''


def lang_switch(lang, key, dark=False):
    u = UI[lang]
    links = []
    for l in LANGS:
        label = 'UA' if l == 'uk' else 'PL'
        cur = ' aria-current="true"' if l == lang else ''
        links.append(f'<a href="{url(key, l)}" hreflang="{l}" lang="{l}"{cur}>{label}</a>')
    return f'<div class="lang{" lang-dark" if dark else ""}" role="group" aria-label="{u["lang_group"]}">{"".join(links)}</div>'


def crumbs_html(lang, key):
    chain = []
    k = key
    while k:
        chain.append(k)
        k = PAGES[k][4]
    chain.reverse()
    items = []
    for i, k in enumerate(chain):
        if i == len(chain) - 1:
            items.append(f'<li aria-current="page">{esc(name(k, lang))}</li>')
        else:
            items.append(f'<li><a href="{url(k, lang)}">{esc(name(k, lang))}</a></li>')
    return f'<nav class="crumbs" aria-label="{UI[lang]["crumbs"]}"><ol>{"".join(items)}</ol></nav>', chain


def form_html(lang, title, sub):
    u = UI[lang]
    codes = ['UA', 'PL', 'EN', 'RU']
    opts = lambda sel: ''.join(f'<option value="{c}"{" selected" if c == sel else ""}>{c} — {u["lang_names"][c]}</option>' for c in codes)
    types = ''.join(f'<option>{esc(t)}</option>' for t in u['types'])
    agree = u['agree'].format(privacy=url('privacy', lang))
    return f'''<section class="contact" id="kontakt" data-clip style="--img:url('{img('1513694203232-719a280e022f', 2000)}')">
    <div class="form-card fade-up" id="formCard">
      <h2 class="h2-sm">{esc(title)}</h2>
      <p class="sub">{sub}</p>
      <form id="form" novalidate>
        <div class="form-grid">
          <div class="f half"><label for="from">{u['from']}</label><div class="select"><select class="input" id="from" name="from">{opts('UA')}</select></div></div>
          <div class="f half"><label for="to">{u['to']}</label><div class="select"><select class="input" id="to" name="to">{opts('PL')}</select></div></div>
          <div class="f half"><label for="type">{u['type']}</label><div class="select"><select class="input" id="type" name="type">{types}</select></div></div>
          <div class="f half" data-f="file">
            <label for="file">{u['file_label']}</label>
            <label class="input file-input" for="file">
              <span class="file-name" data-filename data-hint="{esc(u['file_hint'])}">{u['file_hint']}</span>
              <span class="file-btn">{u['file_btn']}</span>
              <input type="file" id="file" name="file" accept=".pdf,.docx,.jpg,.jpeg,.png">
            </label>
            <span class="msg">{u['err_file']}</span>
          </div>
          <div class="f full"><textarea class="input" id="msg" name="message" rows="3" placeholder="{esc(u['msg'])}" aria-label="{esc(u['msg'])}"></textarea></div>
          <div class="f third" data-f="name"><input class="input" id="name" name="name" autocomplete="name" placeholder="{esc(u['name'])}" aria-label="{esc(u['name'])}"><span class="msg">{u['err_name']}</span></div>
          <div class="f third" data-f="email"><input class="input" id="email" name="email" type="email" autocomplete="email" placeholder="{esc(u['email'])}" aria-label="{esc(u['email'])}"><span class="msg">{u['err_email']}</span></div>
          <div class="f third" data-f="phone"><input class="input" id="phone" name="phone" type="tel" autocomplete="tel" placeholder="{esc(u['phone'])}" aria-label="{esc(u['phone'])}"><span class="msg">{u['err_phone']}</span></div>
          <div class="form-foot">
            <div class="f" data-f="agree">
              <label class="check"><input type="checkbox" id="agree" name="agree"><span>{agree}</span></label>
              <span class="msg">{u['err_agree']}</span>
            </div>
            <button class="btn btn-accent" type="submit">{u['send']}</button>
          </div>
        </div>
      </form>
      <div class="form-ok" role="status">
        <p class="h2-sm">{u['ok_title']}</p>
        <p>{u['ok_text']}</p>
        <button class="btn btn-outline" type="button" data-reset>{u['ok_again']}</button>
      </div>
    </div>
  </section>'''


def footer_html(lang, key, form):
    u = UI[lang]
    cols = ''.join(
        f'<div><p class="fh">{u["footer_cols"][col]}</p><ul>' + ''.join(f'<li><a href="{url(k, lang)}">{esc(name(k, lang))}</a></li>' for k in keys) + '</ul></div>'
        for col, keys in FOOTER)
    addr = f'{CONTACT["city"][lang]}, {CONTACT["street"][lang]}'
    return f'''<footer class="footer">
  {form}
  <div class="footer-main" id="stopka">
    <div class="footer-hero">
      <div class="footer-logo rise">{logo_img(lang, 'reverse')}</div>
      <p class="footer-slogan type1">{u['slogan']}</p>
    </div>
    <div class="footer-grid">
      <div class="footer-addr rise">
        <b>{esc(u['brand_full'])}</b>
        <span>{esc(addr)}</span>
        <span>{CONTACT['hours'][lang]}</span>
        <span class="gap"></span>
        <a href="tel:{CONTACT['tel']}">{CONTACT['phone']}</a>
        <a href="mailto:{CONTACT['email']}">{CONTACT['email']}</a>
      </div>
      <div class="footer-cols rise">{cols}</div>
    </div>
    <div class="footer-bottom rise">
      <a class="btn btn-accent" href="{url('contacts', lang)}">{u['contact_btn']}</a>
      <div class="row">
        <span>© {datetime.date.today().year} {esc(u['brand'])}. <a href="{url('privacy', lang)}">{u['privacy']}</a></span>
        {lang_switch(lang, key, dark=True)}
      </div>
    </div>
  </div>
</footer>
<div class="call-fab" id="fab">
  <a href="tel:{CONTACT['tel']}"><span><small>{u['call_now']}</small><b>{CONTACT['phone']}</b></span></a>
</div>'''


def head_html(lang, key, meta, schema):
    u = UI[lang]
    title = meta.get('title', '')
    desc = meta.get('description', '')
    canon = SITE_URL + url(key, lang)
    alts = ''.join(f'\n  <link rel="alternate" hreflang="{l}" href="{SITE_URL + url(key, l)}">' for l in LANGS)
    alts += f'\n  <link rel="alternate" hreflang="x-default" href="{SITE_URL + url(key, DEFAULT_LANG)}">'
    robots = meta.get('robots', 'index, follow')
    ld = ''.join(f'\n  <script type="application/ld+json">{json.dumps(s, ensure_ascii=False, separators=(",", ":"))}</script>' for s in schema)
    return f'''<!doctype html>
<html lang="{u['html_lang']}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(desc)}">
  <meta name="robots" content="{robots}">
  <link rel="canonical" href="{canon}">{alts}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="{esc(u['brand'])}">
  <meta property="og:locale" content="{u['og_locale']}">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(desc)}">
  <meta property="og:url" content="{canon}">
  <meta property="og:image" content="{SITE_URL}/assets/logo/social-avatar-1080.png">
  <meta name="theme-color" content="#F9F4F0">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/svg+xml" href="/assets/logo/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <script>
    (function (d) {{
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      d.classList.add('motion');
      setTimeout(function () {{ if (!window.__mdReady) d.classList.remove('motion'); }}, 3000);
    }})(document.documentElement);
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://images.unsplash.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Poppins:wght@100;200&display=swap">
  <link rel="stylesheet" href="/assets/styles.css?v={ASSET_VER}">{ld}
</head>'''


def org_schema(lang):
    return {
        '@context': 'https://schema.org', '@type': 'ProfessionalService', '@id': SITE_URL + '/#org',
        'name': UI[lang]['brand'], 'alternateName': ['Мовний дім', 'Movnyi Dim'],
        'url': SITE_URL + url('home', lang), 'logo': SITE_URL + '/assets/logo/mark-color-1024.png',
        'image': SITE_URL + '/assets/logo/social-avatar-1080.png',
        'telephone': CONTACT['phone'], 'email': CONTACT['email'], 'priceRange': 'від 300 грн' if lang == 'uk' else 'od 300 UAH',
        'address': {'@type': 'PostalAddress', 'streetAddress': CONTACT['street'][lang], 'addressLocality': CONTACT['city'][lang],
                    'addressRegion': CONTACT['district'][lang], 'addressCountry': 'UA'},
        'openingHoursSpecification': [{'@type': 'OpeningHoursSpecification',
                                       'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                                       'opens': '09:00', 'closes': '17:00'}],
        'areaServed': 'Київ' if lang == 'uk' else 'Kijów',
        'knowsLanguage': ['uk', 'pl', 'en', 'ru'],
    }


def faq_schema(page, lang, key):
    qas = []
    for sec in page['sections']:
        if section_is(sec, 'часті запитання', 'najczęściej zadawane', 'faq') or sec['layout'] == 'faq':
            for it in sec['items']:
                txt = ' '.join(re.sub(r'\s*→.*$', '', b['text']) for b in it['blocks'] if b['t'] == 'p')
                if '___' in txt or not txt:
                    continue
                qas.append({'@type': 'Question', 'name': it['h3'], 'acceptedAnswer': {'@type': 'Answer', 'text': txt}})
    if not qas:
        return None
    return {'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': qas}


def crumb_schema(chain, lang):
    return {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': i + 1, 'name': name(k, lang), 'item': SITE_URL + url(k, lang)} for i, k in enumerate(chain)]}


# ---------------------------------------------------------------- page

def build_page(key, lang):
    path = SRC / 'content' / lang / f'{key}.txt'
    page = parse(path.read_text(encoding='utf8'))
    u = UI[lang]
    meta = page['meta']
    for need in ('title', 'description'):
        if not meta.get(need):
            WARN.append(f'{lang}:{key}: missing {need}')
    if not page['h1']:
        WARN.append(f'{lang}:{key}: missing H1')

    sections = [s for s in page['sections'] if not is_empty(s) or is_contacts(s)]
    for s in page['sections']:
        if s not in sections:
            TODO.setdefault(f'{lang}:{key}', []).append(f'[розділ прихований, немає даних] {s["h2"]}')

    # the section with the order form goes into the footer form card
    form_sec = next((s for s in sections if has_block(s, 'form')), None)
    if form_sec:
        sections.remove(form_sec)
        ftitle = form_sec['h2']
        fsub = ' '.join(inline(b['text'], lang, key) for b in form_sec['blocks'] if b['t'] == 'p')
    else:
        ftitle, fsub = u['form_title'], esc(u['form_sub'])

    is_home = key == 'home'
    intro = render_blocks(page['intro'], lang, key)
    btns = buttons_html(page['intro_buttons'], lang, key, light=True)

    schema = []
    crumbs, chain = crumbs_html(lang, key)
    if is_home:
        schema.append(org_schema(lang))
        schema.append({'@context': 'https://schema.org', '@type': 'WebSite', 'name': u['brand'], 'url': SITE_URL + url('home', lang), 'inLanguage': u['html_lang']})
    elif key == 'contacts':
        schema.append(org_schema(lang))
    if not is_home:
        schema.append(crumb_schema(chain, lang))
    fs = faq_schema(page, lang, key)
    if fs:
        schema.append(fs)

    if is_home:
        chips = ''.join(f'<a class="btn btn-white" href="{url(k, lang)}">{esc(lbl)}</a>' for lbl, k in u['bar_chips'])
        hero = f'''<section class="hero">
    <div class="hero-card">
      <div class="hero-bg" style="--img:url('{img(PAGES['home'][5], 2000)}')"></div>
      <div class="hero-copy">
        <span class="eyebrow fade" style="transition-delay:.1s">{esc(u['eyebrow'])}</span>
        <h1 class="split">{esc(page['h1'])}</h1>
        <div class="hero-lead fade" style="transition-delay:.5s">{intro}</div>
        <div class="fade" style="transition-delay:.7s">{btns}</div>
      </div>
      <div class="hero-side fade">
        <div class="hero-mark"><img src="/assets/logo/mark-color.svg" width="100" height="100" alt=""></div>
        <div class="hero-names"><span>{u['side_a']}</span><span>{u['side_b']}</span></div>
      </div>
    </div>
    <div class="hero-bar-wrap"><div class="hero-bar fade" data-sy="0,-20">
      <div class="bar-q">
        <div class="q split">{u['bar_q']}</div>
        <div class="chips">
          {chips}
        </div>
      </div>
      <div class="bar-stat"><div class="stat-big" data-sx="-40,25"><span data-count="{CONTACT['price_from']}">{CONTACT['price_from']}</span><small>{u['stat1_unit']}</small></div><div class="stat-cap">{u['stat1']}</div></div>
      <div class="bar-stat"><div class="stat-big" data-sx="-35,0"><span data-count="4">4</span></div><div class="stat-cap">{u['stat2']}</div></div>
    </div></div>
  </section>'''
    else:
        hero = f'''<section class="hero hero-inner">
    <div class="hero-card">
      <div class="hero-bg" style="--img:url('{img(PAGES[key][5], 2000)}')"></div>
      <div class="hero-copy">
        {crumbs}
        <h1 class="split">{esc(page['h1'])}</h1>
        <div class="hero-lead fade" style="transition-delay:.3s">{intro}</div>
        <div class="fade" style="transition-delay:.5s">{btns}</div>
      </div>
    </div>
  </section>'''

    body = []
    for i, s in enumerate(sections):
        body.append(section_html(s, lang, key, i))
        if is_home and s['layout'] == 'steps' or (is_home and section_is(s, 'як ми працюємо', 'jak działamy')):
            logos = ''.join(f'<span>{esc(x)}</span>' for x in u['logos'])
            body.append(f'<section class="logos"><p class="logos-label fade">{esc(u["logos_label"])}</p><div class="logos-track"><div class="logos-move">{logos}{logos}</div></div></section>')

    doc = f'''{head_html(lang, key, meta, schema)}
<body class="page-{key}">
{header_html(lang, key)}
<main id="top">
  {hero}
  {''.join(body)}
</main>
{footer_html(lang, key, form_html(lang, ftitle, fsub))}
<script src="/assets/app.js?v={ASSET_VER}"></script>
</body>
</html>
'''
    out = OUT / url(key, lang).lstrip('/') / 'index.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(doc, encoding='utf8')
    return meta


def build_404():
    u, p = UI['uk'], UI['pl']
    doc = f'''{head_html('uk', 'home', {'title': u['not_found_title'] + ' | Мовний дім', 'description': u['not_found_text'], 'robots': 'noindex, follow'}, [])}
<body class="page-404">
{header_html('uk', 'home')}
<main id="top">
  <section class="hero hero-inner">
    <div class="hero-card">
      <div class="hero-bg" style="--img:url('{img(PAGES['home'][5], 2000)}')"></div>
      <div class="hero-copy">
        <span class="eyebrow">404</span>
        <h1>{u['not_found_title']}</h1>
        <div class="hero-lead"><p>{u['not_found_text']}</p><p lang="pl">{p['not_found_title']}. {p['not_found_text']}</p></div>
        <div class="btn-row"><a class="btn btn-accent" href="/">{u['not_found_btn']}</a><a class="btn btn-outline-light" href="/pl/" lang="pl">{p['not_found_btn']}</a></div>
      </div>
    </div>
  </section>
</main>
<script src="/assets/app.js?v={ASSET_VER}"></script>
</body>
</html>
'''
    (OUT / '404.html').write_text(doc, encoding='utf8')


def build_sitemap(indexable):
    rows = []
    for key in indexable:
        for lang in LANGS:
            alts = ''.join(f'\n    <xhtml:link rel="alternate" hreflang="{l}" href="{SITE_URL + url(key, l)}"/>' for l in LANGS)
            alts += f'\n    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE_URL + url(key, DEFAULT_LANG)}"/>'
            rows.append(f'  <url>\n    <loc>{SITE_URL + url(key, lang)}</loc>\n    <lastmod>{TODAY}</lastmod>{alts}\n  </url>')
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
           + '\n'.join(rows) + '\n</urlset>\n')
    (OUT / 'sitemap.xml').write_text(xml, encoding='utf8')
    (OUT / 'robots.txt').write_text(f'User-agent: *\nAllow: /\n\nSitemap: {SITE_URL}/sitemap.xml\n', encoding='utf8')


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    shutil.copytree(SRC / 'static', OUT)
    indexable = []
    titles = {}
    for key in PAGES:
        metas = {}
        for lang in LANGS:
            if not (SRC / 'content' / lang / f'{key}.txt').exists():
                WARN.append(f'{lang}:{key}: content file missing')
                continue
            metas[lang] = build_page(key, lang)
            t = metas[lang].get('title', '')
            if t in titles:
                WARN.append(f'duplicate title: {lang}:{key} = {titles[t]}')
            titles[t] = f'{lang}:{key}'
        if all('noindex' not in m.get('robots', '') for m in metas.values()):
            indexable.append(key)
    build_404()
    build_sitemap(indexable)
    print(f'Built {len(list(OUT.rglob("index.html")))} pages into {OUT}')
    if WARN:
        print('\nWARNINGS:')
        for w in WARN:
            print(' -', w)
    (ROOT / 'src' / 'MISSING-DATA.txt').write_text(
        '\n'.join(f'{k}\n' + '\n'.join('   ' + x for x in v) for k, v in sorted(TODO.items())) + '\n', encoding='utf8')
    print(f'\nPages with missing data: {len(TODO)} (see src/MISSING-DATA.txt)')


if __name__ == '__main__':
    main()
