/* ---------- Zwei Menschen, derselbe Tag ----------
   Zwei Bahnen übereinander. Der Ablauf ist ein Plan aus Zügen, die nacheinander laufen: {dur, start, run(k)}. */
const BAHNEN=['passiv','aktiv'],RZ=7;
function zweiStart(s,prev){stOf(s).bsp={};const i=SLIDES.indexOf(s),v=SLIDES[i-1];
  S.zw=s.zurueck&&!reduce&&prev===i-1&&v&&v.scene==='zwei'?zweiZurueck(s,v):zweiBau(s)}
/* Übergang „zurück“ (data-uebergang="zurueck"), nur direkt aus dem Schritt davor: der Tag läuft zurück. Die Bahnen stehen, wie der Schritt davor endet.
   Eins nach dem anderen: die Gedanken gehen · die Blicklinie zieht sich zurück · die Zeitlinien laufen rückwärts, das Zeichen wandert nach rechts hinaus ·
   was aufgestiegen war, verlässt den Bauch · je Träger, der letzte zuerst: sein Verbindungsstück löst sich (mit dem letzten verschwindet der Name des Stegs),
   dann steigt er als Ladung zum Männchen zurück · die Zeit steht · oben wechselt der Name der Bahn · unten geht das Männchen nach links hinaus,
   von rechts kommt das neue, dann erscheint sein Name. Danach beginnt der Schritt wie sonst: Text, Lesepause, Ablauf. */
function zweiZurueck(s,v){const Z=zweiBau(v);Z.plan.forEach(p=>{if(p.ende)return;if(p.start)p.start();if(p.run)p.run(1)});
  Z.plan=[];Z.i=0;Z.t=0;Z.fertig=false;Z.geht=false;Z.bx=0;
  const U=Z.ue={von:v,alt:BAHNEN.map((b,i)=>v.bahnen[i]||T(b)),aAlt:[1,1],aNeu:[0,0],rueck:0},Ls=BAHNEN.map(b=>Z.B[b]),unten=Z.B.aktiv;
  Ls.forEach(L=>{L.sch=0;L.els.forEach(e=>{e.d=0;e.v=0})});
  const add=(dur,run,start)=>Z.plan.push({dur,run,start});
  add(0.25);
  add(0.35,k=>Ls.forEach(L=>{if(L.ged){L.ged.a=1-k;if(k>=1)L.ged=null}}));
  if(Z.blick>0.01)add(0.3,k=>Z.blick=1-k);
  add(0.3,null,()=>{U.rueck=1;Z.geht=true});
  for(let n=Math.max(...Ls.map(L=>L.treffer));n>0;n--)add(0.22,null,()=>Ls.forEach(L=>{if(L.treffer>=n)L.treffer--}));
  for(let j=Math.max(...Ls.map(L=>L.els.length))-1;j>=0;j--){
    const mit=Ls.filter(L=>L.links.some(l=>l.b===j));
    if(mit.length){add(0.35,k=>mit.forEach(L=>L.links.forEach(l=>{if(l.b===j)l.k=1-k})));
      add(0.05,null,()=>mit.forEach(L=>{L.links=L.links.filter(l=>l.b!==j)}));
      const leer=mit.filter(L=>!L.links.some(l=>l.b<j));if(leer.length)add(0.3,k=>leer.forEach(L=>L.name=1-k))}
    add(0.5,k=>Ls.forEach(L=>{if(L.els[j]&&L.fall){L.els[j].a=1-ease(k/0.45);L.fall.k=1-k}}),
      ()=>Ls.forEach(L=>{const e=L.els[j];if(e)L.fall={j,k:1,sign:(e.charges[0]||{s:-1}).s}}));
    add(0.15,null,()=>Ls.forEach(L=>{L.fall=null;if(L.els.length>j){L.els.length=j;L.alle.length=j}}))}
  add(0.4,null,()=>{U.rueck=0;Z.geht=false});
  BAHNEN.forEach((b,i)=>{if(U.alt[i]===(s.bahnen[i]||T(b))){U.aAlt[i]=0;U.aNeu[i]=1}});
  if(U.aAlt[0]){add(0.25,k=>U.aAlt[0]=1-k);add(0.35,k=>U.aNeu[0]=k);add(0.25)}
  if(U.aAlt[1]){const weit=()=>cx+40;
    add(0.9,k=>{unten.dx=-weit()*k;U.aAlt[1]=1-ease(k/0.4)},()=>{unten.laeuft=true});
    add(0.15,null,()=>{unten.dx=W-cx+40});
    add(0.9,k=>unten.dx=(W-cx+40)*(1-k));
    add(0.1,null,()=>{unten.laeuft=false;unten.dx=0});
    add(0.35,k=>U.aNeu[1]=k)}
  add(0.3);
  add(0,null,()=>{const N=zweiBau(s);N.weg=N.w0=Z.weg;S.zw=N;$('text').classList.remove('warte');S.lese=lesezeit();syncNav()});
  return Z}
