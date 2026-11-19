// 案例與相簿各自篩選；所有真實內容由 Python 預先輸出，沒有 JS 亦可閱讀。
(() => {
 const all=(s)=>[...document.querySelectorAll(s)];
 const cards=all('.event-card[data-category]');
 const categoryButtons=all('[data-event-filter]');
 let category='all',format='all';
 function filterCases(){
  let count=0;
  cards.forEach(card=>{const show=(category==='all'||card.dataset.category===category)&&(format==='all'||card.dataset.format===format);card.hidden=!show;if(show)count++;});
  categoryButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.eventFilter===category)));
  all('[data-format-filter]').forEach(a=>a.classList.toggle('is-selected',a.dataset.formatFilter===format));
  const status=document.getElementById('case-filter-status');
  if(status)status.textContent=(format==='all'?'':({classroom:'課室與小組工作坊',zone:'活動體驗區',expo:'論壇與展覽展示'}[format]+' · '))+`顯示 ${count} 個活動案例`;
  const empty=document.getElementById('case-empty');if(empty)empty.hidden=count>0;
 }
 categoryButtons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.eventFilter;format='all';filterCases();}));
 all('[data-format-filter]').forEach(a=>a.addEventListener('click',()=>{format=a.dataset.formatFilter;category='all';filterCases();}));
 if(categoryButtons.length)filterCases();
 // 相簿保持原先新至舊的排列，搜尋及分類後重新計算顯示數量。
 const albums=all('.album-card'),galleryButtons=all('[data-gallery-filter]');
 const search=document.getElementById('gallery-search'),more=document.getElementById('show-albums');
 let galleryCategory='all',expanded=false;
 function filterGallery(){
  const query=(search?.value||'').trim().toLocaleLowerCase();
  const matches=albums.filter(a=>(galleryCategory==='all'||a.dataset.galleryCategory===galleryCategory)&&(!query||a.dataset.search.toLocaleLowerCase().includes(query)));
  const shown=expanded?matches:matches.slice(0,6);
  albums.forEach(a=>a.hidden=!shown.includes(a));
  galleryButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.galleryFilter===galleryCategory)));
  document.getElementById('gallery-empty').hidden=matches.length>0;
  document.getElementById('gallery-status').textContent=`顯示 ${shown.length} / ${matches.length} 個相簿`;
  more.hidden=matches.length<=6;more.textContent=expanded?'收起相簿':`查看全部 ${matches.length} 個相簿`;
 }
 if(albums.length){galleryButtons.forEach(b=>b.addEventListener('click',()=>{galleryCategory=b.dataset.galleryFilter;expanded=false;filterGallery();}));search.addEventListener('input',()=>{expanded=false;filterGallery();});more.addEventListener('click',()=>{expanded=!expanded;filterGallery();});filterGallery();}
 // 人次只以案例的安排速度估算，無效輸入不保留舊數字冒充新結果。
 const number=document.getElementById('capacity-number');
 function estimate(){
  const n=Number(number.value),valid=number.value.trim()!==''&&Number.isInteger(n)&&n>=1&&n<=10000;
  const output=document.getElementById('capacity-result'),error=document.getElementById('capacity-error');
  number.setAttribute('aria-invalid',String(!valid));
  all('[data-capacity]').forEach(b=>b.setAttribute('aria-pressed',String(valid&&Number(b.dataset.capacity)===n)));
  if(!valid){output.textContent='請輸入有效人次';error.textContent='請輸入 1 至 10,000 之間的整數。';document.getElementById('capacity-note').textContent='';return;}
  error.textContent='';const minutes=Math.ceil(n/20*60),hours=Math.floor(minutes/60),rest=minutes%60;
  output.textContent='約 '+(hours?`${hours} 小時`:'')+(rest?`${hours?' ':''}${rest} 分鐘`:'');
  document.getElementById('capacity-note').textContent=hours>6?'如超過當日可用時數，可商討分天進行或增設體驗站。':'實際安排按內容與現場條件確認。';
 }
 if(number){number.addEventListener('input',estimate);all('[data-capacity]').forEach(b=>b.addEventListener('click',()=>{number.value=b.dataset.capacity;estimate();}));estimate();}
 // 平面圖使用原生 dialog 放大；關閉後返回原按鈕，手機可在圖內捲動。
 const plan=document.getElementById('plan-dialog'),openPlan=document.getElementById('open-plan');
 if(openPlan){openPlan.addEventListener('click',()=>plan.showModal());document.getElementById('plan-close').addEventListener('click',()=>plan.close());plan.addEventListener('click',e=>{if(e.target===plan)plan.close();});plan.addEventListener('close',()=>openPlan.focus());}
 const form=document.getElementById('enquiry-form');
 if(form){
  all('[data-enquiry]').forEach(a=>a.addEventListener('click',()=>{const text='活動方向：'+a.dataset.enquiry,notes=form.elements.notes;if(!notes.value.includes(text))notes.value+=(notes.value?'\n':'')+text;}));
  form.addEventListener('submit',event=>{
   event.preventDefault();if(!form.reportValidity())return;
   const values=new FormData(form),name=String(values.get('name')).trim(),email=String(values.get('email')).trim();
   if(!name){form.elements.name.setCustomValidity('請輸入姓名。');form.elements.name.reportValidity();return;}
   const lines=['XR 活動查詢',`姓名：${name}`,`電郵：${email}`];
   const company=String(values.get('company')||'').trim(),notes=String(values.get('notes')||'').trim();
   if(company)lines.push(`公司／機構：${company}`);if(notes)lines.push('查詢內容：\n'+notes);
   const url='mailto:info@vtmdigital.com?subject='+encodeURIComponent('XR 活動與培訓查詢')+'&body='+encodeURIComponent(lines.join('\n'));
   document.getElementById('enquiry-status').textContent='電郵草稿已準備。請在電郵程式確認並寄出；如未有開啟，可直接電郵或致電我們。';
   window.location.href=url;
  });
  form.elements.name.addEventListener('input',()=>form.elements.name.setCustomValidity(''));
 }
})();
