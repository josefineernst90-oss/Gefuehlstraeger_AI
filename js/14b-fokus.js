/* ---------- Bühne „fokus“: du auf der Zeitlinie, darunter dein Stimmungsspeicher. Ein Moment öffnet sich unter deinen Füßen. ----------
   Das Bild vom Türrahmen im Kapitel Bindung, mit eigenem Stand: was im Speicher liegt, ergibt sich aus dem Schritt in data-stand
   (Bühne „zwei“: die Träger der unteren Bahn · Bühne „fokus“: sein Stand und alles, was seine Momente bewirken).
   Die Momente stehen als <div class="moment"> im Block, wie auf der Speicher-Bühne. Ohne data-knopf laufen sie von selbst, mit data-knopf nach dem Tipp. */
const FK_LOSE=[[-0.66,-0.26],[0.68,-0.3],[-0.62,0.3],[0.64,0.28]];   // Plätze für lose Ladungen, in Speicher-Radien
function fokusWirkt(q,sp){if(!sp||!sp.sign)return;const ch={s:sp.sign,big:sp.big};
  if(!sp.addr){q.lose.push(ch);return}
  let c=q.c.find(x=>x.id===sp.addr);if(!c){c={id:sp.addr,label:sp.addrLabel||sp.addr,charges:[]};q.c.push(c)}c.charges.push(ch)}
function fokusStand(s){const v=SLIDES.find(x=>x.id===s.stand&&x!==s),q={c:[],lose:[],schild:''};
  if(v&&v.scene==='zwei'){const Z=zweiBau(v);Z.plan.forEach(p=>{if(p.ende)return;if(p.start)p.start();if(p.run)p.run(1)});
    q.c=Z.B.aktiv.els.filter(Boolean).map(e=>({id:e.id,label:e.label,charges:e.charges.map(ch=>({s:ch.s,big:ch.big}))}))}
  else if(v&&v.scene==='fokus'){const p=fokusStand(v);q.c=p.c;q.lose=p.lose;q.kette=p.kette;q.schild=v.geht?'':v.zeichenText||p.schild;
    const K=q.kette,tr=id=>q.c.find(x=>x.id===id);
    // data-akt: was der Schritt am Ende im Speicher bewirkt hat (siehe die Abläufe weiter unten)
    if(v.akt==='stau'){q.kette={mom:v.momente[0],dann:v.momente[1],schild:v.zeichenText,schild2:v.dahinter};q.stauAn=true}
    else if(v.akt==='hebel')q.stauAn=true;
    else if(v.akt==='rutscht'&&K){const c=tr(MOM[K.dann].addr);if(c)c.charges.push({s:MOM[K.dann].sign},{s:MOM[K.mom].sign});q.schild=''}
    else if(v.akt==='name'){const c=tr(v.ausTraeger);if(c&&c.charges.length)q.c.push({id:'neu',label:v.namen[(S.st[v.id]||{}).nameI||0],charges:[c.charges.pop()]});q.schild=''}
    else if(v.akt==='wieder'&&K){const a=tr('neu'),b=tr(MOM[K.dann].addr);if(a)a.charges.push({s:MOM[K.mom].sign});if(b)b.charges.push({s:MOM[K.dann].sign});q.schild=''}
    else{v.alte.forEach(a=>q.c.push({id:a.id,label:a.label,charges:zeichen(a.lad)}));v.momente.forEach(id=>fokusWirkt(q,MOM[id]))}}
  return q}