// data-stand: der Schritt beginnt so, wie der genannte endet. Dessen Plan läuft dafür einmal im Stillen bis zum Ende durch.
function zweiBau(s){const ev=s.ereignisse,vor=SLIDES.find(x=>x.id===s.stand&&x!==s);
  const el=(e,a)=>({id:e.id,label:e.label,charges:zeichen(e.lad),d:0,v:0,a});
  // alle: was in der Reihe dieser Bahn liegen wird · mehr: Plätze, die auf der Insel noch dazukommen
  const mk=()=>({els:[],alle:[],mehr:0,links:[],ged:null,name:0,fall:null,auf:null,treffer:0,sch:0,sink:0,pos:[],hell:0,hellS:1,handy:0,puff:null,wurf:null,deckel:0});
  const Z=vor?zweiBau(vor):{weg:0,w0:0,geht:false,bx:0,nur:'',blick:0,gl:[],B:{passiv:mk(),aktiv:mk()},ins:null};
  if(vor){Z.plan.forEach(p=>{if(p.ende)return;if(p.start)p.start();if(p.run)p.run(1)});Z.bx=0;Z.geht=false;
    BAHNEN.forEach(b=>{const L=Z.B[b];L.sch=0;L.els.forEach(e=>{e.d=0;e.v=0})})}
  // <p class="glied"> im Block: in beiden Bahnen liegt von Anfang an derselbe Steg, verbunden und benannt
  if(!vor&&s.glieder.length)BAHNEN.forEach(b=>{const L=Z.B[b];L.alle=s.glieder.map(g=>({label:g.label,charges:zeichen(g.lad)}));L.els=s.glieder.map(g=>el(g,1));
    L.links=s.glieder.slice(1).map((g,i)=>({a:i,b:i+1,k:1}));L.name=1});
  Z.plan=[];Z.i=0;Z.t=0;Z.fertig=false;
  const add=(dur,run,start)=>Z.plan.push({dur,run,start});
  const steigt=(L,i,sign)=>add(0.5,k=>{if(L.auf){L.auf.k=k;if(k>=1){L.auf=null;L.treffer++;L.sch=0.6+0.5*L.treffer}}},()=>{L.auf={i,k:0,sign}});
  // Übergang: aus zwei Bahnen werden zwei Inseln
  if(s.inseln){const I=Z.ins={k0:0,mA:0,mB:0,kA:0,kB:0,kC:0,kD:0,ab:[],zitat:null},dauer=b=>1.8*(0.56+0.2*Math.max(0,Z.B[b].els.length-1));
    s.sprueche.forEach(sp=>Z.B[sp.an].mehr++);
    add(0.8,k=>I.k0=k);add(0.2);
    // erst der obere Mensch und seine Träger, dann der untere und seine: so steht keiner dem anderen im Weg
    add(0.7,k=>I.mA=k);add(0.15);
    add(dauer('passiv'),k=>I.kA=k);add(0.25);
    add(0.9,k=>I.mB=k);add(0.15);
    add(dauer('aktiv'),k=>I.kB=k);add(0.3);
    add(0.9,k=>I.kC=k);
    add(1.0,k=>I.kD=k);add(1.2);
    // wer geladen ist, lädt ab: sein Satz erscheint, eine Ladung fliegt hinüber und kommt beim anderen über einen Träger an
    s.sprueche.forEach(sp=>{const von=Z.B[sp.von],an=Z.B[sp.an],sign=(zeichen(sp.lad)[0]||{s:-1}).s;let platz=0;
      add(0.5,k=>I.zitat.a=k,()=>{I.zitat={text:sp.text,a:0,von:sp.von}});
      add(1.8);
      // von Männchen zu Männchen: der eine wird heller, den anderen trifft es
      add(0.95,k=>I.ab[0].k=k,()=>{I.ab=[{k:0,sign,von:{b:sp.von},an:{b:sp.an},bogen:26}];if(von.treffer>0)von.treffer--});
      add(0.6,null,()=>{I.ab=[];an.treffer++;an.sch=0.6+0.5*an.treffer});
      // erst dann bekommt sie bei ihm ihre Adresse: sie fällt in seinen Speicher, an den Platz eines neuen Trägers
      add(0.65,k=>I.ab[0].k=k,()=>{platz=an.els.length;I.ab=[{k:0,sign,von:{b:sp.an},an:{b:sp.an,i:platz},bogen:0}]});
      add(0.4,k=>an.els[platz].a=k,()=>{I.ab=[];an.els[platz]=el(sp,0);an.mehr=Math.max(0,an.mehr-1)});
      add(0.7)})}
  // Kanal: die Inseln stehen schon, so wie vor dem Satz. Der Kanal wächst, der Satz erscheint. Dann wählt man.
  if(s.kanal&&s.sprueche[0]){const sp=s.sprueche[0],von=Z.B[sp.von],an=Z.B[sp.an];
    const I=Z.ins={k0:1,mA:1,mB:1,kA:1,kB:1,kC:1,kD:1,ab:[],zitat:null,antwort:null,kanal:0,zu:0,blitz:0,start:{von:von.treffer,an:an.treffer,n:an.els.length}};
    an.mehr=1;BAHNEN.forEach(b=>Z.B[b].sink=Z.B[b].treffer*4);
    add(0.4);add(0.9,k=>I.kanal=k);add(0.3);
    add(0.5,k=>I.zitat.a=k,()=>{I.zitat={text:sp.text,a:0,von:sp.von}})}
  ev.forEach((e,n)=>{const halt=()=>e.sicht?cx+Math.max(64,Math.min(120,W*0.2)):cx+RZ*1.9+3;
    const mit=BAHNEN.filter(b=>e.ged[b]),nur=mit.length===1?mit[0]:'',ix={};
    if(e.knopf)return;   // erscheint als Knopf und läuft erst nach dem Tipp (zweiBeispiel)
    // was in dir entsteht, bekommt seinen Platz erst, wenn es so weit ist: die Reihe macht dann Platz
    if(!e.sicht&&!e.geht&&!e.innen)mit.forEach(b=>{const L=Z.B[b];ix[b]=L.alle.length;L.alle.push({label:e.label,charges:zeichen(e.lad)})});
    // der Tag läuft weiter: die Gedanken von eben gehen, das nächste Zeichen kommt (auf beiden Zeitlinien, wenn es beide trifft)
    if(n||vor)add(0.35,k=>BAHNEN.forEach(b=>{const L=Z.B[b];if(L.ged){L.ged.a=1-k;if(k>=1)L.ged=null}}));
    add(1.7,k=>{const d=(W+30-halt())*k;Z.gl.forEach(q=>{q.x=q.x0-d;if(q.e!==e)q.al=1-ease(k/0.7)});Z.weg=Z.w0+d;
        if(k>=1){Z.geht=false;Z.nur=nur;if(!e.sicht&&!e.geht&&!e.innen)Z.bx=e.art==='tuer'?-5:-2.5;Z.gl=Z.gl.filter(q=>q.e===e)}},
      ()=>{Z.gl.push({e,x:W+30,al:1,nur});Z.gl.forEach(q=>q.x0=q.x);Z.w0=Z.weg;Z.geht=true;Z.blick=0});
    add(0.5);
    if(e.sicht){
      // nur Sichtkontakt: die Blicklinie wächst zum Zeichen
      add(0.6,k=>Z.blick=k);add(0.5);
      mit.forEach(b=>{const L=Z.B[b],i0=L.els.findIndex(x=>x.id===e.ruft);if(i0<0)return;
        // wer am gerufenen Träger hängt, der Reihe nach
        const reihe=[i0];for(let g=0;g<reihe.length;g++)L.links.forEach(l=>{const o=l.a===reihe[g]?l.b:l.b===reihe[g]?l.a:-1;if(o>=0&&!reihe.includes(o))reihe.push(o)});
        add(0.5,null,()=>{L.els[i0].v+=reduce?0:105});
        reihe.forEach(i=>steigt(L,i,(L.els[i].charges[0]||{s:-1}).s));
        add(0.9);
        add(0.4,k=>L.ged.a=k,()=>{L.ged={text:e.ged[b].text,a:0}});
        add(1.6)});
      return}
    if(e.geht||e.innen){zweiInnen(Z,e,add);
      // data-satz: der Satz zu diesem Ereignis, mit Lesezeit, bevor das nächste kommt
      if(e.satz&&ev.slice(n+1).some(x=>!x.knopf)){add(0,null,()=>say(e.satz));add(3.2);add(0,null,()=>say(''))}
      return}
    // erst der eine, dann der andere. Denken beide dasselbe, läuft es in beiden Bahnen zugleich.
    const gleich=mit.length===2&&e.ged.passiv.text===e.ged.aktiv.text;
    (gleich?[mit]:mit.map(b=>[b])).forEach(gr=>{
      add(0.4,k=>gr.forEach(b=>Z.B[b].ged.a=k),()=>gr.forEach(b=>Z.B[b].ged={text:e.ged[b].text,a:0}));
      add(1.5);
      add(0.6,k=>gr.forEach(b=>Z.B[b].fall.k=k),()=>gr.forEach(b=>Z.B[b].fall={j:ix[b],k:0,sign:(zeichen(e.lad)[0]||{s:-1}).s}));
      add(0.4,k=>gr.forEach(b=>Z.B[b].els[ix[b]].a=k),()=>gr.forEach(b=>{const L=Z.B[b];L.fall=null;L.els[ix[b]]=el(e,0)}));
      gr.filter(b=>ix[b]&&e.ged[b].verbindet).forEach(b=>{const L=Z.B[b];
        add(0.5,k=>L.links[L.links.length-1].k=k,()=>L.links.push({a:ix[b]-1,b:ix[b],k:0}));
        add(0.5,k=>{if(L.name<1)L.name=Math.max(L.name,k)})});
      // data-bleibt: die Ladung steigt gleich wieder auf, der Mensch bleibt geladen
      if(e.bleibt)gr.forEach(b=>{add(0.4);zeichen(e.lad).forEach(ch=>steigt(Z.B[b],ix[b],ch.s))});
      add(0.7)})});
  add(0,null,()=>{Z.fertig=true;const t=satzVon(s,'tippen');if(t)say(t,true);else say(satzVon(s,'an'));syncNav()});
  Z.plan[Z.plan.length-1].ende=true;
  return Z}
