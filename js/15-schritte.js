/* ================= Schritte abspielen =================
   Fast alles ergibt sich aus dem Drehbuch. Nur was dort nicht beschreibbar ist, steht unter EIGEN. */
function freeze(){const s=SLIDES[cur];if(S.frozen)return;S.frozen=true;S.freezeAt=time;knots();
  say(satzVon(s,'grundstimmung').replace('{stimmung}',mood(S.level)))}
const EIGEN={
  l4:{action:{run:freeze,off:()=>S.frozen},done:()=>S.frozen},
  ende:{enter(){S.frozen=true;S.freezeAt=-9;knots()}},
  k5:{enter(){S.c.forEach(c=>c.pulse=1)}}
};

// Die Bühne so hinstellen, wie das vorige Kapitel sie hinterlässt (für Sprünge in ein Kapitel mit data-start="vorher")
// eine Adresse ohne Animation vergeben (für übersprungene Schritte)
function sofortAdresse(a){S.p=S.p.filter(q=>{if(q.to||!a.von.includes(q.von))return true;
  ensureCarrier(a.id,a.name).charges.push({s:q.sign,big:q.big});return false})}
function vorher(s){standVergessen();S.steg=[];S.p=[];S.m=[];S.c=[];S.e=[];S.q=[];S.h={};S.kick=0;S.frozen=false;const einmal=new Set();
  // alle Schritte davor der Reihe nach, wie beim Durchgehen: ein Schritt mit data-start="leer" leert auch hier
  SLIDES.slice(0,SLIDES.indexOf(s)).forEach(x=>{
    if(x.leer){S.p=[];S.c=[];einmal.clear()}
    if(x.wahl.length){const m=MOM[x.auto[0]],w=x.wahl[0];if(m&&m.sign)ensureCarrier(w.id,w.carrier).charges.push({s:m.sign,big:m.big})}
    else{[...x.auto,...x.folge].forEach(id=>applyNow(MOM[id]));
      x.knoepfe.forEach(id=>{if(!einmal.has(id)){einmal.add(id);applyNow(MOM[id])}})}   // jeder Knopf gilt als einmal getippt
    x.adressen.forEach(sofortAdresse)});
  settle();S.level=target()}

/* ---------- Bindung: der Ring ----------
   Die benannten Ladungsträger wandern aus dem Speicher und stehen als Hüllen im Ring um ihn. Die breitesten oben und unten,
   die schmalen an den Seiten. Der Speicher in der Mitte wird dann zum Männchen „du“. */
const RING=[120,60,240,300,180,0,150,30,210,330];   // Plätze im Ring, in Grad
const FIG_R=14,figY=()=>H/2,kreisR=()=>Math.min(R0*0.72,60);
const ringPlatz=(slot,h)=>{const a=RING[slot%RING.length]*Math.PI/180,rx=Math.min(W/2-60,200),ry=Math.min((H/2-34)/0.866,190);let x=cx+rx*Math.cos(a);
  // die beiden oberen und die beiden unteren Hüllen rücken so weit auseinander, wie ihre Breite es verlangt
  if(h&&slot<4){const w=huelleMass(h),nachbar=Object.values(S.h).filter(o=>o!==h&&o.slot===(slot^1)),p=nachbar.find(o=>!o.fort)||nachbar[0],wp=p?huelleMass(p):w;
    const off=Math.min(Math.max(rx*0.5,(w+wp)/4+9),Math.max(rx*0.5,W/2-4-w/2));x=cx+(Math.cos(a)<0?-off:off)}
  return [x,H/2-ry*Math.sin(a)]};
const huellenListe=s=>(s.alleHuellen?Object.values(S.h):s.huellen.map(x=>S.h[x.id]).filter(Boolean)).filter(h=>!h.fort&&!h.drin).sort((a,b)=>a.slot-b.slot);
// Platz für eine neue Hülle: oben oder unten, wo auch der Platz daneben frei ist, sonst der erste freie
function freierPlatz(voll){voll=voll||new Set(Object.values(S.h).filter(h=>!h.fort).map(h=>h.slot));
  for(const i of [0,1,2,3])if(!voll.has(i)&&!voll.has(i^1))return i;
  for(let i=0;i<RING.length;i++)if(!voll.has(i))return i;return 0}
