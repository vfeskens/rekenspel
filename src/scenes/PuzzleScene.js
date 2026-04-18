class PuzzleScene extends Phaser.Scene {
  constructor() {
    super('Puzzle');
  }

  init(data) {
    this.modus = data.modus;
    this.appel = data.appel;
  }

  create() {
    const b = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(0, 0, b, h, 0x000000, 0.55)
      .setOrigin(0, 0)
      .setInteractive();

    this.add.rectangle(b / 2, h / 2, 720, 420, 0xfff4d6)
      .setStrokeStyle(8, 0x2b1a10);
    this.add.rectangle(b / 2, h / 2 - 170, 680, 20, 0xff8040);
    this.add.rectangle(b / 2, h / 2 + 170, 680, 20, 0xff8040);

    const generator = this.modus === 'tafels' ? Tafels : Kleuter;
    this.som = generator.volgendeSom();

    this.add.text(b / 2, h / 2 - 140, this.som.vraag, {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '42px',
      fontStyle: 'bold',
      color: '#2b1a10',
    }).setOrigin(0.5);

    this.tekenAppels();
    this.tekenAntwoordknoppen();

    this.klaar = false;
  }

  tekenAppels() {
    if (this.som.plaatjes <= 0) return;

    const b = this.scale.width;
    const h = this.scale.height;
    const totaal = this.som.plaatjes;
    const rijen = totaal <= 5 ? [totaal] : [5, totaal - 5];
    const yBase = h / 2 - 50;

    rijen.forEach((count, r) => {
      const rowY = yBase + r * 50;
      for (let c = 0; c < count; c++) {
        const rowX = b / 2 - (count - 1) * 32 + c * 64;
        const appel = this.add.image(rowX, rowY, 'appel').setScale(1.8);
        this.tweens.add({
          targets: appel,
          angle: { from: -6, to: 6 },
          duration: 1200 + c * 80,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.InOut',
        });
      }
    });
  }

  tekenAntwoordknoppen() {
    const b = this.scale.width;
    const h = this.scale.height;
    const y = h / 2 + 110;

    this.som.opties.forEach((optie, i) => {
      const x = b / 2 - 200 + i * 200;
      const knop = this.add.rectangle(x, y, 160, 100, 0xff8040)
        .setStrokeStyle(6, 0x2b1a10)
        .setInteractive({ useHandCursor: true });
      this.add.rectangle(x, y - 42, 150, 12, 0xffb060);
      const tekst = this.add.text(x, y, String(optie), {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '54px',
        fontStyle: 'bold',
        color: '#2b1a10',
      }).setOrigin(0.5);

      knop.on('pointerover', () => knop.setScale(1.06));
      knop.on('pointerout', () => knop.setScale(1));
      knop.on('pointerdown', () => this.beantwoord(optie, knop, tekst));
    });
  }

  beantwoord(antwoord, knop) {
    if (this.klaar) return;
    this.klaar = true;

    if (antwoord === this.som.juist) {
      knop.setFillStyle(0x66cc66);
      this.toonFeedback('Goed!', 0x66cc66, 'ster');
      if (typeof Geluid !== 'undefined') Geluid.goed();
      this.scene.get('Game').events.emit('puzzleGoed', this.appel);
      this.time.delayedCall(500, () => {
        this.scene.stop();
        this.scene.resume('Game');
      });
    } else {
      knop.setFillStyle(0xcc6666);
      this.toonFeedback('Probeer weer!', 0xcc6666, null);
      if (typeof Geluid !== 'undefined') Geluid.fout();
      this.cameras.main.shake(200, 0.006);
      this.time.delayedCall(900, () => {
        this.scene.get('Game').events.emit('puzzleFout', this.appel);
        this.scene.stop();
        this.scene.resume('Game');
      });
    }
  }

  toonFeedback(tekst, kleur, sprite) {
    const b = this.scale.width;
    const h = this.scale.height;
    const groep = this.add.container(b / 2, h / 2 + 110);

    const t = this.add.text(0, 0, tekst, {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '48px',
      fontStyle: 'bold',
      color: `#${kleur.toString(16).padStart(6, '0')}`,
      stroke: '#2b1a10',
      strokeThickness: 5,
    }).setOrigin(0.5);

    groep.add(t);

    if (sprite) {
      const s1 = this.add.image(-100, 0, sprite).setScale(3);
      const s2 = this.add.image(100, 0, sprite).setScale(3);
      groep.add([s1, s2]);
      this.tweens.add({
        targets: [s1, s2],
        angle: 360,
        duration: 800,
        repeat: -1,
      });
    }

    this.tweens.add({
      targets: groep,
      scale: { from: 0.3, to: 1.2 },
      duration: 300,
      ease: 'Back.Out',
    });
  }
}
