const Geluid = {
  ctx: null,
  muziekActief: true,
  sfxActief: true,
  _timer: null,
  _volgendeTijd: 0,
  _htmlAudio: null,
  _htmlAudioKlaar: false,

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new Ctx();
    } catch (e) {
      return;
    }
    try {
      const opgeslagen = localStorage.getItem('roeltjeGeluid');
      if (opgeslagen) {
        const p = JSON.parse(opgeslagen);
        this.muziekActief = p.muziek !== false;
        this.sfxActief = p.sfx !== false;
      }
    } catch (e) {}
  },

  _bewaar() {
    try {
      localStorage.setItem('roeltjeGeluid', JSON.stringify({
        muziek: this.muziekActief,
        sfx: this.sfxActief,
      }));
    } catch (e) {}
  },

  toggleMuziek() {
    this.muziekActief = !this.muziekActief;
    if (this.muziekActief) this.muziekStart();
    else this.muziekStop();
    this._bewaar();
    return this.muziekActief;
  },

  toggleSfx() {
    this.sfxActief = !this.sfxActief;
    this._bewaar();
    return this.sfxActief;
  },

  _noot(freq, start, dur, type, volume) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  },

  _glijden(freq1, freq2, start, dur, type, volume) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq1, start);
    osc.frequency.exponentialRampToValueAtTime(Math.max(freq2, 20), start + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  },

  spring() {
    if (!this.sfxActief || !this.ctx) return;
    this._glijden(320, 720, this.ctx.currentTime, 0.13, 'square', 0.08);
  },

  appel() {
    if (!this.sfxActief || !this.ctx) return;
    const t = this.ctx.currentTime;
    this._noot(1320, t, 0.08, 'sine', 0.15);
    this._noot(1760, t + 0.06, 0.14, 'sine', 0.12);
  },

  goed() {
    if (!this.sfxActief || !this.ctx) return;
    const t = this.ctx.currentTime;
    this._noot(523.25, t, 0.1, 'square', 0.1);
    this._noot(659.25, t + 0.1, 0.1, 'square', 0.1);
    this._noot(783.99, t + 0.2, 0.28, 'square', 0.1);
  },

  fout() {
    if (!this.sfxActief || !this.ctx) return;
    this._glijden(300, 160, this.ctx.currentTime, 0.32, 'sawtooth', 0.08);
  },

  beer() {
    if (!this.sfxActief || !this.ctx) return;
    const t = this.ctx.currentTime;
    this._glijden(110, 55, t, 0.7, 'sawtooth', 0.18);
    this._glijden(90, 45, t + 0.1, 0.6, 'sawtooth', 0.12);
  },

  thuis() {
    if (!this.sfxActief || !this.ctx) return;
    const t = this.ctx.currentTime;
    const noten = [523.25, 659.25, 783.99, 1046.5];
    noten.forEach((f, i) => this._noot(f, t + i * 0.12, 0.22, 'square', 0.1));
  },

  klik() {
    if (!this.sfxActief || !this.ctx) return;
    this._noot(900, this.ctx.currentTime, 0.05, 'square', 0.06);
  },

  snurk(volume) {
    if (!this.sfxActief || !this.ctx) return;
    if (volume <= 0.005) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, t);
    osc.frequency.linearRampToValueAtTime(85, t + 0.4);
    osc.frequency.linearRampToValueAtTime(50, t + 0.7);
    osc.frequency.linearRampToValueAtTime(40, t + 1.2);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, t);
    filter.Q.value = 1.5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.45);
    gain.gain.linearRampToValueAtTime(volume * 0.35, t + 0.65);
    gain.gain.linearRampToValueAtTime(volume * 0.7, t + 0.9);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 1.4);
  },

  _melodie: [
    [523.25, 0.22], [659.25, 0.22], [783.99, 0.22], [659.25, 0.22],
    [523.25, 0.22], [659.25, 0.22], [783.99, 0.22], [1046.50, 0.22],

    [880.00, 0.22], [783.99, 0.22], [659.25, 0.22], [523.25, 0.22],
    [587.33, 0.22], [659.25, 0.22], [783.99, 0.44],

    [523.25, 0.22], [587.33, 0.22], [659.25, 0.22], [698.46, 0.22],
    [783.99, 0.22], [880.00, 0.22], [1046.50, 0.22], [880.00, 0.22],

    [783.99, 0.22], [698.46, 0.22], [659.25, 0.22], [587.33, 0.22],
    [659.25, 0.22], [587.33, 0.22], [523.25, 0.44],

    [659.25, 0.22], [659.25, 0.22], [783.99, 0.22], [783.99, 0.22],
    [880.00, 0.22], [880.00, 0.22], [1046.50, 0.44],

    [880.00, 0.22], [783.99, 0.22], [880.00, 0.22], [659.25, 0.22],
    [523.25, 0.22], [659.25, 0.22], [783.99, 0.22], [523.25, 0.22],

    [523.25, 0.66],
  ],

  _bas: [
    [130.81, 0.44], [196.00, 0.44], [130.81, 0.44], [196.00, 0.44],
    [174.61, 0.44], [261.63, 0.44], [174.61, 0.44], [130.81, 0.44],
    [130.81, 0.44], [196.00, 0.44], [130.81, 0.44], [196.00, 0.44],
    [196.00, 0.44], [146.83, 0.44], [196.00, 0.44], [130.81, 0.44],
    [174.61, 0.44], [130.81, 0.44], [174.61, 0.44], [130.81, 0.44],
    [196.00, 0.44], [261.63, 0.44], [196.00, 0.44], [130.81, 0.44],
    [130.81, 0.66],
  ],

  _melIdx: 0,
  _melTijd: 0,
  _basIdx: 0,
  _basTijd: 0,

  muziekStart() {
    if (!this.muziekActief) return;
    if (this._htmlAudioKlaar && this._htmlAudio) {
      this._htmlAudio.play().catch(() => {});
      return;
    }
    if (!this.ctx || this._timer) return;
    const nu = this.ctx.currentTime;
    this._melTijd = nu + 0.1;
    this._basTijd = nu + 0.1;
    this._melIdx = 0;
    this._basIdx = 0;
    this._plan();
    this._timer = setInterval(() => this._plan(), 400);
  },

  muziekStop() {
    if (this._htmlAudio && !this._htmlAudio.paused) {
      this._htmlAudio.pause();
    }
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },

  laadEigenMuziek(pad, volume = 0.35) {
    const audio = new Audio(pad);
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'auto';
    audio.addEventListener('canplaythrough', () => {
      this._htmlAudio = audio;
      this._htmlAudioKlaar = true;
      if (this.muziekActief && this.ctx) {
        this.muziekStop();
        audio.play().catch(() => {});
      }
    }, { once: true });
    audio.addEventListener('error', () => {
      this._htmlAudio = null;
      this._htmlAudioKlaar = false;
    }, { once: true });
    audio.load();
  },

  _plan() {
    if (!this.ctx) return;
    const vooruit = 1.6;
    const nu = this.ctx.currentTime;

    while (this._melTijd < nu + vooruit) {
      const [freq, dur] = this._melodie[this._melIdx];
      this._toet(freq, this._melTijd, dur, 0.08);
      this._melTijd += dur;
      this._melIdx = (this._melIdx + 1) % this._melodie.length;
    }

    while (this._basTijd < nu + vooruit) {
      const [freq, dur] = this._bas[this._basIdx];
      this._pad(freq, this._basTijd, dur, 0.055);
      if (this._basIdx % 2 === 0) {
        this._kick(this._basTijd, 0.09);
      }
      this._basTijd += dur;
      this._basIdx = (this._basIdx + 1) % this._bas.length;
    }
  },

  _toet(freq, start, dur, volume) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    const attack = 0.005;
    const hold = Math.min(dur * 0.6, 0.2);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + attack);
    gain.gain.linearRampToValueAtTime(volume * 0.7, start + hold);
    gain.gain.exponentialRampToValueAtTime(0.0008, start + dur * 0.95);
    osc.start(start);
    osc.stop(start + dur);

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(freq * 2, start);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    gain2.gain.setValueAtTime(0, start);
    gain2.gain.linearRampToValueAtTime(volume * 0.15, start + attack);
    gain2.gain.exponentialRampToValueAtTime(0.0005, start + dur * 0.6);
    osc2.start(start);
    osc2.stop(start + dur);
  },

  _kick(start, volume) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, start);
    osc.frequency.exponentialRampToValueAtTime(40, start + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
    osc.start(start);
    osc.stop(start + 0.2);
  },

  _klok(freq, start, dur, volume) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    const attack = 0.015;
    const decay = Math.max(dur * 1.4, dur + 0.3);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0008, start + decay);
    osc.start(start);
    osc.stop(start + decay + 0.05);

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, start);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    gain2.gain.setValueAtTime(0, start);
    gain2.gain.linearRampToValueAtTime(volume * 0.35, start + attack);
    gain2.gain.exponentialRampToValueAtTime(0.0005, start + decay * 0.7);
    osc2.start(start);
    osc2.stop(start + decay);
  },

  _pad(freq, start, dur, volume) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    const attack = dur * 0.25;
    const release = dur * 0.3;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + attack);
    gain.gain.linearRampToValueAtTime(volume * 0.7, start + dur - release);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  },
};
