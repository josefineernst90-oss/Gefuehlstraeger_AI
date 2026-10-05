const $=id=>document.getElementById(id);
const cv=$('c'),ctx=cv.getContext('2d'),stage=$('stage');
// Die Bilder bewegen sich immer, auch wenn das Gerät „weniger Bewegung“ meldet. Nur zum Prüfen: mit ?still an der Adresse stehen sie still,
// jeder Ablauf steht dann sofort am Ende.
let reduce=/[?&]still\b/.test(location.search);
const rnd=(a,b)=>a+Math.random()*(b-a);

/* ================= Farben aus den Tokens ================= */
let C={};
function colors(){const s=getComputedStyle(document.documentElement);
  ['bg','paper','ink','muted','line','plus','minus','gelb','serif','sans'].forEach(k=>C[k]=s.getPropertyValue('--'+k).trim())}
colors();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',colors);
new MutationObserver(colors).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

/* ================= Drehbuch einlesen =================
   Aus den <section>-Blöcken wird die Schrittkette SLIDES, aus den .moment-Blöcken das Verzeichnis MOM. */
const buch=$('drehbuch');
const KAPITEL=[...buch.querySelectorAll('#kapitel li')].map(li=>li.textContent.trim());
const T=id=>{const e=buch.querySelector('#woerter [data-id="'+id+'"]');return e?e.textContent.trim():id};
const ids=v=>v?v.trim().split(/\s+/):[];
const MOM={};
function parseMoment(el){
  const lad=el.dataset.ladung||'0',sign=lad.includes('+')?1:/[−-]/.test(lad)?-1:0;
  let geladen=false;
  const lines=[...el.querySelectorAll(':scope > p:not(.zu):not(.fall)')].map(p=>{
    const wer=p.dataset.wer,ruft=p.dataset.ruft;if(wer==='fühlen'||ruft)geladen=true;
    // die Ladung sitzt rechts beim Fühlen, links beim Denken; vor dem ersten Gefühl gibt es noch keine
    return {text:p.textContent.trim(),tag:wer?wer.toUpperCase():null,dot:sign&&geladen&&wer?(wer==='fühlen'?'right':wer==='denken'?'left':'top'):null,
      sg:p.dataset.ladung?(p.dataset.ladung.includes('+')?1:-1):0,recall:ruft,cap:p.dataset.satz}});
  const satz=q=>{const e=el.querySelector(':scope > '+q);return e?e.textContent.trim():null};
  return {id:el.dataset.id,sign,big:lad==='++',dur:+el.dataset.tempo||1.5,fall:+el.dataset.fall||1.1,lines,
    addr:el.dataset.adresse,addrLabel:el.dataset.name,assign:el.dataset.ordnet,hold:el.hasAttribute('data-wartet'),keep:el.hasAttribute('data-bleibt'),reopen:el.hasAttribute('data-oeffnet'),
    knopf:el.dataset.knopf,capClose:satz('p.zu'),capDrop:satz('p.fall')};
}
const bahnKey=v=>({oben:'passiv',unten:'aktiv'})[v]||v;
const SLIDES=[...buch.querySelectorAll(':scope > section:not([data-aus])')].map(sec=>{const d=sec.dataset;
  sec.querySelectorAll('.moment').forEach(el=>{const sp=parseMoment(el);MOM[sp.id]=sp});
  return {id:sec.id,sec,chap:d.kapitel?KAPITEL.indexOf(d.kapitel):null,anchor:d.anker,scene:d.szene||'speicher',
    leer:d.start==='leer',vorher:d.start==='vorher',fold:d.uebergang==='dreieck',figur:d.uebergang==='figur',hinaus:d.uebergang==='hinaus',alleHuellen:d.huellen==='alle',eigeneHuellen:d.huellen==='eigene',vomRing:d.uebergang==='ring',vomWasser:d.uebergang==='speicher',akt:d.akt||'',dahinter:d.dahinter||'',ausTraeger:d.von||'',namen:[...sec.querySelectorAll(':scope > .name')].map(q=>q.textContent.trim()),runden:[...sec.querySelectorAll(':scope > .runde')].map(q=>({zeilen:+q.dataset.zeilen||0,cap:q.textContent.trim()})),zeichenText:d.szene==='fokus'?d.kommt||'':'',geht:'geht' in d,
    momente:[...sec.querySelectorAll(':scope > .moment')].map(el=>el.dataset.id),alte:[...sec.querySelectorAll(':scope > .traeger')].map(q=>({id:q.dataset.id,label:q.dataset.name||'',lad:q.dataset.ladung||''})),zurueck:d.uebergang==='zurueck',frei:'frei' in d,vorfuehren:+d.vorfuehren||0,ich:'ich' in d,mann:'mann' in d,ein:d.uebergang==='hinein'?1:d.uebergang==='heraus'?-1:0,zumSteg:d.uebergang==='steg',
    glieder:[...sec.querySelectorAll(':scope > .glied:not([data-neu])')].map(g=>({id:g.dataset.id,label:g.dataset.name||'',lad:g.dataset.ladung||''})),
    ereignisse:[...sec.querySelectorAll(':scope > .ereignis')].map(e=>({id:e.dataset.id,art:e.dataset.art||'tuer',label:e.dataset.name||'',schild:e.dataset.kommt||e.dataset.name||'',lad:e.dataset.ladung||'',sicht:'sicht' in e.dataset,ruft:e.dataset.ruft||'',bleibt:'bleibt' in e.dataset,geht:'geht' in e.dataset,innen:'innen' in e.dataset,knopf:e.dataset.knopf||'',satz:e.dataset.satz||'',
      ged:Object.fromEntries([...e.querySelectorAll('p')].map(p=>[bahnKey(p.dataset.bahn),{text:p.textContent.trim(),verbindet:'verbindet' in p.dataset,verpufft:'verpufft' in p.dataset,
        handy:'handy' in p.dataset,sortiert:'sortiert' in p.dataset,name:p.dataset.name||'',lad:p.dataset.ladung||''}]))})),
    bahnen:[d.oben||'',d.unten||''],
    sprueche:[...sec.querySelectorAll(':scope > .spruch')].map(p=>({id:p.dataset.id,label:p.dataset.name||'',lad:p.dataset.ladung||'',von:bahnKey(p.dataset.von),an:bahnKey(p.dataset.an),text:p.textContent.trim()})),
    inselListe:[...sec.querySelectorAll(':scope > .insel')].map(q=>({id:q.dataset.id,label:q.dataset.name||'',winkel:+q.dataset.winkel||0,geladen:+q.dataset.geladen||0,
      schickt:q.dataset.schickt||'',da:'da' in q.dataset,hat:q.dataset.hat||'',hatLad:q.dataset.hatLadung||''})),
    stufen:[...sec.querySelectorAll(':scope > .stufe')].map(q=>({teil:q.dataset.teil||'',name:q.dataset.name||'',lad:q.dataset.ladung||'−',ende:'ende' in q.dataset})),
    dinge:[...sec.querySelectorAll(':scope > .ding')].map(q=>({art:q.dataset.art||'auto',name:q.dataset.name||'',passt:'passt' in q.dataset,rest:'rest' in q.dataset,text:q.textContent.trim(),sign:(q.dataset.ladung||'').includes('+')?1:(q.dataset.ladung||'').trim()?-1:0})),
    zaehlt:d.zaehlt||'',gesehen:d.gesehen||'',traeger:d.traeger||'',
    wurzel:d.wurzel||'',
    genau:[...sec.querySelectorAll(':scope > .genau')].map(q=>({von:q.dataset.von||'',label:q.dataset.name||'',lad:q.dataset.ladung||''}))[0]||null,
    tiefer:[...sec.querySelectorAll(':scope > .tiefer')].map(q=>({label:q.dataset.name||'',lad:q.dataset.ladung||'',denkt:q.dataset.denkt||''}))[0]||null,
    daneben:[...sec.querySelectorAll(':scope > .daneben')].map(q=>({label:q.dataset.name||'',lad:q.dataset.ladung||''}))[0]||null,
    nimmt:[...sec.querySelectorAll(':scope > .nimmt')].map(q=>({id:q.dataset.id,knopf:q.dataset.knopf||q.dataset.id,cap:q.textContent.trim()})),
    eingriffe:[...sec.querySelectorAll(':scope > .eingriff')].map(q=>({id:q.dataset.id,knopf:q.dataset.knopf||q.dataset.id,cap:q.textContent.trim()})),
    ebenen:[...sec.querySelectorAll(':scope > .ebene')].map(e=>({frage:e.dataset.frage||'',satz:e.dataset.satz||'',dimmt:'dimmt' in e.dataset,
      kinder:[...e.querySelectorAll('p')].map(q=>({label:q.dataset.name||'',lad:q.dataset.ladung||'',weiter:'weiter' in q.dataset}))})),
    grobListe:[...sec.querySelectorAll(':scope > .grob')].map(q=>({id:q.dataset.id,label:q.dataset.name||'',lad:q.dataset.ladung||'',da:'da' in q.dataset})),
    frage:((sec.querySelector(':scope > .frage')||{}).textContent||'').trim(),antwort:((sec.querySelector(':scope > .antwort')||{}).textContent||'').trim(),wechsel:d.wechsel||'',
    stand:d.stand||'',inseln:d.uebergang==='inseln',kanal:d.uebergang==='kanal',
    wege:[...sec.querySelectorAll(':scope > .weg')].map(p=>({id:p.dataset.id,knopf:p.dataset.knopf||p.dataset.id,sagt:p.dataset.sagt||'',wer:p.dataset.wer||'',cap:p.textContent.trim()})),
    neu:[...sec.querySelectorAll(':scope > .glied[data-neu]')].map(g=>({id:g.dataset.id,label:g.dataset.name||'',lad:g.dataset.ladung||''}))[0]||null,
    gedanken:[...sec.querySelectorAll(':scope > .gedanke')].map(g=>({id:g.dataset.id,text:g.textContent.trim(),an:g.dataset.wirkt==='andocken'})),
    tuer:d.tuer||'',gast:d.kommt||'tuer',steg:ids(d.steg),verblassen:+d.verblassen||0,zusehen:'zusehen' in d,merken:'merken' in d,ueben:d.ueben||'',wieder:d.wieder||'',
    zeigen:d.zeigen||'',
    beispiele:[...sec.querySelectorAll(':scope > .beispiel')].map((p,i)=>({key:'bsp'+i,id:p.dataset.id,label:p.dataset.name||'',lad:p.dataset.ladung||'',n:+p.dataset.faeden||1,knopf:p.dataset.knopf||p.dataset.name||'',cap:p.textContent.trim()})),
    tage:[...sec.querySelectorAll(':scope > .tag')].map((p,i)=>({key:'tag'+i,nr:p.dataset.nr||'',sign:(p.dataset.ladung||'').includes('+')?1:-1,cap:p.textContent.trim()})),foto:'foto' in d,rahmen:d.rahmen||'',rahmenAnim:d.uebergang==='rahmen',loesen:d.uebergang==='weiter',
    adressen:[...sec.querySelectorAll(':scope > .adresse')].map((p,i)=>({key:'adr'+i,id:p.dataset.id,name:p.dataset.name,von:ids(p.dataset.von),cap:p.textContent.trim()})),
    vonlinie:d.uebergang==='linie',dauer:+d.dauer||6,knopf:d.knopf,weiter:d.weiter,nochmal:'nochmal' in d,
    auto:ids(d.auto),knoepfe:ids(d.knoepfe),folge:ids(d.folge),kette:'kette' in d,fertig:+d.fertig||0,
    wahl:[...sec.querySelectorAll('.wahl')].map(w=>({id:w.dataset.id,label:w.dataset.knopf,carrier:w.dataset.name,line:w.dataset.zeile,cap:w.textContent.trim()})),
    rueck:'rueck' in d,reihe:'reihe' in d,aussen:'aussen' in d,
    impulse:[...sec.querySelectorAll(':scope > .impuls')].map(q=>({art:q.dataset.art||'tuer',label:q.dataset.name||'',text:q.textContent.trim(),sign:(q.dataset.ladung||'').includes('+')?1:-1})),
    ort:d.ort,klappen:d.uebergang==='klappen',gruebeln:'gruebeln' in d,geschichte:'geschichte' in d,
    trifft:d.trifft?(d.trifft.includes('+')?1:-1):0,wird:d.wird?(d.wird.includes('+')?1:-1):0,
    kommt:((sec.querySelector(':scope > .kommt')||{}).textContent||'').trim(),
    seiten:[...sec.querySelectorAll(':scope > .seite')].map(q=>({label:q.dataset.name||'',lad:q.dataset.ladung||'',text:q.textContent.trim()})),
    schluessel:[...sec.querySelectorAll(':scope > .schluessel')].map(q=>({text:q.textContent.trim(),art:q.dataset.art||'zu',wort:q.dataset.wort||'',fuehlt:q.dataset.fuehlt||'',bart:(q.dataset.bart||'5,3,5').split(',').map(Number)})),
    blasen:[...sec.querySelectorAll(':scope > .blase')].map(p=>({tag:(p.dataset.wer||'').toUpperCase(),text:p.textContent.trim()})),
    teile:[...sec.querySelectorAll('.teil')].map(t=>({id:t.dataset.id,label:t.dataset.knopf,say:t.textContent.trim()})),
    huellen:[...sec.querySelectorAll(':scope > .huelle')].map(h=>({id:h.dataset.id,label:h.dataset.name||'',lad:h.dataset.ladung||'',zw:h.hasAttribute('data-fluechtig'),n:+h.dataset.faeden||0,platz:h.dataset.platz||''})),
    schrift:[...sec.querySelectorAll(':scope > .schrift')].map((p,i)=>({key:'schrift'+i,huelle:p.dataset.huelle,knopf:p.dataset.knopf,label:p.dataset.name||'',lad:p.dataset.ladung||'',cap:p.textContent.trim()})),
    faden:[...sec.querySelectorAll(':scope > .faden')].map((p,i)=>({key:'faden'+i,huelle:p.dataset.huelle,knopf:p.dataset.knopf,sinne:ids(p.dataset.sinne),cap:p.textContent.trim()}))}});
