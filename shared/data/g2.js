/* Reef School — Grade 2 content (bizzy's Tide Pool). Source: Summer Learning Pack Book Two. */
window.G2_DATA = {
  grade: 2,
  // 90 heart words in 6 sets of 15, + 10 stretch words
  heartSets: {
    1: ["the","I","a","said","to","do","of","see","he","be","me","from","look","book","are"],
    2: ["was","you","what","have","your","want","go","no","so","goes","says","she","we","they","their"],
    3: ["were","talk","walk","could","would","should","or","for","there","where","who","by","my","one","once"],
    4: ["two","does","any","many","been","into","friend","because","woman","women","move","both","four","fourth","forty"],
    5: ["people","pretty","nothing","other","another","mother","brother","father","water","very","today","above","among","again","against"],
    6: ["always","almost","door","poor","floor","won","son","month","hour","minute","Monday","Wednesday","February","eye","heart"],
  },
  stretch: ["about","answer","honest","honor","truth","truly","build","built","sure","laugh"],

  weeks: [
    { n:1, start:"2026-06-29", level:"G",
      words:["the","I","a","said","to","do","of","see","he","be","me","from","look","book","are"],
      mathFocus:"Counting back from 20; subtraction within 10", math:{ mode:"sub", max:10 },
      story:{ title:"Look at My Book",
        lines:["I have a book.","The book is from my dad.","“Look at the cat!” I said.","I can see a big cat.","The cat said, “Mew!”","I like to read to the cat.","We are so happy."],
        find:["the","I","said","see","from","look","book","are"],
        quiz:[
          { q:"Who gave the book?", choices:["Dad","Mom","Grandma"], a:0 },
          { q:"What animal is in the story?", choices:["A cat","A dog","A fish"], a:0 },
          { q:"What did the cat say?", choices:["“Mew!”","“Woof!”","“Hello!”"], a:0 },
        ] } },

    { n:2, start:"2026-07-06", level:"G–H",
      words:["was","you","what","have","your","want","go","no","so","goes","says","she","we","they","their"],
      mathFocus:"Number lines & ten-frames; subtraction within 10", math:{ mode:"sub", max:10 },
      story:{ title:"The Trip",
        lines:["“Do you want to go to the park?” Mom says.","“Yes!” we say.","She goes to get her hat.","“What do you have?” I ask.","“I have a ball,” says my sister.","They put on their shoes.","We are so glad to go!"],
        find:["you","want","what","says","she","goes","they","their"],
        quiz:[
          { q:"Where do they want to go?", choices:["The park","The zoo","School"], a:0 },
          { q:"What does the sister have?", choices:["A ball","A hat","A dog"], a:0 },
          { q:"Who gets a hat?", choices:["Mom","The sister","The dog"], a:0 },
        ] } },

    { n:3, start:"2026-07-13", level:"H",
      words:["were","talk","walk","could","would","should","or","for","there","where","who","by","my","one","once"],
      mathFocus:"Subtraction within 20; the count-back strategy", math:{ mode:"sub", max:20 },
      story:{ title:"The Lost Cat",
        lines:["Once there was a little cat.","“Where could she be?” said my mom.","We went for a walk to look.","“Should we go left or right?” I said.","Then, by a big tree, we saw her!","“There she is!”","Who was so happy? We were!"],
        find:["once","there","where","could","would","walk","who","were"],
        quiz:[
          { q:"What was lost?", choices:["A cat","A dog","A book"], a:0 },
          { q:"Where did they find the cat?", choices:["By a big tree","At the park","Under a bed"], a:0 },
          { q:"Were they happy or sad at the end?", choices:["Happy","Sad","Angry"], a:0 },
        ] } },

    { n:4, start:"2026-07-20", level:"H–I",
      words:["two","does","any","many","been","into","friend","because","woman","women","move","both","four","fourth","forty"],
      mathFocus:"Fact families; missing numbers; doubles", math:{ mode:"missing", max:20 },
      story:{ title:"My Friend Sam",
        lines:["My friend Sam has two dogs.","“Does he have any cats?” I asked.","“No, but he has four fish!”","Both of us like to play.","We have been friends a long time, because we both like to run.","Today is the fourth of July!"],
        find:["friend","because","two","four","both","into","does","many"],
        quiz:[
          { q:"How many dogs does Sam have?", choices:["Two","Four","One"], a:0 },
          { q:"How many fish does Sam have?", choices:["Four","Two","Three"], a:0 },
          { q:"Why are they friends?", choices:["They both like to run","They live together","They are cousins"], a:0 },
        ] } },

    { n:5, start:"2026-07-27", level:"I",
      words:["people","pretty","nothing","other","another","mother","brother","father","water","very","today","above","among","again","against"],
      mathFocus:"Counting back by 1s & 10s to 100; fluency within 20", math:{ mode:"sub", max:20 },
      story:{ title:"A Day at the Lake",
        lines:["Today my mother, father, and brother went to the lake.","The water was very pretty.","“Look above!” said my brother.","A bird flew among the trees.","Other people were there too.","“Can we come again?” I asked.","“Yes!” said my mother.","Nothing is better than the lake!"],
        find:["mother","father","brother","water","people","pretty","above","again"],
        quiz:[
          { q:"Who went to the lake?", choices:["Mother, father, and brother","Just me","Some friends"], a:0 },
          { q:"What flew above them?", choices:["A bird","A plane","A kite"], a:0 },
          { q:"Did they want to come again?", choices:["Yes","No","Maybe"], a:0 },
        ] } },

    { n:6, start:"2026-08-03", level:"I–J",
      words:["always","almost","door","poor","floor","won","son","month","hour","minute","Monday","Wednesday","February","eye","heart"],
      mathFocus:"2-digit subtraction, no regrouping; mixed review", math:{ mode:"sub2", max:99 },
      story:{ title:"The Big Race",
        lines:["On Monday, my son ran in a race.","He almost won!","It took him one hour to get ready.","“Wait a minute,” he said at the door.","He ran with all his heart.","In one eye, I had a happy tear.","Next month, on Wednesday, he will race again!"],
        find:["Monday","almost","won","hour","minute","door","heart","Wednesday"],
        quiz:[
          { q:"What day was the race?", choices:["Monday","Friday","Sunday"], a:0 },
          { q:"Did he win or almost win?", choices:["He almost won","He won","He lost"], a:0 },
          { q:"When will he race again?", choices:["Next month on Wednesday","Tomorrow","Never"], a:0 },
        ] } },

    { n:7, start:"2026-08-24", level:"J · Review 1–3",
      words:["said","from","look","book","what","your","want","goes","says","their","were","would","should","there","once"],
      mathFocus:"Subtraction fluency; word problems", math:{ mode:"sub", max:20 },
      story:{ title:"The Best Book",
        lines:["Once I read a book about a dog.","“Where did the dog go?” you asked.","The dog would run and walk all day.","“Look, there he is!” I said.","We could see him by the tree.","What a good dog!","We were so happy to read it."],
        find:["once","book","where","would","walk","there","look","could"],
        quiz:[
          { q:"What was the book about?", choices:["A dog","A cat","A bird"], a:0 },
          { q:"What did the dog do all day?", choices:["Run and walk","Sleep","Eat"], a:0 },
          { q:"Where did they see him?", choices:["By the tree","In the house","At school"], a:0 },
        ] } },

    { n:8, start:"2026-08-31", level:"J · Review 4–6",
      words:["because","friend","woman","women","fourth","forty","people","pretty","another","brother","against","almost","Wednesday","February","minute"],
      mathFocus:"Mixed subtraction; 2nd-grade preview", math:{ mode:"sub2", max:99 },
      story:{ title:"A Gift for Mother",
        lines:["My brother and I made a gift for our mother.","“Does she know?” I asked.","“No, because it is a surprise!”","We worked for almost an hour.","The water for the paint was on the floor.","“Look out!” said my brother.","We were both happy when she opened the door.","Our mother gave us a hug, right from the heart!"],
        find:["brother","mother","because","almost","water","floor","both","door"],
        quiz:[
          { q:"Who made the gift?", choices:["My brother and I","Just me","Dad"], a:0 },
          { q:"What was on the floor?", choices:["The water for the paint","A toy","A book"], a:0 },
          { q:"How did mother feel?", choices:["Happy","Sad","Angry"], a:0 },
        ] } },
  ],
};
