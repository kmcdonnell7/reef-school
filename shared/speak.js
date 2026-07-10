/* Reef School — read-aloud helper (Web Speech API).
   Two paths:
     Speak.say(text)   — AUTO read; only speaks when auto-read is turned on (off by default).
     Speak.force(text) — MANUAL read; always speaks (used by "Say it" / "Hear it" buttons).
   Handles iOS tap-to-unlock and async voice loading. */
(function () {
  const Speak = { auto: false, available: false, _voice: null, _unlocked: false };
  const synth = window.speechSynthesis || null;

  function pickVoice() {
    if (!synth) return;
    const voices = synth.getVoices();
    if (!voices.length) return;
    const prefer = ["Samantha", "Karen", "Daniel", "Google US English", "Google UK English Female"];
    for (const name of prefer) {
      const v = voices.find((x) => x.name === name);
      if (v) { Speak._voice = v; return; }
    }
    Speak._voice = voices.find((v) => /^en(-|_|$)/i.test(v.lang)) || voices[0];
  }

  if (synth) { pickVoice(); synth.onvoiceschanged = pickVoice; }

  function unlock() {
    if (Speak._unlocked || !synth) return;
    try { const u = new SpeechSynthesisUtterance(""); u.volume = 0; synth.speak(u); Speak._unlocked = true; } catch (e) {}
  }
  document.addEventListener("touchend", unlock, { once: true, passive: true });
  document.addEventListener("click", unlock, { once: true });

  function speakNow(text, opts) {
    if (!synth || !text) return;
    opts = opts || {};
    try {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      if (Speak._voice) u.voice = Speak._voice;
      u.rate = opts.rate != null ? opts.rate : 0.92;
      u.pitch = opts.pitch != null ? opts.pitch : 1.05;
      u.volume = 1;
      synth.speak(u);
    } catch (e) {}
  }

  Speak.force = function (text, opts) { speakNow(text, opts); };            // always
  Speak.say = function (text, opts) { if (Speak.auto) speakNow(text, opts); }; // only if auto-read on
  Speak.stop = function () { if (synth) try { synth.cancel(); } catch (e) {} };
  Speak.setAuto = function (on) { Speak.auto = on == null ? !Speak.auto : !!on; if (!Speak.auto) Speak.stop(); return Speak.auto; };
  Speak.toggle = Speak.setAuto; // backward-compat alias
  Speak.available = !!synth;

  window.Speak = Speak;
})();
