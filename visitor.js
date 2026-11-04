// 訪客版：以相片、簡短流程和成果說明活動，詳細執行資料留在策劃階段。
const programs = __PROGRAMS__;
const mode = document.body.dataset.mode;
const byId = id => programs.find(p => p.id === id) || programs[0];
const edits = {
  discovery:{image:'school-xr',audience:'學校、企業創新團隊',occasion:'STEM 日、生涯規劃、創新工作坊',intro:'透過學習或職業情境體驗，在導師引導下探索新的應用。',steps:[['認識主題','導師講解 XR 的應用，並示範當日的體驗內容。'],['分組探索','一組輪流參與體驗，另一組透過任務卡討論，再交換進行。'],['分享構想','每組分享一個可應用於課堂或工作的新構想。']],takeaway:'完成一張 XR 應用構想卡，將體驗連繫至實際需要。',ai:'可按需要加入 AI 構想示範，由導師帶領及核對。'},
  team:{image:'sino-group',audience:'企業 HR、跨部門團隊',occasion:'Team building、新同事融入、團隊交流',intro:'透過操作、觀察及協調等角色分工，共同完成任務，了解彼此的合作方式。',steps:[['分配角色','隊員分別擔任操作、觀察與協調角色。'],['共同解難','輪流參與 VR 體驗及桌面任務，交流資料並共同作出決定。'],['團隊回顧','導師帶領活動回顧，整理可應用於日常工作的合作方法。']],takeaway:'完成一張團隊合作約定卡，將活動中的默契延續至日常合作。',ai:'活動毋須使用 AI，亦可按需要加入人與 AI 分工的討論。'},
  industry:{image:'expo-conversation',audience:'物管、工程、發展商及培訓團隊',occasion:'安全推廣日、行業體驗、客戶導賞',intro:'透過情境體驗觀察問題，在導師引導下討論不同做法，連繫實際工作需要。',steps:[['講解情境','先認識場景與觀察重點。'],['體驗與討論','一組參與情境體驗，另一組透過相片或平面圖討論，再交換進行。'],['整理下一步','分享觀察結果，整理具體行動或需要跟進的問題。']],takeaway:'完成一張風險與行動卡；物業導賞則可整理成場地需求及提問清單。',ai:'可按需要加入 AI 整理討論重點的示範，並由導師核對。'}
};
// 以原有 150 分鐘建議安排合併成三個易讀環節，105 分鐘包含兩輪體驗及換組。
programs.forEach(p => Object.assign(p, edits[p.id], {stepMinutes:[25,105,20]}));
function compactFacts(){return `<div class="facts"><span class="fact">人數示例 <b>30 人</b></span><span class="fact">活動約 <b>2.5 小時</b></span><span class="fact">場地面積示例 <b>90 m²</b></span></div>`;}
function durationLabel(minutes){const hours=Math.floor(minutes/60),remainder=minutes%60;return hours?`${hours} 小時${remainder?` ${remainder} 分鐘`:''}`:`${minutes} 分鐘`;}
function steps(p){const kinds={discovery:['teach','vr','share'],team:['roles','puzzle','share'],industry:['teach','scene','action']}[p.id];return `<div class="timeline-caption"><span>建議活動流程</span><span>共約 2.5 小時，可按需要調整</span></div><div class="visitor-steps">${p.steps.map((s,i)=>`<div class="visitor-step"><div class="step-visual" aria-hidden="true">${timelineIllustration(kinds[i])}<span class="step-number">${i+1}</span></div><div class="step-duration">${durationLabel(p.stepMinutes[i])}${i===1?'<small>包括換組時間</small>':''}</div><h4>${s[0]}</h4><p>${s[1]}</p></div>`).join('')}</div>`;}
// 每款活動用不同的任務畫面呈現，與真實相簿分開，避免同頁重用相片。
function programVisual(p){
  if(p.id==='discovery')return `<div class="program-visual visual-discovery"><div class="visual-caption">一場探索，三個發現</div><h3>如果可以走進情境，<br>你會想知道甚麼？</h3><div class="explore-path"><div><i aria-hidden="true">◎</i><b>觀察</b><span>走進新場景</span></div><div><i aria-hidden="true">？</i><b>提問</b><span>分享觀察結果</span></div><div><i aria-hidden="true">✧</i><b>構想</b><span>連繫日常應用</span></div></div><p class="visual-summary">由親身體驗，延伸至實際應用。</p></div>`;
  if(p.id==='team')return `<div class="program-visual visual-team"><div class="visual-caption">不同角色，同一個任務</div><h3>你看到的，<br>隊友未必看到。</h3><div class="team-question">如何整合各人的資料，共同作出決定？</div><div class="role-map"><div class="role-node"><span class="role-icon" aria-hidden="true">◉</span><strong>操作員</strong><small>探索情境</small></div><div class="role-node"><span class="role-icon" aria-hidden="true">⌕</span><strong>觀察員</strong><small>找出線索</small></div><div class="role-node"><span class="role-icon" aria-hidden="true">⇄</span><strong>協調員</strong><small>整理資料</small></div></div><div class="team-decision">一起決定下一步</div></div>`;
  return `<div class="program-visual visual-industry"><div class="visual-caption">透過情境，了解行業需要</div><h3>如果你在現場，<br>下一步會怎樣做？</h3><div class="scene-map"><div class="scene-zone"><span>1</span>發現問題</div><div class="scene-zone"><span>2</span>比較選擇</div><div class="scene-zone"><span>3</span>提出行動</div></div><div class="industry-tags"><span>工作風險</span><span>物業導賞</span><span>情境討論</span></div></div>`;
}
function cards(){return programs.map(p=>`<article class="program-card"><div class="category-strip ${p.id==='discovery'?'discovery':p.id==='team'?'team':'industry'}"><i class="category-mark" aria-hidden="true">${p.id==='discovery'?'◎':p.id==='team'?'⇄':'⌖'}</i><strong>${p.id==='discovery'?'探索新想法':p.id==='team'?'找到合作默契':'走進行業情境'}</strong><span>${p.id==='discovery'?'體驗 × 學習 × 構想':p.id==='team'?'角色 × 溝通 × 解難':'觀察 × 判斷 × 行動'}</span></div><div class="card-main"><h3>${p.name}</h3><p>${p.intro}</p><div class="card-meta">適合 ${p.audience}</div><a class="btn secondary" href="#program-${p.id}">了解活動方案</a></div></article>`).join('');}
function detail(p){const labels={discovery:['學習與探索','應用構想卡','一個新想法，從一次親身體驗開始。'],team:['合作與溝通','合作約定卡','將活動中的默契，延續至日常合作。'],industry:['情境與應用','觀察行動卡','將現場觀察，連繫至實際需要。']}[p.id];return `<article class="visitor-program theme-${p.id}" id="program-${p.id}"><div class="program-head"><div class="program-copy"><div class="card-tag">${labels[0]}</div><h2>${p.name}</h2><p>${p.intro}</p><p class="audience">適合 ${p.audience}</p>${compactFacts()}</div>${programVisual(p)}</div><div class="program-body">${steps(p)}<div class="takeaway-ticket"><div class="ticket-label"><span>活動後帶走</span><strong>${labels[1]}</strong></div><div class="ticket-content"><h4>${labels[2]}</h4><p>${p.takeaway}</p></div></div><div class="program-bottom"><div><p>${p.ai}</p>${p.id==='industry'?'<p class="program-note">可按需要換成物業場景，配合平面圖及專人講解。</p>':p.id==='team'?'<p class="program-note">由同場角色分工開始；多人連線協作可另作安排。</p>':''}</div><a class="text-cta" href="mailto:info@vtmdigital.com?subject=${encodeURIComponent(p.name+' 活動查詢')}">查詢活動安排</a></div></div>${relatedCases(p)}</article>`;}
function story(p){return `<div class="visitor-story theme-${p.id}"><div class="story-lead"><div><div class="card-tag">${p.occasion}</div><h2>${p.name}</h2><p>${p.intro}</p>${compactFacts()}</div>${programVisual(p)}</div><h3 class="subhead">活動如何進行？</h3>${steps(p)}<div class="takeaway-ticket"><div class="ticket-label"><span>活動後帶走</span><strong>${{discovery:"XR 應用構想卡",team:"團隊合作約定卡",industry:"觀察行動卡"}[p.id]}</strong></div><div class="ticket-content"><h4>將現場體驗，延續至日常。</h4><p>${p.takeaway}</p></div></div><a class="text-cta" href="mailto:info@vtmdigital.com?subject=${encodeURIComponent(p.name+' 活動查詢')}">查詢這款活動安排 →</a><p class="program-note">${p.ai}</p>${relatedCases(p)}</div>`;}
function cta(){return `<div class="cta"><div><h2>為你的團隊安排下一場活動。</h2><p>分享活動對象、人數及目標，一起商討合適安排。</p></div><a class="btn" href="mailto:info@vtmdigital.com?subject=XR%20Event%20Enquiry">查詢活動方案</a></div>`;}
let selected='discovery';
// 滑鼠、鍵盤及手機共用同一選擇狀態；相片預先載入，切換時不閃白。
const heroCopy={
 discovery:{title:'探索新科技，<br>啟發下一個想法。',intro:'在導師引導下，透過 XR 體驗、提問與分享，將新發現連繫至日常應用。',caption:'過往活動現場 · 學校 XR 工作坊'},
 team:{title:'Team Building，<br>從一起解難開始。',intro:'透過操作、觀察與協調的角色分工，交流線索、共同決定，找到團隊的合作默契。',caption:'過往活動現場 · 恒生 × HSBC 企業活動'},
 industry:{title:'走進行業情境，<br>看見實際需要。',intro:'親身體驗工作情境，在導師帶領下觀察問題、討論選擇，再整理下一步行動。',caption:'過往活動現場 · OSH Innovation Expo 2026'}
};
function renderStory(){
 const p=byId(selected),copy=heroCopy[selected];
 document.getElementById('story-content').innerHTML=story(p);
 document.querySelectorAll('[data-pick]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.pick===selected));
 for(const id of ['discovery','team','industry']) document.getElementById('hero-'+id).classList.toggle('is-active',id===selected);
 document.getElementById('hero-title').innerHTML=copy.title;
 document.getElementById('hero-description').textContent=copy.intro;
 document.getElementById('hero-photo-note').textContent=copy.caption;
 document.getElementById('story-status').textContent='目前顯示：'+p.name;
}

function requestText(p,venue,ai){return `活動初步查詢\n方向：${p.name}\n參加者：30 人示例\n活動時間：約 2.5 小時\n場地：${venue==='small'?'場地面積較小，請協助規劃':venue==='unknown'?'未確定':'約 90 m² 或以上，待確認配置'}\n希望帶走：${p.takeaway}\nAI 元素：${ai?'希望了解 AI 環節':'毋須加入'}\n活動日期、對象及內容可再商議。`;}
function renderPlanner(){const p=byId(document.querySelector('input[name=goal]:checked').value),venue=document.getElementById('venue').value,ai=document.getElementById('ai').checked;document.getElementById('recommendation').className='recommendation';document.getElementById('recommendation').innerHTML=`<div class="card-tag">適合你的活動方向</div><h2>${p.name}</h2><p>${p.intro}</p>${venue==='small'?'<p class="space-notice warn">場地面積較小？可按場地重新安排人數與輪換方式。</p>':''}`;document.getElementById('planner-detail').innerHTML=detail(p);document.getElementById('request-text').textContent=requestText(p,venue,ai);document.getElementById('mail-request').href='mailto:info@vtmdigital.com?subject='+encodeURIComponent('XR 活動查詢｜'+p.name)+'&body='+encodeURIComponent(requestText(p,venue,ai));document.getElementById('planner-status').textContent='目前建議：'+p.name;document.getElementById('copy-status').textContent='';}
if(mode==='catalog'){document.getElementById('cards').innerHTML=cards();document.getElementById('details').innerHTML=programs.map(detail).join('');}
if(mode==='story'){document.getElementById('program-picker').innerHTML=programs.map(p=>`<button type="button" data-pick="${p.id}" aria-pressed="${p.id===selected}">${p.name}</button>`).join('');renderStory();const picker=document.getElementById('program-picker');
// 只有滑鼠懸停才觸發預覽；觸控點按及鍵盤焦點同樣可以切換。
function choose(e){const b=e.target.closest('[data-pick]');if(b && b.dataset.pick!==selected){selected=b.dataset.pick;renderStory();}}
picker.addEventListener('click',choose);
picker.addEventListener('pointerover',e=>{if(e.pointerType==='mouse')choose(e);});
picker.addEventListener('focusin',choose);}
if(mode==='planner'){document.getElementById('planner-form').addEventListener('change',renderPlanner);renderPlanner();document.getElementById('copy-request').addEventListener('click',async()=>{const text=document.getElementById('request-text').textContent;try{if(!navigator.clipboard)throw Error();await navigator.clipboard.writeText(text);document.getElementById('copy-status').textContent='查詢摘要已複製。';}catch{const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='XR-Event-Enquiry.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.getElementById('copy-status').textContent='已下載文字摘要。';}});}
document.querySelectorAll('[data-cta]').forEach(n=>n.innerHTML=cta());
