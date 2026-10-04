/* ---------- Bühne „arbeit“: viele Inseln, dann sammelt die Zeit ---------- */
function ablauf(Z,dt){for(let g=0;Z.i<Z.plan.length&&g<400;g++){const p=Z.plan[Z.i];if(!p.on){p.on=true;if(p.start)p.start()}
  Z.t+=dt;dt=0;const k=reduce||!p.dur?1:Math.min(1,Z.t/p.dur);if(p.run)p.run(k);if(k<1)break;Z.i++;Z.t=0}}
function arbeitStart(s){S.ar=arbeitBau(s)}
function arbeitBau(s){const vor=SLIDES.find(x=>x.id===s.stand&&x!==s),el=(g,a)=>({id:g.id,label:g.label,charges:zeichen(g.lad),a,ein:1});
  const A=vor?arbeitBau(vor):{zoom:0,kan:0,ab:null,treffer:0,sch:0,k0:0,hoch:0,inseln:[],els:[],links:[],alle:[],name:0,nameText:'',alt:null,start:null};
  if(vor){A.plan.forEach(p=>{if(p.ende)return;if(p.start)p.start();if(p.run)p.run(1)});A.sch=0}
  A.plan=[];A.i=0;A.t=0;A.fertig=false;
  const add=(dur,run,start)=>A.plan.push({dur,run,start});
  // Teil 1: herauszoomen, die Inseln erscheinen, die Kanäle wachsen, der Tag läuft
  if(s.inselListe.length){
    A.inseln=s.inselListe.map(q=>Object.assign({},q,{a:q.da?1:0,treffer:q.geladen}));A.start=s.glieder[0]||null;
    const kommt=s.inselListe.filter(q=>q.schickt).map(q=>({id:q.id,label:q.label,lad:q.schickt}));
    A.alle=s.glieder.concat(kommt).map(g=>({label:g.label,charges:zeichen(g.lad)}));
    A.els=s.glieder.map(g=>el(g,1));A.nameText=satzVon(s,'name');
    add(1.5,k=>A.zoom=ease(k));add(0.3);
    A.inseln.filter(q=>!q.da).forEach(q=>add(0.35,k=>q.a=k));
    add(0.2);add(0.9,k=>A.kan=k);add(0.6);
    A.inseln.filter(q=>q.schickt).forEach((q,n)=>{const sign=(zeichen(q.schickt)[0]||{s:-1}).s;let j=0;
      add(0.85,k=>A.ab.k=k,()=>{A.ab={k:0,art:'kanal',von:q,sign};if(q.treffer>0)q.treffer--});
      add(0.4,null,()=>{A.ab=null;A.treffer++;A.sch=1});
      add(0.6,k=>A.ab.k=k,()=>{j=A.els.length;A.ab={k:0,art:'fall',j,sign}});
      add(0.4,k=>A.els[j].a=k,()=>{A.ab=null;A.els.push(el({id:q.id,label:q.label,lad:q.schickt},0))});
      if(A.els.length+n>0)add(0.45,k=>A.links[A.links.length-1].k=k,()=>A.links.push({a:j-1,b:j,k:0}));
      if(!n)add(0.5,k=>A.name=k);
      add(0.5)})}
  // Teil 2: die Inseln treten zurück, der Steg rückt in die Mitte. Dann schrumpft er Stufe um Stufe zu einem einzigen Träger.
  if(s.stufen.length){
    add(0.7,k=>A.k0=k);add(0.15);add(0.9,k=>A.hoch=ease(k));add(0.6);
    s.stufen.forEach(st=>{const n=st.ende?1:3,neu=Array.from({length:n},(_,i)=>({id:'t'+i,label:st.teil,charges:zeichen(st.lad),a:0,ein:i?0:1}));
      add(1.1,k=>{A.alt.k=ease(k);A.name=Math.min(A.name,1-k)},()=>{A.alt={els:A.els,links:A.links,alle:A.alle,k:0,a:1};A.els=neu;A.links=[];A.alle=neu.map(e=>({label:e.label,charges:e.charges}))});
      add(0.45,k=>{A.alt.a=1-k;neu[0].a=k},()=>{A.nameText=st.name;A.name=0});
      add(0.25,null,()=>{A.alt=null});
      for(let i=1;i<n;i++){add(0.6,k=>{neu[i].a=Math.min(1,k*2);neu[i].ein=ease(k)});
        add(0.35,k=>A.links[A.links.length-1].k=k,()=>A.links.push({a:i-1,b:i,k:0}))}
      if(st.name)add(0.45,k=>A.name=k);
      add(0.9)})}
  add(0,null,()=>{A.fertig=true;say(satzVon(s,'an'));syncNav()});A.plan[A.plan.length-1].ende=true;
  return A}
