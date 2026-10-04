/* ---------- Bühne „grob“: dein Stimmungsspeicher, darin nur noch grobe Träger ---------- */
const grobPegel=G=>Math.max(-1,Math.min(1,G.rows.reduce((a,r)=>a+(r.voll?r.charges.reduce((b,ch)=>b+ch.s,0):0),0)/10));
function grobStart(s){S.gb=grobBau(s)}
function grobBau(s){const vor=SLIDES.find(x=>x.id===s.stand&&x!==s);
  const G=vor?grobBau(vor):{rows:[],kreis:0,start:0,pegel:0,wasser:1,lv:0,ziel:0,frage:0,antw:0,echo:null,frageText:'',antwText:'',laeuft:false};
  if(vor){G.plan.forEach(p=>{if(p.ende)return;if(p.start)p.start();if(p.run)p.run(1)});G.lv=G.ziel;
    // der Baum des Schritts davor steht fertig da
    if(vor.ebenen.length&&G.ix){const X=G.ix;X.k0=1;X.stufe=vor.ebenen.length;X.rows=[];
      vor.ebenen.forEach((e,ei)=>{const letzte=ei===vor.ebenen.length-1;
        if(e.kinder.length)X.rows.push({k:1,nodes:e.kinder.map(q=>({label:q.label,charges:zeichen(q.lad),weiter:q.weiter,a:e.dimmt&&!q.weiter?0.28:1,rahmen:letzte&&q.weiter?1:0}))});
        else if(X.rows.length)X.rows[X.rows.length-1].nodes.forEach(n=>{if(!n.weiter)n.a=0.28})})}}
  G.plan=[];G.i=0;G.t=0;G.fertig=false;
  const add=(dur,run,start)=>G.plan.push({dur,run,start});
  // die genaue Adresse im Speicher: eine neue Zeile unter dem groben Träger, eine Ladung wandert hinüber
  if(s.genau){const vi=G.rows.findIndex(r=>r.id===s.genau.von),von=G.rows[vi];
    if(von){const neu={id:'genau',label:s.genau.label,charges:[],a:0,voll:true,mini:null,neu:false,rahmen:0},sign=(zeichen(s.genau.lad)[0]||{s:-1}).s;
      add(0.5,k=>G.antw=Math.min(G.antw,1-k));
      add(0.6,null,()=>{G.rows.splice(vi+1,0,neu)});
      add(0.45,k=>neu.a=k);add(0.3);
      add(0.7,k=>G.zug.k=k,()=>{const i=von.charges.findIndex(c=>c.s===sign);if(i>=0)von.charges.splice(i,1);G.zug={k:0,von,an:neu,sign}});
      add(0.3,null,()=>{G.zug=null;neu.charges.push({s:sign})});
      add(0.4,k=>neu.rahmen=k);add(0.6);
      // die Frage noch einmal
      add(0.3,k=>G.frage=1-k);add(0.4,k=>G.frage=k,()=>{if(s.frage)G.frageText=s.frage});add(0.9);
      add(0.5,k=>G.echo.k=k,()=>{G.echo={i:G.rows.indexOf(neu),k:0}});
      add(0.2,null,()=>{G.echo=null});
      add(0.5,k=>G.rows.forEach(r=>{if(r!==neu)r.a=1-0.55*k}));
      if(s.antwort)add(0.45,k=>G.antw=k,()=>{G.antwText=s.antwort});
      add(0.4)}}
  // eine Stufe tiefer, und was außerhalb des Baums daran hängt
  if(s.tiefer&&G.ix){const X=G.ix,row={k:0,nodes:[{label:s.tiefer.label,charges:zeichen(s.tiefer.lad),weiter:true,a:0,rahmen:0}]};
    add(0.4);add(0.5,k=>row.k=k,()=>X.rows.push(row));
    add(0.4,k=>row.nodes[0].a=k);
    if(s.tiefer.denkt){add(0.3);add(0.45,k=>X.denkt.a=k,()=>{X.denkt={text:s.tiefer.denkt,a:0}});add(1.0)}
    if(s.daneben){add(0.5,k=>X.neben.k=k,()=>{X.neben={label:s.daneben.label,charges:zeichen(s.daneben.lad),a:0,k:0}});add(0.4,k=>X.neben.a=k)}
    add(0.4)}
  if(s.grobListe.length){
    G.rows=s.grobListe.map(q=>({id:q.id,label:q.label,charges:zeichen(q.lad),voll0:zeichen(q.lad),a:q.da?1:0,da:q.da,voll:false,mini:null,neu:false}));
    G.frageText=s.frage;G.antwText=s.antwort;
    add(0.5,k=>G.wasser=1-k);
    add(0.9,k=>G.kreis=k);
    add(0.8,k=>G.start=ease(k));
    add(0.5,k=>G.pegel=k);
    add(0.6,null,()=>{G.rows.forEach(r=>{if(r.da)r.voll=true});G.ziel=grobPegel(G)});
    add(0.5);
    // überall dasselbe Muster: ein kleiner Steg schrumpft zu einem Wort
    G.rows.filter(r=>!r.da).forEach(r=>{
      add(0.35,k=>r.mini.a=k,()=>{r.mini={k:0,a:0}});
      add(0.7,k=>r.mini.k=ease(k));
      add(0.35,k=>{r.a=k;r.mini.a=1-k});
      add(0.6,null,()=>{r.mini=null;r.voll=true;G.ziel=grobPegel(G)})});
    add(0.6);
    if(s.frage){add(0.45,k=>G.frage=k);add(1.1);
      G.rows.forEach((r,i)=>add(0.45,k=>G.echo.k=k,()=>{G.echo={i,k:0}}));
      add(0.2,null,()=>{G.echo=null});
      if(s.antwort)add(0.45,k=>G.antw=k);add(0.5)}}
  // die Adresse hinunter: beginnt beim Träger data-wurzel
  if(s.ebenen.length)G.ix={k0:0,rows:[],stufe:0,wurzel:s.wurzel};
  add(0,null,()=>{G.fertig=true;const t=satzVon(s,'tippen');if(t)say(t,true);else say(satzVon(s,'an'));syncNav()});G.plan[G.plan.length-1].ende=true;
  return G}
