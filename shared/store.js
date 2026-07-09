/* Reef School — on-device progress (localStorage). No accounts, no network. */
(function () {
  function Store(playerKey) {
    this.key = "reef-" + playerKey;
    this.data = this._load();
  }

  Store.prototype._blank = function () {
    return {
      points: 0,          // gems (bear) or pearls (bizzy)
      stars: 0,           // star-chart stars earned
      creatures: [],      // unlocked sea-creature emojis
      plays: {},          // per-game play counts
      best: {},           // per-game best scores
      correct: 0,         // lifetime correct answers
      answered: 0,        // lifetime answered
      lastPlayed: null,
      settings: { speak: true, sound: true },
    };
  };

  Store.prototype._load = function () {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return this._blank();
      const d = JSON.parse(raw);
      return Object.assign(this._blank(), d);
    } catch (e) {
      return this._blank();
    }
  };

  Store.prototype.save = function () {
    try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (e) {}
  };

  Store.prototype.addPoints = function (n) {
    this.data.points += n;
    // Every 10 points earns a star; every star may unlock a creature.
    const newStars = Math.floor(this.data.points / 10);
    if (newStars > this.data.stars) this.data.stars = newStars;
    this.save();
    return this.data.points;
  };

  Store.prototype.recordAnswer = function (correct) {
    this.data.answered += 1;
    if (correct) this.data.correct += 1;
    this.save();
  };

  Store.prototype.recordPlay = function (gameId, score) {
    this.data.plays[gameId] = (this.data.plays[gameId] || 0) + 1;
    if (score != null && (this.data.best[gameId] == null || score > this.data.best[gameId])) {
      this.data.best[gameId] = score;
    }
    this.data.lastPlayed = gameId;
    this.save();
  };

  Store.prototype.unlockCreature = function (emoji) {
    if (!this.data.creatures.includes(emoji)) {
      this.data.creatures.push(emoji);
      this.save();
      return true;
    }
    return false;
  };

  Store.prototype.setSpeak = function (on) {
    this.data.settings.speak = !!on;
    this.save();
  };

  Store.prototype.setSound = function (on) {
    this.data.settings.sound = !!on;
    this.save();
  };

  window.Store = Store;
})();
