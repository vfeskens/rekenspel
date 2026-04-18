class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const b = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(0, 0, b, h, 0x87ceeb).setOrigin(0, 0);

    this.add.image(-20, h - 90, 'heuvel').setOrigin(0, 1).setScale(1.1).setAlpha(0.85);
    this.add.image(b - 220, h - 90, 'heuvel').setOrigin(0, 1).setScale(1.2).setAlpha(0.9);

    this.add.image(160, 70, 'wolk').setScale(0.9);
    this.add.image(680, 50, 'wolk').setScale(1.1);
    this.add.image(880, 110, 'wolk').setScale(0.8);

    this.add.rectangle(0, h - 90, b, 90, 0x3a8a2a).setOrigin(0, 0);
    this.add.rectangle(0, h - 90, b, 6, 0x5ec030).setOrigin(0, 0);

    for (let i = 0; i < 4; i++) {
      this.add.image(100 + i * 250, h - 90, 'boom').setOrigin(0.5, 1).setScale(0.7);
    }

    this.add.text(b / 2, 80, 'Roeltje het vosje', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '60px',
      fontStyle: 'bold',
      color: '#ffee66',
      stroke: '#2b1a10',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(b / 2, 140, 'Kies een spelletje!', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '26px',
      color: '#ffffff',
      stroke: '#2b1a10',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.roeltjeImg = this.add.image(b / 2, 240, 'roeltje-idle').setScale(2.2);
    this.tweens.add({
      targets: this.roeltjeImg,
      y: 225,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });

    this.add.image(b / 2 - 110, 245, 'appel').setScale(1.4);
    this.add.image(b / 2 + 110, 245, 'appel').setScale(1.4);

    this.maakKnop(b / 2 - 170, 400, 300, 110, 0xffb060, 'Voor kleine vosjes', 'Tellen tot 10', 'kleuter');
    this.maakKnop(b / 2 + 170, 400, 300, 110, 0xff8040, 'Voor grote vosjes', 'Tafels', 'tafels');

    this.maakGeluidKnoppen();

    if (typeof Geluid !== 'undefined' && Geluid.ctx && Geluid.muziekActief) {
      Geluid.muziekStart();
    }
  }

  maakKnop(x, y, breedte, hoogte, kleur, titel, ondertitel, modus) {
    const knop = this.add.rectangle(x, y, breedte, hoogte, kleur)
      .setStrokeStyle(6, 0x2b1a10)
      .setInteractive({ useHandCursor: true });

    this.add.text(x, y - 18, titel, {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#2b1a10',
    }).setOrigin(0.5);

    this.add.text(x, y + 22, ondertitel, {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '18px',
      color: '#2b1a10',
    }).setOrigin(0.5);

    knop.on('pointerover', () => knop.setScale(1.05));
    knop.on('pointerout', () => knop.setScale(1));
    knop.on('pointerdown', () => {
      if (typeof Geluid !== 'undefined') {
        Geluid.init();
        Geluid.klik();
        if (Geluid.muziekActief) Geluid.muziekStart();
      }
      this.scene.start('Game', { modus });
    });
  }

  maakGeluidKnoppen() {
    if (typeof Geluid === 'undefined') return;
    const b = this.scale.width;

    const maak = (x, label, actief, onClick) => {
      const knop = this.add.rectangle(x, 40, 80, 32, 0xffffff, 0.85)
        .setStrokeStyle(3, 0x2b1a10)
        .setInteractive({ useHandCursor: true });
      const tekst = this.add.text(x, 40, `${label}: ${actief() ? 'aan' : 'uit'}`, {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#2b1a10',
      }).setOrigin(0.5);
      knop.on('pointerdown', () => {
        if (typeof Geluid !== 'undefined') Geluid.init();
        const nieuw = onClick();
        tekst.setText(`${label}: ${nieuw ? 'aan' : 'uit'}`);
      });
    };

    maak(b - 140, 'Muziek', () => Geluid.muziekActief, () => Geluid.toggleMuziek());
    maak(b - 50, 'Geluid', () => Geluid.sfxActief, () => Geluid.toggleSfx());
  }
}
