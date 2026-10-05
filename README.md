# Gefühlsträger interaktiv

Das Buch „Gefühlsträger“ als interaktive Seite. Stand: Version 71.

## Ansehen und bearbeiten

`index.html` im Browser öffnen. Kein Server und kein Bauen nötig: im Editor ändern, im Browser neu laden.

## Was wo liegt

| Datei | Inhalt |
|---|---|
| `index.html` | Gerüst der Seite und das **Drehbuch**: alle Texte und die Reihenfolge der Schritte, je Schritt ein `<section>`-Block |
| `docs/DREHBUCH.md` | Was jedes Attribut im Drehbuch bedeutet, Bühne für Bühne |
| `css/seite.css` | Layout und Farben (hell und dunkel) |
| `js/01-grundlage.js` | Drehbuch einlesen, Zustand, Ladungen, Momente |
| `js/02` bis `js/14b` | je eine Bühne (`bindung`, `steg`, `zwei`, `arbeit`, `film`, `spitze`, `schloss`, `drehen`, `sicht`, `strom`, `grob`, Zeitlinie, `fokus`) |
| `js/15-schritte.js` | Schritt betreten, verlassen, erledigt |
| `js/16-navigation.js` | Weiter, Zurück, Knöpfe, Kapitelpunkte |
| `js/17-buehne-und-start.js` | Takt, gemeinsame Zeichenhelfer, Speicher-Bühne, Start |

Die Skripte teilen sich einen gemeinsamen Namensraum und werden in dieser Reihenfolge geladen.

## Ohne Programmieren änderbar (nur `index.html`)

- Texte und Sätze unter der Bühne
- Reihenfolge der Schritte (Block verschieben)
- Schritt aus- oder einschalten (`data-aus` am `<section>`)
- weitere Beispiele in vorhandenen Formen, zum Beispiel ein Knopf im Schritt `x2`:

```html
<div class="ereignis" data-knopf="Sport" data-id="sport" data-art="wort" data-kommt="Sport" data-innen>
  <p data-bahn="oben" data-name="Pflichtprogramm" data-ladung="−">das raubt mir Zeit und Kraft</p>
  <p data-bahn="unten" data-name="Körper" data-ladung="+">ich baue mir eine Ressource auf</p>
</div>
```

## Eine einzige Datei erzeugen

`node bauen.js` schreibt `dist/gefuehlstraeger.html` (eigenständig) und `dist/artefakt.html` (für das Claude-Artefakt).
