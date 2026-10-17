"""SEO checks over the built site in public/.

    python src/check.py
"""
import pathlib
import re
import sys
from html.parser import HTMLParser

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from siteconf import SITE_URL  # noqa: E402

OUT = pathlib.Path(__file__).resolve().parent.parent / 'public'


class P(HTMLParser):
    def __init__(self):
        super().__init__()
        self.h = []
        self.links = []
        self.alts = {}
        self.canon = None
        self.title = ''
        self.desc = None
        self.robots = None
        self._in = None

    def handle_starttag(self, tag, a):
        a = dict(a)
        if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'title'):
            self._in = tag
            if tag != 'title':
                self.h.append([tag, ''])
        if tag == 'a' and a.get('href'):
            self.links.append(a['href'])
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canon = a['href']
        if tag == 'link' and a.get('rel') == 'alternate' and a.get('hreflang'):
            self.alts[a['hreflang']] = a['href']
        if tag == 'meta' and a.get('name') == 'description':
            self.desc = a.get('content')
        if tag == 'meta' and a.get('name') == 'robots':
            self.robots = a.get('content')

    def handle_endtag(self, tag):
        if tag == self._in:
            self._in = None

    def handle_data(self, d):
        if self._in == 'title':
            self.title += d
        elif self._in and self.h:
            self.h[-1][1] += d


def page_url(f):
    rel = f.relative_to(OUT).as_posix()
    return '/' + rel[:-len('index.html')] if rel.endswith('index.html') else '/' + rel


errors, warns = [], []
pages = {}
for f in sorted(OUT.rglob('*.html')):
    p = P()
    txt = f.read_text(encoding='utf8')
    p.feed(txt)
    pages[page_url(f)] = (p, txt)

existing = set(pages)
titles, descs = {}, {}
for u, (p, txt) in pages.items():
    if u == '/404.html':
        continue
    h1 = [h for h in p.h if h[0] == 'h1']
    if len(h1) != 1:
        errors.append(f'{u}: {len(h1)} x H1')
    # heading levels must not skip (h2 -> h4)
    prev = 1
    for tag, _ in p.h:
        lvl = int(tag[1])
        if lvl > prev + 1:
            warns.append(f'{u}: heading jump h{prev} -> h{lvl}')
        prev = lvl
    if p.canon != SITE_URL + u:
        errors.append(f'{u}: canonical {p.canon}')
    if not p.desc:
        errors.append(f'{u}: no description')
    if 'noindex' in (p.robots or '') and 'polityka' not in u:
        errors.append(f'{u}: noindex')
    if set(p.alts) != {'uk', 'pl', 'x-default'}:
        errors.append(f'{u}: hreflang {sorted(p.alts)}')
    for lang, href in p.alts.items():
        tu = href.replace(SITE_URL, '')
        if tu not in existing:
            errors.append(f'{u}: hreflang {lang} -> missing {tu}')
        elif pages[tu][0].alts.get('uk') != p.alts.get('uk') or pages[tu][0].alts.get('pl') != p.alts.get('pl'):
            errors.append(f'{u}: hreflang not reciprocal with {tu}')
    titles.setdefault(p.title, []).append(u)
    descs.setdefault(p.desc, []).append(u)
    if len(p.title) > 75:
        warns.append(f'{u}: title {len(p.title)} chars')
    for l in p.links:
        if l.startswith(('http', 'tel:', 'mailto:', '#')):
            continue
        path = l.split('#')[0].split('?')[0]
        if path not in existing:
            errors.append(f'{u}: broken link {l}')
    for bad in (r'Варшав', r'Warszaw', r'\+48', r'\d\s?zł', r'\d\s?зл', r'Olena Kovalenko', r'>5\.0<'):
        if re.search(bad, txt):
            errors.append(f'{u}: contains «{bad}»')

for t, us in titles.items():
    if len(us) > 1:
        errors.append(f'duplicate title «{t}»: {us}')
for d, us in descs.items():
    if len(us) > 1:
        errors.append(f'duplicate description: {us}')

sm = (OUT / 'sitemap.xml').read_text(encoding='utf8')
locs = re.findall(r'<loc>([^<]+)</loc>', sm)
for l in locs:
    if l.replace(SITE_URL, '') not in existing:
        errors.append(f'sitemap: missing page {l}')
if any('polityka' in l for l in locs):
    errors.append('sitemap: contains noindex privacy page')

print(f'{len(pages)} html files, {len(locs)} sitemap urls')
for e in errors:
    print('ERROR', e)
for w in warns:
    print('warn ', w)
print('OK' if not errors else f'{len(errors)} errors')
