#!/usr/bin/env python3
"""Generates link-preview share stubs: p/<id>/index.html (+ og.jpg) and assets/og.jpg.

The stubs only carry title, description and an OG image for LinkedIn/Slack previews, then redirect to /#<id>,
where the real content opens in the project modal.

Usage:  python3 concept-d/_tools/make_share.py [--fonts-css path/to/fonts.css]
Needs Python 3 and Playwright with Chromium (pip install playwright; playwright install chromium).
GitHub Pages does not publish folders that start with an underscore, so _tools stays private.
"""
import json, os, sys, html, asyncio

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SITE = 'https://arjunbhadra.com'
E = html.escape

src = open(os.path.join(ROOT, 'assets', 'projects.js'), encoding='utf-8').read()
DATA = json.loads(src.split('window.AB_DATA = ', 1)[1].rstrip().rstrip(';'))
P = DATA['projects']

fonts_css = ''
if '--fonts-css' in sys.argv:
    fonts_css = '<style>' + open(sys.argv[sys.argv.index('--fonts-css') + 1]).read() + '</style>'
else:
    fonts_css = '<link href="https://fonts.googleapis.com/css2?family=Saira:wdth,wght@50..125,100..900&family=IBM+Plex+Sans:wght@400;500&display=block" rel="stylesheet">'

LOGO = ('<svg viewBox="0 0 64 64" width="64" height="64"><g fill="none" stroke-linecap="round" stroke-linejoin="round">'
        '<rect x="4" y="10" width="56" height="44" rx="7" stroke="#e4f1f6" stroke-width="2.8"/><path d="M4 20 H60" stroke="#e4f1f6" stroke-width="2.2"/>'
        '<circle cx="10" cy="15" r="1.5" fill="#ffb27a"/><circle cx="15" cy="15" r="1.5" fill="#9be8ff"/><g stroke="#9be8ff" stroke-width="3">'
        '<circle cx="13.5" cy="40" r="4.2"/><path d="M17.7 35.8 V44.2"/><circle cx="25.5" cy="40" r="4.2"/><path d="M29.7 30 V44.2"/>'
        '<circle cx="37.5" cy="40" r="4.2"/><path d="M41.7 30 V44.2"/><path d="M46 30 V44.2"/><circle cx="50.2" cy="40" r="4.2"/></g></g></svg>')

def card_html(kicker, title, line):
    size = 92 if len(title) <= 22 else 72 if len(title) <= 34 else 58
    return f'''<!DOCTYPE html><html><head><meta charset="utf-8">{fonts_css}<style>
  body {{ margin: 0; width: 1200px; height: 630px; overflow: hidden; color: #e4f1f6; font-family: "IBM Plex Sans", system-ui, sans-serif;
    background: radial-gradient(60% 70% at 15% 0%, rgba(95,201,230,.22), transparent 70%), radial-gradient(50% 60% at 100% 100%, rgba(255,178,122,.12), transparent 70%), #060a0f; }}
  .grid {{ position: absolute; inset: 0; background-image: linear-gradient(rgba(155,232,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(155,232,255,.06) 1px, transparent 1px); background-size: 60px 60px; }}
  .wrap {{ position: absolute; inset: 70px 80px; display: flex; flex-direction: column; }}
  .top {{ display: flex; align-items: center; gap: 18px; font-family: Saira, sans-serif; font-size: 28px; }}
  .k {{ margin-top: auto; font-family: Saira, sans-serif; font-size: 22px; letter-spacing: .14em; text-transform: uppercase; color: #ffb27a; }}
  h1 {{ margin: 12px 0 18px; font-family: Saira, sans-serif; font-weight: 300; font-size: {size}px; line-height: 1.02; letter-spacing: -.02em; color: #f2f9fc; }}
  p {{ margin: 0; font-size: 30px; line-height: 1.35; color: #9db3bf; max-width: 960px; }}
  .bar {{ position: absolute; left: 80px; right: 80px; bottom: 44px; height: 2px; background: linear-gradient(90deg, #5fc9e6, #9be8ff 60%, transparent); }}
</style></head><body><div class="grid"></div><div class="wrap"><div class="top">{LOGO}<span>Arjun Bhadra</span></div>
<p class="k">{E(kicker)}</p><h1>{E(title)}</h1><p>{E(line)}</p></div><div class="bar"></div></body></html>'''

def stub(p):
    t, d, pid = p['title'], p['summary'], p['id']
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, follow">
<title>{E(t)} | Arjun Bhadra</title>
<meta name="description" content="{E(d)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Arjun Bhadra">
<meta property="og:title" content="{E(t)}">
<meta property="og:description" content="{E(d)}">
<meta property="og:url" content="{SITE}/p/{pid}/">
<meta property="og:image" content="{SITE}/p/{pid}/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0; url=../../#{pid}">
<script>location.replace('../../#{pid}');</script>
</head>
<body style="background:#060a0f;color:#e4f1f6;font-family:system-ui,sans-serif">
<p>Opening <a href="../../#{pid}" style="color:#9be8ff">{E(t)}</a>…</p>
</body>
</html>
'''

async def render(jobs):
    from playwright.async_api import async_playwright
    async with async_playwright() as pw:
        b = await pw.chromium.launch(**({'executable_path': os.environ['CHROME']} if os.environ.get('CHROME') else {}), args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 1200, 'height': 630})
        for html_src, out in jobs:
            await pg.set_content(html_src, wait_until='networkidle')
            await pg.evaluate('document.fonts.ready')
            await pg.screenshot(path=out, type='jpeg', quality=86)
        await b.close()

def main():
    jobs = []
    for p in P:
        d = os.path.join(ROOT, 'p', p['id']); os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(stub(p))
        jobs.append((card_html(p['kicker'], p['title'], p['card']['line']), os.path.join(d, 'og.jpg')))
    jobs.append((card_html('Applied AI, LLM systems, agentic workflows', 'Arjun Bhadra',
                           'Building AI systems that hold up in production, and the tools that help other engineers ship them.'),
                 os.path.join(ROOT, 'assets', 'og.jpg')))
    asyncio.run(render(jobs))
    print('wrote', len(P), 'share stubs and', len(jobs), 'OG images')

if __name__ == '__main__':
    main()