function fokusPegel(F){let p=0,n=0;const z=ch=>{const w=ch.big?2:1;ch.s>0?p+=w:n+=w};F.c.forEach(c=>c.charges.forEach(z));F.lose.forEach(z);return (p-n)/(p+n+5)}
const fkX0=()=>cx+RM*1.9+3,FK_AB=62;   // hier bleibt ein Zeichen neben dir stehen · so weit dahinter wartet das nächste
function fokusStart(s,prev){const st=stOf(s),q=fokusStand(s),i=SLIDES.indexOf(s),v=SLIDES[i-1];st.fk={};st.wege={};st.name=0;
  const F=S.fk={c:q.c.map(c=>({id:c.id,label:c.label,charges:c.charges,a:1,y:null})),lose:q.lose,lv:0,M:null,fall:null,echo:null,gl:[],weg:0,w0:0,geht:false,
    plan:[],i:0,t:0,fertig:false,laeuft:false,ue:null,pk:null,wort:null,puff:0,rutsch:null,zug:null,textSpaeter:false,cs:24,
    kette:s.akt==='stau'?{mom:s.momente[0],dann:s.momente[1],schild:s.zeichenText,schild2:s.dahinter}:q.kette||null};
  F.lv=fokusPegel(F);
  const add=(dur,run,start)=>F.plan.push({dur,run,start});
  if(s.vomWasser&&!reduce&&prev===i-1&&v&&v.scene==='zwei')fokusUebergang(s,v,F,add);
  else if(q.stauAn&&F.kette)fkStau(F);
  else if(q.schild)F.gl.push({x:fkX0(),al:1,e:{art:'wort',schild:q.schild}});
  if(s.akt==='stau')fkAktStau(F,add,prev===i-1&&!reduce);
  else if(s.akt==='rutscht')fkAktRutscht(F,add);
  else if(s.akt==='wieder')fkAktWieder(F,add);
  else if(!s.akt){
    // die Zeit läuft: das alte Zeichen wandert nach links hinaus, das Zeichen dieses Schritts (data-kommt) kommt von rechts
    if(s.zeichenText)fkGeh(F,add,1.5,()=>W+30-fkX0(),{x:0,al:1,e:{art:'wort',schild:s.zeichenText}});else if(s.geht)fkGeh(F,add,1.5,()=>W+30-fkX0(),null);
    // was von früher im Speicher liegt (<p class="traeger">), erscheint dort
    s.alte.forEach(a=>{let c=null;add(0.6,k=>c.a=k,()=>{c={id:a.id,label:a.label,charges:zeichen(a.lad),a:0,y:null};F.c.push(c)});add(0.7)});
    s.momente.filter(id=>!MOM[id].knopf).forEach(id=>fokusMoment(F,MOM[id],add))}
  add(0,null,()=>{F.fertig=true;F.c0=F.c.map(c=>({...c,charges:c.charges.slice()}));F.lose0=F.lose.slice();
    if(s.akt&&s.akt!=='hebel'&&s.akt!=='name'&&satzVon(s,'an'))say(satzVon(s,'an'));syncNav()})}
// du gehst weiter: alle Zeichen wandern um dist nach links, die Zeitlinie läuft unter dir durch. Was dabei an dir vorbeikommt, verblasst.
// neu (optional) kommt so von rechts, dass es am Ende neben dir steht. Liegen Punkte auf der Zeitlinie, wandern sie mit.
function fkGeh(F,add,dur,dist,neu){let D=0,s0=0;
  add(dur,k=>{const d=D*k;F.gl.forEach(g=>{g.x=g.x0-d;if(g.x0-D<fkX0()-1)g.al=g.al0*(1-ease(k/0.7))});F.weg=F.w0+d;if(F.pk)F.pk.shift=s0+d;
      if(k>=1){F.geht=false;F.gl=F.gl.filter(g=>g.al>0.01)}},
    ()=>{D=dist();if(neu){neu.x=fkX0()+D;F.gl.push(neu)}F.gl.forEach(g=>{g.x0=g.x;g.al0=g.al});F.w0=F.weg;s0=F.pk?F.pk.shift:0;F.geht=true})}
/* ---------- Überschuss: der Stau ----------
   Unter deinen Füßen kann immer nur ein Moment offen sein. Der erste Moment des Blocks (z.B. der Anruf) belegt ihn, sein Zeichen steht neben dir.
   Dahinter wartet das Zeichen aus data-dahinter (zu ihm gehört der zweite Moment des Blocks). Rechts davon sind aus den Strichen der Zeitlinie
   Punkte geworden: jeder zählt wie ein eigenes Zeichen. Sie schieben sich vor dir zusammen.
   F.pk: a = wie weit die Striche Punkte sind · k = wie weit sie sich gestaut haben · front = bis hierhin sind sie abgearbeitet · shift = so weit sind sie gewandert */
function fkPunkte(k){const u0=fkX0()+10,xs=[];let c=fkX0()+7,ab=7;for(let i=0;i<70;i++){const u=u0+i*14;xs.push(lerp(u,c,k));c+=ab;ab=Math.min(15,ab*1.09)}return xs}
function fkStau(F){const K=F.kette,sp=MOM[K.mom],ln=sp.lines[0],x0=fkX0();
  F.gl=[{x:x0,al:1,e:{art:'wort',schild:K.schild}},{x:x0+FK_AB,al:1,e:{art:'wort',schild:K.schild2}}];
  F.pk={a:1,k:1,front:0,shift:0};F.wort=null;F.puff=0;F.fall=null;F.rutsch=null;
  F.M={w:halfWidth(ln.text),pa:1,text:ln.text,tag:ln.tag,ta:1,ds:0.8,dx:1,sign:sp.sign,big:false}}
