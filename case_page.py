"""案例主頁及獨立詳情頁：只呈現已有資料，建議安排另作標示。"""
from pathlib import Path
import json
from html import escape as e
ROOT=Path(__file__).parent
CASES=json.loads((ROOT/'cases.json').read_text())
REFS=json.loads((ROOT/'references.json').read_text())
REFMAP={r['id']:r for r in REFS}
import demo_plans

def link(c):return 'case-'+c['id']+'.html'
def fact_icon(label):
    # 圖示按欄位意義選擇；真正標籤仍留在語意化 dt 供輔助閱讀。
    paths={
        'calendar':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2"/>',
        'users':'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m2-16a3 3 0 0 1 0 6m4 10v-3a6 6 0 0 0-4-5"/>',
        'pin':'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
        'area':'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 17 17 7M11 7h6v6M7 11v6h6"/>',
        'clock':'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
        'headset':'<path d="M6 7V6a6 6 0 0 1 12 0v1M4 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4l-4-3-4 3H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><path d="M7 11h2m6 0h2"/>'}
    if '日期' in label or '年份' in label:kind='calendar'
    elif '規模' in label or '同時' in label:kind='users'
    elif '地點' in label:kind='pin'
    elif '場地' in label:kind='area'
    elif '安排' in label or '形式' in label:kind='clock'
    else:kind='headset'
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+paths[kind]+'</svg>'

def facts(c,compact=False):
    def item(label,value,description):
        term=('<span class="fact-sr-only">'+e(label)+'</span>'+fact_icon(label)) if compact else e(label)
        return f'<div><dt title="{e(label)}">{term}</dt><dd>{e(value)}<small>{e(description)}</small></dd></div>'
    return '<dl class="case-facts'+(' card-facts' if compact else '')+'">'+''.join(item(*fact) for fact in c['facts'])+'</dl>'
def property_art():
    return '<div class="process-art" role="img" aria-label="VR 介紹、分組體驗與討論、分享回顧的流程示意"><span>VR 安全情境培訓</span><div><b>情境預覽</b><i aria-hidden="true"></i><b>體驗與討論</b><i aria-hidden="true"></i><b>分享回顧</b></div><small>由工作情境，連繫日常需要</small></div>'
def card(c):
    visual=f'<img src="{c["cover"]}" alt="{e(c["title"])}'+('配置示意' if c['cover'] and c['cover'].endswith('.svg') else '現場')+'" width="800" height="520" loading="lazy">' if c['cover'] else property_art()
    return f'''<article class="event-card" data-category="{c['filter']}" data-format="{c['format']}"><a class="event-card-link" href="{link(c)}"><div class="event-cover {'diagram-cover' if c['cover'] and c['cover'].endswith('.svg') else ''}">{visual}<span class="cover-label">{e(c['label'])}</span></div><div class="event-card-body"><p class="eyebrow">{e(c['category'])}</p><h3>{e(c['title'])}</h3>{facts(c,True)}<span class="card-action">查看活動安排<span aria-hidden="true">＋</span></span></div></a></article>'''

def ref_filter(r):
    if r['id'] in ['haesl','mtr','hsbc-hangseng']:return 'corporate'
    if r['program']=='discovery' or r['id']=='hkic':return 'school'
    if r['id']=='sino':return 'corporate'
    return 'expo'

