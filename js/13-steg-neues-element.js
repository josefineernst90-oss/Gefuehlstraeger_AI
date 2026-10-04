/* Ein neues Element vor dem Steg. Der Gedanke entscheidet, ob es andockt.
   fern → kommt → wartet → denkt → dockt → bindet → dran   oder   denkt → (loest →) treibt → weg */
const NEU={tief:66,kommt:1.8,denkt:2.1,dockt:2.1,bindet:0.5,treibt:2.2,auto:10};
function neuPh(N,ph){N.ph=ph;N.t=0;syncNav()}
function denkenStart(s,g){const N=S.sg&&S.sg.neu;if(!N||!g)return;N.ziel=g;say('');S.ev=[];neuPh(N,N.ph==='weg'?'kommt':'denkt')}
function neuTakt(s,dt,liest){const N=S.sg.neu,st=stOf(s),D=k=>reduce?1:Math.min(1,N.t/k);
  if(N.ph==='fern'){if(!liest)neuPh(N,'kommt');return}
  N.t+=dt;
  if(N.ph==='kommt'){if(D(NEU.kommt)>=1){if(N.ziel)neuPh(N,'denkt');else neuPh(N,'wartet')}}
  else if(N.ph==='wartet'){if(!reduce&&N.t>=NEU.auto){N.auto=true;denkenStart(s,s.gedanken.find(g=>g.an))}}
  else if(N.ph==='denkt'){if(D(NEU.denkt)>=1)neuPh(N,N.ziel.an?'dockt':N.k>0?'loest':'treibt')}
  else if(N.ph==='dockt'){N.k=D(NEU.dockt);if(N.k>=1)neuPh(N,'bindet')}
  else if(N.ph==='bindet'){N.kv=D(NEU.bindet);if(N.kv>=1){if(!reduce)N.el.v+=70;st.aus='an';st.gesehen=true;
    const c=satzVon(s,N.auto?'selbst':'dockt');N.auto=false;N.ziel=null;neuPh(N,'dran');spaeter(1.5,()=>{if(c)say(c);syncNav()})}}
  else if(N.ph==='loest'){N.kv=reduce?0:Math.max(0,1-N.t/0.4);N.k=reduce?0:1-Math.max(0,Math.min(1,(N.t-0.4)/NEU.dockt));if(N.k<=0&&N.kv<=0){N.el.d=0;N.el.v=0;neuPh(N,'treibt')}}
  else if(N.ph==='treibt'){if(D(NEU.treibt)>=1){st.aus='frei';st.gesehen=true;const c=satzVon(s,'frei');N.ziel=null;neuPh(N,'weg');if(c)say(c)}}}
// ein Glied antippen: es taucht ein, die Welle läuft durch den Steg, danach der Satz
function stegTippen(s,i){const e=S.sg&&S.sg.els[i],st=stOf(s);if(!e||s.neu)return;e.v+=reduce?25:75;st.taps++;
  if(!S.ev.length)spaeter(1.7,()=>{const c=satzVon(s,'an');if(c)say(c);syncNav()})}
