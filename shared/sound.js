/* Reef School — tiny Web Audio sound effects. No files; tones generated on the fly.
   Unlocked on first gesture (like speech). Honors an on/off toggle. */
(function () {
  const SFX = { enabled: true, _ctx: null };

  function ctx() {
    if (!SFX._ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) SFX._ctx = new AC();
    }
    if (SFX._ctx && SFX._ctx.state === "suspended") SFX._ctx.resume();
    return SFX._ctx;
  }

  function tone(freq, start, dur, type, gain) {
    const c = ctx(); if (!c) return;
    const t0 = c.currentTime + start;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.18, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(c.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }

  function unlock() { const c = ctx(); if (c) { const b = c.createBuffer(1, 1, 22050); const s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0); } }
  document.addEventListener("touchend", unlock, { once: true, passive: true });
  document.addEventListener("click", unlock, { once: true });

  SFX.correct = function () { if (!SFX.enabled) return; tone(660, 0, 0.12, "sine", 0.2); tone(880, 0.09, 0.16, "sine", 0.2); };
  SFX.wrong = function () { if (!SFX.enabled) return; tone(200, 0, 0.18, "triangle", 0.15); tone(150, 0.12, 0.2, "triangle", 0.13); };
  SFX.point = function () { if (!SFX.enabled) return; tone(1046, 0, 0.09, "sine", 0.15); };
  SFX.tap = function () { if (!SFX.enabled) return; tone(520, 0, 0.05, "sine", 0.1); };
  SFX.win = function () {
    if (!SFX.enabled) return;
    const notes = [523, 659, 784, 1046];
    notes.forEach((n, i) => tone(n, i * 0.11, 0.18, "sine", 0.2));
  };
  SFX.toggle = function (on) { SFX.enabled = on == null ? !SFX.enabled : !!on; return SFX.enabled; };

  window.SFX = SFX;
})();
