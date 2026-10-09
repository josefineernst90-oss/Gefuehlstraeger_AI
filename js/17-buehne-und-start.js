/* ================= Bühne ================= */
function resize(){
  const rc=stage.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
  W=rc.width;H=rc.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  layout();if(started)fit();
}
// steht das Männchen auf der Zeitlinie, braucht es darüber Platz
function layout(){const mann=started&&(SLIDES[cur].mann||SLIDES[cur].scene==='fokus');
  cx=W/2;yL=Math.max(mann?68:54,H*0.22);M=Math.min(40,W*0.1);R0=Math.max(30,Math.min(W*0.25,(H-yL-40-52)/2));cy0=yL+40+R0;R=R0;cy=cy0}
function pos(e){const rc=cv.getBoundingClientRect();ptr.x=e.clientX-rc.left;ptr.y=e.clientY-rc.top}
cv.addEventListener('pointermove',pos);cv.addEventListener('pointerdown',pos);
cv.addEventListener('pointerdown',()=>{
  S.lese=0;   // ein Tipp auf die Bühne beendet die Lesepause
  // Bindung: eine Hülle antippen wirkt wie ihr Knopf (bei mehreren Knöpfen der Reihe nach)
  if(SLIDES[cur].scene==='bindung'){const s=SLIDES[cur],h=huellenListe(s).find(h=>Math.hypot(ptr.x-h.x,ptr.y-h.y)<50);
    if(s.verblassen){if(h&&!s.zusehen){naehren(s,h);syncNav()}}
    else if(h){const bs=[...$('row').querySelectorAll('button')].filter(b=>b.dataset.huelle===h.id&&!b.disabled);
      if(bs.length)bs[h.tap++%bs.length].click();
      else if(s.frei){const minus=h.charges.length&&h.charges.every(ch=>ch.s<0);
        spinnen(s,{huelle:h.id,sinne:[],cap:(minus&&satzVon(s,'faden-minus'))||satzVon(s,'faden'),key:'frei'});syncNav()}}
    return}
  // Zwei Menschen: ein Element antippen, in welcher Bahn auch immer
  if(SLIDES[cur].scene==='zwei'&&S.zw){let i=-1;BAHNEN.forEach(b=>S.zw.B[b].pos.forEach((q,j)=>{if(q.w&&Math.abs(ptr.x-q.x)<q.w/2+14&&Math.abs(ptr.y-q.y)<24)i=j}));
    if(i>=0){zweiTippen(SLIDES[cur],i);syncNav()}return}
  // Sicht: die eigene Insel antippen
  if(SLIDES[cur].scene==='sicht'&&S.si){const z=S.si.ziel;if(z&&Math.hypot(ptr.x-z.x,ptr.y-z.y)<z.r){sichtTipp(SLIDES[cur]);syncNav()}return}
  // Drehen: den Ladungsträger antippen
  if(SLIDES[cur].scene==='drehen'&&S.dr){const z=S.dr.ziel;if(z&&Math.abs(ptr.x-z.x)<z.w&&Math.abs(ptr.y-z.y)<28){drehenTipp(SLIDES[cur]);syncNav()}return}
  // Schloss: einen Schlüssel oder seine Deutung antippen
  if(SLIDES[cur].scene==='schloss'&&S.sk){const i=S.sk.pos.findIndex(q=>q&&Math.abs(ptr.x-q.x)<q.w/2&&Math.abs(ptr.y-q.y)<q.h/2);
    if(i>=0){schlossTipp(SLIDES[cur],i);syncNav()}return}
  // Steg: ein Glied antippen
  if(SLIDES[cur].scene==='steg'&&S.sg){const i=S.sg.neu?-1:S.sg.pos.findIndex((q,i)=>Math.abs(ptr.x-q.x)<S.sg.els[i].tot/2+14&&Math.abs(ptr.y-q.y)<26);
    if(i>=0){stegTippen(SLIDES[cur],i);syncNav()}return}
  if(SLIDES[cur].scene!=='dreieck'||!G)return;
  const near=(x,y,r)=>Math.hypot(ptr.x-x,ptr.y-y)<r;
  if(near(G.L,G.yB+14,48))pick('denken');else if(near(G.R,G.yB+14,48))pick('gefuehl');
  else if(near(cx,G.yT-6,48))pick('metaphorik');else if(near(cx,G.yB+10,48))pick('luecke');
});
cv.addEventListener('pointerleave',()=>{ptr.x=ptr.y=-999});cv.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')ptr.x=ptr.y=-999});

