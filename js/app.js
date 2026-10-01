const NOUNS = DATA.filter(d=>d.art);
const LESSON_SIZE = 30;
/* Son parça bundan küçükse ayrı ders olmaz, bir önceki derse eklenir */
const MIN_LAST_LESSON = 10;
const LESSONS = [];
for(let i=0;i<DATA.length;i+=LESSON_SIZE) LESSONS.push(DATA.slice(i,i+LESSON_SIZE));
if(LESSONS.length>1 && LESSONS[LESSONS.length-1].length<MIN_LAST_LESSON){
  const rest = LESSONS.pop();
  LESSONS[LESSONS.length-1] = LESSONS[LESSONS.length-1].concat(rest);
}
let activePool = DATA;
let activeLessonIndex = null;
let activeMode = "lessons";
let lastWordId = null;
const KEY = "beyza-a1-v2";
const LEGACY_KEY = "beyza-a1-v1";
let state = load();

function load(){
  try{
    const s = JSON.parse(localStorage.getItem(KEY));
    if(s && s.known){ if(!Array.isArray(s.wrong)) s.wrong=[]; return s; }
    const legacy = migrateLegacy(JSON.parse(localStorage.getItem(LEGACY_KEY)));
    if(legacy) return legacy;
  }catch(e){}
  return {known:[], seen:{}, best:0, wrong:[]};
}
/* v1 kayıtları sıra numarası tutuyordu (0, 1, 2…); bunları kalıcı "artikel|kelime" kimliklerine çevir */
function migrateLegacy(s){
  if(!s || !Array.isArray(s.known)) return null;
  const toId = n => DATA[n] ? DATA[n].id : null;
  const ids = arr => (Array.isArray(arr) ? arr : []).map(toId).filter(Boolean);
  const seen = {};
  for(const [n,count] of Object.entries(s.seen||{})){ const id = toId(+n); if(id) seen[id]=count; }
  return {known:ids(s.known), seen, best:s.best||0, wrong:ids(s.wrong)};
}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} }

