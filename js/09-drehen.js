/* ---------- Bühne „drehen“: eine Aufgabe, darunter ihr Ladungsträger. Du drehst ihn um, die Aufgabe bleibt, wo sie ist. ---------- */
function drehenStart(s){const D=S.dr={plan:[],i:0,t:0,fertig:false,laeuft:false,schloss:1,blass:0,hell:1,duT:0,auf:0,faden:0,tr:0,w:0,n:0,ged:-1,ga:0,
    els:s.seiten.map(q=>({label:q.label,charges:zeichen(q.lad)}))};
  const add=(dur,run,start)=>D.plan.push({dur,run,start});
  add(0.6);add(0.7,k=>D.schloss=1-k);add(0.5,k=>{D.blass=k;D.hell=1-k});add(0.3);
  add(0.8,k=>D.auf=ease(k));add(0.3);
  add(0.45,k=>D.faden=k);add(0.5,k=>D.tr=k);add(0.4);
  add(0.45,k=>D.ga=k,()=>{D.ged=0});add(0.2);
  add(0.5,k=>D.duT=k);
  add(0,null,()=>{D.fertig=true;say(satzVon(s,'tippen'),true);syncNav()})}
function drehenTipp(s){const D=S.dr;if(!D||!D.fertig||D.laeuft||D.els.length<2)return;const st=stOf(s),von=D.w,ziel=(D.n+1)%2,d0=D.duT,h0=D.hell;
  D.laeuft=true;D.plan=[];D.i=0;D.t=0;const add=(dur,run,start)=>D.plan.push({dur,run,start});
  add(0.3,k=>D.ga=1-k);
  add(0.9,k=>D.w=von+Math.PI*ease(k));add(0.25);
  add(0.45,k=>D.ga=k,()=>{D.n=ziel;D.ged=ziel});add(0.2);
  add(0.6,k=>{D.duT=lerp(d0,ziel?0:1,k);D.hell=lerp(h0,ziel?1:0,k)});
  add(0,null,()=>{D.laeuft=false;st.gedreht=1;say(satzVon(s,'an'));syncNav()})}