const FOLGE_PAUSE=2;   // Sekunden zwischen dem Ende eines Schritts und dem Anlaufen des nächsten (data-folgt)
function step(dt){
  time+=dt;const amp=reduce?0.25:1,s=SLIDES[cur];
  // Der Speicher hat seinen festen Platz. Nur bei der Verwandlung zur Figur wandert und schrumpft er.
  R=R0;cy=cy0;sx=0;
  // von der Linie: der Bauch des Männchens wandert an den Platz des Speichers und wächst
  if(s.vonlinie&&!S.introLive){const k=introK(s),q=linieGeo();R=lerp(q.r,R0,k);cy=lerp(q.yF,cy0,k);sx=lerp(linieEndeX(q)-cx,0,k)}
  const liest=S.lese>0;if(liest)S.lese-=dt;
  // data-folgt: ist der Schritt zu Ende und der letzte Satz gelesen, läuft der nächste von selbst an. Die Bühne bleibt stehen.
  if(s.folgt&&S.folgeOk&&!reduce&&!liest&&cur<SLIDES.length-1){if(done(s)){S.folgeT+=dt;if(S.folgeT>=FOLGE_PAUSE){go(cur+1);return}}else S.folgeT=0}
  if(s.scene==='linie'&&S.g){const g=S.g;
    if(reduce){}
    else if(s.klappen&&!g.text){g.t+=dt;if(g.t>=g.tF){g.text=true;$('text').classList.remove('warte');S.lese=lesezeit()}}
    else if(!liest)g.t+=dt;
    if(!g.said&&g.t>=g.tc){g.said=true;const c=satzVon(s,'an');if(c)say(c)}}
  // das Männchen neben dem Foto: erst erscheint es, dann sagt es, wie es ihm geht
  if(s.ich&&S.ich){if(!liest)S.ich.t+=dt;
    if(S.ich.t>=1.7&&!S.ich.said){S.ich.said=true;
      say(satzVon(s,'an').replace('{stimmung}',T('geht-'+(S.level>0.3?'positiv':S.level<-0.3?'negativ':'gemischt'))));syncNav()}}
  // „du“ federt an seinen Platz zurück, die Färbung des Bauchs klingt ab
  S.du.vx+=(-55*S.du.x-7.5*S.du.vx)*dt;S.du.vy+=(-55*S.du.y-7.5*S.du.vy)*dt;S.du.x+=S.du.vx*dt;S.du.y+=S.du.vy*dt;S.du.tint*=Math.pow(0.4,dt);
  // was als Nächstes dran ist (Sätze und Festwerden nach dem Üben), eins nach dem anderen
  if(S.ev.length&&!liest){const e=S.ev[0];e.t-=dt;if(e.t<=0){S.ev.shift();e.fn()}}
  // Verblassen: nach der Lesepause vergeht die Zeit, pro Takt passiert genau eine Sache. Steht ein Satz davor, kommt erst er.
  if(s.verblassen&&!liest&&!reduce&&stOf(s).bereit!==false){const st=stOf(s);
    if(!st.los){st.los=true;const z=st.bereit?'':satzVon(s,'zuerst');if(z){say(z);S.vb=-2.6}}
    S.vb+=dt;if(S.vb>=s.verblassen){S.vb=0;verblassenTakt(s);syncNav()}}
  // Vorführen: nach der Lesepause ziehen sich ein paar Fäden von selbst, einer nach dem anderen, dann kommt der Hinweis
  if(s.vorfuehren&&S.vor&&S.vor.aktiv){const V=S.vor,hs=huellenListe(s),n=Math.min(s.vorfuehren,hs.length);if(!reduce&&!liest)V.t+=dt;
    while(V.n<n&&V.t>=VOR_T0+V.n*VOR_DT){faden(hs[V.n]);V.n++}
    if(V.t>=VOR_T0+n*VOR_DT+0.3){V.aktiv=false;stOf(s).vorGesehen=true;if(!stOf(s).taps)say(satzVon(s,'danach'),true);syncNav()}}
  // die Ladungsträger gehen einer nach dem anderen hinaus, der Speicher rückt dabei in die Mitte und wird kleiner
  if(s.hinaus&&S.aus){const A=S.aus,n=A.order.length;if(!reduce&&!liest)A.t+=dt;
    while(A.n<n&&A.t>=AUS_T0+A.n*AUS_DT){const c=A.order[A.n];if(S.c.includes(c))hinaus(c,A.n);A.n++}
    const p=ease((A.t-AUS_T0)/Math.max(0.1,n*AUS_DT));R=lerp(R0,kreisR(),p);cy=lerp(cy0,H/2,p)}
  // Übergang zwischen Ring und Zeitlinie: eine Uhr, vorwärts oder rückwärts
  if(s.ein&&S.ein){const E=S.ein,P=einPlan();
    if(!liest&&!reduce)E.T=Math.max(0,Math.min(P.max,E.T+s.ein*dt));
    E.order.forEach((id,i)=>{const t=EIN.c+(i+1)*EIN.dC,h=S.h[id];
      if(s.ein>0&&E.T>=t&&h&&!h.drin)hinein(h);                   // die Hülle ist im Bauch angekommen
      if(s.ein<0&&E.T<t&&(!h||h.drin))heraus(id)});               // rückwärts: die zuletzt hineingegangene kommt zuerst heraus
    E.kB=ease((E.T-P.b)/EIN.dB);R=lerp(RM,R0,E.kB);cy=lerp(mannY(),cy0,E.kB);
    if(!E.said&&(s.ein>0?E.T>=P.max:E.T<=0)){E.said=true;const c=satzVon(s,'an');if(c)say(c);syncNav()}}
  // du gehst, die Zeit läuft unter dir durch, der Türrahmen kommt näher. Beim Stoß beginnt der Moment.
  if(S.gang){const G=S.gang;G.bx*=Math.pow(0.003,dt);G.sch=(G.sch||0)*Math.pow(0.02,dt);G.tint=(G.tint||0)*Math.pow(0.4,dt);
    if(G.ph==='geht'&&!liest){S.weg=(S.weg||0)+G.v*dt;G.x-=G.v*dt;
      if(G.x<=G.stop){G.x=G.stop;G.ph='stoss';G.bx=G.art==='tuer'?-5:0;stOf(s).played[s.tuer]=1;S.q.push(s.tuer)}}
    else if(G.ph==='weiter'){const v=reduce?1e5:G.v;S.weg=(S.weg||0)+v*dt;
      // der Türrahmen bleibt hinter dir zurück · der Kollege verblasst, du gehst noch ein Stück
      if(G.art!=='tuer'){G.blass=Math.min(1,(G.blass||0)+dt/0.6);G.nach=(G.nach||0)+dt;if(G.nach>1.4||reduce){G.ph='fertig';syncNav()}}
      else{G.x-=v*dt;if(G.x<-30){G.ph='fertig';syncNav()}}}}
  S.steg.forEach(l=>{if(l.k<1)l.k=Math.min(1,l.k+dt/0.6)});
  // Übergang zum Steg
  if(s.zumSteg&&S.zs){if(!liest&&!reduce)S.zs.T+=dt;if(!S.zs.said&&S.zs.T>=6.1){S.zs.said=true;const c=satzVon(s,'an');if(c)say(c);syncNav()}}
  // der Steg auf dem Wasser: jedes Glied federt, und es ist an seine Nachbarn gekoppelt
  if(S.sg){const N=S.sg.neu,E=N&&(N.ph==='dran'||(N.ph==='bindet'))?S.sg.els.concat([N.el]):S.sg.els,n=E.length,acc=E.map((e,i)=>-38*e.d-2.6*e.v+60*((i>0?E[i-1].d:e.d)+(i<n-1?E[i+1].d:e.d)-2*e.d));
    E.forEach((e,i)=>{e.v+=acc[i]*dt;e.d+=e.v*dt})}
  if(S.sg&&S.sg.neu)neuTakt(s,dt,liest);
  if(s.scene==='zwei'&&S.zw)zweiTakt(s,dt,liest);
  if(s.scene==='arbeit'&&S.ar){S.ar.sch*=Math.pow(0.1,dt);if(!liest)ablauf(S.ar,dt)}
  if(s.scene==='strom'&&S.sr)stromTakt(s,dt,liest);
  if(s.scene==='fokus'&&S.fk)fokusTakt(s,dt,liest);
  if(s.scene==='film'&&S.fi){S.fi.sch*=Math.pow(0.05,dt);if(!liest)ablauf(S.fi,dt)}
  if(s.scene==='spitze'&&S.sp&&!liest)ablauf(S.sp,dt);
  if(s.scene==='schloss'&&S.sk){S.sk.sch*=Math.pow(0.03,dt);if(!liest)ablauf(S.sk,dt)}
  if(s.scene==='drehen'&&S.dr&&!liest)ablauf(S.dr,dt);
  if(s.scene==='sicht'&&S.si){const q=Math.pow(0.05,dt);S.si.sch*=q;S.si.schK*=q;S.si.schP*=q;S.si.hellD*=q;if(!liest)ablauf(S.si,dt)}
  if(s.scene==='grob'&&S.gb){const G=S.gb;G.lv=reduce?G.ziel:G.lv+(G.ziel-G.lv)*Math.min(1,dt*4);if(!liest)ablauf(G,dt)}
  // der Strang eines Ladungsträgers: wächst vom Träger hoch zu dir, ruht danach wieder
  if(S.band){const B=S.band,h=S.h[B.id];B.t=Math.min(1,B.t+dt/(B.schlag?0.2:0.85));if(h)h.threads.forEach(f=>f.t=Math.min(1,f.t+dt/0.85));
    // die Bindung schlägt zurück: die Ladung des Trägers schießt durch alle Fäden zugleich hoch und trifft dich
    if(B.schlag){B.dick=Math.max(0,B.dick-dt/3);
      if(B.t>=1&&B.pu<1){B.pu=reduce?1:Math.min(1,B.pu+dt/0.45);if(B.pu>=1&&S.gang){S.gang.sch=1;S.gang.tint=B.sign}}}
    if(B.geht){B.weg+=dt/0.9;if(B.weg>=1)S.band=null}}
  // der Speicher in der Mitte wird zum Bauch des Männchens
  if(s.figur){if(!reduce&&!liest)S.fig+=dt;const k=figurK(s);R=lerp(kreisR(),FIG_R,k);cy=H/2;
    if(k>=1&&!S.figSaid){S.figSaid=true;const c=satzVon(s,'an');if(c)say(c)}}
  // das Foto bekommt seinen Namen: der Rahmen wird zu zwei Platten. Ohne data-rahmen verblassen sie wieder.
  // das Foto löst sich nach der Lesepause: die Zeit läuft wieder
  if(s.loesen){if(!S.geloest&&!liest){S.geloest=true;S.frozen=false}else if(S.geloest)S.losT+=dt}
  if(s.rahmen&&!(s.loesen&&S.geloest)){if(S.fotoP<1&&!liest)S.fotoP=Math.min(1,S.fotoP+dt/1.8);
    if(S.fotoP>=1&&!S.fotoSaid){S.fotoSaid=true;const c=satzVon(s,'an');if(c)say(c)}}
  else if(S.fotoP>0)S.fotoP=Math.max(0,S.fotoP-dt/0.8);
  // Ladungsträger ordnen sich untereinander im Speicher an. Je mehr es sind, desto enger.
  const nc=S.c.length,cs=Math.min(27,R*0.4,1.3*R/Math.max(1,nc));
  // lose Ladungen machen ihnen Platz: zwei Reihen, über und unter den Ladungsträgern
  const lose=nc?S.p.filter(q=>!q.to):[],nl=lose.length,dyL=Math.min(R-12,(nc-1)/2*cs+22),chL=Math.sqrt(Math.max(0,(R-9)*(R-9)-dyL*dyL));
  S.c.forEach((c,i)=>{const ty=cy+(i-(S.c.length-1)/2)*cs;
    c.x+=(cx-c.x)*Math.min(1,dt*6);c.y+=(ty-c.y)*Math.min(1,dt*6);c.a=Math.min(1,c.a+dt/0.5);c.pulse=Math.max(0,c.pulse-dt/1.6)});
  S.e.forEach(o=>{o.t+=dt/0.9});S.e=S.e.filter(o=>o.t<2.2);
  // Bindung: Fäden wachsen von „du“ zur Hülle und fächern sich auf
  Object.values(S.h).forEach(h=>{if(h.fort||h.drin)return;const still=h.wartet&&liest;
    // eine Hülle verblasst und ist dann weg · eine neue erscheint erst nach der Lesepause
    if(h.weg){h.a=Math.max(0,h.a-dt/1.1);if(h.a<=0){h.fort=true;h.threads=[];hinweg(h);return}}
    else if(!still&&!h.spaet){h.a=Math.min(1,h.a+dt/0.45);if(h.a>=1)h.wartet=false}
    h.pulse=Math.max(0,h.pulse-dt/1.4);
    if(h.fest)h.festK=Math.min(1,(h.festK||0)+dt/0.9);
    // neu: erst die Hülle, dann „Zwischenspeicher“ daneben, dann der Satz
    if(h.neuT!==undefined&&!still)h.neuT+=dt;
    if(h.zw&&!h.fest&&(h.neuT===undefined||h.neuT>=1.3))h.zwK=Math.min(1,(h.zwK||0)+dt/0.5);
    if(h.neuT>=2.4&&!h.neuSaid){h.neuSaid=true;if(s.huellen.some(x=>x.id===h.id)){const c=satzVon(s,'an');if(c)say(c)}syncNav()}
    // die Fäden einer festen Hülle schließen sich zu einem Strang
    const n=h.threads.length,sp=Math.min(17,66/Math.max(1,n-1))*(1-0.72*ease(h.festK||0));
    h.threads.forEach((f,i)=>{if(still){f.age=0;return}
      f.t=Math.min(1,f.t+dt/0.85);f.age+=dt;f.o+=((i-(n-1)/2)*sp-f.o)*Math.min(1,dt*6);
      if(f.weg)f.out=(f.out||0)+dt/0.9;   // der Faden verblasst
      // Üben: mit dem Faden kommt die Ladung des Tages in der Hülle an
      if(f.bringt&&f.t>=1){const b=f.bringt;f.bringt=null;angekommen(h,b)}});
    h.threads=h.threads.filter(f=>!(f.out>=1));
    // jede Hülle zieht an ihren Platz im Ring
    const pl=ringPlatz(h.slot||0,h);h.x+=(pl[0]-h.x)*Math.min(1,dt*3.2);h.y+=(pl[1]-h.y)*Math.min(1,dt*3.2)});
  const einK=s.ein&&S.ein?S.ein.kB:1;
  S.p.forEach(q=>{
    // wächst der Speicher gerade aus dem Bauch, wachsen die losen Ladungen mit
    if(einK<1&&!q.to){q.x=cx+q.hx*R;q.y=cy+q.hy*R;q.vx=q.vy=0;return}
    const c=q.to&&carrier(q.to);let hx=c?c.x+c.slot:cx+q.hx*R,hy=c?c.y:cy+q.hy*R;
    if(!c&&nl){const i=lose.indexOf(q),unten=i%2,j=(i-unten)/2,m=unten?Math.floor(nl/2):Math.ceil(nl/2),dx=Math.min(17,m>1?2*chL*0.9/(m-1):17);
      hx=cx+(j-(m-1)/2)*dx;hy=cy+(unten?dyL:-dyL)}
    if(q.t<1){if(q.wait>0){q.wait-=dt;return}q.t=Math.min(1,q.t+dt/q.dur);const e=q.t*q.t*(3-2*q.t);q.x=q.ox+(hx-q.ox)*e;q.y=q.oy+(hy-q.oy)*e;
      if(q.t>=1&&q.satz){say(q.satz);q.satz=null;S.warte=reduce?0:2.4}   // Zeit zum Lesen, bevor der nächste Moment beginnt
      // angekommen: die Ladung gehört jetzt zu ihrer Adresse
      if(q.t>=1&&c){c.charges.push({s:q.sign,big:q.big});c.pulse=1;q.gone=true;if(S.gang)tuerGelandet(c);syncNav()}return}
    if(S.frozen){q.x+=(hx-q.x)*0.1;q.y+=(hy-q.y)*0.1;return}
    const wx=(Math.sin(time*q.f[0]+q.ph[0])*5+Math.sin(time*q.f[1]+q.ph[1])*2.5)*amp;
    const wy=(Math.sin(time*q.f[2]+q.ph[2])*5+Math.sin(time*q.f[3]+q.ph[3])*2.5)*amp;
    q.vx+=(hx+wx-q.x)*0.06;q.vy+=(hy+wy-q.y)*0.06;
    const dx=q.x-ptr.x,dy=q.y-ptr.y,d=Math.hypot(dx,dy);
    if(d<60&&d>0.01){const f=(60-d)/60*2;q.vx+=dx/d*f;q.vy+=dy/d*f}
    q.vx*=0.84;q.vy*=0.84;q.x+=q.vx;q.y+=q.vy;
  });
  S.p=S.p.filter(q=>!q.gone);
  S.kick*=Math.pow(0.08,dt);
  S.level+=(target()-S.level)*Math.min(1,dt*2.5);
  // Übergang Dreieck → Zeitlinie: erst steht das Dreieck, dann klappt es ein und die Platten fahren auseinander.
  // Danach läuft der Moment wie jeder andere durch seine Zeilen.
  if((s.fold||s.vonlinie)&&!S.introLive){
    if(!liest)S.intro+=dt;
    if(S.intro>=s.dauer)introFertig(s);
  }
  // der nächste Moment in der Warteschlange beginnt, sobald der vorige durch ist
  if(S.warte>0)S.warte-=dt;
  else if(S.q.length&&!liest){const st=S.m.find(m=>steht(m)&&!m.out);
    if(st&&MOM[S.q[0]].reopen)wiederOeffnen(st,MOM[S.q.shift()]);
    else if(!S.m.some(m=>!m.out&&!steht(m))&&landed()){if(!$('cap').classList.contains('hint'))say('');openMoment(MOM[S.q.shift()])}}
  S.m.forEach(m=>{m.age+=dt;if(!S.frozen&&!reduce&&(m.past||m.out))m.tx-=dt*(S.gang?(S.gang.ph==='weiter'?S.gang.v:0):7);   // der laufende Moment bleibt bei „jetzt“
    m.x+=(m.tx-m.x)*Math.min(1,dt*8);
    const n=m.lines.length,ph=Math.min(n,Math.floor(m.age/m.dur)),ln=m.lines[ph];
    if(m.hold)m.age=Math.min(m.age,n*m.dur+(m.keep?0.3:-0.45));   // wartet auf die Wahl der Adresse, oder bleibt geschlossen stehen
    if(ph!==m.ph){m.ph=ph;
      // wo die Ladung jetzt sitzt: rechts beim Fühlen, links beim Denken, am Ende in der Mitte
      const side=!m.sign?null:ln?(ln.dot||m.side):'mid';
      if(side!==m.side){m.prev=m.side;m.side=side;m.dp=0}
      if(ln&&ln.sg)m.sg=ln.sg;else if(!ln)m.sg=m.sign;   // das Vorzeichen kann im Moment wechseln, am Ende gilt das des Moments
      // Wiederaufrufen: der Ladungsträger schickt ein Echo seiner Ladung in den Moment
      // steht das Männchen auf der Zeitlinie, meldet sich stattdessen die Bindung: der Strang wächst vom Träger hoch zu ihm
      if(ln&&ln.recall){const c=carrier(ln.recall);if(c){c.pulse=1;
        if(s.mann)S.band={id:c.id,t:0,weg:0};
        else{[...new Set(c.charges.map(ch=>ch.s))].forEach((sg,i)=>S.e.push({x0:c.x,y0:c.y,x1:m.x-halfWidth(ln.text)-15,y1:yL-i*20,t:-i*0.25,sign:sg}));
          if(m.sign&&!m.prev)m.ds=-3}}}
      if(ln&&ln.cap)say(ln.cap);if(!ln&&m.spec.capClose)say(m.spec.capClose)}
    if(m.side)m.ds=Math.min(1,m.ds+dt/0.3);m.dp=Math.min(1,m.dp+dt/0.8);
    const wT=ln?halfWidth(ln.text):m.past&&m.out?PAST*M:CLOSED;
    m.w+=(wT-m.w)*Math.min(1,dt*7);
    if(!m.out&&!m.hold&&m.age>n*m.dur+(m.addr?1.7:T_CLOSE)){m.out=true;
      let q=null;
      if(m.spec.assign)q=assignLoose(m.spec.assign,m.addrLabel);
      else if(m.sign){if(m.addr)ensureCarrier(m.addr,m.addrLabel);q=add(m.sign,m.x,yL,false,m.addr?1.6:m.fall,m.addr,m.big,m.spec.id)}
      if(m.onDrop)m.onDrop();
      // der Satz kommt erst, wenn die Ladung unten angekommen ist. Fällt nichts, kommt er gleich.
      if(m.capDrop){if(q)q.satz=m.capDrop;else say(m.capDrop)}syncNav()}});
  S.m=S.m.filter(m=>m.x>-M);
}