const $ = s => document.querySelector(s);
const stage = $("#stage");
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const shuffle = a => { a = a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const esc = s => s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function selectTab(mode){
  document.querySelectorAll(".tab").forEach(tab => tab.setAttribute("aria-selected", tab.dataset.mode===mode));
}

function renderProgress(){
  const n = state.known.length, t = DATA.length;
  $("#progText").textContent = n + " kelime öğrenildi";
  $("#progTotal").textContent = "toplam " + t;
  $("#progBar").style.width = (n/t*100)+"%";
  const repeatTab = document.querySelector('.tab[data-mode="repeat"]');
  if(repeatTab) repeatTab.textContent = `Tekrar · ${state.wrong.length}`;
}

function knownCount(pool){ return pool.filter(d=>state.known.includes(d.id)).length; }

function lessons(){
  activeMode = "lessons";
  selectTab("lessons");
  activeLessonIndex = null;
  activePool = DATA;
  stage.innerHTML = `
    <p class="hint"> Rabb'im zihin açıklığı versin inşallah...</p>
    <div class="lessons-list">${LESSONS.map((pool,i)=>{
      const done = knownCount(pool), percent = done/pool.length*100;
      return `<div class="lesson-card${done===pool.length?" is-done":""}">
        <span class="lesson-card-top"><strong>Ders ${i+1}</strong><span>${done}/${pool.length}</span></span>
        <span class="lesson-mini-bar"><span style="width:${percent}%"></span></span>
        <span class="lesson-card-label">${done===pool.length?"Tamamlandı":`${pool.length} kelime`}</span>
        <div class="lesson-actions">
          <button class="lesson-action lesson-open" data-lesson="${i}" type="button">Kartlar</button>
          <button class="lesson-action lesson-quiz" data-lesson="${i}" type="button">Quiz</button>
        </div>
      </div>`;
    }).join("")}</div>`;
  stage.querySelectorAll(".lesson-open").forEach(button => {
    button.onclick = () => {
      activeLessonIndex = +button.dataset.lesson;
      activePool = LESSONS[activeLessonIndex];
      cards();
    };
  });
  stage.querySelectorAll(".lesson-quiz").forEach(button => {
    button.onclick = () => {
      activeLessonIndex = +button.dataset.lesson;
      activePool = LESSONS[activeLessonIndex];
      quiz();
    };
  });
}

function repeat(){
  activeMode = "repeat";
  activeLessonIndex = null;
  activePool = DATA.filter(d=>state.wrong.includes(d.id));
  selectTab("repeat");
  cards();
}

/* Bilinmeyenler öncelikli; az görülenler daha sık; az önce gösterilen kelime arka arkaya gelmez */
function nextWord(pool){
  const unknown = pool.filter(d=>!state.known.includes(d.id));
  let src = unknown.length ? unknown : pool;
  if(src.length>1) src = src.filter(d=>d.id!==lastWordId);
  const weighted = src.map(d=>({d, w:1/(1+(state.seen[d.id]||0))}));
  let r = Math.random()*weighted.reduce((s,x)=>s+x.w,0);
  let chosen = src[0];
  for(const x of weighted){ r-=x.w; if(r<=0){ chosen = x.d; break; } }
  lastWordId = chosen.id;
  return chosen;
}

let deVoice = null;
function loadVoice(){ if(!("speechSynthesis" in window)) return; deVoice = speechSynthesis.getVoices().find(v=>v.lang && v.lang.startsWith("de")) || null; }
if("speechSynthesis" in window){ loadVoice(); speechSynthesis.onvoiceschanged = loadVoice; }
function say(text){
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang="de-DE"; u.rate=.9; if(deVoice) u.voice=deVoice;
  speechSynthesis.speak(u);
}

const CAT = `<svg class="cat" viewBox="0 0 80 80" aria-hidden="true">
<path d="M14 30 L16 8 L32 20 Q40 17 48 20 L64 8 L66 30 Q72 44 66 58 Q56 72 40 72 Q24 72 14 58 Q8 44 14 30Z" fill="#fff" stroke="#1B1B2B" stroke-width="3"/>
<path d="M18 26 Q24 20 30 26 Q26 34 18 32Z M52 44 Q60 40 64 48 Q58 54 52 50Z M34 14 Q40 12 42 18 Q36 20 34 14Z" fill="#1B1B2B"/>
<circle cx="30" cy="42" r="3.5" fill="#1B1B2B"/><circle cx="50" cy="42" r="3.5" fill="#1B1B2B"/>
<circle cx="23" cy="52" r="5" fill="#EE3B24"/><circle cx="57" cy="52" r="5" fill="#EE3B24"/>
<path d="M36 52 Q40 56 44 52" stroke="#1B1B2B" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M8 46 H20 M8 52 L20 50 M60 46 H72 M60 50 L72 52" stroke="#1B1B2B" stroke-width="1.8"/></svg>`;
const catSays = msg => `<div class="cat-row">${CAT}<div class="bubble">${msg}</div></div>`;
const PRAISE = ["Super!","Toll!","Sehr gut!","Prima!","Weiter so!"];

function wordHTML(d){
  return d.art ? `<span class="art ${d.art}">${d.art}</span>${esc(d.w)}` : esc(d.w);
}
function speakText(d){ return (d.art? d.art+" " : "") + d.w; }

/* ---------- Kartlar ---------- */
function cards(){
  const pool = activePool;
  if(!pool.length){
    stage.innerHTML = `<p class="hint">${activeMode==="repeat"?"Tekrar edilecek yanlış cevabın kalmadı. Harika!":"Bu derste gösterilecek kelime kalmadı."}</p><div class="actions"><button class="btn next" id="backToLessons">Derslere dön</button></div>`;
    $("#backToLessons").onclick = lessons;
    return;
  }
  const d = nextWord(pool);
  state.seen[d.id]=(state.seen[d.id]||0)+1; save();
    const lessonKnown = activeLessonIndex===null ? 0 : knownCount(pool);
  const exampleLines = Math.ceil((d.ex||"").length/32)+Math.ceil((d.exTr||"").length/32);
  const cardHeight = Math.max(240,205+exampleLines*24);
  stage.innerHTML = `
      ${activeMode==="repeat"?`<div class="lesson-card-status"><span>Tekrar · ${pool.length} yanlış kelime</span><button class="lesson-back" id="lessonBack" type="button">Dersler</button></div>`:activeLessonIndex===null?"":`<div class="lesson-card-status"><span>Ders ${activeLessonIndex+1}/${LESSONS.length} · ${lessonKnown}/${pool.length}</span><button class="lesson-back" id="lessonBack" type="button">Tüm dersler</button></div>${lessonKnown===pool.length?`<p class="lesson-complete">Bu ders tamamlandı; istersen tekrar çalışabilirsin.</p>`:""}`}
    <p class="hint">Karta dokun, arkasını gör. Bildiğin kelimeleri işaretle, bilmediklerin daha sık gelir.</p>
    <div class="card" id="card" role="button" tabindex="0" aria-label="Kartı çevir">
      <div class="card-inner" style="min-height:${cardHeight}px">
        <div class="face front">
          <div class="word">${wordHTML(d)}</div>
          ${d.pl?`<div class="plural">çoğul: ${esc(d.pl)}</div>`:""}
          <div class="flip-hint">dokun ve çevir</div>
        </div>
        <div class="face back">
          <div class="tr">${esc(d.tr)}</div>
          <div class="ex">${esc(d.ex)}</div>
          ${d.exTr?`<div class="ex-tr">${esc(d.exTr)}</div>`:""}
          <button class="speak" data-say="ex">🔊 Cümleyi dinle</button>
        </div>
      </div>
    </div>
    <div class="actions">
      <button class="btn no" id="no">Henüz değil</button>
      <button class="btn yes" id="yes">Biliyorum</button>
    </div>`;
  const card = $("#card");
  const lessonBack = $("#lessonBack");
  if(lessonBack) lessonBack.onclick = lessons;
  const flip = () => { card.classList.toggle("flipped"); if(card.classList.contains("flipped")) say(speakText(d)); };
  card.addEventListener("click", e => { if(e.target.closest(".speak")) return; flip(); });
  card.addEventListener("keydown", e => { if(e.key==="Enter"||e.key===" "){ e.preventDefault(); flip(); } });
  stage.querySelector(".speak").addEventListener("click", e => { e.stopPropagation(); say(d.ex); });
  $("#yes").onclick = () => {
    if(!state.known.includes(d.id)) state.known.push(d.id);
    state.wrong = state.wrong.filter(id=>id!==d.id);
    save(); renderProgress();
    if(activeMode==="repeat") activePool=activePool.filter(word=>word.id!==d.id);
    cards();
  };
  $("#no").onclick = () => { state.known = state.known.filter(x=>x!==d.id); save(); renderProgress(); cards(); };
}

/* ---------- der · die · das ---------- */
let streak = 0;
function artikel(){
  const d = nextWord(NOUNS);
  stage.innerHTML = `
    <span class="streak" title="Seri">seri ${streak} · en iyi ${state.best}</span>
    <p class="hint">Doğru artikeli seç.</p>
    <div class="art-word">${esc(d.w)}</div>
    <p class="art-tr">${esc(d.tr)}</p>
    <div class="art-btns">
      <button class="art-btn der" data-a="der">der</button>
      <button class="art-btn die" data-a="die">die</button>
      <button class="art-btn das" data-a="das">das</button>
    </div>
    <div id="fb"></div>`;
  stage.querySelectorAll(".art-btn").forEach(b => b.onclick = () => {
    const ok = b.dataset.a === d.art;
    state.seen[d.id]=(state.seen[d.id]||0)+1;
    stage.querySelectorAll(".art-btn").forEach(x => { x.disabled = true; if(x.dataset.a===d.art) x.classList.add("correct"); });
    if(ok){ streak++; if(streak>state.best) state.best=streak; } else streak=0;
    save();
    say(d.art+" "+d.w);
    $("#fb").innerHTML = catSays(ok ? pick(PRAISE) : `Fast! Es heißt <span class="art ${d.art}">${d.art}</span> ${esc(d.w)}.`) +
      `<div class="actions"><button class="btn next" id="nx">Sıradaki</button></div>`;
    stage.querySelector(".streak").textContent = `seri ${streak} · en iyi ${state.best}`;
    $("#nx").focus(); $("#nx").onclick = artikel;
  });
}

/* ---------- Quiz ---------- */
function quiz(){
  const pool = activeLessonIndex===null ? DATA : activePool;
  const d = nextWord(pool);
  const sameType = pool.filter(x=>x.type===d.type && x.id!==d.id && x.tr!==d.tr);
  const distractors = shuffle(sameType).slice(0,3);
  if(distractors.length<3){
    const fallback = pool.filter(x=>x.id!==d.id && x.tr!==d.tr && !distractors.some(y=>y.id===x.id));
    distractors.push(...shuffle(fallback).slice(0,3-distractors.length));
  }
  const opts = shuffle([d, ...distractors]);
  stage.innerHTML = `
    ${activeLessonIndex===null?"":`<div class="lesson-card-status"><span>Ders ${activeLessonIndex+1}/${LESSONS.length} · Quiz</span><button class="lesson-back" id="lessonQuizBack" type="button">Tüm dersler</button></div>`}
    <p class="hint">Bu kelimenin anlamı ne?</p>
    <div class="art-word">${wordHTML(d)}</div>
    <div style="text-align:center;margin-bottom:16px"><button class="speak" id="sp">🔊 Dinle</button></div>
    <div class="opts">${opts.map(o=>`<button class="opt" data-id="${esc(o.id)}">${esc(o.tr)}</button>`).join("")}</div>
    <div id="fb"></div>`;
  const lessonQuizBack = $("#lessonQuizBack");
  if(lessonQuizBack) lessonQuizBack.onclick = lessons;
  $("#sp").onclick = () => say(speakText(d));
  stage.querySelectorAll(".opt").forEach(b => b.onclick = () => {
    const ok = b.dataset.id === d.id;
    state.seen[d.id]=(state.seen[d.id]||0)+1;
    if(ok){
      if(!state.known.includes(d.id)) state.known.push(d.id);
      state.wrong = state.wrong.filter(id=>id!==d.id);
    }else if(!state.wrong.includes(d.id)){
      state.wrong.push(d.id);
    }
    save(); renderProgress();
    stage.querySelectorAll(".opt").forEach(x => { x.disabled = true; if(x.dataset.id===d.id) x.classList.add("right"); });
    if(!ok) b.classList.add("wrong");
    $("#fb").innerHTML = catSays(ok ? pick(PRAISE) : "Nicht schlimm! Nochmal.") +
      `<p class="ex" style="text-align:center;margin:10px auto 0">${esc(d.ex)}</p>` +
      (d.exTr ? `<p class="ex-tr" style="text-align:center">${esc(d.exTr)}</p>` : "") +
      `<div class="actions"><button class="btn next" id="nx">Sıradaki</button></div>`;
    $("#nx").focus(); $("#nx").onclick = quiz;
  });
}

const MODES = {lessons, cards, artikel, quiz, repeat};
document.querySelectorAll(".tab").forEach(t => t.onclick = () => {
  activeMode = t.dataset.mode;
  activeLessonIndex = null;
  activePool = DATA;
  if(activeMode==="repeat"){
    repeat();
    return;
  }
  selectTab(activeMode);
  MODES[t.dataset.mode]();
});
renderProgress();
lessons();

/* index.html doğrudan dosyadan (file://) açıldığında service worker kaydedilemez */
if("serviceWorker" in navigator && location.protocol.startsWith("http")){
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js"));
}
