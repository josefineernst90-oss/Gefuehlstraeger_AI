# Das Drehbuch: Aufbau und alle Attribute

Diese Beschreibung stand bis Version 61 als Kommentar in der HTML-Datei. Sie gilt für die `<section>`-Blöcke in `index.html`.

```text
DREHBUCH

Hier steht alles Sprachliche und die Reihenfolge der Schritte. Der Programmteil darunter spielt es nur ab.

BEWEGUNG
Die Bilder bewegen sich immer, auch wenn das Gerät „weniger Bewegung“ meldet. Nur zum Prüfen: mit ?still an der Adresse (index.html?still)
stehen sie still, jeder Ablauf steht dann sofort am Ende.

EINS NACH DEM ANDEREN
Der Blick folgt der Bewegung. Deshalb passiert in jedem Schritt nur eine Sache zur selben Zeit:
erst erscheint der Text, dann folgt eine Lesepause (je länger der Text, desto länger), dann erst bewegt sich die Bühne,
zuletzt kommt der Satz unter der Bühne. Ein Tipp auf die Bühne oder einen Knopf beendet die Lesepause sofort.
Der Satz zu einer fallenden Ladung (.fall) kommt erst, wenn sie im Speicher angekommen ist: das Auge folgt ihr nach unten.
Folgen mehrere Momente aufeinander, beginnt der nächste erst, wenn die Ladung des vorigen im Speicher angekommen ist.

SCHRITTKETTE
Die Reihenfolge der <section>-Blöcke ist die Schrittkette. „Weiter“ geht zum nächsten Block, „Zurück“ zum vorigen.
Einen Schritt einschieben heißt: einen <section>-Block an der gewünschten Stelle einfügen.
Der Zustand der Bühne (Ladungen, Ladungsträger, Pegel) bleibt von Schritt zu Schritt stehen.
Wird ein Schritt übersprungen, werden seine Ladungen trotzdem gesetzt, damit die folgenden Schritte stimmen.
Das gilt für alles: nicht getippte Knöpfe gelten als einmal getippt, Adressen werden vergeben,
bei einer Wahl gilt die erste Adresse. So steht am Ende immer dasselbe auf der Bühne.

<section>
  id             eindeutiger Name des Schritts
  data-kapitel   Kapitel, zu dem der Schritt gehört (Kapitelleiste und Zähler richten sich danach)
  data-anker     Adresse für Links und QR-Codes, z.B. #ladung
  data-aus       der Schritt ist abgeschaltet: er kommt in der Schrittkette nicht vor, bleibt aber im Drehbuch stehen
  data-start="leer"   die Bühne wird beim Betreten geleert (immer beim ersten Schritt eines Kapitels)
  data-start="vorher" die Bühne steht so, wie das vorige Kapitel sie hinterlässt. Kommt man nicht vom Schritt direkt davor,
                      wird dieser Stand nachgestellt (bei einer Wahl gilt die erste Adresse).
  data-auto      Momente, die beim Betreten von selbst ablaufen (Namen, mit Leerzeichen getrennt)
  data-knoepfe   Momente, die als Knöpfe zum Antippen erscheinen
  data-fertig    wie oft getippt werden muss, bis der Schritt erledigt ist (sonst: jeden Knopf einmal)
  data-folge     Momente, die nacheinander über EINEN Knopf ausgelöst werden; data-knopf ist seine Beschriftung
  data-kette     mit data-folge: ein Tipp spielt die ganze Folge hintereinander ab
  data-knopf     Beschriftung des Knopfs (bei data-folge oder bei einem Schritt mit eigenem Verhalten)
  data-nochmal   zeigt „Nochmal ansehen“
  data-uebergang="dreieck"   das Dreieck klappt in die Zeitlinie, danach läuft der Moment aus data-auto
  data-foto                  die Bühne bleibt festgehalten wie nach „Moment festschreiben“ (Rahmen um den Speicher, Zeit steht)
  data-rahmen="Moment"       der Rahmen des Fotos steht als zwei Platten um den Speicher, davor dieser Name:  Moment |Ladungen|
  data-uebergang="rahmen"    in diesem Schritt wird der Rahmen zu den Platten, der Name erscheint (.satz data-id="an" danach)
  data-uebergang="weiter"    zusammen mit data-foto und data-rahmen: das Foto löst sich nach der Lesepause, die Zeit läuft wieder.
                             Knoten und Platten verschwinden, die Ladungsträger bleiben, die losen Ladungen blinken kurz auf.
  data-uebergang="linie"     die beschriftete Linie der Eröffnung zieht sich zu einem Moment auf der Zeitlinie zusammen.
                             Die Ladung wandert aus dem Männchen hoch auf die Linie, das Männchen wird dabei zum Stimmungsspeicher:
                             sein Bauch wächst, Kopf, Arme und Beine ziehen sich ein. Die Ladung steht danach als Moment aus data-auto auf der Linie.
  data-uebergang="hinaus"    die benannten Ladungsträger wandern einer nach dem anderen aus dem Stimmungsspeicher und stellen sich
                             als Hüllen im Ring um ihn auf. Der Speicher rückt in die Mitte und wird kleiner. Lose Ladungen bleiben drin.
  data-uebergang="figur"     der Speicher in der Mitte wird zum Bauch eines Strichmännchens, „du“ (data-dauer = Sekunden)
  data-dauer     Sekunden für diesen Übergang
  data-mann      du stehst als Männchen auf der Zeitlinie, darunter dein Stimmungsspeicher, groß gezeichnet.
                 Die Zeitlinie läuft über den Momenten durch, ein Moment öffnet sich unter deinen Füßen.
                 Die Ladungsträger liegen im Speicher. Ihre Bindung sieht man nur, wenn sie wirkt: als Strang vom Träger hoch zu dir.
  data-uebergang="hinein"    aus dem Ring der Bindung in dieses Bild, eins nach dem anderen: die Fäden ziehen sich in die Hüllen zurück ·
                             die Hüllen wandern einzeln in deinen Bauch · du gehst nach oben · der Speicher wächst aus deinem Bauch,
                             die Ladungsträger liegen darin · Zeitlinie und Pegel erscheinen. Danach .satz data-id="an".
  data-uebergang="heraus"    derselbe Ablauf rückwärts, zurück in den Ring. Danach .satz data-id="an".
  data-tuer="tuer2"          nach der Lesepause gehst du los, die Zeit läuft unter dir durch, ein Türrahmen kommt auf dich zu.
                             Beim Stoß beginnt dieser Moment, wie beim ersten Mal: Schmerz, Gedanke, die Ladung fällt zum Ladungsträger.
                             Erst wenn sie dort angekommen ist, schlägt die Bindung zurück: der ganze Strang auf einmal, seine Ladung
                             schießt zu dir hoch und trifft dich. Danach .satz data-id="wucht". Dann wächst ein Faden dazu,
                             .satz data-id="faden", die Bindung ruht wieder, du gehst weiter.
  data-uebergang="steg"      die verbundenen Ladungsträger lösen sich aus dem Speicher, eins nach dem anderen: alles andere tritt zurück ·
                             sie legen sich nebeneinander, die Bügel werden zu Verbindungsstücken · jedes bekommt einen Rahmen (Schwimmelement) ·
                             darunter erscheint das Wasser · darüber der Name des Stegs (.satz data-id="name"). Danach .satz data-id="an".
  data-kommt="mensch"        mit data-tuer: statt des Türrahmens kommt ein anderes Männchen auf dich zu (der Kollege).
  data-kommt="film"          mit data-tuer: es kommt ein Bild im Rahmen, darin ein kleines Männchen (der Film).
  data-steg="tuer kollege"   mit data-tuer: ist die Ladung angekommen, rückt der zweite Ladungsträger im Speicher neben den ersten,
                             dann entsteht zwischen beiden eine Verbindung. Danach .satz data-id="steg".
  data-ich       neben dem Foto erscheint nach der Lesepause das Männchen, sein Bauch ist gefärbt wie der Speicher.
                 Danach kommt .satz data-id="an"; {stimmung} wird durch den aktuellen Stand ersetzt.

In einem <section>:
  .kurz          Text für Leute, die das Buch kennen
  .lang          ausführlicher Text ohne Vorkenntnisse (kann fehlen)
  .hinweis       Bedienhinweis unter der Bühne (nicht aus dem Buch)
  .begriff       Eintrag aus dem Begriffsindex
  .satz          einzelner Satz unter der Bühne, den der Ablauf aufruft (data-id)
  .moment        ein Moment auf der Zeitlinie, siehe unten
  .wahl          eine wählbare Adresse, siehe unten
  .adresse       ein Knopf, der Ladungen im Speicher nachträglich eine Adresse gibt, siehe unten

<div class="moment">
  data-id        Name des Moments
  data-ladung    +   −   ++ (große Ladung)   0 (keine Ladung)
  data-tempo     Sekunden pro Zeile
  data-fall      Sekunden, die die Ladung in den Speicher fällt
  data-adresse   Ladungsträger, zu dem die Ladung gehört; data-name ist seine Bezeichnung im Speicher
  data-ordnet    ordnet die zuletzt lose gefallene Ladung diesem Ladungsträger zu (data-name = Bezeichnung)
  data-knopf     Beschriftung, wenn der Moment als Knopf erscheint
  data-wartet    der Moment bleibt nach der letzten Zeile stehen, bis eine .wahl getroffen ist
  data-bleibt    der Moment bleibt geschlossen um seine Ladung stehen, auch über den Schritt hinaus: |+|
  data-oeffnet   öffnet den stehen gebliebenen Moment wieder und spielt in ihm seine Zeilen ab (statt einen neuen Moment zu beginnen)
  <p>            eine Zeile zwischen den Platten, in der Reihenfolge des Ablaufs
    data-wer="fühlen"   die Ladung sitzt dabei rechts
    data-wer="denken"   die Ladung sitzt dabei links
    data-wer="…"        jedes andere Wort (z.B. Geschichte): die Ladung sitzt dabei oben in der Mitte. Wie auf der Linie
                        der Eröffnung: Denken links, Metaphorik in der Mitte, Gefühl rechts.
    data-ladung="+"     ab dieser Zeile hat die Ladung dieses Vorzeichen (sonst gilt das des Moments, das am Ende bleibt)
    data-ruft="…"       ruft diesen Ladungsträger wieder auf, er schickt ein Echo
    data-satz="…"       Satz unter der Bühne, solange die Zeile steht
  <p class="zu">        Satz, wenn sich die Platten um die Ladung schließen
  <p class="fall">      Satz, wenn die Ladung fällt

<p class="adresse">      lose Ladungen im Speicher bekommen im Nachhinein eine Adresse
  data-von       aus welchen Momenten die Ladungen stammen (Namen der Momente, mit Leerzeichen getrennt)
  data-id        Name des Ladungsträgers
  data-name      seine Bezeichnung im Speicher (und die Beschriftung des Knopfs)
  Inhalt         Satz unter der Bühne

<p class="wahl">
  data-id        Name des Ladungsträgers
  data-knopf     Beschriftung des Knopfs
  data-name      Bezeichnung des Ladungsträgers im Speicher
  data-zeile     die Denken-Zeile, die nach der Wahl im Moment erscheint
  Inhalt         Satz unter der Bühne, wenn die Ladung bei der Adresse ankommt

BÜHNE „BINDUNG“ (data-szene="bindung" am <section>): in der Mitte „du“ als Strichmännchen, im Ring darum die Hüllen,
dazwischen die Fäden. Sie gehen vom Bauch aus, dem Stimmungsspeicher.
Antippen geht über die Knöpfe oder direkt auf der Hülle.
  data-huellen="alle"   am <section>: alle Hüllen stehen auf der Bühne, die aus dem Speicher herausgewandert sind
                        (ihre data-id ist der Name des Ladungsträgers, z.B. spiegel, tuer, kollege)
  data-frei             am <section>: jede Hülle lässt sich antippen, auch ohne eigenen Knopf. Der Satz dazu ist .satz data-id="faden",
                        bei einer rein negativ geladenen Hülle .satz data-id="faden-minus".
  data-verblassen="1.3" am <section>: die Zeit vergeht. Alle so viele Sekunden passiert genau eine Sache, in dieser Reihenfolge:
                        eine Hülle ohne Faden verblasst und verschwindet · sonst verliert reihum eine Hülle einen Faden ·
                        am Ende wird fest, was vier oder mehr Fäden hat: die Fäden schließen sich zu einem Strang, daneben steht „fest“.
                        Eine feste Hülle verliert keinen Faden mehr. Antippen spinnt einen neuen Faden und schützt die Hülle kurz.
                        Sätze: .satz data-id="zuerst" (vor allem anderen, danach erst vergeht die Zeit), "weg" (die erste Hülle ist verschwunden),
                        "fest" (eine Hülle wird fest), "fest-tipp" (durch Antippen fest geworden), "faden" (beim Antippen).
  data-zusehen          am <section>: Antippen hat in diesem Schritt keine Wirkung.
  data-merken           am <section>: die Bühne merkt sich, wie sie beim Betreten stand. Kommt man zurück oder tippt „Nochmal ansehen“,
                        steht sie wieder so, und der Schritt läuft von vorn.
  data-ueben="akkord"   am <section>: der Knopf (data-knopf) übt an dieser Hülle, ein Tipp ist ein Tag. Jeder Tag spinnt einen Faden,
                        mit ihm kommt eine Ladung in die Hülle. Die Tage stehen als <p class="tag"> im Block.
                        Gibt es .satz data-id="fest", wird die Hülle nach dem letzten Tag fest.
  data-wieder="akkord"  am <section>: diese Hülle steht nach der Lesepause wieder da, so wie sie zuletzt in einem Schritt davor stand.
  data-zeigen="akkord"  am <section>: nach der Lesepause leuchten die Platten dieser Hülle kurz auf, danach kommt .satz data-id="an".
  data-vorfuehren="2"   am <section>: nach der Lesepause werden so viele Fäden von selbst gezogen (je einer zu den ersten Hüllen),
                        danach erscheint .satz data-id="danach" als Hinweis. Unter der Bühne stehen „Zurücksetzen“ und „Nochmal ansehen“.

  data-huellen="eigene" am <section>: im Ring stehen nur die Hüllen dieses Blocks. Was aus dem Kapitel Bindung im Ring stand, liegt so lange beiseite
                        und ist nach dem Schritt wieder da. Der Schritt beginnt jedes Mal von vorn.
  VON SELBST (Hüllen mit data-faeden): nach der Lesepause kommen sie eine nach der anderen, in der Reihenfolge im Block. Erst die Hülle, dann ihre Fäden,
                        alle auf einmal. Ab vier Fäden wird sie gleich fest. Nach der letzten Hülle, die so fest wird: .satz data-id="alarm", dann Lesezeit.
                        Stehen alle: .satz data-id="zuerst", danach .satz data-id="tippen" als Hinweis. Erst dann vergeht die Zeit (data-verblassen),
                        und erst dann wirkt das Antippen. Sätze dabei: "weg", "faden", "fest-tipp" wie oben · "faden-minus" beim Antippen einer rein negativen Hülle ·
                        "leer", wenn von den Hüllen mit weniger als vier Fäden keine geblieben ist. Ohne Bewegung stehen alle Hüllen mit ihren Fäden da.

<div class="huelle">     eine Hülle auf der Bühne, von links nach rechts in der Reihenfolge im Block
  data-id        Name der Hülle. Dieselbe data-id in einem späteren Schritt ist dieselbe Hülle, mit ihren Fäden.
  data-name      Beschriftung (fehlt sie, ist die Hülle leer)
  data-ladung    ihre Ladung in den Klammern: +   −   oder mehrere, z.B. "+ + −"
  data-fluechtig die Hülle liegt im Zwischenspeicher: gestrichelte Platten, daneben steht „Zwischenspeicher“.
  data-faeden    so viele Fäden zieht die Hülle von selbst, sobald sie erschienen ist (siehe VON SELBST)
  data-platz     ihr Platz im Ring, statt der Reihenfolge im Block: 0 oben links · 1 oben rechts · 2 unten links · 3 unten rechts · 4 links · 5 rechts ·
                 6 links oben · 7 rechts oben · 8 links unten · 9 rechts unten
  Eine Hülle, die es noch nicht gibt, erscheint nach der Lesepause. Danach kommt .satz data-id="an".

<p class="tag">          ein Tag Üben (bei data-ueben), in der Reihenfolge im Block
  data-nr        welcher Tag, steht kurz neben dem neuen Faden
  data-ladung    die Ladung, die an diesem Tag dazukommt: +  oder  −
  Inhalt         Satz unter der Bühne (fehlt er, steht dort wieder der Hinweis)

<p class="beispiel">     ein Knopf, der einen fertigen Ladungsträger auf die Bühne stellt: erst die Hülle, dann ihre Fäden, dann der Satz
  data-id        Name der Hülle
  data-name      Beschriftung (und die Beschriftung des Knopfs)
  data-ladung    ihre Ladung in den Klammern, z.B. "+ − +"
  data-faeden    wie viele Fäden sie hat. Ab vier ist sie fest, ihre Fäden schließen sich zum Strang.
  Inhalt         Satz unter der Bühne

<p class="schrift">      ein Knopf, der eine Hülle beschriftet
  data-huelle    welche Hülle
  data-knopf     Beschriftung des Knopfs
  data-name      neue Beschriftung der Hülle
  data-ladung    neue Ladung der Hülle
  Inhalt         Satz unter der Bühne

<p class="faden">        ein Knopf, der Fäden zwischen „du“ und einer Hülle spinnt
  data-huelle    welche Hülle
  data-knopf     Beschriftung des Knopfs
  data-sinne     ein Faden je Wort, alle auf einmal, z.B. "Gedanke Geruch Geräusch Berührung"
  Inhalt         Satz unter der Bühne

Erledigt ist so ein Schritt, wenn jeder Knopf einmal getippt wurde, oder nach data-fertig Tipps.

BÜHNE „STEG“ (data-szene="steg" am <section>): ein Schwimmsteg auf dem Wasser. Seine Glieder stehen als <p class="glied"> im Block
(data-id, data-name, data-ladung), darüber der Name aus .satz data-id="name". Tippt man ein Glied an (auch über die Knöpfe),
taucht es ein, und die Welle läuft durch den ganzen Steg. Danach .satz data-id="an".
EIN NEUES ELEMENT (<p class="glied" data-neu>): nach der Lesepause treibt es von rechts heran und bleibt vor dem Steg liegen.
Darunter stehen Gedanken als Knöpfe (<p class="gedanke" data-id data-wirkt>):
  data-wirkt="andocken"   der Gedanke erscheint unter dem Element · der Steg macht Platz · das Element rückt darunter und steigt in die Reihe ·
                          das Verbindungsstück wächst ·
                          die Welle läuft durch alle. Danach .satz data-id="dockt".
  data-wirkt="vorbei"     der Gedanke erscheint · das Element treibt nach links aus dem Bild (hing es schon am Steg, löst es sich zuerst).
                          Danach .satz data-id="frei".
Tippt man nichts an, kommt der Gedanke mit data-wirkt="andocken" nach einer Weile von selbst. Danach .satz data-id="selbst".
Beide Gedanken lassen sich nacheinander ausprobieren. Erledigt ist der Schritt nach dem ersten Ausgang.

BÜHNE „ZWEI“ (data-szene="zwei" am <section>): derselbe Tag für zwei Menschen, übereinander. Oben „passiv“, unten „aktiv“.
Jede Bahn: ein Männchen auf seiner Zeitlinie, darunter das Wasser, auf dem seine Ladungsträger als Schwimmelemente liegen.
Die Ereignisse stehen als <div class="ereignis"> im Block (data-id, data-art: tuer | mensch | bus, data-name, data-kommt, data-ladung),
darin je Bahn ein Gedanke (<p data-bahn="passiv|aktiv">; data-verbindet: dieser Gedanke hängt den Träger an den vorigen).
Ablauf je Ereignis, eins nach dem anderen: das Zeichen kommt auf beiden Zeitlinien · oben erscheint der Gedanke · die Ladung fällt,
der Träger erscheint · mit data-verbindet wächst das Verbindungsstück (beim ersten erscheint der Name aus .satz data-id="name") ·
dann dasselbe unten. Sind beide Gedanken gleich, läuft es in beiden Bahnen zugleich.
Am Ende .satz data-id="tippen" als Hinweis: ein Element antippen stößt es in beiden Bahnen an. Danach .satz data-id="welle".
data-stand="s3" am <section>: die Bahnen beginnen so, wie der Schritt s3 endet (Zeichen, Gedanken, Träger, Verbindungsstücke, Name).
<div class="ereignis" data-sicht data-ruft="tuer">: nur Sichtkontakt. Das Zeichen bleibt auf Abstand stehen, eine Blicklinie wächst hin.
Dann je Bahn, erst oben, dann unten: der gerufene Träger taucht ein · seine Ladung steigt zum Männchen auf, und mit ihr die Ladung
jedes Trägers, der an ihm hängt, einer nach dem anderen · das Männchen färbt sich mit jeder Ladung dunkler und zuckt · der Gedanke erscheint.
Am Ende .satz data-id="an".
data-oben="du" data-unten="Kollege" am <section>: die Namen der beiden Bahnen (sonst „passiv“ und „aktiv“). Gedanken dann mit data-bahn="oben|unten".
Hat ein Ereignis nur für eine Bahn einen Gedanken, kommt sein Zeichen nur auf dieser Zeitlinie.
data-bleibt am Ereignis: ist der Träger da, steigt seine Ladung gleich wieder zum Männchen auf. Es bleibt geladen.
data-geht am Ereignis: der Weg selbst ist das Ereignis. Das Zeichen kommt, dann erscheinen die Gedanken (oben, dann unten), dann gehen beide
weiter und das Zeichen bleibt zurück. Danach entsteht die Ladung im Bauch, erst oben, dann unten, und fällt als Träger aufs Wasser.
data-innen am Ereignis: wie data-geht, nur ohne Weitergehen. Jede Bahn läuft für sich zu Ende, erst oben, dann unten: Gedanke, Ladung im Bauch, Träger.
Am Gedanken (<p data-bahn>): data-verpufft = die Ladung sinkt ins Wasser und vergeht, ohne Träger · data-handy = das Männchen hat ein Handy in der Hand ·
data-name und data-ladung = Träger und Vorzeichen dieser Bahn (sonst die des Ereignisses) · data-sortiert = vor der Ladung lösen sich die Verbindungsstücke
des Stegs, eins nach dem anderen, dann fliegt sein Name (.satz data-id="name") in die Tonne.
data-art am Ereignis kennt dafür auch: tonne (eine Tonne mit Deckel) und wort (nur die Beschriftung über einem Punkt auf der Zeitlinie).
data-satz am Ereignis (mit data-geht oder data-innen): der Satz zu diesem Ereignis. Er steht unter der Bühne, sobald es zu Ende ist, mit Lesezeit,
und geht, bevor das nächste Ereignis von selbst kommt. Nach dem letzten Ereignis steht wie immer .satz data-id="an".
Die Reihe auf dem Wasser wird nie kleiner als 0,85. Passt sie dann nicht in die Breite, rückt sie nach links, und das Älteste läuft am linken Rand aus dem Bild.
data-knopf am Ereignis: es läuft nicht von selbst, sondern erscheint als Knopf, sobald der Schritt fertig ist. Jeder Tipp spielt es einmal,
die Träger sammeln sich auf dem Wasser. Danach .satz data-id="mehr", nach dem letzten .satz data-id="alle".
<p class="glied"> im Block (bei data-szene="zwei"): in beiden Bahnen liegt von Anfang an derselbe Steg, verbunden, mit dem Namen aus .satz data-id="name".

data-uebergang="zurueck" (mit data-szene="zwei"): der Tag läuft zurück. Der Schritt beginnt mit den zwei Bahnen, so wie der Schritt davor sie verlässt
(nur wenn man direkt von dort kommt und er auch die Bühne „zwei“ hat). Eins nach dem anderen: die Gedanken gehen · die Blicklinie zieht sich zurück ·
die Zeitlinien laufen rückwärts, das Zeichen wandert nach rechts hinaus · was aufgestiegen war, verlässt den Bauch · je Träger, der letzte zuerst:
sein Verbindungsstück löst sich (mit dem letzten verschwindet der Name des Stegs), dann steigt er als Ladung zum Männchen zurück · die Zeit steht ·
oben wechselt der Name der Bahn · unten geht das Männchen nach links hinaus, von rechts kommt das neue, dann erscheint sein Name.
Erst danach kommen der Text des Schritts, die Lesepause und der Ablauf.

data-uebergang="inseln" (mit data-szene="zwei"): aus den zwei Bahnen werden zwei Menschen nebeneinander, einer nach dem anderen Zug:
alles, was zum Tag gehört, tritt zurück (Zeitlinien, Zeichen, Gedanken, Wasser) · der obere Mensch rückt nach links ·
seine Träger legen sich einer nach dem anderen unter ihn, die Verbindungsstücke werden wieder zu Bügeln ·
der untere Mensch kommt herauf nach rechts · seine Träger folgen ihm ·
um die Träger wächst je ein Kreis, der Stimmungsspeicher · darunter erscheint das Meer, jede Insel liegt so tief, wie ihr Mensch geladen ist ·
neben jedem Männchen steht sein Name. Dann je <p class="spruch" data-von data-an data-id data-name data-ladung>: der Satz erscheint über den beiden ·
eine Ladung fliegt vom einen Männchen (es wird heller) zum anderen Männchen (es wird dunkler und zuckt) ·
von dort fällt sie in dessen Speicher, an den Platz eines neuen Trägers · der Träger erscheint. Danach .satz data-id="an".

data-uebergang="kanal" (mit data-szene="zwei" und data-stand): die zwei Inseln stehen schon da, so wie vor dem Satz.
Zwischen den beiden Männchen wächst der Kanal, dann erscheint der Satz aus <p class="spruch">. Danach .satz data-id="tippen" als Hinweis.
Je <p class="weg" data-id="rein|raus|dicht" data-knopf data-sagt> ein Knopf. Jeder Tipp beginnt wieder vor dem Satz:
  rein    die Ladung läuft durch den Kanal zum anderen Männchen, trifft es und fällt in seinen Speicher (neuer Träger)
  raus    die Ladung läuft bis zur Mitte · die Antwort (data-sagt) erscheint · ein Plus läuft ihr entgegen · beide heben sich auf
  dicht   die Antwort erscheint · der Kanal schließt sich vor dem Männchen · die Ladung läuft bis davor und wieder zurück
Der Text des .weg steht danach unter der Bühne. Sind alle gesehen, kommt .satz data-id="alle" dazu. Erledigt nach dem ersten.

BÜHNE „ARBEIT“ (data-szene="arbeit" am <section>): erst viele Inseln, dann sammelt die Zeit.
TEIL 1, mit <p class="insel" data-id data-name data-winkel data-geladen data-schickt>: das Bild beginnt mit den zwei großen Inseln
(du und die Insel mit data-da) und zoomt heraus: du in der Mitte, die anderen im Kreis (data-winkel in Grad, 0 = rechts, -90 = oben).
Die übrigen Inseln erscheinen eine nach der anderen · zu jeder wächst ein Kanal · von jeder Insel mit data-schickt läuft eine Ladung
zu dir (du wirst dunkler), fällt in die Reihe unten und wird dort ein Träger, der an den vorigen andockt.
Die Reihe beginnt mit den <p class="glied">, ihr Name steht in .satz data-id="name". Danach .satz data-id="an".
TEIL 2, mit data-stand und <p class="stufe" data-teil data-name data-ladung>: die Inseln treten zurück, dann rückt der Steg in die Mitte.
Je Stufe: der ganze Steg schrumpft auf den Platz eines einzigen Elements und wird zu einem Träger mit dem Namen data-teil ·
zwei weitere docken an · der neue Name des Stegs (data-name) erscheint. Mit data-ende bleibt ein einziger Träger. Danach .satz data-id="an".

BÜHNE „GROB“ (data-szene="grob" am <section>): dein Stimmungsspeicher mit Pegel, darin nur noch grobe Träger.
Die Träger stehen als <p class="grob" data-id data-name data-ladung> im Block. Der mit data-da liegt schon als Schwimmelement in der Mitte
(so endet die Bühne „arbeit“): das Wasser tritt zurück · um ihn wächst der Speicher, darauf du · er rückt an seinen Platz · der Pegel erscheint.
Jeder weitere Träger: ein kleiner Steg erscheint an seinem Platz, schrumpft und wird zu dem einen Wort · der Pegel sinkt.
Dann <p class="frage">: die Frage erscheint neben dir · aus jedem Träger steigt eine Ladung zu dir auf · <p class="antwort"> erscheint. Danach .satz data-id="an".
data-wechsel="arbeit" data-knopf="neuer Job" (mit data-stand): ein Knopf. Der genannte Träger geht, ein leerer kommt, der Pegel steigt.
Dann kommt von rechts ein Plus in den neuen Träger, der Pegel steigt noch ein Stück. Danach .satz data-id="an". Der Knopf lässt sich wiederholen.
data-wurzel="arbeit" (mit data-stand) und <div class="ebene" data-frage data-satz>: die Adresse Stufe um Stufe hinunter.
Ein Knopf trägt die Frage der nächsten Ebene. Beim ersten Tipp tritt der Speicher zurück, der Träger data-wurzel rückt nach oben.
Je Ebene: unter dem Träger, bei dem man gerade ist, wachsen Linien zu seinen Teilen (<p data-name data-ladung>, der Weg geht bei data-weiter weiter).
Mit data-dimmt treten danach die Teile zurück, bei denen es nicht weitergeht. Eine Ebene ohne Teile lässt nur die anderen zurücktreten.
Nach jedem Tipp steht data-satz unter der Bühne, nach dem letzten .satz data-id="an". Der letzte Träger bekommt einen Rahmen.
<p class="tiefer" data-name data-ladung data-denkt> (mit data-stand auf den Schritt mit den Ebenen): unter dem letzten Träger wächst eine
weitere Stufe, darunter erscheint der Gedanke data-denkt. <p class="daneben" data-name data-ladung>: ein Träger außerhalb des Baums,
eine Linie verbindet ihn mit der neuen Stufe.
Je <p class="eingriff" data-id="oben|unten" data-knopf> ein Knopf. Jeder Tipp beginnt wieder beim Stand davor:
  oben    das Minus am gerahmten Träger verschwindet, dann je eins bei jedem Träger auf dem Weg hinauf bis zur Wurzel
  unten   an der tiefsten Stufe wird dreimal angesetzt, dann wird ihr Minus zum Plus · danach verschwindet je ein Minus
          auf dem ganzen Weg hinauf und beim Träger daneben
Der Text des .eingriff steht danach unter der Bühne. Sind beide gesehen, kommt .satz data-id="alle" dazu.
Je <p class="nimmt" data-id="an|ab" data-knopf> ein Gedanke als Knopf: wie man den gerahmten Satz nimmt. Jeder Tipp beginnt wieder beim Stand davor.
Der Gedanke erscheint unter der tiefsten Stufe, dann:
  an   die Ladung des gerahmten Trägers läuft die Linie hinunter in die tiefste Stufe und bleibt dort
  ab   zwischen beiden schließt sich ein Tor (.satz data-id="tor" steht daneben) · die Ladung läuft bis davor, prallt ab und
       wandert den Baum hinauf bis zur Wurzel · die Stufen darunter treten zurück · neben der Wurzel erscheint .satz data-id="oben"
Der Text des .nimmt steht danach unter der Bühne.
<p class="genau" data-von="arbeit" data-name data-ladung> (mit data-stand auf den Speicher mit den groben Trägern): die alte Antwort tritt zurück ·
unter dem Träger data-von erscheint eine neue Zeile, die genaue Adresse · eine Ladung wandert vom groben Träger hinüber · sie bekommt einen Rahmen ·
die Frage kommt noch einmal · nur aus der genauen Adresse steigt eine Ladung zu dir auf, die anderen Träger treten zurück ·
die neue Antwort (<p class="antwort">) erscheint. Danach .satz data-id="an". Der Pegel bleibt, wo er war.

BÜHNE „STROM“ (data-szene="strom" am <section>): du stehst an der Zeitlinie, und etwas zieht an dir vorbei.
Was vorbeizieht, steht als <p class="ding" data-art="auto|mensch" data-name data-passt> im Block und kommt in dieser Reihenfolge, immer wieder.
Oben zwei Zähler: data-zaehlt (wie viele mit data-passt vorbeigekommen sind) und data-gesehen (wie viele davon bemerkt wurden).
Ein Knopf (data-knopf) richtet die Aufmerksamkeit aus. Davor zählt nur der erste Zähler. Danach leuchtet auf, was passt, eine Blicklinie
geht hin, und beide Zähler laufen gleich. Was nicht passt, wird blasser.
Bei data-art="mensch" erscheint sein Satz (der Text des .ding) unter der Zeitlinie, solange er vorbeigeht. Ist die Aufmerksamkeit ausgerichtet,
fällt aus jedem passenden Satz ein Minus in den Träger data-traeger unten. Davor kommt nur an, was ein Satz von sich aus trägt (data-ladung="+").
.satz data-id="an" erscheint, sobald zwei bemerkt wurden. .satz data-id="rest", sobald danach etwas vorbeikommt, das nicht passt.
DIE ZEICHEN DES TAGES: hat ein .ding data-art="tuer|bus|tonne|wort" (ein .ding data-art="mensch" darf dabei sein), ziehen statt Autos die Zeichen vorbei,
die auch auf den Zeitlinien der Bühne „zwei“ stehen, jedes mit data-name als Beschriftung. Sie stehen schon auf der Zeitlinie, wenn der Schritt beginnt.
Was passt (data-passt), trägt einen gelben Punkt. data-ladung="−": seine Ladung fliegt von selbst zu dir, dein Bauch färbt sich kurz. data-ladung="+" mit data-passt:
sein Plus kommt erst bei dir an, wenn die Aufmerksamkeit ausgerichtet ist. Nichts wird blasser. Mit data-rest an einem .ding erscheint .satz data-id="rest" erst,
wenn dieses Zeichen vorbeikommt.
data-uebergang="ring" am <section>: der Schritt beginnt mit dem Ring der Bindung, so wie der Schritt davor ihn verlässt (nur wenn man direkt von dort kommt).
Eins nach dem anderen: Hüllen und Fäden treten zurück, es bleiben du und .satz data-id="vorher" unter der Bühne · unter dir erscheint .satz data-id="vorbei" ·
der Satz wird flach und zu einem Stück Zeitlinie unter deinen Füßen · die Zeitlinie wächst über die ganze Breite · du gehst mit ihr an deinen Platz ·
Zähler und Zeichen erscheinen. Erst danach kommen der Text des Schritts, die Lesepause und der Hinweis. Der Knopf ist so lange gesperrt.

BÜHNE „FILM“ (data-szene="film" am <section>): links oben du, darunter dein gerahmter Satz (.satz data-id="satz"). Ablauf, eins nach dem anderen:
rechts oben erscheint ein Bild im Rahmen, der Film · deine Blicklinie geht hin · unter dem Rahmen erscheint der Satz im Film (.satz data-id="film") ·
im Film bekommt eine Figur von der anderen ein Minus · neben dir erscheint die erste .blase · die Figur im Film lacht, ihr Minus wird zum Plus ·
die zweite .blase erscheint · ein Plus läuft von der Figur im Film zu dir, von Männchen zu Männchen · du wirst hell, die dritte .blase erscheint.
Dein Satz behält seine Ladung. Danach .satz data-id="an".

BÜHNE „SICHT“ (data-szene="sicht" am <section>): von oben auf das Wasser. Links deine Insel, in der Mitte die des Kollegen (.satz data-id="kollege"),
zwischen euch der Kanal. Hinter dem Kollegen liegt die Insel des Chefs (.satz data-id="chef") mit ihrem Kanal zum Kollegen. Ablauf, eins nach dem anderen:
über dem Kollegen erscheint sein Satz (.satz data-id="satz") · ein Minus läuft durch den Kanal zu dir, von Männchen zu Männchen · zwei gestrichelte Blicklinien
gehen von dir am Kollegen vorbei · dahinter liegt ein Schatten (.satz data-id="verdeckt"): was von deiner Insel aus nicht zu sehen ist · die erste .blase unter dir.
Ein Tipp auf deine Insel oder auf den Knopf (data-knopf): deine Insel treibt ein Stück um die Insel des Kollegen, der Schatten dreht sich mit
und gibt den Chef und seinen Kanal frei, darin zwei Minus. Dann .satz data-id="druck" beim Chef, die zweite .blase unter dir, zuletzt .satz data-id="an".
Mit data-rueck am <section>: derselbe Blick andersherum. Der Schritt beginnt, wie der Schritt davor endet. Dein Blick und dein Schatten gehen, die Inseln
treiben in eine neue Lage (der Kollege oben links, du in der Mitte), dann gehen die Blicklinien vom Kollegen an dir vorbei, und der Schatten liegt hinter dir.
Ein Tipp auf deine Insel oder den Knopf hebt den Schatten: dahinter liegt das erste <p class="glied">. Das Minus aus deinem Bauch fällt daneben und wird
zum zweiten .glied, die beiden verbinden sich, darunter .satz data-id="name". Dann die zweite .blase links neben dir, zuletzt .satz data-id="an".
Mit data-reihe am <section>: die ganze Kette. Der Schritt beginnt, wie der Schritt mit data-rueck endet. Die Inseln treiben in eine Reihe
(Chef, Kollege, du), dein Steg liegt unter dir. Dieselbe Sekunde noch einmal: der Kollege ist wieder geladen, sein Träger ist noch nicht an deinem Steg.
Links erscheint die nächste Insel (.satz data-id="partner") mit ihrem Kanal zu dir. Dann je <p class="weg" data-id="rein|raus|dicht" data-knopf data-sagt> ein Knopf.
rein: das Minus läuft vom Kollegen zu dir, dockt an deinem Steg an, läuft weiter zur nächsten Insel. Von dort gehen Blicklinien an dir vorbei, der Schatten
verdeckt den Kollegen und den Chef. raus: du antwortest (data-sagt), dein Plus läuft seinem Minus entgegen, beide heben sich auf. dicht: ein Tor an deinem
Ende des Kanals, das Minus prallt ab. Jeder Tipp beginnt wieder beim Stand davor. Der Text des .weg steht danach unter der Bühne, nach allen dreien .satz data-id="alle".
Mit data-aussen am <section>: der Rückblick. Die Reihe Chef, Kollege, du steht wie in der Kette, ohne die nächste Insel. Je <p class="impuls"
data-art="tuer|mensch|bus|film" data-name data-ladung> kommt etwas von außen zu dir, eins nach dem anderen: das Zeichen erscheint (Dinge liegen auf dem
Wasser, bei data-art="mensch" erscheint der Text des .impuls über dem Kollegen) · seine Ladung läuft zu dir · dein Bauch färbt sich, der Weg bleibt
als gepunktete Linie mit Spitze stehen. Am Ende tritt alles außer dir zurück, dann .satz data-id="an". Kein Knopf.

BÜHNE „SPITZE“ (data-szene="spitze" am <section>): die Linie Denken, Metaphorik, Gefühl liegt flach, du stehst in der Mitte darauf. Ablauf, eins nach dem anderen:
die Linie klappt wieder zum Dreieck der Karte auf, du fährst mit der Metaphorik nach oben · links neben dir erscheint ein gelbes Auto (.satz data-id="autos" ist seine Beschriftung) ·
rechts neben dir der Film im Rahmen · die linke Seite des Dreiecks färbt sich von dir bis zur Ecke Denken, dort erscheint die .blase (der Gedanke) ·
die rechte Seite färbt sich bis zur Ecke Gefühl, dort erscheint ein Minus. Danach .satz data-id="an".

BÜHNE „SCHLOSS“ (data-szene="schloss" am <section>): links oben du mit dem Schlüsselbund, rechts oben dein Satz (.satz data-id="satz") als Schloss.
Darunter je <p class="schluessel"> ein Schlüssel mit seiner Deutung (der Text). Antippen probiert ihn im Schloss:
  data-art="zu"      passt nicht rein: er stößt an und kommt zurück
  data-art="klemmt"  geht mit Gewalt rein, dreht sich nicht, das Schloss rüttelt, du wirst dunkler
  data-art="passt"   geht rein, dreht sich, der Bügel springt auf, du wirst hell
  data-wort          das Ergebnis, das danach unter der Deutung steht · data-fuehlt: das Wort unter dir · data-bart: Zahnhöhen, mit Komma getrennt
Ablauf am Anfang, eins nach dem anderen: der Satz bekommt Bügel und Schlüsselloch · der Bund erscheint in deiner Hand · die Schlüssel legen sich in die Reihe.
.satz data-id="tippen" ist der Hinweis, .satz data-id="klemmt" und .satz data-id="passt" stehen nach dem jeweiligen Versuch unter der Bühne.
Erledigt ist der Schritt, sobald das Schloss einmal offen war. Danach lassen sich die anderen Schlüssel weiter probieren.

BÜHNE „DREHEN“ (data-szene="drehen" am <section>): beginnt mit dem offenen Schloss aus dem Schritt davor (.satz data-id="satz"). Ablauf, eins nach dem anderen:
Bügel, Schlüssel und Bund verschwinden, das Schloss ist wieder ein gerahmter Ladungsträger und wird blass · von rechts kommt eine Aufgabe (.satz data-id="aufgabe") ·
ein Faden wächst nach unten, daran hängt ihr Ladungsträger: die erste <p class="seite" data-name data-ladung> · darunter ihr Text als Gedanke · du wirst dunkel.
Ein Tipp auf den Träger oder auf den Knopf (data-knopf) dreht ihn um seine Achse, wie vorher den Schlüssel: die zweite .seite erscheint,
der Gedanke wechselt, du wirst hell. Noch ein Tipp dreht zurück. Die Aufgabe bewegt sich nie. .satz data-id="an" steht nach dem ersten Drehen unter der Bühne.

BÜHNE „LINIE“ (data-szene="linie" am <section>): das Dreieck, in seine Grundlinie geklappt.
|----Denken----Metaphorik----Gefühl----|  Darunter läuft ein Männchen von Station zu Station.
Was das Männchen in sich trägt (Plus oder Minus) und wo es steht, ergibt sich aus den Schritten davor.

am <section>:
  data-uebergang="klappen"   das Dreieck der Karte klappt zur Linie, die Platten fahren an die Enden (data-dauer = Sekunden).
                             Der Text des Schritts erscheint erst danach.
  data-ort         wohin das Männchen in diesem Schritt geht: denken   metaphorik   gefuehl
  data-trifft      eine Ladung kommt von außen und trifft das Männchen: +  oder  −
  data-wird        die Ladung im Männchen wird zu: +  oder  −
  data-gruebeln    das Männchen läuft auf der Stelle hin und her, seine .blase-Zeilen wechseln im Kreis
  data-geschichte  neben dem Männchen erscheint eine Geschichte (ein Bild im Rahmen)
im <section>:
  .kommt           was von außen kommt, steht kurz am rechten Rand (bei data-trifft)
  .blase           Zeile unter dem Männchen; data-wer ist das Wort darüber (fühlen, denken, Geschichte)
  .satz data-id="an"   Satz unter der Bühne, sobald das Männchen angekommen ist
```