function label(t,x,y,size,color,align,spacing){
  ctx.font=size+'px '+C.sans;ctx.fillStyle=color;ctx.textAlign=align||'center';
  try{ctx.letterSpacing=(spacing||0)+'px'}catch(e){}
  ctx.fillText(t,x,y);try{ctx.letterSpacing='0px'}catch(e){}
}

function drawDreieck(){
  const b=Math.min(W-130,360),h=Math.max(70,Math.min(b*1.05,H-96));
  const yT=(H-h)/2-12,yB=yT+h,L=cx-b/2,Rr=cx+b/2,gap=Math.max(30,b*0.16);
  G={L,R:Rr,yT,yB};
  if(SEL){const at={denken:[L,yB],gefuehl:[Rr,yB],metaphorik:[cx,yT],luecke:[cx,yB]}[SEL];
    ctx.strokeStyle=C.plus;ctx.lineWidth=1.5;ctx.globalAlpha=0.55;
    ctx.beginPath();ctx.arc(at[0],at[1],SEL==='luecke'?gap*0.62+10:15,0,6.283);ctx.stroke();ctx.globalAlpha=1}
  ctx.strokeStyle=C.ink;ctx.lineWidth=2;ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(L,yB);ctx.lineTo(cx,yT);ctx.lineTo(Rr,yB);ctx.stroke();
  ctx.beginPath();ctx.moveTo(L,yB);ctx.lineTo(cx-gap/2,yB);ctx.moveTo(cx+gap/2,yB);ctx.lineTo(Rr,yB);ctx.stroke();
  // ein Signal läuft von Denken zu Gefühl und braucht in der Lücke Zeit
  const t=reduce?1.9:time%5.2;let sx=null,glow=0;
  if(t<1.2)sx=L+(cx-gap/2-L)*(t/1.2);
  else if(t<2.8){glow=Math.sin((t-1.2)/1.6*Math.PI)}
  else if(t<4)sx=cx+gap/2+(Rr-cx-gap/2)*((t-2.8)/1.2);
  ctx.strokeStyle=C.plus;ctx.lineWidth=3;ctx.globalAlpha=0.65+0.35*glow;
  [-1,1].forEach(s=>{ctx.beginPath();ctx.moveTo(cx+s*gap*0.2,yB-22);ctx.lineTo(cx+s*gap*0.2,yB+22);ctx.stroke()});
  ctx.globalAlpha=1;
  if(sx!==null&&!reduce){ctx.fillStyle=C.plus;ctx.beginPath();ctx.arc(sx,yB,4,0,6.283);ctx.fill()}
  ctx.fillStyle=C.ink;[[L,yB],[Rr,yB]].forEach(([x,y])=>{ctx.beginPath();ctx.arc(x,y,5,0,6.283);ctx.fill()});
  ctx.fillStyle=C.plus;ctx.beginPath();ctx.arc(cx,yT,5,0,6.283);ctx.fill();
  label(T('metaphorik').toUpperCase(),cx,yT-16,14,C.plus,'center',2.5);
  label(T('denken').toUpperCase(),L,yB+28,14,C.ink,'center',2.5);label(T('logik').toUpperCase(),L,yB+46,10.5,C.muted,'center',1.5);
  label(T('gefuehl').toUpperCase(),Rr,yB+28,14,C.ink,'center',2.5);label(T('sinn').toUpperCase(),Rr,yB+46,10.5,C.muted,'center',1.5);
  label(T('taktversatz').toUpperCase(),cx,b<250?yB-40:yB+46,10.5,C.muted,'center',1.5);
}

const ease=k=>{k=Math.max(0,Math.min(1,k));return k*k*(3-2*k)},lerp=(a,b,k)=>a+(b-a)*k;

// Strichmännchen um einen Bauch mit Mittelpunkt x,y und Radius r. g = wie weit Kopf, Arme und Beine gewachsen sind.
// sw = Schritt beim Gehen, von −1 bis 1
function figur(x,y,r,g,sw){if(g<=0)return;sw=sw||0;ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.lineCap='round';
  const ln=(x0,y0,x1,y1)=>{ctx.beginPath();ctx.moveTo(x+x0*r,y+y0*r);ctx.lineTo(x+lerp(x0,x1,g)*r,y+lerp(y0,y1,g)*r);ctx.stroke()};
  ln(-0.85,-0.49,-1.8,0.2+0.3*sw);ln(0.85,-0.49,1.8,0.2-0.3*sw);ln(-0.41,0.89,-0.75+0.6*sw,2.3);ln(0.41,0.89,0.75-0.6*sw,2.3);ln(0,-0.98,0,-1.2);
  ctx.beginPath();ctx.arc(x,y-r*1.65,r*0.45*g,0,6.283);ctx.fillStyle=C.bg;ctx.fill();ctx.stroke();ctx.lineCap='butt'}
