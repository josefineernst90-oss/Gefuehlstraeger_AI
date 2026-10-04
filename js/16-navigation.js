/* ================= Navigation ================= */
let demoT=null,demoI=0;
function stopDemo(){clearInterval(demoT);demoT=null}
function go(i,force){
  i=Math.max(0,Math.min(SLIDES.length-1,i));if(started&&i===cur&&!force)return;
  stopDemo();timers.forEach(clearTimeout);timers=[];
  const prev=started?cur:-1;
  if(started)finish(SLIDES[cur]);started=true;
  cur=i;const s=SLIDES[i];layout();say('');SEL=null;enterStep(s,prev);cv.setAttribute('aria-label',T('buehne-'+s.scene));
  renderText();
  // der neue Text blendet ein, danach Lesepause. Beim Klappen wartet der Text, bis die Linie steht.
  const tx=$('text');tx.style.transition='none';tx.classList.add('warte');void tx.offsetWidth;tx.style.transition='';
  if(reduce||!s.klappen)tx.classList.remove('warte');
  S.lese=s.klappen?0:lesezeit();
  const inChap=SLIDES.filter(x=>x.chap===s.chap),n=inChap.indexOf(s)+1;
  $('chap').textContent=s.chap==null?T('theorie'):KAPITEL[s.chap]+' · '+n+'/'+inChap.length;
  renderRow();renderChapters();syncNav();try{scrollTo(0,0)}catch(e){}
}
function renderText(){
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
  app.classList.remove('flow');if(t.scrollHeight>t.clientHeight+2)app.classList.add('flow');
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
  s.wege.forEach(w=>{(s.scene==='sicht'?btn(s.id+'-weg-'+w.id,w.knopf,()=>ketteWahl(s,w),()=>!S.si||!S.si.fertig||!!S.si.laeuft)
    :btn(s.id+'-weg-'+w.id,w.knopf,()=>kanalWahl(s,w),()=>!S.zw||!S.zw.fertig||!!S.zw.laeuft)).dataset.nodemo='1'});
  if(s.scene==='grob'&&s.wechsel)btn('act-'+s.id,s.knopf||s.wechsel,()=>grobWechsel(s),()=>!S.gb||!S.gb.fertig||!!S.gb.laeuft,'act').dataset.nodemo='1';
  if(s.scene==='grob'&&s.ebenen.length){let b=null;b=btn('act-'+s.id,s.ebenen[0].frage,()=>{indexTipp(s)},()=>{const G=S.gb,X=G&&G.ix;
      if(X&&b)b.textContent=s.ebenen[Math.min(X.stufe+(G.laeuft?1:0),s.ebenen.length-1)].frage;return !G||!X||!G.fertig||!!G.laeuft||X.stufe>=s.ebenen.length},'act');b.dataset.nodemo='1'}
  if(s.scene==='schloss')s.schluessel.forEach((q,i)=>{btn(s.id+'-schluessel'+i,'„'+q.text+'“',()=>schlossTipp(s,i),()=>!S.sk||!S.sk.fertig||S.sk.drin===i,'still').dataset.nodemo='1'});
  if(s.scene==='sicht'&&!s.reihe&&!s.aussen)btn('act-'+s.id,s.knopf||'',()=>sichtTipp(s),()=>!S.si||!S.si.fertig||!!S.si.laeuft||(s.rueck?S.si.gehoben:S.si.drift>0),'act').dataset.nodemo='1';
  if(s.scene==='drehen')btn('act-'+s.id,s.knopf||'drehen',()=>drehenTipp(s),()=>!S.dr||!S.dr.fertig||!!S.dr.laeuft,'act').dataset.nodemo='1';
  if(s.scene==='strom')btn('act-'+s.id,s.knopf||'',()=>stromAn(s),()=>!S.sr||S.sr.an,'act').dataset.nodemo='1';
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
  if(s.nochmal)btn('nochmal-'+s.id,T('nochmal'),()=>go(cur,true),()=>!done(s),'act').dataset.nodemo='1';
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
function ruheZeigen(){$('ruhe').hidden=!geraetRuhig;document.querySelector('.app').classList.toggle('ruhig',reduce);
  $('ruhe-text').textContent=T(reduce?'ruhe-still':'ruhe-bewegt');$('motion').textContent=T(reduce?'bewegung-an':'bewegung-aus')}
$('motion').onclick=()=>{reduce=!reduce;try{localStorage.setItem('gt-bewegung',reduce?'aus':'an')}catch(e){}ruheZeigen();go(cur,true)};
ruheZeigen();
