/* Reef School — game engine: navigation, hub, scoring, rewards, star chart.
   A game is: { id, name, emoji, tag, sub, build(ctx) }
   ctx = { root, store, award(n,ev), correct(), wrong(), feedback(msg,ok),
           speak(t), finish(opts), pointName, pointEmoji, shuffle, sample, rand, pick } */
(function () {
  // ---------- tiny DOM + math helpers ----------
  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function cap(s) { s = String(s); return s.charAt(0).toUpperCase() + s.slice(1); }
  function plur(n, one, many) { return n + " " + (n === 1 ? one : many); }
  function rand(n) { return Math.floor(Math.random() * n); }
  function pick(arr) { return arr[rand(arr.length)]; }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function sample(arr, n) { return shuffle(arr).slice(0, n); }
  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  const CREATURE_MILESTONES = [1, 2, 3, 5, 7, 10, 14, 18, 25, 35]; // stars needed per creature

  const Reef = { el, rand, pick, shuffle, sample, esc };

  Reef.start = function (config) {
    const store = new window.Store(config.playerKey);
    if (config.games) config._byId = {};
    (config.games || []).forEach((g) => (config._byId[g.id] = g));

    // Week selection (session-only; defaults to the date-picked "current" week
    // so it auto-lands on the right week each time the app opens).
    const weeks = config.weeks || null;
    let weekIndex = weeks ? Math.max(0, Math.min(weeks.length - 1, config.defaultWeekIndex || 0)) : 0;

    // Reskinnable reward vocabulary (defaults keep the sea-friends wording).
    const SICON = config.starEmoji || "⭐", SMARK = config.starMark || "★";
    const SONE = config.starOne || "star", SPL = config.starPlural || "stars";
    const CONE = config.creatureOne || "sea friend", CPL = config.creaturePlural || "sea friends";
    const CHART = config.chartTitle || "Star Chart";

    // sync sound settings (auto-read defaults OFF; manual "Say it" buttons always work)
    if (window.Speak) window.Speak.setAuto(store.data.settings.autoRead === true);
    if (window.SFX) window.SFX.toggle(store.data.settings.sound !== false);

    // ---- root scaffolding ----
    document.title = config.title;
    const bubbles = el("div", "bubbles");
    for (let i = 0; i < 14; i++) {
      const b = el("i");
      const s = 10 + rand(30);
      b.style.setProperty("--s", s + "px");
      b.style.setProperty("--x", rand(100) + "%");
      b.style.setProperty("--d", 8 + rand(12) + "s");
      b.style.setProperty("--delay", rand(12) + "s");
      bubbles.appendChild(b);
    }
    document.body.appendChild(bubbles);

    // light rays + sea floor decoration (pure CSS/SVG, behind content)
    const rays = el("div", "rays");
    document.body.appendChild(rays);
    const floor = el("div", "seafloor");
    floor.innerHTML =
      "<svg viewBox='0 0 1200 140' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'>" +
      "<path d='M0,90 Q150,40 300,80 T600,80 T900,75 T1200,85 L1200,140 L0,140 Z' fill='rgba(1,44,74,.55)'/>" +
      "<path d='M0,110 Q200,70 400,105 T800,100 T1200,110 L1200,140 L0,140 Z' fill='rgba(1,30,52,.75)'/>" +
      "</svg>" +
      "<span class='weed' style='left:6%'>🌿</span><span class='weed' style='left:20%'>🪸</span>" +
      "<span class='weed' style='left:78%'>🌿</span><span class='weed' style='left:90%'>🪸</span>";
    document.body.appendChild(floor);

    const wrap = el("div", "wrap");
    const topbar = el("div", "topbar");
    const backBtn = el("button", "btn-back", "⬅︎");
    const h1 = el("h1", null, config.title);
    const scoreChip = el("div", "score-chip", config.pointEmoji + " <span id='scoreN'>0</span>");
    topbar.append(backBtn, h1, scoreChip);
    const root = el("div", "root");
    wrap.append(topbar, root);
    document.body.appendChild(wrap);

    function refreshScore() {
      const s = document.getElementById("scoreN");
      if (s) s.textContent = store.data.points;
    }
    refreshScore();

    let onBack = goHome;
    backBtn.onclick = () => onBack();

    // ---------- points animation + toast + confetti ----------
    function pointFly(ev, n) {
      const f = el("div", "pointfly", "+" + n + " " + config.pointEmoji);
      let x = window.innerWidth / 2, y = window.innerHeight / 2;
      if (ev && ev.clientX) { x = ev.clientX; y = ev.clientY; }
      f.style.left = x - 20 + "px";
      f.style.top = y - 20 + "px";
      document.body.appendChild(f);
      setTimeout(() => f.remove(), 1000);
    }
    function toast(msg) {
      const t = el("div", "toast", msg);
      document.body.appendChild(t);
      requestAnimationFrame(() => t.classList.add("show"));
      setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 400); }, 1900);
    }
    function confetti() {
      const c = el("div", "confetti");
      const colors = ["#ffd166", "#ff6b6b", "#52b788", "#468faf", "#9d4edd", "#ffb703"];
      for (let i = 0; i < 40; i++) {
        const p = el("i");
        p.style.left = rand(100) + "%";
        p.style.background = pick(colors);
        p.style.animationDelay = (rand(60) / 100) + "s";
        p.style.transform = "translateY(0) rotate(" + rand(360) + "deg)";
        c.appendChild(p);
      }
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 2200);
    }

    function maybeUnlockCreature() {
      // Unlock next creature when stars pass the next milestone.
      const owned = store.data.creatures.length;
      if (owned >= config.creatures.length) return null;
      const need = CREATURE_MILESTONES[owned] || (25 + owned * 8);
      if (store.data.stars >= need) {
        const c = config.creatures[owned];
        if (store.unlockCreature(c)) return c;
      }
      return null;
    }

    // ---------- the game context ----------
    function makeCtx() {
      const ctx = {
        root,
        store,
        pointName: config.pointName,
        pointEmoji: config.pointEmoji,
        shuffle, sample, rand, pick, el, esc,
        week: weeks ? weeks[weekIndex] : null,
        weekIndex: weekIndex,
        _newCreature: null,
      };
      ctx.speak = (t, o) => window.Speak && window.Speak.say(t, o);      // auto (gated by setting)
      ctx.sayNow = (t, o) => window.Speak && window.Speak.force(t, o);   // manual buttons (always)
      ctx.award = (n, ev) => {
        store.addPoints(n);
        refreshScore();
        pointFly(ev, n);
        if (window.SFX) window.SFX.point();
        const chip = document.querySelector(".score-chip");
        if (chip) { chip.classList.remove("bump"); void chip.offsetWidth; chip.classList.add("bump"); }
        const c = maybeUnlockCreature();
        if (c) ctx._newCreature = c;
      };
      ctx.correct = () => store.recordAnswer(true);
      ctx.wrong = () => store.recordAnswer(false);
      ctx.feedback = (node, msg, ok) => {
        node.textContent = msg;
        node.className = "feedback " + (ok ? "good" : "bad");
        if (window.SFX) { ok ? window.SFX.correct() : window.SFX.wrong(); }
      };
      ctx.sfx = window.SFX || { correct(){}, wrong(){}, point(){}, win(){}, tap(){} };
      ctx.set = (child) => { root.innerHTML = ""; if (typeof child === "string") root.innerHTML = child; else root.appendChild(child); };
      ctx.finish = (opts) => finishGame(ctx, opts);
      ctx.toast = toast;
      ctx.confetti = confetti;
      return ctx;
    }

    // ---------- reward / finish screen ----------
    function finishGame(ctx, opts) {
      opts = opts || {};
      confetti();
      if (window.SFX) window.SFX.win();
      if (opts.gameId) store.recordPlay(opts.gameId, opts.score);
      const wrapC = el("div", "card reward");
      const emoji = ctx._newCreature || opts.emoji || "🌟";
      wrapC.appendChild(el("span", "big-emoji", emoji));
      if (ctx._newCreature) {
        wrapC.appendChild(el("h2", null, "New " + esc(CONE) + " unlocked!"));
        wrapC.appendChild(el("p", "lead", "You collected a new " + esc(CONE) + "!"));
      } else {
        wrapC.appendChild(el("h2", null, opts.title || "Great job!"));
        if (opts.msg) wrapC.appendChild(el("p", "lead", opts.msg));
      }
      if (opts.score != null) {
        wrapC.appendChild(el("div", "prompt-med", "Score: " + opts.score));
      }
      wrapC.appendChild(el("div", "prompt-med", "You have " + store.data.points + " " + config.pointEmoji + " " + config.pointName + "!"));
      const again = el("button", "btn big", "Play again 🔁");
      const home = el("button", "btn big kelp", "Back to the reef 🏝️");
      again.onclick = () => { if (opts.replay) opts.replay(); else if (opts.gameId) openGame(opts.gameId); };
      home.onclick = goHome;
      wrapC.append(again, home);
      root.innerHTML = "";
      root.appendChild(wrapC);
      if (window.Speak) window.Speak.say(ctx._newCreature ? "You unlocked a new " + CONE + "!" : "Great job!");
    }

    // ---------- open a game ----------
    function openGame(id) {
      const g = config._byId[id];
      if (!g) return;
      onBack = goHome;
      const ctx = makeCtx();
      root.innerHTML = "";
      g.build(ctx);
    }

    // ---------- HUB ----------
    function tileEl(tag, emoji, name, sub, onclick) {
      const t = el("button", "tile tile-" + tag);
      t.innerHTML = "<span class='badge'>" + emoji + "</span><span class='name'>" +
        esc(name) + "</span>" + (sub ? "<span class='sub'>" + esc(sub) + "</span>" : "");
      t.onclick = onclick;
      return t;
    }

    function backHub() {
      // From the hub, the back button leaves to the parent landing page.
      if (config.homeUrl) { if (window.Speak) window.Speak.stop(); window.location.href = config.homeUrl; }
    }

    function goHome() {
      onBack = backHub;
      if (window.Speak) window.Speak.stop();
      root.innerHTML = "";

      // hero banner
      const hero = el("div", "hero");
      const owned = store.data.creatures.length;
      const nextStars = (CREATURE_MILESTONES[owned] || (25 + owned * 8));
      const curWeek = weeks ? weeks[weekIndex] : null;
      const focusText = typeof config.focus === "function" ? config.focus(curWeek) : config.focus;
      hero.innerHTML =
        "<div class='hero-mascot'>" + (config.mascot || "🐠") + "</div>" +
        "<div class='hero-info'><div class='hero-hi'>" + esc(config.greeting || "Ready to dive in?") + "</div>" +
        (focusText ? "<div class='hero-focus'>" + esc(focusText) + "</div>" : "") +
        "<div class='hero-stats'>" + config.pointEmoji + " " + store.data.points + " " + esc(config.pointName) +
        " &nbsp;·&nbsp; " + SICON + " " + store.data.stars +
        (owned < config.creatures.length ? " &nbsp;·&nbsp; next " + esc(CONE) + " at " + SMARK + nextStars : " &nbsp;·&nbsp; all " + esc(CPL) + "! 🎉") +
        "</div></div>";
      root.appendChild(hero);
      if (weeks) {
        const pill = el("button", "week-pill", "📅 Week " + curWeek.n + "  ▸");
        pill.onclick = showWeekPicker;
        hero.querySelector(".hero-info").appendChild(pill);
      }

      const groups = {};
      const order = ["reading", "writing", "spelling", "math"];
      const labels = { reading: "📖 Reading", writing: "✍️ Writing", spelling: "🔤 Spelling", math: "🔢 Math" };
      config.games.forEach((g) => (groups[g.tag] || (groups[g.tag] = [])).push(g));

      order.forEach((tag) => {
        if (!groups[tag] || !groups[tag].length) return;
        root.appendChild(el("div", "section-label", labels[tag]));
        const tiles = el("div", "tiles");
        groups[tag].forEach((g) => tiles.appendChild(tileEl(g.tag, g.emoji, g.name, g.sub, () => openGame(g.id))));
        root.appendChild(tiles);
      });

      // My Reef row
      root.appendChild(el("div", "section-label", "🏝️ My Reef"));
      const extra = el("div", "tiles");
      extra.appendChild(tileEl("reef", SICON, CHART, store.data.stars + " " + SPL, showStars));
      extra.appendChild(tileEl("reef", "👪", "Grown-Ups", "progress", showGrown));
      const speakTile = tileEl("reef", "🔊", "Read Aloud", "OFF", null);
      const renderSpeak = () => {
        const on = store.data.settings.autoRead === true;
        speakTile.querySelector(".badge").textContent = on ? "🔊" : "🔇";
        speakTile.querySelector(".sub").textContent = on ? "ON" : "OFF";
      };
      renderSpeak();
      speakTile.onclick = () => {
        const on = !(store.data.settings.autoRead === true);
        store.setAutoRead(on);
        if (window.Speak) window.Speak.setAuto(on);
        renderSpeak();
        if (on && window.Speak) window.Speak.force("Read aloud is on");
      };
      const soundTile = tileEl("reef", "🎵", "Sound FX", "ON", null);
      const renderSound = () => {
        const on = store.data.settings.sound !== false;
        soundTile.querySelector(".badge").textContent = on ? "🎵" : "🔕";
        soundTile.querySelector(".sub").textContent = on ? "ON" : "OFF";
      };
      renderSound();
      soundTile.onclick = () => {
        const on = !(store.data.settings.sound !== false);
        store.setSound(on);
        if (window.SFX) { window.SFX.toggle(on); if (on) window.SFX.correct(); }
        renderSound();
      };
      extra.append(speakTile, soundTile);
      root.appendChild(extra);
    }

    function showWeekPicker() {
      onBack = goHome;
      root.innerHTML = "";
      const c = el("div", "card");
      c.appendChild(el("h2", null, "📅 Pick a Week"));
      c.appendChild(el("p", "lead", "Choose which week's words and story to play."));
      weeks.forEach((w, i) => {
        const title = (w.story && w.story.title) || (w.passage && w.passage.title) || "";
        const b = el("button", "week-choice" + (i === weekIndex ? " current" : ""));
        b.innerHTML = "<span class='wc-n'>Week " + w.n + (i === weekIndex ? " ✓" : "") + "</span>" +
          "<span class='wc-sub'>Level " + esc(w.level) + (title ? " · " + esc(title) : "") + "</span>";
        b.onclick = () => { weekIndex = i; goHome(); };
        c.appendChild(b);
      });
      root.appendChild(c);
    }

    function showStars() {
      onBack = goHome;
      root.innerHTML = "";
      const c = el("div", "card");
      c.appendChild(el("h2", null, SICON + " " + CHART));
      c.appendChild(el("p", "lead", "Earn 1 " + SONE + " for every 10 " + config.pointEmoji + "!"));
      c.appendChild(el("div", "prompt-med", SMARK + " " + plur(store.data.stars, SONE, SPL)));
      c.appendChild(el("div", "muted center", store.data.points + " " + config.pointName + " so far"));
      const shelfLbl = el("div", "section-label", (config.creatureIcon || "🐚") + " Your " + CPL);
      const shelf = el("div", "shelf");
      config.creatures.forEach((cr, i) => {
        const owned = store.data.creatures.includes(cr);
        const slot = el("div", "slot" + (owned ? "" : " locked"), owned ? cr : "🔒");
        shelf.appendChild(slot);
      });
      root.append(c);
      const wrap2 = el("div", "card");
      wrap2.append(shelfLbl, shelf);
      const next = store.data.creatures.length;
      if (next < config.creatures.length) {
        const need = CREATURE_MILESTONES[next] || (25 + next * 8);
        wrap2.appendChild(el("div", "muted center", "Next " + CONE + " at " + SMARK + " " + plur(need, SONE, SPL)));
      } else {
        wrap2.appendChild(el("div", "muted center", "You collected them all! 🎉"));
      }
      root.append(wrap2);
    }

    function showGrown() {
      onBack = goHome;
      root.innerHTML = "";
      const c = el("div", "card grown");
      c.appendChild(el("h2", null, "👪 Grown-Ups Summary"));
      c.appendChild(el("p", "lead", "On-device only — nothing leaves this iPad."));
      const d = store.data;
      const acc = d.answered ? Math.round((d.correct / d.answered) * 100) : 0;
      const rows = [
        [cap(config.pointName) + " earned", d.points + " " + config.pointEmoji],
        [cap(SPL), d.stars + " " + SMARK],
        [cap(CPL), d.creatures.length + " / " + config.creatures.length],
        ["Questions answered", d.answered],
        ["Answered correctly", d.correct + " (" + acc + "%)"],
      ];
      const table = el("table");
      rows.forEach((r) => {
        const tr = el("tr");
        tr.append(el("td", null, r[0]), el("td", null, String(r[1])));
        table.appendChild(tr);
      });
      c.appendChild(table);
      // Per-game plays
      const plays = Object.keys(d.plays);
      if (plays.length) {
        c.appendChild(el("div", "section-label", "🎮 Games played"));
        const t2 = el("table");
        plays.forEach((id) => {
          const g = config._byId[id];
          const tr = el("tr");
          tr.append(el("td", null, (g ? g.emoji + " " + g.name : id)),
            el("td", null, d.plays[id] + "×" + (d.best[id] != null ? " · best " + d.best[id] : "")));
          t2.appendChild(tr);
        });
        c.appendChild(t2);
      }
      const reset = el("button", "btn ghost", "Reset progress");
      reset.style.marginTop = "14px";
      reset.onclick = () => {
        if (confirm("Reset all progress for this player? This cannot be undone.")) {
          store.data = store._blank();
          store.save();
          refreshScore();
          goHome();
        }
      };
      c.appendChild(reset);
      root.appendChild(c);
    }

    goHome();
    return { store, goHome, openGame };
  };

  window.Reef = Reef;
})();