const satzVon=(s,id)=>{const e=s.sec.querySelector('.satz[data-id="'+id+'"]');return e?e.textContent.trim():''};

/* ================= Zustand der Bühne ================= */
let W=0,H=0,cx=0,cy=0,R=0,R0=0,cy0=0,sx=0,yL=34,M=40,time=0,cur=0,timers=[],started=false;
const LONG={};   // ausführliche Fassung: pro Schritt gemerkt, nicht global
let SEL=null,G=null;   // gewählter Teil der Karte und ihre Geometrie
// p = lose Ladungen im Speicher · m = Momente auf der Zeitlinie · c = Ladungsträger (Adresse mit ihren Ladungen)
// e = Echos beim Wiederaufrufen · q = Momente, die als Nächstes dran sind · st = was in welchem Schritt schon gespielt wurde
// h = Hüllen der Bühne „Bindung“ mit ihren Fäden
// g = Gang des Männchens über die Linie im laufenden Schritt
// lese = Sekunden Lesepause, bevor sich die Bühne bewegt
// ev = was auf der Bühne als Nächstes dran ist, jeweils nach so vielen Sekunden (eins nach dem anderen)
// steg = Verbindungen zwischen Ladungsträgern im Speicher
const S={steg:[],ev:[],p:[],m:[],c:[],e:[],q:[],h:{},g:null,lese:0,st:{},level:0,kick:0,frozen:false,freezeAt:0,intro:0,introLive:false,capId:null,knotL:0,knotR:0,aus:null,vor:null,du:{x:0,y:0,vx:0,vy:0,tint:0},vb:0,vbI:0,fotoP:0,fotoName:'',fotoSaid:true,geloest:false,losT:0};
const ptr={x:-999,y:-999};
const stOf=s=>S.st[s.id]||(S.st[s.id]={played:{},taps:0,chosen:false});
function resetAll(){S.hAlt=null;S.steg=[];S.ev=[];S.p=[];S.m=[];S.c=[];S.e=[];S.q=[];S.h={};S.st={};S.level=0;S.kick=0;S.frozen=false;S.intro=0;S.introLive=false;S.capId=null;S.fig=0;S.figSaid=false;S.fotoP=0}

