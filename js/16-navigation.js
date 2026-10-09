/* ================= Navigation ================= */
let demoT=null,demoI=0;
function stopDemo(){clearInterval(demoT);demoT=null}
// Abbild eines Teils der Seite, das über seinem Platz stehen bleibt und ausblendet
function geist(el){const r=el.getBoundingClientRect(),a=document.querySelector('.app').getBoundingClientRect(),g=el.cloneNode(true);
  const mm=g.querySelector('#mode');if(mm)mm.classList.add('modus');
  g.removeAttribute('id');g.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));g.setAttribute('aria-hidden','true');g.classList.add('geist');
  Object.assign(g.style,{position:'absolute',left:(r.left-a.left)+'px',top:(r.top-a.top)+'px',width:r.width+'px',height:r.height+'px',margin:'0',pointerEvents:'none',opacity:'1',transition:'opacity .7s ease'});
  document.querySelector('.app').appendChild(g);requestAnimationFrame(()=>requestAnimationFrame(()=>{g.style.opacity='0'}));setTimeout(()=>g.remove(),900)}
function go(i,force){
  i=Math.max(0,Math.min(SLIDES.length-1,i));if(started&&i===cur&&!force)return;
  stopDemo();timers.forEach(clearTimeout);timers=[];
  const prev=started?cur:-1;
  // von der Karte in die Eröffnung: Text, Hinweis und Knöpfe der Karte blenden aus, das Dreieck klappt gleichzeitig zur Linie
  if(started&&!reduce&&prev>=0&&prev!==i&&SLIDES[prev].scene==='dreieck'&&SLIDES[i].klappen)
    [document.querySelector('.textwrap'),$('cap'),$('row')].forEach(geist);
  if(started)finish(SLIDES[cur]);started=true;
  cur=i;const s=SLIDES[i];layout();say('');SEL=null;enterStep(s,prev);cv.setAttribute('aria-label',T('buehne-'+s.scene));
  renderText();
  // der neue Text blendet ein, danach Lesepause. Beim Klappen wartet der Text, bis die Linie steht, beim Übergang aus dem Ring, bis die Zeitlinie steht, beim Zurücklaufen des Tages, bis die Bahnen leer sind.
  const tx=$('text');tx.style.transition='none';tx.classList.add('warte');void tx.offsetWidth;tx.style.transition='';
  const nachher=s.klappen||!!(S.sr&&S.sr.ue)||!!(S.zw&&S.zw.ue&&s.scene==='zwei')||!!(S.fk&&(S.fk.ue||S.fk.textSpaeter));   // der Text kommt erst nach dem Übergang
  if(reduce||!nachher)tx.classList.remove('warte');
  S.lese=nachher?0:lesezeit();
  const inChap=SLIDES.filter(x=>x.chap===s.chap),n=inChap.indexOf(s)+1;
  $('chap').textContent=s.chap==null?T('theorie'):KAPITEL[s.chap]+' · '+n+'/'+inChap.length;
  // bricht die Kopfzeile um, wird sie enger gesetzt: so bleibt die Bühne von Schritt zu Schritt gleich hoch
  const kopf=document.querySelector('.top');kopf.classList.remove('eng');if($('chap').offsetHeight>$('brand').offsetHeight*1.5)kopf.classList.add('eng');
  S.stepT=0;S.folgeT=0;S.folgeOk=prev===i-1;   // data-folgt trägt nur weiter, wer vom Schritt davor kommt
  renderRow();renderChapters();syncNav();try{scrollTo(0,0)}catch(e){}
}
/* Fester Bereich für den Text oben: so hoch wie der längste Text auf dieser Breite (mit dem Knopf „Ausführlich“, wo es einen gibt).
   Die Karte hat ihren eigenen, höheren Bereich. Beim Wechsel von der Karte schrumpft er sanft. */
let textH=0,karteH=0;
function textHoehe(){const tw=document.querySelector('.textwrap'),t=$('text');if(!tw||!t.clientWidth)return;
  const m=document.createElement('div');m.className='text';m.setAttribute('aria-hidden','true');
  m.style.cssText='position:absolute;visibility:hidden;left:0;top:0;height:auto;overflow:visible;width:'+t.clientWidth+'px';tw.appendChild(m);
  let h=0,k=0;SLIDES.forEach(s=>{const kz=s.sec.querySelector(':scope > .kurz');if(!kz)return;m.innerHTML=kz.innerHTML;
    const x=m.scrollHeight+(s.sec.querySelector(':scope > .lang')?34:0);if(s.scene==='dreieck')k=Math.max(k,x);else h=Math.max(h,x)});
  m.remove();textH=Math.ceil(h);karteH=Math.max(textH,Math.ceil(k))}
