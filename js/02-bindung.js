/* ---------- Bindung: Hüllen und Fäden ----------
   Eine Hülle ist ein Ladungsträger ohne Speicher drumherum: Beschriftung |Ladung|. Fäden verbinden sie mit „du“. */
const MAXF=9;   // mehr Fäden zeichnet die Bühne an einer Hülle nicht
const zeichen=v=>[...(v||'')].filter(ch=>'+−-'.includes(ch)).map(ch=>({s:ch==='+'?1:-1}));
function beschriften(s,x){const h=S.h[x.huelle],st=stOf(s);if(!h)return;
  h.label=x.label;h.charges=zeichen(x.lad);h.a=0;h.pulse=1;st.played[x.key]=1;st.taps++;say(x.cap)}
function faden(h,sinn,li,ln){if(h.threads.length<MAXF)h.threads.push({t:reduce?1:0,o:0,sinn:sinn||'',li:li||0,ln:ln||1,age:0,ph:rnd(0,6.28),f:rnd(.5,1.1)});h.pulse=1}
function spinnen(s,x){const h=S.h[x.huelle],st=stOf(s);if(!h)return;
  (x.sinne.length?x.sinne:['']).forEach((sinn,li,all)=>faden(h,sinn,li,all.length));
  st.played[x.key]=1;st.taps++;say(x.cap)}
/* Was bleibt: ab FEST Fäden wird ein Ladungsträger fest. Seine Fäden schließen sich zu einem Strang und verblassen nicht mehr. */
const FEST=4,lebt=h=>h.threads.filter(f=>!f.weg).length;
function festMachen(h){h.fest=true;h.pulse=1}
// Antippen, während die Zeit vergeht: ein neuer Faden, die Hülle ist kurz geschützt. Auch eine Hülle, die gerade verblasst, bleibt so.
function naehren(s,h){const st=stOf(s);h.weg=false;faden(h);h.genaehrt=time;st.taps++;
  if(!h.fest&&lebt(h)>=FEST){festMachen(h);say(satzVon(s,'fest-tipp')||satzVon(s,'fest'))}else say(satzVon(s,'faden'))}
// die Zeit vergeht: genau eine Sache pro Takt
function verblassenTakt(s){const st=stOf(s),alle=huellenListe(s).filter(h=>!h.weg),hs=alle.filter(h=>!h.fest&&time-(h.genaehrt||-99)>3);
  let h=hs.find(h=>!h.threads.length);
  if(h){h.weg=true;return}                                                    // ohne Faden: die Hülle selbst verblasst
  const mit=hs.filter(h=>lebt(h)&&lebt(h)<FEST);
  if(mit.length){mit[S.vbI++%mit.length].threads.find(f=>!f.weg).weg=true;return}   // sonst verliert reihum eine Hülle einen Faden
  h=alle.find(h=>!h.fest&&lebt(h)>=FEST);
  if(h){festMachen(h);say(satzVon(s,'fest'));syncNav()}}                        // zuletzt: was genug Fäden hat, wird fest
// eine Hülle ist ganz verschwunden
function hinweg(h){const s=SLIDES[cur],st=stOf(s);st.fort=(st.fort||0)+1;
  if(st.fort===1&&!st.taps){const c=satzVon(s,'weg');if(c)say(c)}syncNav()}
// das Ende ohne Animation: was genug Fäden hat, ist fest, alles andere ist weg
function verblassenFertig(s){huellenListe(s).forEach(h=>{h.threads=h.threads.filter(f=>!f.weg);
  if(h.fest||(!h.weg&&h.threads.length>=FEST)){h.fest=true;h.festK=1;h.weg=false;h.a=1}
  else{h.weg=true;h.fort=true;h.a=0;h.threads=[]}})}
/* Üben: ein Tipp ist ein Tag. Erst wächst der Faden, mit ihm kommt die Ladung in die Hülle, dann der Satz. */
const beschaeftigt=()=>S.ev.length>0||Object.values(S.h).some(h=>h.threads.some(f=>f.bringt));
function ueben(s){const st=stOf(s),h=S.h[s.ueben],x=s.tage.find(x=>!st.played[x.key]);if(!h||!x||h.a<1||beschaeftigt())return;
  st.played[x.key]=1;st.taps++;faden(h,T('tag')+' '+x.nr);
  h.threads[h.threads.length-1].bringt={s:x.sign,cap:x.cap,letzter:x===s.tage[s.tage.length-1]}}