def gallery():
    def datekey(r):
        import re
        x=[int(v) for v in re.findall(r'\d+',r['date'])[:3]]
        return tuple(x+[0]*(3-len(x)))
    albums=sorted([r for r in REFS if r['images']],key=datekey,reverse=True)
    docs=[r for r in REFS if not r['images']]
    # 一個活動一個相簿；封面只開啟該活動的相片集合。
    markup=''.join(f'''<button class="gallery-photo" type="button" data-album-id="{r['id']}" data-gallery-category="{ref_filter(r)}" data-search="{e(r['name']+' '+r['summary']+' '+' '.join(r['scope']))}" aria-label="打開相簿：{e(r['name'])}，{len(r['images'])} 張相片"><img src="{r['images'][0]}" alt="{e(r['name'])}相簿封面" loading="lazy" decoding="async" width="{r['imageDimensions'][0]['width']}" height="{r['imageDimensions'][0]['height']}"><span class="gallery-photo-caption"><strong>{e(r['name'])}</strong><time>{e(r['date'])}</time></span><span class="gallery-album-count">{len(r['images'])} 張相片</span><span class="gallery-photo-zoom" aria-hidden="true">↗</span></button>''' for r in albums)
    docsmarkup=''.join(f'<button type="button" data-case="{r["id"]}"><span>{e(r["date"])}</span><strong>{e(r["name"])}</strong><span>查看流程參考</span></button>' for r in docs)
    return f'''<section class="section wrap" id="gallery"><div class="section-heading"><div><p class="eyebrow">不同活動，真實現場</p><h2>過往活動相片</h2><p>由校園工作坊到企業活動、論壇及海外展覽，看看不同形式的現場安排。</p></div><span class="collection-count">{len(albums)} 個相簿 · {sum(len(r['images']) for r in albums)} 張精選相片</span></div><div class="gallery-tools"><div class="chips" role="group" aria-label="篩選活動相簿">{''.join(f'<button type="button" data-gallery-filter="{k}" aria-pressed="{str(k=="all").lower()}">{v}</button>' for k,v in [('all','全部'),('corporate','企業'),('school','學校與學院'),('expo','業界與展覽')])}</div><label class="gallery-search"><span>搜尋活動</span><input type="search" id="gallery-search" placeholder="例如：學校、VR、安全" autocomplete="off"></label></div><div class="photo-grid" id="album-grid">{markup}</div><p class="empty-state" id="gallery-empty" hidden>暫時沒有符合條件的相簿。請試試其他關鍵字或分類。</p><div class="gallery-bottom"><p id="gallery-status" role="status" aria-live="polite"></p><button class="button secondary" type="button" id="show-albums">查看全部相簿</button></div><details class="document-references"><summary>其他活動流程參考 <span>{len(docs)} 項</span></summary><div>{docsmarkup}</div></details></section>'''

PROGRAMS=[('XR 探索工作坊','學校、企業創新團隊','認識主題','分組探索','分享構想','XR 應用構想卡','由觀察、提問與體驗，延伸一個可應用於課堂或工作的想法。'),('Team Building 協作挑戰','企業 HR、跨部門團隊','分配角色','共同解難','團隊回顧','團隊合作約定卡','透過操作、觀察與協調的角色分工，交流線索，共同完成任務。'),('行業情境體驗日','物管、工程及培訓團隊','講解情境','體驗與討論','整理下一步','觀察行動卡','走進工作情境，觀察問題、比較選擇，再整理具體行動。')]

def programs():
    # 三個方向保持展開；共用的人數／時間／空間示例只顯示一次。
    cards=''
    for name,audience,s1,s2,s3,takeaway,description in PROGRAMS:
        cards+=f'''<article class="program-compare-card"><header><h3>{name}</h3><p><span>適合對象</span>{audience}</p></header><section><h4>活動重點</h4><p>{description}</p></section><section><h4>活動流程</h4><ol class="compare-steps compare-timeline">{''.join(f'<li><span class="timeline-node" aria-hidden="true">{i+1}</span><time>{minutes} 分鐘</time><strong>{step}</strong></li>' for i,(step,minutes) in enumerate(zip([s1,s2,s3],[25,105,20])))}</ol></section><section class="compare-takeaway"><h4>活動後帶走</h4><strong>{takeaway}</strong></section><a class="text-link compare-cta" href="#enquiry" data-enquiry="{name}">商討這個活動方向 <span aria-hidden="true">↗</span></a></article>'''
    return '<section class="section wrap" id="programs"><div class="section-heading"><div><p class="eyebrow">按你的目標，選擇活動方向</p><h2>按活動目標選擇方向</h2><p>以下為活動目標的比較，可配合上方五款示範方案，再按對象、人數及場地商討。</p></div></div><div class="planning-example"><span>共用規劃示例</span><div class="planning-facts"><span>30 人示例</span><span>約 2.5 小時</span><span>場地示例約 90 m²</span></div><p>流程示例：25 分鐘介紹、105 分鐘體驗、20 分鐘回顧；包括換組時間，實際安排可調整。</p></div><div class="program-comparison">'+cards+'</div></section>'

