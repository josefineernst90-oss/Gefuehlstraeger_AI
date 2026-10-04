/* ---------- Bühne „spitze“: die Linie klappt wieder zum Dreieck auf, du stehst oben bei der Metaphorik und siehst beide Ecken ---------- */
function spitzeStart(s){const P=S.sp={plan:[],i:0,t:0,fertig:false,k:1,auto:0,film:0,sl:0,ged:0,sr:0,min:0};
  const add=(dur,run,start)=>P.plan.push({dur,run,start});
  add(0.5);add(2.0,k=>P.k=1-ease(k));add(0.6);
  add(0.5,k=>P.auto=k);add(0.7);
  add(0.5,k=>P.film=k);add(0.9);
  add(0.8,k=>P.sl=ease(k));add(0.5,k=>P.ged=k);add(1.3);
  add(0.8,k=>P.sr=ease(k));add(0.5,k=>P.min=k);add(0.9);
  add(0,null,()=>{P.fertig=true;say(satzVon(s,'an'));syncNav()})}
function drawSpitze(){const s=SLIDES[cur],P=S.sp;if(!P)return;
  const r=9,b=Math.min(W-120,340),yT=76,yB=Math.max(yT+90,Math.min(H-64,yT+b*0.86)),L=cx-b/2,Rr=cx+b/2,gap=Math.max(30,b*0.16),k=P.k;
  const half=Math.min(W/2-10,b/2+46),ay=lerp(yT,yB,k),pL=lerp(cx-gap*0.2,cx-half,k),pR=lerp(cx+gap*0.2,cx+half,k),g2=gap/2*(1-k);
  // das Dreieck, aus der Linie aufgeklappt
  ctx.strokeStyle=C.ink;ctx.lineWidth=lerp(2,1.5,k);ctx.lineJoin='round';
  if(k<1){ctx.beginPath();ctx.moveTo(L,yB);ctx.lineTo(cx,ay);ctx.lineTo(Rr,yB);ctx.stroke()}
  ctx.beginPath();ctx.moveTo(Math.min(L,pL),yB);ctx.lineTo(cx-g2,yB);ctx.moveTo(cx+g2,yB);ctx.lineTo(Math.max(Rr,pR),yB);ctx.stroke();
  // dein Blick: die Seiten färben sich von der Spitze bis in die Ecke
  ctx.strokeStyle=C.plus;ctx.lineWidth=2.6;ctx.lineCap='round';
  [[P.sl,L],[P.sr,Rr]].forEach(([q,x])=>{if(q<=0.01)return;ctx.beginPath();ctx.moveTo(cx,ay);ctx.lineTo(lerp(cx,x,q),lerp(ay,yB,q));ctx.stroke()});ctx.lineCap='butt';
  ctx.strokeStyle=C.plus;ctx.lineWidth=3;[pL,pR].forEach(x=>{ctx.beginPath();ctx.moveTo(x,yB-16);ctx.lineTo(x,yB+16);ctx.stroke()});
  ctx.fillStyle=C.ink;[L,Rr].forEach(x=>{ctx.beginPath();ctx.arc(x,yB,4.5,0,6.283);ctx.fill()});
  ctx.fillStyle=C.plus;ctx.beginPath();ctx.arc(cx,ay,4.5,0,6.283);ctx.fill();
  label(T('denken').toUpperCase(),L,yB+26,11.5,C.ink,'center',2);label(T('gefuehl').toUpperCase(),Rr,yB+26,11.5,C.ink,'center',2);
  if(k<0.4){ctx.globalAlpha=1-k/0.4;label(T('taktversatz').toUpperCase(),cx,yB+26,9,C.muted,'center',1.4);ctx.globalAlpha=1}
  // du stehst auf der Metaphorik
  const my=ay-2.3*r-3;
  ctx.beginPath();ctx.arc(cx,my,r,0,6.283);ctx.fillStyle=C.paper;ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();figur(cx,my,r,1,0);
  label(T('metaphorik').toUpperCase(),cx,my-2.1*r-9,11.5,C.plus,'center',2);
  // die zwei Bilder, die du von hier schon gesehen hast
  if(P.auto>0.01){const x=cx-64,y=ay-17;ctx.globalAlpha=P.auto;ctx.fillStyle=C.gelb;ctx.strokeStyle=C.ink;ctx.lineWidth=1.4;ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(x-16,y);ctx.lineTo(x-16,y-7);ctx.lineTo(x-9,y-8);ctx.lineTo(x-5,y-14);ctx.lineTo(x+7,y-14);ctx.lineTo(x+11,y-8);ctx.lineTo(x+16,y-7);ctx.lineTo(x+16,y);ctx.closePath();ctx.fill();ctx.stroke();
    [-9,9].forEach(q=>{ctx.beginPath();ctx.arc(x+q,y,3.3,0,6.283);ctx.fillStyle=C.bg;ctx.fill();ctx.stroke()});
    ctx.globalAlpha=P.auto;label(satzVon(s,'autos').toUpperCase(),x,ay+3,8.5,C.muted,'center',1.3);ctx.globalAlpha=1}
  if(P.film>0.01){const fw=42,fh=28,x=cx+64,fy=ay-13-fh,r2=4.2,fm=fy+fh*0.78-2.3*r2;ctx.globalAlpha=P.film;
    ctx.fillStyle=C.paper;ctx.fillRect(x-fw/2,fy,fw,fh);ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.strokeRect(x-fw/2,fy,fw,fh);
    ctx.beginPath();ctx.arc(x,fm,r2,0,6.283);ctx.fillStyle=C.paper;ctx.fill();ctx.globalAlpha=P.film*0.7;ctx.fillStyle=C.plus;ctx.fill();ctx.globalAlpha=P.film;
    ctx.strokeStyle=C.ink;ctx.lineWidth=1.2;ctx.stroke();figur(x,fm,r2,1,0);
    ctx.globalAlpha=P.film;label(T('film').toUpperCase(),x,ay+3,8.5,C.muted,'center',1.3);ctx.globalAlpha=1}
  // unten links, was du denkst
  const bl=s.blasen[0];
  if(bl&&P.ged>0.01){let px=14;ctx.font='italic '+px+'px '+C.serif;const t='„'+bl.text+'“';let w=ctx.measureText(t).width;const platz=cx+b*0.18-8;
    if(w>platz){px=Math.max(11.5,px*platz/w);ctx.font='italic '+px+'px '+C.serif;w=ctx.measureText(t).width}
    ctx.globalAlpha=P.ged;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText(t,Math.max(w/2+6,L),yB+47);ctx.globalAlpha=1}
  // unten rechts, was du fühlst
  if(P.min>0.01){chargeDot(Rr,yB+44,-1,0.9*P.min)}}
