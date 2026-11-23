"""五款規劃示例與可縮放場地概念圖；與真實活動紀錄分開。"""
from pathlib import Path
import json, math
from html import escape as e
ROOT=Path(__file__).parent
DEMOS=json.loads((ROOT/'demos.json').read_text())
REFS={x['id']:x for x in json.loads((ROOT/'references.json').read_text())}


def icon(kind):
    paths={
        'classroom':'<path d="M4 5h24v18H4zM9 30h14M16 23v7M9 11h14M9 16h9"/>',
        'team':'<circle cx="10" cy="10" r="4"/><circle cx="24" cy="10" r="4"/><path d="M3 29v-4a7 7 0 0 1 14 0v4m0-4a7 7 0 0 1 14 0v4M13 17l4 3 4-3"/>',
        'safety':'<path d="M17 2 29 7v10c0 7-12 14-12 14S5 24 5 17V7Z"/><path d="m10 16 5 5 9-10"/>',
        'zone':'<rect x="3" y="10" width="28" height="17" rx="4"/><path d="M9 10V8a8 8 0 0 1 16 0v2M3 18H1m30 0h2M11 17h2m8 0h2m-9 10 3-4 3 4"/>',
        'expo':'<path d="M3 31V6h28v25M1 6 5 1h24l4 5M8 12h18v11H8zM12 31v-4h10v4"/>'}
    return '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[kind]+'</svg>'


