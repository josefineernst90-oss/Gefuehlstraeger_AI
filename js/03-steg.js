/* ---------- Schwimmsteg ----------
   Verbundene Ladungsträger als Schwimmelemente in einer Reihe, auf dem Wasser. Dasselbe Bild dient dem Übergang aus dem Speicher (k2 bis k5
   laufen dort von 0 nach 1) und der Bühne „Steg“. */
function stegKette(){if(!S.steg.length)return [];const ids=[S.steg[0].a];
  for(let g=0;g<20;g++){const l=S.steg.find(l=>l.a===ids[ids.length-1]&&!ids.includes(l.b));if(!l)break;ids.push(l.b)}return ids}
function gliedMass(e){ctx.font='italic 14px '+C.serif;e.tw=ctx.measureText(e.label).width;e.ws=e.charges.map(ch=>ch.big?17:11);
  e.bw=Math.max(11,e.ws.reduce((a,b)=>a+b,0))+10;e.tot=e.tw+7+e.bw;return e.tot}
function rund(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
// ein Glied: Bezeichnung |Ladungen|, als Schwimmelement mit Rahmen
function gliedMalen(e,x,y,rahmen,al){const x0=x-e.tot/2,bx=x0+e.tw+7;al=al===undefined?1:al;if(al<=0.01)return;
  ctx.globalAlpha=al;
  if(rahmen>0.01){ctx.globalAlpha=rahmen*al;ctx.fillStyle=C.paper;ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;rund(x0-9,y-15,e.tot+18,30,7);ctx.fill();ctx.stroke();ctx.globalAlpha=al}
  ctx.font='italic 14px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='left';ctx.fillText(e.label,x0,y+5);
  ctx.strokeStyle=C.plus;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx,y-9);ctx.lineTo(bx,y+9);ctx.moveTo(bx+e.bw,y-9);ctx.lineTo(bx+e.bw,y+9);ctx.stroke();
  let gx=bx+5;e.charges.forEach((ch,i)=>{const hw=ch.big?6:3.5,mx=gx+e.ws[i]/2;ctx.strokeStyle=ch.s>0?C.plus:C.minus;ctx.lineWidth=ch.big?2.4:1.8;
    ctx.beginPath();ctx.moveTo(mx-hw,y);ctx.lineTo(mx+hw,y);if(ch.s>0){ctx.moveTo(mx,y-hw);ctx.lineTo(mx,y+hw)}ctx.stroke();gx+=e.ws[i]});ctx.globalAlpha=1}
// o.k2: wie weit die Glieder in der Reihe liegen (von o.start aus) · k3: Rahmen · k4: Wasser · k5: Name
// die Plätze der Glieder in einer Reihe, um die Mitte
// passt die Reihe nicht in die Breite, wird der Steg als Ganzes kleiner gezeichnet (z)
function stegZoom(els){els.forEach(gliedMass);return Math.min(1,(W-12)/(els.reduce((a,e)=>a+e.tot+18,0)+8*(els.length-1)))}
function stegReihe(els,z){els.forEach(gliedMass);const n=els.length,breit=els.reduce((a,e)=>a+e.tot+18,0);
  const gap=Math.max(8,Math.min(22,(W/(z||1)-8-breit)/Math.max(1,n-1)));let x=cx-(breit+gap*(n-1))/2;
  return els.map(e=>{const r=x+(e.tot+18)/2;x+=e.tot+18+gap;return r})}
