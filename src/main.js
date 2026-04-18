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
}
