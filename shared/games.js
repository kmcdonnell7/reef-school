/* Reef School — reusable game builders. Each takes the engine ctx + options. */
(function () {
  const R = window.Reef;
  const { el, shuffle, sample, rand, pick, esc } = R;

  function progressDots(total, now, done) {
    const p = el("div", "progress");
    for (let i = 0; i < total; i++) {
      const dot = el("i");
      if (i < (done != null ? done : now)) dot.classList.add("done");
      if (i === now) dot.classList.add("now");
      p.appendChild(dot);
    }
    return p;
  }

  // ---------- generic multiple-choice quiz ----------
  // items: [{ q, choices:[..], a: idx, speak?:bool }]
  function mcqQuiz(ctx, opts) {
    let i = 0, score = 0;
    const items = opts.items;
    function step() {
      if (i >= items.length) {
        ctx.finish({ gameId: opts.gameId, emoji: opts.emoji, score: score, title: opts.doneTitle });
        return;
      }
      const it = items[i];
      const card = el("div", "card");
      card.appendChild(progressDots(items.length, i));
      if (opts.header) card.appendChild(opts.header(it, i));
      const q = el("div", "prompt-med", esc(it.q));
      card.appendChild(q);
      const fb = el("div", "feedback");
      const box = el("div", "choices");
      const opts2 = it.choices.map((c, idx) => ({ text: c, correct: idx === it.a }));
      const order = it.noShuffle ? opts2 : shuffle(opts2);
      let answered = false;
      order.forEach((o) => {
        const b = el("button", "choice", esc(o.text));
        b.onclick = (ev) => {
          if (answered) return;
          answered = true;
          if (o.correct) {
            b.classList.add("correct");
            ctx.correct();
            const pts = opts.pointsEach || 2;
            score += pts;
            ctx.award(pts, ev);
            ctx.feedback(fb, "Yes! " + pick(["Nice!", "Great!", "You got it!", "Woohoo!"]), true);
            ctx.speak("Correct!");
            box.querySelectorAll(".choice").forEach((x) => (x.disabled = true));
            setTimeout(() => { i++; step(); }, 950);
          } else {
            b.classList.add("wrong");
            ctx.wrong();
            ctx.feedback(fb, "Not quite — look again!", false);
            ctx.speak("Try again");
            // reveal correct + let them move on
            order.forEach((oo, k) => { const btn = box.children[k]; if (oo.correct) btn.classList.add("correct"); btn.disabled = true; });
            const next = el("button", "btn big kelp", "Next ➜");
            next.onclick = () => { i++; step(); };
            card.appendChild(next);
          }
        };
        box.appendChild(b);
      });
      card.appendChild(q);
      card.appendChild(box);
      card.appendChild(fb);
      ctx.set(card);
      if (it.speak) ctx.speak(it.q);
    }
    step();
  }

  // ---------- keypad numeric quiz (math) ----------
  // items: [{ q, a }]
  function numQuiz(ctx, opts) {
    let i = 0, score = 0;
    const items = opts.items;
    function step() {
      if (i >= items.length) {
        ctx.finish({ gameId: opts.gameId, emoji: opts.emoji, score: score, title: "Math star! ⭐" });
        return;
      }
      const it = items[i];
      const card = el("div", "card center");
      card.appendChild(progressDots(items.length, i));
      if (it.pre) card.appendChild(it.pre);
      card.appendChild(el("div", "prompt-big", esc(it.q)));
      const disp = el("div", "answer-input", "");
      disp.style.minHeight = "1.6em";
      card.appendChild(disp);
      const fb = el("div", "feedback");
      card.appendChild(fb);
      let cur = "";
      const pad = el("div", "tiles");
      pad.style.gridTemplateColumns = "repeat(3, 1fr)";
      const keys = ["1","2","3","4","5","6","7","8","9","⌫","0","✓"];
      keys.forEach((k) => {
        const b = el("button", "tile", "<span class='name' style='font-size:1.5rem'>" + k + "</span>");
        b.onclick = (ev) => {
          if (k === "⌫") { cur = cur.slice(0, -1); }
          else if (k === "✓") { return check(ev); }
          else if (cur.length < 5) { cur += k; }
          disp.textContent = cur;
        };
        pad.appendChild(b);
      });
      card.appendChild(pad);
      ctx.set(card);
      let done = false;
      function check(ev) {
        if (done || cur === "") return;
        if (parseInt(cur, 10) === it.a) {
          done = true;
          ctx.correct();
          const pts = opts.pointsEach || 2;
          score += pts; ctx.award(pts, ev);
          ctx.feedback(fb, "Correct! " + pick(["🎉","🌟","🐠","💪"]), true);
          ctx.speak("Correct!");
          setTimeout(() => { i++; step(); }, 850);
        } else {
          ctx.wrong();
          ctx.feedback(fb, "Not yet — try again!", false);
          ctx.speak("Try again");
          cur = ""; disp.textContent = "";
        }
      }
    }
    step();
  }

  // ---------- math generators ----------
  function genMath(mode, n) {
    const out = [];
    const r = (a, b) => a + rand(b - a + 1);
    for (let k = 0; k < n; k++) {
      let a, b, c;
      switch (mode) {
        case "mult": a = r(2, 9); b = r(2, 9); out.push({ q: a + " × " + b + " = ?", a: a * b }); break;
        case "div": b = r(2, 9); c = r(2, 9); out.push({ q: (b * c) + " ÷ " + b + " = ?", a: c }); break;
        case "factmix":
          if (rand(2)) { a = r(2, 9); b = r(2, 9); out.push({ q: a + " × " + b + " = ?", a: a * b }); }
          else { b = r(2, 9); c = r(2, 9); out.push({ q: (b * c) + " ÷ " + b + " = ?", a: c }); }
          break;
        case "addsub":
          if (rand(2)) { a = r(120, 899); b = r(100, 400); out.push({ q: a + " + " + b + " = ?", a: a + b }); }
          else { a = r(300, 900); b = r(100, a - 50); out.push({ q: a + " − " + b + " = ?", a: a - b }); }
          break;
        case "mult2": a = r(11, 39); b = r(2, 8); out.push({ q: a + " × " + b + " = ?", a: a * b }); break;
        case "place":
          a = r(1000, 9999);
          if (rand(2)) out.push({ q: "Round " + a + " to the nearest hundred", a: Math.round(a / 100) * 100 });
          else { const d = ["thousands","hundreds","tens","ones"][rand(4)]; const digits = String(a).split("").map(Number); const idx = { thousands:0, hundreds:1, tens:2, ones:3 }[d]; out.push({ q: "What digit is in the " + d + " place of " + a + "?", a: digits[idx] }); }
          break;
        case "frac":
          { const dn = [2,3,4,5,6,8][rand(6)]; const nu = r(1, dn - 1); const f = r(2, 4); out.push({ q: nu + "/" + dn + " = ? /" + (dn * f), a: nu * f }); }
          break;
        case "mixed":
          { const t = rand(4); if (t===0){a=r(6,12);b=r(3,9);out.push({q:a+" × "+b+" = ?",a:a*b});} else if(t===1){b=r(3,9);c=r(3,9);out.push({q:(b*c)+" ÷ "+b+" = ?",a:c});} else if(t===2){a=r(120,600);b=r(80,300);out.push({q:a+" + "+b+" = ?",a:a+b});} else {a=r(300,800);b=r(100,a-50);out.push({q:a+" − "+b+" = ?",a:a-b});} }
          break;
        case "sub": a = r(2, mode === "sub" ? 20 : 20); b = r(0, a); out.push({ q: a + " − " + b + " = ?", a: a - b }); break;
        case "sub2": a = r(21, 99); b = (a % 10 === 0 ? 10 : rand(a % 10 + 1)) + 10 * rand(Math.floor(a / 10)); if (b > a) b = rand(a); out.push({ q: a + " − " + b + " = ?", a: a - b }); break;
        case "missing":
          a = r(5, 20); c = r(0, a);
          if (rand(2)) out.push({ q: a + " − ? = " + c, a: a - c });
          else out.push({ q: "? + " + c + " = " + a, a: a - c });
          break;
        default: a = r(2, 10); b = r(0, a); out.push({ q: a + " − " + b + " = ?", a: a - b });
      }
    }
    return out;
  }

  // ---------- word-search placement ----------
  function buildWordSearch(words, size) {
    const grid = Array.from({ length: size }, () => Array(size).fill(""));
    const dirs = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    const placed = [];
    const list = shuffle(words.map((w) => w.toUpperCase().replace(/[^A-Z]/g, ""))).filter((w) => w.length <= size);
    list.forEach((word) => {
      let ok = false;
      for (let attempt = 0; attempt < 120 && !ok; attempt++) {
        const dir = pick(dirs);
        const r0 = rand(size), c0 = rand(size);
        const rEnd = r0 + dir[0] * (word.length - 1);
        const cEnd = c0 + dir[1] * (word.length - 1);
        if (rEnd < 0 || rEnd >= size || cEnd < 0 || cEnd >= size) continue;
        let fits = true;
        for (let k = 0; k < word.length; k++) {
          const rr = r0 + dir[0] * k, cc = c0 + dir[1] * k;
          if (grid[rr][cc] && grid[rr][cc] !== word[k]) { fits = false; break; }
        }
        if (!fits) continue;
        const cells = [];
        for (let k = 0; k < word.length; k++) {
          const rr = r0 + dir[0] * k, cc = c0 + dir[1] * k;
          grid[rr][cc] = word[k];
          cells.push(rr + "," + cc);
        }
        placed.push({ word, cells });
        ok = true;
      }
    });
    const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!grid[r][c]) grid[r][c] = A[rand(26)];
    return { grid, placed };
  }

  // ================= GAME BUILDERS =================
  const G = {};

  // Word Reef — flashcards. items:[{word, meta?}] , say = text to speak
  G.flashcards = function (ctx, opts) {
    const items = sample(opts.items, Math.min(opts.count || 10, opts.items.length));
    let i = 0, earned = 0;
    function step() {
      if (i >= items.length) { ctx.finish({ gameId: opts.gameId, emoji: opts.emoji, score: earned, title: "Word explorer! 📖" }); return; }
      const it = items[i];
      const wrap = el("div", "card");
      wrap.appendChild(progressDots(items.length, i));
      wrap.appendChild(el("p", "lead center", opts.lead || "Read the word, then flip it!"));
      const flip = el("div", "flip");
      const inner = el("div", "flip-inner");
      const front = el("div", "flip-face flip-front", "<div class='word'>" + esc(it.word) + "</div>");
      const back = el("div", "flip-face flip-back", "<div class='meta'>" + esc(it.back || "") + "</div>");
      inner.append(front, back); flip.appendChild(inner);
      flip.onclick = () => { flip.classList.toggle("open"); ctx.speak(flip.classList.contains("open") && it.back ? it.back : it.word); };
      wrap.appendChild(flip);
      const say = el("button", "btn sun", "🔊 Say it");
      say.onclick = () => ctx.speak(it.word);
      const got = el("button", "btn kelp", "Got it! +1");
      got.onclick = (ev) => { earned += 1; ctx.award(1, ev); ctx.correct(); i++; step(); };
      const row = el("div", "row"); row.append(say, got);
      wrap.appendChild(row);
      ctx.set(wrap);
      ctx.speak(it.word);
    }
    step();
  };

  // Story Cove / Passage Dive — read then comprehension MCQ
  G.reading = function (ctx, opts) {
    // opts: { gameId, emoji, title, genre, paragraphs:[], quiz:[{q,choices,a}] }
    const card = el("div", "card");
    const story = el("div", "story");
    story.appendChild(el("div", "title", esc(opts.title)));
    if (opts.genre) story.appendChild(el("div", "genre", "(" + esc(opts.genre) + ")"));
    opts.paragraphs.forEach((p) => story.appendChild(el("p", null, esc(p))));
    card.appendChild(story);
    card.appendChild(el("p", "lead center", "Read it (tap 🔊 to hear it), then answer the questions."));
    const listen = el("button", "btn sun big", "🔊 Read it to me");
    listen.onclick = () => ctx.speak(opts.title + ". " + opts.paragraphs.join(" "));
    const go = el("button", "btn big", "I'm ready — start questions ➜");
    go.onclick = () => {
      const items = opts.quiz.map((x) => Object.assign({ speak: true }, x));
      mcqQuiz(ctx, { gameId: opts.gameId, emoji: opts.emoji, items: items, pointsEach: 3, doneTitle: "Great reading! 📖" });
    };
    card.append(listen, go);
    ctx.set(card);
    ctx.speak(opts.title);
  };

  // Meaning Match (G4) — word → meaning MCQ
  G.meaningMatch = function (ctx, opts) {
    const all = opts.words;
    const chosen = sample(all, Math.min(opts.count || 8, all.length));
    const items = chosen.map((w) => {
      const wrongs = sample(all.filter((x) => x.w !== w.w), 2).map((x) => x.d);
      return { q: "What does “" + w.w + "” mean?", choices: shuffle([w.d, wrongs[0], wrongs[1]]), a: 0, _ans: w.d };
    }).map((it) => { it.a = it.choices.indexOf(it._ans); return it; });
    mcqQuiz(ctx, { gameId: opts.gameId, emoji: opts.emoji, items: items, pointsEach: 2, doneTitle: "Word wizard! 🧠" });
  };

  // Spell It — hear word, arrange letters
  G.spelling = function (ctx, opts) {
    const words = sample(opts.words, Math.min(opts.count || 6, opts.words.length));
    let i = 0, score = 0;
    function step() {
      if (i >= words.length) { ctx.finish({ gameId: opts.gameId, emoji: opts.emoji, score: score, title: "Super speller! 🔤" }); return; }
      const word = words[i];
      const card = el("div", "card center");
      card.appendChild(progressDots(words.length, i));
      card.appendChild(el("p", "lead", "Listen, then build the word!"));
      const say = el("button", "btn sun", "🔊 Hear the word");
      say.onclick = () => ctx.speak(word);
      card.appendChild(say);
      const slots = el("div", "bank");
      slots.style.minHeight = "56px";
      card.appendChild(slots);
      const fb = el("div", "feedback"); card.appendChild(fb);
      const pool = el("div", "bank");
      let built = [];
      const letters = shuffle(word.split(""));
      // avoid an already-correct shuffle
      if (letters.join("") === word && word.length > 1) letters.reverse();
      const poolBtns = [];
      letters.forEach((ch, idx) => {
        const b = el("button", "chip", esc(ch));
        b.onclick = () => {
          b.classList.add("used");
          built.push({ ch, b });
          renderSlots();
        };
        pool.appendChild(b); poolBtns.push(b);
      });
      function renderSlots() {
        slots.innerHTML = "";
        built.forEach((x, k) => {
          const s = el("button", "chip pick", esc(x.ch));
          s.onclick = () => { x.b.classList.remove("used"); built.splice(k, 1); renderSlots(); };
          slots.appendChild(s);
        });
      }
      card.appendChild(pool);
      const check = el("button", "btn big kelp", "Check ✓");
      check.onclick = (ev) => {
        const guess = built.map((x) => x.ch).join("");
        if (guess === word) {
          score += 2; ctx.award(2, ev); ctx.correct();
          ctx.feedback(fb, "“" + word + "” — perfect!", true);
          ctx.speak("Yes! " + word);
          check.disabled = true;
          setTimeout(() => { i++; step(); }, 950);
        } else {
          ctx.wrong();
          ctx.feedback(fb, "Not quite — try again!", false);
          ctx.speak("Try again");
        }
      };
      card.appendChild(check);
      ctx.set(card);
      ctx.speak(word);
    }
    step();
  };

  // Word Hunt — word search
  G.wordSearch = function (ctx, opts) {
    const words = sample(opts.words.filter((w) => w.replace(/[^A-Za-z]/g, "").length <= 8), Math.min(6, opts.words.length));
    const size = 10;
    const { grid, placed } = buildWordSearch(words, size);
    const card = el("div", "card");
    card.appendChild(el("h2", null, "🔍 Word Hunt"));
    card.appendChild(el("p", "lead", "Drag to find the words. They go across, down, and diagonally!"));
    const gEl = el("div", "grid");
    gEl.style.gridTemplateColumns = "repeat(" + size + ", 1fr)";
    const cellEls = {};
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
      const cell = el("div", "cell", grid[r][c]);
      cell.dataset.rc = r + "," + c;
      cellEls[r + "," + c] = cell;
      gEl.appendChild(cell);
    }
    card.appendChild(gEl);
    const listEl = el("div", "word-list");
    const spanByWord = {};
    placed.forEach((p) => { const s = el("span", null, p.word); spanByWord[p.word] = s; listEl.appendChild(s); });
    card.appendChild(listEl);
    ctx.set(card);

    let selecting = false, selCells = [];
    function rcOf(target) { return target && target.dataset && target.dataset.rc; }
    function clearSel() { selCells.forEach((rc) => cellEls[rc].classList.remove("sel")); selCells = []; }
    function addCell(rc) { if (rc && !selCells.includes(rc) && cellEls[rc]) { selCells.push(rc); cellEls[rc].classList.add("sel"); } }
    let foundCount = 0;
    function finishSel() {
      selecting = false;
      const letters = selCells.map((rc) => cellEls[rc].textContent).join("");
      const rev = letters.split("").reverse().join("");
      const hit = placed.find((p) => (p.word === letters || p.word === rev) && !p._done);
      if (hit) {
        hit._done = true; foundCount++;
        hit.cells.forEach((rc) => { cellEls[rc].classList.remove("sel"); cellEls[rc].classList.add("found"); });
        spanByWord[hit.word].classList.add("struck");
        ctx.award(2); ctx.correct();
        ctx.speak(hit.word);
        selCells = [];
        if (foundCount === placed.length) setTimeout(() => ctx.finish({ gameId: opts.gameId, emoji: opts.emoji, score: foundCount * 2, title: "You found them all! 🔍" }), 600);
      } else { clearSel(); }
    }
    function pointFromEvent(e) {
      const t = (e.touches && e.touches[0]) || e;
      const elx = document.elementFromPoint(t.clientX, t.clientY);
      return rcOf(elx);
    }
    gEl.addEventListener("pointerdown", (e) => { selecting = true; clearSel(); addCell(rcOf(e.target)); e.preventDefault(); });
    gEl.addEventListener("pointermove", (e) => { if (selecting) addCell(pointFromEvent(e)); });
    window.addEventListener("pointerup", () => { if (selecting) finishSel(); });
  };

  // Sentence Builder (G2) — tap words to rebuild a sentence
  G.sentenceBuilder = function (ctx, opts) {
    // opts.sentences: [ "The cat sat." ]
    const sents = sample(opts.sentences, Math.min(opts.count || 5, opts.sentences.length));
    let i = 0, score = 0;
    function step() {
      if (i >= sents.length) { ctx.finish({ gameId: opts.gameId, emoji: opts.emoji, score: score, title: "Sentence star! ✍️" }); return; }
      const sentence = sents[i].trim();
      const target = sentence.replace(/[“”"]/g, "").split(/\s+/);
      const card = el("div", "card center");
      card.appendChild(progressDots(sents.length, i));
      card.appendChild(el("p", "lead", "Tap the words in the right order."));
      const listen = el("button", "btn sun", "🔊 Hear it");
      listen.onclick = () => ctx.speak(sentence);
      card.appendChild(listen);
      const line = el("div", "bank"); line.style.minHeight = "52px"; card.appendChild(line);
      const fb = el("div", "feedback"); card.appendChild(fb);
      const pool = el("div", "bank");
      let built = [];
      let order = shuffle(target.map((w, idx) => ({ w, idx })));
      if (order.map((o) => o.w).join(" ") === target.join(" ") && target.length > 1) order = order.reverse();
      order.forEach((o) => {
        const b = el("button", "chip", esc(o.w));
        b.onclick = () => { b.classList.add("used"); built.push({ o, b }); render(); };
        pool.appendChild(b);
      });
      function render() {
        line.innerHTML = "";
        built.forEach((x, k) => { const s = el("button", "chip pick", esc(x.o.w)); s.onclick = () => { x.b.classList.remove("used"); built.splice(k, 1); render(); }; line.appendChild(s); });
      }
      card.appendChild(pool);
      const check = el("button", "btn big kelp", "Check ✓");
      check.onclick = (ev) => {
        if (built.map((x) => x.o.w).join(" ") === target.join(" ")) {
          score += 2; ctx.award(2, ev); ctx.correct();
          ctx.feedback(fb, "Perfect sentence!", true); ctx.speak("Great! " + sentence);
          check.disabled = true; setTimeout(() => { i++; step(); }, 950);
        } else { ctx.wrong(); ctx.feedback(fb, "Almost — try the order again!", false); ctx.speak("Try again"); }
      };
      card.appendChild(check);
      ctx.set(card);
    }
    step();
  };

  // Story Starter / Journal — free writing + read-back
  G.journal = function (ctx, opts) {
    const prompt = pick(opts.prompts);
    const card = el("div", "card");
    card.appendChild(el("h2", null, opts.title || "✍️ Story Starter"));
    card.appendChild(el("p", "lead", prompt));
    const listen = el("button", "btn sun", "🔊 Hear the prompt");
    listen.onclick = () => ctx.speak(prompt);
    card.appendChild(listen);
    card.appendChild(el("div", "spacer"));
    const ta = el("textarea", "answer-input");
    ta.placeholder = "Write here...";
    card.appendChild(ta);
    const fb = el("div", "feedback"); card.appendChild(fb);
    const readBack = el("button", "btn", "🔊 Read my writing");
    readBack.onclick = () => ctx.speak(ta.value || "You haven't written anything yet.");
    const save = el("button", "btn big kelp", "I finished! +3");
    save.onclick = (ev) => {
      if (ta.value.trim().split(/\s+/).filter(Boolean).length < 4) {
        ctx.feedback(fb, "Write a little more first — you can do it!", false);
        ctx.speak("Write a little more");
        return;
      }
      ctx.award(3, ev); ctx.correct();
      ctx.confetti();
      ctx.finish({ gameId: opts.gameId, emoji: opts.emoji, score: 3, title: "Wonderful writing! ✍️" });
    };
    const row = el("div", "row"); row.append(readBack, save);
    card.appendChild(row);
    ctx.set(card);
    ctx.speak(prompt);
  };

  // Grammar Reef (G4) — pick the correctly written sentence
  G.grammar = function (ctx, opts) {
    // opts.bank: [{ bad, good }]
    const chosen = sample(opts.bank, Math.min(opts.count || 6, opts.bank.length));
    const items = chosen.map((s) => {
      const noPeriod = s.good.replace(/[.?!]$/, "");
      const noCap = s.good.charAt(0).toLowerCase() + s.good.slice(1);
      const distractors = [noPeriod, noCap].filter((x) => x !== s.good);
      const choices = shuffle([s.good].concat(sample(distractors.length ? distractors : [s.bad], Math.min(2, Math.max(1, distractors.length)))));
      // ensure at least 3 options
      while (choices.length < 3) choices.push(s.good.toUpperCase());
      return { q: "Which sentence is written correctly?", choices: choices.slice(0, 3), a: 0, _ans: s.good };
    }).map((it) => { it.a = it.choices.indexOf(it._ans); if (it.a < 0) { it.choices[0] = it._ans; it.a = 0; } return it; });
    mcqQuiz(ctx, { gameId: opts.gameId, emoji: opts.emoji, items: items, pointsEach: 2, doneTitle: "Grammar guru! ✍️" });
  };

  // Math facts / number line / word problems via numeric keypad
  G.mathFacts = function (ctx, opts) {
    const items = genMath(opts.mode, opts.count || 8);
    numQuiz(ctx, { gameId: opts.gameId, emoji: opts.emoji, items: items, pointsEach: opts.pointsEach || 2 });
  };

  G.numberLine = function (ctx, opts) {
    // count-back within 20
    const items = [];
    for (let k = 0; k < (opts.count || 6); k++) {
      const start = 8 + rand(13); // 8..20
      const back = 1 + rand(Math.min(9, start));
      const line = el("div", "story"); line.style.textAlign = "center";
      let s = "";
      for (let n = 0; n <= start; n++) s += (n === start - back ? "〈" + n + "〉" : n) + (n < start ? " – " : "");
      line.textContent = "0 … " + start;
      items.push({ q: start + " − " + back + " = ?", a: start - back, pre: (function () { const d = el("p", "lead"); d.textContent = "Start at " + start + " and count back " + back + "."; return d; })() });
    }
    numQuiz(ctx, { gameId: opts.gameId, emoji: opts.emoji, items: items, pointsEach: 2 });
  };

  G.wordProblems = function (ctx, opts) {
    const chosen = sample(opts.bank, Math.min(opts.count || 6, opts.bank.length));
    const items = chosen.map((p) => ({ q: p.t, a: p.a, pre: (function () { const b = el("button", "btn sun"); b.textContent = "🔊 Read the problem"; b.onclick = () => ctx.speak(p.t); return b; })() }));
    numQuiz(ctx, { gameId: opts.gameId, emoji: opts.emoji, items: items, pointsEach: 3 });
  };

  R.G = G;
  R.progressDots = progressDots;
  R.pickWeek = function (weeks, todayISO) {
    // choose the week whose start is the latest start <= today; else first
    const today = todayISO || null;
    let best = weeks[0];
    for (const w of weeks) { if (!today || w.start <= today) best = w; }
    return best;
  };
})();
