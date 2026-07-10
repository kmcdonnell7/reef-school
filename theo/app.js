/* Reef Craft — Theo's app (Grade 1). Minecraft ocean theme. Emeralds 🟩.
   Two modes selected by window.THEO_MODE ('play' = pictures, 'read' = words).
   Both modes share progress (playerKey "theo"). */
(function () {
  const DATA = window.G1_DATA;
  const MODE = window.THEO_MODE === "read" ? "read" : "play";
  const TODAY = "2026-07-12"; // anchors the "current week"; bump each summer
  const defaultWeek = window.Reef.pickWeek(DATA.weeks, TODAY);
  const defaultWeekIndex = DATA.weeks.indexOf(defaultWeek);
  const G = window.Reef.G;

  function sentenceFor(word, week) {
    const lc = word.toLowerCase();
    const line = week.story.lines.find((l) => l.toLowerCase().split(/\W+/).includes(lc));
    return line ? line.replace(/[“”"]/g, "") : "You read “" + word + "”! ⭐";
  }

  // Blocky creeper mascot (pixel SVG)
  function creeperSVG() {
    const cell = 10;
    const dark = [[1,1],[2,1],[5,1],[6,1],[1,2],[2,2],[5,2],[6,2],[3,3],[4,3],[2,4],[3,4],[4,4],[5,4],[2,5],[3,5],[4,5],[5,5],[2,6],[5,6]];
    const tex = [[0,0,"#6cb84a"],[7,2,"#4e9433"],[0,5,"#4e9433"],[7,6,"#6cb84a"],[6,4,"#4e9433"],[1,7,"#6cb84a"],[7,0,"#4e9433"]];
    let r = "<rect width='80' height='80' rx='4' fill='#5aa83c'/>";
    tex.forEach((t) => (r += "<rect x='" + (t[0]*cell) + "' y='" + (t[1]*cell) + "' width='10' height='10' fill='" + t[2] + "'/>"));
    dark.forEach((d) => (r += "<rect x='" + (d[0]*cell) + "' y='" + (d[1]*cell) + "' width='10' height='10' fill='#2f3b1f'/>"));
    return "<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'>" + r + "</svg>";
  }

  const picPool = (week) => week.family.words.concat(DATA.themes.animals, DATA.themes.food);

  // ---- game rosters per mode ----
  const playGames = [
    { id: "pic-match", name: "Word Match", emoji: "🖼️", tag: "reading", sub: "Read & find",
      build: (ctx) => G.pictureMatch(ctx, { gameId: "pic-match", emoji: "🖼️", map: DATA.picMap, pool: picPool(ctx.week), count: 3, showText: true }) },
    { id: "sight-pop", name: "Word Blocks", emoji: "🟦", tag: "reading", sub: "Hear & read",
      build: (ctx) => G.flashcards(ctx, {
        gameId: "sight-pop", emoji: "🟦", count: 3,
        items: ctx.week.sight.map((w) => ({ word: w, back: "You read “" + w + "”! ⭐" })),
        lead: "Tap 🔊, then read the word!",
      }) },
    { id: "sound-build", name: "Sound Mine", emoji: "⛏️", tag: "spelling", sub: "Build the word",
      build: (ctx) => G.soundBuild(ctx, { gameId: "sound-build", emoji: "⛏️", family: ctx.week.family, count: 3 }) },
    { id: "story-time", name: "Story Time", emoji: "📖", tag: "reading", sub: "Listen & answer",
      build: (ctx) => G.reading(ctx, { gameId: "story-time", emoji: "📖", title: ctx.week.story.title, genre: null, paragraphs: ctx.week.story.lines, quiz: ctx.week.story.quiz }) },
    { id: "trace-it", name: "Trace It", emoji: "✏️", tag: "writing", sub: "Write the word",
      build: (ctx) => G.traceWord(ctx, { gameId: "trace-it", emoji: "✏️", words: ctx.week.family.words, count: 3 }) },
  ];

  const readGames = [
    { id: "sight-reef", name: "Sight Words", emoji: "🟦", tag: "reading", sub: "Flip cards",
      build: (ctx) => G.flashcards(ctx, {
        gameId: "sight-reef", emoji: "🟦", count: 5,
        items: ctx.week.sight.map((w) => ({ word: w, back: sentenceFor(w, ctx.week) })),
        lead: "Read the word, then flip it!",
      }) },
    { id: "word-hunt", name: "Word Hunt", emoji: "🔍", tag: "reading", sub: "Word search",
      build: (ctx) => G.wordSearch(ctx, { gameId: "word-hunt", emoji: "🔍", words: ctx.week.family.words }) },
    { id: "story-cove", name: "Story Cove", emoji: "📖", tag: "reading", sub: "Read & answer",
      build: (ctx) => G.reading(ctx, { gameId: "story-cove", emoji: "📖", title: ctx.week.story.title, genre: null, paragraphs: ctx.week.story.lines, quiz: ctx.week.story.quiz }) },
    { id: "fill-gap", name: "Fill the Gap", emoji: "🎣", tag: "reading", sub: "Pick the word",
      build: (ctx) => G.fillGap(ctx, { gameId: "fill-gap", emoji: "🎣", source: ctx.week.story.lines, words: ctx.week.sight.concat(ctx.week.family.words), count: 5 }) },
    { id: "word-build", name: "Spell It", emoji: "🔤", tag: "spelling", sub: "Build the word",
      build: (ctx) => G.spelling(ctx, { gameId: "word-build", emoji: "🔤", words: ctx.week.family.words, count: 5 }) },
    { id: "sound-build", name: "Sound Mine", emoji: "⛏️", tag: "spelling", sub: "First sound",
      build: (ctx) => G.soundBuild(ctx, { gameId: "sound-build", emoji: "⛏️", family: ctx.week.family, count: 5 }) },
    { id: "sentence-builder", name: "Build a Sentence", emoji: "🧱", tag: "writing", sub: "Tap in order",
      build: (ctx) => G.sentenceBuilder(ctx, { gameId: "sentence-builder", emoji: "🧱", sentences: ctx.week.story.lines, count: 4 }) },
    { id: "story-starter", name: "My Story", emoji: "✍️", tag: "writing", sub: "Write & read back",
      build: (ctx) => G.journal(ctx, { gameId: "story-starter", emoji: "✍️", title: "✍️ My Story",
        prompts: ["I like to play…", "My favorite animal is…", "In Minecraft I would build…", "The best day would be…", "At the beach I saw…"] }) },
  ];

  window.Reef.start({
    title: MODE === "read" ? "Word Explorer" : "Picture Play",
    playerKey: "theo",
    homeUrl: "index.html",
    pointName: "emeralds",
    pointEmoji: "🟩",
    starOne: "diamond", starPlural: "diamonds", starEmoji: "💎", starMark: "💎",
    creatureOne: "mob", creaturePlural: "mobs", creatureIcon: "🐾",
    chartTitle: "Diamond Chest",
    mascot: creeperSVG(),
    greeting: MODE === "read" ? "Let's read, Theo!" : "Let's play, Theo!",
    weeks: DATA.weeks,
    defaultWeekIndex: defaultWeekIndex,
    focus: (week) => "Week " + week.n + " · Level " + week.level + " · family -" + week.family.ending,
    creatures: ["🐺", "🐱", "🦊", "🐷", "🐮", "🐔", "🐑", "🐝", "🐢", "🐠"],
    games: MODE === "read" ? readGames : playGames,
  });
})();
