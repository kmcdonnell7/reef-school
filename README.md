# 🐠 Reef School

Two under-the-sea learning apps for summer 2026, built from the girls' curriculum
packs. Vanilla HTML/CSS/JS — no build step, no dependencies, no accounts, no ads,
no network. Everything runs on-device and works offline (installable PWAs).

- **🌊 Tide Pool** — *Ready for 2nd Grade.* Earns 🫧 **pearls**.
- **🤿 Deep Dive** — *Ready for 4th Grade.* Earns 💎 **gems**.

Open `index.html` to pick a player.

## What's inside

Each app covers **reading, writing, spelling, and math**, gamified with points,
a star chart, and collectible sea creatures. Read-aloud (Web Speech API) is on by
default and can be toggled off from the hub.

**Tide Pool (G2)** — Word Reef (sight-word flashcards), Word Hunt (word search),
Story Cove (read + comprehension), Sentence Builder, Story Starter (journal),
Spell It, Bubble Pop (subtraction), Number-Line Dive (count back).

**Deep Dive (G4)** — Word Reef (Power-Word flashcards), Meaning Match, Passage Dive
(read + comprehension), Grammar Reef, Story Starter, Spell It, Fact Blaster (×/÷),
Math Dive (weekly focus), Word Problems.

Content follows the 8-week curriculum (Jun 29 – Sep 8, 2026): 90 heart words and
72 power words, all eight stories/passages with comprehension questions, and math
that matches each week's focus. The app auto-selects the "current" week by date.

## Structure

```
index.html            splash — pick your player
shared/               theme.css, speak.js, store.js, engine.js, games.js
shared/data/          g2.js (Tide Pool), g4.js (Deep Dive)
tidepool/  deepdive/  each: index.html, app.js, manifest, sw.js, icons/
make_icons.py         regenerates app icons (needs Pillow)
```

## Progress & privacy

Progress (points, stars, creatures, accuracy) is stored in `localStorage` per
player. Nothing leaves the device. A **Grown-Ups** screen shows a summary and a
reset button.

## Shipping updates

Edit files, then **bump `CACHE_VERSION`** in the relevant `sw.js`
(`tidepool/sw.js` and/or `deepdive/sw.js`) so the offline cache doesn't serve
stale files. Commit and push; installed iPads pick it up next time they open
online. Icons are regenerated with `python3 make_icons.py`.

## Run locally

```
python3 -m http.server 8777
# open http://localhost:8777/
```
