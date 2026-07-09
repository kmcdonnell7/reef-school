/* Deep Dive — bear's app (Grade 4). Gems 💎 */
(function () {
  const DATA = window.G4_DATA;
  const TODAY = "2026-07-08";
  const week = window.Reef.pickWeek(DATA.weeks, TODAY);
  const G = window.Reef.G;

  const games = [
    // Reading / vocabulary
    { id: "word-reef", name: "Word Reef", emoji: "🐚", tag: "reading", sub: "Power words",
      build: (ctx) => G.flashcards(ctx, {
        gameId: "word-reef", emoji: "🐚",
        items: week.words.map((w) => ({ word: w.w, back: w.t + " — " + w.d })),
        lead: "Read the Power Word, flip for its meaning.",
      }) },
    { id: "meaning-match", name: "Meaning Match", emoji: "🧠", tag: "reading", sub: "Word ↔ meaning",
      build: (ctx) => G.meaningMatch(ctx, { gameId: "meaning-match", emoji: "🧠", words: week.words }) },
    { id: "passage-dive", name: "Passage Dive", emoji: "📖", tag: "reading", sub: "Read & answer",
      build: (ctx) => G.reading(ctx, {
        gameId: "passage-dive", emoji: "📖",
        title: week.passage.title, genre: week.passage.genre,
        paragraphs: week.passage.text, quiz: week.passage.quiz,
      }) },

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
      build: (ctx) => G.spelling(ctx, { gameId: "spell-it", emoji: "🔤", words: week.words.map((w) => w.w) }) },

    // Math
    { id: "fact-blaster", name: "Fact Blaster", emoji: "⚡", tag: "math", sub: "× and ÷ facts",
      build: (ctx) => G.mathFacts(ctx, { gameId: "fact-blaster", emoji: "⚡", mode: "factmix" }) },
    { id: "math-dive", name: "Math Dive", emoji: "🌊", tag: "math", sub: week.mathTopic,
      build: (ctx) => G.mathFacts(ctx, { gameId: "math-dive", emoji: "🌊", mode: week.math.mode }) },
    { id: "word-problems", name: "Word Problems", emoji: "🐠", tag: "math", sub: "Story math",
      build: (ctx) => G.wordProblems(ctx, { gameId: "word-problems", emoji: "🐠", bank: DATA.wordProblems }) },
  ];

  window.Reef.start({
    title: "Deep Dive",
    playerKey: "deepdive",
    pointName: "gems",
    pointEmoji: "💎",
    creatures: ["🐋", "🦭", "🪼", "🦞", "🦈", "🐊", "🦦", "🐧", "🦩", "🐢"],
    games: games,
  });
})();
