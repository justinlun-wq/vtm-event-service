// 示範方案與真實活動相簿分開；切換規模只更新規劃示例。
(() => {
 const all=s=>[...document.querySelectorAll(s)];
 const node=all('[data-demo-config]')[0];if(!node)return;
 const demo=JSON.parse(node.dataset.demoConfig),buttons=all('[data-demo-size]');
 let current=demo.layouts.find(l=>l.size===window.location.hash.slice(1))||demo.layouts[1];
 const input=document.getElementById('demo-capacity');
 function estimate(){
  const n=Number(input.value),valid=input.value.trim()!==''&&Number.isInteger(n)&&n>=1&&n<=10000;
  input.setAttribute('aria-invalid',String(!valid));const output=document.getElementById('demo-estimate');
  if(!valid){output.textContent='請輸入 1 至 10,000 之間的整數人次。';return;}
  const minutes=Math.ceil(n*current.cycle/current.stations),hours=Math.floor(minutes/60),rest=minutes%60;
  output.textContent=`${current.stations} 個體驗站 · ${n} 人次：約 `+(hours?hours+' 小時':'')+(rest?(hours?' ':'')+rest+' 分鐘':'');
 }
 function render(){
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.demoSize===current.size)));
  const values={area:current.area+' m²',stations:current.stations+' 人',staff:current.staff+' 人',duration:current.minutes+' 分鐘'};
  all('[data-demo-fact]').forEach(el=>el.textContent=values[el.dataset.demoFact]);
  const image=document.getElementById('demo-floorplan');image.src=current.floorplan;image.alt=demo.title+' · '+current.label+'配置示例';document.getElementById('demo-plan-large').src=current.floorplan;
  all('[data-demo-dimensions]').forEach(el=>el.textContent=`${current.width} × ${current.depth} m`);all('[data-demo-people]').forEach(el=>el.textContent=current.people);all('[data-demo-stations]').forEach(el=>el.textContent=current.stations+' 個');all('[data-demo-staff]').forEach(el=>el.textContent=current.staff+' 名');
  // 各階段以五分鐘單位分配，最後一段補足總時數。
  const parts=[.1,.65,.15],times=parts.map(p=>Math.round(current.minutes*p/5)*5);times.push(current.minutes-times.reduce((a,b)=>a+b,0));let elapsed=0;
  all('[data-demo-step-time]').forEach((el,i)=>{el.textContent=elapsed+'–'+(elapsed+times[i])+' 分鐘';elapsed+=times[i];});
  const list=document.getElementById('demo-provide').querySelectorAll('li');demo.provide.forEach((text,i)=>{list[i].textContent=text.replace(/\{(stations|staff)\}/g,(_,key)=>current[key]);});
  all('[data-enquiry]').forEach(a=>a.dataset.enquiry=demo.title+' · '+current.label+' · '+current.area+' m² 規劃示例');estimate();
 }
 buttons.forEach(b=>b.addEventListener('click',()=>{current=demo.layouts.find(l=>l.size===b.dataset.demoSize);render();}));input.addEventListener('input',estimate);render();
 const dialog=document.getElementById('demo-plan-dialog'),open=document.getElementById('demo-open-plan');open.addEventListener('click',()=>dialog.showModal());document.getElementById('demo-plan-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});dialog.addEventListener('close',()=>open.focus());
})();
