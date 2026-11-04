// 小人物插圖只作流程提示，與標題一起呈現，避免把裝飾當成互動按鈕。
function timelineIllustration(kind){
  const head=(x,y=43)=>`<circle cx="${x}" cy="${y}" r="9" fill="white"/><path d="M${x-13} 79v-12a13 13 0 0 1 26 0v12" fill="var(--step-soft)"/>`;
  const scenes={
    teach:`<rect x="61" y="12" width="54" height="41" rx="5" fill="white"/><path d="M88 53v18m-15 0h30M73 26h25m-25 9h16"/>${head(28,34)}<path d="M40 57l20-14m-33 36V61"/><circle cx="103" cy="38" r="4" fill="var(--step-soft)"/>`,
    vr:`${head(31,39)}${head(98,39)}<rect x="17" y="33" width="28" height="14" rx="5" fill="var(--step-soft)"/><path d="M24 39h14m50-4 8-5 9 5"/><rect x="55" y="53" width="25" height="21" rx="3" fill="white"/><path d="M61 60h13m-13 7h9m-29-9 14 4m24 0 8-6"/>`,
    share:`${head(24,51)}${head(64,55)}${head(104,51)}<path d="M49 79h30"/><path d="M42 8h46a7 7 0 0 1 7 7v12a7 7 0 0 1-7 7H65l-9 8v-8H42a7 7 0 0 1-7-7V15a7 7 0 0 1 7-7z" fill="white"/><path d="M48 21h29m-29 6h19"/>`,
    roles:`${head(24,46)}${head(64,34)}${head(104,46)}<path d="M35 34l16-9m26 0 16 9M43 74h42" stroke-dasharray="4 5"/><rect x="15" y="42" width="18" height="10" rx="3" fill="var(--step-soft)"/><circle cx="64" cy="69" r="7" fill="white"/><path d="m61 69 2 2 4-5"/>`,
    puzzle:`<rect x="20" y="19" width="37" height="43" rx="5" fill="white" transform="rotate(-7 38 40)"/><rect x="73" y="19" width="37" height="43" rx="5" fill="white" transform="rotate(7 92 40)"/><path d="M29 32h18m-18 9h12m45-9h15m-15 9h17M53 71h24m-8-6 8 6-8 6"/><circle cx="65" cy="32" r="5" fill="var(--step-soft)"/>`,
    scene:`<path d="M58 21 84 9l31 15v43L84 79 58 64z" fill="white"/><path d="M84 9v33l31-18M84 42v37L58 64m0-43 26 21"/><circle cx="91" cy="53" r="6" fill="var(--step-soft)"/>${head(23,40)}<path d="m35 60 21-14"/>`,
    action:`<rect x="55" y="13" width="54" height="65" rx="5" fill="white"/><rect x="69" y="8" width="25" height="10" rx="3" fill="var(--step-soft)"/><path d="m64 34 3 3 6-8m-9 24 3 3 6-8m7-13h18m-18 19h18m-18 12h12"/>${head(25,43)}<path d="m37 65 17-8"/>`
  };
  return `<svg viewBox="0 0 128 88" aria-hidden="true" focusable="false"><circle cx="67" cy="44" r="41" fill="var(--step-soft)" stroke="none"/><g fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${scenes[kind]||scenes.teach}</g></svg>`;
}
