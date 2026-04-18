# 🦊 Roeltje het vosje — rekenspel

Een platformspel voor kinderen van 4–7 waarin Roeltje het vosje appeltjes verzamelt door rekensommetjes op te lossen en veilig thuiskomt zonder de slapende beer wakker te maken.

Ontworpen door en voor twee kinderen (4 en 7). Gemaakt met [Phaser 3](https://phaser.io) — één HTML-pagina, geen build-step.

## Spelen

**Besturing (laptop):**
- ⬅️ ➡️ / A D — lopen
- ⬆️ / spatie / W — springen
- ⬇️ / S — bukken (ook: stil sluipen langs de beer)

**Besturing (tablet):**
Touch-knoppen verschijnen automatisch onderaan het scherm.

**Twee modi:**
- 🧒 **Voor kleine vosjes** — hoeveel appels zie je? (1 t/m 10)
- 👧 **Voor grote vosjes** — tafels van 1, 2, 5 en 10

## Lokaal draaien

```bash
cd rekenspel
python3 -m http.server 8000
# open http://localhost:8000 in je browser
```

Phaser wordt via CDN geladen, dus je hebt alleen een statische webserver nodig.

## Online zetten (gratis)

### Optie A — Netlify Drop (makkelijkst)

1. Open [app.netlify.com/drop](https://app.netlify.com/drop)
2. Sleep de hele `rekenspel`-map op de pagina
3. Krijg een URL (bijv. `adoring-tesla-abc123.netlify.app`)
4. Optioneel een gratis account maken → site claimen → custom subdomain kiezen

**Let op — voor een publieke deploy de eigen `muziek.mp3` tijdelijk weghalen:**

```bash
mv assets/muziek.mp3 /tmp/muziek-backup.mp3
# → nu de map slepen naar Netlify
mv /tmp/muziek-backup.mp3 assets/muziek.mp3
```

Zonder `muziek.mp3` valt het spel terug op het ingebouwde procedurele deuntje. Dit is belangrijk als je `muziek.mp3` auteursrechtelijk materiaal bevat (alleen lokaal thuis afspelen is OK, publiek online zetten niet).

### Optie B — GitHub Pages

```bash
git init
git add .
git commit -m "Eerste versie van Roeltje"
# maak repo aan op github.com, dan:
git remote add origin git@github.com:<gebruikersnaam>/rekenspel.git
git push -u origin main
```

Ga op GitHub naar **Settings → Pages** en kies `main` branch + root folder. Na ~1 minuut staat het op `https://<gebruikersnaam>.github.io/rekenspel/`.

De `.gitignore` zorgt al dat `assets/muziek.mp3` niet mee-gecommit wordt.

## Projectstructuur

```
rekenspel/
├── index.html                  # Enige HTML-pagina
├── src/
│   ├── main.js                 # Phaser-config
│   ├── modes/
│   │   ├── kleuter.js          # Tel-sommen
│   │   └── tafels.js           # Tafelsommen
│   └── scenes/
│       ├── BootScene.js        # Tekent sprites met graphics (nog geen plaatjes)
│       ├── MenuScene.js        # Modus-keuze
│       ├── GameScene.js        # Het bos-level
│       ├── PuzzleScene.js      # Som-overlay
│       └── WinScene.js         # "Veilig thuis!" scherm
```

## Zelf sommen aanpassen

- **Kleuter-modus**: bereik zit in `src/modes/kleuter.js` (nu `1..10`).
- **Tafels-modus**: welke tafels meedoen zit in `src/modes/tafels.js` (nu `[1, 2, 5, 10]`). Breid de array uit naar `[1, 2, 3, 4, 5, 10]` als je de 3- en 4-tafels erbij wil.

## Level aanpassen

Level-layout (platforms, appelposities, beer, huisje) staat in `src/scenes/GameScene.js` onder `create()`. Alle posities zijn simpele `{x, y}`-waardes.

## Ideeën voor later

- Echte sprites voor Roeltje, beer en huisje (Kenney.nl heeft gratis packs)
- Achtergrondmuziek + geluidjes
- Meerdere levels (donkerder bos, grot, beekje)
- Highscore onthouden met `localStorage`
- Konijntje of uiltje als vriendje onderweg