// wie man den Satz nimmt: die Ladung kommt eine Stufe tiefer an, oder sie prallt am Ego ab und wandert hinauf
function grobNimmt(s,e){const G=S.gb,X=G&&G.ix;if(!X||!G.fertig||G.laeuft)return;const st=stOf(s),wz=G.rows.find(q=>q.id===X.wurzel);
  const alle=[wz].concat(...X.rows.map(r=>r.nodes));
  alle.forEach(n=>{if(!n.c0){n.c0=n.charges.map(c=>({s:c.s}));n.a0=n.a}n.charges=n.c0.map(c=>({s:c.s}));n.a=n.a0});
  X.tor=0;X.punkt=null;X.denkt=null;X.oben=0;
  const pfad=X.rows.map(r=>r.nodes.find(n=>n.weiter)).filter(Boolean),tief=pfad[pfad.length-1],satz=pfad[pfad.length-2];if(!tief||!satz)return;
  const sign=(satz.charges.find(c=>c.s<0)||{s:-1}).s,ort=n=>[n.px,n.py],mitte=()=>[(satz.px+tief.px)/2,(satz.py+tief.py)/2+2];
  say('');G.plan=[];G.i=0;G.t=0;G.laeuft=true;const add=(dur,run,start)=>G.plan.push({dur,run,start});
  add(0.4);add(0.45,k=>X.denkt.a=k,()=>{X.denkt={text:e.knopf,a:0}});add(1.3);
  if(e.id==='an'){
    add(0.8,k=>X.punkt.k=k,()=>{const i=satz.charges.findIndex(c=>c.s<0);if(i>=0)satz.charges.splice(i,1);X.punkt={k:0,sign,pts:[ort(satz),ort(tief)]}});
    add(0.4,null,()=>{X.punkt=null;tief.charges.push({s:sign})})}
  else{
    add(0.45,k=>X.tor=k);add(0.3);
    const hinauf=pfad.slice(0,-2).reverse().concat([wz]);
    add(0.6,k=>X.punkt.k=k,()=>{const i=satz.charges.findIndex(c=>c.s<0);if(i>=0)satz.charges.splice(i,1);X.punkt={k:0,sign,pts:[ort(satz),mitte()]}});
    add(0.5,k=>X.punkt.k=k,()=>{X.punkt={k:0,sign,pts:[mitte(),ort(satz)]}});
    add(0.45*hinauf.length,k=>X.punkt.k=k,()=>{X.punkt={k:0,sign,pts:[ort(satz)].concat(hinauf.map(ort))}});
    add(0.3,null,()=>{X.punkt=null});
    add(0.5,k=>pfad.forEach(n=>n.a=Math.min(n.a,1-0.72*k)));
    if(satzVon(s,'oben'))add(0.45,k=>X.oben=k)}
  add(0.4);
  add(0,null,()=>{G.laeuft=false;st.nimmt=st.nimmt||{};st.nimmt[e.id]=1;say(e.cap);syncNav()})}
