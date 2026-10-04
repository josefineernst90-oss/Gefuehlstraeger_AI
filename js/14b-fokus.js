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
  else if(v&&v.scene==='fokus'){const p=fokusStand(v);q.c=p.c;q.lose=p.lose;
    v.alte.forEach(a=>q.c.push({id:a.id,label:a.label,charges:zeichen(a.lad)}));
    v.momente.forEach(id=>fokusWirkt(q,MOM[id]));q.schild=v.zeichenText||p.schild}
  return q}
function fokusPegel(F){let p=0,n=0;const z=ch=>{const w=ch.big?2:1;ch.s>0?p+=w:n+=w};F.c.forEach(c=>c.charges.forEach(z));F.lose.forEach(z);return (p-n)/(p+n+5)}
function fokusStart(s,prev){const st=stOf(s),q=fokusStand(s),i=SLIDES.indexOf(s),v=SLIDES[i-1];st.fk={};
  const F=S.fk={c:q.c.map(c=>({id:c.id,label:c.label,charges:c.charges,a:1,y:null})),lose:q.lose,lv:0,M:null,fall:null,echo:null,gl:[],weg:0,w0:0,geht:false,
    plan:[],i:0,t:0,fertig:false,laeuft:false,ue:null};
  F.lv=fokusPegel(F);
  const add=(dur,run,start)=>F.plan.push({dur,run,start}),halt=()=>cx+RM*1.9+3;
  if(s.vomWasser&&!reduce&&prev===i-1&&v&&v.scene==='zwei')fokusUebergang(s,v,F,add);
  else if(q.schild)F.gl.push({x:halt(),al:1,e:{art:'wort',schild:q.schild}});
  // die Zeit läuft: das alte Zeichen wandert nach links hinaus, das Zeichen dieses Schritts (data-kommt) kommt von rechts
  const lauf=neu=>add(1.5,k=>{const d=(W+30-halt())*k;F.gl.forEach(g=>{g.x=g.x0-d;if(g!==neu)g.al=1-ease(k/0.7)});F.weg=F.w0+d;if(k>=1){F.geht=false;F.gl=F.gl.filter(g=>g===neu)}},
    ()=>{if(neu){neu.x=W+30;F.gl.push(neu)}F.gl.forEach(g=>g.x0=g.x);F.w0=F.weg;F.geht=true});
  if(s.zeichenText)lauf({x:0,al:1,e:{art:'wort',schild:s.zeichenText}});else if(s.geht)lauf(null);
  // was von früher im Speicher liegt (<p class="traeger">), erscheint dort
  s.alte.forEach(a=>{let c=null;add(0.6,k=>c.a=k,()=>{c={id:a.id,label:a.label,charges:zeichen(a.lad),a:0,y:null};F.c.push(c)});add(0.7)});
  s.momente.filter(id=>!MOM[id].knopf).forEach(id=>fokusMoment(F,MOM[id],add));
  add(0,null,()=>{F.fertig=true;syncNav()})}
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
function fokusTakt(s,dt,liest){const F=S.fk,n=F.c.length,cs=Math.min(24,1.36*R0/Math.max(1,n-1));
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
  F.gl.forEach(q=>zeichenMalen(q,yT,true,F.geht&&!reduce,0));
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
  F.c.forEach((c,i)=>{gliedMass(c);if(c.y==null)return;const f=U&&U.fly?U.fly[i]:null;
    if(f){const k=ease(f.k),bob=reduce?0:stegBob(i+2)*(1-k);ctx.save();ctx.translate(lerp(f.x,cx,k),lerp(f.y+bob,c.y,k));const z=lerp(f.z,1,k);ctx.scale(z,z);gliedMalen(c,0,0,1-k,1);ctx.restore()}
    else gliedMalen(c,cx,c.y,0,c.a)});
  F.lose.forEach((q,j)=>{const p=FK_LOSE[j%FK_LOSE.length];chargeDot(cx+p[0]*R0,cy0+p[1]*R0,q.s,q.big?1.1:0.85)});
  // der Moment unter deinen Füßen
  const M=F.M;
  if(M){plates(cx,yL,M.w,M.pa);
    if(M.text){if(M.tag){ctx.globalAlpha=M.ta;label(M.tag,cx,yL-8,9.5,C.muted,'center',1.5);ctx.globalAlpha=1;momentText(M.text,cx,yL+8,M.ta)}else momentText(M.text,cx,yL,M.ta)}
    if(M.ds>0.01)chargeDot(cx+(M.w+15)*M.dx,yL,M.sign,M.ds*(M.big?1.3:1))}
  // das Echo: der gerufene Träger schickt seine Ladung zu dir hoch
  if(F.echo){const E=F.echo,k=ease(E.k);chargeDot(lerp(cx+E.c.tot/2-6,cx,k),lerp(E.c.y,yL,k),E.sign,0.9,0.75)}
  // die Ladung fällt in den Speicher: an ihre Adresse oder lose an einen freien Platz
  if(F.fall){const f=F.fall,k=f.k,p=FK_LOSE[f.j%FK_LOSE.length],tx=f.c?cx+f.c.tot/2+(f.c.charges.length?8:-6):cx+p[0]*R0,ty=f.c?f.c.y:cy0+p[1]*R0;
    chargeDot(lerp(cx,tx,ease(k)),lerp(yL,ty,k*k),f.sign,lerp(f.s0,f.big?1.1:0.85,k))}
  // du
  ctx.beginPath();ctx.arc(cx,fy,r,0,6.283);ctx.fillStyle=C.paper;ctx.fill();
  ctx.globalAlpha=Math.min(0.28,Math.abs(F.lv)*0.4);ctx.fillStyle=F.lv>0?C.plus:C.minus;ctx.fill();ctx.globalAlpha=1;
  ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();figur(cx,fy,r,1,F.geht&&!reduce?Math.sin(time*8):0)}
