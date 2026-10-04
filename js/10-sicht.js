/* ---------- Bühne „sicht“: von oben auf das Wasser. Was hinter der Insel des Kollegen liegt, siehst du erst, wenn deine Insel weitertreibt. ---------- */
function sichtStart(s){const V=S.si={plan:[],i:0,t:0,fertig:false,laeuft:false,satz:0,ab:null,duT:0,sch:0,kT:2,blick:0,nebel:0,da:false,ged:-1,ga:0,drift:0,spur:1,chefWort:0,ziel:null,
    um:0,blick2:0,nebel2:0,dicht2:1,da2:false,fall:null,els:[],link:0,name:0,gehoben:false,
    r:0,pa:0,pk:0,pT:0,schK:0,schP:0,dots:[],sagt:null,tor:0,blitz:0,blick3:0,nebel3:0,imp:[],hellD:0,ruh:0};
  const add=(dur,run,start)=>V.plan.push({dur,run,start});
  V.els=s.glieder.map((g,i)=>({label:g.label,charges:zeichen(g.lad),a:i&&!s.reihe?0:1}));
  if(s.aussen){   // Rückblick: die Reihe aus der Kette, ohne die nächste Insel. Was heute zu dir kam, kommt noch einmal, eins nach dem anderen.
    Object.assign(V,{duT:0,kT:2,da:true,drift:1,spur:0,um:1,r:1,imp:s.impulse.map(()=>({a:0,k:0,los:false,an:false}))});
    add(0.4);
    s.impulse.forEach((q,i)=>{const I=V.imp[i];
      add(0.4,k=>I.a=k);add(0.4);
      add(0.85,k=>I.k=k,()=>{I.los=true;if(q.art==='mensch')V.kT=Math.max(0,V.kT-1)});
      add(0.5,null,()=>{I.an=true;V.duT=Math.max(0,V.duT+(q.sign<0?1:-1));if(q.sign<0)V.sch=1;else V.hellD=1})});
    add(0.5);add(0.8,k=>V.ruh=k);
    add(0,null,()=>{V.fertig=true;stOf(s).verschoben=1;say(satzVon(s,'an'));syncNav()});return}
  if(s.reihe){   // beginnt, wie der Schritt mit data-rueck endet
    Object.assign(V,{duT:1,kT:1,da:true,drift:1,spur:0,um:1,blick2:1,nebel2:1,dicht2:0,da2:true,link:1,name:1,ged:1,ga:1,gehoben:true});
    add(0.6);add(0.6,k=>{V.blick2=1-k;V.nebel2=1-k;V.ga=1-k});add(0.2);
    add(2.0,k=>V.r=ease(k));add(0.4);
    // dieselbe Sekunde noch einmal: sein Träger ist noch nicht an deinem Steg, er ist wieder geladen
    add(0.5,k=>{V.link=1-k;V.name=1-k;if(V.els[1])V.els[1].a=1-k});
    add(0.5,k=>{V.duT=1-k;V.kT=1+k});add(0.3);
    add(0.5,k=>V.pa=k);add(0.5,k=>V.pk=k)}
  else if(s.rueck){   // beginnt, wie der Schritt davor endet
    Object.assign(V,{satz:1,duT:1,kT:1,blick:1,nebel:1,da:true,ged:0,ga:1,drift:1,chefWort:1});
    add(0.6);add(0.6,k=>{V.blick=1-k;V.nebel=1-k;V.spur=1-k;V.chefWort=1-k;V.satz=1-k;V.ga=1-k});add(0.2);
    add(1.8,k=>V.um=ease(k));add(0.4);
    add(0.7,k=>V.blick2=k);add(0.6,k=>V.nebel2=k);add(0.3,null,()=>{V.da2=true})}
  else{
    add(0.5);add(0.5,k=>V.satz=k);add(0.4);
    add(1.0,k=>V.ab.k=k,()=>{V.ab={k:0};V.kT=1});add(0.4,null,()=>{V.ab=null;V.duT=1;V.sch=1});
    add(0.7,k=>V.blick=k);add(0.6,k=>V.nebel=k);add(0.4,null,()=>{V.da=true});
    add(0.45,k=>V.ga=k,()=>{V.ged=0})}
  add(0,null,()=>{V.fertig=true;say(satzVon(s,'tippen'),true);syncNav()})}