def enquiry(context=''):
    return f'''<section class="enquiry-section" id="enquiry"><div class="wrap enquiry-layout"><div class="enquiry-copy"><p class="eyebrow">LET’S TALK</p><h2>想安排類似活動？</h2><p>告訴我們活動對象、預計人數與日期；如有場地資料，也可以一併提供。我們會與你商討合適的內容及安排。</p><div class="contact-links"><a href="mailto:info@vtmdigital.com">info@vtmdigital.com</a><a href="tel:+85235903127">+852 3590 3127</a></div></div><form id="enquiry-form" class="enquiry-form"><div class="form-row"><label>姓名 <span>必填</span><input name="name" autocomplete="name" required maxlength="100"></label><label>工作電郵 <span>必填</span><input name="email" type="email" autocomplete="email" required maxlength="254"></label></div><label>公司／機構 <span>選填</span><input name="company" autocomplete="organization" maxlength="200"></label><label>查詢內容 <span>選填</span><textarea name="notes" rows="4" maxlength="4000" placeholder="例如：學校活動、約 60 位學生、預計 3 月舉行；場地尚未確定。">{e(context)}</textarea></label><button class="button dark" type="submit">準備電郵查詢</button><p class="form-note">按下後會開啟電郵草稿，請在電郵程式確認並寄出。</p><p class="form-status" id="enquiry-status" role="status" aria-live="polite"></p></form></div></section>'''

def shell(title,body,filename):
    css=(ROOT/'case-page.css').read_text()+'\n'+(ROOT/'references.css').read_text()+'\n'+(ROOT/'case-page-overrides.css').read_text()+'\n'+(ROOT/'demo-plans.css').read_text()
    refs=[{k:v for k,v in r.items() if k in ('id','name','date','summary','scope','public','images','imageDimensions','program','coverPosition')} for r in REFS]
    js=(ROOT/'references.js').read_text().replace('__REFERENCES__',json.dumps(refs,ensure_ascii=False))+'\n'+(ROOT/'case-page.js').read_text()+'\n'+(ROOT/'demo-plans.js').read_text()
    base='' if filename=='index.html' else 'index.html'
    dialog='<dialog class="reference-dialog" id="case-dialog" aria-labelledby="case-title"><div class="lightbox-top"><h2 id="case-title">活動相簿</h2><button type="button" id="case-close" autofocus>關閉</button></div><div id="case-content"></div></dialog>'
    dialog+='<dialog class="gallery-lightbox" id="gallery-dialog" aria-labelledby="gallery-caption"><div class="gallery-lightbox-bar"><p id="gallery-position" role="status" aria-live="polite"></p><button type="button" id="gallery-close" autofocus aria-label="關閉放大相片">關閉 ✕</button></div><figure><img id="gallery-photo" alt=""><figcaption id="gallery-caption"></figcaption></figure><div class="gallery-lightbox-controls"><button type="button" id="gallery-prev" aria-label="上一張相片">← 上一張</button><span>左右切換相片</span><button type="button" id="gallery-next" aria-label="下一張相片">下一張 →</button></div></dialog>'

    return f'''<!doctype html><html lang="zh-Hant-HK"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="VTM XR 活動與培訓：五款活動示範方案、小中大場地配置、流程與設備人手，並可參考真實活動相簿。"><meta name="theme-color" content="#1b2b4b"><title>{e(title)}｜VTM Digital</title><style>{css}</style></head><body data-mode="cases"><a class="skip-link" href="#main">跳到主要內容</a><header class="site-header"><div class="wrap header-inner"><a href="index.html" class="site-brand"><img src="assets/vtm-logo.svg" width="62" height="52" alt="VTM Digital"><span>XR 活動與培訓</span></a><nav aria-label="主要導覽"><a href="{base}#cases">活動示範</a><a href="{base}#gallery">活動相片</a><a href="{base}#programs">目標比較</a><a class="nav-enquiry" href="#enquiry">查詢活動</a></nav></div></header>{body}{dialog}<dialog id="plan-dialog" class="plan-dialog" aria-labelledby="plan-title"><div class="lightbox-top"><h2 id="plan-title">場地配置示意</h2><button type="button" id="plan-close" autofocus>關閉</button></div><div class="plan-scroll"><img src="assets/aviation-floor.svg" width="640" height="480" alt="三個 VR 體驗站、輪候及安全通道配置"></div><p>全場約 8 × 6 m · S 為技術人員 · 青綠圓點為電源位置。配置示意，非施工圖。</p></dialog><footer class="site-footer wrap"><div><strong>VTM Digital</strong><p>活動內容、場地與設備安排可按需要調整。</p></div><div><a href="https://vtmdigital.com/hk/contact-us/">VTM 聯絡資料</a><a href="compare.html">查看其他版面</a></div></footer><script>{js}</script></body></html>'''