function huelleMass(h){ctx.font='italic 16px '+C.serif;h.tw=h.label?ctx.measureText(h.label).width:0;
  h.bw=Math.max(h.charges.length?0:20,h.charges.reduce((a,ch)=>a+(ch.big?17:13),0))+10;const g=h.tw?8:0;
  h.x0=h.x-(h.tw+g+h.bw)/2;h.bx=h.x0+h.tw+g;h.ax=h.bx+h.bw/2;return h.tw+g+h.bw}
function hinaus(c,slot){S.c=S.c.filter(x=>x!==c);
  S.h[c.id]={id:c.id,label:c.label,charges:c.charges.map(ch=>({s:ch.s,big:ch.big})),threads:[],a:1,pulse:1,tap:0,x:c.x,y:c.y,slot,ausC:true}}
function alleHinaus(){(S.aus?S.aus.order:[]).forEach((c,i)=>{if(S.c.includes(c)){hinaus(c,i);const p=ringPlatz(i);S.h[c.id].x=p[0];S.h[c.id].y=p[1]}});if(S.aus)S.aus.n=S.aus.order.length}
// zurück in einen Speicher-Schritt: die Hüllen sind wieder Ladungsträger im Speicher
function zurueckHinein(){Object.values(S.h).filter(h=>h.ausC).sort((a,b)=>a.slot-b.slot).forEach(h=>{const c=ensureCarrier(h.id,h.label);c.charges=h.charges;c.a=1});S.h={};standVergessen()}
const AUS_T0=0.9,AUS_DT=1.15;   // erst tritt die Zeitlinie zurück, dann geht alle AUS_DT Sekunden ein Ladungsträger hinaus
const figurK=s=>ease((Math.min(1,S.fig/s.dauer)-0.06)/0.88);
// wie weit ein Übergang am Anfang eines Speicher-Schritts ist (Dreieck oder Linie)
const introK=s=>{const tA=s.dauer*0.25;return ease((S.intro-tA)/(s.dauer-0.4-tA))};

/* ---------- Linie: der Gang des Männchens ----------
   Wo es herkommt und was es in sich trägt, ergibt sich aus den Linien-Schritten davor. So stimmt jeder Schritt, auch nach einem Sprung. */
function linieVor(s){let ch=0,ort=null,story=false;
  for(const x of SLIDES){if(x===s)break;if(x.scene!=='linie')continue;if(x.trifft)ch=x.trifft;if(x.wird)ch=x.wird;ort=x.ort;if(x.geschichte)story=true}
  return {ch,ort,story}}
function linieStart(s){const v=linieVor(s),tF=s.klappen?s.dauer:0,walk=v.ort&&v.ort!==s.ort?1.9:0,ta=tF+(v.ort?0.2:0.8)+walk;
  // tF: Klappen fertig (danach Text und Lesepause) · ta: angekommen · tb: die Zeile unter dem Männchen erscheint
  // tc: der Satz unter der Bühne · td: Schritt erledigt. Nichts davon fällt zusammen.
  const tb=ta+(s.trifft?2.6:s.wird?1.8:s.geschichte?1.2:0.3),tc=tb+(s.gruebeln?1.9*s.blasen.length+0.95:1.3);
  S.g={t:reduce?1e3:0,from:v.ort||s.ort,ch0:v.ch,neu:!v.ort,story0:v.story,tF,walk,ta,tb,tc,td:tc+0.5,said:false,text:false}}

