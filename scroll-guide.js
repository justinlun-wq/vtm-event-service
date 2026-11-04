// A 版三款活動同頁展示，以整張活動卡（連案例）的位置更新導覽。
(function(){
  if(document.body.dataset.mode!=='catalog')return;
  const guide=document.getElementById('activity-scroll-guide');
  if(!guide)return;
  const ids=['discovery','team','industry'];
  const sections=ids.map(id=>document.getElementById('program-'+id));
  const buttons=ids.map(id=>document.getElementById('guide-'+id));
  if(sections.some(s=>!s)||buttons.some(b=>!b))return;
  const names=['XR 探索工作坊','Team Building 協作挑戰','行業情境體驗日'];
  let current=-1,pending=false;
  const clamp=n=>Math.max(0,Math.min(1,n));
  function update(){
    pending=false;
    const rects=sections.map(s=>s.getBoundingClientRect());
    const marker=Math.min(window.innerHeight*.35,240);
    guide.hidden=rects[0].top>window.innerHeight*.85||rects[2].bottom<=80;
    if(guide.hidden)return;
    let active=0;
    rects.forEach((r,i)=>{if(r.top<=marker)active=i;});
    buttons.forEach((button,i)=>{
      const progress=i<active?1:i===active?clamp((marker-rects[i].top)/Math.max(rects[i].height,1)):0;
      button.style.setProperty('--section-progress',`${Math.round(progress*100)}%`);
      button.classList.toggle('is-active',i===active);
      button.classList.toggle('is-complete',i<active);
      if(i===active)button.setAttribute('aria-current','location');
      else button.removeAttribute('aria-current');
    });
    if(active!==current){
      current=active;
      document.getElementById('guide-status').textContent=`正在瀏覽第 ${active+1} 款：${names[active]}。`;
    }
  }
  function schedule(){if(!pending){pending=true;window.requestAnimationFrame(update);}}
  function jump(index){
    sections[index].scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    schedule();
  }
  buttons.forEach((button,i)=>button.addEventListener('click',()=>jump(i)));
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  if(typeof ResizeObserver!=='undefined'){
    const observer=new ResizeObserver(schedule);
    sections.forEach(section=>observer.observe(section));
  }
  document.body.classList.add('has-scroll-guide');
  update();
})();