function duLabel(x,y,r,a){if(a<=0.01)return;ctx.globalAlpha=a;label(T('du').toUpperCase(),x,y+2.3*r+19,12,C.ink,'center',2.5);ctx.globalAlpha=1}
/* Bühne „Linie“: das Dreieck der Karte, in seine Grundlinie geklappt. Die Spitze landet zwischen Denken und Gefühl,
   die Platten der Lücke fahren an die Enden: |----Denken----Metaphorik----Gefühl----|  Darunter läuft das Männchen. */
function linieGeo(){const half=Math.min(W/2-12,330),r=Math.max(14,Math.min(20,H*0.05)),y=Math.max(46,(H-(118+4.4*r))/2+28);
  return {half,xL:cx-half,xR:cx+half,y,r,yF:y+46+2.1*r,st:{denken:cx-0.62*half,metaphorik:cx,gefuehl:cx+0.62*half}}}
// der Kollege neben dir, rechts vom Gefühl: so groß, wie dort Platz ist (auf schmalen Bühnen kleiner als du)
function linieKollege(q){const xG=q.st.gefuehl,r=q.r,rk=Math.max(10,Math.min(r,(W-(xG+1.8*r)-8)/3.6));
  return {r:rk,x:Math.min(W-1.8*rk-3,xG+1.8*r+1.8*rk+14),y:q.yF+2.3*r-2.3*rk}}
// wo das Männchen am Ende der Eröffnung steht: von dort beginnt der Übergang zur Zeitlinie
let linieAb={i:-1,dx:0};
function linieEndeX(q){const v=linieVor(SLIDES[cur]);return (q.st[v.ort]||q.st.gefuehl)+(linieAb.i===cur-1?linieAb.dx:0)}
function ladungIn(x,y,sign,r,a){if(!sign||a<=0.01)return;const col=sign>0?C.plus:C.minus;ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.lineWidth=1.6;
  ctx.beginPath();ctx.arc(x,y,r,0,6.283);ctx.stroke();ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(x-r*0.5,y);ctx.lineTo(x+r*0.5,y);
  if(sign>0){ctx.moveTo(x,y-r*0.5);ctx.lineTo(x,y+r*0.5)}ctx.stroke();ctx.globalAlpha=1}
function drawLinie(){
  const s=SLIDES[cur],g=S.g;if(!g)return;const q=linieGeo(),t=g.t,k=s.klappen?ease((t-0.5)/(g.tF-0.9)):1;
  // Ausgangslage: das Dreieck wie auf der Karte
  const b=Math.min(W-130,360),h=Math.max(70,Math.min(b*1.05,H-96)),yT0=(H-h)/2-12,yB=yT0+h,gap=Math.max(30,b*0.16);
  const Lx=lerp(cx-b/2,q.st.denken,k),Rx=lerp(cx+b/2,q.st.gefuehl,k),yb=lerp(yB,q.y,k),ay=lerp(yT0,q.y,k);
  const pL=lerp(cx-gap*0.2,q.xL,k),pR=lerp(cx+gap*0.2,q.xR,k),g2=gap/2*(1-k);
  ctx.strokeStyle=C.ink;ctx.lineWidth=lerp(2,1.5,k);ctx.lineJoin='round';
  if(k<1){ctx.beginPath();ctx.moveTo(Lx,yb);ctx.lineTo(cx,ay);ctx.lineTo(Rx,yb);ctx.stroke()}
  ctx.beginPath();ctx.moveTo(Math.min(Lx,pL),yb);ctx.lineTo(cx-g2,yb);ctx.moveTo(cx+g2,yb);ctx.lineTo(Math.max(Rx,pR),yb);ctx.stroke();
  ctx.strokeStyle=C.plus;ctx.lineWidth=3;[pL,pR].forEach(x=>{ctx.beginPath();ctx.moveTo(x,yb-22);ctx.lineTo(x,yb+22);ctx.stroke()});
  ctx.fillStyle=C.ink;[Lx,Rx].forEach(x=>{ctx.beginPath();ctx.arc(x,yb,4.5,0,6.283);ctx.fill()});
  ctx.fillStyle=C.plus;ctx.beginPath();ctx.arc(cx,ay,4.5,0,6.283);ctx.fill();
  const fs=lerp(14,11.5,k),sp=lerp(2.5,2,k);
  const unten=1-ease(k/0.35),oben=ease((k-0.65)/0.35);
  [[T('denken'),Lx],[T('gefuehl'),Rx]].forEach(([w,x])=>{
    if(unten>0.01){ctx.globalAlpha=unten;label(w.toUpperCase(),x,yb+28,14,C.ink,'center',2.5)}
    if(oben>0.01){ctx.globalAlpha=oben;label(w.toUpperCase(),x,yb-16,11.5,C.ink,'center',2)}ctx.globalAlpha=1});
  label(T('metaphorik').toUpperCase(),cx,ay-16,fs,C.plus,'center',sp);
  if(k<0.5){ctx.globalAlpha=1-k*2;label(T('logik').toUpperCase(),Lx,yb+46,10.5,C.muted,'center',1.5);label(T('sinn').toUpperCase(),Rx,yb+46,10.5,C.muted,'center',1.5);
    label(T('taktversatz').toUpperCase(),cx,b<250?yb-40:yb+46,10.5,C.muted,'center',1.5);ctx.globalAlpha=1}
  if(t<g.tF)return;
  // das Männchen: geht von seiner letzten Station zur Station dieses Schritts
  const r=q.r,x0=q.st[g.from],x1=q.st[s.ort],aF=g.neu?ease((t-g.tF)/0.7):1,w=g.walk?ease((t-g.tF-0.2-g.weg)/g.walk):1,nach=t-g.ta;
  let xf=lerp(x0,x1,w),sw=g.walk&&w>0&&w<1?Math.sin(t*9):0;
  if(s.gruebeln&&nach>0&&!reduce){xf+=Math.sin(nach*1.3)*r*0.9;sw=Math.sin(nach*7)*Math.abs(Math.cos(nach*1.3))}
  const fy=q.yF+2.3*r;linieAb={i:cur,dx:xf-x1};
  // der Kollege: kommt von rechts herein und bleibt neben dir stehen · gibt sein Minus mit dem Satz ab · geht wieder
  const uF=s.trifft?ease((t-g.tw)/L_FLUG):0;let K=null;
  if(s.kollege==='kommt'||g.kol0){K=linieKollege(q);const aus=W+2.2*K.r;let kx=K.x,ksw=0,voll=g.kol0===1;
    if(s.kollege==='kommt'){const u=ease((t-g.tk)/LK_KOMMT);kx=lerp(aus,K.x,u);ksw=u>0&&u<1?Math.sin(t*9):0;voll=true}
    else if(s.kollege==='sagt')voll=voll&&uF<=0;
    else if(s.kollege==='geht'){const u=ease((t-g.tF-0.2)/LK_GEHT);kx=lerp(K.x,aus,u);ksw=u>0&&u<1?Math.sin(t*9):0}
    if(kx<aus-0.5){ctx.beginPath();ctx.arc(kx,K.y,K.r,0,6.283);ctx.fillStyle=C.paper;ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();figur(kx,K.y,K.r,1,ksw);
      if(voll)ladungIn(kx,K.y,-1,K.r*0.55,1);const nm=T('kollege').toUpperCase();ctx.font='8.5px '+C.sans;const nw=ctx.measureText(nm).width/2+nm.length*0.65+2;
      label(nm,kx>K.x?kx:Math.min(kx,W-nw),K.y-K.r*2.1-7,8.5,C.muted,'center',1.3)}}
  // wo es auf der Linie steht
  ctx.globalAlpha=0.55*aF;ctx.strokeStyle=C.plus;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(xf,q.y,10,0,6.283);ctx.stroke();
  ctx.strokeStyle=C.muted;ctx.lineWidth=1;ctx.setLineDash([3,5]);ctx.beginPath();ctx.moveTo(xf,q.y+13);ctx.lineTo(xf,q.yF-2.1*r-5);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
  // die Geschichte: ein Bild im Rahmen, im Außen
  const aS=s.geschichte?ease(nach/0.6):g.story0?0.4:0;
  if(aS>0.01){const fw=3*r,fh=2.5*r,fx=cx-(1.8*r+fw/2+8),r2=r*0.3,my=fy-fh/2+r2*0.15;ctx.globalAlpha=aS;
    ctx.fillStyle=C.paper;ctx.fillRect(fx-fw/2,fy-fh,fw,fh);ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.strokeRect(fx-fw/2,fy-fh,fw,fh);
    const p=reduce?0:time*1.3,mx=fx+Math.sin(p)*r2*1.3;
    ctx.beginPath();ctx.arc(mx,my,r2,0,6.283);ctx.stroke();figur(mx,my,r2,1,reduce?0:Math.sin(time*7)*Math.abs(Math.cos(p)));
    ctx.strokeStyle=C.minus;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(mx-r2*0.5,my);ctx.lineTo(mx+r2*0.5,my);ctx.stroke();ctx.globalAlpha=1}
  ctx.globalAlpha=aF;ctx.beginPath();ctx.arc(xf,q.yF,r,0,6.283);ctx.fillStyle=C.paper;ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();
  figur(xf,q.yF,r,1,sw);ctx.globalAlpha=1;
  // was es in sich trägt
  // Steht der Kollege neben dir, kommt die Ladung aus seinem Bauch, von Männchen zu Männchen. Sonst kommt sie von rechts außen.
  const rc0=r*g.gr0,rc=r*(s.klein?0.3:0.5);
  if(s.trifft){const u=uF;
    if(s.kommt){const a=ease((nach-0.1)/0.4)*(1-ease((nach-2)/0.5));if(a>0.01){ctx.globalAlpha=a;ctx.font='italic 15px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='right';ctx.fillText(s.kommt,W-4,q.y+48);ctx.globalAlpha=1}}
    if(u<1)ladungIn(xf,q.yF,g.ch0,rc0,aF);
    if(u>0&&u<1){if(K)ladungIn(lerp(K.x,xf,u),lerp(K.y,q.yF,u)-Math.sin(Math.PI*u)*14,s.trifft,lerp(K.r*0.55,rc,u),1);
      else ladungIn(lerp(W+12,xf,u),lerp(q.y+40,q.yF,u),s.trifft,rc*lerp(1.5,1,u),1)}
    if(u>=1)ladungIn(xf,q.yF,s.trifft,rc,1)}
  else if(s.wird){const u=ease((nach-0.4)/1);ladungIn(xf,q.yF,g.ch0,rc0,1-u);ladungIn(xf,q.yF,s.wird,rc,u)}
  else ladungIn(xf,q.yF,g.ch0,rc0,aF);
  // die Zeile unter dem Männchen: das Wort darüber, darunter was es fühlt, denkt oder sieht.
  // Mehrere Zeilen ohne Grübeln kommen nacheinander und bleiben stehen, jede unter ihrer Station (Denken links, Fühlen rechts).
  const n=s.blasen.length,zeile=(bl,x,a)=>{if(a<=0.01)return;ctx.font='italic 15px '+C.serif;const hw=ctx.measureText(bl.text).width/2,bx=Math.max(hw+4,Math.min(W-hw-4,x));
    ctx.globalAlpha=a;label(bl.tag,bx,fy+22,9.5,C.muted,'center',1.5);ctx.globalAlpha=1;momentText(bl.text,bx,fy+38,a)};
  const ortVon=bl=>bl.tag==='DENKEN'?q.st.denken:bl.tag==='FÜHLEN'?q.st.gefuehl:x1;
  // die Zeile vom Schritt davor steht noch, bis die neue kommt
  if(g.bl0&&t<g.tb)zeile(g.bl0,ortVon(g.bl0),1-ease((t-g.tb+0.5)/0.4));
  if(n&&t>=g.tb){
    if(s.gruebeln){let i=0,a=ease((t-g.tb)/0.4);
      if(n>1&&!reduce){const u=(t-g.tb)/1.9,loc=(u%1)*1.9;i=Math.floor(u)%n;a=ease(loc/0.35)*(1-ease((loc-1.55)/0.3))}
      zeile(s.blasen[i],x1,a)}
    else s.blasen.forEach((bl,i)=>zeile(bl,n>1?ortVon(bl):x1,ease((t-g.tb-i*L_ZEILE)/0.4)))}
}

/* Übergang von der beschrifteten Linie zur Zeitlinie (in drawSpeicher): die Platten ziehen sich um die Ladung zusammen,
   die Stationen verschwinden dazwischen, links und rechts davon läuft die Zeit weiter. Das Männchen tritt zurück. */
function drawVonLinie(k,yN){const q=linieGeo(),pL=lerp(q.xL,cx-CLOSED,k),pR=lerp(q.xR,cx+CLOSED,k),f=(pR-cx)/(q.xR-cx);
  ctx.globalAlpha=k;ctx.strokeStyle=C.muted;ctx.lineWidth=1.5;ctx.setLineDash([6,8]);ctx.lineDashOffset=reduce?0:time*14;
  ctx.beginPath();ctx.moveTo(0,yN);ctx.lineTo(pL,yN);ctx.moveTo(pR,yN);ctx.lineTo(W,yN);ctx.stroke();ctx.setLineDash([]);
  const a=1-ease(k/0.6);ctx.globalAlpha=a;ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(pL,yN);ctx.lineTo(pR,yN);ctx.stroke();
  [['denken',C.ink],['metaphorik',C.plus],['gefuehl',C.ink]].forEach(([id,col])=>{const x=cx+(q.st[id]-cx)*f;
    ctx.globalAlpha=a;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,yN,4.5,0,6.283);ctx.fill();
    ctx.globalAlpha=1-ease(k/0.3);label(T(id).toUpperCase(),x,yN-16,11.5,col,'center',2)});
  ctx.globalAlpha=1;plates((pL+pR)/2,yN,(pR-pL)/2,1);
  // das Männchen wird zum Stimmungsspeicher: Kopf, Arme und Beine ziehen sich ein, der Bauch ist der Speicher (wird dort gezeichnet)
  figur(cx+sx,cy,R,1-ease(k/0.7))}
// die Ladung wandert aus dem Bauch hoch auf die Linie, zwischen die Platten
function vlLadung(k,yN){const q=linieGeo(),u=ease((k-0.1)/0.75);
  chargeDot(lerp(linieEndeX(q),cx,u),lerp(q.yF,yN,u),MOM[SLIDES[cur].auto[0]].sign,lerp(q.r*0.5/8.5,1.25,u))}

// liegt über drawSpeicher: Zeitlinie, Beschriftung und Pegel treten zurück, der Speicher bekommt Kopf, Arme und Beine
function huelleMalen(h){huelleMass(h);ctx.font='italic 16px '+C.serif;
  ctx.globalAlpha=h.a;ctx.fillStyle=C.ink;ctx.textAlign='left';ctx.fillText(h.label,h.x0,h.y+5.5);
  let gx=h.bx+5;h.charges.forEach(ch=>{const w=ch.big?17:13,hw=ch.big?6:4,mx=gx+w/2;ctx.strokeStyle=ch.s>0?C.plus:C.minus;ctx.lineWidth=ch.big?2.4:1.9;
    ctx.beginPath();ctx.moveTo(mx-hw,h.y);ctx.lineTo(mx+hw,h.y);if(ch.s>0){ctx.moveTo(mx,h.y-hw);ctx.lineTo(mx,h.y+hw)}ctx.stroke();gx+=w});
  // im Zwischenspeicher sind die Platten gestrichelt
  ctx.strokeStyle=C.plus;ctx.lineWidth=2.2+h.pulse*1.6;if(h.zw&&!h.fest)ctx.setLineDash([4,3]);
  ctx.beginPath();ctx.moveTo(h.bx,h.y-11);ctx.lineTo(h.bx,h.y+11);ctx.moveTo(h.bx+h.bw,h.y-11);ctx.lineTo(h.bx+h.bw,h.y+11);ctx.stroke();
  ctx.setLineDash([]);ctx.globalAlpha=1}
// neben der Hülle, auf der Seite, die von „du“ wegzeigt: Zwischenspeicher oder fest
function huelleStand(h){const fk=h.festK||0,oben=h.y<figY()-30,y=oben?h.y-19:h.y+27;
  [[T('zwischenspeicher'),(h.zwK||0)*(1-ease(fk/0.4))*h.a,C.muted],[T('fest'),ease((fk-0.5)/0.5)*h.a,C.ink]].forEach(([t,a,col])=>{if(a<=0.01)return;t=t.toUpperCase();
    ctx.font='9.5px '+C.sans;const w=ctx.measureText(t).width+1.5*t.length,x=Math.max(w/2+3,Math.min(W-w/2-3,h.x));
    ctx.globalAlpha=a;label(t,x,y,9.5,col,'center',1.5);ctx.globalAlpha=1})}
// alles außer dem Speicher tritt zurück (Zeitlinie, Pegel, Beschriftung)
function abdecken(a){const rand=R*0.03+2.5;ctx.globalAlpha=a;ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,cy-R-rand);ctx.fillRect(0,cy+R+rand,W,H);
  ctx.fillRect(0,cy-R-rand,cx-R-rand,2*(R+rand));ctx.fillRect(cx+R+rand,cy-R-rand,W,2*(R+rand));ctx.globalAlpha=1}