// Was in dir entsteht (data-geht, data-innen). Je Bahn: der Gedanke · mit data-sortiert lösen sich die Verbindungsstücke, und der Name des Stegs
// fliegt in die Tonne · die Ladung entsteht im Bauch · mit data-verpufft sinkt sie ins Wasser und vergeht, sonst rückt die Reihe zur Seite,
// sie fällt an ihren Platz und wird zum Träger. Mit data-geht erst beide Gedanken, dann gehen beide weiter, dann die Ladungen.
// Ohne data-geht läuft jede Bahn für sich zu Ende, erst oben, dann unten.
function zweiInnen(Z,e,add){const mit=BAHNEN.filter(b=>e.ged[b]),halt=()=>cx+RZ*1.9+3;
  const denkt=b=>{const L=Z.B[b],g=e.ged[b];let h=0;
    add(0.4,k=>{L.ged.a=k;L.handy=g.handy?Math.max(h,k):h*(1-k)},()=>{h=L.handy;L.ged={text:g.text,a:0}});add(1.3)};
  const laedt=b=>{const L=Z.B[b],g=e.ged[b],lad=g.lad||e.lad,sign=(zeichen(lad)[0]||{s:1}).s;let j=0;
    if(g.sortiert){
      L.links.forEach(l=>add(0.5,k=>l.k=1-k));add(0.4,null,()=>{L.links=[]});
      add(1.2,k=>{L.wurf.k=k;L.deckel=Math.min(1,k*3)},()=>{L.wurf={k:0};L.name=0});
      add(0.5,k=>L.deckel=1-k,()=>{L.wurf=null});add(0.5)}
    add(0.5,k=>L.hell=k,()=>{L.hellS=sign;if(!g.verpufft){j=L.alle.length;L.alle.push({label:g.name||e.label,charges:zeichen(lad)})}});add(0.45);
    if(g.verpufft){add(1.3,k=>{L.puff.k=k;L.hell=1-k},()=>{L.puff={k:0,sign}});add(0.1,null,()=>{L.puff=null})}
    else{add(0.6,k=>{L.fall.k=k;L.hell=1-k},()=>{L.fall={j,k:0,sign}});
      add(0.4,k=>L.els[j].a=k,()=>{L.fall=null;L.els[j]={id:e.id,label:g.name||e.label,charges:zeichen(lad),d:0,v:0,a:0}})}
    add(0.7)};
  if(e.geht){mit.forEach(denkt);
    add(2.6,k=>{const d=(halt()+70)*ease(k);Z.gl.forEach(q=>q.x=q.x0-d);Z.weg=Z.w0+d;if(k>=1){Z.geht=false;Z.gl=[]}},
      ()=>{Z.gl.forEach(q=>q.x0=q.x);Z.w0=Z.weg;Z.geht=true});
    add(0.5);mit.forEach(laedt)}
  else mit.forEach(b=>{denkt(b);laedt(b)})}
