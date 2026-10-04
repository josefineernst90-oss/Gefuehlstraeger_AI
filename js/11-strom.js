/* ---------- Bühne „strom“: etwas zieht an dir vorbei, und du zählst, worauf du achtest ---------- */
/* Übergang aus dem Ring (data-uebergang="ring"), nur direkt aus dem Schritt davor. Eins nach dem anderen: der Ring tritt zurück, es bleiben du und
   .satz data-id="vorher" unter der Bühne · unter dir erscheint .satz data-id="vorbei" · der Satz wird zu einem Stück Zeitlinie unter deinen Füßen ·
   die Zeitlinie wächst über die ganze Breite · du gehst mit ihr an deinen Platz · Zähler und Zeichen erscheinen. Erst danach kommen Text und Lesepause. */
const UE={a:0.9,b0:1.2,b:0.5,c0:3.8,c:0.8,d0:4.7,d:0.7,e0:5.6,e:1.0,f0:6.8,f:0.7,ende:7.6};
function stromStart(s,prev){const tag=s.dinge.some(d=>!['auto','mensch'].includes(d.art)),menschen=!tag&&s.dinge.some(d=>d.art==='mensch');
  // tag: was vorbeizieht, sind die Zeichen des Tages (wie auf den Zeitlinien der Bühne „zwei“). Was sie tragen, fliegt zu dir (flug) und färbt kurz deinen Bauch (hell).
  S.sr={an:false,objs:[],next:0,zeit:0,alle:0,ges:0,zeile:null,fall:null,traeger:{label:s.traeger,charges:[]},blink:0,gesagt:false,rest:false,
    v:tag?70:menschen?58:78,takt:tag?1.7:menschen?3.3:1.2,menschen,tag,flug:[],hell:0,hellS:1};
  // ohne Bewegung: eine stehende Reihe
  if(reduce)stromStill(s);
  // die Zeichen des Tages stehen schon auf der Zeitlinie, wenn der Schritt beginnt. Nach der Lesepause ziehen sie los.
  else if(tag){const R=S.sr,ab=R.v*R.takt;let x=Math.max(56,W*0.2)+130;for(;x<W+40;x+=ab)R.objs.push({d:s.dinge[R.next++%s.dinge.length],x,gez:false,hell:0});R.zeit=(x-W-40)/R.v}
  if(s.vomRing&&!reduce&&S.ringEnde&&prev===SLIDES.indexOf(s)-1){S.sr.ue={t:0,hs:S.ringEnde,leer:false};say(satzVon(s,'vorher'))}}
function stromStill(s){const R=S.sr;R.objs=s.dinge.map((d,i)=>({d,x:W*0.34+i*(W*(R.tag?0.52:0.62)/Math.max(1,s.dinge.length-1)),gez:true,hell:0}));
  R.alle=s.dinge.filter(d=>d.passt).length;R.ges=R.an?R.alle:0;
  if(s.traeger)R.traeger.charges=R.an?s.dinge.filter(d=>d.passt).map(()=>({s:-1})):s.dinge.filter(d=>d.sign).map(d=>({s:d.sign}))}
function stromAn(s){const R=S.sr;if(!R||R.an)return;R.an=true;say('');if(reduce){stromStill(s);say(satzVon(s,'an'));stOf(s).gerichtet=1}}
function stromTakt(s,dt,liest){const R=S.sr,mx=Math.max(56,W*0.2),st=stOf(s);R.blink*=Math.pow(0.05,dt);
  if(R.zeile){R.zeile.t+=dt;if(R.zeile.t>R.takt*0.86)R.zeile=null}
  if(R.fall){R.fall.k+=dt/0.6;if(R.fall.k>=1){if(R.traeger.charges.length<7)R.traeger.charges.push({s:R.fall.sign});R.fall=null}}
  R.hell*=Math.pow(0.3,dt);R.flug.forEach(f=>{f.k+=dt/0.55;if(f.k>=1){R.hell=1;R.hellS=f.sign}});R.flug=R.flug.filter(f=>f.k<1);
  if(R.ue){const U=R.ue;U.t+=dt;if(!U.leer&&U.t>=UE.e0){U.leer=true;say('')}
    if(U.t>=UE.ende){R.ue=null;$('text').classList.remove('warte');S.lese=lesezeit();const how=s.sec.querySelector(':scope > .hinweis');if(how)say(how.textContent,true);syncNav()}
    return}
  if(liest||reduce)return;
  R.zeit-=dt;if(R.zeit<=0){R.zeit=R.takt;R.objs.push({d:s.dinge[R.next%s.dinge.length],x:W+40,gez:false,hell:0});R.next++}
  R.objs.forEach(o=>{o.x-=R.v*dt;
    if(!o.gez&&o.x<=mx+(R.tag?74:R.menschen?RZ*3.6:26)){o.gez=true;const merkt=R.an&&o.d.passt;
      if(o.d.passt)R.alle++;if(merkt){R.ges++;o.hell=1;R.blink=1}
      // die Zeichen des Tages: was stört, kommt von selbst an. Was guttut, nur, wenn du darauf achtest.
      if(R.tag&&o.d.sign&&(merkt||o.d.sign<0))R.flug.push({k:0,sign:o.d.sign,x:o.x+4,y:Math.max(108,H*0.4)-12});
      if(o.d.text){R.zeile={text:o.d.text,t:0,merkt,blass:R.an&&!o.d.passt};
        if(merkt&&s.traeger)R.fall={k:0,sign:-1};
        else if(!R.an&&o.d.sign&&s.traeger)R.fall={k:0,sign:o.d.sign}}   // ohne den gerichteten Blick kommt an, was der Satz von sich aus trägt
      if(R.an){if(R.ges>=2&&!R.gesagt){R.gesagt=true;say(satzVon(s,'an'))}
        else if(!o.d.passt&&R.gesagt&&!R.rest&&satzVon(s,'rest')&&(o.d.rest||!s.dinge.some(d=>d.rest))){R.rest=true;say(satzVon(s,'rest'))}
        if(R.ges>=3&&!st.gerichtet){st.gerichtet=1}syncNav()}}});
  R.objs=R.objs.filter(o=>o.x>-70)}
