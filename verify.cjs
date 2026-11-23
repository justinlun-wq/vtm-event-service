// 在沒有瀏覽器的環境核對產生內容及事件邏輯；不把此檢查當作視覺驗收。
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = __dirname;
fs.mkdirSync(path.join(root, 'qa'), { recursive: true });

function element(value = '') {
  return { innerHTML: '', textContent: '', value, checked: false, href: '',
    listeners: {}, attributes: {}, clientWidth: 1000, scrollLeft: 0, rect:{top:2000,bottom:3000,height:1000},
    style:{values:{},setProperty(key,value){this.values[key]=value;}},
    classList:{values:new Set(),add(key){this.values.add(key);},toggle(key,on){if(on)this.values.add(key);else this.values.delete(key);}},
    getBoundingClientRect(){return this.rect;}, scrollIntoView(options){this.scrolled=options;},
    removeAttribute(key){delete this.attributes[key];},
    scrollBy(options) { this.scrollLeft += options.left; },
    addEventListener(type, callback) { this.listeners[type] = callback; },
    setAttribute(key, value) { this.attributes[key] = value; },
    querySelectorAll(tag) { return (this.innerHTML.match(new RegExp('<'+tag+'[ >]', 'g')) || []).map(() => ({})); },
    showModal() { this.open=true; }, close() { this.open=false; },
    click() { this.clicked = true; } };
}

function load(file, mode, clipboard = true) {
  const html = fs.readFileSync(path.join(root, 'dist', file), 'utf8');
  const script = html.match(/<script>([\s\S]*)<\/script>/)[1];
  const els = new Map();
  const goal = element('discovery');
  const pickers = ['discovery', 'team', 'industry'].map(id => ({ ...element(), dataset: { pick: id } }));
  const get = id => { if (!els.has(id)) els.set(id, element()); return els.get(id); };
  get('venue').value = 'large';
  const documentListeners = {};
  const windowListeners = {};
  for(const [i,id] of ['discovery','team','industry'].entries()){get('program-'+id).rect={top:1600+i*1500,bottom:3100+i*1500,height:1500};}
  const filters = ['all', 'school', 'corporate', 'expo'].map(id => ({ ...element(), dataset: { galleryFilter: id }, textContent:id }));
  const copies = [];
  const downloads = [];
  const context = vm.createContext({
    console, Blob, setTimeout: callback => callback(), window:{innerHeight:900,matchMedia:()=>({matches:true}),requestAnimationFrame:callback=>callback(),addEventListener:(type,callback)=>{windowListeners[type]=callback;}},
    URL: { createObjectURL: () => 'blob:test', revokeObjectURL() {} },
    navigator: clipboard ? { clipboard: { writeText: async text => copies.push(text) } } : {},
    document: {
      body: { dataset: { mode }, classList:{add(){}} }, getElementById: id => { if(['showcase-grid','photo-dialog','case-dialog'].includes(id) && !html.includes('id="'+id+'"')) return null; return get(id); },
      addEventListener: (type, callback) => { documentListeners[type] = callback; },
      querySelector: selector => { assert.equal(selector, 'input[name=goal]:checked'); return goal; },
      querySelectorAll: selector => selector === '[data-gallery-filter]' ? filters : selector === '[data-pick]' ? pickers : selector === '[data-cta]' ? [get('cta')] : [],
      createElement: tag => { const el = element(); el.click = () => downloads.push(el.download); return el; },
    },
  });
  new vm.Script(script, { filename: file }).runInContext(context);
  return { get, goal, context, copies, downloads, pickers, filters, documentListeners, windowListeners };
}

function snapshot(name, html) {
  assert.match(html, /2.5 小時/);
  assert.match(html, /90 m/);
  assert.match(html, /30 人/);
  assert.match(html, /AI/);
  assert.match(html, /program-visual/);
  assert.ok(!/photo-open/.test(html), 'Activity illustration panels should not repeat gallery photos');
  assert.match(html, /related-cases/);
  assert.ok(!/<table|技術操作員|每輪預留/.test(html));
  assert.ok(!/undefined|\[object Object\]/.test(html));
  fs.writeFileSync(path.join(root, 'qa', name + '.html'), html);
}