// ein weiteres Beispiel (Ereignis mit data-knopf): die Gedanken von eben gehen, das neue Zeichen kommt, dann läuft es wie oben
function zweiBeispiel(s,e){const Z=S.zw,st=stOf(s);if(!Z||!Z.fertig||Z.laeuft)return;st.bsp=st.bsp||{};if(st.bsp[e.id])return;st.bsp[e.id]=1;
  say('');S.ev=[];Z.plan=[];Z.i=0;Z.t=0;Z.laeuft=true;const add=(dur,run,start)=>Z.plan.push({dur,run,start}),halt=cx+RZ*1.9+3;
  add(0.35,k=>BAHNEN.forEach(b=>{const L=Z.B[b];if(L.ged){L.ged.a=Math.min(L.ged.a,1-k);if(k>=1)L.ged=null}}));
  add(1.3,k=>{const d=(W+30-halt)*k;Z.gl.forEach(q=>{q.x=q.x0-d;if(q.e!==e)q.al=1-ease(k/0.7)});Z.weg=Z.w0+d;if(k>=1){Z.geht=false;Z.gl=Z.gl.filter(q=>q.e===e)}},
    ()=>{Z.gl.push({e,x:W+30,al:1,nur:''});Z.gl.forEach(q=>q.x0=q.x);Z.w0=Z.weg;Z.geht=true});
  add(0.4);
  zweiInnen(Z,e,add);
  const alle=s.ereignisse.filter(x=>x.knopf).every(x=>st.bsp[x.id]);
  add(0,null,()=>{Z.laeuft=false;say((alle&&satzVon(s,'alle'))||satzVon(s,'mehr')||satzVon(s,'an'));syncNav()})}
function zweiTakt(s,dt,liest){const Z=S.zw;Z.bx*=Math.pow(0.003,dt);BAHNEN.forEach(b=>Z.B[b].sch*=Math.pow(0.1,dt));
  // jedes Element federt. Nur wo ein Verbindungsstück sitzt, zieht es den Nachbarn mit.
  BAHNEN.forEach(b=>{const L=Z.B[b],E=L.els,acc=E.map((e,i)=>{let a=-38*e.d-2.6*e.v;
      L.links.forEach(l=>{if(l.k>=1&&E[l.a]&&E[l.b]){if(l.a===i)a+=60*(E[l.b].d-e.d);if(l.b===i)a+=60*(E[l.a].d-e.d)}});return a});
    E.forEach((e,i)=>{e.v+=acc[i]*dt;e.d+=e.v*dt})});
  if(liest)return;
  // der Tag läuft zurück: die Zeitlinien laufen rückwärts, was auf ihnen steht, wandert nach rechts hinaus
  if(Z.ue&&Z.ue.rueck){const d=110*dt;Z.weg-=d;Z.gl.forEach(q=>q.x+=d)}
  for(let g=0;Z.i<Z.plan.length&&g<400;g++){const p=Z.plan[Z.i];if(!p.on){p.on=true;if(p.start)p.start()}
    Z.t+=dt;dt=0;const k=reduce||!p.dur?1:Math.min(1,Z.t/p.dur);if(p.run)p.run(k);if(k<1)break;Z.i++;Z.t=0}}