function drawStrom(){const s=SLIDES[cur],R=S.sr;if(!R)return;const yT=Math.max(108,H*0.4),mx=Math.max(56,W*0.2),fy=yT-2.3*RZ,U=R.ue;
  const linie=(x0,x1,y)=>{ctx.strokeStyle=C.muted;ctx.lineWidth=1.5;ctx.setLineDash([6,8]);ctx.lineDashOffset=reduce?0:time*R.v;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();ctx.setLineDash([])};
  const mann=(x,y,r)=>{ctx.beginPath();ctx.arc(x,y,r,0,6.283);ctx.fillStyle=C.paper;ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();figur(x,y,r,1,0)};
  if(U&&U.t<UE.f0){const t=U.t,kA=ease(t/UE.a),kB=ease((t-UE.b0)/UE.b),kC=ease((t-UE.c0)/UE.c),kD=ease((t-UE.d0)/UE.d),kE=ease((t-UE.e0)/UE.e);
    const x=lerp(cx,mx,kE),y=lerp(figY(),fy,kE),r=lerp(FIG_R,RZ,kE),yF=y+2.3*r;   // yF: wo deine Füße stehen
    if(kA<1)U.hs.forEach(h=>{const a0=h.a;h.a=a0*(1-kA);huelleMass(h);faedenMalen(h,cx,figY(),0,null);huelleMalen(h);huelleStand(h);h.a=a0});
    const txt=satzVon(s,'vorbei');ctx.font='italic 15px '+C.serif;const tw=Math.min(W/2-8,ctx.measureText(txt).width/2);
    // der Satz unter dir wird flach und steigt unter deine Füße: aus ihm wird das erste Stück Zeitlinie
    if(kB>0&&kC<1){ctx.save();ctx.translate(cx,lerp(yF+24,yF,kC));ctx.scale(1,lerp(1,0.05,kC));ctx.globalAlpha=kB*(1-ease((kC-0.6)/0.4));
      ctx.font='italic 15px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText(txt,0,5);ctx.restore();ctx.globalAlpha=1}
    if(kC>0.4){ctx.globalAlpha=ease((kC-0.4)/0.6);linie(lerp(cx-tw,0,kD),lerp(cx+tw,W,kD),yF);ctx.globalAlpha=1}
    mann(x,y,r);duLabel(cx,figY(),FIG_R,1-kA);return}
  // die Zähler
  const zahl=(t,n,y,stark)=>{label(t.toUpperCase(),12,y,9.5,C.muted,'left',1.5);ctx.font='9.5px '+C.sans;let w=0;try{ctx.letterSpacing='1.5px';w=ctx.measureText(t.toUpperCase()).width;ctx.letterSpacing='0px'}catch(e){w=ctx.measureText(t.toUpperCase()).width+1.5*t.length}
    label(String(n),12+w+10,y+1,15,stark?C.ink:C.muted,'left',0)};
  if(s.zaehlt)zahl(s.zaehlt,R.alle,22,false);if(s.gesehen)zahl(s.gesehen,R.ges,44,R.an);
  // die Zeitlinie
  ctx.strokeStyle=C.muted;ctx.lineWidth=1.5;ctx.setLineDash([6,8]);ctx.lineDashOffset=reduce?0:time*R.v;ctx.beginPath();ctx.moveTo(0,yT);ctx.lineTo(W,yT);ctx.stroke();ctx.setLineDash([]);
  // was vorbeizieht
  let ziel=null;
  R.objs.forEach((o,i)=>{const d=o.d,a=R.tag?(R.an&&d.passt?1:0.62):!R.an?0.6:d.passt?1:0.26;ctx.globalAlpha=a;
    // ein Zeichen des Tages. Was guttut, trägt einen gelben Punkt, wie das gelbe Auto. Stehen die Zeichen still, wechseln die Beschriftungen die Höhe.
    if(R.tag){if(d.passt){ctx.beginPath();ctx.arc(o.x+4,yT,7,0,6.283);ctx.fillStyle=C.gelb;ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=1.4;ctx.stroke()}
      ctx.globalAlpha=1;const lx=zeichenMalen({x:o.x,al:a,e:{art:d.art,schild:d.name}},yT,false,!reduce,0);
      if(lx!==undefined){ctx.globalAlpha=a;const col=R.an&&d.passt?C.ink:C.muted;
        if(reduce)label(d.name.toUpperCase(),o.x+8,yT-38-(i%2?13:0),9,col,'center',1.4);else label(d.name.toUpperCase(),lx,yT-22,9,col,'left',1.4)}}
    else if(d.art==='mensch'){const gx=o.x;ctx.beginPath();ctx.arc(gx,fy,RZ,0,6.283);ctx.fillStyle=C.paper;ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();
      ctx.globalAlpha=a;figur(gx,fy,RZ,1,reduce?0:-Math.sin(time*8+o.x*0.05));ctx.globalAlpha=a;label(d.name.toUpperCase(),gx,fy-RZ*2.1-7,8.5,C.muted,'center',1.3)}
    else{const x=o.x,y=yT-4;ctx.fillStyle=d.passt?C.gelb:C.paper;ctx.strokeStyle=C.ink;ctx.lineWidth=1.4;ctx.lineJoin='round';
      ctx.beginPath();ctx.moveTo(x-16,y);ctx.lineTo(x-16,y-7);ctx.lineTo(x-9,y-8);ctx.lineTo(x-5,y-14);ctx.lineTo(x+7,y-14);ctx.lineTo(x+11,y-8);ctx.lineTo(x+16,y-7);ctx.lineTo(x+16,y);ctx.closePath();ctx.fill();ctx.stroke();
      [-9,9].forEach(q=>{ctx.beginPath();ctx.arc(x+q,y,3.3,0,6.283);ctx.fillStyle=C.bg;ctx.fill();ctx.stroke()})}
    ctx.globalAlpha=1;
    if(R.an&&d.passt&&o.x>mx+20&&o.x<mx+190&&(!ziel||o.x<ziel.x))ziel=o});
  // die Blicklinie zu dem, worauf du achtest
  if(ziel){ctx.strokeStyle=C.ink;ctx.lineWidth=1.3;ctx.setLineDash([2,4]);ctx.beginPath();ctx.moveTo(mx+RZ*0.6,fy-RZ*1.65);ctx.lineTo(ziel.x-(R.tag?5:R.menschen?RZ+3:17),R.tag?yT-7:R.menschen?fy-RZ*1.4:yT-13);ctx.stroke();ctx.setLineDash([])}
  // du
  ctx.beginPath();ctx.arc(mx,fy,RZ,0,6.283);ctx.fillStyle=C.paper;ctx.fill();
  if(s.traeger){const netto=R.traeger.charges.reduce((a,c)=>a+c.s,0);if(netto){ctx.globalAlpha=Math.min(0.85,0.16*Math.abs(netto));ctx.fillStyle=netto<0?C.minus:C.plus;ctx.fill();ctx.globalAlpha=1}}
  if(R.hell>0.02){ctx.globalAlpha=0.7*R.hell;ctx.fillStyle=R.hellS<0?C.minus:C.plus;ctx.fill();ctx.globalAlpha=1}
  ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();figur(mx,fy,RZ,1,0);
  label(T('du').toUpperCase(),mx,fy-RZ*2.1-7,8.5,C.ink,'center',1.5);
  R.flug.forEach(f=>chargeDot(lerp(f.x,mx,ease(f.k)),lerp(f.y,fy,f.k*f.k),f.sign,0.9));
  if(R.blink>0.03){ctx.globalAlpha=R.blink;ctx.strokeStyle=R.menschen?C.minus:C.gelb;ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(mx,fy-RZ*0.3,RZ*2.4+6*(1-R.blink),0,6.283);ctx.stroke();ctx.globalAlpha=1}
  // der Satz dessen, der gerade vorbeigeht
  if(R.zeile){const Z=R.zeile,a=Math.min(1,Z.t/0.3,(R.takt*0.86-Z.t)/0.4)*(Z.blass?0.36:1);if(a>0.01){ctx.globalAlpha=a;ctx.font='italic 15px '+C.serif;
    let t='„'+Z.text+'“';if(ctx.measureText(t).width>W-16)ctx.font='italic 13px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText(t,cx,yT+30);ctx.globalAlpha=1}}
  // der Träger, in den es fällt
  if(s.traeger){const y=yT+92;gliedMass(R.traeger);gliedMalen(R.traeger,cx,y,0,1);
    if(R.fall)chargeDot(cx,lerp(yT+40,y-4,R.fall.k*R.fall.k),R.fall.sign,0.85)}
  // Ende des Übergangs aus dem Ring: Zähler und Zeichen erscheinen, du und die Zeitlinie stehen schon
  if(U){ctx.globalAlpha=1-ease((U.t-UE.f0)/UE.f);ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;linie(0,W,yT);mann(mx,fy,RZ)}}