// eine Reihe Schwimmelemente um (x,y), als Ganzes mit sc verkleinert
function stegZeile(els,links,alle,x,y,sc,al){if(!els.length||al<=0.01)return;const z=stegZoom(alle),R=stegReihe(alle,z);
  ctx.save();ctx.translate(x,y);ctx.scale(z*sc,z*sc);ctx.translate(-cx,-y);
  const P=els.map((e,i)=>({x:R[i]+(1-e.ein)*W*0.7,y:y+stegBob(i)}));
  ctx.strokeStyle=C.ink;ctx.fillStyle=C.ink;ctx.lineWidth=1.6;ctx.lineCap='round';ctx.globalAlpha=al;
  links.forEach(l=>{const a=els[l.a],c=els[l.b];if(!a||!c||l.k<=0.01)return;gliedMass(a);gliedMass(c);
    const x0=P[l.a].x+a.tot/2+9,x1=P[l.b].x-c.tot/2-9,xe=lerp(x0,x1,l.k),ye=lerp(P[l.a].y,P[l.b].y,l.k);
    ctx.beginPath();ctx.moveTo(x0,P[l.a].y);ctx.lineTo(xe,ye);ctx.stroke();
    [[x0,P[l.a].y]].concat(l.k>=1?[[x1,P[l.b].y]]:[]).forEach(q=>{ctx.beginPath();ctx.arc(q[0],q[1],2.2,0,6.283);ctx.fill()})});
  ctx.lineCap='butt';ctx.globalAlpha=1;
  els.forEach((e,i)=>{gliedMass(e);gliedMalen(e,P[i].x,P[i].y,1,e.a*al)});
  ctx.restore()}