// Kanal: derselbe Satz, drei Wege. Jeder Tipp beginnt wieder vor dem Satz.
function kanalWahl(s,w){const Z=S.zw,I=Z&&Z.ins,sp=s.sprueche[0];if(!I||!Z.fertig||Z.laeuft)return;
  const von=Z.B[sp.von],an=Z.B[sp.an],sign=(zeichen(sp.lad)[0]||{s:-1}).s,st=stOf(s);
  von.treffer=I.start.von;an.treffer=I.start.an;an.els.length=I.start.n;an.mehr=1;von.sch=0;an.sch=0;I.ab=[];I.antwort=null;I.zu=0;I.blitz=0;say('');S.ev=[];
  Z.plan=[];Z.i=0;Z.t=0;Z.laeuft=true;const add=(dur,run,start)=>Z.plan.push({dur,run,start});
  const sagen=()=>{if(w.sagt){add(0.4,k=>I.antwort.a=k,()=>{I.antwort={text:w.sagt,a:0,von:sp.an}});add(1.3)}};
  add(0.5);
  if(w.id==='rein'){
    add(1.0,k=>I.ab[0].k=k,()=>{I.ab=[{k:0,sign,von:{b:sp.von},an:{b:sp.an},bogen:0}];if(von.treffer>0)von.treffer--});
    add(0.6,null,()=>{I.ab=[];an.treffer++;an.sch=0.6+0.5*an.treffer});
    let platz=0;
    add(0.65,k=>I.ab[0].k=k,()=>{platz=an.els.length;I.ab=[{k:0,sign,von:{b:sp.an},an:{b:sp.an,i:platz},bogen:0,faellt:true}]});
    add(0.4,k=>an.els[platz].a=k,()=>{I.ab=[];an.els[platz]={id:sp.id,label:sp.label,charges:zeichen(sp.lad),d:0,v:0,a:0};an.mehr=0})}
  else if(w.id==='raus'){
    // seine Ladung läuft bis zur Mitte · du antwortest · dein Plus läuft ihr entgegen · beide heben sich auf
    add(0.6,k=>I.ab[0].k=k,()=>{I.ab=[{k:0,sign,von:{b:sp.von},an:{b:sp.an},bogen:0,bis:0.5}];if(von.treffer>0)von.treffer--});
    add(0.2);sagen();
    add(0.6,k=>I.ab[1].k=k,()=>I.ab.push({k:0,sign:-sign,von:{b:sp.an},an:{b:sp.von},bogen:0,bis:0.5}));
    add(0.45,k=>I.blitz=k,()=>{I.ab=[]})}
  else{
    // du antwortest · der Kanal schließt sich · seine Ladung läuft bis davor und wieder zurück
    sagen();
    add(0.4,k=>I.zu=k);add(0.3);
    add(0.85,k=>I.ab[0].k=k,()=>{I.ab=[{k:0,sign,von:{b:sp.von},an:{b:sp.an},bogen:0,tor:true}];if(von.treffer>0)von.treffer--});
    add(0.25);
    add(0.85,k=>I.ab[0].k=1-k);
    add(0.1,null,()=>{I.ab=[];von.treffer++})}
  add(0.5);
  add(0,null,()=>{Z.laeuft=false;I.blitz=0;st.kanal=st.kanal||{};st.kanal[w.id]=1;
    say(w.cap+(s.wege.every(x=>st.kanal[x.id])&&satzVon(s,'alle')?' '+satzVon(s,'alle'):''));syncNav()})}
// ein Element antippen: es wird in beiden Bahnen angestoßen
function zweiTippen(s,i){const Z=S.zw;if(!Z||!Z.fertig||!satzVon(s,'tippen'))return;BAHNEN.forEach(b=>{const e=Z.B[b].els[i];if(e)e.v+=reduce?30:105});
  say('');S.ev=[];spaeter(1.7,()=>{const c=satzVon(s,'welle');if(c)say(c)})}
// das Zeichen, das mit der Zeit kommt: Türrahmen · ein Mensch · eine Haltestelle
function zeichenMalen(q,yT,zeigt,geht,auf){const x=q.x,fy=yT-2.3*RZ;if(x>W+40||x<-90||q.al<=0.01)return;ctx.globalAlpha=q.al*ctx.globalAlpha;ctx.strokeStyle=C.ink;ctx.lineWidth=1.6;ctx.lineJoin='miter';
  let lx=x;
  if(q.e.art==='mensch'){const gx=x+RZ*1.8;ctx.beginPath();ctx.arc(gx,fy,RZ,0,6.283);ctx.fillStyle=C.paper;ctx.fill();ctx.stroke();figur(gx,fy,RZ,1,geht?-Math.sin(time*8):0);lx=gx+RZ*1.8+5}
  else if(q.e.art==='bus'){ctx.beginPath();ctx.moveTo(x+9,yT);ctx.lineTo(x+9,yT-17);ctx.stroke();
    ctx.beginPath();ctx.arc(x+9,yT-25,8,0,6.283);ctx.fillStyle=C.paper;ctx.fill();ctx.stroke();
    ctx.font='600 10px '+C.sans;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText('H',x+9,yT-21.5);lx=x+22}
  // eine Tonne: ihr Deckel hebt sich, wenn etwas hineinfliegt (auf)
  else if(q.e.art==='tonne'){const o=(auf||0)*6;ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(x+2,yT-17);ctx.lineTo(x+4.5,yT);ctx.lineTo(x+13.5,yT);ctx.lineTo(x+16,yT-17);ctx.closePath();ctx.fillStyle=C.paper;ctx.fill();ctx.stroke();
    ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,yT-20-o);ctx.lineTo(x+18,yT-20-o*0.25);ctx.moveTo(x+6.5,yT-23-o*0.8);ctx.lineTo(x+11.5,yT-23-o*0.6);ctx.stroke();ctx.lineCap='butt';lx=x+24}
  // nur ein Wort: ein Punkt auf der Zeitlinie, darüber die Beschriftung
  else if(q.e.art==='wort'){ctx.beginPath();ctx.arc(x+4,yT,2.8,0,6.283);ctx.fillStyle=C.ink;ctx.fill();lx=x}
  else{ctx.beginPath();ctx.moveTo(x,yT);ctx.lineTo(x,yT-27);ctx.lineTo(x+14,yT-27);ctx.lineTo(x+14,yT);ctx.stroke();lx=x+19}
  if(zeigt)label(q.e.schild.toUpperCase(),lx,yT-22,9,C.muted,'left',1.4);ctx.globalAlpha=1;return lx}