// liegt über drawSpeicher: die Ladungsträger stehen als Hüllen im Ring
function drawHinaus(){abdecken(ease(S.aus.t/0.8));Object.values(S.h).forEach(huelleMalen)}
// liegt über drawSpeicher: der Speicher bekommt Kopf, Arme und Beine, sein Inhalt verblasst
function drawFigur(){const k=figurK(SLIDES[cur]);abdecken(1);
  if(k>0){ctx.globalAlpha=ease(k/0.5);ctx.beginPath();ctx.arc(cx,cy,Math.max(0,R-1.5),0,6.283);ctx.fillStyle=C.paper;ctx.fill();ctx.globalAlpha=1}
  figur(cx,cy,R,k);duLabel(cx,cy,R,ease((k-0.7)/0.3));Object.values(S.h).forEach(huelleMalen)}
// die Fäden einer Hülle, von „du“ bei sx,sy aus. z: wie weit sie sich in die Hülle zurückgezogen haben (0 = ganz da, 1 = weg)
function faedenMalen(h,sx,sy,z,marks){
  // steht die Hülle neben „du“, endet der Faden an ihrer nahen Seite, sonst unter oder über ihren Platten
  const seit=Math.abs(h.y-figY())<30,ex=seit?(h.x>cx?h.x0-8:h.bx+h.bw+8):h.ax,ey=seit?h.y:h.y+(h.y<figY()?17:-17);
  const len=Math.hypot(ex-sx,ey-sy)||1,nx=-(ey-sy)/len,ny=(ex-sx)/len;
  const m=h.threads.length,half=(m-1)/2*Math.min(17,66/Math.max(1,m-1));
  const out=Math.abs(nx)>0.2?((cx-(sx+ex)/2)*nx>=0?1:-1):(ny<0?1:-1);
  const fk=ease(h.festK||0);
  h.threads.forEach(f=>{const off=f.o+(reduce?0:Math.sin(time*f.f+f.ph)*3*(1-0.75*fk));
    const qx=(sx+ex)/2+nx*off*2,qy=(sy+ey)/2+ny*off*2+len*0.05,k=ease(f.t);
    if(k>z){ctx.strokeStyle=C.ink;ctx.lineWidth=lerp(1,1.25,fk);ctx.globalAlpha=lerp(0.7,0.95,fk)*(1-Math.min(1,f.out||0))*h.a;ctx.beginPath();
      for(let j=0;j<=26;j++){const u=z+(k-z)*j/26,a=(1-u)*(1-u),b=2*u*(1-u),c=u*u;
        const X=a*sx+b*qx+c*ex,Y=a*sy+b*qy+c*ey;j?ctx.lineTo(X,Y):ctx.moveTo(X,Y)}
      ctx.stroke();ctx.globalAlpha=1}
    // welche Sinne die Fäden gesponnen haben, steht kurz neben dem Bündel, zur Mittelachse hin
    const al=f.sinn&&marks?ease((f.t-0.5)/0.4)*(1-ease((f.age-3.4)/1))*h.a:0;
    if(al>0.01)marks.push({t:f.sinn.toUpperCase(),a:al,right:out*nx>0,
      x:(sx+ex)/2+out*nx*(half+16),y:(sy+ey)/2+out*ny*(half+16)+len*0.025+(f.li-(f.ln-1)/2)*14})})}