const landed=()=>S.p.every(q=>q.t>=1);
const busy=()=>S.m.some(m=>!m.out&&!m.hold);                       // ein Moment läuft gerade
const steht=m=>m.hold&&m.keep;   // ein Moment, der geschlossen stehen bleibt
const idle=()=>!S.q.length&&!S.m.some(m=>!m.out&&!steht(m))&&landed();         // alles gespielt und angekommen
const holding=()=>S.m.find(m=>m.hold&&!m.keep&&m.age>=m.lines.length*m.dur-0.5);   // ein Moment wartet auf die Wahl
function lesezeit(){return reduce?0:Math.max(1.6,Math.min(5.5,0.6+$('text').textContent.trim().length*0.038))}
function say(t,hint){const c=$('cap');c.textContent=t||'';c.classList.toggle('hint',!!hint)}
function later(ms,fn){timers.push(setTimeout(fn,ms))}
function spaeter(sek,fn){S.ev.push({t:reduce?0:sek,fn})}
function mood(l){return T(l>0.3?'positiv':l<-0.3?'negativ':'gemischt')}

/* ---------- Ladungen und Ladungsträger ---------- */
function target(){let p=0,n=0;const cnt=(sg,big)=>{const w=big?2:1;sg>0?p+=w:n+=w};
  S.p.forEach(q=>cnt(q.sign,q.big));S.c.forEach(c=>c.charges.forEach(ch=>cnt(ch.s,ch.big)));return (p-n)/(p+n+5)}