function zeilen(t,breit){const ganz=ctx.measureText(t).width;if(ganz>breit)breit=Math.min(breit,ganz/Math.ceil(ganz/breit)*1.12);const w=t.split(' '),out=[];let z='';w.forEach(x=>{const n=z?z+' '+x:x;if(z&&ctx.measureText(n).width>breit){out.push(z);z=x}else z=n});if(z)out.push(z);return out}
function drawDrehen(){const s=SLIDES[cur],D=S.dr;if(!D)return;
  const oy=Math.max(0,(H-320)*0.4),Wb=Math.min(W,480),xl=cx-Wb/2,xr=cx+Wb/2,rm=8,dux=xl+36,duy0=54+oy;
  // das Schloss von eben: Bügel, Schlüssel und Bund gehen, übrig bleibt der gerahmte Ladungsträger
  const satz=satzVon(s,'satz');let px=13.5;ctx.font='italic '+px+'px '+C.serif;let tw=ctx.measureText(satz).width;const platz=Wb-142;
  if(tw>platz){px=Math.max(11,px*platz/tw);ctx.font='italic '+px+'px '+C.serif;tw=ctx.measureText(satz).width}
  const L=D.schloss,bw=tw+lerp(24,52,L),bh=32,bx0=xr-14-bw,by0=44+oy,kx=bx0+bw-20,mund=by0+bh,sx=bx0+bw/2,aS=lerp(1,0.26,D.blass);
  if(L>0.01){ctx.globalAlpha=L;schluesselMalen(kx,mund+37-16,-Math.PI/2,1.2,Math.PI,[3,6,4],L,1);
    const rx=dux+30,ry=duy0+4;ctx.globalAlpha=L;ctx.strokeStyle=C.muted;ctx.lineWidth=1.1;ctx.lineCap='round';
    for(let j=0;j<11;j++){const w=Math.PI*(-0.42+1.3*j/10),x0=rx+Math.cos(w)*7,y0=ry+Math.sin(w)*7,x1=rx+Math.cos(w)*19,y1=ry+Math.sin(w)*19;
      ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.lineTo(x1-Math.sin(w)*3.2,y1+Math.cos(w)*3.2);ctx.stroke()}
    ctx.lineCap='butt';ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(rx,ry,7,0,6.283);ctx.stroke();
    const gy=by0-8-9*L;ctx.globalAlpha=Math.min(1,L*2);ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(sx-15,by0+2);ctx.lineTo(sx-15,lerp(by0,gy,L));ctx.arc(sx,lerp(by0,gy,L),15*L,Math.PI,0);ctx.lineTo(sx+15,lerp(by0,by0+2-12,L));ctx.stroke();ctx.lineCap='butt';ctx.globalAlpha=1}
  ctx.globalAlpha=aS;rund(bx0,by0,bw,bh,7);ctx.fillStyle=C.paper;ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=1.6;ctx.stroke();
  ctx.font='italic '+px+'px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='left';ctx.fillText(satz,bx0+12,by0+bh/2+px*0.34);ctx.globalAlpha=1;
  if(L>0.01){ctx.globalAlpha=L;ctx.fillStyle=C.ink;ctx.beginPath();ctx.arc(kx,mund-15,3.4,0,6.283);ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(kx,mund-15);ctx.lineTo(kx,mund-1);ctx.stroke();ctx.globalAlpha=1}
  // du
  const duy=duy0-4*D.hell;ctx.beginPath();ctx.arc(dux,duy,rm,0,6.283);ctx.fillStyle=C.paper;ctx.fill();
  if(D.duT>0.01){ctx.globalAlpha=0.34*D.duT;ctx.fillStyle=C.minus;ctx.fill();ctx.globalAlpha=1}
  if(D.hell>0.01){ctx.globalAlpha=0.3*D.hell;ctx.fillStyle=C.plus;ctx.fill();ctx.globalAlpha=1}
  ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();figur(dux,duy,rm,1,0);
  label(T('du').toUpperCase(),dux,duy0-rm*2.1-11,9,C.ink,'center',1.6);
  // die Aufgabe: kommt von rechts und bleibt dann stehen
  const yA=140+oy,yC=190+oy;D.ziel={x:cx,y:yC,w:60};
  if(D.auf>0.01){const ax=lerp(xr+90,cx,D.auf);ctx.globalAlpha=Math.min(1,D.auf*1.5);label(T('aufgabe').toUpperCase(),ax,yA-22,8.5,C.muted,'center',1.5);
    ctx.globalAlpha=Math.min(1,D.auf*1.5);ctx.font='19px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText(satzVon(s,'aufgabe'),ax,yA);ctx.globalAlpha=1}
  if(D.faden>0.01){ctx.strokeStyle=C.muted;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(cx,yA+9);ctx.lineTo(cx,lerp(yA+9,yC-16,D.faden));ctx.stroke()}
  // ihr Ladungsträger: dreht sich um seine Achse, dahinter liegt die andere Seite
  if(D.tr>0.01&&D.els.length){const c=Math.cos(D.w),e=D.els[Math.round(D.w/Math.PI)%2];gliedMass(e);D.ziel.w=e.tot/2+22;
    ctx.save();ctx.translate(cx,yC);ctx.scale(Math.max(0.03,Math.abs(c)),1);gliedMalen(e,0,0,1,D.tr);ctx.restore()}
  // was du dabei denkst
  const q=s.seiten[D.ged];
  if(q&&D.ga>0.01){ctx.globalAlpha=D.ga;label(T('denken').toUpperCase(),cx,yC+38,9,C.muted,'center',1.5);
    ctx.font='italic 14.5px '+C.serif;const zz=zeilen('„'+q.text+'“',Wb-28);ctx.globalAlpha=D.ga;ctx.fillStyle=C.ink;ctx.textAlign='center';
    zz.forEach((z,i)=>ctx.fillText(z,cx,yC+58+i*19));ctx.globalAlpha=1}}
