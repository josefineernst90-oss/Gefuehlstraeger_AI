/* ---------- Bühne „film“: eine fremde Geschichte kommt von der Seite an die Stelle, die das Ego zuhält ---------- */
function filmStart(s){const F=S.fi={plan:[],i:0,t:0,fertig:false,rahmen:0,blick:0,zeile:0,p1:null,bt:0,lacht:0,bl:-1,ba:0,zug:null,duT:1,hell:0,sch:0,
    elS:{label:satzVon(s,'satz'),charges:[{s:-1}]}};
  const add=(dur,run,start)=>F.plan.push({dur,run,start});
  // eine Zeile neben dir geht, die nächste kommt
  const zeile=i=>{if(!s.blasen[i])return;if(i)add(0.35,k=>F.ba=1-k);add(0.45,k=>F.ba=k,()=>{F.bl=i});};
  add(0.4);add(0.6,k=>F.rahmen=k);
  add(0.6,k=>F.blick=k);add(0.4);
  add(0.5,k=>F.zeile=k);add(0.5);
  add(0.7,k=>F.p1.k=k,()=>{F.p1={k:0}});
  add(1.0,null,()=>{F.p1=null;F.bt=-1});
  zeile(0);add(1.4);
  add(0.6,k=>F.bt=lerp(-1,1,k));
  add(0.9,k=>F.lacht=Math.min(1,k*3));
  zeile(1);add(1.8);
  // die fremde Lösung kommt bei dir an: von Männchen zu Männchen
  add(1.0,k=>F.zug.k=k,()=>{F.zug={k:0}});
  add(0.6,k=>{F.duT=1-k;F.hell=k},()=>{F.zug=null;F.sch=1});
  zeile(2);add(0.4);
  add(0,null,()=>{F.fertig=true;say(satzVon(s,'an'));syncNav()})}
function drawFilm(){const s=SLIDES[cur],F=S.fi;if(!F)return;
  const f=Math.max(1,Math.min(1.35,H/347)),rm=8,Wb=Math.min(W,480),xl=cx-Wb/2,xr=cx+Wb/2,dux=xl+Math.max(52,Wb*0.16),duy=56*f;
  const fw=Math.max(128,Math.min(170,Wb*0.38)),fh=fw*0.6,fx=xr-12-fw,fy0=16*f,ySatz=172*f;
  const gy=fy0+fh*0.82,r2=5.2,ax=fx+fw*0.28,bx=fx+fw*0.72,my=gy-2.3*r2;
  // du, mit dem Minus des Satzes im Bauch
  const zx=dux+(reduce?0:Math.sin(time*46)*1.5*F.sch);
  ctx.beginPath();ctx.arc(zx,duy,rm,0,6.283);ctx.fillStyle=C.paper;ctx.fill();
  if(F.duT>0.01){ctx.globalAlpha=0.34*F.duT;ctx.fillStyle=C.minus;ctx.fill();ctx.globalAlpha=1}
  if(F.hell>0.01){ctx.globalAlpha=0.3*F.hell;ctx.fillStyle=C.plus;ctx.fill();ctx.globalAlpha=1}
  ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();figur(zx,duy,rm,1,0);
  label(T('du').toUpperCase(),dux,duy-rm*2.1-7,9,C.ink,'center',1.6);
  // der Film: ein Bild im Rahmen, darin zwei Figuren
  if(F.rahmen>0.01){ctx.globalAlpha=F.rahmen;ctx.fillStyle=C.paper;ctx.fillRect(fx,fy0,fw,fh);ctx.strokeStyle=C.ink;ctx.lineWidth=1.6;ctx.strokeRect(fx,fy0,fw,fh);
    label(T('film').toUpperCase(),fx+7,fy0+14,8.5,C.muted,'left',1.5);ctx.globalAlpha=F.rahmen;
    ctx.strokeStyle=C.muted;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(fx+8,gy);ctx.lineTo(fx+fw-8,gy);ctx.stroke();
    [[ax,0],[bx,F.bt]].forEach(([x,t])=>{ctx.beginPath();ctx.arc(x,my,r2,0,6.283);ctx.fillStyle=C.paper;ctx.fill();
      if(t){ctx.globalAlpha=F.rahmen*Math.min(0.75,Math.abs(t)*0.75);ctx.fillStyle=t<0?C.minus:C.plus;ctx.fill();ctx.globalAlpha=F.rahmen}
      ctx.strokeStyle=C.ink;ctx.lineWidth=1.3;ctx.stroke();figur(x,my,r2,1,0)});
    // die eine Figur lacht: kleine Bögen neben dem Kopf
    if(F.lacht>0.01){ctx.globalAlpha=F.rahmen*F.lacht;ctx.strokeStyle=C.plus;ctx.lineWidth=1.4;ctx.lineCap='round';const hy=my-r2*1.65;
      [[-1,0],[1,0],[-1,1],[1,1]].forEach(([v,q])=>{const r0=r2*(1.25+q*0.55);ctx.beginPath();ctx.arc(bx,hy,r0,v<0?Math.PI*0.9:-Math.PI*0.25,v<0?Math.PI*1.25:Math.PI*0.1);ctx.stroke()});ctx.lineCap='butt'}
    ctx.globalAlpha=1;
    if(F.p1)chargeDot(lerp(ax,bx,ease(F.p1.k)),my-Math.sin(Math.PI*F.p1.k)*9,-1,0.5);
    if(F.zeile>0.01){ctx.globalAlpha=F.zeile;ctx.font='italic 12.5px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='right';ctx.fillText('„'+satzVon(s,'film')+'“',fx+fw,fy0+fh+15);ctx.globalAlpha=1}}
  // deine Blicklinie zum Film
  if(F.blick>0.01){const hx=dux+rm*0.6,hy=duy-rm*1.65,tx=fx-4,ty=fy0+fh*0.5;ctx.strokeStyle=C.ink;ctx.lineWidth=1.3;ctx.setLineDash([2,4]);
    ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(lerp(hx,tx,F.blick),lerp(hy,ty,F.blick));ctx.stroke();ctx.setLineDash([])}
  // was du dabei denkst und fühlst: eine Zeile nach der anderen
  const b=s.blasen[F.bl];
  if(b&&F.ba>0.01){ctx.globalAlpha=F.ba;label(b.tag,xl+12,duy+rm*2.3+24,9,C.muted,'left',1.5);ctx.globalAlpha=F.ba;
    let px=15;ctx.font='italic '+px+'px '+C.serif;const t='„'+b.text+'“',w=ctx.measureText(t).width,platz=Wb-24;if(w>platz){px=Math.max(12,px*platz/w);ctx.font='italic '+px+'px '+C.serif}
    ctx.fillStyle=C.ink;ctx.textAlign='left';ctx.fillText(t,xl+12,duy+rm*2.3+43+(fy0+fh+22>duy+rm*2.3+30&&w>fx-xl-24?fy0+fh+22-(duy+rm*2.3+30):0));ctx.globalAlpha=1}
  // dein Satz
  gliedMass(F.elS);gliedMalen(F.elS,cx,ySatz,1,1);
  // das Plus aus dem Film: von der Figur zu dir
  if(F.zug){const k=F.zug.k;chargeDot(lerp(bx,dux,ease(k)),lerp(my,duy,ease(k))-Math.sin(Math.PI*k)*16,1,lerp(0.5,0.85,k))}}