function add(sign,ox,oy,placed,dur,to,big,von){
  const a=rnd(0,6.283),d=Math.sqrt(Math.random())*0.72;
  const q={sign,hx:Math.cos(a)*d,hy:Math.sin(a)*d,ox,oy,x:ox,y:oy,vx:0,vy:0,t:placed?1:0,dur:dur||1.1,to,big,von,   // von = aus welchem Moment sie stammt
    ph:[rnd(0,6.28),rnd(0,6.28),rnd(0,6.28),rnd(0,6.28)],f:[rnd(.4,.8),rnd(.9,1.5),rnd(.35,.7),rnd(.8,1.4)]};
  if(placed){q.x=cx+q.hx*R;q.y=cy+q.hy*R}else S.kick+=sign*0.3;
  S.p.push(q);if(S.p.length>60)S.p.shift();return q;
}
// Ladungsträger: eine Adresse im Speicher, an der sich Ladungen sammeln. Notation wie im Buch: Bezeichnung |Ladung|
const carrier=id=>S.c.find(c=>c.id===id);
function ensureCarrier(id,label){let c=carrier(id);if(!c){c={id,label,charges:[],x:cx,y:cy,a:0,pulse:0,slot:0};S.c.push(c)}return c}
// eine lose Ladung bekommt nachträglich ihre Adresse
// alle losen Ladungen aus bestimmten Momenten bekommen im Nachhinein dieselbe Adresse, eine nach der anderen
function adressieren(s,a){const st=stOf(s);ensureCarrier(a.id,a.name);let i=0;
  S.p.forEach(q=>{if(!q.to&&q.t>=1&&a.von.includes(q.von)){q.to=a.id;q.t=0;q.wait=reduce?0:i*0.45;q.ox=q.x;q.oy=q.y;q.dur=1.2;i++}});
  st.played[a.key]=1;st.taps++;say(a.cap)}