function sichtTipp(s){const V=S.si;if(!V||!V.fertig||V.laeuft||s.reihe||s.aussen)return;if(s.rueck?V.gehoben:V.drift>0)return;const st=stOf(s);
  V.laeuft=true;V.plan=[];V.i=0;V.t=0;const add=(dur,run,start)=>V.plan.push({dur,run,start});
  if(s.rueck){V.gehoben=true;
    add(0.9,k=>V.dicht2=1-k);add(0.7);
    if(V.els[1]){add(0.9,k=>V.fall.k=k,()=>{V.fall={k:0}});add(0.4,k=>V.els[1].a=k,()=>{V.fall=null});add(0.45,k=>V.link=k);add(0.2)}
    add(0.5,k=>V.name=k);add(0.6);
    add(0.45,k=>V.ga=k,()=>{V.ged=1})}
  else{
    add(0.3,k=>V.ga=1-k);add(2.6,k=>V.drift=Math.max(0.001,ease(k)));add(0.5);
    add(0.5,k=>V.chefWort=k);add(0.7);
    add(0.45,k=>V.ga=k,()=>{V.ged=1})}
  add(0,null,()=>{V.laeuft=false;st.verschoben=1;say(satzVon(s,'an'));syncNav()})}
// die Kette: dieselbe Sekunde auf drei Arten. Jeder Tipp beginnt wieder beim Stand davor.
function ketteWahl(s,w){const V=S.si;if(!V||!V.fertig||V.laeuft)return;const st=stOf(s),e2=V.els[1];
  Object.assign(V,{kT:2,duT:0,pT:0,link:0,name:0,dots:[],sagt:null,tor:0,blitz:0,blick3:0,nebel3:0,fall:null,sch:0,schK:0,schP:0});if(e2)e2.a=0;say('');
  V.laeuft=true;V.plan=[];V.i=0;V.t=0;const add=(dur,run,start)=>V.plan.push({dur,run,start});
  const sagen=()=>{if(w.sagt){add(0.4,k=>V.sagt.a=k,()=>{V.sagt={text:w.sagt,a:0}});add(1.2)}};
  add(0.4);
  if(w.id==='rein'){
    add(0.9,k=>V.dots[0].k=k,()=>{V.dots=[{a:'K',b:'D',k:0,sign:-1,bis:1}];V.kT=1});
    add(0.5,null,()=>{V.dots=[];V.duT=1;V.sch=1});
    if(e2){add(0.7,k=>V.fall.k=k,()=>{V.fall={k:0}});add(0.35,k=>e2.a=k,()=>{V.fall=null});add(0.35,k=>V.link=k)}
    add(0.35,k=>V.name=k);add(0.7);
    add(0.9,k=>V.dots[0].k=k,()=>{V.dots=[{a:'D',b:'P',k:0,sign:-1,bis:1}]});
    add(0.5,null,()=>{V.dots=[];V.pT=1;V.schP=1});
    add(0.7,k=>V.blick3=k);add(0.6,k=>V.nebel3=k)}
  else if(w.id==='raus'){
    add(0.6,k=>V.dots[0].k=k,()=>{V.dots=[{a:'K',b:'D',k:0,sign:-1,bis:0.5}];V.kT=1.4});
    add(0.2);sagen();
    add(0.6,k=>V.dots[1].k=k,()=>V.dots.push({a:'D',b:'K',k:0,sign:1,bis:0.5}));
    add(0.5,k=>{V.blitz=1-k;V.kT=lerp(1.4,0.7,k)},()=>{V.dots=[];V.blitz=1})}
  else{
    sagen();add(0.4,k=>V.tor=k);
    add(0.7,k=>V.dots[0].k=k,()=>{V.dots=[{a:'K',b:'D',k:0,sign:-1,bis:0.8}]});
    add(0.6,k=>V.dots[0].k=1-k,()=>{V.sch=0.35});
    add(0.2,null,()=>{V.dots=[]})}
  const alle=s.wege.every(x=>x.id===w.id||(st.kanal||{})[x.id]),letzter=satzVon(s,'alle');
  add(0,null,()=>{st.kanal=st.kanal||{};st.kanal[w.id]=1;st.verschoben=1;say(w.cap);if(!(alle&&letzter))V.laeuft=false;syncNav()});
  if(alle&&letzter){add(3.2);add(0,null,()=>{V.laeuft=false;say(letzter);syncNav()})}}