// liegt über drawSpeicher: der Weg aus dem Ring auf die Zeitlinie (und zurück)
function drawEin(){const E=S.ein,P=einPlan(),T=E.T;
  const z=ease((T-EIN.a0)/EIN.dA0),kA=ease((T-P.a)/EIN.dA),kB=E.kB,kD=ease((T-P.d)/0.9);
  // bis der Speicher wächst, ist nur das Bild der Bindung zu sehen. Am Ende treten Zeitlinie und Pegel dazu.
  if(kB<=0){ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H)}else abdecken(1-kD);
  const fy=lerp(figY(),mannY(),kA),fr=lerp(FIG_R,RM,kA);
  // der Speicher ist dein Bauch, groß gezeichnet: zwei feine Linien führen vom Bauch zu ihm, solange er wächst
  if(kB>0&&kB<1){ctx.globalAlpha=Math.sin(Math.PI*kB)*0.75;ctx.strokeStyle=C.muted;ctx.lineWidth=1;ctx.setLineDash([3,5]);ctx.beginPath();
    [-1,1].forEach(d=>{ctx.moveTo(cx+d*fr,fy);ctx.lineTo(cx+d*R,cy)});ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1}
  const hs=Object.values(S.h).filter(h=>!h.fort&&!h.drin);hs.forEach(huelleMass);
  if(z<1)hs.forEach(h=>faedenMalen(h,cx,fy,z,null));
  ctx.beginPath();ctx.arc(cx,fy,fr,0,6.283);ctx.fillStyle=C.paper;ctx.fill();
  ctx.globalAlpha=kA*Math.min(0.28,Math.abs(S.level)*0.4);ctx.fillStyle=S.level>0?C.plus:C.minus;ctx.fill();ctx.globalAlpha=1;
  ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();figur(cx,fy,fr,1);
  if(kA<1){ctx.globalAlpha=1-kA;ctx.fillStyle=C.bg;ctx.fillRect(cx-17,fy+2.3*fr+8,34,14);ctx.globalAlpha=1;duLabel(cx,fy,fr,1-kA)}
  // jede Hülle wandert, wenn sie dran ist, von ihrem Platz im Ring in deinen Bauch und verblasst dabei
  E.order.forEach((id,i)=>{const h=S.h[id];if(!h||h.fort||h.drin)return;const p=ease((T-(EIN.c+i*EIN.dC))/EIN.dC),X=h.x,Y=h.y,A=h.a;
    h.x=lerp(X,cx,p);h.y=lerp(Y,fy,p);h.a=A*(1-ease((p-0.45)/0.55));huelleMalen(h);
    // „fest“ und „Zwischenspeicher“ gehen mit den Fäden
    if(z<1&&p<=0){h.a=A*(1-z);huelleStand(h)}h.x=X;h.y=Y;h.a=A})}
// der Strang: die Fäden eines Ladungsträgers im Speicher, hoch zum Männchen. Hinter dem Text des Moments läuft er durch.
function bandMalen(){const B=S.band;if(!B)return;const c=carrier(B.id),h=S.h[B.id];if(!c||!h||!h.threads.length)return;
  const n=h.threads.length,x0=c.x,y0=c.y-11,x1=cx+(S.gang?S.gang.bx:0),y1=mannY(),al=1-ease(B.weg||0);
  ctx.save();if(S.pad){ctx.beginPath();ctx.rect(0,0,W,H);ctx.rect(S.pad.x,S.pad.y,S.pad.w,S.pad.h);ctx.clip('evenodd')}
  const dick=B.dick||0,punkte=[];
  h.threads.forEach((f,i)=>{const k=ease(Math.min(B.t,f.t)),off=(i-(n-1)/2)*4.5;
    ctx.strokeStyle=C.ink;ctx.lineWidth=1+0.7*dick;ctx.globalAlpha=lerp(0.85,1,dick)*al;ctx.beginPath();
    for(let j=0;j<=22;j++){const u=j/22*k,X=lerp(x0,x1,u)+off*Math.sin(Math.PI*u),Y=lerp(y0,y1,u);j?ctx.lineTo(X,Y):ctx.moveTo(X,Y)}ctx.stroke();
    // die Ladung, die gerade durch diesen Faden hochschießt
    if(B.schlag&&B.t>=1&&B.pu>0&&B.pu<1&&f.t>=1){const u=B.pu*B.pu;punkte.push([lerp(x0,x1,u)+off*Math.sin(Math.PI*u),lerp(y0,y1,u)])}});
  ctx.globalAlpha=1;punkte.forEach(q=>chargeDot(q[0],q[1],B.sign,0.55));
  ctx.restore();ctx.globalAlpha=1}
function drawBindung(){
  const hs=huellenListe(SLIDES[cur]),dx=cx+S.du.x,dy=figY()+S.du.y;hs.forEach(huelleMass);
  const marks=[];
  hs.forEach(h=>faedenMalen(h,dx,dy,0,marks));
  marks.forEach(m=>{ctx.globalAlpha=m.a;label(m.t,m.x,m.y+3.5,9.5,C.muted,m.right?'left':'right',1.5);ctx.globalAlpha=1});
  // du: die Fäden kommen aus dem Bauch, dem Stimmungsspeicher. Was ankommt, färbt ihn kurz.
  ctx.beginPath();ctx.arc(dx,dy,FIG_R,0,6.283);ctx.fillStyle=C.paper;ctx.fill();
  if(Math.abs(S.du.tint)>0.02){ctx.globalAlpha=Math.min(0.75,Math.abs(S.du.tint)*0.75);ctx.fillStyle=S.du.tint>0?C.plus:C.minus;ctx.fill();ctx.globalAlpha=1}
  ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();
  figur(dx,dy,FIG_R,1);ctx.fillStyle=C.bg;ctx.fillRect(dx-17,dy+2.3*FIG_R+8,34,14);duLabel(dx,dy,FIG_R,1);
  hs.forEach(h=>{huelleMalen(h);huelleStand(h)});
}
// al (optional): wie deckend die Ladung ist, für Ladungen, die vergehen
function chargeDot(x,y,sign,k,al){const col=sign>0?C.plus:C.minus,r=8.5*k,d=al!==undefined;if(r<1)return;if(d&&al<=0.01)return;const a=d?al:1;
  ctx.beginPath();ctx.arc(x,y,r,0,6.283);if(d)ctx.globalAlpha=a;ctx.fillStyle=C.paper;ctx.fill();
  ctx.globalAlpha=0.16*a;ctx.fillStyle=col;ctx.fill();ctx.globalAlpha=a;
  ctx.strokeStyle=col;ctx.lineWidth=1.6;ctx.stroke();
  ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(x-4*k,y);ctx.lineTo(x+4*k,y);
  if(sign>0){ctx.moveTo(x,y-4*k);ctx.lineTo(x,y+4*k)}ctx.stroke();if(d)ctx.globalAlpha=1}
function plates(x,y,w,a){ctx.strokeStyle=C.plus;ctx.lineWidth=3;ctx.globalAlpha=a;
  [-1,1].forEach(s=>{ctx.beginPath();ctx.moveTo(x+s*w,y-22);ctx.lineTo(x+s*w,y+22);ctx.stroke()});ctx.globalAlpha=1}
function momentText(t,x,y,a){if(a<=0.01)return;ctx.globalAlpha=a;ctx.font='italic 15px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='center';
  ctx.fillText(t,x,y+5);ctx.globalAlpha=1}
function knot(x,y){ctx.fillStyle=C.bg;ctx.beginPath();ctx.arc(x,y,6,0,6.283);ctx.fill();ctx.strokeStyle=C.plus;ctx.lineWidth=2;ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-3,y-9);ctx.lineTo(x+3,y+9);ctx.moveTo(x+3,y-9);ctx.lineTo(x-3,y+9);ctx.stroke()}

// die Schreibweise unter dem Foto:  Ladungsträger = Moment |Zustand|
function schreibweise(x,y,a){const t1=T('ladungstraeger')+' = ',t2=S.fotoName,t3=mood(S.level);
  ctx.font='12px '+C.sans;const w1=ctx.measureText(t1).width;ctx.font='italic 15px '+C.serif;const w2=ctx.measureText(t2).width;
  ctx.font='italic 14px '+C.serif;const w3=ctx.measureText(t3).width,x0=x-(w1+w2+20+w3)/2,bx=x0+w1+w2+8;
  ctx.globalAlpha=a;ctx.textAlign='left';ctx.font='12px '+C.sans;ctx.fillStyle=C.muted;ctx.fillText(t1,x0,y);
  ctx.font='italic 15px '+C.serif;ctx.fillStyle=C.ink;ctx.fillText(t2,x0+w1,y);
  ctx.strokeStyle=C.plus;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx,y-13);ctx.lineTo(bx,y+5);ctx.moveTo(bx+12+w3,y-13);ctx.lineTo(bx+12+w3,y+5);ctx.stroke();
  ctx.font='italic 14px '+C.serif;ctx.fillStyle=S.level>0.3?C.plus:S.level<-0.3?C.minus:C.ink;ctx.fillText(t3,bx+6,y)}