function angekommen(h,b){const s=SLIDES[cur],how=s.sec.querySelector(':scope > .hinweis');h.charges.push({s:b.s});h.pulse=1;
  spaeter(0.7,()=>{if(b.cap)say(b.cap);else say(how?how.textContent:'',true);
    // nach dem letzten Tag: erst der Satz, dann wird der Träger fest, dann der Satz dazu
    if(b.letzter&&satzVon(s,'fest')&&lebt(h)>=FEST&&!h.fest)spaeter(2.8,()=>{festMachen(h);spaeter(1.1,()=>{say(satzVon(s,'fest'));syncNav()})});
    syncNav()})}
/* Beispiele: ein Tipp stellt einen fertigen Ladungsträger hin. Erst die Hülle, dann ihre Fäden, dann (ab FEST Fäden) der Strang, dann der Satz. */
function neueHuelle(id,label,lad,slot){const p=ringPlatz(slot);return S.h[id]={id,label,charges:zeichen(lad),threads:[],a:reduce?1:0,pulse:0,tap:0,x:p[0],y:p[1],slot}}
// die Plätze richten sich nach der Reihenfolge im Block, nicht nach der Reihenfolge des Antippens
function beispielPlatz(s,x){const voll=new Set(Object.values(S.h).filter(h=>!h.fort&&!s.beispiele.some(b=>b.id===h.id)).map(h=>h.slot));let slot=0;
  for(const b of s.beispiele){slot=freierPlatz(voll);voll.add(slot);if(b===x)break}return slot}
function beispiel(s,x){const st=stOf(s);if(st.played[x.key]||beschaeftigt())return;st.played[x.key]=1;st.taps++;
  const h=neueHuelle(x.id,x.label,x.lad,beispielPlatz(s,x));
  spaeter(0.6,()=>{for(let i=0;i<x.n;i++)faden(h);
    spaeter(1.05,()=>{if(x.n>=FEST){festMachen(h);spaeter(1.1,()=>{say(x.cap);syncNav()})}else{say(x.cap);syncNav()}})})}
function beispielFertig(s,x){const h=S.h[x.id]||neueHuelle(x.id,x.label,x.lad,beispielPlatz(s,x));h.a=1;
  while(h.threads.length<x.n)faden(h);if(x.n>=FEST){h.fest=true;h.festK=1}}
// der Stand der Hüllen, ohne alles, was gerade läuft
const kopie=o=>JSON.parse(JSON.stringify(o));
function frisch(h){delete h.genaehrt;h.pulse=0;if(h.fest)h.festK=1;if(!h.fort)h.a=1;h.wartet=false;
  h.threads=h.threads.filter(f=>!f.weg);h.threads.forEach(f=>{f.t=1;f.age=9;delete f.bringt;delete f.out});return h}
// data-merken: beim Betreten von vorn merkt sich der Schritt den Stand. Kommt man zurück oder sieht ihn nochmal an, steht die Bühne wieder so.
function standMerken(s,prev){const i=SLIDES.indexOf(s),st=stOf(s);
  if(s.merken){
    if(prev===i-1||!st.stand){st.stand=kopie(S.h);st.standC=kopie(S.c);st.standS=kopie(S.steg)}
    else{S.h=kopie(st.stand);Object.values(S.h).forEach(frisch);S.c=kopie(st.standC||[]);S.steg=kopie(st.standS||[])}
    st.played={};st.taps=0;st.fort=0;st.los=false;st.gelandet=false;st.fadenPlus=false}   // der Schritt läuft jedes Mal von vorn
  // rückwärts in einen Schritt davor: die Bühne steht wie beim Verlassen dieses Schritts
  else if(prev>i){const n=SLIDES[i+1],sn=n&&n.merken&&S.st[n.id]&&S.st[n.id].stand;if(sn){S.h=kopie(sn);Object.values(S.h).forEach(frisch);S.c=kopie(S.st[n.id].standC||[]);S.steg=kopie(S.st[n.id].standS||[])}}}
const standVergessen=()=>Object.values(S.st).forEach(st=>{delete st.stand;delete st.standC;delete st.standS});