const adressierbar=a=>S.p.some(q=>!q.to&&q.t>=1&&a.von.includes(q.von));
function assignLoose(id,label){ensureCarrier(id,label);const q=[...S.p].reverse().find(q=>!q.to&&q.t>=1);
  if(q){q.to=id;q.t=0;q.ox=q.x;q.oy=q.y;q.dur=1.4}return q}

/* ---------- Momente ----------
   Ein Moment: zwei Platten, dazwischen nacheinander seine Zeilen. Dann schließen sich die Platten um die Ladung,
   und sie fällt in den Speicher, lose oder zu ihrer Adresse. */
const PAST=0.42,CLOSED=17,T_CLOSE=0.9;
function halfWidth(text){ctx.font='italic 15px '+C.serif;return Math.min(cx-34,ctx.measureText(text).width/2+14)}
function openMoment(spec){
  const wMax=Math.max(...spec.lines.map(l=>halfWidth(l.text)));
  const near=Math.max(-1e9,...S.m.map(m=>m.tx)),need=wMax+CLOSED+14-(cx-near);
  // vergangene Momente schließen sich und rücken nach links
  S.m.forEach(m=>{m.past=true;if(!m.out)m.age=Math.max(m.age,m.lines.length*m.dur);if(need>0)m.tx-=need});
  const m={x:cx,tx:cx,w:0,sign:spec.sign,lines:spec.lines,dur:spec.dur,fall:spec.fall,spec,
    addr:spec.addr,addrLabel:spec.addrLabel,big:spec.big,hold:spec.hold||spec.keep,keep:spec.keep,sg:0,capDrop:spec.capDrop,onDrop:null,
    age:0,out:false,past:false,ph:-1,side:null,prev:null,dp:1,ds:0};
  S.m.push(m);return m;
}
// Was ein Moment (oder seine Vorlage) am Ende bewirkt, ohne Animation. Für übersprungene Schritte.
function applyNow(o){const sp=o.spec||o;
  if(sp.keep)return;   // ein stehender Moment hat noch nichts bewirkt
  if(sp.assign){const c=ensureCarrier(sp.assign,sp.addrLabel),i=S.p.map(q=>!q.to&&q.t>=1).lastIndexOf(true);
    if(i>=0){const q=S.p.splice(i,1)[0];c.charges.push({s:q.sign,big:q.big})}}
  else if(o.sign){if(o.addr)ensureCarrier(o.addr,o.addrLabel).charges.push({s:o.sign,big:o.big});else add(o.sign,0,0,true,0,null,o.big,sp.id)}
}
// den stehen gebliebenen Moment wieder öffnen: er spielt jetzt die Zeilen von sp ab
function wiederOeffnen(m,sp){S.e.push({x0:m.x,y0:yL,x1:m.x,y1:yL,t:1,sign:m.sg||m.sign});
  m.spec=sp;m.lines=sp.lines;m.dur=sp.dur;m.fall=sp.fall;m.sign=sp.sign;m.big=sp.big;m.capDrop=sp.capDrop;
  m.hold=false;m.keep=false;m.age=0;m.ph=-1;m.side=null;m.prev=null;m.ds=0;m.dp=1;m.sg=0}