const stegBob=i=>reduce?0:Math.sin(time*1.5+i*1.1)*2.2;
// o.rx, o.ys: eigene Plätze je Glied · o.kl: wie weit das letzte Verbindungsstück gewachsen ist
function stegBild(els,o){const n=els.length,yS=H*0.5,R=o.rx||stegReihe(els),z=o.z||1;els.forEach((e,i)=>{gliedMass(e);e.rx=R[i]});
  ctx.save();ctx.translate(cx,yS);ctx.scale(z,z);ctx.translate(-cx,-yS);
  const pos=els.map((e,i)=>{const s0=o.start?o.start[i]:null,bob=stegBob(i)*o.k4,y1=o.ys?o.ys[i]:yS;
    return {x:s0?lerp(s0.x,e.rx,o.kx===undefined?o.k2:o.kx):e.rx,y:(s0?lerp(s0.y,y1,o.ky===undefined?o.k2:o.ky):y1)+bob+(e.d||0)}});
  // das Wasser: eine Wellenlinie, die sich unter jedem eintauchenden Glied senkt
  if(o.k4>0.01){ctx.strokeStyle=C.minus;ctx.lineWidth=1.5;ctx.globalAlpha=0.8;ctx.beginPath();
    for(let j=0,x0=cx-cx/z,xx=x0;xx<=x0+W/z*o.k4;xx+=5,j++){let y=yS+20+(reduce?0:Math.sin(xx*0.045+time*1.3)*2.2);
      els.forEach((e,i)=>{const dx=(xx-pos[i].x)/55;y+=(e.d||0)*0.6*Math.exp(-dx*dx)});j?ctx.lineTo(xx,y):ctx.moveTo(xx,y)}
    ctx.stroke();ctx.globalAlpha=1}
  // Verbindungsstücke: im Speicher ein Bügel rechts, in der Reihe ein kurzes gerades Stück von Glied zu Glied
  ctx.strokeStyle=C.ink;ctx.fillStyle=C.ink;ctx.lineWidth=1.6;ctx.lineCap='round';
  for(let i=0;i<n-1;i++){const a=els[i],b=els[i+1],A=pos[i],B=pos[i+1];
    const x0=A.x+a.tot/2+lerp(5,9,o.k2),x1=lerp(B.x+b.tot/2+5,B.x-b.tot/2-9,o.k2),xc=lerp(Math.max(A.x+a.tot/2,B.x+b.tot/2)+22,(x0+x1)/2,o.k2);
    if(o.kl!==undefined&&i===n-2){if(o.kl<=0.01)continue;const xe=lerp(x0,x1,o.kl),ye=lerp(A.y,B.y,o.kl);
      ctx.beginPath();ctx.moveTo(x0,A.y);ctx.lineTo(xe,ye);ctx.stroke();
      [[x0,A.y]].concat(o.kl>=1?[[x1,B.y]]:[]).forEach(q=>{ctx.beginPath();ctx.arc(q[0],q[1],2.2,0,6.283);ctx.fill()});continue}
    ctx.beginPath();ctx.moveTo(x0,A.y);ctx.quadraticCurveTo(xc,(A.y+B.y)/2,x1,B.y);ctx.stroke();
    [[x0,A.y],[x1,B.y]].forEach(q=>{ctx.beginPath();ctx.arc(q[0],q[1],2.2,0,6.283);ctx.fill()})}
  ctx.lineCap='butt';
  els.forEach((e,i)=>gliedMalen(e,pos[i].x,pos[i].y,o.k3));
  ctx.restore();
  if(o.k5>0.01&&o.name){ctx.globalAlpha=o.k5;label(T('steg').toUpperCase(),cx,yS-50,9.5,C.muted,'center',1.5);
    ctx.globalAlpha=o.k5;ctx.font='italic 18px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText(o.name,cx,yS-30);ctx.globalAlpha=1}
  return pos.map(q=>({x:cx+(q.x-cx)*z,y:yS+(q.y-yS)*z}))}
// liegt über drawSpeicher: alles tritt zurück, nur die verbundenen Ladungsträger bleiben und werden zum Steg
function drawZumSteg(){const Z=S.zs,T=Z.T;if(T<0.3)return;
  ctx.globalAlpha=ease((T-0.3)/1.0);ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;
  stegBild(Z.els,{kx:ease((T-1.6)/0.8),ky:ease((T-2.3)/0.8),k2:ease((T-1.6)/1.5),k3:ease((T-3.1)/0.7),k4:ease((T-4.0)/0.9),k5:ease((T-5.1)/0.6),name:satzVon(SLIDES[cur],'name'),
    start:Z.els.map(e=>{const c=carrier(e.id);return c?{x:c.x,y:c.y}:{x:cx,y:cy}})})}
function drawSteg(){const s=SLIDES[cur],G=S.sg;if(!G)return;const N=G.neu,o={k2:1,k3:1,k4:1,k5:1,name:satzVon(s,'name')};
  if(!N){G.pos=stegBild(G.els,o);return}
  const n=G.els.length,yS=H*0.5,yB=yS+NEU.tief,amSteg=N.ph==='dockt'||N.ph==='bindet'||N.ph==='dran'||N.ph==='loest';
  const D=k=>reduce?1:Math.max(0,Math.min(1,N.t/k));
  // das kleine Wasser unter dem einzelnen Element
  const wasser=(x,a)=>{if(a<=0.01)return;gliedMass(N.el);const b=N.el.tot/2+26;ctx.strokeStyle=C.minus;ctx.lineWidth=1.5;ctx.globalAlpha=0.8*a;ctx.beginPath();
    for(let xx=-b;xx<=b;xx+=5){const y=yB+20+(reduce?0:Math.sin((x+xx)*0.045+time*1.3)*2.2);xx>-b?ctx.lineTo(x+xx,y):ctx.moveTo(x+xx,y)}ctx.stroke();ctx.globalAlpha=1};
  // andocken in drei Zügen, einer nach dem anderen: der Steg macht Platz (ks) · das Element rückt unter den freien Platz (kx) · es steigt in die Reihe (ky)
  if(amSteg){const alle=G.els.concat([N.el]),z3=stegZoom(G.els),z4=stegZoom(alle),R3=stegReihe(G.els,z3),R4=stegReihe(alle,z4);
    const ks=ease(N.k/0.32),kx=ease((N.k-0.32)/0.34),ky=ease((N.k-0.66)/0.34),z=lerp(z3,z4,ks),xN=lerp(cx,R4[n],kx);
    wasser(cx+(xN-cx)*z,1-ky);
    G.pos=stegBild(alle,Object.assign(o,{z,rx:alle.map((e,i)=>i<n?lerp(R3[i],R4[i],ks):xN),ys:alle.map((e,i)=>i<n?yS:lerp(yS+NEU.tief/z,yS,ky)),kl:N.kv}))}
  else{G.pos=stegBild(G.els,o);
    if(N.ph!=='fern'&&N.ph!=='weg'){gliedMass(N.el);const aus=W+N.el.tot/2+30,k=D(NEU.kommt),g=D(NEU.treibt);
      const x=N.ph==='kommt'?lerp(aus,cx,1-(1-k)*(1-k)):N.ph==='treibt'?lerp(cx,-N.el.tot/2-30,g*g):cx;
      wasser(x,1);gliedMalen(N.el,x,yB+stegBob(n)+N.el.d,1)}}
  // der Gedanke unter dem Element
  if(N.ph==='denkt'&&N.ziel&&!reduce){const a=Math.min(1,N.t/0.35,(NEU.denkt-N.t)/0.3);if(a>0.01){ctx.globalAlpha=a;
    label(T('denken').toUpperCase(),cx,yB+46,9.5,C.muted,'center',1.5);ctx.globalAlpha=a;
    ctx.font='italic 16px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText('„'+N.ziel.text+'“',cx,yB+66);ctx.globalAlpha=1}}}
