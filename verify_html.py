"""核對產物結構、內部連結、照片資源與明顯秘密字串。"""
from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path(__file__).parent
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())

class Check(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack, self.ids, self.links = [], set(), []
        self.images = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, f'Duplicate id: {a["id"]}'
            self.ids.add(a['id'])
        if tag == 'img':
            assert 'alt' in a
            if a.get('src'): self.images.append(a['src'])
        if tag == 'a':
            self.links.append(a.get('href', ''))
            if a.get('target') == '_blank':
                assert 'noopener' in a.get('rel', '')
        if tag not in VOID:
            self.stack.append(tag)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag not in VOID:
            assert self.stack and self.stack[-1] == tag, f'Unbalanced {tag}, stack {self.stack[-5:]}'
            self.stack.pop()

files = list((ROOT/'dist').glob('*.html')) + list((ROOT/'qa').glob('*.html'))
for p in files:
    s = p.read_text()
    c = Check()
    c.feed(s)
    assert not c.stack, (p.name, c.stack)
    if p.parent.name == 'dist':
        assert 'lang="zh-Hant-HK"' in s
        assert '@media(max-width:760px)' in s
        assert "' + PLANNING + '" not in s
        assert '看看怎樣玩' not in s
        assert 'prefers-reduced-motion' in s
        assert 'aria-live="polite"' in s or p.name in ('index.html', 'a-program-catalog.html', 'compare.html')
        for href in c.links:
            if href.endswith('.html'):
                assert (p.parent/href).is_file(), (p.name, href)
    else:
        # 訪客版不再列完整操作表格。
        assert '<table' not in s
        assert 'undefined' not in s

patterns = [r'sk-[a-zA-Z0-9]{20,}', r'AIza[a-zA-Z0-9_-]{35}', r'ghp_[a-zA-Z0-9]{36}', r'AKIA[A-Z0-9]{16}', r'xoxb-[0-9]+-[a-zA-Z0-9]+']
for p in files:
    checker=Check();checker.feed(p.read_text())
    for image in checker.images:
        assert (ROOT/'dist'/image).is_file(), (p.name, image)

for p in (ROOT/'dist').glob('*.html'):
    assert not any(re.search(pattern, p.read_text()) for pattern in patterns), f'Secret-like string in {p.name}'
print(f'PASS: {len(files)} HTML documents/fragments; structure, unique IDs, local links, responsive rules, photo assets and secret-pattern scan.')