// data-akt="stau": der Stau entsteht. Kommt man direkt aus dem Schritt davor, gehen zuerst die Platten noch einmal auf und bleiben offen
// (die Auflösung bleibt oben), erst dann kommt der Text. Dann: das Zeichen kommt · der Moment nimmt es auf · das nächste kommt und muss warten ·
// aus den Strichen werden Punkte · sie schieben sich vor dir zusammen. Danach .satz data-id="an".
function fkAktStau(F,add,weich){const K=F.kette,sp=MOM[K.mom],ln=sp.lines[0],leer=()=>({w:0,pa:0,text:'',tag:null,ta:0,ds:0,dx:1,sign:sp.sign,big:false});
  if(weich){F.textSpaeter=true;add(0.4);add(0.9,k=>{F.M.pa=k;F.M.w=92*ease(k)},()=>{F.M=leer()});add(0.5);
    add(0,null,()=>{F.textSpaeter=false;$('text').classList.remove('warte');S.lese=lesezeit()})}
  else{F.M=leer();F.M.w=92;F.M.pa=1}
  fkGeh(F,add,1.5,()=>W+30-fkX0(),{x:0,al:1,e:{art:'wort',schild:K.schild}});
  let w0=0;add(0.45,k=>{F.M.w=lerp(w0,halfWidth(ln.text),k);F.M.ta=k;F.M.ds=0.8*k},()=>{w0=F.M.w;F.M.text=ln.text;F.M.tag=ln.tag});
  add(0.9);
  const n2={x:0,al:1,e:{art:'wort',schild:K.schild2}};
  add(1.1,k=>n2.x=lerp(W+30,fkX0()+FK_AB,ease(k)),()=>{n2.x=W+30;F.gl.push(n2)});
  add(0.9);
  add(0.9,k=>F.pk.a=k,()=>{F.pk={a:0,k:0,front:0,shift:0}});
  add(1.8,k=>F.pk.k=ease(k));
  add(0.4)}
// der offene Moment wird fertig: die Zeile geht, die Platten schließen sich um die Ladung, sie fällt (lose = ohne Adresse)
function fkSchluss(F,sp,add,lose){let w1=0;
  add(0.3,k=>{F.M.ta=Math.min(F.M.ta,1-k)});
  add(0.55,k=>{F.M.w=lerp(w1,CLOSED,k);F.M.dx=1-k},()=>{w1=F.M.w;F.M.text=''});
  add(0.25);fkFall(F,sp,add,lose)}
function fkFall(F,sp,add,lose,adr){
  add(0.9,k=>{F.fall.k=k;F.M.pa=1-ease(k/0.5);const c=F.fall.c;if(c&&c.a<1)c.a=Math.max(c.a,k)},
    ()=>{const id=adr||sp.addr;let c=!lose&&id?F.c.find(x=>x.id===id):null;if(!lose&&id&&!c){c={id,label:sp.addrLabel||id,charges:[],a:0,y:null};F.c.push(c)}
      F.fall={k:0,sign:sp.sign,big:sp.big,c,j:F.lose.length,s0:F.M.ds};F.M.ds=0});
  add(0.2,null,()=>{const f=F.fall,ch={s:sp.sign,big:sp.big};if(f.c)f.c.charges.push(ch);else F.lose.push(ch);F.fall=null;F.M=null})}
// das wartende Zeichen ist dran: du gehst das Stück weiter, der Moment öffnet sich mit seiner Zeile
function fkNach(F,sp,add){const ln=sp.lines[0];fkGeh(F,add,0.9,()=>FK_AB,null);
  add(0.35,k=>{F.M.pa=k;F.M.w=CLOSED*k},()=>{F.M={w:0,pa:0,text:'',tag:null,ta:0,ds:0,dx:1,sign:sp.sign,big:sp.big}});
  add(0.4,k=>{F.M.w=lerp(CLOSED,halfWidth(ln.text),k);F.M.ta=k;F.M.ds=0.8*k},()=>{F.M.text=ln.text;F.M.tag=ln.tag})}