def homepage():
    hero='''<section class="case-hero"><div class="wrap hero-layout"><div><p class="eyebrow">XR 活動服務</p><h1>看看你的 XR 活動，<br>可以怎樣安排。</h1><p class="hero-intro">由小型課室到大型展覽，看看五款活動方向的配置、流程與設備人手，再按你的目標規劃。</p><a class="button mint" href="#cases">查看五款示範方案</a></div><aside class="hero-questions"><p>每款方案，都展示具體安排</p><ul><li>小、中、大場地如何配置？</li><li>參加者如何輪流體驗？</li><li>流程、設備與人手如何安排？</li><li>你和 VTM 分別準備甚麼？</li></ul></aside></div></section>'''
    return '<main id="main">'+hero+demo_plans.collection()+programs()+gallery()+enquiry()+'</main>'

def checklist(items):return '<ul class="checklist">'+''.join('<li>'+e(x)+'</li>' for x in items)+'</ul>'
def aviation_extra():
    return '''<section class="detail-panel"><div class="section-heading"><div><p class="eyebrow">體驗如何進行</p><h2>每位參加者約 8–9 分鐘</h2></div></div><ol class="participant-flow"><li><strong>簡介</strong><span>約 1 分鐘</span></li><li><strong>佩戴及調校</strong><span>約 1 分鐘</span></li><li class="emphasis"><strong>VR 體驗</strong><span>約 5–6 分鐘</span></li><li><strong>查看結果</strong><span>約 1 分鐘</span></li></ol><h3 class="schedule-title">一般日的安排</h3><ol class="day-flow"><li><strong>準備</strong><time>08:00</time></li><li class="emphasis"><strong>開放 3 節</strong><time>09:15–12:30</time></li><li><strong>午膳</strong><time>12:30–14:30</time></li><li class="emphasis"><strong>開放 2 節</strong><time>14:30–16:30</time></li></ol><p class="small-note">活動前一天下午預留約 3 小時佈置及檢查。第一天於 09:45 開始，另設夜間時段；以上時段為一般日安排。</p></section><section class="capacity-panel" aria-labelledby="capacity-title"><div><p class="eyebrow">按你的規模，初步估算</p><h2 id="capacity-title">換成你的人數</h2><p>以此案例每小時約 20 人次的安排速度估算。</p><div class="chips" role="group" aria-label="選擇預計體驗人次"><button type="button" data-capacity="60" aria-pressed="false">60 人次</button><button type="button" data-capacity="120" aria-pressed="true">120 人次</button><button type="button" data-capacity="200" aria-pressed="false">200 人次</button><button type="button" data-capacity="300" aria-pressed="false">300 人次</button></div><label class="custom-capacity">或輸入預計體驗人次<input id="capacity-number" type="number" min="1" max="10000" step="1" value="120" inputmode="numeric"></label><p class="small-note" id="capacity-error" role="status" aria-live="polite"></p></div><div class="capacity-result" aria-live="polite"><span>預計體驗開放時間</span><strong id="capacity-result">約 6 小時</strong><p>未計午膳、佈置及撤場。</p><p id="capacity-note">實際安排按內容與現場條件確認。</p></div></section>'''

