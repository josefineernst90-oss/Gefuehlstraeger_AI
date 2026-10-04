/* ---------- Bühne „schloss“: dein Satz ist das Schloss, die Deutungen sind die Schlüssel. Welcher passt, zeigt das Gefühl. ---------- */
function schlossStart(s){const K=S.sk={plan:[],i:0,t:0,fertig:false,laeuft:false,buegel:0,ring:0,offen:0,drin:-1,duT:1,hell:0,sch:0,fuehl:'',fa:0,pos:[],
    keys:s.schluessel.map(q=>({q,ein:0,ta:0,f:0,d:0,turn:0,wort:0,blass:0,stoss:0}))};
  const add=(dur,run,start)=>K.plan.push({dur,run,start});
  add(0.4);add(0.6,k=>K.buegel=k);add(0.4);
  add(0.5,k=>K.ring=k);add(0.3);
  K.keys.forEach(e=>{add(0.4,k=>e.ein=ease(k));add(0.3,k=>e.ta=k)});
  add(0,null,()=>{K.fertig=true;say(satzVon(s,'tippen'),true);syncNav()})}
// einen Schlüssel probieren. Steckt noch der passende, kommt er zuerst wieder heraus.
function schlossTipp(s,i){const K=S.sk;if(!K||!K.fertig||!K.keys[i])return;if(K.laeuft){K.dann=i;return}if(K.drin===i)return;
  const e=K.keys[i],st=stOf(s);K.laeuft=true;K.plan=[];K.i=0;K.t=0;
  const add=(dur,run,start)=>K.plan.push({dur,run,start});
  if(K.drin>=0){const a=K.keys[K.drin];
    add(0.4,k=>{K.offen=1-k;a.turn=Math.PI*(1-k);K.hell=1-k;K.duT=k;K.fa=1-k});
    add(0.3,k=>a.d=16*(1-k));add(0.7,k=>a.f=1-k,()=>{K.drin=-1})}
  else if(K.fa>0)add(0.25,k=>K.fa=1-k);
  add(0.85,k=>e.f=k,()=>{e.blass=0});
  if(e.q.art==='zu'){
    add(0.5,k=>{e.stoss=Math.abs(Math.sin(k*Math.PI*2))},()=>{K.sch=0.5});
    add(0.35,k=>e.wort=k);add(0.5);
    add(0.7,k=>{e.f=1-k;e.blass=k})}
  else if(e.q.art==='klemmt'){
    add(0.25,k=>e.d=6*ease(k));add(0.25);
    add(0.2,k=>e.d=lerp(6,16,k),()=>{K.sch=1});add(0.3);
    add(1.0,k=>{e.turn=0.6*Math.sin(k*Math.PI*3)*(1-k*0.3);if(k<0.9)K.sch=Math.max(K.sch,0.7)});
    add(0.5,k=>{K.duT=1+0.9*k;K.fa=k},()=>{e.turn=0;K.fuehl=e.q.fuehlt});
    add(0.35,k=>e.wort=k);add(0.5);
    add(0.3,k=>e.d=16*(1-k));
    add(0.7,k=>{e.f=1-k;e.blass=k;K.duT=1.9-0.9*k;K.fa=1-k})}
  else{
    add(0.45,k=>e.d=16*ease(k));add(0.3);
    add(0.8,k=>e.turn=Math.PI*ease(k));
    add(0.4,k=>K.offen=ease(k),()=>{K.drin=i});add(0.2);
    add(0.7,k=>{K.duT=1-k;K.hell=k;K.fa=k},()=>{K.fuehl=e.q.fuehlt});
    add(0.35,k=>e.wort=k)}
  add(0,null,()=>{K.laeuft=false;const c=satzVon(s,e.q.art);if(c)say(c);if(e.q.art==='passt')st.offen=1;syncNav();
    const d=K.dann;K.dann=null;if(d!=null&&d!==i)schlossTipp(s,d)})}