// zwei Wege einzugreifen. Jeder Tipp beginnt wieder beim Stand davor.
function grobEingriff(s,e){const G=S.gb,X=G&&G.ix;if(!X||!G.fertig||G.laeuft)return;const st=stOf(s),wz=G.rows.find(q=>q.id===X.wurzel);
  const alle=[wz].concat(...X.rows.map(r=>r.nodes),X.neben?[X.neben]:[]);
  alle.forEach(n=>{if(!n.c0)n.c0=n.charges.map(c=>({s:c.s}));n.charges=n.c0.map(c=>({s:c.s}))});X.blitz=null;
  const pfad=X.rows.map(r=>r.nodes.find(n=>n.weiter)).filter(Boolean).reverse(),tief=pfad[0],hinauf=pfad.slice(1).concat([wz]);   // von unten nach oben
  say('');G.plan=[];G.i=0;G.t=0;G.laeuft=true;const add=(dur,run,start)=>G.plan.push({dur,run,start});
  const blitz=n=>add(0.5,k=>X.blitz.k=k,()=>{X.blitz={n,k:0}});
  const weg=n=>add(0.5,k=>X.blitz.k=k,()=>{const i=n.charges.findIndex(c=>c.s<0);if(i>=0)n.charges.splice(i,1);X.blitz={n,k:0}});
  add(0.5);
  if(e.id==='unten'){
    blitz(tief);add(0.25);blitz(tief);add(0.25);   // härter: es braucht mehrere Anläufe
    add(0.6,k=>X.blitz.k=k,()=>{tief.charges=tief.charges.map(()=>({s:1}));X.blitz={n:tief,k:0}});add(0.4);
    hinauf.forEach(weg);if(X.neben)weg(X.neben)}
  else hinauf.forEach(weg);
  add(0.4);
  add(0,null,()=>{G.laeuft=false;X.blitz=null;st.eing=st.eing||{};st.eing[e.id]=1;
    say(e.cap+(s.eingriffe.every(x=>st.eing[x.id])&&satzVon(s,'alle')?' '+satzVon(s,'alle'):''));syncNav()})}
// eine Stufe tiefer: die Teile des Trägers erscheinen, oder die anderen treten zurück
function indexTipp(s){const G=S.gb,X=G&&G.ix;if(!X||!G.fertig||G.laeuft||X.stufe>=s.ebenen.length)return;const e=s.ebenen[X.stufe],letzte=X.stufe===s.ebenen.length-1;
  say('');G.plan=[];G.i=0;G.t=0;G.laeuft=true;const add=(dur,run,start)=>G.plan.push({dur,run,start});
  if(!X.stufe)add(0.8,k=>X.k0=ease(k));
  const blass=row=>add(0.45,k=>row.nodes.forEach(n=>{if(!n.weiter)n.a=1-0.72*k}));
  if(e.kinder.length){const row={k:0,nodes:e.kinder.map(q=>({label:q.label,charges:zeichen(q.lad),weiter:q.weiter,a:0,rahmen:0}))};
    add(0.5,k=>row.k=k,()=>X.rows.push(row));
    add(0.4,k=>row.nodes.forEach(n=>n.a=k));
    if(e.dimmt){add(0.5);blass(row)}
    if(letzte)add(0.4,k=>row.nodes.forEach(n=>{if(n.weiter)n.rahmen=k}))}
  else if(X.rows.length)blass(X.rows[X.rows.length-1]);
  add(0.2);
  add(0,null,()=>{G.laeuft=false;X.stufe++;if(letzte)stOf(s).unten=1;say(letzte?satzVon(s,'an'):e.satz);syncNav()})}