function drawSpeicher(){
  S.pad=null;
  // Zeitplan des Übergangs: das erste Viertel steht das Dreieck still, dann klappt es bis kurz vor Schluss ein
  const sl=SLIDES[cur],intro=sl.fold||sl.vonlinie,D=sl.dauer||6,tA=D*0.25,tL=D-0.4-tA,e=intro&&!S.introLive?S.intro:1e3;
  const k=ease((e-tA)/tL),zl=intro&&!S.introLive&&sl.vonlinie,sa=zl?ease((k-0.72)/0.28):intro&&!S.introLive?ease((e-tA-tL*0.5)/(tL*0.5)):1,sb=zl?1:sa;
  const t0=sl.fold?MOM[sl.auto[0]].lines[0].text:'',w0=halfWidth(t0),fold=intro&&!S.introLive,vl=fold&&sl.vonlinie;
  const b=Math.min(W-120,300),h=Math.min(b*0.55,H*0.34),yB0=Math.max(yL,34+h),yN=vl?lerp(linieGeo().y,yL,k):lerp(yB0,yL,k),L=cx-b/2,Rr=cx+b/2,g=lerp(13,w0,k);
  const lv=Math.max(-1,Math.min(1,S.level+S.kick));
  // das Dreieck verblasst, seine Grundlinie wird zur Zeitlinie
  if(k<1&&!vl){ctx.globalAlpha=1-k;ctx.strokeStyle=C.ink;ctx.lineWidth=2;ctx.lineJoin='round';
    const hN=h*(1-k);   // das Dreieck klappt in seine Grundlinie
    ctx.beginPath();ctx.moveTo(L,yN);ctx.lineTo(cx,yN-hN);ctx.lineTo(Rr,yN);ctx.stroke();
    ctx.fillStyle=C.ink;[L,Rr].forEach(x=>{ctx.beginPath();ctx.arc(x,yN,4.5,0,6.283);ctx.fill()});
    ctx.fillStyle=C.plus;ctx.beginPath();ctx.arc(cx,yN-hN,4.5,0,6.283);ctx.fill();
    label(T('denken').toUpperCase(),L,yN+24,12,C.ink,'center',2);label(T('gefuehl').toUpperCase(),Rr,yN+24,12,C.ink,'center',2);ctx.globalAlpha=1}
  // Mini-Karte: wir sind im Spalt des Dreiecks
  if(k>0){ctx.globalAlpha=k*0.85;ctx.strokeStyle=C.muted;ctx.lineWidth=1.2;const mx=14,my=20,ms=10;
    ctx.beginPath();ctx.moveTo(mx-ms,my);ctx.lineTo(mx,my-ms*1.3);ctx.lineTo(mx+ms,my);ctx.moveTo(mx-ms,my);ctx.lineTo(mx-3,my);ctx.moveTo(mx+3,my);ctx.lineTo(mx+ms,my);ctx.stroke();
    ctx.strokeStyle=C.plus;ctx.beginPath();ctx.moveTo(mx-1.5,my-4);ctx.lineTo(mx-1.5,my+4);ctx.moveTo(mx+1.5,my-4);ctx.lineTo(mx+1.5,my+4);ctx.stroke();ctx.globalAlpha=1}
  // Zeit: läuft gleichmäßig durch, ein Moment nach dem anderen. Jeder Moment ist eine Lücke zwischen zwei Platten.
  const seg=(a,c)=>{if(c<=a)return;ctx.lineWidth=1.5;
    if(k<1){ctx.globalAlpha=1-k;ctx.strokeStyle=C.ink;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a,yN);ctx.lineTo(c,yN);ctx.stroke();ctx.lineWidth=1.5}
    ctx.globalAlpha=k;ctx.strokeStyle=C.muted;ctx.setLineDash([6,8]);ctx.lineDashOffset=reduce||S.frozen?0:time*14;
    ctx.beginPath();ctx.moveTo(a,yN);ctx.lineTo(c,yN);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1};
  if(vl)drawVonLinie(k,yN);
  else if(fold){seg(lerp(L,0,k),cx-g);seg(cx+g,lerp(Rr,W,k));
    plates(cx,yN,g,k<1?0.75+0.25*Math.sin(time*4):1);
    momentText(t0,cx,yN,ease((e-tA-tL*0.6)/(tL*0.35)))}
  else{
    // steht das Männchen auf der Zeitlinie, läuft sie über den Momenten durch (sie öffnen sich unter seinen Füßen)
    if(sl.mann){ctx.strokeStyle=C.muted;ctx.lineWidth=1.5;ctx.setLineDash([6,8]);ctx.lineDashOffset=S.weg||0;
      ctx.beginPath();ctx.moveTo(0,yL-22);ctx.lineTo(W,yL-22);ctx.stroke();ctx.setLineDash([])}
    else{let px=0;[...S.m].sort((a,c)=>a.x-c.x).forEach(m=>{seg(px,m.x-m.w);px=m.x+m.w});seg(px,W)}
    S.m.forEach(m=>{const n=m.lines.length,ph=Math.min(n,Math.floor(m.age/m.dur)),ln=m.lines[ph];
      plates(m.x,yL,m.w,Math.max(0,Math.min(1,(m.x-34)/(cx-34))));
      if(ln){const loc=m.age-ph*m.dur,a=ease(loc/0.35)*(1-ease((loc-(m.dur-0.3))/0.3));
        // hinter diesem Text läuft der Strang durch
        if(sl.mann&&a>0.3){ctx.font='italic 15px '+C.serif;const tw=ctx.measureText(ln.text).width;S.pad={x:m.x-tw/2-7,y:yL-(ln.tag?18:11),w:tw+14,h:ln.tag?36:22}}
        if(ln.tag){ctx.globalAlpha=a;label(ln.tag,m.x,yL-8,9.5,C.muted,'center',1.5);ctx.globalAlpha=1;momentText(ln.text,m.x,yL+8,a)}
        else momentText(ln.text,m.x,yL,a)}
      if(m.side&&!m.out){const off=sd=>sd==='right'?m.w+15:sd==='left'?-(m.w+15):0,oy=sd=>sd==='top'?-38:0,e2=ease(m.dp);
        const x=m.x+(m.prev?lerp(off(m.prev),off(m.side),e2):off(m.side)),y0=yL+(m.prev?lerp(oy(m.prev),oy(m.side),e2):oy(m.side));
        // beim Wechsel von Fühlen zu Denken springt die Ladung im Bogen über den Moment
        const bogen=m.prev&&m.prev!=='top'&&m.side!=='mid'&&m.side!=='top'?(sl.mann?-24:34):0;
        if(sl.mann&&!ln)S.pad={x:m.x-15,y:yL-14,w:30,h:28};
        chargeDot(x,y0-Math.sin(Math.PI*e2)*bogen,m.sg||m.sign,Math.max(0,m.ds)*(m.big?1.6:1.25))}
      // geschlossen und adressiert: Bezeichnung |Ladung|
      if(!ln&&m.addr&&!m.out){ctx.globalAlpha=ease((m.age-n*m.dur-0.2)/0.5);ctx.font='italic 15px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='right';
        const tw=ctx.measureText(m.addrLabel).width;ctx.fillStyle=C.bg;ctx.fillRect(m.x-m.w-13-tw,yL-10,tw+8,20);
        ctx.fillStyle=C.ink;ctx.fillText(m.addrLabel,m.x-m.w-9,yL+5);ctx.globalAlpha=1}})
    S.e.forEach(o=>{if(o.t<0)return;const kk=ease(o.t),a=o.t<1?0.6:0.6*(1-(o.t-1)/1.2);
      ctx.globalAlpha=Math.max(0,a);chargeDot(lerp(o.x0,o.x1,kk),lerp(o.y0,o.y1,kk),o.sign,0.9);ctx.globalAlpha=1})}
  if(k>0.5)label(T('zeit').toUpperCase(),W-2,(sl.mann?yL-22:yN)-9,10,C.muted,'right',1.5);
  // festgeschrieben: die Zeit an beiden Enden gefasst und zugeknotet
  if(S.frozen){knot(S.knotL,yL);knot(S.knotR,yL)}
  // Speicher (sx: waagerechter Versatz, solange er noch der Bauch des Männchens ist)
  ctx.save();ctx.translate(sx,0);
  ctx.globalAlpha=sb;ctx.beginPath();
  for(let i=0;i<=72;i++){const a=i/72*6.283,tt=reduce||S.frozen?0:time;
    const rr=R*(1+0.012*Math.sin(a*3+tt*0.8)+0.01*Math.sin(a*5-tt*0.6));
    const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}
  ctx.closePath();ctx.fillStyle=C.paper;ctx.fill();
  ctx.globalAlpha=sb*Math.min(0.28,Math.abs(S.level)*0.4);ctx.fillStyle=S.level>0?C.plus:C.minus;ctx.fill();ctx.globalAlpha=sb;
  ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();
  bandMalen();ctx.globalAlpha=sa;
  // Pegel
  const y=cy+R+22,x0=cx-R,x1=cx+R;
  ctx.strokeStyle=C.muted;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);
  ctx.moveTo(cx,y-5);ctx.lineTo(cx,y+5);ctx.stroke();
  label('−',x0-12,y+5,16,C.minus,'center');label('+',x1+12,y+5,16,C.plus,'center');
  ctx.fillStyle=lv>0.06?C.plus:lv<-0.06?C.minus:C.ink;
  ctx.beginPath();ctx.arc(cx+lv*R,y,6.5,0,6.283);ctx.fill();
  // unter dem Pegel: was das ist und wie es ihm geht. Beim Foto „Festgehalten“, beim benannten Foto die Schreibweise des Ladungsträgers.
  const pf=S.frozen?ease(S.fotoP):S.fotoP,zu=mood(S.level).toUpperCase();let zeile=T(S.frozen?'festgehalten':'speicher').toUpperCase()+' · '+zu;
  ctx.font='10.5px '+C.sans;if(ctx.measureText(zeile).width+1.5*zeile.length>W-6)zeile=zu;
  if(pf<0.99){ctx.globalAlpha=sa*(1-pf);label(zeile,cx,y+23,10.5,C.muted,'center',1.5)}
  if(pf>0.01)schreibweise(cx,y+23,sa*pf);
  ctx.globalAlpha=1;
  // Ladungen im Speicher
  const auf=!reduce&&S.losT>0.9&&S.losT<2.7?1+0.32*Math.pow(Math.sin((S.losT-0.9)/1.8*Math.PI*3),2):1;   // lose Ladungen blinken auf
  const klein=sl.figur?1-ease(figurK(sl)/0.45):sl.ein&&S.ein?S.ein.kB:1;   // wird der Speicher zum Bauch, schrumpfen sie mit
  S.p.forEach(q=>chargeDot(q.x,q.y,q.sign,(q.t<1?1.25-0.4*q.t:0.85)*(q.big?1.3:1)*(q.to?1:auf)*klein));
  // Ladungsträger: Bezeichnung |Ladungen|
  const blass=sl.ein&&S.ein?ease((S.ein.kB-0.82)/0.18):1;   // wächst der Speicher aus dem Bauch, erscheinen die Ladungsträger darin zuletzt
  S.c.forEach(c=>{ctx.font='italic 14px '+C.serif;const tw=ctx.measureText(c.label).width;
    const ws=c.charges.map(ch=>ch.big?17:11),bw=Math.max(11,ws.reduce((a,b)=>a+b,0))+10,tot=tw+7+bw,x0=c.x-tot/2,bx=x0+tw+7;
    c.slot=bx+bw-9-c.x+(c.charges.length?6:0);c.rx=bx+bw;   // hier kommt die nächste Ladung an
    ctx.globalAlpha=c.a*blass;ctx.fillStyle=C.ink;ctx.textAlign='left';ctx.fillText(c.label,x0,c.y+5);
    ctx.strokeStyle=C.plus;ctx.lineWidth=2+c.pulse;ctx.beginPath();ctx.moveTo(bx,c.y-9);ctx.lineTo(bx,c.y+9);ctx.moveTo(bx+bw,c.y-9);ctx.lineTo(bx+bw,c.y+9);ctx.stroke();
    let gx=bx+5;c.charges.forEach((ch,i)=>{const hw=ch.big?6:3.5,mx=gx+ws[i]/2;ctx.strokeStyle=ch.s>0?C.plus:C.minus;ctx.lineWidth=ch.big?2.4:1.8;
      ctx.beginPath();ctx.moveTo(mx-hw,c.y);ctx.lineTo(mx+hw,c.y);if(ch.s>0){ctx.moveTo(mx,c.y-hw);ctx.lineTo(mx,c.y+hw)}ctx.stroke();gx+=ws[i]});
    ctx.globalAlpha=1});
  // Verbindungen: ein Bügel von einem Ladungsträger zum nächsten, rechts neben ihren Platten
  S.steg.forEach(l=>{const a=carrier(l.a),b=carrier(l.b);if(!a||!b||!a.rx||!b.rx)return;
    const x0=a.rx+5,x1=b.rx+5,xm=Math.max(x0,x1)+17,ym=(a.y+b.y)/2,kk=ease(l.k);
    ctx.strokeStyle=C.ink;ctx.fillStyle=C.ink;ctx.lineWidth=1.6;ctx.lineCap='round';ctx.globalAlpha=blass*Math.min(a.a,b.a);ctx.beginPath();
    for(let j=0;j<=18;j++){const u=j/18*kk,p=(1-u)*(1-u),q=2*u*(1-u),r=u*u,X=p*x0+q*xm+r*x1,Y=p*a.y+q*ym+r*b.y;j?ctx.lineTo(X,Y):ctx.moveTo(X,Y)}
    ctx.stroke();ctx.beginPath();ctx.arc(x0,a.y,2.2,0,6.283);ctx.fill();if(kk>=1){ctx.beginPath();ctx.arc(x1,b.y,2.2,0,6.283);ctx.fill()}
    ctx.lineCap='butt';ctx.globalAlpha=1});
  ctx.restore();
  if(vl)vlLadung(k,yN);
  // festgeschrieben: der Moment als Foto
  if(S.frozen||S.fotoP>0){
    // p: wie weit der Rahmen zu den beiden Platten geworden ist. Läuft die Zeit wieder, verblassen Platten und Name.
    const p=S.frozen?ease(S.fotoP):1,al=S.frozen?1:S.fotoP,kk=R+10,c=14;ctx.globalAlpha=al;ctx.strokeStyle=C.plus;ctx.lineWidth=lerp(2,3,p);
    [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([ax,ay])=>{const x=cx+ax*kk,y2=cy+ay*kk;
      ctx.beginPath();ctx.moveTo(x-ax*c*(1-p),y2);ctx.lineTo(x,y2);ctx.lineTo(x,y2-ay*lerp(c,kk,p));ctx.stroke()});
    if(S.fotoName&&p>0.01){ctx.globalAlpha=al*p;ctx.font='italic 18px '+C.serif;ctx.fillStyle=C.ink;const tw=ctx.measureText(S.fotoName).width;
      // der Name steht vor den Platten; ist dort kein Platz, steht er nur in der Schreibweise unter dem Pegel
      if(cx-kk-10-tw>=2){ctx.textAlign='right';ctx.fillText(S.fotoName,cx-kk-10,cy+6)}}
    ctx.globalAlpha=1;
    const fl=1-(time-S.freezeAt)/0.45;
    if(S.frozen&&fl>0&&!reduce){ctx.globalAlpha=fl*0.6;ctx.fillStyle=C.paper;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
  }
  // das Männchen neben dem Foto: was im Foto liegt, ist sein Bauch
  if(sl.ich&&S.ich){const a=ease((S.ich.t-0.3)/0.8);
    if(a>0.01){const kk=R+10,r=Math.max(9,Math.min(14,(W/2-kk-12)/3.8)),x=Math.min(W-1.9*r-4,cx+kk+16+1.9*r);
      ctx.globalAlpha=a;ctx.beginPath();ctx.arc(x,cy,r,0,6.283);ctx.fillStyle=C.paper;ctx.fill();
      ctx.globalAlpha=a*Math.min(0.28,Math.abs(S.level)*0.4);ctx.fillStyle=S.level>0?C.plus:C.minus;ctx.fill();
      ctx.globalAlpha=a;ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();figur(x,cy,r,1);ctx.globalAlpha=1}}
  // du auf der Zeitlinie (im Übergang zeichnet drawEin das Männchen)
  if(sl.mann&&!sl.ein){const G=S.gang,yT=yL-22,zuck=G&&G.sch>0.02&&!reduce?Math.sin(time*46)*4.5*G.sch:0,fx=cx+(G?G.bx:0)+zuck,fy=mannY(),geht=!reduce&&G&&((G.ph==='geht'&&S.lese<=0)||G.ph==='weiter');
    // der Türrahmen kommt mit der Zeit auf dich zu
    if(G&&G.art==='mensch'){const a=1-(G.blass||0),gx=G.x+RM*1.8;
      if(a>0.01&&gx<W+30){ctx.globalAlpha=a;ctx.beginPath();ctx.arc(gx,fy,RM,0,6.283);ctx.fillStyle=C.paper;ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();
        figur(gx,fy,RM,1,geht&&G.ph==='geht'?-Math.sin(time*8):0);
        if(G.ph==='geht'||G.ph==='stoss')label(T('kollege').toUpperCase(),gx+RM*1.8+5,yT-26,9.5,C.muted,'left',1.5);ctx.globalAlpha=1}}
    // der Film: ein Bild im Rahmen, darin ein kleines Männchen
    else if(G&&G.art==='film'){const a=1-(G.blass||0),x=G.x+4;
      if(a>0.01&&x<W+30){ctx.globalAlpha=a;ctx.fillStyle=C.paper;ctx.fillRect(x,yT-33,34,27);ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.strokeRect(x,yT-33,34,27);
        ctx.beginPath();ctx.moveTo(x+17,yT-6);ctx.lineTo(x+17,yT);ctx.stroke();
        const r2=3.4,mx=x+17,my=yT-21;ctx.beginPath();ctx.arc(mx,my,r2,0,6.283);ctx.stroke();figur(mx,my,r2,1,0);
        if(G.ph==='geht'||G.ph==='stoss')label(T('film').toUpperCase(),x+40,yT-26,9.5,C.muted,'left',1.5);ctx.globalAlpha=1}}
    else if(G&&G.x<W+20&&G.x>-80){ctx.strokeStyle=C.ink;ctx.lineWidth=2;ctx.lineJoin='miter';ctx.beginPath();
      ctx.moveTo(G.x,yT);ctx.lineTo(G.x,yT-30);ctx.lineTo(G.x+16,yT-30);ctx.lineTo(G.x+16,yT);ctx.stroke();
      if(G.ph==='geht'||G.ph==='stoss')label(T('tuerrahmen').toUpperCase(),G.x,yT-36,9.5,C.muted,'left',1.5)}
    ctx.beginPath();ctx.arc(fx,fy,RM,0,6.283);ctx.fillStyle=C.paper;ctx.fill();
    ctx.globalAlpha=Math.min(0.28,Math.abs(S.level)*0.4);ctx.fillStyle=S.level>0?C.plus:C.minus;ctx.fill();ctx.globalAlpha=1;
    if(G&&Math.abs(G.tint||0)>0.03){ctx.globalAlpha=Math.min(0.85,Math.abs(G.tint)*0.85);ctx.fillStyle=G.tint>0?C.plus:C.minus;ctx.fill();ctx.globalAlpha=1}
    ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();figur(fx,fy,RM,1,geht?Math.sin(time*8):0)}
}