def floorplan(c,l):
    # 體驗站按 2 × 2 m 概念格繪製；展示尺寸是規劃示例，不作施工或容量認證。
    w,h=l['width'],l['depth'];scale=min(640/w,340/h)
    ox=80+(640-w*scale)/2;oy=90+(340-h*scale)/2
    def rect(x,y,rw,rh,fill='#e8f5f6',stroke='#087d89',dash=False):
        return f'<rect x="{ox+x*scale:.1f}" y="{oy+y*scale:.1f}" width="{rw*scale:.1f}" height="{rh*scale:.1f}" rx="3" fill="{fill}" stroke="{stroke}"'+(' stroke-dasharray="5 4"' if dash else '')+'/>'
    def text(x,y,value,size=13,color='#1b2b4b'):
        return f'<text x="{ox+x*scale:.1f}" y="{oy+y*scale:.1f}" text-anchor="middle" dominant-baseline="middle" font-size="{size}" fill="{color}">{e(value)}</text>'
    parts=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 530" role="img" aria-label="{e(c["title"])}{l["label"]}配置示例，{w} 乘 {h} 米"><rect width="800" height="530" fill="#fff"/>',f'<g font-family="Arial,PingFang TC,Microsoft JhengHei,sans-serif"><text x="400" y="28" text-anchor="middle" font-size="19" font-weight="700" fill="#1b2b4b">{e(c["title"])} · {l["label"]}配置示例</text><text x="400" y="53" text-anchor="middle" font-size="14" fill="#536271">{w} × {h} m · {l["area"]} m² · {l["stations"]} 個體驗站</text>',rect(0,0,w,h,'#fff','#1b2b4b')]
    screenw=min(w*.45,w-2.8)
    parts += [rect(.25,.15,screenw,.55,'#1b2b4b','#1b2b4b'),text(.25+screenw/2,.425,'屏幕／講解',11,'#fff'),rect(w-2.25,.15,2,.55,'#f3f5f7','#8ba3b3'),text(w-1.25,.425,'控制枱',11)]
    side=c['kind'] in ('classroom','team','expo');mainw=w*.65 if side else w
    cols=min(l['stations'],max(1,int((mainw-.6)/2.25)));rows=math.ceil(l['stations']/cols)
    blockw=cols*2+(cols-1)*.22;startx=max(.3,(mainw-blockw)/2);starty=.95
    for i in range(l['stations']):
        x=startx+(i%cols)*2.22;y=starty+(i//cols)*2.22
        parts += [rect(x,y,2,2,dash=True),text(x+1,y+.75,'體驗站 '+str(i+1),12),text(x+1,y+1.25,'2 × 2 m',11)]
    if side:
        sx=w*.69;sw=w-sx-.25
        label={'classroom':'分組討論','team':'隊伍交流','expo':'展示／洽談'}[c['kind']]
        parts += [rect(sx,1,sw,max(1,h-2),'#fff5da','#d8bd76'),text(sx+sw/2,1.45,label,12)]
        for i in range(4):
            x=ox+(sx+sw*(.3 if i%2==0 else .7))*scale;y=oy+(2+i//2*.65)*scale
            if 2+i//2*.65<h-1:parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5" fill="#d8bd76"/>')
    used=.95+(rows-1)*2.22+2
    spare=h-.65-used
    if spare>1.25:
        label={'classroom':'主題講解／小組分享','team':'集合／團隊回顧','safety':'講解／小組討論','zone':'觀察／輪候交流','expo':'示範／內容展示'}[c['kind']]
        parts += [rect(.3,used+.3,mainw-.6,spare-.55,'#f3f5f7','#d8e1e7'),text(mainw/2,used+.3+(spare-.55)/2,label,13)]
    qx=.3;qy=h-.65;qw=max(1,(w*.64 if side else w)-.6)
    parts += [rect(qx,qy,qw,.4,'#f3f5f7','#d8e1e7'),text(qx+qw/2,qy+.2,'通道／輪候與觀察',10),f'<text x="{ox+w*scale:.1f}" y="{oy+h*scale+22:.1f}" text-anchor="end" font-size="12" fill="#087d89">入口／出口 ↗</text>',f'<text x="{ox+w*scale/2:.1f}" y="{oy-12:.1f}" text-anchor="middle" font-size="13" fill="#536271">← {w} m →</text>',f'<text x="{ox-16:.1f}" y="{oy+h*scale/2:.1f}" text-anchor="middle" transform="rotate(-90 {ox-16:.1f} {oy+h*scale/2:.1f})" font-size="13" fill="#536271">← {h} m →</text>', '<text x="400" y="487" text-anchor="middle" font-size="12" fill="#536271">配置概念圖，非施工圖；實際設備、動線與人數按場地確認。</text></g></svg>']
    return ''.join(parts)


def reference_photo(c,compact=False):
    # 照片連到真實活動 Portfolio；不將其尺寸／成果套用到示意方案。
    blocks=''
    for item in c['references']:
        ref=REFS[item['reference']]
        photos=ref['images'][:1 if compact else 2]
        blocks+=f'<div class="demo-real-event"><div class="demo-reference-photos">'+''.join(f'<a href="{item["portfolio"]}" class="demo-reference-photo"><img src="{src}" alt="{e(ref["name"])} · 真實活動現場" loading="lazy" decoding="async" width="800" height="600"><span>查看活動 Portfolio ↗</span></a>' for src in photos)+f'</div><a class="demo-reference-title" href="{item["portfolio"]}"><strong>{e(ref["name"])}</strong><span>{e(ref["date"])} · {e(item["caption"])}</span></a></div>'
    if compact:return '<div class="demo-card-reference"><span class="demo-reference-label">真實活動參考</span>'+blocks+'</div>'
    return '<section class="detail-panel demo-references"><p class="eyebrow">從真實現場，參考活動如何進行</p><h2>相關活動 Portfolio</h2><p class="small-note">以下為真實活動相片，供參考體驗與交流方式；上方 Floor Plan、人數及流程為獨立的規劃示例。</p>'+blocks+'</section>'


def collection():
    cards=''
    for i,c in enumerate(DEMOS):
        lo,hi=c['layouts'][0],c['layouts'][-1];middle=c['layouts'][1]
        cards+=f'''<article class="demo-card" data-demo-id="{c['id']}" data-demo-url="case-{c['id']}.html"><a class="demo-main-link" href="case-{c['id']}.html"><div class="demo-plan-cover demo-icon-cover" data-demo-cover role="img" aria-label="{e(c['title'])}示範方案"><span class="demo-thumbnail-icon">{icon(c['kind'])}</span><span data-demo-cover-label>中型配置示例</span></div><div class="demo-card-content"><span class="demo-number">{e(c['category'])}</span><h3>{e(c['title'])}</h3><p>{e(c['tagline'])}</p><span class="demo-footprint" data-demo-footprint>{lo['area']}–{hi['area']} m² 示例</span><div class="demo-mini-facts"><span data-demo-card-stations>{middle['stations']} 個體驗站</span><span data-demo-card-duration>{middle['minutes']} 分鐘</span></div><span class="demo-open">查看配置與流程 <span aria-hidden="true">↗</span></span></div></a>{reference_photo(c,True)}</article>'''
    payload=e(json.dumps(DEMOS,ensure_ascii=False),quote=True)
    return f'''<section class="section wrap" id="cases" data-demo-catalog="{payload}"><div class="section-heading"><div><p class="eyebrow">五種方向，大小場地皆可商討</p><h2>活動示範方案</h2><p>看看一場活動可以怎樣安排，再按你的場地、人數與目標調整。以下為規劃示例，並非特定客戶活動實錄。</p></div></div><div class="case-filter-group"><span class="case-filter-label">場地規模</span><div class="chips" role="group" aria-label="選擇示範場地規模">{''.join(f'<button type="button" data-demo-scale="{k}" aria-pressed="{str(k=="all").lower()}">{v}</button>' for k,v in [('all','所有規模'),('small','小型'),('medium','中型'),('large','大型')])}</div></div><p class="filter-status" id="demo-catalog-status" role="status" aria-live="polite">5 款示範方案 · 可切換不同場地規模</p><div class="demo-grid">{cards}</div><p class="demo-swipe-hint">左右滑動，查看五款活動方向 →</p></section>'''

def detail(c,enquiry):
    l=c['layouts'][1]
    def formatted(items):return '<ul class="checklist">'+''.join('<li>'+e(x.format(**l))+'</li>' for x in items)+'</ul>'
    payload=e(json.dumps(c,ensure_ascii=False),quote=True)
    facts=[('示例面積','area',str(l['area'])+' m²'),('同時體驗','stations',str(l['stations'])+' 人'),('人手示例','staff',str(l['staff'])+' 人'),('活動時段','duration',str(l['minutes'])+' 分鐘')]
    heading=f'''<div class="detail-heading wrap" data-demo-config="{payload}"><a class="back-link" href="index.html#cases">返回五款活動方案</a><p class="eyebrow">{e(c['category'])} · 規劃示例</p><h1>{e(c['title'])}</h1><p>{e(c['intro'])}</p><div class="demo-note">本頁的尺寸、人數、設備與流程為示意配置，可按需要調整；並非已完成客戶活動的數據。</div><dl class="case-facts">{''.join(f'<div><dt>{label}</dt><dd data-demo-fact="{key}">{value}</dd></div>' for label,key,value in facts)}</dl></div>'''
    body=f'''<div class="wrap detail-body"><section class="detail-panel"><div class="section-heading"><div><p class="eyebrow">同一款活動，也可配合不同場地</p><h2>選擇配置規模</h2></div></div><div class="chips demo-size-options" role="group" aria-label="選擇場地配置">{''.join(f'<button type="button" data-demo-size="{x["size"]}" aria-pressed="{str(x["size"]=="medium").lower()}">{x["label"]} · {x["area"]} m²</button>' for x in c['layouts'])}</div><div class="demo-plan-layout"><div class="floorplan"><button type="button" class="floor-open" id="demo-open-plan" aria-label="放大示例場地配置圖"><img id="demo-floorplan" src="{l['floorplan']}" width="800" height="530" alt="{e(c['title'])}{l['label']}配置示例"><span>放大 Floor Plan</span></button></div><div><h3>這個配置怎樣安排？</h3><ul class="checklist"><li>場地：<strong data-demo-dimensions>{l['width']} × {l['depth']} m</strong></li><li>參與安排：<strong data-demo-people>{l['people']}</strong></li><li>體驗站：<strong data-demo-stations>{l['stations']} 個</strong></li><li>工作人員：<strong data-demo-staff>{l['staff']} 名</strong></li></ul><p class="small-note">每站以約 2 × 2 m 的體驗位置作概念示例；實際活動範圍、通道與設備按內容及場地確認。</p></div></div></section><section class="detail-panel demo-flow"><p class="eyebrow">由準備，到活動收結</p><h2>活動流程示例</h2><ol class="demo-timeline">{''.join(f'<li><time data-demo-step-time="{i}"></time><div><h3>{e(x)}</h3><p>{e(c["topics"][i])}</p></div></li>' for i,x in enumerate(c['steps']))}</ol><p class="small-note">以上為活動時段示例，進撤場與設備測試另外預留。</p></section><section class="detail-panel demo-capacity"><p class="eyebrow">按這個配置，初步估算</p><h2>換成你的體驗人次</h2><p>以每站每輪約 {l["cycle"]} 分鐘（含介紹、佩戴及換人）作規劃示例；不同內容可調整。</p><label>預計體驗人次 <input id="demo-capacity" type="number" min="1" max="10000" step="1" value="60" inputmode="numeric"></label><p class="demo-estimate" id="demo-estimate" role="status" aria-live="polite"></p><p class="small-note">此處只估算輪流使用裝置的開放時數，未計講解、討論、午膳與進撤場；不代表保證接待量。</p></section><section class="responsibilities"><div class="detail-panel"><p class="eyebrow">設備與帶領</p><h2>VTM 可安排</h2><div id="demo-provide">{formatted(c['provide'])}</div></div><div class="detail-panel"><p class="eyebrow">一起確認場地與流程</p><h2>主辦單位準備</h2>{formatted(c['prepare']+c['extras'])}</div></section><section class="detail-panel demo-result"><p class="eyebrow">活動後帶走</p><h2>{e(c['takeaway'])}</h2><p>適合對象：{e(c['audience'])}。內容、分組、設備與人手可按目標商討。</p><a class="button dark" href="#enquiry" data-enquiry="{e(c['title'])} · {l['label']}配置示例">商討這款活動</a></section>{reference_photo(c)}<section class="demo-other"><h2>看看其他活動方向</h2><div class="demo-related">{''.join(f'<a href="case-{x["id"]}.html">{e(x["title"])}</a>' for x in DEMOS if x['id']!=c['id'])}</div><p><a href="index.html#gallery">查看真實活動相簿 →</a></p></section></div>'''
    dialog=f'''<dialog id="demo-plan-dialog" class="plan-dialog" aria-labelledby="demo-plan-title"><div class="lightbox-top"><h2 id="demo-plan-title">{e(c['title'])} · 配置概念圖</h2><button type="button" id="demo-plan-close" autofocus>關閉</button></div><div class="plan-scroll"><img id="demo-plan-large" src="{l['floorplan']}" width="800" height="530" alt="放大的示意場地配置"></div><p>配置概念圖，非施工圖。實際設備、通道與參加人數按場地確認。</p></dialog>'''
    return '<main id="main">'+heading+body+enquiry(c['title']+' · 規劃示例')+'</main>'+dialog


def build(shell,enquiry):
    for c in DEMOS:
        for layout in c['layouts']:
            p=ROOT/'dist'/layout['floorplan'];p.parent.mkdir(parents=True,exist_ok=True);p.write_text(floorplan(c,layout))
        (ROOT/'dist'/('case-'+c['id']+'.html')).write_text(shell(c['title'],detail(c,enquiry),'case-'+c['id']+'.html'))
