/* Reef School — read-aloud helper (Web Speech API)
   Handles: iOS tap-to-unlock, async voice loading, a global on/off toggle. */
(function () {
  const Speak = {
    enabled: true,
    _voice: null,
    _unlocked: false,
    _ready: false,
  };

  const synth = window.speechSynthesis || null;

  function pickVoice() {
    if (!synth) return;
    const voices = synth.getVoices();
    if (!voices.length) return;
    // Prefer a clear English voice; favor named kid-friendly ones if present.
    const prefer = ["Samantha", "Karen", "Daniel", "Google US English", "Google UK English Female"];
    for (const name of prefer) {
      const v = voices.find((x) => x.name === name);
      if (v) { Speak._voice = v; Speak._ready = true; return; }
    }
    const en = voices.find((v) => /^en(-|_|$)/i.test(v.lang)) || voices[0];
    Speak._voice = en;
    Speak._ready = true;
  }

  if (synth) {
    pickVoice();
    // Voices load asynchronously on many browsers (esp. Chrome).
    synth.onvoiceschanged = pickVoice;
  }

  // iOS/Safari require the first utterance to happen inside a user gesture.
  function unlock() {
    if (Speak._unlocked || !synth) return;
    try {
      const u = new SpeechSynthesisUtterance("");
      u.volume = 0;
      synth.speak(u);
      Speak._unlocked = true;
    } catch (e) { /* ignore */ }
  }
  document.addEventListener("touchend", unlock, { once: true, passive: true });
  document.addEventListener("click", unlock, { once: true });

  Speak.say = function (text, opts) {
    if (!Speak.enabled || !synth || !text) return;
    opts = opts || {};
    try {
      synth.cancel(); // stop anything mid-word
      const u = new SpeechSynthesisUtterance(String(text));
      if (Speak._voice) u.voice = Speak._voice;
      u.rate = opts.rate != null ? opts.rate : 0.92; // a touch slow for young readers
      u.pitch = opts.pitch != null ? opts.pitch : 1.05;
      u.volume = 1;
      synth.speak(u);
    } catch (e) { /* ignore */ }
  };

  Speak.stop = function () { if (synth) try { synth.cancel(); } catch (e) {} };

  Speak.toggle = function (on) {
    Speak.enabled = on == null ? !Speak.enabled : !!on;
    if (!Speak.enabled) Speak.stop();
    return Speak.enabled;
  };

  Speak.available = !!synth;

  window.Speak = Speak;
})();