// data-akt="hebel": der Stau steht. Je <p class="weg" data-id="drosseln|schlaf|druck" data-knopf data-sagt> ein Knopf, jeder Tipp beginnt wieder beim Stau.
//   drosseln   die Punkte rücken auseinander und werden wieder Striche · der Moment wird fertig, seine Ladung fällt an ihre Adresse · das wartende Zeichen ist dran
//   schlaf     data-sagt steht über der Zeitlinie · der Moment wird fertig · das wartende Zeichen ist dran und wird auch fertig · die Punkte werden einer nach dem anderen abgearbeitet
//   druck      alles verpufft, im Speicher kommt nichts an · data-sagt steht über der Zeitlinie · derselbe Stau steht wieder da
// Der Text des .weg steht danach unter der Bühne, nach allen dreien kommt .satz data-id="alle" dazu.
function fokusWeg(s,w){const F=S.fk,st=stOf(s);if(!F||!F.fertig||F.laeuft)return;const K=F.kette;
  F.c=F.c0.map(c=>({...c,charges:c.charges.slice()}));F.lose=F.lose0.slice();fkStau(F);say('');S.ev=[];
  F.plan=[];F.i=0;F.t=0;F.laeuft=true;const add=(dur,run,start)=>F.plan.push({dur,run,start}),P=F.pk,M=F.M;
  add(0.5);
  if(w.id==='drosseln'){add(1.0,k=>P.k=1-ease(k));add(0.7,k=>P.a=1-k);add(0.3);fkSchluss(F,MOM[K.mom],add);add(0.3);fkNach(F,MOM[K.dann],add)}
  else if(w.id==='schlaf'){add(0.5,k=>F.wort.a=k,()=>{F.wort={text:w.sagt,a:0}});add(0.4);fkSchluss(F,MOM[K.mom],add);add(0.2);
    fkNach(F,MOM[K.dann],add);add(0.7);fkSchluss(F,MOM[K.dann],add);
    add(1.4,k=>P.front=lerp(fkX0(),W+12,k));add(0.2,null,()=>{P.a=0})}
  else{add(1.0,k=>{F.puff=k;P.a=1-k;F.gl.forEach(g=>g.al=1-k);M.ta=1-k;M.ds=0.8*(1-k);M.pa=1-k});
    add(0.9,null,()=>{F.puff=0});
    add(0.5,k=>F.wort.a=k,()=>{F.wort={text:w.sagt,a:0}});add(0.7);
    add(1.2,k=>{P.a=k;F.gl.forEach(g=>g.al=k);M.pa=k;M.ta=k;M.ds=0.8*k})}
  add(0.4);
  add(0,null,()=>{F.laeuft=false;st.wege[w.id]=1;say(w.cap+(s.wege.every(x=>st.wege[x.id])&&satzVon(s,'alle')?' '+satzVon(s,'alle'):''));syncNav()})}
// data-akt="rutscht": der Stau steht. Der Moment bricht ab, seine Ladung fällt ohne Adresse lose in den Speicher · das wartende Zeichen ist dran,
// seine Ladung fällt an ihre Adresse · die Punkte werden wieder Striche, du gehst weiter · die lose Ladung rutscht zu demselben Träger: dem nächstbesten.
function fkAktRutscht(F,add){const K=F.kette;let c=null;add(0.5);
  fkSchluss(F,MOM[K.mom],add,true);add(0.4);
  fkNach(F,MOM[K.dann],add);add(0.7);fkSchluss(F,MOM[K.dann],add);
  add(0.8,k=>F.pk.a=1-k);
  fkGeh(F,add,1.2,()=>W,null);add(0.5);
  add(1.3,k=>F.rutsch.k=k,()=>{c=F.c.find(x=>x.id===MOM[K.dann].addr);F.rutsch={k:0,j:F.lose.length-1,c}});
  add(0.2,null,()=>{const ch=F.lose.pop();if(c&&ch)c.charges.push(ch);F.rutsch=null});add(0.3)}
// data-akt="name": je <p class="name"> ein Knopf. Der erste Tipp: unten im Speicher erscheint ein neuer Träger mit diesem Namen, die letzte Ladung
// des Trägers aus data-von wandert zu ihm hinüber, dann .satz data-id="an". Jeder weitere Tipp gibt ihm einen anderen Namen, dann .satz data-id="mehr".
function fokusName(s,i){const F=S.fk,st=stOf(s);if(!F||!F.fertig||F.laeuft)return;const nm=s.namen[i],alt=F.c.find(x=>x.id===s.ausTraeger);let c=F.c.find(x=>x.id==='neu');
  F.plan=[];F.i=0;F.t=0;F.laeuft=true;const add=(dur,run,start)=>F.plan.push({dur,run,start});
  if(!c){add(0.6,k=>c.a=k,()=>{say('');c={id:'neu',label:nm,charges:[],a:0,y:null};F.c.push(c)});add(0.5);
    if(alt&&alt.charges.length){add(1.1,k=>F.zug.k=k,()=>{F.zug={k:0,von:alt,zu:c,ch:alt.charges.pop()}});add(0.2,null,()=>{c.charges.push(F.zug.ch);F.zug=null})}
    add(0.3);add(0,null,()=>say(satzVon(s,'an')))}
  else if(c.label!==nm){add(0.25,k=>c.a=1-k);add(0.3,k=>c.a=k,()=>{c.label=nm});add(0,null,()=>{if(satzVon(s,'mehr'))say(satzVon(s,'mehr'))})}
  add(0,null,()=>{F.laeuft=false;st.name=1;st.nameI=i;syncNav()})}
