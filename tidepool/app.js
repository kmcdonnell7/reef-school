/* Tide Pool — bizzy's app (Grade 2). Pearls 🫧 */
(function () {
  const DATA = window.G2_DATA;
  const TODAY = "2026-07-08"; // curriculum-anchored "current week"; harmless if in the past
  const week = window.Reef.pickWeek(DATA.weeks, TODAY);
  const G = window.Reef.G;

  function sentenceFor(word) {
    const lc = word.toLowerCase();
    const line = week.story.lines.find((l) => l.toLowerCase().split(/\W+/).includes(lc));
    return line ? line.replace(/[“”"]/g, "") : "I can read “" + word + "”!";
  }

  const games = [
    // Reading
    { id: "word-reef", name: "Word Reef", emoji: "🐚", tag: "reading", sub: "Sight words",
      build: (ctx) => G.flashcards(ctx, {
        gameId: "word-reef", emoji: "🐚",
        items: week.words.map((w) => ({ word: w, back: sentenceFor(w) })),
        lead: "Read this week's heart word, then flip!",
      }) },
    { id: "word-hunt", name: "Word Hunt", emoji: "🔍", tag: "reading", sub: "Word search",
      build: (ctx) => G.wordSearch(ctx, { gameId: "word-hunt", emoji: "🔍", words: week.story.find }) },
    { id: "story-cove", name: "Story Cove", emoji: "📖", tag: "reading", sub: "Read a story",
      build: (ctx) => G.reading(ctx, {
        gameId: "story-cove", emoji: "📖",
        title: week.story.title, genre: null,
        paragraphs: week.story.lines, quiz: week.story.quiz,
      }) },
    { id: "fill-gap", name: "Fill the Gap", emoji: "🎣", tag: "reading", sub: "Pick the word",
      build: (ctx) => G.fillGap(ctx, { gameId: "fill-gap", emoji: "🎣", source: week.story.lines, words: week.words }) },

    // Writing
    { id: "sentence-builder", name: "Sentence Builder", emoji: "🧩", tag: "writing", sub: "Tap to build",
      build: (ctx) => G.sentenceBuilder(ctx, { gameId: "sentence-builder", emoji: "🧩", sentences: week.story.lines }) },
    { id: "story-starter", name: "Story Starter", emoji: "✍️", tag: "writing", sub: "Write & read back",
      build: (ctx) => G.journal(ctx, {
        gameId: "story-starter", emoji: "✍️", title: "✍️ Story Starter",
        prompts: [
          "One day, I opened my book and saw…",
          "If I could visit the sea, I would…",
          "My favorite animal is… because…",
          "The best day ever would be…",
          "If I found a treasure chest, inside would be…",
        ],
      }) },

    // Spelling
    { id: "spell-it", name: "Spell It", emoji: "🔤", tag: "spelling", sub: "Build the word",
      build: (ctx) => G.spelling(ctx, { gameId: "spell-it", emoji: "🔤", words: week.words }) },

    // Math
    { id: "bubble-pop", name: "Bubble Pop", emoji: "🫧", tag: "math", sub: "Take away",
      build: (ctx) => G.mathFacts(ctx, { gameId: "bubble-pop", emoji: "🫧", mode: week.math.mode }) },
    { id: "number-line", name: "Number-Line Dive", emoji: "🐟", tag: "math", sub: "Count back",
      build: (ctx) => G.numberLine(ctx, { gameId: "number-line", emoji: "🐟" }) },
    { id: "race-zero", name: "Race to Zero", emoji: "🏁", tag: "math", sub: "Dive to 0",
      build: (ctx) => G.raceToZero(ctx, { gameId: "race-zero", emoji: "🏁" }) },
  ];

  window.Reef.start({
    title: "Tide Pool",
    playerKey: "tidepool",
    pointName: "pearls",
    pointEmoji: "🫧",
    mascot: "🐠",
    greeting: "Hi! Ready to splash?",
    focus: "This week: Level " + week.level + " · " + week.mathFocus,
    creatures: ["🐠", "🦀", "🐢", "🐙", "🦐", "🐡", "🐬", "🐳", "🦑", "🦈"],
    games: games,
  });
})();