function enterStep(s,prev){
  if(s.leer)resetAll();
  else if(s.vorher&&prev!==SLIDES.indexOf(s)-1)vorher(s);
  else if(s.scene==='speicher'&&!s.figur&&!s.mann&&Object.keys(S.h).length)zurueckHinein();
  // data-huellen="eigene": nur die Hüllen dieses Blocks stehen im Ring. Was vorher dort stand, liegt so lange beiseite (finish holt es zurück).
  if(s.eigeneHuellen){S.hAlt=S.hAlt||S.h;S.h={};Object.assign(stOf(s),{taps:0,fort:0,los:false,bereit:false})}
  standMerken(s,prev);S.ev=[];S.vbI=0;
  S.ich=s.ich?{t:reduce?9:0,said:false}:null;S.warte=0;
  // du auf der Zeitlinie: die Bühne beginnt ohne Momente. Der Türrahmen kommt von rechts.
  S.band=null;S.pad=null;if(s.mann){S.m=[];S.q=[];S.e=[]}
  S.gang=s.tuer?{ph:'geht',art:s.gast,x:W+24,stop:cx+RM*1.9+3,v:0,bx:0}:null;if(S.gang)S.gang.v=reduce?1e5:(S.gang.x-S.gang.stop)/2.6;
  if(s.ein){const order=Object.values(S.h).filter(h=>!h.fort).sort((a,b)=>a.slot-b.slot).map(h=>h.id);S.c.forEach(c=>{if(!order.includes(c.id))order.push(c.id)});
    S.ein={T:0,order,said:false,kB:0};const P=einPlan();S.ein.T=s.ein>0?(reduce?P.max:0):(reduce?0:P.max);S.ein.kB=s.ein>0?0:1}
  else S.ein=null;
  // Übergang zum Steg: die Glieder sind die verbundenen Ladungsträger im Speicher (fehlen sie, die des nächsten Schritts)
  if(s.zumSteg){const ids=stegKette().filter(id=>carrier(id)),n=SLIDES[SLIDES.indexOf(s)+1];
    S.zs={T:reduce?9:0,said:false,els:ids.length>1?ids.map(id=>{const c=carrier(id);return {id,label:c.label,charges:c.charges.map(ch=>({s:ch.s,big:ch.big}))}})
      :(n?n.glieder:[]).map(g=>({id:g.id,label:g.label,charges:zeichen(g.lad)}))}}
  else S.zs=null;
  if(s.scene==='zwei')zweiStart(s,prev);else S.zw=null;
  if(s.scene==='arbeit')arbeitStart(s);else S.ar=null;
  if(s.scene==='grob')grobStart(s);else S.gb=null;
  if(s.scene==='strom')stromStart(s,prev);else S.sr=null;
  if(s.scene==='film')filmStart(s);else S.fi=null;
  if(s.scene==='spitze')spitzeStart(s);else S.sp=null;
  if(s.scene==='schloss')schlossStart(s);else S.sk=null;
  if(s.scene==='drehen')drehenStart(s);else S.dr=null;
  if(s.scene==='sicht')sichtStart(s);else S.si=null;
  S.sg=s.scene==='steg'?{els:s.glieder.map(g=>({id:g.id,label:g.label,charges:zeichen(g.lad),d:0,v:0})),pos:[],neu:null}:null;
  // das neue Element: war der Schritt schon dran, steht es wieder so da, wie man es verlassen hat
  if(S.sg&&s.neu){const aus=stOf(s).aus,an=aus==='an'?1:0;
    S.sg.neu={el:{id:s.neu.id,label:s.neu.label,charges:zeichen(s.neu.lad),d:0,v:0},ph:an?'dran':aus==='frei'?'weg':'fern',t:0,k:an,kv:an,ziel:null,auto:false}}
  if(s.hinaus)S.aus={t:reduce?1e3:0,n:0,order:[...S.c].sort((a,b)=>huelleMass({x:0,label:b.label,charges:b.charges})-huelleMass({x:0,label:a.label,charges:a.charges}))};
  if(s.scene==='linie')linieStart(s);
  if(s.figur){S.fig=reduce?s.dauer:0;S.figSaid=false}
  if(s.vorfuehren)vorStart(s,false);
  S.du={x:0,y:0,vx:0,vy:0,tint:0};S.vb=0;
  S.frozen=false;const st=stOf(s);
  if(s.foto){S.frozen=true;S.freezeAt=-9;knots()}
  S.geloest=false;S.losT=0;
  if(s.rahmen){S.fotoName=s.rahmen;S.fotoP=s.rahmenAnim&&!reduce?0:1;S.fotoSaid=!s.rahmenAnim;
    if(s.rahmenAnim&&reduce){S.fotoSaid=true;say(satzVon(s,'an'))}}
  // eine neue Hülle erscheint erst nach der Lesepause
  s.huellen.forEach((h,i)=>{if(!S.h[h.id]){const slot=s.alleHuellen?freierPlatz():h.platz!==''?+h.platz:i,p=ringPlatz(slot);
    S.h[h.id]={id:h.id,label:h.label,charges:zeichen(h.lad),threads:[],a:reduce?1:0,pulse:0,tap:0,x:p[0],y:p[1],slot,zw:h.zw,wartet:true,neuT:0}}});
  // data-wieder: die Hülle steht wieder da, so wie sie vor dem vorigen Schritt stand
  if(s.wieder){let sn=null;for(let j=SLIDES.indexOf(s)-1;j>=0&&!sn;j--){const v=S.st[SLIDES[j].id],k=v&&v.stand&&v.stand[s.wieder];if(k&&!k.fort)sn=k}
    if(sn){const h=frisch(kopie(sn));h.a=reduce?1:0;h.wartet=true;h.threads.forEach(f=>f.age=0);S.h[s.wieder]=h}}
  // data-zeigen: nach der Lesepause leuchtet die Hülle kurz auf, dann kommt der Satz
  if(s.zeigen){st.gezeigt=false;spaeter(0.4,()=>{const h=S.h[s.zeigen];if(h)h.pulse=1});
    spaeter(1.5,()=>{const c=satzVon(s,'an');if(c)say(c);st.gezeigt=true;syncNav()})}
  // Hüllen mit data-faeden: sie kommen eine nach der anderen, ihre Fäden ziehen sich von selbst
  const selbst=s.huellen.some(h=>h.n);if(selbst)selbstStart(s);
  if(s.verblassen&&reduce&&!selbst)verblassenFertig(s);
  if(s.fold||s.vonlinie){S.intro=reduce?s.dauer:0;S.introLive=false}          // der Moment startet nach dem Übergang
  else if(s.wahl.length){if(!S.m.some(m=>m.hold)&&!(st.chosen&&s.wahl.length===1)){st.played[s.auto[0]]=1;S.q.push(s.auto[0])}}
  else s.auto.forEach(id=>{if(!st.played[id]){st.played[id]=1;S.q.push(id)}});
  if(EIGEN[s.id]&&EIGEN[s.id].enter)EIGEN[s.id].enter(s,st);
}
function done(s){const st=stOf(s),eg=EIGEN[s.id];
  if(eg&&eg.done)return eg.done(s,st);
  if(s.figur)return reduce||S.fig>=s.dauer;
  if(s.ein)return !!S.ein&&S.ein.said;
  if(s.zumSteg)return !!S.zs&&S.zs.said;
  if(s.scene==='arbeit')return !!S.ar&&S.ar.fertig;
  if(s.scene==='strom')return !!st.gerichtet;
  if(s.scene==='film')return !!S.fi&&S.fi.fertig;
  if(s.scene==='spitze')return !!S.sp&&S.sp.fertig;
  if(s.scene==='schloss')return !!st.offen;
  if(s.scene==='drehen')return !!st.gedreht;
  if(s.scene==='sicht')return !!st.verschoben;
  if(s.scene==='grob')return !!S.gb&&S.gb.fertig&&(!s.wechsel||!!st.gewechselt)&&(!s.ebenen.length||!!st.unten)&&(!s.eingriffe.length||Object.keys(st.eing||{}).length>0)&&(!s.nimmt.length||Object.keys(st.nimmt||{}).length>0);
  if(s.scene==='zwei')return !!S.zw&&S.zw.fertig&&(!s.kanal||Object.keys(st.kanal||{}).length>0);
  if(s.scene==='steg')return s.neu?!!st.gesehen:st.taps>=1;
  if(s.tuer)return !!st.gelandet&&!!S.gang&&S.gang.ph==='fertig';
  if(s.ich)return !!S.ich&&S.ich.said;
  if(s.hinaus)return !!S.aus&&S.aus.n>=S.aus.order.length&&S.aus.t>=AUS_T0+S.aus.order.length*AUS_DT+0.5;
  if(s.rahmenAnim)return S.fotoP>=1;
  if(s.loesen)return S.geloest&&(reduce||S.losT>2.8);
  if(s.adressen.length)return s.adressen.every(a=>st.played[a.key]);
  if(s.scene==='linie')return !!S.g&&S.g.t>=S.g.td;
  if(s.wahl.length)return st.chosen;
  if(s.folge.length)return s.folge.every(id=>st.played[id])&&idle();
  if(s.knoepfe.length)return s.fertig?st.taps>=s.fertig:s.knoepfe.every(id=>st.played[id]);
  if(s.auto.length)return s.auto.every(id=>st.played[id])&&idle();
  if(s.vorfuehren)return st.taps>=(s.fertig||1);
  if(s.ueben){const h=S.h[s.ueben];return !!h&&s.tage.every(x=>st.played[x.key])&&!beschaeftigt()&&(!satzVon(s,'fest')||!!h.fest)}
  if(s.beispiele.length)return s.beispiele.every(x=>st.played[x.key])&&!beschaeftigt();
  if(s.zeigen)return !!st.gezeigt;
  if(s.verblassen)return reduce||!huellenListe(s).some(h=>!h.fest);
  if(s.huellen.length)return s.huellen.every(x=>S.h[x.id]&&S.h[x.id].neuSaid);
  if(s.schrift.length||s.faden.length)return s.fertig?st.taps>=s.fertig:[...s.schrift,...s.faden].every(x=>st.played[x.key]);
  return true;
}
// Schritt verlassen: was noch läuft oder fehlt, wird sofort gesetzt. So stimmen die folgenden Schritte immer.
function finish(s){const st=stOf(s);
  // der Ring, wie er beim Verlassen stand: damit beginnt ein Schritt mit data-uebergang="ring"
  if(s.eigeneHuellen)S.ringEnde=Object.values(S.h).filter(h=>!h.fort&&!h.spaet&&h.a>0.02).map(kopie);
  // ein Gedanke, der noch unterwegs ist, gilt als zu Ende gedacht
  if(s.neu&&S.sg&&S.sg.neu&&S.sg.neu.ziel){st.aus=S.sg.neu.ziel.an?'an':'frei';st.gesehen=true}
  if(s.hinaus)alleHinaus();
  // Fäden, die niemand gesponnen hat: die vorgeführten werden trotzdem gezogen, jeder Faden-Knopf gilt als einmal getippt
  if(s.vorfuehren&&!st.vorGesehen){const hs=huellenListe(s),n=Math.min(s.vorfuehren,hs.length);for(let i=S.vor?S.vor.n:0;i<n;i++)faden(hs[i]);
    st.vorGesehen=true;if(S.vor)S.vor.aktiv=false}
  s.faden.forEach(x=>{const h=S.h[x.huelle];if(h&&!st.played[x.key]){st.played[x.key]=1;(x.sinne.length?x.sinne:['']).forEach((_,li,all)=>faden(h,'',li,all.length))}});
  // Bindung: was noch läuft, ist sofort fertig. Neue Hüllen stehen, alle Tage sind geübt, die Zeit ist vergangen.
  S.ev=[];
  // Übergang zwischen Ring und Zeitlinie: am Ende stehen alle Hüllen drin (hinein) oder wieder im Ring (heraus)
  if(s.ein&&S.ein){S.ein.T=s.ein>0?einPlan().max:0;S.ein.said=true;
    S.ein.order.forEach(id=>{const h=S.h[id];if(s.ein>0){if(h&&!h.drin)hinein(h)}else if(!h||h.drin)heraus(id)});
    if(s.ein<0)Object.values(S.h).forEach(h=>{if(!h.fort&&!h.drin){const p=ringPlatz(h.slot||0,h);h.x=p[0];h.y=p[1]}})}
  // der Türrahmen-Moment: das Minus liegt beim Träger, ein Faden ist dazugekommen
  if(s.tuer){const m=MOM[s.tuer];if(!st.played[s.tuer]){st.played[s.tuer]=1;applyNow(m)}
    if(satzVon(s,'faden')&&!st.fadenPlus){st.fadenPlus=true;const h=S.h[m.addr];if(h&&!h.fort)faden(h)}st.gelandet=true;S.band=null}
  s.huellen.forEach(x=>{const h=S.h[x.id];if(h){h.a=1;h.wartet=false;h.neuT=99;h.neuSaid=true;if(h.zw)h.zwK=1}});
  if(s.ueben&&S.h[s.ueben]){const h=S.h[s.ueben];h.a=1;h.wartet=false;
    h.threads.forEach(f=>{if(f.bringt){h.charges.push({s:f.bringt.s});f.bringt=null}});
    s.tage.forEach(x=>{if(!st.played[x.key]){st.played[x.key]=1;faden(h);h.charges.push({s:x.sign})}});
    if(satzVon(s,'fest')&&lebt(h)>=FEST){h.fest=true;h.festK=1}}
  if(s.verblassen)verblassenFertig(s);
  s.beispiele.forEach(x=>{st.played[x.key]=1;beispielFertig(s,x)});   // nicht getippte Beispiele stehen trotzdem da
  if((s.fold||s.vonlinie)&&!S.introLive)introFertig(s);
  settle();
  // ein Moment, der noch auf eine Wahl wartet, verfällt ohne Wirkung
  S.m.forEach(m=>{if(m.out||steht(m))return;const offen=m.hold,n=m.lines.length;m.out=true;m.past=true;m.hold=false;m.ph=n;m.age=(n+9)*m.dur;if(!offen)applyNow(m)});
  S.q.forEach(id=>applyNow(MOM[id]));S.q=[];
  [...s.auto,...s.folge].forEach(id=>{if(!st.played[id]){st.played[id]=1;applyNow(MOM[id])}});
  if(!s.fertig)s.knoepfe.forEach(id=>{if(!st.played[id]){st.played[id]=1;applyNow(MOM[id])}});   // nicht getippte Knöpfe gelten als einmal getippt
  settle();
  // nicht vergebene Adressen werden vergeben, bei einer nicht getroffenen Wahl gilt die erste Adresse
  s.adressen.forEach(a=>{if(!st.played[a.key]){st.played[a.key]=1;sofortAdresse(a)}});
  if(s.wahl.length&&!st.chosen&&!st.picked){const m=MOM[s.auto[0]],w=s.wahl[0];
    if(m&&m.sign){ensureCarrier(w.id,w.carrier).charges.push({s:m.sign,big:m.big});st.chosen=true}}
  settle();if(s.steg.length===2)stegFertig(s);S.level=target();
  if(s.eigeneHuellen&&S.hAlt){S.h=S.hAlt;S.hAlt=null}
}
function tapMoment(s,id){const st=stOf(s);st.played[id]=1;st.taps++;openMoment(MOM[id])}
function nextInFolge(s){const st=stOf(s);
  if(s.kette){s.folge.forEach(id=>{if(!st.played[id]){st.played[id]=1;S.q.push(id)}});return}
  if(busy()||!landed())return;const id=s.folge.find(id=>!st.played[id]);if(id){st.played[id]=1;openMoment(MOM[id])}}
function waehlen(s,a){const m=holding(),st=stOf(s);if(!m)return;
  m.lines=m.lines.concat([{text:a.line,tag:T('denken').toUpperCase(),dot:'left'}]);m.age=(m.lines.length-1)*m.dur;m.hold=false;
  m.addr=a.id;m.addrLabel=a.carrier;m.capDrop=a.cap;
  // danach stößt man sich erneut und kann eine andere Adresse probieren
  st.picked=true;
  m.onDrop=()=>{st.chosen=true;if(s.wahl.length>1)later(2600,()=>{if(SLIDES[cur]===s&&!S.m.some(x=>x.hold))openMoment(MOM[s.auto[0]])})}}