// data-akt="wieder": dieselben zwei Zeichen kommen noch einmal. Jedes Mal schließen sich die Platten gleich um die Ladung, ohne Zeilen,
// und sie fällt an ihre Adresse (die erste an den neuen Träger mit Namen). Die Zeitlinie läuft weiter, nichts staut sich. Danach .satz data-id="an".
function fkAktWieder(F,add){const K=F.kette;
  const direkt=(sp,adr)=>{add(0.35,k=>{F.M.pa=k;F.M.ds=0.8*k},()=>{F.M={w:CLOSED,pa:0,text:'',tag:null,ta:0,ds:0,dx:0,sign:sp.sign,big:false}});add(0.3);fkFall(F,sp,add,false,adr);add(0.2)};
  fkGeh(F,add,1.4,()=>W+30-fkX0(),{x:0,al:1,e:{art:'wort',schild:K.schild}});direkt(MOM[K.mom],'neu');
  fkGeh(F,add,1.4,()=>W+30-fkX0(),{x:0,al:1,e:{art:'wort',schild:K.schild2}});direkt(MOM[K.dann]);
  fkGeh(F,add,1.3,()=>W,null)}
/* Ein Moment: die Platten öffnen sich unter deinen Füßen · Zeile für Zeile, die Ladung daneben wird mit jeder Zeile deutlicher ·
   eine Zeile mit data-ruft: erst schickt der gerufene Träger sein Echo hoch · die Platten schließen sich um die Ladung ·
   sie fällt in den Speicher, lose oder an ihre Adresse (ein neuer Träger erscheint dabei) · dann der Satz aus <p class="fall">. */
function fokusMoment(F,sp,add){const n=sp.lines.length,M={w:0,pa:0,text:'',tag:null,ta:0,ds:0,dx:1,sign:sp.sign,big:sp.big};
  add(0.4,k=>{M.pa=k;M.w=CLOSED*k},()=>{F.M=M;say('')});
  sp.lines.forEach((ln,j)=>{const ziel=sp.sign?(n>1?lerp(0.45,1.25,(j+1)/n):0.8):0;let w0=0,d0=0;
    if(ln.recall){add(0.9,k=>{if(F.echo)F.echo.k=k},()=>{const c=F.c.find(x=>x.id===ln.recall);F.echo=c?{c,k:0,sign:(c.charges[c.charges.length-1]||{s:-1}).s}:null});
      add(0.25,null,()=>{F.echo=null})}
    add(0.4,k=>{M.w=lerp(w0,halfWidth(ln.text),k);M.ta=k;M.ds=lerp(d0,ziel,k)},()=>{w0=M.w;d0=M.ds;M.text=ln.text;M.tag=ln.tag;if(ln.cap)say(ln.cap)});
    add(Math.max(0.5,sp.dur-0.7));
    add(0.3,k=>M.ta=1-k)});
  let w1=0;add(0.6,k=>{M.w=lerp(w1,CLOSED,k);M.dx=1-k},()=>{w1=M.w;M.text='';if(sp.capClose)say(sp.capClose)});
  add(0.35);
  if(!sp.sign){add(0.4,k=>M.pa=1-k);add(0,null,()=>{F.M=null});return}
  add(0.95,k=>{F.fall.k=k;M.pa=1-ease(k/0.5);const c=F.fall.c;if(c&&c.a<1)c.a=Math.max(c.a,k)},
    ()=>{let c=sp.addr?F.c.find(x=>x.id===sp.addr):null;if(sp.addr&&!c){c={id:sp.addr,label:sp.addrLabel||sp.addr,charges:[],a:0,y:null};F.c.push(c)}
      F.fall={k:0,sign:sp.sign,big:sp.big,c,j:F.lose.length,s0:M.ds*(sp.big?1.3:1)};M.ds=0});
  add(0.25,null,()=>{const f=F.fall,ch={s:sp.sign,big:sp.big};if(f.c)f.c.charges.push(ch);else F.lose.push(ch);F.fall=null;F.M=null;if(sp.capDrop)say(sp.capDrop)})}