function drawZwei(){const s=SLIDES[cur],Z=S.zw;if(!Z)return;const h=H/2,I=Z.ins,letzt=Z.gl[Z.gl.length-1];
  const aT=I?1-ease(I.k0):1;                                                  // was zum Tag gehört
  const RI=Math.max(72,Math.min(104,W*0.226)),DI=Math.max(RI+8,Math.min(W*0.25,190)),yI=Math.max(0,(h-178)/2)+76+RI;   // die Inseln: auf der Höhe der oberen Bahn
  if(aT>0.01){ctx.globalAlpha=aT;ctx.strokeStyle=C.line;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,h);ctx.lineTo(W,h);ctx.stroke();ctx.globalAlpha=1}
  BAHNEN.forEach((b,bi)=>{const L=Z.B[b],zf=I||!L.alle.length?1:stegZoom(L.alle),z0=I?1:Math.max(zf,0.85),R=stegReihe(L.alle,z0),n=L.els.length+L.mehr,name=s.bahnen[bi]||T(b);
    // kleiner als 0,85 wird die Reihe nicht. Passt sie dann nicht in die Breite, rückt sie nach links: das Älteste wandert aus dem Bild, wie auf der Zeitlinie.
    L.ueber=0;if(!I&&zf<z0){const m=L.alle.length-1,ganz=R[m]+(L.alle[m].tot+18)/2-R[0]+(L.alle[0].tot+18)/2;L.ueber=Math.max(0,(ganz-(W/z0-12))/2);for(let i=0;i<=m;i++)R[i]-=L.ueber}
    // kommt ein Träger dazu, rückt die Reihe weich zur Seite (und wird, wenn nötig, als Ganzes kleiner)
    const z=L.zs=reduce||L.zs===undefined?z0:L.zs+(z0-L.zs)*0.16;
    const y0=bi*h+Math.max(0,(h-178)/2),yT=y0+60,yR=yT+62,ix=cx+(bi?1:-1)*DI;
    // die Träger rücken einer nach dem anderen an ihren Platz, das dauert je nach Anzahl
    const kr=(I?(bi?I.kB:I.kA):0)*(0.56+0.2*Math.max(0,L.alle.length-1)),kb=I?ease(bi?I.mB:I.mA):0;
    const ke=i=>ease((kr-(bi?0:0.26)-i*0.2)/(bi?0.56:0.3)),ky=i=>bi?ke(i):ease((kr-i*0.2)/0.26);
    // jede Insel liegt so tief, wie ihr Mensch gerade geladen ist
    const tief=I?I.kD*L.treffer*4:0;L.sink=reduce?tief:L.sink+(tief-L.sink)*0.07;
    const iy=yI+L.sink+(I&&!reduce?Math.sin(time*1.1+bi*2.4)*1.6*I.kD:0);L.ix=ix;L.iy=iy;L.n=n;
    const fx=lerp(cx+(Z.nur&&Z.nur!==b?0:Z.bx),ix,kb)+(L.dx||0)+(reduce?0:Math.sin(time*46)*1.7*L.sch),fy=lerp(yT-2.3*RZ,iy-RI-2.3*RZ,kb);L.mx=fx;L.my=fy;
    if(aT>0.01){ctx.globalAlpha=aT;
      if(Z.ue){ctx.globalAlpha=Z.ue.aAlt[bi];label(Z.ue.alt[bi].toUpperCase(),12,y0+18,10,C.ink,'left',2);ctx.globalAlpha=Z.ue.aNeu[bi];label(name.toUpperCase(),12,y0+18,10,C.ink,'left',2);ctx.globalAlpha=aT}
      else label(name.toUpperCase(),12,y0+18,10,C.ink,'left',2);
      // die Zeitlinie läuft unter den Füßen durch
      ctx.strokeStyle=C.muted;ctx.lineWidth=1.5;ctx.setLineDash([6,8]);ctx.lineDashOffset=Z.weg;ctx.beginPath();ctx.moveTo(0,yT);ctx.lineTo(W,yT);ctx.stroke();ctx.setLineDash([]);
      Z.gl.forEach(q=>{if(q.nur&&q.nur!==b)return;ctx.globalAlpha=aT;zeichenMalen(q,yT,q===letzt,Z.geht,L.deckel)});ctx.globalAlpha=aT;
      // Sichtkontakt: eine Blicklinie vom Kopf zum Zeichen
      if(Z.blick>0.01&&letzt){const hx=cx+RZ*0.6,hy=yT-2.3*RZ-RZ*1.65,tx=letzt.x-3,ty=yT-19;ctx.strokeStyle=C.ink;ctx.lineWidth=1.3;ctx.setLineDash([2,4]);
        ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(lerp(hx,tx,Z.blick),lerp(hy,ty,Z.blick));ctx.stroke();ctx.setLineDash([])}
      ctx.globalAlpha=1}
    // der Stimmungsspeicher dieses Menschen: ein Kreis um seine Träger. Neben dem Männchen sein Name.
    if(I&&I.kC>0.01){ctx.beginPath();ctx.arc(ix,iy,RI,0,6.2832);ctx.globalAlpha=I.kC;ctx.fillStyle=C.paper;ctx.fill();ctx.globalAlpha=1;
      ctx.beginPath();ctx.arc(ix,iy,RI,-Math.PI/2,-Math.PI/2+6.2832*I.kC);ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();
      if(s.bahnen[bi]){ctx.globalAlpha=I.kC;label(name.toUpperCase(),fx+(bi?1:-1)*(RZ*1.8+7),fy+4,10,C.ink,bi?'left':'right',2);ctx.globalAlpha=1}}
    ctx.beginPath();ctx.arc(fx,fy,RZ,0,6.283);ctx.fillStyle=C.paper;ctx.fill();
    // jede Ladung, die aufsteigt, färbt den Bauch dunkler
    if(L.treffer){ctx.globalAlpha=Math.min(0.88,0.3*L.treffer);ctx.fillStyle=C.minus;ctx.fill();ctx.globalAlpha=1}
    // eine Ladung, die gerade in ihm entsteht
    if(L.hell>0.01){ctx.globalAlpha=0.6*L.hell;ctx.fillStyle=L.hellS<0?C.minus:C.plus;ctx.fill();ctx.globalAlpha=1}
    ctx.strokeStyle=C.ink;ctx.lineWidth=1.5;ctx.stroke();
    figur(fx,fy,RZ,1,(Z.geht||L.laeuft)&&!reduce?Math.sin(time*8):0);
    // nebenbei: das Handy in der Hand, der Blick geht dorthin
    if(L.handy>0.01){const hx=fx-RZ*1.8-2,hy=fy+RZ*0.2-6;ctx.globalAlpha=L.handy*aT;ctx.fillStyle=C.paper;ctx.strokeStyle=C.ink;ctx.lineWidth=1.3;
      rund(hx-3.5,hy-6.5,7,13,1.5);ctx.fill();ctx.stroke();
      ctx.setLineDash([2,3]);ctx.beginPath();ctx.moveTo(fx-RZ*0.55,fy-RZ*1.6);ctx.lineTo(hx+1,hy-8.5);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1}
    // ab der zweiten Ladung: Striche um den Kopf
    if(L.treffer>1){const hx=fx,hy=fy-RZ*1.65,m=L.treffer>2?7:4;ctx.strokeStyle=C.minus;ctx.lineWidth=1.6;ctx.lineCap='round';
      for(let q=0;q<m;q++){const w=-Math.PI*(0.08+0.84*q/(m-1)),r0=RZ*0.85,r1=RZ*(L.treffer>2?1.55:1.25);
        ctx.beginPath();ctx.moveTo(hx+Math.cos(w)*r0,hy+Math.sin(w)*r0);ctx.lineTo(hx+Math.cos(w)*r1,hy+Math.sin(w)*r1);ctx.stroke()}ctx.lineCap='butt'}
    // der Gedanke unter der Zeitlinie
    if(L.ged&&L.ged.a*aT>0.01){ctx.globalAlpha=L.ged.a*aT;ctx.font='italic 14.5px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText('„'+L.ged.text+'“',cx,yT+23);ctx.globalAlpha=1}
    // das Wasser und was darauf liegt, als Ganzes kleiner, wenn die Reihe nicht in die Breite passt.
    // Im Übergang zu den Inseln legen sich die Träger untereinander, einer nach dem anderen.
    // Oben erst hinunter auf die eigene Höhe, dann seitlich an den Platz: so kreuzt keiner den anderen. Unten auf geradem Weg.
    ctx.save();ctx.translate(cx,yR);ctx.scale(z,z);ctx.translate(-cx,-yR);
    const platzY=i=>iy+(i-(n-1)/2)*31;
    const P=L.els.map((e,i)=>{const rx=R[i]===undefined?ix:(e.sx=reduce||e.sx===undefined?R[i]:e.sx+(R[i]-e.sx)*0.16);
      return {x:lerp(rx,ix,ke(i)),y:lerp(R[i]===undefined?platzY(i):yR+stegBob(i+bi*2)+e.d,platzY(i),ky(i))}});
    if(aT>0.01){ctx.strokeStyle=C.minus;ctx.lineWidth=1.5;ctx.globalAlpha=0.8*aT;ctx.beginPath();
      for(let j=0,xa=cx-cx/z,xx=xa;xx<=xa+W/z;xx+=5,j++){let y=yR+20+(reduce?0:Math.sin(xx*0.045+time*1.3+bi*2)*2.2);
        L.els.forEach((e,i)=>{if(!e)return;const dx=(xx-P[i].x)/55;y+=e.d*0.6*Math.exp(-dx*dx)});j?ctx.lineTo(xx,y):ctx.moveTo(xx,y)}
      ctx.stroke();ctx.globalAlpha=1}
    // Verbindungsstücke: in der Reihe ein gerades Stück von Glied zu Glied, untereinander ein Bügel rechts
    ctx.strokeStyle=C.ink;ctx.fillStyle=C.ink;ctx.lineWidth=1.6;ctx.lineCap='round';
    L.links.forEach(l=>{const a=L.els[l.a],c=L.els[l.b];if(!a||!c||l.k<=0.01)return;gliedMass(a);gliedMass(c);const A=P[l.a],B=P[l.b],k2=1-ke(l.b);
      const x0=A.x+a.tot/2+lerp(5,9,k2),x1=lerp(B.x+c.tot/2+5,B.x-c.tot/2-9,k2),xc=lerp(Math.max(A.x+a.tot/2,B.x+c.tot/2)+20,(x0+x1)/2,k2);
      if(l.k<1){ctx.beginPath();ctx.moveTo(x0,A.y);ctx.lineTo(lerp(x0,x1,l.k),lerp(A.y,B.y,l.k));ctx.stroke();ctx.beginPath();ctx.arc(x0,A.y,2.2,0,6.283);ctx.fill();return}
      ctx.beginPath();ctx.moveTo(x0,A.y);ctx.quadraticCurveTo(xc,(A.y+B.y)/2,x1,B.y);ctx.stroke();
      [[x0,A.y],[x1,B.y]].forEach(q=>{ctx.beginPath();ctx.arc(q[0],q[1],2.2,0,6.283);ctx.fill()})});
    ctx.lineCap='butt';
    L.els.forEach((e,i)=>{if(e){gliedMass(e);gliedMalen(e,P[i].x,P[i].y,R[i]===undefined?0:1-ke(i),e.a)}});
    ctx.restore();
    // am linken Rand läuft die Reihe weich aus dem Bild
    if(L.ueber>0){ctx.fillStyle=C.bg;for(let i=0;i<10;i++){ctx.globalAlpha=1-i/10;ctx.fillRect(i*4,yR-24,4,56)}ctx.globalAlpha=1}
    L.pos=L.els.map((e,i)=>({x:cx+(P[i].x-cx)*z,y:P[i].y,w:I?0:(e?e.tot:0)*z}));
    // die Ladung fällt vom Männchen an ihren Platz
    if(L.fall){const k=L.fall.k,tx=cx+(R[L.fall.j]-cx)*z;chargeDot(lerp(fx,tx,ease(k)),lerp(fy,yR,k*k),L.fall.sign,1.1)}
    // der Name des Stegs fliegt in die Tonne
    if(L.wurf){const k=L.wurf.k,u=ease(k),nm=satzVon(s,'name');ctx.globalAlpha=1-ease((k-0.78)/0.22);ctx.font='italic '+lerp(15,7,u)+'px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='center';
      ctx.fillText(nm,lerp(cx,cx+RZ*1.9+12,u),lerp(yR+42,yT-21,u)-Math.sin(Math.PI*k)*26);ctx.globalAlpha=1}
    // verpufft: die Ladung sinkt aus dem Bauch ins Wasser und vergeht dort, ohne Adresse
    if(L.puff){const k=L.puff.k,yW=yR+20,al=1-ease((k-0.5)/0.5);chargeDot(fx,lerp(fy,yW,ease(Math.min(1,k/0.7))),L.puff.sign,1.1,al);
      if(k>0.62){const q=(k-0.62)/0.38;ctx.globalAlpha=0.7*(1-q);ctx.strokeStyle=C.muted;ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(fx,yW,10+26*q,3+5*q,0,0,6.283);ctx.stroke();ctx.globalAlpha=1}}
    // die Ladung eines Trägers steigt zu seinem Männchen auf
    if(L.auf&&L.pos[L.auf.i]){const q=L.pos[L.auf.i],k=L.auf.k;chargeDot(lerp(q.x,fx,k*k),lerp(q.y,fy,ease(k)),L.auf.sign,1.1)}
    // der Name des Stegs, unter dem Wasser
    const nm=satzVon(Z.ue?Z.ue.von:s,'name');
    if(nm&&L.name*aT>0.01){ctx.globalAlpha=L.name*aT;ctx.font='italic 15px '+C.serif;const w=ctx.measureText(nm).width;
      label(T('steg').toUpperCase(),cx-w/2-4,yR+42,9,C.muted,'right',1.4);ctx.globalAlpha=L.name*aT;
      ctx.font='italic 15px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='left';ctx.fillText(nm,cx-w/2+4,yR+42);ctx.globalAlpha=1}});
  if(!I)return;
  // das Meer, vor den Inseln: sie tauchen ein Stück ein
  if(I.kD>0.01){ctx.strokeStyle=C.minus;ctx.lineWidth=1.5;ctx.globalAlpha=0.85;ctx.beginPath();
    for(let xx=0;xx<=W*I.kD;xx+=5){const y=yI+RI*0.8+(reduce?0:Math.sin(xx*0.04+time*1.2)*2.4);xx?ctx.lineTo(xx,y):ctx.moveTo(xx,y)}ctx.stroke();ctx.globalAlpha=1}
  // die Entladung: von Männchen zu Männchen. Danach fällt die Ladung beim Getroffenen in seinen Speicher.
  // der Kanal zwischen den beiden Männchen, davor (auf deiner Seite) das Tor
  const KA=Z.B.passiv,KB=Z.B.aktiv,kx0=KA.mx+RZ*2.2,kx1=KB.mx-RZ*2.2,kyv=x=>lerp(KA.my,KB.my,(x-KA.mx)/(KB.mx-KA.mx));
  if(I.kanal>0.01){const xe=lerp(kx0,kx1,I.kanal);ctx.strokeStyle=C.muted;ctx.lineWidth=1.3;
    [-9,9].forEach(o=>{ctx.beginPath();ctx.moveTo(kx0,kyv(kx0)+o);ctx.lineTo(xe,kyv(xe)+o);ctx.stroke()});
    if(I.zu>0.01){const xt=kx0+5,yt=kyv(xt);ctx.strokeStyle=C.ink;ctx.lineWidth=2.4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(xt,yt-12*I.zu);ctx.lineTo(xt,yt+12*I.zu);ctx.stroke();ctx.lineCap='butt'}}
  const ort=o=>{const L=Z.B[o.b];return o.i===undefined?[L.mx,L.my]:[L.ix,L.iy+(o.i-(L.n-1)/2)*31]};
  I.ab.forEach(d=>{const a=ort(d.von),b=ort(d.an),weit=d.tor?1-(RZ*2.2+15)/Math.abs(b[0]-a[0]):(d.bis||1),k=d.k,p=(d.faellt||d.bogen?ease(k):k)*weit;
    chargeDot(lerp(a[0],b[0],p),lerp(a[1],b[1],d.faellt?k*k:d.bogen?k:p)-Math.sin(Math.PI*k)*d.bogen,d.sign,d.bogen||d.faellt?1.1:0.86)});
  // Plus und Minus heben sich in der Mitte auf
  if(I.blitz>0.01&&I.blitz<1){const xm=(KA.mx+KB.mx)/2,ym=(KA.my+KB.my)/2;ctx.globalAlpha=1-I.blitz;ctx.strokeStyle=C.muted;ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(xm,ym,5+13*I.blitz,0,6.283);ctx.stroke();ctx.globalAlpha=1}
  // der Satz, der dabei fällt: über den beiden
  [I.zitat,I.antwort].forEach(q=>{if(!q||q.a<=0.01)return;
    const zeilen=(q.text.match(/[^.!?]+[.!?]+/g)||[q.text]).map(t=>t.trim()),oben=Math.min(Z.B.passiv.my,Z.B.aktiv.my)-RZ*2.1-9;
    ctx.globalAlpha=q.a;ctx.font='italic 14.5px '+C.serif;ctx.fillStyle=C.ink;ctx.textAlign='center';
    const breit=Math.max(...zeilen.map(t=>ctx.measureText('„'+t+'“').width)),mitte=I.antwort||I.kanal?Z.B[q.von].mx:lerp(cx,Z.B[q.von].mx,0.7),xz=Math.max(breit/2+6,Math.min(W-breit/2-6,mitte));
    zeilen.forEach((t,i)=>ctx.fillText((i?'':'„')+t+(i===zeilen.length-1?'“':''),xz,oben-(zeilen.length-1-i)*17));ctx.globalAlpha=1})}