def detail(c):
    ref=REFMAP.get(c['reference'])
    heading=f'''<div class="detail-heading wrap"><a class="back-link" href="index.html#cases">返回所有案例</a><p class="eyebrow">{e(c['category'])} · {e(c['label'])}</p><h1>{e(c['title'])}</h1><p>{e(c['intro'])}</p>{facts(c)}</div>'''
    floorplan=''
    if c['id']=='aviation-safety':
        floorplan='''<div class="floorplan"><h2>場地平面配置</h2><button class="floor-open" type="button" id="open-plan" aria-label="放大場地配置示意"><img src="assets/aviation-floor.svg" width="640" height="480" alt="約 8 × 6 m，設三個 VR 體驗站、輪候區及安全通道"><span>放大配置圖</span></button><p class="small-note">全場約 8 × 6 m · S 為技術人員 · 青綠圓點為電源。配置示意，非施工圖。</p></div>'''
    if ref and ref['images']:
        visual=f'''<div class="detail-photo"><img src="{c['cover'] or ref['images'][0]}" alt="{e(c['title'])}現場" width="1600" height="1067" fetchpriority="high"><button class="photo-gallery-link" type="button" data-case="{ref['id']}">查看 {len(ref['images'])} 張現場相片</button></div>'''
    else:visual='<div class="detail-process"><h2>活動流程</h2>'+property_art()+'</div>'
    topics='<div class="detail-topics"><p class="eyebrow">'+('每天安排其中 2 個情境' if c['id']=='aviation-safety' else '可參考的活動內容')+'</p><h2>'+('6 個 VR 安全情境' if c['id']=='aviation-safety' else '這場活動的重點')+'</h2><ol>'+''.join('<li>'+e(x)+'</li>' for x in c['topics'])+'</ol></div>'
    content='<div class="wrap detail-body"><section class="detail-panel detail-overview">'+visual+topics+'</section>'
    if c['id']=='aviation-safety':
        content+='<section class="detail-panel">'+floorplan+'</section>'+aviation_extra()
    else:
        content+='<section class="detail-panel"><div class="section-heading"><div><p class="eyebrow">活動如何進行</p><h2>由介紹，到體驗與交流</h2></div></div><ol class="activity-steps">'+''.join(f'<li><span aria-hidden="true">{i+1}</span><div><h3>{e(title)}</h3><p>{e(desc)}</p></div></li>' for i,(title,desc) in enumerate(c['steps']))+'</ol></section>'
    content+='<section class="responsibilities"><div class="detail-panel"><p class="eyebrow">'+('此案例的配置' if c['id']=='aviation-safety' else '服務內容參考')+'</p><h2>VTM 提供</h2>'+checklist(c['provide'])+'</div><div class="detail-panel"><p class="eyebrow">'+('主辦單位準備' if c['id']=='aviation-safety' else '籌備類似活動時')+'</p><h2>你需要準備</h2>'+checklist(c['prepare'])+'</div></section><p class="preparation-note">'+e(c['note'])+'</p>'
    others=[x for x in CASES if x['id']!=c['id']][:3]
    content+='<section class="related-section"><div class="section-heading"><div><h2>看看其他活動安排</h2><p>不同案例展示不同參與方式，並非相同場地或規模。</p></div></div><div class="case-grid">'+''.join(card(x) for x in others)+'</div></section></div>'
    return '<main id="main">'+heading+content+enquiry('參考活動：'+c['title'])+'</main>'

def build():
    (ROOT/'dist/index.html').write_text(shell('XR 活動與培訓',homepage(),'index.html'))
    for c in CASES:(ROOT/'dist'/link(c)).write_text(shell(c['title'],detail(c),link(c)))
    demo_plans.build(shell,enquiry)

    # 舊相片案例連結導向合併頁，保留已分享網址。
    old=shell('航空工程公司 · 員工 VR 安全體驗區','<main id="main" class="wrap section"><h1>航空工程公司 · 員工 VR 安全體驗區</h1><p role="status" aria-live="polite">現場相片與活動安排已合併，<a href="case-aviation-safety.html">查看完整案例</a>。</p></main>','case-haesl.html')
    old=old.replace('</head>','<link rel="canonical" href="case-aviation-safety.html"><meta http-equiv="refresh" content="0;url=case-aviation-safety.html"></head>')
    (ROOT/'dist/case-haesl.html').write_text(old)
