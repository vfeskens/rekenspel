class WinScene extends Phaser.Scene {
  constructor() {
    super('Win');
  }

  init(data) {
    this.aantalAppels = (data && data.aantalAppels) || 0;
  }

  create() {
    const b = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(0, 0, b, h, 0x1a2a4a).setOrigin(0, 0);
    this.add.rectangle(0, 0, b, h / 2, 0x2a3a6a).setOrigin(0, 0);

    for (let i = 0; i < 50; i++) {
      const ster = this.add.image(
        Phaser.Math.Between(0, b),
        Phaser.Math.Between(0, h * 0.6),
        'ster',
      ).setScale(Phaser.Math.FloatBetween(0.6, 1.2));
      ster.setAlpha(Phaser.Math.FloatBetween(0.5, 1));
      this.tweens.add({
        targets: ster,
        alpha: { from: 0.3, to: 1 },
        duration: Phaser.Math.Between(800, 2000),
        yoyo: true,
        repeat: -1,
      });
    }

    this.add.image(b - 90, 90, 'maan').setScale(1);

    this.add.image(-20, h - 60, 'heuvel').setOrigin(0, 1).setScale(1.1).setAlpha(0.5).setTint(0x3a5060);
    this.add.image(b - 220, h - 60, 'heuvel').setOrigin(0, 1).setScale(1.1).setAlpha(0.5).setTint(0x3a5060);

    this.add.rectangle(0, h - 50, b, 50, 0x1a3a1a).setOrigin(0, 0);
    this.add.rectangle(0, h - 50, b, 4, 0x3a6a2a).setOrigin(0, 0);

    this.add.image(b / 2 - 50, h - 50, 'huisje').setOrigin(0.5, 1).setScale(1.0);

    this.roeltje = this.add.image(b / 2 + 70, h - 50, 'roeltje-idle').setOrigin(0.5, 1).setScale(1.3);
    this.tweens.add({
      targets: this.roeltje,
      y: h - 57,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });

    this.add.text(b / 2, 90, 'Roeltje is veilig thuis!', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '46px',
      fontStyle: 'bold',
      color: '#ffee66',
      stroke: '#2b1a10',
      strokeThickness: 7,
    }).setOrigin(0.5);

    const teltekst = this.aantalAppels === 1
      ? 'Je hebt 1 appel verzameld!'
      : `Je hebt ${this.aantalAppels} appels verzameld!`;

    this.add.text(b / 2, 160, teltekst, {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '30px',
      color: '#ffffff',
      stroke: '#2b1a10',
      strokeThickness: 4,
    }).setOrigin(0.5);

    const max = Math.min(this.aantalAppels, 10);
    for (let i = 0; i < max; i++) {
      const appel = this.add.image(
        b / 2 - (max - 1) * 24 + i * 48,
        215,
        'appel',
      ).setScale(1.4);
      this.tweens.add({
        targets: appel,
        y: 205,
        duration: 600 + i * 60,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    }

    this.maakKnop(180, h - 100, 'Nog een keer!', () => {
      this.scene.start('Menu');
    });
  }

  maakKnop(x, y, tekst, callback) {
    const knop = this.add.rectangle(x, y, 280, 70, 0xff8040)
      .setStrokeStyle(6, 0x2b1a10)
      .setInteractive({ useHandCursor: true });
    this.add.rectangle(x, y - 25, 260, 10, 0xffb060);
    this.add.text(x, y, tekst, {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#2b1a10',
    }).setOrigin(0.5);

    knop.on('pointerover', () => knop.setScale(1.05));
    knop.on('pointerout', () => knop.setScale(1));
    knop.on('pointerdown', callback);
  }
}
