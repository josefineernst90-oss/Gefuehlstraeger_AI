/* ---------- Du auf der Zeitlinie, darunter der Stimmungsspeicher ----------
   Der Weg aus dem Ring in dieses Bild und zurück ist ein einziger Ablauf über der Uhr T: vorwärts „hinein“, rückwärts „heraus“. */
const RM=9,mannY=()=>yL-22-2.3*RM;   // Bauch des Männchens; seine Füße stehen auf der Zeitlinie bei yL-22
const EIN={a0:0.3,dA0:0.9,c:1.5,dC:0.6,dA:1.2,dB:1.4};
// a0: die Fäden ziehen sich in die Hüllen · c: die Hüllen gehen einzeln in deinen Bauch · a: du gehst nach oben
// b: der Speicher wächst aus dem Bauch · d: die Zeit erscheint
function einPlan(){const n=S.ein.order.length,a=EIN.c+n*EIN.dC+0.3,b=a+EIN.dA+0.2,d=b+EIN.dB+0.3;return {a,b,d,max:d+1.1}}
function hinein(h){const c=ensureCarrier(h.id,h.label);c.charges=h.charges.map(ch=>({s:ch.s,big:ch.big}));c.x=cx;c.y=cy;c.a=1;h.drin=true}
function heraus(id){const c=carrier(id);if(!c)return;const h=S.h[id]||neueHuelle(id,c.label,'',freierPlatz());
  h.charges=c.charges.map(ch=>({s:ch.s,big:ch.big}));h.a=1;h.drin=false;S.c=S.c.filter(x=>x!==c);
  const p=ringPlatz(h.slot||0,h);h.x=p[0];h.y=p[1]}
// die Ladung ist beim Träger angekommen. Dann, eins nach dem anderen, je nachdem was der Schritt vorsieht:
// die Bindung schlägt zurück (.satz „wucht“) · ein Faden wächst dazu (.satz „faden“) · eine Verbindung entsteht (data-steg, .satz „steg“)
// danach ruht die Bindung wieder, und du gehst weiter
function tuerGelandet(c){const s=SLIDES[cur],st=stOf(s);if(!s.tuer||st.gelandet||c.id!==MOM[s.tuer].addr)return;st.gelandet=true;
  const wucht=satzVon(s,'wucht'),fd=satzVon(s,'faden');
  if(wucht){spaeter(0.8,()=>{S.band={id:c.id,t:0,weg:0,schlag:true,pu:0,dick:1,sign:c.charges.filter(ch=>ch.s<0).length*2>=c.charges.length?-1:1}});
    spaeter(1.5,()=>say(wucht))}
  if(fd){spaeter(wucht?2.8:0.8,()=>{const h=S.h[c.id];st.fadenPlus=true;if(h&&!h.fort){faden(h);if(!S.band)S.band={id:c.id,t:1,weg:0}}});
    spaeter(1.1,()=>say(fd))}
  if(s.steg.length===2){spaeter(0.9,()=>stegOrdnen(s));   // erst rückt der zweite Träger neben den ersten
    spaeter(0.9,()=>{if(carrier(s.steg[0])&&carrier(s.steg[1]))S.steg.push({a:s.steg[0],b:s.steg[1],k:reduce?1:0})});   // dann wächst die Verbindung
    spaeter(1.0,()=>say(satzVon(s,'steg')))}
  spaeter(2.8,()=>{if(S.band)S.band.geht=true});
  spaeter(1.1,()=>{if(S.gang)S.gang.ph='weiter'})}
function stegOrdnen(s){const a=carrier(s.steg[0]),b=carrier(s.steg[1]);if(!a||!b)return;S.c=S.c.filter(x=>x!==b);S.c.splice(S.c.indexOf(a)+1,0,b)}
function stegFertig(s){stegOrdnen(s);const [a,b]=s.steg;if(!carrier(a)||!carrier(b))return;
  if(!S.steg.some(l=>l.a===a&&l.b===b))S.steg.push({a,b,k:1});S.steg.forEach(l=>l.k=1)}
// Vorführen: ein paar Fäden ziehen sich von selbst, danach kommt der Hinweis
const VOR_T0=0.4,VOR_DT=1.5;
function vorStart(s,neu){const st=stOf(s);if(neu){huellenListe(s).forEach(h=>h.threads=[]);st.taps=0;st.vorGesehen=false}
  S.vor={t:reduce?1e3:0,n:0,aktiv:!st.vorGesehen};if(!S.vor.aktiv)say(satzVon(s,'danach'),true);else say('')}
