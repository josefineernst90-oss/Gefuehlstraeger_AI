# Gefühlsträger interaktiv

Das Buch „Gefühlsträger“ als interaktive Seite. Dieses Repository ist die Quelle. Aufbau der Dateien: siehe `README.md`. Stand und offene Punkte: `docs/STAND.md`. Bedeutung aller Drehbuch-Attribute: `docs/DREHBUCH.md`.

## Sparsam arbeiten

- Nie alles lesen. Für eine Änderung reichen meist der betroffene `<section>`-Block in `index.html` (per Suche nach `id="…"`) und die eine Bühnen-Datei in `js/`.
- Erst prüfen, ob das Gewünschte allein im Drehbuch geht (Attribute in `docs/DREHBUCH.md`). Nur neue Mechanik braucht Code.
- Wünsche sammeln, einmal bauen, einmal prüfen, einmal committen.
- Prüfen: alle Schritte einmal mit Playwright durchklicken und auf Konsolenfehler achten (die Seite dafür mit `?still` an der Adresse öffnen, dann steht jeder Ablauf sofort am Ende; Google-Fonts-Anfragen abbrechen). Bildschirmfotos nur für neue Bilder. Das Bild selbst beurteilt die Autorin auf der Seite.
- Das Claude-Artefakt „Gefühlsträger interaktiv“ wird nur auf Wunsch aktualisiert (`node bauen.js`, dann `dist/artefakt.html` veröffentlichen).

## Regeln für Inhalt und Bild

- Antworten auf Deutsch, kurz und direkt. Vor dem Bauen ein kurzer Bildvorschlag im Text.
- Der Betrachter hat das Buch nicht gelesen. Das Bild erklärt, der Text verdeutlicht nur. Wenig Text.
- Es bewegt sich immer nur eine Sache. Reihenfolge: Text, Lesepause, Bewegung auf der Bühne, Satz unter der Bühne.
- Ein Schritt beginnt, wie der davor endet. Übergänge müssen ohne Vorwissen nachvollziehbar sein.
- Aussagen müssen zum Buch passen. Zitate im Manuskript nachschlagen (liegt nicht im Repository, sondern als `Gefühlsträger.pdf` im Claude-Projekt). Bei einem neuen Kapitel der Reihenfolge des Buchs folgen.
- In jeder Antwort sagen: was gebaut wurde, was selbst gesetzt wurde, welche Texte aus dem Buch sind, was zu prüfen ist.
- Eine durchgehende Geschichte: Türrahmen, Kollege („Das war so nicht richtig. Hättest du mal gefragt.“), Chef macht Druck, Steg „Scheißtag“, verpasster Bus und Heimweg, zu Hause Aufräumen, abends der Film.
- Ladung geht von Männchen zu Männchen, nicht erst in den Speicher.
- In der aufgebauten Welt bleiben (Zeitlinie, Speicher, Steg auf dem Wasser, Inseln, Kanal, zwei Bahnen). Keine Einzelbilder mit eigenen Requisiten.
- Ein verworfener Schritt wird mit `data-aus` ausgeschaltet, nicht gelöscht.

## Technik

- Kein Build nötig: `index.html` lädt `css/seite.css` und die Dateien in `js/` der Reihe nach. Die Skripte teilen sich den globalen Namensraum (kein Modulsystem), die Reihenfolge der `<script>`-Zeilen zählt.
- Jede Bühne: eine Start-Funktion baut einen Plan aus `{dur, run(k), start}`, `ablauf()` arbeitet ihn ab, eine Zeichen-Funktion malt pro Frame auf das `<canvas>`. Die Bilder bewegen sich immer, die Einstellung „weniger Bewegung“ am Gerät wird nicht beachtet. Nur mit `?still` an der Adresse läuft jeder Plan sofort durch.
- Farben nur über die Tokens `--bg --paper --ink --muted --line --plus --minus --gelb` (hell und dunkel).