function drawArbeit(){const s=SLIDES[cur],A=S.ar;if(!A)return;
  const HA=H*0.66,yS=H*0.5,yRow=lerp(H-64,yS,A.hoch),aI=1-A.k0,zc=A.zoom;
  const z=A.alle.length?stegZoom(A.alle):1,R=A.alle.length?stegReihe(A.alle,z):[];
  let dux=cx,dumy=0;
  if(aI>0.01&&A.inseln.length){
    const RI=Math.max(72,Math.min(104,W*0.226)),DI=Math.max(RI+8,Math.min(W*0.25,190)),yI=Math.max(0,(H/2-178)/2)+76+RI;
    const xC=cx,yC=HA*0.54,rx=Math.min(W*0.39,230),ry=HA*0.33,rm=lerp(RZ,4.3,zc),gross=Math.max(0,1-zc*2.6),klein=Math.max(0,Math.min(1,(zc-0.65)/0.35));
    const du={x:lerp(cx-DI,xC,zc),y:lerp(yI,yC,zc),r:lerp(RI,24,zc)};du.my=du.y-du.r-2.3*rm;dux=du.x;dumy=du.my;
    const ort=q=>{const w=q.winkel*Math.PI/180,x=xC+Math.cos(w)*rx,y=yC+Math.sin(w)*ry,o=q.da?{x:lerp(cx+DI,x,zc),y:lerp(yI+q.geladen*4,y,zc),r:lerp(RI,17,zc)}:{x,y,r:17};o.my=o.y-o.r-2.3*rm;return o};
    const mann=(x,y,t,sch)=>{const fx=x+(reduce?0:Math.sin(time*46)*1.5*sch);ctx.beginPath();ctx.arc(fx,y,rm,0,6.283);ctx.fillStyle=C.paper;ctx.fill();
      if(t){ctx.globalAlpha=aI*Math.min(0.88,0.3*t);ctx.fillStyle=C.minus;ctx.fill();ctx.globalAlpha=aI}
      ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();figur(fx,y,rm,1,0);
      if(t>1){const hy=y-rm*1.65,m=t>2?7:4;ctx.strokeStyle=C.minus;ctx.lineWidth=1.4;ctx.lineCap='round';
        for(let q=0;q<m;q++){const w=-Math.PI*(0.08+0.84*q/(m-1)),r0=rm*0.85,r1=rm*(t>2?1.6:1.3);
          ctx.beginPath();ctx.moveTo(fx+Math.cos(w)*r0,hy+Math.sin(w)*r0);ctx.lineTo(fx+Math.cos(w)*r1,hy+Math.sin(w)*r1);ctx.stroke()}ctx.lineCap='butt'}};
    ctx.globalAlpha=aI;
    // das Meer unter den zwei großen Inseln, solange sie groß sind
    if(gross>0.01){ctx.globalAlpha=aI*gross*0.85;ctx.strokeStyle=C.minus;ctx.lineWidth=1.5;ctx.beginPath();
      for(let xx=0;xx<=W;xx+=5){const y=yI+RI*0.8+(reduce?0:Math.sin(xx*0.04+time*1.2)*2.4);xx?ctx.lineTo(xx,y):ctx.moveTo(xx,y)}ctx.stroke();ctx.globalAlpha=aI}
    // die Kanäle: von deinem Männchen zu jedem anderen
    const gap=lerp(9,2.6,zc);ctx.strokeStyle=C.muted;ctx.lineWidth=1.2;
    A.inseln.forEach(q=>{const o=ort(q),k=q.da?1:A.kan;if(k<=0.01||q.a<=0.01)return;const dx=o.x-du.x,dy=o.my-du.my,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,a0=rm*2.2,l=(L-2*a0)*k;
      [1,-1].forEach(v=>{ctx.beginPath();ctx.moveTo(du.x+ux*a0-uy*gap*v,du.my+uy*a0+ux*gap*v);ctx.lineTo(du.x+ux*(a0+l)-uy*gap*v,du.my+uy*(a0+l)+ux*gap*v);ctx.stroke()})});
    // die Inseln, darauf ihre Männchen, darunter ihre Namen
    const insel=(o,a)=>{ctx.globalAlpha=aI*a;ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,6.283);ctx.fillStyle=C.paper;ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke()};
    A.inseln.forEach(q=>{if(q.a<=0.01)return;const o=ort(q);insel(o,q.a);
      if(q.da&&gross>0.01&&q.hat){const e={label:q.hat,charges:zeichen(q.hatLad)};gliedMass(e);gliedMalen(e,o.x,o.y,0,aI*gross)}
      ctx.globalAlpha=aI*q.a;mann(o.x,o.my,q.treffer,0);
      if(q.da&&gross>0.01){ctx.globalAlpha=aI*gross;label(q.label.toUpperCase(),o.x+rm*1.8+7,o.my+4,10,C.ink,'left',2)}
      if(klein>0.01){ctx.globalAlpha=aI*q.a*klein;label(q.label.toUpperCase(),o.x,o.y+o.r+12,8.5,C.muted,'center',1.3)}});
    insel(du,1);
    if(gross>0.01&&A.start){const e={label:A.start.label,charges:zeichen(A.start.lad)};gliedMass(e);gliedMalen(e,du.x,du.y-15.5,0,aI*gross)}
    ctx.globalAlpha=aI;mann(du.x,du.my,A.treffer,A.sch);
    if(gross>0.01){ctx.globalAlpha=aI*gross;label(T('du').toUpperCase(),du.x-rm*1.8-7,du.my+4,10,C.ink,'right',2)}
    if(klein>0.01){ctx.globalAlpha=aI*klein;label(T('du').toUpperCase(),du.x+1,du.y+4,9.5,C.ink,'center',1.6)}
    ctx.globalAlpha=1;
    // eine Ladung läuft durch den Kanal zu dir
    if(A.ab&&A.ab.art==='kanal'){const o=ort(A.ab.von),k=A.ab.k;chargeDot(lerp(o.x,du.x,k),lerp(o.my,du.my,k),A.ab.sign,0.62)}}
  // das Wasser und dein Steg
  const klar=A.inseln.length?Math.max(0,Math.min(1,(zc-0.5)/0.5)):1;
  if(klar>0.01){ctx.strokeStyle=C.minus;ctx.lineWidth=1.5;ctx.globalAlpha=0.8*klar;ctx.beginPath();
    for(let xx=0;xx<=W;xx+=5){const y=yRow+20+(reduce?0:Math.sin(xx*0.045+time*1.3)*2.2);xx?ctx.lineTo(xx,y):ctx.moveTo(xx,y)}ctx.stroke();ctx.globalAlpha=1}
  // die Stufe davor: der ganze Steg schrumpft auf den Platz des ersten neuen Elements
  if(A.alt){const O=A.alt,zo=stegZoom(O.alle),Ro=stegReihe(O.alle,zo),n=O.alle.length,breit=(Ro[n-1]+(O.alle[n-1].tot+18)/2-(Ro[0]-(O.alle[0].tot+18)/2))*zo;
    const ziel=cx+(R[0]-cx)*z,f=(A.alle[0].tot+18)*z/breit;
    stegZeile(O.els,O.links,O.alle,lerp(cx,ziel,O.k),yRow,lerp(1,f,O.k),O.a*klar)}
  stegZeile(A.els,A.links,A.alle,cx,yRow,1,klar);
  if(A.ab&&A.ab.art==='fall'){const k=A.ab.k;chargeDot(lerp(dux,cx+(R[A.ab.j]-cx)*z,ease(k)),lerp(dumy,yRow,k*k),A.ab.sign,lerp(0.62,1.1,k))}
  // der Name des Stegs, unter dem Wasser
  if(A.nameText&&A.name>0.01){ctx.globalAlpha=A.name;ctx.font='italic 16px '+C.serif;const w=ctx.measureText(A.nameText).width;
    label(T('steg').toUpperCase(),cx-w/2-4,yRow+43,9,C.muted,'right',1.4);ctx.globalAlpha=A.name;
    ctx.font='italic 16px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='left';ctx.fillText(A.nameText,cx-w/2+4,yRow+43);ctx.globalAlpha=1}}