// Ende eines Übergangs am Anfang eines Speicher-Schritts: der Moment aus data-auto übernimmt
function introFertig(s){S.introLive=true;S.intro=s.dauer;const sp=MOM[s.auto[0]],m=openMoment(sp);stOf(s).played[sp.id]=1;
  if(s.fold){m.age=0.45;m.ph=0;m.w=halfWidth(sp.lines[0].text)}
  // von der Linie: der Moment steht schon geschlossen um seine Ladung
  else{m.w=CLOSED;m.ph=0;m.side='mid';m.ds=1;m.dp=1;m.sg=sp.sign;if(sp.capClose)say(sp.capClose)}}
function settle(){S.p.forEach(q=>{if(q.t<1){q.t=1;const c=q.to&&carrier(q.to);
  if(c){c.charges.push({s:q.sign,big:q.big});q.gone=true}else{q.x=cx+q.hx*R;q.y=cy+q.hy*R}}});S.p=S.p.filter(q=>!q.gone)}
function knots(){const v=S.m.slice(-3),lastM=S.m[S.m.length-1];
  S.knotL=Math.max(40,(v.length?Math.min(...v.map(m=>m.tx)):cx-2*M)-CLOSED-12);
  S.knotR=Math.min(W-12,cx+(lastM&&!lastM.past?Math.max(lastM.w,CLOSED):CLOSED)+12)}