// ein Moment mit data-knopf: jeder Knopf einmal. Nach dem letzten kommt, mit Lesezeit, .satz data-id="alle".
function fokusTipp(s,id){const F=S.fk,st=stOf(s);if(!F||!F.fertig||F.laeuft||st.fk[id])return;st.fk[id]=1;
  F.plan=[];F.i=0;F.t=0;F.laeuft=true;const add=(dur,run,start)=>F.plan.push({dur,run,start});
  fokusMoment(F,MOM[id],add);
  add(0,null,()=>{F.laeuft=false;syncNav()});
  if(satzVon(s,'alle')&&s.momente.filter(x=>MOM[x].knopf).every(x=>st.fk[x])){add(3.2);add(0,null,()=>say(satzVon(s,'alle')))}}
/* Übergang aus der Bühne „zwei“ (data-uebergang="speicher"), nur direkt aus dem Schritt davor. Eins nach dem anderen: die Gedanken gehen ·
   die obere Bahn tritt zurück · der Name der unteren Bahn geht · die untere Bahn rückt nach oben, ihre Zeitlinie wird deine ·
   der Speicher wächst aus deinem Bauch · die Träger sinken einer nach dem anderen vom Wasser in den Speicher · das Wasser geht · der Pegel erscheint.
   Danach kommen der Text und die Lesepause, dann läuft der Schritt wie sonst. */
function fokusUebergang(s,v,F,add){const Z=zweiBau(v);Z.plan.forEach(p=>{if(p.ende)return;if(p.start)p.start();if(p.run)p.run(1)});
  Z.plan=[];Z.fertig=true;Z.geht=false;Z.bx=0;BAHNEN.forEach(b=>{const L=Z.B[b];L.sch=0;L.els.forEach(e=>{if(e){e.d=0;e.v=0}})});
  Z.ue={von:v,alt:BAHNEN.map((b,i)=>v.bahnen[i]||T(b)),aAlt:[1,1],aNeu:[0,0],rueck:0};S.zw=Z;
  const U=F.ue={zwei:true,kA:0,kB:0,kD:0,kW:1,kE:0,fly:null},L=Z.B.aktiv;
  add(0.3);
  add(0.35,k=>BAHNEN.forEach(b=>{const g=Z.B[b].ged;if(g)g.a=Math.min(g.a,1-k)}));
  add(0.8,k=>U.kA=k);
  add(0.3,k=>Z.ue.aAlt[1]=1-k);
  add(0.9,k=>U.kB=k);
  add(0.1,null,()=>{const dy=fokusHub(),z=L.zs||1;
    U.fly=F.c.map((c,i)=>{const q=L.pos[i]||{x:cx,y:yL+40+dy};return {k:0,x:q.x,y:q.y-dy,z}});
    F.weg=F.w0=Z.weg;F.gl=Z.gl.map(q=>({x:q.x,al:q.al,e:q.e}));U.zwei=false;S.zw=null});
  add(0.85,k=>U.kD=k);
  F.c.forEach((c,i)=>add(0.45,k=>U.fly[i].k=k));
  add(0.4,k=>U.kW=1-k);
  add(0.45,k=>U.kE=k);
  add(0.2,null,()=>{F.ue=null;$('text').classList.remove('warte');S.lese=lesezeit();const how=s.sec.querySelector(':scope > .hinweis');if(how)say(how.textContent,true)})}
// so weit rückt die untere Bahn nach oben, bis ihre Zeitlinie deine ist
const fokusHub=()=>{const h=H/2;return h+Math.max(0,(h-178)/2)+60-(yL-22)};
function fokusTakt(s,dt,liest){const F=S.fk,n=F.c.length,cs=F.cs=Math.min(24,1.36*R0/Math.max(1,n-1)),zz=Math.min(1,cs/20);
  F.zs=reduce||F.zs===undefined?zz:F.zs+(zz-F.zs)*Math.min(1,dt*5);   // liegen viele Träger im Speicher, werden sie kleiner gezeichnet
  F.c.forEach((c,i)=>{const ty=cy0+(i-(n-1)/2)*cs;c.y=c.y==null||reduce?ty:c.y+(ty-c.y)*Math.min(1,dt*6)});
  const z=fokusPegel(F);F.lv=reduce?z:F.lv+(z-F.lv)*Math.min(1,dt*3);
  if(!liest)ablauf(F,dt)}