(async () => {
  const catalog = load('a-program-catalog.html', 'catalog');
  assert.equal((catalog.get('cards').innerHTML.match(/class="program-card"/g) || []).length, 3);
  const full = catalog.get('details').innerHTML;
  const page=fs.readFileSync(path.join(root,'dist','a-program-catalog.html'),'utf8');
  const guideMarkup=page.split('id="activity-scroll-guide"')[1].split('</nav>')[0];
  for(const name of ['XR 探索工作坊','Team Building 協作挑戰','行業情境體驗日'])assert.ok(guideMarkup.includes(name));
  assert.ok(!guideMarkup.includes('guide-next') && !guideMarkup.includes('下一款'));
  const guideCss=fs.readFileSync(path.join(root,'scroll-guide.css'),'utf8');
  assert.ok(guideCss.includes('grid-template-columns:repeat(3,minmax(0,1fr))'));
  assert.ok(guideCss.includes('safe-area-inset-bottom'));
  assert.ok(guideCss.includes('opacity:1;visibility:visible')); 
  assert.equal(catalog.get('activity-scroll-guide').hidden,true);
  catalog.get('program-discovery').rect={top:600,bottom:2100,height:1500};
  catalog.windowListeners.scroll();
  assert.equal(catalog.get('activity-scroll-guide').hidden,false);
  assert.equal(catalog.get('guide-discovery').attributes['aria-current'],'location');
  catalog.get('program-discovery').rect={top:-1600,bottom:-100,height:1500};
  catalog.get('program-team').rect={top:-80,bottom:1420,height:1500};
  catalog.get('program-industry').rect={top:1450,bottom:2950,height:1500};
  catalog.windowListeners.scroll();
  assert.equal(catalog.get('guide-team').attributes['aria-current'],'location');
  assert.equal(catalog.get('guide-discovery').style.values['--section-progress'],'100%');
  catalog.get('guide-industry').listeners.click();
  assert.equal(catalog.get('program-industry').scrolled.behavior,'auto');
  catalog.get('program-team').rect={top:-1600,bottom:-100,height:1500};
  catalog.get('program-industry').rect={top:-100,bottom:1400,height:1500};
  catalog.windowListeners.scroll();
  assert.equal(catalog.get('guide-industry').attributes['aria-current'],'location');
  assert.equal(catalog.get('guide-industry').attributes['aria-current'],'location');
  catalog.get('program-industry').rect={top:-1600,bottom:-100,height:1500};
  catalog.windowListeners.scroll();
  assert.equal(catalog.get('activity-scroll-guide').hidden,true);
  for (const id of ['discovery', 'team', 'industry']) assert.match(full, new RegExp('id="program-' + id + '"'));
  snapshot('catalog', full);
  assert.ok(!catalog.get('cards').innerHTML.includes('看看怎樣玩'));
  assert.equal((catalog.get('cards').innerHTML.match(/了解活動方案/g)||[]).length,3);
  for(const id of ['discovery','team','industry']){
    const ordered=vm.runInContext('jobReferences.filter(r=>r.program==="'+id+'").sort((a,b)=>referenceDateKey(b)-referenceDateKey(a)).filter(r=>r.images.length).map(r=>r.id)',catalog.context);
    const section=full.split('id="case-track-'+id+'"')[1].split('</div>')[0];
    assert.deepEqual([...section.matchAll(/data-case="([^"]+)"/g)].map(m=>m[1]),Array.from(ordered));
  }

  const story = load('b-event-journey.html', 'story');
  for (const p of story.pickers) {
    story.get('program-picker').listeners.click({ target: { closest: () => p } });
    const text = story.get('story-content').innerHTML;
    snapshot('story-' + p.dataset.pick, text);
    assert.equal(p.attributes['aria-pressed'], true);
    assert.match(story.get('story-status').textContent, /目前顯示/);
    assert.ok(text.length < 18000, 'Visitor story should remain concise');
  }

  // 核對跨輸入方式切換，避免只有點按可用。
  const picker=story.get('program-picker');
  picker.listeners.pointerover({pointerType:'mouse',target:{closest:()=>story.pickers[1]}});
  assert.match(story.get('hero-title').innerHTML,/Team Building/);
  assert.ok(story.get('hero-team').classList.values.has('is-active'));
  assert.match(story.get('story-content').innerHTML,/takeaway-ticket/);
  picker.listeners.pointerover({pointerType:'touch',target:{closest:()=>story.pickers[2]}});
  assert.match(story.get('hero-title').innerHTML,/Team Building/);
  picker.listeners.focusin({target:{closest:()=>story.pickers[0]}});
  assert.match(story.get('hero-title').innerHTML,/探索新科技/);
  assert.ok(!story.get('hero-team').classList.values.has('is-active'));
  const primary=fs.readFileSync(path.join(root,'dist','index.html'),'utf8');
  assert.match(primary,/data-mode="cases"/);
  assert.ok(!primary.includes('Team Spirit'));
  // 新首頁與獨立詳情是同一份案例資料；原有三版仍按原互動驗收。
  new vm.Script(fs.readFileSync(path.join(root,'case-page.js'),'utf8'));
  const cases=JSON.parse(fs.readFileSync(path.join(root,'cases.json'),'utf8'));
  assert.equal(new Set(cases.map(c=>c.id)).size,cases.length);
  const demos=JSON.parse(fs.readFileSync(path.join(root,'demos.json'),'utf8'));assert.equal(demos.length,5);assert.equal((primary.match(/class="demo-card"/g)||[]).length,5);assert.ok(!primary.includes('class="event-card"'));for(const d of demos){assert.ok(primary.includes('case-'+d.id+'.html'));assert.equal(d.layouts.length,3);const html=fs.readFileSync(path.join(root,'dist','case-'+d.id+'.html'),'utf8');assert.ok(html.includes('規劃示例'));for(const l of d.layouts)assert.ok(fs.existsSync(path.join(root,'dist',l.floorplan)));}
  for(const c of cases){
    assert.equal(c.facts.length,4);
    // 舊真實活動頁保留分享網址，主頁入口只展示五款示範方案。
    const detail=fs.readFileSync(path.join(root,'dist','case-'+c.id+'.html'),'utf8');
    assert.ok(detail.includes(c.title));
    for(const word of ['[待填]','平面圖待補','undefined','[object Object]'])assert.ok(!detail.includes(word));
    if(c.reference)assert.ok(JSON.parse(fs.readFileSync(path.join(root,'references.json'),'utf8')).some(r=>r.id===c.reference));
  }
  const aviation=cases.find(c=>c.id==='aviation-safety');
  assert.equal(aviation.facts[0][1],'48 m²');
  assert.ok(fs.readFileSync(path.join(root,'dist','case-aviation-safety.html'),'utf8').includes('第一天於 09:45 開始'));


  const planner = load('c-needs-planner.html', 'planner');
  for (const id of ['discovery', 'team', 'industry']) {
    planner.goal.value = id;
    planner.get('planner-form').listeners.change();
    snapshot('planner-' + id, planner.get('planner-detail').innerHTML);
    assert.ok(decodeURIComponent(planner.get('mail-request').href).includes(planner.get('request-text').textContent));
  }
  planner.get('venue').value = 'small';
  planner.get('ai').checked = true;
  planner.get('planner-form').listeners.change();
  assert.match(planner.get('recommendation').innerHTML, /場地面積較小/);
  assert.match(planner.get('request-text').textContent, /場地面積較小/);
  assert.match(planner.get('request-text').textContent, /希望了解 AI 環節/);
  await planner.get('copy-request').listeners.click();
  assert.equal(planner.copies.length, 1);
  assert.equal(planner.copies[0], planner.get('request-text').textContent);

  planner.get('venue').value = 'unknown';
  planner.get('ai').checked = false;
  planner.get('planner-form').listeners.change();
  assert.match(planner.get('request-text').textContent, /未確定/);
  assert.match(planner.get('request-text').textContent, /毋須加入/);
  const fallback = load('c-needs-planner.html', 'planner', false);
  await fallback.get('copy-request').listeners.click();
  assert.deepEqual(fallback.downloads, ['XR-Event-Enquiry.txt']);
  assert.match(fallback.get('copy-status').textContent, /下載文字摘要/);

  load('compare.html', 'home');
  const references = JSON.parse(fs.readFileSync(path.join(root,'references.json'),'utf8'));
  assert.equal(references.length,21);
  assert.ok(references.some(r=>r.id==='safety-forum-2024'));
  assert.equal(references.find(r=>r.id==='gcsfe').date,'2023');
  for(const ref of references)assert.ok(!/[（(]/.test(ref.date));
  const published=fs.readFileSync(path.join(root,'dist','index.html'),'utf8');
  for(const word of ['資料夾分類','文件標示','待補','待核','caveat'])assert.ok(!published.includes(word),word);
  assert.equal(references.find(r=>r.id==='sino').program,'team');
  assert.equal(references.filter(r=>r.program==='discovery').length,8);
  assert.equal(references.filter(r=>r.program==='team').length,4);
  assert.ok(!fs.readFileSync(path.join(root,'dist','index.html'),'utf8').includes('<nav class="jump"')); 
  assert.ok(!references.some(r=>r.id==='construction'));
  assert.ok(!full.includes('建造業安全訓練 · 現場素材'));
  assert.equal(references.filter(r=>r.images.length).length,17);
  assert.equal(references.filter(r=>!r.images.length).length,4);
  assert.equal((full.match(/class="case-album"/g)||[]).length,17);
  const represented = [...full.matchAll(/data-case="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(represented.length,references.length);assert.equal(new Set(represented).size,references.length);
  for(const ref of references){
    const button={dataset:{case:ref.id}};
    catalog.documentListeners.click({target:{closest: selector => selector==='[data-case]'?button:null}});
    assert.equal(catalog.get('case-dialog').open,true);
    assert.equal(catalog.get('case-title').textContent,ref.name);
    const body=catalog.get('case-content').innerHTML;
    assert.equal((body.match(/<img /g)||[]).length,ref.images.length);
    if(!ref.images.length)assert.ok(body.includes('未附現場相片'));
    fs.writeFileSync(path.join(root,'qa','case-'+ref.id+'.html'),body);
  }
  catalog.get('case-close').listeners.click();assert.equal(catalog.get('case-dialog').open,false);
  const arrow={dataset:{caseScroll:'discovery',direction:'1'}};
  catalog.documentListeners.click({target:{closest: selector => selector==='[data-case-scroll]'?arrow:null}});
  assert.equal(catalog.get('case-track-discovery').scrollLeft,800);
  console.log('PASS: case homepage and all detail pages; original A/B/C; selected reference albums and documents; all dialogs; program/planner/enquiry interactions.');
})().catch(error => { console.error(error); process.exitCode = 1; });
