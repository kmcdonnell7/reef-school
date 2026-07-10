/* Reef School — Grade 1 content (Theo's app). Source: Getting Ready for 1st Grade
   Summer Reading Pack. Reading / phonics / writing (no math). */
window.G1_DATA = {
  grade: 1,

  // word -> emoji, for the picture-matching game (only words with a clear picture)
  picMap: {
    cat: "🐱", dog: "🐶", pig: "🐷", cow: "🐮", hen: "🐔", fox: "🦊", frog: "🐸", duck: "🦆",
    fish: "🐟", bug: "🐛", bee: "🐝", bat: "🦇", rat: "🐭", ant: "🐜", owl: "🦉",
    sun: "☀️", bun: "🍞", van: "🚐", pan: "🍳", fan: "🪭", bed: "🛏️", bell: "🔔", shell: "🐚",
    mop: "🧹", hat: "🎩", sled: "🛷", ball: "⚽", bike: "🚲", cake: "🍰", milk: "🥛", corn: "🌽",
    pear: "🍐", egg: "🥚", ham: "🍖", jam: "🫙", star: "⭐", tree: "🌳", apple: "🍎", hand: "✋",
    book: "📖", key: "🔑", cup: "☕", box: "📦", car: "🚗", bus: "🚌",
  },

  // themed word lists (from the pack's word searches) for Word Hunt
  themes: {
    animals: ["fish", "frog", "duck", "cat", "dog", "pig", "cow", "hen", "fox", "bug"],
    summer: ["swim", "sand", "pool", "play", "ball", "bike", "trip", "sun", "fun", "hat"],
    colors: ["green", "black", "white", "brown", "blue", "pink", "gold", "red"],
    food: ["cake", "milk", "corn", "pear", "plum", "fish", "egg", "ham", "jam", "bun"],
  },

  weeks: [
    { n: 1, start: "2026-07-10", level: "C", family: { ending: "at", words: ["cat", "hat", "mat", "sat", "bat", "rat"] },
      sight: ["the", "I", "a", "see", "look", "go", "we", "can", "up", "to", "is", "it"],
      story: { title: "I Can See",
        lines: ["I see a cat.", "I see a bat.", "I see a big rat!", "Look! A cat and a bat.", "Can we go? We can go.", "I like the cats."],
        find: ["see", "cat", "bat", "big", "look", "can"],
        quiz: [
          { q: "What did I see first?", choices: ["A cat", "A dog", "A pig"], a: 0 },
          { q: "What is big?", choices: ["The rat", "The cat", "The bat"], a: 0 },
        ] } },

    { n: 2, start: "2026-07-17", level: "C–D", family: { ending: "an", words: ["can", "man", "pan", "ran", "fan", "van"] },
      sight: ["and", "my", "me", "he", "she", "on", "in", "at", "big", "red", "run", "am"],
      story: { title: "The Big Van",
        lines: ["I am in the van.", "My mom is in the van.", "We can go, go, go!", "A man ran to the van.", "The man is my dad!", "We go in the big red van."],
        find: ["van", "can", "man", "ran", "big", "red"],
        quiz: [
          { q: "Who ran to the van?", choices: ["Dad", "Mom", "A cat"], a: 0 },
          { q: "What color is the van?", choices: ["Red", "Blue", "Green"], a: 0 },
        ] } },

    { n: 3, start: "2026-07-24", level: "D", family: { ending: "ig", words: ["big", "dig", "pig", "wig", "fig", "jig"] },
      sight: ["come", "here", "said", "you", "play", "for", "help", "one", "two", "three", "jump"],
      story: { title: "Come and Play",
        lines: ["Come and play with me!", "I can jump. You can jump.", "We jump, jump, jump!", "See the big pig dig.", "The pig can dig for a fig.", "Come here! Come and play."],
        find: ["come", "play", "jump", "here", "pig", "dig"],
        quiz: [
          { q: "What can the pig do?", choices: ["Dig", "Swim", "Fly"], a: 0 },
          { q: "What does the pig dig for?", choices: ["A fig", "A wig", "A hat"], a: 0 },
        ] } },

    { n: 4, start: "2026-07-31", level: "D–E", family: { ending: "op", words: ["top", "hop", "mop", "pop", "cop", "stop"] },
      sight: ["are", "all", "was", "they", "this", "that", "with", "not", "but", "get", "yes", "did"],
      story: { title: "Hop and Stop",
        lines: ["This is my top.", "I can hop with my top.", "Hop, hop, hop!", "But now I stop.", "That was fun!", "Did you see me hop? Yes!"],
        find: ["this", "that", "hop", "top", "stop", "did"],
        quiz: [
          { q: "What can I do with my top?", choices: ["Hop", "Eat", "Sleep"], a: 0 },
          { q: "What do I do after I hop?", choices: ["Stop", "Run", "Cry"], a: 0 },
        ] } },

    { n: 5, start: "2026-08-07", level: "E", family: { ending: "un", words: ["sun", "run", "fun", "bun", "nun", "spun"] },
      sight: ["like", "have", "do", "went", "saw", "new", "now", "out", "our", "ride", "good", "will"],
      story: { title: "Fun in the Sun",
        lines: ["I like the sun.", "We run in the sun.", "Run, run, run — so much fun!", "I saw a bug on a bun.", "Now we ride our bikes.", "It is a good, fun day!"],
        find: ["like", "sun", "run", "fun", "saw", "ride"],
        quiz: [
          { q: "Where do we run?", choices: ["In the sun", "In the rain", "In bed"], a: 0 },
          { q: "What was on the bun?", choices: ["A bug", "A cat", "A fig"], a: 0 },
        ] } },

    { n: 6, start: "2026-08-14", level: "E", family: { ending: "ed", words: ["bed", "red", "fed", "led", "wed", "sled"] },
      sight: ["what", "where", "who", "want", "well", "must", "ran", "came", "into", "please", "soon"],
      story: { title: "Where is Ted?",
        lines: ["Where is my dog Ted?", "I want to find Ted.", "Ted ran into the bed!", "Ted is red. Soon he came out.", "“Come here, Ted!” I said.", "Now Ted is a good dog."],
        find: ["where", "want", "ran", "into", "came", "bed"],
        quiz: [
          { q: "What is the dog's name?", choices: ["Ted", "Sam", "Rex"], a: 0 },
          { q: "Where did Ted hide?", choices: ["In the bed", "In the van", "Under the sun"], a: 0 },
          { q: "What color is Ted?", choices: ["Red", "Blue", "Black"], a: 0 },
        ] } },

    { n: 7, start: "2026-08-21", level: "E–F", family: { ending: "ell", words: ["bell", "tell", "well", "fell", "sell", "shell"] },
      sight: ["be", "no", "so", "too", "under", "ate", "eat", "four", "black", "white", "brown"],
      story: { title: "The Big Bell",
        lines: ["I have a big bell.", "I can ring the bell.", "Ring! The bell can tell us to eat.", "We ate too much!", "The bell is by the well.", "I will ring the bell four times."],
        find: ["bell", "tell", "well", "eat", "too", "four"],
        quiz: [
          { q: "What does the bell tell us?", choices: ["To eat", "To sleep", "To run"], a: 0 },
          { q: "Where is the bell?", choices: ["By the well", "In the bed", "On the mat"], a: 0 },
          { q: "How many times will I ring it?", choices: ["Four", "Two", "Ten"], a: 0 },
        ] } },

    { n: 8, start: "2026-08-28", level: "F", family: { ending: "ash", words: ["cash", "dash", "mash", "rash", "trash", "splash"] },
      sight: ["away", "blue", "down", "find", "funny", "little", "make", "yellow", "pretty", "say", "there"],
      story: { title: "The Big Splash",
        lines: ["We go to the pond.", "Splash! I make a big splash.", "The fish swim away.", "“Look, a funny frog!” I say.", "The frog is little.", "Down it hops with a splash!"],
        find: ["splash", "make", "fish", "away", "funny", "little"],
        quiz: [
          { q: "What did I make in the pond?", choices: ["A big splash", "A cake", "A bell"], a: 0 },
          { q: "How is the frog?", choices: ["Little", "Big", "Red"], a: 0 },
          { q: "What did the fish do?", choices: ["Swim away", "Jump", "Sleep"], a: 0 },
        ] } },
  ],
};