// neuer Job: der Träger geht, ein leerer kommt. Als Erstes bekommt er ein Plus. Wie es weitergeht, bleibt offen.
function grobWechsel(s){const G=S.gb;if(!G||!G.fertig||G.laeuft)return;const r=G.rows.find(x=>x.id===s.wechsel);if(!r)return;
  say('');G.plan=[];G.i=0;G.t=0;G.laeuft=true;G.dazu=null;const add=(dur,run,start)=>G.plan.push({dur,run,start});
  add(0.5,k=>r.a=1-k);
  add(0.3,null,()=>{r.charges=[];r.neu=true;G.ziel=grobPegel(G)});
  add(0.5,k=>r.a=k);
  add(1.0);
  add(0.7,k=>G.dazu.k=k,()=>{G.dazu={k:0,row:G.rows.indexOf(r),sign:1}});
  add(0.6,null,()=>{G.dazu=null;r.charges=[{s:1}];G.ziel=grobPegel(G)});
  add(0.4);
  add(0,null,()=>{G.laeuft=false;stOf(s).gewechselt=1;say(satzVon(s,'an'));syncNav()})}
// der Baum der Adressen: oben die grobe, darunter Stufe um Stufe die feinere
function grobBaum(G){const X=G.ix,r=G.rows.find(q=>q.id===X.wurzel);if(!r)return;gliedMass(r);
  const yTop=30,dy=Math.max(50,Math.min(76,(H-70)/4.4)),y0=lerp(X.vonY===undefined?yTop:X.vonY,yTop,X.k0);
  let eltern={x:cx,y:y0};r.px=cx;r.py=y0;
  X.rows.forEach((row,ri)=>{const els=row.nodes,z=stegZoom(els),R=stegReihe(els,z),y=yTop+(ri+1)*dy;
    // Linien vom Träger zu seinen Teilen
    ctx.strokeStyle=C.muted;ctx.lineWidth=1.3;
    els.forEach((n,i)=>{const x=cx+(R[i]-cx)*z;ctx.globalAlpha=Math.max(0.3,n.a||1);ctx.beginPath();ctx.moveTo(eltern.x,eltern.y+13);
      ctx.lineTo(lerp(eltern.x,x,row.k),lerp(eltern.y+13,y-15,row.k));ctx.stroke()});ctx.globalAlpha=1;
    ctx.save();ctx.translate(cx,y);ctx.scale(z,z);ctx.translate(-cx,-y);
    els.forEach((n,i)=>{gliedMass(n);gliedMalen(n,R[i],y,n.rahmen,n.a);n.px=cx+(R[i]-cx)*z;n.py=y});ctx.restore();
    const w=els.findIndex(n=>n.weiter);if(w>=0)eltern={x:cx+(R[w]-cx)*z,y,n:els[w]}});
  gliedMalen(r,cx,y0,0,r.a);
  // der Gedanke unter der tiefsten Stufe
  if(X.denkt&&X.denkt.a>0.01){ctx.globalAlpha=X.denkt.a;ctx.font='italic 14px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText('„'+X.denkt.text+'“',eltern.x,eltern.y+27);ctx.globalAlpha=1}
  // das Tor zwischen dem gerahmten Träger und der tiefsten Stufe
  if(X.tor>0.01&&X.rows.length>1){const a=X.rows[X.rows.length-2].nodes.find(n=>n.weiter),b=eltern.n;
    if(a&&b){const x=(a.px+b.px)/2,y=(a.py+b.py)/2+3;ctx.strokeStyle=C.ink;ctx.lineWidth=2.6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x-13*X.tor,y);ctx.lineTo(x+13*X.tor,y);ctx.stroke();ctx.lineCap='butt';
      ctx.globalAlpha=X.tor;label(satzVon(SLIDES[cur],'tor').toUpperCase(),x+20,y+3.5,9.5,C.ink,'left',1.6);ctx.globalAlpha=1}}
  // neben der Wurzel: wo die Ladung nach dem Abprallen wieder landet
  if(X.oben>0.01){ctx.globalAlpha=X.oben;ctx.font='italic 14px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='left';ctx.fillText('„'+satzVon(SLIDES[cur],'oben')+'“',cx+r.tot/2+12,y0+5);ctx.globalAlpha=1}
  // die Ladung unterwegs, an den Linien entlang
  if(X.punkt){const P=X.punkt.pts,L=P.slice(1).map((q,i)=>Math.hypot(q[0]-P[i][0],q[1]-P[i][1])),ges=L.reduce((a,b)=>a+b,0)||1;let rest=X.punkt.k*ges,i=0;
    while(i<L.length-1&&rest>L[i]){rest-=L[i];i++}const f=Math.min(1,rest/(L[i]||1));chargeDot(lerp(P[i][0],P[i+1][0],f),lerp(P[i][1],P[i+1][1],f),X.punkt.sign,0.8)}
  // was außerhalb des Baums an ihr hängt
  if(X.neben&&eltern.n){const N=X.neben,t=eltern.n;gliedMass(N);gliedMass(t);const x=Math.min(W-N.tot/2-8,eltern.x+Math.max(150,W*0.24)),y=eltern.y,x0=eltern.x+t.tot/2+8,x1=x-N.tot/2-8;
    ctx.strokeStyle=C.muted;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(lerp(x0,x1,N.k),y);ctx.stroke();
    gliedMalen(N,x,y,0,N.a);N.px=x;N.py=y}
  // wo sich gerade etwas ändert
  if(X.blitz&&X.blitz.n&&X.blitz.k<1&&X.blitz.n.px!==undefined){const B=X.blitz;ctx.globalAlpha=1-B.k;ctx.strokeStyle=C.plus;ctx.lineWidth=1.6;
    ctx.beginPath();ctx.arc(B.n.px,B.n.py,10+16*B.k,0,6.283);ctx.stroke();ctx.globalAlpha=1}}
function drawGrob(){const s=SLIDES[cur],G=S.gb;if(!G)return;const X=G.ix,aG=X?1-X.k0:1;
  const Rk=Math.min(W*0.27,(H-128)/2,132),yk=Math.max(44+Rk,H*0.5-34),n=G.rows.length,zy=i=>yk+(i-(n-1)/2)*30,rm=8,my=yk-Rk-2.3*rm,lv=G.lv;
  // das Wasser, auf dem der Träger eben noch lag
  if(G.wasser>0.01){ctx.strokeStyle=C.minus;ctx.lineWidth=1.5;ctx.globalAlpha=0.8*G.wasser;ctx.beginPath();
    for(let xx=0;xx<=W;xx+=5){const y=H*0.5+20+(reduce?0:Math.sin(xx*0.045+time*1.3)*2.2);xx?ctx.lineTo(xx,y):ctx.moveTo(xx,y)}ctx.stroke();ctx.globalAlpha=1}
  // der Speicher
  if(G.kreis>0.01){const aK=G.kreis*aG;ctx.beginPath();ctx.arc(cx,yk,Rk,0,6.2832);ctx.globalAlpha=aK;ctx.fillStyle=C.paper;ctx.fill();
    ctx.globalAlpha=aK*Math.min(0.28,Math.abs(lv)*0.4);ctx.fillStyle=C.minus;ctx.fill();ctx.globalAlpha=aG;
    ctx.beginPath();ctx.arc(cx,yk,Rk,-Math.PI/2,-Math.PI/2+6.2832*G.kreis);ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();
    // du, darauf
    ctx.globalAlpha=aK;ctx.beginPath();ctx.arc(cx,my,rm,0,6.283);ctx.fillStyle=C.paper;ctx.fill();
    ctx.globalAlpha=aK*Math.min(0.85,Math.abs(lv)*0.95);ctx.fillStyle=C.minus;ctx.fill();ctx.globalAlpha=aK;
    ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();figur(cx,my,rm,1,0);ctx.globalAlpha=1}
  // die Träger: einer unter dem anderen. Der erste kommt als Schwimmelement aus der Mitte.
  const mini=[0,1,2].map(()=>({label:'',charges:[{s:-1}],a:1,ein:1})),ml=[{a:0,b:1,k:1},{a:1,b:2,k:1}];
  G.rows.forEach((r,i)=>{const zi=zy(i);r.yy=reduce||r.yy===undefined?zi:r.yy+(zi-r.yy)*0.16;
    const k=r.da?G.start:1,x=cx,y=lerp(H*0.5+(r.da&&!reduce?Math.sin(time*1.5)*2.2*(1-k):0),r.yy,k);r.py=y;
    gliedMass(r);
    if(X&&r.id===X.wurzel){X.vonY=y;return}   // die Wurzel malt der Baum
    if(r.mini){const m=r.mini;if(m.rechts)stegZeile(mini,ml,mini,lerp(Math.min(W-52,cx+Rk+34),cx+r.tot/2+16,m.k),zy(i),lerp(0.62,0.16,m.k),m.a);
      else stegZeile(mini,ml,mini,cx,zy(i),lerp(0.8,0.16,m.k),m.a)}
    if(r.a>0.01){gliedMalen(r,x,y,r.rahmen?r.rahmen:r.da?1-k:0,r.a*aG);
      if(r.neu){ctx.globalAlpha=r.a*aG;label(T('neu').toUpperCase(),x-r.tot/2-9,y+4,8.5,C.plus,'right',1.4);ctx.globalAlpha=1}}});
  // der Pegel, darunter wie es dem Speicher geht
  if(G.pegel>0.01){const y=yk+Rk+22,x0=cx-Rk,x1=cx+Rk;ctx.globalAlpha=G.pegel*aG;
    ctx.strokeStyle=C.muted;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.moveTo(cx,y-5);ctx.lineTo(cx,y+5);ctx.stroke();
    label('−',x0-12,y+5,16,C.minus,'center');label('+',x1+12,y+5,16,C.plus,'center');
    ctx.fillStyle=lv>0.06?C.plus:lv<-0.06?C.minus:C.ink;ctx.beginPath();ctx.arc(cx+lv*Rk,y,6.5,0,6.283);ctx.fill();
    const zu=mood(lv).toUpperCase();let zeile=T('speicher').toUpperCase()+' · '+zu;ctx.font='10.5px '+C.sans;if(ctx.measureText(zeile).width+1.5*zeile.length>W-6)zeile=zu;
    ctx.globalAlpha=G.pegel*aG;label(zeile,cx,y+23,10.5,C.muted,'center',1.5);ctx.globalAlpha=1}
  // die Frage links von dir, die Antwort rechts
  const platz=cx-rm*2-14,schrift=t=>{let px=14.5;ctx.font='italic '+px+'px '+C.serif;const w=ctx.measureText(t).width;if(w>platz){px=Math.max(11.5,px*platz/w);ctx.font='italic '+px+'px '+C.serif}};
  ctx.fillStyle=C.ink;
  if(G.frage>0.01&&G.frageText){const t='„'+G.frageText+'“';schrift(t);ctx.globalAlpha=G.frage*aG;ctx.textAlign='right';ctx.fillText(t,cx-rm*2-10,my+5);ctx.globalAlpha=1}
  if(G.antw>0.01&&G.antwText){const t='„'+G.antwText+'“';schrift(t);ctx.globalAlpha=G.antw*aG;ctx.textAlign='left';ctx.fillText(t,cx+rm*2+10,my+5);ctx.globalAlpha=1}
  // eine Ladung wandert vom groben Träger zur genauen Adresse
  if(G.zug&&G.zug.von.py!==undefined){const Z=G.zug,xr=cx+Math.max(Z.von.tot,Z.an.tot)/2+16,k=Z.k;
    chargeDot(cx+Z.von.tot/2-12+(xr-(cx+Z.von.tot/2-12))*Math.sin(Math.PI*k),lerp(Z.von.py,Z.an.py,ease(k)),Z.sign,0.8)}
  // eine neue Ladung kommt von außen in den Träger
  if(G.dazu){const r=G.rows[G.dazu.row],k=G.dazu.k;chargeDot(lerp(W+12,cx+r.tot/2-11,ease(k)),zy(G.dazu.row)-Math.sin(Math.PI*k)*14,G.dazu.sign,lerp(1.0,0.6,k))}
  // auf die Frage steigt aus jedem Träger seine Ladung zu dir auf
  if(G.echo){const k=G.echo.k,er=G.rows[G.echo.i];chargeDot(cx,lerp(er&&er.py!==undefined?er.py:zy(G.echo.i),my,ease(k)),-1,0.8)}
  if(X)grobBaum(G)}
