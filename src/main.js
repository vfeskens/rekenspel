const SPEL_BREEDTE = 960;
const SPEL_HOOGTE = 540;

const config = {
  type: Phaser.AUTO,
  parent: 'spel',
  width: SPEL_BREEDTE,
  height: SPEL_HOOGTE,
  backgroundColor: '#87ceeb',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1400 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MenuScene, GameScene, PuzzleScene, BakScene, WinScene],
};

window.spel = new Phaser.Game(config);

if (typeof Geluid !== 'undefined') {
  fetch('assets/muziek.mp3', { method: 'HEAD' })
    .then((r) => { if (r.ok) Geluid.laadEigenMuziek('assets/muziek.mp3'); })
    .catch(() => {});

  const ontgrendelAudio = () => {
    if (!Geluid.ctx) Geluid.init();
    if (Geluid.ctx && Geluid.ctx.state === 'suspended') {
      Geluid.ctx.resume().catch(() => {});
    }
    if (window.spel && window.spel.sound && typeof window.spel.sound.unlock === 'function') {
      try { window.spel.sound.unlock(); } catch (e) {}
    }
    if (Geluid.muziekActief && Geluid.ctx && Geluid.ctx.state === 'running' && !Geluid._timer) {
      Geluid.muziekStart();
    }
  };
  document.addEventListener('touchstart', ontgrendelAudio, { passive: true });
  document.addEventListener('pointerdown', ontgrendelAudio);
  document.addEventListener('click', ontgrendelAudio);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && Geluid.ctx && Geluid.ctx.state === 'suspended') {
      Geluid.ctx.resume().catch(() => {});
    }
  });
}
