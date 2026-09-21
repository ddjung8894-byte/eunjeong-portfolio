const tabs=[...document.querySelectorAll('[data-tab]')];
const panels=[...document.querySelectorAll('.pb-panel')];
const tablist=document.querySelector('.pb-tabs');
tablist.setAttribute('role','tablist');
function activate(id,{focus=false,scroll=false}={}){
 if(!panels.some(panel=>panel.id===id))id='overview';
 panels.forEach(panel=>{panel.hidden=panel.id!==id;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby','tab-'+panel.id);});
 tabs.forEach(tab=>{const active=tab.dataset.tab===id;tab.setAttribute('role','tab');tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active){if(focus)tab.focus({preventScroll:true});tab.scrollIntoView({block:'nearest',inline:'nearest'});}});
 if(scroll)document.getElementById(id).scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
function navigate(id,focus=false){if(location.hash!=='#'+id)history.pushState(null,'','#'+id);activate(id,{focus,scroll:true});}
tabs.forEach((tab,i)=>{tab.addEventListener('click',event=>{event.preventDefault();navigate(tab.dataset.tab);});tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;navigate(tabs[next].dataset.tab,true);});});
document.querySelectorAll('[data-next]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();navigate(link.dataset.next,true);}));
window.addEventListener('popstate',()=>activate(location.hash.slice(1),{scroll:true}));
activate(location.hash.slice(1)||'overview');