function drawFokus(){const s=SLIDES[cur],F=S.fk;if(!F)return;const U=F.ue,yT=yL-22;
  // die zwei Bahnen des Schritts davor: die obere tritt zurück, die untere rückt nach oben
  if(U&&U.zwei){ctx.save();ctx.translate(0,-fokusHub()*ease(U.kB));drawZwei();ctx.globalAlpha=ease(U.kA);ctx.fillStyle=C.bg;ctx.fillRect(0,-H,W,H+H/2+0.5);ctx.restore();ctx.globalAlpha=1;return}
  const kD=U?ease(U.kD):1,kE=U?U.kE:1,kW=U?U.kW:0,r=lerp(RZ,RM,kD),fy=yT-2.3*r,sy=lerp(fy,cy0,kD),sr=lerp(r,R0,kD);
  // die Zeitlinie läuft unter deinen Füßen durch
  ctx.strokeStyle=C.muted;ctx.lineWidth=1.5;ctx.setLineDash([6,8]);ctx.lineDashOffset=F.weg;ctx.beginPath();ctx.moveTo(0,yT);ctx.lineTo(W,yT);ctx.stroke();ctx.setLineDash([]);
  if(kE>0.01){ctx.globalAlpha=kE;label(T('zeit').toUpperCase(),W-2,yT-9,10,C.muted,'right',1.5);ctx.globalAlpha=1}
  // der Stau: rechts von dir sind aus den Strichen Punkte geworden
  const P=F.pk;
  if(P&&P.a>0.01){const von=Math.max(fkX0()+2,P.front);ctx.globalAlpha=P.a;ctx.fillStyle=C.bg;ctx.fillRect(von,yT-3,W,6);ctx.fillStyle=C.ink;
    fkPunkte(P.k).forEach(x=>{x-=P.shift;if(x<von+1||x>W+3)return;ctx.beginPath();ctx.arc(x,yT,2.8,0,6.283);ctx.fill()});ctx.globalAlpha=1}
  F.gl.forEach(q=>zeichenMalen(q,yT,true,F.geht&&!reduce,0));
  // ein Wort über der Zeitlinie (Schlaf, am nächsten Morgen)
  if(F.wort&&F.wort.a>0.01){ctx.globalAlpha=F.wort.a;label(F.wort.text.toUpperCase(),W-4,yT-40,9.5,C.ink,'right',1.5);ctx.globalAlpha=1}
  // verpufft: was sich gestaut hat, vergeht, ohne irgendwo anzukommen
  if(F.puff>0.01&&F.puff<1){ctx.strokeStyle=C.muted;ctx.lineWidth=1.3;[0,0.25].forEach(o=>{const q=F.puff-o;if(q<=0)return;ctx.globalAlpha=0.7*(1-q);ctx.beginPath();ctx.ellipse(fkX0()+30,yT,14+70*q,4+9*q,0,0,6.283);ctx.stroke()});ctx.globalAlpha=1}
  // der Speicher ist dein Bauch, groß gezeichnet: solange er wächst, führen zwei feine Linien vom Bauch zu ihm
  if(kD>0.01){
    if(kD<1){ctx.globalAlpha=Math.sin(Math.PI*kD)*0.75;ctx.strokeStyle=C.muted;ctx.lineWidth=1;ctx.setLineDash([3,5]);ctx.beginPath();
      [-1,1].forEach(d=>{ctx.moveTo(cx+d*r,fy);ctx.lineTo(cx+d*sr,sy)});ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1}
    ctx.beginPath();for(let i=0;i<=72;i++){const a=i/72*6.283,tt=reduce?0:time,rr=sr*(1+0.012*Math.sin(a*3+tt*0.8)+0.01*Math.sin(a*5-tt*0.6));
      const x=cx+Math.cos(a)*rr,y=sy+Math.sin(a)*rr;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}
    ctx.closePath();ctx.fillStyle=C.paper;ctx.fill();
    ctx.globalAlpha=Math.min(0.28,Math.abs(F.lv)*0.4);ctx.fillStyle=F.lv>0?C.plus:C.minus;ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke()}
  // das Wasser der Bahn, solange die Träger noch darauf liegen
  if(kW>0.01){const yw=yT+82;ctx.strokeStyle=C.minus;ctx.lineWidth=1.5;ctx.globalAlpha=0.8*kW;ctx.beginPath();
    for(let xx=0;xx<=W;xx+=5){const y=yw+(reduce?0:Math.sin(xx*0.045+time*1.3+2)*2.2);xx?ctx.lineTo(xx,y):ctx.moveTo(xx,y)}ctx.stroke();ctx.globalAlpha=1}
  // Pegel
  if(kE>0.01){const y=cy0+R0+22,x0=cx-R0,x1=cx+R0,lv=Math.max(-1,Math.min(1,F.lv));ctx.globalAlpha=kE;
    ctx.strokeStyle=C.muted;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.moveTo(cx,y-5);ctx.lineTo(cx,y+5);ctx.stroke();
    label('−',x0-12,y+5,16,C.minus,'center');label('+',x1+12,y+5,16,C.plus,'center');
    ctx.fillStyle=lv>0.06?C.plus:lv<-0.06?C.minus:C.ink;ctx.beginPath();ctx.arc(cx+lv*R0,y,6.5,0,6.283);ctx.fill();
    const zu=mood(F.lv).toUpperCase();let zeile=T('speicher').toUpperCase()+' · '+zu;ctx.font='10.5px '+C.sans;if(ctx.measureText(zeile).width+1.5*zeile.length>W-6)zeile=zu;
    label(zeile,cx,y+23,10.5,C.muted,'center',1.5);ctx.globalAlpha=1}
  // Ladungsträger im Speicher. Im Übergang kommen sie vom Wasser: der Rahmen des Schwimmelements geht dabei.
  const zs=F.zs||1;
  F.c.forEach((c,i)=>{gliedMass(c);if(c.y==null)return;const f=U&&U.fly?U.fly[i]:null;
    if(f){const k=ease(f.k),bob=reduce?0:stegBob(i+2)*(1-k);ctx.save();ctx.translate(lerp(f.x,cx,k),lerp(f.y+bob,c.y,k));const z=lerp(f.z,1,k);ctx.scale(z,z);gliedMalen(c,0,0,1-k,1);ctx.restore()}
    else if(zs<1){ctx.save();ctx.translate(cx,c.y);ctx.scale(zs,zs);gliedMalen(c,0,0,0,c.a);ctx.restore()}
    else gliedMalen(c,cx,c.y,0,c.a)});
  const ende=c=>[cx+c.tot*zs/2+(c.charges.length?8:-6),c.y];   // hier kommt bei einem Träger die nächste Ladung an
  F.lose.forEach((q,j)=>{const p=FK_LOSE[j%FK_LOSE.length];let x=cx+p[0]*R0,y=cy0+p[1]*R0;
    if(F.rutsch&&F.rutsch.j===j&&F.rutsch.c){const e=ende(F.rutsch.c),k=ease(F.rutsch.k);x=lerp(x,e[0],k);y=lerp(y,e[1],k)}
    chargeDot(x,y,q.s,q.big?1.1:0.85)});
  // eine Ladung wandert von einem Träger zu dem mit dem neuen Namen
  if(F.zug){const Z=F.zug,a=ende(Z.von),b=ende(Z.zu),k=ease(Z.k);chargeDot(lerp(a[0],b[0],k)+Math.sin(Math.PI*k)*22,lerp(a[1],b[1],k),Z.ch.s,0.85)}
  // der Moment unter deinen Füßen
  const M=F.M;
  if(M){plates(cx,yL,M.w,M.pa);
    if(M.text){if(M.tag){ctx.globalAlpha=M.ta;label(M.tag,cx,yL-8,9.5,C.muted,'center',1.5);ctx.globalAlpha=1;momentText(M.text,cx,yL+8,M.ta)}else momentText(M.text,cx,yL,M.ta)}
    if(M.ds>0.01)chargeDot(cx+(M.w+15)*M.dx,yL,M.sign,M.ds*(M.big?1.3:1))}
  // das Echo: der gerufene Träger schickt seine Ladung zu dir hoch
  if(F.echo){const E=F.echo,k=ease(E.k);chargeDot(lerp(cx+E.c.tot/2-6,cx,k),lerp(E.c.y,yL,k),E.sign,0.9,0.75)}
  // die Ladung fällt in den Speicher: an ihre Adresse oder lose an einen freien Platz
  if(F.fall){const f=F.fall,k=f.k,p=FK_LOSE[f.j%FK_LOSE.length],tx=f.c?cx+f.c.tot*zs/2+(f.c.charges.length?8:-6):cx+p[0]*R0,ty=f.c?f.c.y:cy0+p[1]*R0;
    chargeDot(lerp(cx,tx,ease(k)),lerp(yL,ty,k*k),f.sign,lerp(f.s0,f.big?1.1:0.85,k))}
  // du
  ctx.beginPath();ctx.arc(cx,fy,r,0,6.283);ctx.fillStyle=C.paper;ctx.fill();
  ctx.globalAlpha=Math.min(0.28,Math.abs(F.lv)*0.4);ctx.fillStyle=F.lv>0?C.plus:C.minus;ctx.fill();ctx.globalAlpha=1;
  ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();figur(cx,fy,r,1,F.geht&&!reduce?Math.sin(time*8):0)}
