/* Deep Dive — bear's app (Grade 4). Gems 💎 */
(function () {
  const DATA = window.G4_DATA;
  const TODAY = "2026-07-08";
  const defaultWeek = window.Reef.pickWeek(DATA.weeks, TODAY);
  const defaultWeekIndex = DATA.weeks.indexOf(defaultWeek);
  const G = window.Reef.G;

  const games = [
    // Reading / vocabulary
    { id: "word-reef", name: "Word Reef", emoji: "🐚", tag: "reading", sub: "Power words",
      build: (ctx) => G.flashcards(ctx, {
        gameId: "word-reef", emoji: "🐚",
        items: ctx.week.words.map((w) => ({ word: w.w, back: w.t + " — " + w.d })),
        lead: "Read the Power Word, flip for its meaning.",
      }) },
    { id: "meaning-match", name: "Meaning Match", emoji: "🧠", tag: "reading", sub: "Word ↔ meaning",
      build: (ctx) => G.meaningMatch(ctx, { gameId: "meaning-match", emoji: "🧠", words: ctx.week.words }) },
    { id: "passage-dive", name: "Passage Dive", emoji: "📖", tag: "reading", sub: "Read & answer",
      build: (ctx) => G.reading(ctx, {
        gameId: "passage-dive", emoji: "📖",
        title: ctx.week.passage.title, genre: ctx.week.passage.genre,
        paragraphs: ctx.week.passage.text, quiz: ctx.week.passage.quiz,
      }) },
    { id: "fill-gap", name: "Vocab in Context", emoji: "🎣", tag: "reading", sub: "Power word cloze",
      build: (ctx) => G.fillGap(ctx, { gameId: "fill-gap", emoji: "🎣", source: ctx.week.passage.text, words: ctx.week.words.map((w) => w.w) }) },

    // Writing
    { id: "grammar-reef", name: "Grammar Reef", emoji: "✏️", tag: "writing", sub: "Fix it up",
      build: (ctx) => G.grammar(ctx, { gameId: "grammar-reef", emoji: "✏️", bank: DATA.grammar }) },
    { id: "story-starter", name: "Story Starter", emoji: "✍️", tag: "writing", sub: "Write & read back",
      build: (ctx) => G.journal(ctx, {
        gameId: "story-starter", emoji: "✍️", title: "✍️ Creative Journal",
        prompts: [
          "If you could have any superpower for one day, what would it be and what would you do?",
          "Write about a time you tried something new. What happened, and how did you feel?",
          "Describe your perfect day at the ocean, using lots of vivid details.",
          "Invent a brand-new sea creature. What does it look like and what can it do?",
          "If you could talk to any animal, which one and what would you ask?",
        ],
      }) },

    // Spelling
    { id: "spell-it", name: "Spell It", emoji: "🔤", tag: "spelling", sub: "Build the word",
      build: (ctx) => G.spelling(ctx, { gameId: "spell-it", emoji: "🔤", words: ctx.week.words.map((w) => w.w) }) },

    // Math
    { id: "fact-blaster", name: "Fact Blaster", emoji: "⚡", tag: "math", sub: "× and ÷ facts",
      build: (ctx) => G.mathFacts(ctx, { gameId: "fact-blaster", emoji: "⚡", mode: "factmix" }) },
    { id: "math-dive", name: "Math Dive", emoji: "🌊", tag: "math", sub: "This week's focus",
      build: (ctx) => G.mathFacts(ctx, { gameId: "math-dive", emoji: "🌊", mode: ctx.week.math.mode }) },
    { id: "word-problems", name: "Word Problems", emoji: "🐠", tag: "math", sub: "Story math",
      build: (ctx) => G.wordProblems(ctx, { gameId: "word-problems", emoji: "🐠", bank: DATA.wordProblems }) },
    { id: "factor-hunt", name: "Factor Hunt", emoji: "🔦", tag: "math", sub: "Missing factor",
      build: (ctx) => G.factorHunt(ctx, { gameId: "factor-hunt", emoji: "🔦" }) },
    { id: "skip-count", name: "Skip-Count", emoji: "🐾", tag: "math", sub: "Number patterns",
      build: (ctx) => G.skipCount(ctx, { gameId: "skip-count", emoji: "🐾" }) },
    { id: "fraction-match", name: "Fraction Match", emoji: "🥧", tag: "math", sub: "Name the fraction",
      build: (ctx) => G.fractionMatch(ctx, { gameId: "fraction-match", emoji: "🥧" }) },
  ];

  window.Reef.start({
    title: "Deep Dive",
    playerKey: "deepdive",
    pointName: "gems",
    pointEmoji: "💎",
    mascot: "🐬",
    greeting: "Ready to dive deep?",
    weeks: DATA.weeks,
    defaultWeekIndex: defaultWeekIndex,
    focus: (week) => "Week " + week.n + " · Level " + week.level + " · " + week.mathTopic,
    creatures: ["🐋", "🦭", "🪼", "🦞", "🦈", "🐊", "🦦", "🐧", "🦩", "🐢"],
    games: games,
  });
})();