let last=performance.now();
function loop(now){
  const dt=Math.min(0.05,(now-last)/1000);last=now;step(dt);
  ctx.clearRect(0,0,W,H);
  const sc=SLIDES[cur].scene;
  if(sc==='dreieck')drawDreieck();else if(sc==='linie')drawLinie();else if(sc==='bindung')drawBindung();else if(sc==='steg')drawSteg();else if(sc==='zwei')drawZwei();else if(sc==='arbeit')drawArbeit();else if(sc==='grob')drawGrob();else if(sc==='strom')drawStrom();else if(sc==='fokus')drawFokus();else if(sc==='film')drawFilm();else if(sc==='spitze')drawSpitze();else if(sc==='schloss')drawSchloss();else if(sc==='drehen')drawDrehen();else if(sc==='sicht')drawSicht();else{drawSpeicher();if(SLIDES[cur].figur)drawFigur();if(SLIDES[cur].hinaus&&S.aus)drawHinaus();if(SLIDES[cur].ein&&S.ein)drawEin();if(SLIDES[cur].zumSteg&&S.zs)drawZumSteg()}
  requestAnimationFrame(loop);
}
new ResizeObserver(resize).observe(stage);
// jeder Schritt mit data-anker hat eine eigene Adresse (#karte, #ladung, …), z.B. für einen QR-Code im Buch
let start=0;try{const h=(location.hash||'').slice(1).toLowerCase();const i=SLIDES.findIndex(x=>x.anchor===h);if(i>=0)start=i}catch(e){}
resize();go(start);requestAnimationFrame(loop);
// „erledigt“ ändert sich laufend; die Navigation bleibt so aktuell
setInterval(syncNav,400);
