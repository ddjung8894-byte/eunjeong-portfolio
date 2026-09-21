const header=document.querySelector('.site-header');
const navigation=document.querySelector('#main-nav');
const toggle=document.querySelector('.menu-toggle');
const navLinks=[...navigation.querySelectorAll('a')];
function closeMenu(){navigation.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));navigation.classList.toggle('is-open',open);});
navLinks.forEach(link=>link.addEventListener('click',()=>closeMenu()));
document.addEventListener('click',event=>{if(!header.contains(event.target))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
const sections=[...document.querySelectorAll('.tracked-section')];
let framePending=false;
function updateSection(){
 const offset=header.getBoundingClientRect().height+100;
 let current=sections[0];
 for(const section of sections){if(section.getBoundingClientRect().top<=offset)current=section;}
 if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4)current=sections.at(-1);
 navLinks.forEach(link=>{if(link.hash==='#'+current.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 framePending=false;
}
function scheduleSection(){if(!framePending){framePending=true;requestAnimationFrame(updateSection);}}
window.addEventListener('scroll',scheduleSection,{passive:true});window.addEventListener('resize',()=>{if(window.innerWidth>860)closeMenu();scheduleSection();});
window.addEventListener('load',scheduleSection);document.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',scheduleSection));updateSection();

const dialog=document.querySelector('#detail-dialog');
const dialogBody=document.querySelector('#dialog-body');
const closeButton=document.querySelector('#close-dialog');
let opener=null;
function openDialog(title,description,label,content,trigger){
 opener=trigger;document.querySelector('#dialog-title').textContent=title;document.querySelector('#dialog-description').textContent=description;document.querySelector('#dialog-label').textContent=label;
 dialogBody.replaceChildren(content);dialog.showModal();document.body.classList.add('no-scroll');dialog.scrollTop=0;closeButton.focus();
}
closeButton.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('no-scroll');dialogBody.replaceChildren();opener?.focus({preventScroll:true});});
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{
 const img=document.createElement('img');img.className='dialog-image';img.src=button.dataset.image;img.alt=button.dataset.title;
 openDialog(button.dataset.title,button.dataset.description,'',img,button);
}));
let printState=null;
window.addEventListener('beforeprint',()=>{if(printState)return;printState=[...document.querySelectorAll('details')].map(el=>[el,el.open]);printState.forEach(([el])=>{el.open=true;});});
window.addEventListener('afterprint',()=>{printState?.forEach(([el,wasOpen])=>{el.open=wasOpen;});printState=null;});
document.querySelector('#print').addEventListener('click',()=>window.print());
