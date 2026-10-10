'use strict';
const demos = {
  s1:{title:'Reference layout',text:'The robot places the pen, deposits the paper, stands the marker box upright, and closes the laptop.',outcome:'4 / 4 subtasks completed',score:95,baseline:40},
  s2:{title:'New appearances',text:'Pen and paper appearances change while the other parts of the reference scene remain fixed. The robot completes all four subtasks in this recording.',outcome:'4 / 4 subtasks completed',score:90,baseline:30},
  s3:{title:'Category changes',text:'Objects from different categories test transfer beyond the Base instances. This recording contains the raw head-camera view without a guidance overlay.',outcome:'4 / 4 subtasks completed',score:90,baseline:15,raw:true},
  s4:{title:'Repeated paper collection',text:'Three sheets of paper require repeated collection. The robot clears the paper and completes the other subtasks in this individual recording.',outcome:'4 / 4 subtasks completed',score:71,baseline:25},
  s5:{title:'Displaced & rotated objects',text:'Loose items move by about 10 cm, with rotations of the paper, marker box, and laptop. The pen, box, and laptop subtasks finish; the paper remains outside the bin.',outcome:'3 / 4 subtasks · paper fails',score:55,baseline:15,partial:true},
  s6:{title:'Resume with laptop closed',text:'The laptop starts in its goal state. The robot handles the remaining pen, paper, and marker-box subtasks; the laptop subtask is excluded from scoring.',outcome:'3 / 3 scored subtasks completed',score:86.7,baseline:46.7},
  s7:{title:'Resume with paper deposited',text:'The paper starts in the bin. The robot handles the pen, marker box, and laptop; the paper subtask is excluded from scoring.',outcome:'3 / 3 scored subtasks completed',score:73.3,baseline:53.3}
};
let selected='s1',fullView=false;
const video=document.getElementById('demo-video');
const speed=document.getElementById('demo-speed');
const cameraButton=document.getElementById('camera-view');
const guidanceButton=document.getElementById('guidance-view');
function applySpeed(){video.playbackRate=Number(speed.value)/(fullView?1:2);}
function loadDemo(id,full=false,preserveTime=false){
  const d=demos[id];const oldFull=fullView;const oldTime=video.currentTime*(oldFull?1:2);const playing=!video.paused;
  selected=id;fullView=full&&!d.raw;
  video.pause();video.src=`assets/videos/${id}${fullView?'-full':''}.mp4`;
  video.poster=`assets/images/${id}-poster.jpg`;video.setAttribute('aria-label',`${d.title}, ${fullView?'full guidance recording':'cropped camera recording'}`);
  video.setAttribute('height',fullView?'670':'400');
  document.querySelectorAll('[data-demo]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.demo===id)));
  cameraButton.setAttribute('aria-pressed',String(!fullView));guidanceButton.setAttribute('aria-pressed',String(fullView));guidanceButton.disabled=Boolean(d.raw);
  guidanceButton.title=d.raw?'No guidance overlay is present in this recording':'';
  document.getElementById('demo-number').textContent=`Condition ${id.slice(1).padStart(2,'0')} / 07`;
  document.getElementById('demo-title').textContent=d.title;document.getElementById('demo-text').textContent=d.text;
  const outcome=document.getElementById('demo-outcome');outcome.textContent=`Recorded trial: ${d.outcome}`;outcome.classList.toggle('partial',Boolean(d.partial));
  document.getElementById('demo-score').textContent=`${d.score}%`;document.getElementById('demo-baseline').textContent=`π₀.₅ baseline: ${d.baseline}%`;
  document.getElementById('original-video').href=`assets/videos/${id}-full.mp4`;
  updateDisclosure();video.load();
  video.addEventListener('loadedmetadata',()=>{applySpeed();if(preserveTime)video.currentTime=Math.min(oldTime/(fullView?1:2),Math.max(0,video.duration-.1));if(playing)video.play().catch(()=>{});},{once:true});
}
function updateDisclosure(){
  const d=demos[selected];const view=d.raw?'This recording has no guidance overlay.':fullView?'Full original recording, including the lower guidance panel.':'Camera view crops the lower guidance text panel. The original includes the complete guidance overlay.';
  document.getElementById('demo-disclosure').textContent=`${view} The full timeline is retained; ${speed.value}× playback.`;
}
document.querySelectorAll('[data-demo]').forEach(b=>b.addEventListener('click',()=>loadDemo(b.dataset.demo,fullView)));
cameraButton.addEventListener('click',()=>{if(fullView)loadDemo(selected,false,true);});guidanceButton.addEventListener('click',()=>{if(!fullView)loadDemo(selected,true,true);});
speed.addEventListener('change',()=>{applySpeed();updateDisclosure();});
video.addEventListener('loadedmetadata',applySpeed);
const chart=document.getElementById('real-chart');
Object.entries(demos).forEach(([id,d])=>{
  const labels={s1:'Base',s2:'Object',s3:'Category',s4:'Multi',s5:'Moved',s6:'Laptop done',s7:'Paper done'};
  const row=document.createElement('div');row.className='bar-row';const label=document.createElement('span');label.className='bar-label';label.textContent=labels[id];row.append(label);
  const pair=document.createElement('div');pair.className='bar-pair';
  for(const [kind,value]of [['baseline',d.baseline],['ours-bar',d.score]]){const bar=document.createElement('div');bar.className=`bar ${kind}`;bar.style.width=`${value}%`;const number=document.createElement('span');number.textContent=`${value}%`;bar.append(number);pair.append(bar);}
  row.append(pair);chart.append(row);
});
const hero=document.getElementById('hero-video'),heroToggle=document.getElementById('hero-toggle');
let manuallyPaused=false;
function reflectHero(){heroToggle.textContent=hero.paused?'Play':'Pause';heroToggle.setAttribute('aria-label',hero.paused?'Play hero video':'Pause hero video');}
hero.addEventListener('play',reflectHero);hero.addEventListener('pause',reflectHero);
heroToggle.addEventListener('click',()=>{if(hero.paused){manuallyPaused=false;hero.play().catch(reflectHero);}else{manuallyPaused=true;hero.pause();}});
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!reduced.matches){new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!manuallyPaused&&!document.hidden)hero.play().catch(reflectHero);else hero.pause();},{threshold:.3}).observe(hero);}
document.addEventListener('visibilitychange',()=>{if(document.hidden){hero.pause();video.pause();}});
document.getElementById('copy-citation').addEventListener('click',async()=>{
  const text=document.getElementById('bibtex').textContent;const status=document.getElementById('copy-status');
  try{await navigator.clipboard.writeText(text);status.textContent='BibTeX copied.';}
  catch{const range=document.createRange();range.selectNodeContents(document.getElementById('bibtex'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='BibTeX selected. Use your browser’s copy command.';}
});