function schluesselMalen(x,y,ang,sc,turn,bart,al,voll){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(sc,sc);ctx.globalAlpha=al;
  const c=Math.cos(turn),ry=Math.max(1,7*Math.abs(c));
  ctx.strokeStyle=C.ink;ctx.lineWidth=1.6;ctx.lineJoin='round';ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(31,0);ctx.stroke();
  ctx.beginPath();let px=30;ctx.moveTo(px,0);bart.forEach(h=>{ctx.lineTo(px,h*c);px-=4;ctx.lineTo(px,h*c)});ctx.lineTo(px,0);ctx.fillStyle=C.paper;ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.ellipse(0,0,7,ry,0,0,6.283);ctx.fillStyle=C.paper;ctx.fill();
  if(voll>0.01){ctx.globalAlpha=al*0.55*voll;ctx.fillStyle=C.plus;ctx.fill();ctx.globalAlpha=al}
  ctx.stroke();
  ctx.beginPath();ctx.ellipse(-1.5,0,2.3,Math.max(0.6,2.3*Math.abs(c)),0,0,6.283);ctx.fillStyle=C.bg;ctx.fill();ctx.stroke();
  ctx.lineCap='butt';ctx.restore()}
function drawSchloss(){const s=SLIDES[cur],K=S.sk;if(!K)return;
  const n=K.keys.length,oy=Math.max(0,(H-(130+42*n))*0.4),Wb=Math.min(W,480),xl=cx-Wb/2,xr=cx+Wb/2,rm=8,dux=xl+36,duy0=54+oy;
  // das Schloss: dein Satz, darüber der Bügel, unten das Schlüsselloch
  const satz=satzVon(s,'satz');let px=13.5;ctx.font='italic '+px+'px '+C.serif;let tw=ctx.measureText(satz).width;const platz=Wb-142;
  if(tw>platz){px=Math.max(11,px*platz/tw);ctx.font='italic '+px+'px '+C.serif;tw=ctx.measureText(satz).width}
  const bw=tw+52,bh=32,bx0=xr-14-bw,by0=44+oy,kx=bx0+bw-20,mund=by0+bh,zit=reduce?0:Math.sin(time*52)*2.2*K.sch,sx=bx0+bw/2+zit;
  // der Bund in deiner Hand
  const rx=dux+30,ry=duy0+4;
  // die Reihen
  const y0=124+oy,schritt=Math.min(42,(H-y0-6)/Math.max(1,n));K.pos=[];
  const malen=(e,i)=>{const yi=y0+schritt*(i+0.5)-3,hx=xl+24;K.pos[i]={x:(xl+xr)/2,y:yi,w:Wb-8,h:schritt};
    // vom Bund in die Reihe, von der Reihe zum Schloss
    const wA=Math.PI*(0.12+0.5*i/Math.max(1,n-1)),ax=rx+Math.cos(wA)*7,ay=ry+Math.sin(wA)*7;
    let x=lerp(ax,hx,e.ein),y=lerp(ay,yi,e.ein),ang=lerp(wA,0,e.ein),sc=lerp(0.42,1.2,e.ein);
    if(e.f>0){const zx=kx+zit*e.f,zy=mund+37-e.d-3*e.stoss,fy=ease(Math.min(1,e.f/0.55)),fx=ease(Math.max(0,(e.f-0.4)/0.6));x=lerp(hx,zx,fx);y=lerp(yi,zy,fy);ang=lerp(0,-Math.PI/2,fx)}
    if(K.ring>0.01)schluesselMalen(x,y,ang,sc,e.turn,e.q.bart,K.ring*(1-0.45*e.blass*(1-e.f)),K.drin===i?K.offen:0)};
  K.keys.forEach((e,i)=>{if(e.f<=0)malen(e,i)});K.keys.forEach((e,i)=>{if(e.f>0)malen(e,i)});
  // der Rest vom Bund
  if(K.ring>0.01){ctx.globalAlpha=K.ring;ctx.strokeStyle=C.muted;ctx.lineWidth=1.1;ctx.lineCap='round';
    for(let j=0;j<11;j++){const w=Math.PI*(-0.42+1.3*j/10),x0=rx+Math.cos(w)*7,y0b=ry+Math.sin(w)*7,x1=rx+Math.cos(w)*19,y1=ry+Math.sin(w)*19;
      ctx.beginPath();ctx.moveTo(x0,y0b);ctx.lineTo(x1,y1);ctx.lineTo(x1-Math.sin(w)*3.2,y1+Math.cos(w)*3.2);ctx.stroke()}
    ctx.lineCap='butt';ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(rx,ry,7,0,6.283);ctx.stroke();ctx.globalAlpha=1}
  // Bügel
  if(K.buegel>0.01){const t=9*K.offen,gy=by0-8-t,b=K.buegel;ctx.globalAlpha=Math.min(1,b*2);ctx.strokeStyle=C.ink;ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(sx-15,by0+2);ctx.lineTo(sx-15,lerp(by0,gy,b));ctx.arc(sx,lerp(by0,gy,b),15*b,Math.PI,0);ctx.lineTo(sx+15,lerp(by0,by0+2-t*1.35,b));ctx.stroke();ctx.lineCap='butt';ctx.globalAlpha=1}
  // Schlosskörper mit dem Satz
  const rr=7,X=bx0+zit;ctx.beginPath();ctx.moveTo(X+rr,by0);ctx.arcTo(X+bw,by0,X+bw,by0+bh,rr);ctx.arcTo(X+bw,by0+bh,X,by0+bh,rr);ctx.arcTo(X,by0+bh,X,by0,rr);ctx.arcTo(X,by0,X+bw,by0,rr);ctx.closePath();
  ctx.fillStyle=C.paper;ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=1.6;ctx.stroke();
  ctx.font='italic '+px+'px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='left';ctx.fillText(satz,X+12,by0+bh/2+px*0.34);
  if(K.buegel>0.01){ctx.globalAlpha=K.buegel;ctx.fillStyle=C.ink;ctx.beginPath();ctx.arc(kx+zit,mund-15,3.4,0,6.283);ctx.fill();
    ctx.strokeStyle=C.ink;ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(kx+zit,mund-15);ctx.lineTo(kx+zit,mund-1);ctx.stroke();ctx.globalAlpha=1}
  // du: dunkler, wenn es schwerer wird, hell, wenn der Schlüssel dreht
  const duy=duy0-4*K.hell+2*Math.max(0,K.duT-1);
  ctx.beginPath();ctx.arc(dux,duy,rm,0,6.283);ctx.fillStyle=C.paper;ctx.fill();
  if(K.duT>0.01){ctx.globalAlpha=Math.min(0.8,0.34*K.duT);ctx.fillStyle=C.minus;ctx.fill();ctx.globalAlpha=1}
  if(K.hell>0.01){ctx.globalAlpha=0.3*K.hell;ctx.fillStyle=C.plus;ctx.fill();ctx.globalAlpha=1}
  ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();figur(dux,duy,rm,1,0);
  label(T('du').toUpperCase(),dux,duy0-rm*2.1-11,9,C.ink,'center',1.6);
  if(K.fuehl&&K.fa>0.01){ctx.globalAlpha=K.fa;ctx.font='italic 13.5px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText(K.fuehl,Math.max(xl+34,dux),duy0+rm*2.3+20);ctx.globalAlpha=1}
  // die Deutungen neben den Schlüsseln, darunter das Ergebnis
  K.keys.forEach((e,i)=>{if(e.ta<=0.01)return;const q=K.pos[i],tx=xl+70,al=e.ta*(1-0.4*e.blass);let p2=14;ctx.font='italic '+p2+'px '+C.serif;const t='„'+e.q.text+'“',w=ctx.measureText(t).width,pl=xr-8-tx;
    if(w>pl){p2=Math.max(11.5,p2*pl/w);ctx.font='italic '+p2+'px '+C.serif}
    ctx.globalAlpha=al;ctx.fillStyle=C.ink;ctx.textAlign='left';ctx.fillText(t,tx,q.y+lerp(4,-1,ease(e.wort)));ctx.globalAlpha=1;
    if(e.wort>0.01){ctx.globalAlpha=e.wort;label(e.q.wort.toUpperCase(),tx+2,q.y+14,8.5,e.q.art==='passt'?C.plus:C.muted,'left',1.4);ctx.globalAlpha=1}})}
