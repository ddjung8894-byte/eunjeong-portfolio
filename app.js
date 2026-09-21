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
function element(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text)el.textContent=text;return el;}
function showProject(id,trigger){
 const project=window.portfolioProject;
 if(!project||!project.stages.some(stage=>stage.id===id))return;
 const wrapper=element('div','project-detail');
 const tabs=element('div','project-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','론칭 프로젝트 단계');
 const panel=element('div','project-panel');panel.id='project-panel';panel.setAttribute('role','tabpanel');panel.tabIndex=0;
 function selectStage(stageId,focus=false){
  const stage=project.stages.find(item=>item.id===stageId);panel.replaceChildren();
  tabs.querySelectorAll('button').forEach(tab=>{const selected=tab.dataset.stage===stageId;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;if(selected&&focus)tab.focus();});
  panel.setAttribute('aria-labelledby','stage-'+stage.id);
  panel.append(element('h3','',stage.number+' / '+stage.title),element('p','project-question',stage.question));
  const state=element('div','planned-label');state.append(element('strong','',stage.evidence.length?'등록한 자료':'자료 준비 중'),element('span','',stage.evidence.length?'아래 자료와 확인할 항목을 함께 소개합니다.':'아래는 앞으로 확인하고 제작할 항목입니다.'));panel.append(state);
  const grid=element('div','project-items');
  stage.items.forEach(([title,text])=>{const item=element('article','project-item');item.append(element('h4','',title),element('p','',text));grid.append(item);});panel.append(grid);
  const result=element('p','project-deliverable');result.append(element('strong','','준비할 결과물'),document.createTextNode(stage.deliverable));panel.append(result);
  stage.evidence.forEach(evidence=>{const item=element('article','project-evidence');item.append(element('h4','',evidence.title),element('p','',evidence.text));panel.append(item);});
 }
 project.stages.forEach((stage,index)=>{const tab=element('button','',stage.number+' '+stage.title);tab.id='stage-'+stage.id;tab.dataset.stage=stage.id;tab.setAttribute('role','tab');tab.setAttribute('aria-controls',panel.id);tab.addEventListener('click',()=>selectStage(stage.id));tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const length=project.stages.length;const next=event.key==='Home'?0:event.key==='End'?length-1:(index+(event.key==='ArrowRight'?1:-1)+length)%length;selectStage(project.stages[next].id,true);});tabs.append(tab);});
 wrapper.append(tabs,panel);selectStage(id);
 openDialog('온라인 MD 신상품 론칭 프로젝트','상품 선정 전의 기획 단계입니다. 시장 조사와 제작물을 준비한 뒤 추가하며, 실제 판매 성과는 기재하지 않습니다.',project.status,wrapper,trigger);
}
document.querySelectorAll('[data-project-step]').forEach(button=>button.addEventListener('click',()=>showProject(button.dataset.projectStep,button)));
let printState=null;
window.addEventListener('beforeprint',()=>{if(printState)return;printState=[...document.querySelectorAll('details')].map(el=>[el,el.open]);printState.forEach(([el])=>{el.open=true;});});
window.addEventListener('afterprint',()=>{printState?.forEach(([el,wasOpen])=>{el.open=wasOpen;});printState=null;});
document.querySelector('#print').addEventListener('click',()=>window.print());