function textSetzen(){const tw=document.querySelector('.textwrap'),s=SLIDES[cur];if(!tw||!s)return;if(!textH)textHoehe();if(!textH)return;
  tw.style.height=(s.scene==='dreieck'?karteH:textH)+'px'}
addEventListener('resize',()=>{textHoehe();textSetzen()});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{textHoehe();textSetzen()});
function renderText(){
  textSetzen();
  const s=SLIDES[cur],lg=s.sec.querySelector(':scope > .lang'),on=!!(lg&&LONG[s.id]);
  $('text').innerHTML=(on?lg:s.sec.querySelector(':scope > .kurz')).innerHTML;
  // Bedienhinweis in der Zeile unter der Bühne, bis dort ein Satz erscheint
  const how=s.sec.querySelector(':scope > .hinweis'),c=$('cap');
  if(how&&(!c.textContent||c.classList.contains('hint')))say(how.textContent,true);
  fit();
  const m=$('mode');m.hidden=!lg;m.setAttribute('aria-pressed',String(on));m.textContent=T(on?'kurz':'ausfuehrlich');
}
$('mode').onclick=()=>{const id=SLIDES[cur].id;LONG[id]=!LONG[id];renderText();try{scrollTo(0,0)}catch(e){}};
function fit(){
  const app=document.querySelector('.app'),t=$('text'),s=SLIDES[cur];
  if(s&&LONG[s.id]&&s.sec.querySelector(':scope > .lang')){app.classList.add('flow');return}
  app.classList.remove('flow');if(t.scrollHeight>(s&&s.scene==='dreieck'?karteH:textH||t.clientHeight)+2)app.classList.add('flow');
}
function pick(id){const k=SLIDES[cur].teile.find(x=>x.id===id);if(!k)return;SEL=id;say(k.say)}
function renderRow(){
  const s=SLIDES[cur],st=stOf(s),row=$('row'),eg=EIGEN[s.id];row.innerHTML='';
  const btn=(id,html,run,off,cls)=>{const b=document.createElement('button');b.id=id;b.innerHTML=html;if(cls)b.className=cls;
    b._off=off;b.disabled=off?!!off():false;b.onclick=()=>{S.lese=0;run();syncNav()};row.appendChild(b);return b};
  s.teile.forEach(x=>btn('karte-'+x.id,x.label,()=>pick(x.id)));
  s.knoepfe.forEach(id=>{const m=MOM[id];
    btn('src-'+id,'<span class="sg '+(m.sign>0?'p':'m')+'">'+(m.sign>0?'+':'−')+'</span>'+m.knopf,()=>tapMoment(s,id))});
  if(s.folge.length)btn('folge-'+s.id,s.knopf,()=>nextInFolge(s),
    ()=>s.folge.every(id=>st.played[id])||(!s.kette&&(busy()||!landed())),s.kette?'act':'');
  s.wahl.forEach(a=>btn('chip-'+a.id,a.label,()=>waehlen(s,a),()=>!holding()));
  s.adressen.forEach(a=>btn(s.id+'-'+a.key,a.name,()=>adressieren(s,a),()=>!adressierbar(a)));
  s.schrift.forEach(x=>{const sg=x.lad.includes('+')?'p':x.lad?'m':'';
    btn(s.id+'-'+x.key,(sg?'<span class="sg '+sg+'">'+(sg==='p'?'+':'−')+'</span>':'')+x.knopf,()=>beschriften(s,x)).dataset.huelle=x.huelle});
  s.faden.forEach(x=>{btn(s.id+'-'+x.key,x.knopf,()=>spinnen(s,x),()=>!S.h[x.huelle]).dataset.huelle=x.huelle});
  if(eg&&eg.action)btn('act-'+s.id,s.knopf,eg.action.run,eg.action.off,'act');
  if(s.scene==='steg'&&!s.neu)s.glieder.forEach((g,i)=>btn(s.id+'-glied'+i,g.label,()=>stegTippen(s,i)));
  if(s.scene==='zwei'&&satzVon(s,'tippen'))s.ereignisse.forEach((e,i)=>{btn(s.id+'-el'+i,e.label,()=>zweiTippen(s,i),()=>!S.zw||!S.zw.fertig).dataset.nodemo='1'});
  if(s.scene==='zwei')s.ereignisse.filter(e=>e.knopf).forEach(e=>{btn(s.id+'-bsp-'+e.id,e.knopf,()=>zweiBeispiel(s,e),()=>!S.zw||!S.zw.fertig||!!S.zw.laeuft||!!(st.bsp||{})[e.id]).dataset.nodemo='1'});
  if(s.scene==='fokus'&&s.runden.length)btn(s.id+'-ueben',s.knopf||'üben',()=>fokusUeben(s),()=>!S.fk||!S.fk.fertig||!!S.fk.laeuft||(st.runde||0)>=s.runden.length,'act').dataset.nodemo='1';
  if(s.scene==='fokus')s.namen.forEach((nm,i)=>btn(s.id+'-name'+i,nm,()=>fokusName(s,i),()=>!S.fk||!S.fk.fertig||!!S.fk.laeuft).dataset.nodemo='1');
  s.wege.forEach(w=>{(s.scene==='fokus'?btn(s.id+'-weg-'+w.id,w.knopf,()=>fokusWeg(s,w),()=>!S.fk||!S.fk.fertig||!!S.fk.laeuft):s.scene==='sicht'?btn(s.id+'-weg-'+w.id,w.knopf,()=>ketteWahl(s,w),()=>!S.si||!S.si.fertig||!!S.si.laeuft)
    :btn(s.id+'-weg-'+w.id,w.knopf,()=>kanalWahl(s,w),()=>!S.zw||!S.zw.fertig||!!S.zw.laeuft)).dataset.nodemo='1'});
  if(s.scene==='grob'&&s.wechsel)btn('act-'+s.id,s.knopf||s.wechsel,()=>grobWechsel(s),()=>!S.gb||!S.gb.fertig||!!S.gb.laeuft,'act').dataset.nodemo='1';
  if(s.scene==='grob'&&s.ebenen.length){let b=null;b=btn('act-'+s.id,s.ebenen[0].frage,()=>{indexTipp(s)},()=>{const G=S.gb,X=G&&G.ix;
      if(X&&b)b.textContent=s.ebenen[Math.min(X.stufe+(G.laeuft?1:0),s.ebenen.length-1)].frage;return !G||!X||!G.fertig||!!G.laeuft||X.stufe>=s.ebenen.length},'act');b.dataset.nodemo='1'}
  if(s.scene==='schloss')s.schluessel.forEach((q,i)=>{btn(s.id+'-schluessel'+i,'„'+q.text+'“',()=>schlossTipp(s,i),()=>!S.sk||!S.sk.fertig||S.sk.drin===i,'still').dataset.nodemo='1'});
  if(s.scene==='sicht'&&!s.reihe&&!s.aussen)btn('act-'+s.id,s.knopf||'',()=>sichtTipp(s),()=>!S.si||!S.si.fertig||!!S.si.laeuft||(s.rueck?S.si.gehoben:S.si.drift>0),'act').dataset.nodemo='1';
  if(s.scene==='drehen')btn('act-'+s.id,s.knopf||'drehen',()=>drehenTipp(s),()=>!S.dr||!S.dr.fertig||!!S.dr.laeuft,'act').dataset.nodemo='1';
  if(s.scene==='fokus')s.momente.filter(id=>MOM[id].knopf).forEach(id=>btn(s.id+'-'+id,MOM[id].knopf,()=>fokusTipp(s,id),()=>!S.fk||!S.fk.fertig||!!S.fk.laeuft||!!(st.fk||{})[id]));
  if(s.scene==='strom')btn('act-'+s.id,s.knopf||'',()=>stromAn(s),()=>!S.sr||S.sr.an||!!S.sr.ue,'act').dataset.nodemo='1';
  if(s.scene==='grob')s.nimmt.forEach(e=>{btn(s.id+'-nimmt-'+e.id,'„'+e.knopf+'“',()=>grobNimmt(s,e),()=>!S.gb||!S.gb.fertig||!!S.gb.laeuft).dataset.nodemo='1'});
  if(s.scene==='grob')s.eingriffe.forEach(e=>{btn(s.id+'-eing-'+e.id,e.knopf,()=>grobEingriff(s,e),()=>!S.gb||!S.gb.fertig||!!S.gb.laeuft).dataset.nodemo='1'});
  // Gedanken zum neuen Element: frei, solange es wartet · am Steg nur der, der es löst · ist es weg, nur der, der es andockt
  s.gedanken.forEach(g=>{btn(s.id+'-ged-'+g.id,'„'+g.text+'“',()=>{const N=S.sg&&S.sg.neu;if(N)N.auto=false;denkenStart(s,g)},
    ()=>{const N=S.sg&&S.sg.neu;return !N||!(N.ph==='wartet'||(N.ph==='dran'&&!g.an)||(N.ph==='weg'&&g.an))}).dataset.nodemo='1'});
  s.beispiele.forEach(x=>btn(s.id+'-'+x.key,x.knopf,()=>beispiel(s,x),()=>!!st.played[x.key]||beschaeftigt()));
  if(s.ueben)btn('ueben-'+s.id,s.knopf,()=>ueben(s),()=>{const h=S.h[s.ueben];return !h||h.a<1||beschaeftigt()||s.tage.every(x=>st.played[x.key])}).dataset.huelle=s.ueben;
  if(s.vorfuehren){
    btn('reset-'+s.id,T('zuruecksetzen'),()=>{huellenListe(s).forEach(h=>h.threads=[]);st.taps=0;if(S.vor)S.vor.aktiv=false;say(satzVon(s,'danach'),true)},
      ()=>!huellenListe(s).some(h=>h.threads.length)).dataset.nodemo='1';
    btn('nochmal-'+s.id,T('nochmal'),()=>vorStart(s,true),()=>!!(S.vor&&S.vor.aktiv)).dataset.nodemo='1'}
  if(s.nochmal)btn('nochmal-'+s.id,T('nochmal'),()=>go(cur,true),()=>!done(s),'act nochmal').dataset.nodemo='1';
}
// Ein Punkt für den Anfang, dann je einer pro Kapitel, das es auf der Seite gibt, in der Reihenfolge der Schritte.
// So wandert der farbige Punkt beim Weitergehen immer nur nach rechts, und jeder Punkt führt irgendwohin.
function renderChapters(){
  const ol=$('chapters');ol.innerHTML='';const s=SLIDES[cur],reihe=[];
  SLIDES.forEach((x,i)=>{if(!reihe.some(r=>r.chap===x.chap))reihe.push({chap:x.chap,i})});
  const hier=reihe.findIndex(r=>r.chap===s.chap);
  reihe.forEach((r,n)=>{const li=document.createElement('li'),b=document.createElement('button'),c=r.chap==null?T('anfang'):KAPITEL[r.chap];
    b.id='chapter-'+(r.chap==null?'anfang':r.chap);b.setAttribute('aria-label',c);b.title=c;b.onclick=()=>go(r.i,true);
    if(n<hier)b.className='war';if(n===hier)b.setAttribute('aria-current','true');li.appendChild(b);ol.appendChild(li)});
}
function syncNav(){
  const s=SLIDES[cur],last=cur===SLIDES.length-1;
  $('back').disabled=cur===0;
  $('next').textContent=last?T('kommtnoch'):s.weiter||T('weiter');$('next').disabled=last;
  $('next').classList.toggle('ready',!last&&done(s));
  const lf=!last&&laeuft(s);$('next').classList.toggle('laeuft',lf);$('next').tabIndex=lf?-1:0;
  const btns=[...$('row').querySelectorAll('button')];
  btns.forEach(b=>{if(b._off)b.disabled=!!b._off()});
  $('auto').hidden=s.scene==='dreieck'||!btns.some(b=>!b.dataset.nodemo);
}
$('back').onclick=()=>go(cur-1);
$('next').onclick=()=>go(cur+1);
// „Zuschauen“ tippt für dich: der Reihe nach jeden Knopf, der gerade frei ist
$('auto').onclick=()=>{stopDemo();const s=SLIDES[cur];demoI=0;
  const tick=()=>{if(SLIDES[cur]!==s||done(s)){stopDemo();return}
    const bs=[...$('row').querySelectorAll('button')].filter(b=>!b.disabled&&!b.dataset.nodemo);
    if(bs.length)bs[demoI++%bs.length].click()};
  tick();demoT=setInterval(tick,s.knoepfe.length?2700:s.scene==='bindung'?1300:700)};
$('brand').textContent=T('marke');$('back').textContent=T('zurueck');$('auto').textContent=T('zuschauen');
document.querySelector('.app').classList.toggle('ruhig',reduce);