function drawSicht(){const s=SLIDES[cur],V=S.si;if(!V)return;
  const f=Math.max(0.9,Math.min(1.3,W/358,H/347)),ox=cx-179*f,oy=s.aussen?Math.max(0,H*0.47-96*f):Math.max(0,(H-347*f)*0.4),rm=6.5,bob=q=>reduce?0:Math.sin(time*1.1+q)*1.5,u=V.um,r=V.r,bg=Math.sin(Math.PI*r);
  const K={x:lerp(lerp(189,95,u),222,r),y:lerp(lerp(122,60,u),138,r)+bob(1),r:22},Cf={x:lerp(lerp(297,292,u),310,r),y:lerp(lerp(146,56,u),138,r)+bob(2.3),r:17};
  const wA=lerp(Math.PI,2.049,V.drift),rA=lerp(125,149.8,V.drift),D={x:lerp(lerp(189+Math.cos(wA)*rA,175,u),134,r)-bg*70,y:lerp(lerp(122+Math.sin(wA)*rA,150,u),138,r)+bg*10+bob(4),r:22};
  const P={x:46,y:138+bob(5.5),r:20},wer={K,D,P,C:Cf};
  [K,Cf,D,P].forEach(o=>o.my=o.y-o.r-2.3*rm);
  V.ziel={x:ox+D.x*f,y:oy+(D.y-10)*f,r:44*f};
  ctx.save();ctx.translate(ox,oy);ctx.scale(f,f);
  const kanal=(a,b,k)=>{k=k===undefined?1:k;if(k<=0.01)return;const dx=b.x-a.x,dy=b.my-a.my,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,a0=rm*2.2,l=(L-2*a0)*k;ctx.strokeStyle=C.muted;ctx.lineWidth=1.2;
    [1,-1].forEach(v=>{ctx.beginPath();ctx.moveTo(a.x+ux*a0-uy*3.2*v,a.my+uy*a0+ux*3.2*v);ctx.lineTo(a.x+ux*(a0+l)-uy*3.2*v,a.my+uy*(a0+l)+ux*3.2*v);ctx.stroke()})};
  const insel=(o,al)=>{ctx.globalAlpha=al===undefined?1:al;ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,6.283);ctx.fillStyle=C.paper;ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();ctx.globalAlpha=1};
  const mann=(o,t,sch,al)=>{al=al===undefined?1:al;const x=o.x+(reduce?0:Math.sin(time*46)*1.5*sch);ctx.globalAlpha=al;ctx.beginPath();ctx.arc(x,o.my,rm,0,6.283);ctx.fillStyle=C.paper;ctx.fill();
    if(t>0.01){ctx.globalAlpha=al*Math.min(0.85,0.32*t);ctx.fillStyle=C.minus;ctx.fill();ctx.globalAlpha=al}
    ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();figur(x,o.my,rm,1,0);ctx.globalAlpha=1};
  // der Schatten hinter einer Insel, vom Kopf eines Männchens aus gesehen
  const schatten=(von,um,ro,dy)=>{const E={x:von.x,y:von.my-rm*1.65},O={x:um.x,y:um.y+(dy===undefined?-13:dy)},dE=Math.hypot(O.x-E.x,O.y-E.y),th=Math.atan2(O.y-E.y,O.x-E.x),half=Math.asin(Math.min(0.99,ro/dE)),lT=Math.sqrt(Math.max(1,dE*dE-ro*ro));
    const Q=v=>{const w=th+v*half,T={x:E.x+Math.cos(w)*lT,y:E.y+Math.sin(w)*lT};return [T,{x:T.x+Math.cos(w)*900,y:T.y+Math.sin(w)*900}]};
    return {E,O,th,a:Q(-1),b:Q(1)}};
  const nebel=(Q,al,dicht,wort)=>{if(al<=0.01)return;ctx.beginPath();ctx.moveTo(Q.a[0].x,Q.a[0].y);ctx.lineTo(Q.a[1].x,Q.a[1].y);ctx.lineTo(Q.b[1].x,Q.b[1].y);ctx.lineTo(Q.b[0].x,Q.b[0].y);ctx.closePath();
    ctx.globalAlpha=al*dicht;ctx.fillStyle=C.bg;ctx.fill();ctx.globalAlpha=0.15*al;ctx.fillStyle=C.muted;ctx.fill();ctx.globalAlpha=1;
    if(wort>0.01){ctx.globalAlpha=wort;label(satzVon(s,'verdeckt').toUpperCase(),Q.O.x+Math.cos(Q.th)*90,Q.O.y+Math.sin(Q.th)*90+3,8.5,C.muted,'center',1.6);ctx.globalAlpha=1}};
  const blick=(Q,k)=>{if(k<=0.01)return;ctx.strokeStyle=C.ink;ctx.lineWidth=1.2;ctx.setLineDash([2,4]);
    [Q.a,Q.b].forEach(([T,F])=>{const q=k*1.5;ctx.beginPath();ctx.moveTo(Q.E.x,Q.E.y);ctx.lineTo(lerp(Q.E.x,T.x,Math.min(1,q)),lerp(Q.E.y,T.y,Math.min(1,q)));
      if(q>1)ctx.lineTo(lerp(T.x,F.x,(q-1)*0.3),lerp(T.y,F.y,(q-1)*0.3));ctx.stroke()});ctx.setLineDash([])};
  // das Wasser
  ctx.strokeStyle=C.minus;ctx.lineWidth=1.3;ctx.globalAlpha=0.45;ctx.lineCap='round';
  [[24,58],[322,30],[26,214],[252,246],[322,262],[120,336],[22,268],[330,214]].forEach(([x,y],i)=>{ctx.beginPath();
    for(let q=0;q<=14;q+=2){const yy=y+Math.sin(q*0.9+(reduce?0:time*1.2)+i)*1.8;q?ctx.lineTo(x+q,yy):ctx.moveTo(x,yy)}ctx.stroke()});ctx.globalAlpha=1;ctx.lineCap='butt';
  // was hinter dem Kollegen liegt: die Insel des Chefs und sein Kanal, darin der Druck
  if(V.da){kanal(Cf,K);[0.2,0.42].forEach(q=>chargeDot(lerp(Cf.x,K.x,q),lerp(Cf.my,K.my,q),-1,0.5));
    insel(Cf);mann(Cf,0,0);label(satzVon(s,'chef').toUpperCase(),Cf.x,Cf.y+Cf.r+13,8.5,C.muted,'center',1.3);
    if(V.chefWort>0.01){ctx.globalAlpha=V.chefWort;ctx.font='italic 13px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='right';ctx.fillText(satzVon(s,'druck'),350,Cf.y+Cf.r+31);ctx.globalAlpha=1}}
  // dein Blick: am Kollegen vorbei. Dahinter der Schatten.
  const QA=schatten(D,K,31);nebel(QA,V.nebel,1,V.nebel*Math.max(0,1-V.drift*4));blick(QA,V.blick);
  // andersherum: was hinter dir liegt. Dein Steg auf dem Wasser.
  const sc=0.68,xS=lerp(272,150,r),yS=lerp(296,228,r),e1=V.els[0],e2=V.els[1];let x1=xS,x2=xS;
  if(V.da2&&e1){gliedMass(e1);if(e2)gliedMass(e2);const b1=e1.tot+18,b2=e2?e2.tot+18:0,ges=b1+(e2?22+b2:0);x1=-ges/2+b1/2;x2=ges/2-b2/2;
    ctx.save();ctx.translate(xS,yS);ctx.scale(sc,sc);
    if(e2&&V.link>0.01){const xa=x1+b1/2,xb=x2-b2/2;ctx.strokeStyle=C.ink;ctx.fillStyle=C.ink;ctx.lineWidth=1.6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(xa,0);ctx.lineTo(lerp(xa,xb,V.link),0);ctx.stroke();ctx.lineCap='butt';
      ctx.beginPath();ctx.arc(xa,0,2.2,0,6.283);ctx.fill();if(V.link>=1){ctx.beginPath();ctx.arc(xb,0,2.2,0,6.283);ctx.fill()}}
    gliedMalen(e1,x1,0,1,1);if(e2)gliedMalen(e2,x2,0,1,e2.a);ctx.restore();
    if(V.name>0.01){const nm=satzVon(s,'name');ctx.globalAlpha=V.name;ctx.font='italic 13px '+C.serif;const w=ctx.measureText(nm).width;label(T('steg').toUpperCase(),xS-w/2-3,yS+31,8,C.muted,'right',1.3);
      ctx.globalAlpha=V.name;ctx.font='italic 13px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='left';ctx.fillText(nm,xS-w/2+4,yS+31);ctx.globalAlpha=1}
    x2=xS+x2*sc}
  const QB=schatten(K,D,38);nebel(QB,V.nebel2,V.dicht2,V.nebel2*V.dicht2);blick(QB,V.blick2);
  // die Spur deiner Insel
  if(V.drift>0.001&&V.spur>0.01){ctx.globalAlpha=V.spur;ctx.strokeStyle=C.muted;ctx.lineWidth=1.2;ctx.setLineDash([3,5]);ctx.beginPath();
    for(let q=0;q<=20;q++){const k=V.drift*q/20,w=lerp(Math.PI,2.049,k),rr=lerp(125,149.8,k),x=189+Math.cos(w)*rr,y=122+Math.sin(w)*rr;q?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1}
  // der Kanal zwischen euch, der Kollege
  kanal(D,K);insel(K);mann(K,V.kT,V.schK);
  label(satzVon(s,'kollege').toUpperCase(),K.x,K.y+K.r+13,8.5,C.muted,'center',1.3);
  if(V.satz>0.01){ctx.globalAlpha=V.satz;ctx.font='italic 13px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText(satzVon(s,'satz'),K.x,K.my-rm*2.1-17);ctx.globalAlpha=1}
  // von der nächsten Insel aus: der Schatten hinter dir verdeckt den Kollegen und den Chef
  if(V.pa>0.01){const QC=schatten(P,D,34,-31);nebel(QC,V.nebel3,1,V.nebel3);blick(QC,V.blick3);
    kanal(P,D,V.pk);insel(P,V.pa);mann(P,V.pT,V.schP,V.pa);ctx.globalAlpha=V.pa;label(satzVon(s,'partner').toUpperCase(),P.x,P.y+P.r+13,8.5,C.muted,'center',1.3);ctx.globalAlpha=1}
  // Rückblick: was von außen kam. Dinge liegen als Zeichen auf dem Wasser, der Mensch ist die Insel nebenan. Von jedem führt ein Weg zu dir.
  if(s.aussen){const pfeil=(O,E)=>{const w=Math.atan2(E.y-O.y,E.x-O.x);ctx.beginPath();[-0.5,0.5].forEach(v=>{ctx.moveTo(E.x,E.y);ctx.lineTo(E.x-Math.cos(w+v)*6,E.y-Math.sin(w+v)*6)});ctx.stroke()};
    s.impulse.forEach((q,i)=>{const I=V.imp[i];if(!I||I.a<=0.01)return;let O;
      ctx.globalAlpha=I.a;ctx.strokeStyle=C.ink;ctx.fillStyle=C.ink;ctx.lineWidth=1.6;ctx.lineJoin='miter';
      if(q.art==='mensch'){O={x:K.x-rm*2.2,y:K.my};ctx.font='italic 13px '+C.serif;ctx.textAlign='center';ctx.fillText(q.text,K.x,K.my-rm*2.1-17)}
      else if(q.art==='bus'){const x=30,y=152;ctx.beginPath();ctx.moveTo(x+9,y);ctx.lineTo(x+9,y-17);ctx.stroke();
        ctx.beginPath();ctx.arc(x+9,y-25,8,0,6.283);ctx.fillStyle=C.paper;ctx.fill();ctx.stroke();
        ctx.font='600 10px '+C.sans;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText('H',x+9,y-21.5);
        label(q.label.toUpperCase(),12,y+15,8.5,C.muted,'left',1.3);O={x:x+21,y:y-27}}
      else if(q.art==='film'){const x=D.x-17,y=12;ctx.fillStyle=C.paper;ctx.fillRect(x,y,34,24);ctx.strokeRect(x,y,34,24);
        ctx.beginPath();ctx.arc(x+17,y+11,3,0,6.283);ctx.stroke();figur(x+17,y+11,3,1,0);ctx.lineWidth=1.6;
        label(q.label.toUpperCase(),x+41,y+15,8.5,C.muted,'left',1.3);O={x:D.x,y:y+28}}
      else{const x=38,y=62;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-27);ctx.lineTo(x+14,y-27);ctx.lineTo(x+14,y);ctx.stroke();
        label(q.label.toUpperCase(),x+7,y-34,8.5,C.muted,'center',1.3);O={x:x+20,y:y-7}}
      const dx=O.x-D.x,dy=O.y-D.my,L=Math.hypot(dx,dy)||1,E={x:D.x+dx/L*19,y:D.my+dy/L*19};I.O=O;I.E=E;
      // der Weg: wächst mit der Ladung und bleibt stehen, mit einer Spitze bei dir
      if(I.los){const kk=I.an?1:ease(I.k);ctx.globalAlpha=I.a;ctx.strokeStyle=C.muted;ctx.lineWidth=1.2;
        if(q.art!=='mensch'){ctx.setLineDash([2,4]);ctx.beginPath();ctx.moveTo(O.x,O.y);ctx.lineTo(lerp(O.x,E.x,kk),lerp(O.y,E.y,kk));ctx.stroke();ctx.setLineDash([])}
        if(I.an){ctx.strokeStyle=C.ink;ctx.lineWidth=1.3;ctx.lineCap='round';pfeil(O,E);ctx.lineCap='butt'}}
      ctx.globalAlpha=1});
    // zurück zu dir: alles andere tritt zurück
    if(V.ruh>0.01){ctx.globalAlpha=0.66*V.ruh;ctx.fillStyle=C.bg;ctx.fillRect(-3000,-3000,6000,6000);ctx.globalAlpha=1}}
  // du
  insel(D);mann(D,V.duT,V.sch);label(T('du').toUpperCase(),D.x+1,D.y+4,9.5,C.ink,'center',1.6);
  if(V.hellD>0.01){ctx.globalAlpha=V.hellD;ctx.strokeStyle=C.plus;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(D.x,D.my,8+13*(1-V.hellD),0,6.283);ctx.stroke();ctx.globalAlpha=1}
  if(s.aussen)s.impulse.forEach((q,i)=>{const I=V.imp[i];if(I&&I.los&&!I.an&&I.O){const k=ease(I.k);chargeDot(lerp(I.O.x,I.E.x,k),lerp(I.O.y,I.E.y,k),q.sign,0.62)}});
  // das Tor an deinem Ende des Kanals
  if(V.tor>0.01){const dx=K.x-D.x,dy=K.my-D.my,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,gx=D.x+ux*(rm*2.2+5),gy=D.my+uy*(rm*2.2+5);ctx.globalAlpha=V.tor;ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(gx-uy*9,gy+ux*9);ctx.lineTo(gx+uy*9,gy-ux*9);ctx.stroke();ctx.lineCap='butt';ctx.globalAlpha=1}
  // Ladungen unterwegs: von Männchen zu Männchen
  if(V.ab){const k=ease(V.ab.k);chargeDot(lerp(K.x,D.x,k),lerp(K.my,D.my,k),-1,0.62)}
  V.dots.forEach(d=>{const a=wer[d.a],b=wer[d.b],k=ease(d.k)*d.bis;chargeDot(lerp(a.x,b.x,k),lerp(a.my,b.my,k),d.sign,0.62)});
  if(V.blitz>0.01){const mx=(K.x+D.x)/2,my=(K.my+D.my)/2;ctx.globalAlpha=V.blitz;ctx.strokeStyle=C.plus;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(mx,my,6+14*(1-V.blitz),0,6.283);ctx.stroke();ctx.globalAlpha=1}
  if(V.fall){const k=V.fall.k;chargeDot(lerp(D.x,x2,ease(k)),lerp(D.my,yS,k*k),-1,lerp(0.62,0.8,k))}
  // was du sagst
  if(V.sagt&&V.sagt.a>0.01){ctx.globalAlpha=V.sagt.a;ctx.font='italic 13.5px '+C.serif;const t='„'+V.sagt.text+'“',hw=ctx.measureText(t).width/2;ctx.fillStyle=C.ink;ctx.textAlign='center';
    ctx.fillText(t,Math.max(hw+6,Math.min(352-hw,D.x)),D.my-rm*2.1-18);ctx.globalAlpha=1}
  // was du denkst
  const bl=s.blasen[V.ged];
  if(bl&&V.ga>0.01){ctx.font='italic 14px '+C.serif;const t='„'+bl.text+'“',hw=ctx.measureText(t).width/2,links=u>0.5;
    const bx=links?12+hw:Math.max(hw+8,Math.min(350-hw,D.x)),by=links?D.y+22:D.y+D.r+17;
    ctx.globalAlpha=V.ga;label(bl.tag,bx,by,8.5,C.muted,'center',1.5);ctx.globalAlpha=V.ga;ctx.font='italic 14px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText(t,bx,by+18);ctx.globalAlpha=1}
  ctx.restore()}
