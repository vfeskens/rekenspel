class BakScene extends Phaser.Scene {
  constructor() {
    super('Bak');
  }

  init(data) {
    this.aantalAppels = (data && data.aantalAppels) || 0;
    this.modus = (data && data.modus) || 'kleuter';
    this.geplaatst = [];
    this.bakklaar = false;
  }

  create() {
    const b = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(0, 0, b, h, 0xfde4b8).setOrigin(0, 0);
    this.add.rectangle(0, h - 160, b, 160, 0x8a5a2a).setOrigin(0, 0);
    this.add.rectangle(0, h - 160, b, 6, 0x6a3a18).setOrigin(0, 0);

    for (let i = 0; i < 10; i++) {
      const x = 20 + i * 100;
      this.add.line(0, 0, x, h - 154, x + 30, h - 10, 0x6a3a18, 0.3)
        .setOrigin(0, 0).setLineWidth(1);
    }

    this.add.text(b / 2, 40, 'Roeltje bakt een appeltaart!', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '34px',
      fontStyle: 'bold',
      color: '#ffee66',
      stroke: '#2b1a10',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.instructie = this.add.text(b / 2, 82, 'Sleep de appels op de taartbodem!', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '20px',
      color: '#2b1a10',
    }).setOrigin(0.5);

    this.bodem = this.add.image(b / 2, h - 175, 'taartbodem').setScale(1.3);
    this.bodemRadius = 92;
    this.bodem.setDepth(2);

    this.tekenKok(60, h - 65);

    if (this.aantalAppels === 0) {
      this.time.delayedCall(200, () => {
        this.scene.start('Win', { aantalAppels: 0 });
      });
      return;
    }

    this.appels = [];
    const perRij = Math.min(this.aantalAppels, 8);
    for (let i = 0; i < this.aantalAppels; i++) {
      const startX = b / 2 - (perRij - 1) * 50 + (i % perRij) * 100;
      const startY = 150 + Math.floor(i / perRij) * 80;
      const appel = this.add.image(startX, startY, 'appel').setScale(1.5).setDepth(5);
      appel.startX = startX;
      appel.startY = startY;
      appel.geplaatst = false;
      appel.setInteractive({ draggable: true, useHandCursor: true });
      this.input.setDraggable(appel);
      this.appels.push(appel);

      this.tweens.add({
        targets: appel,
        y: startY - 6,
        duration: 900 + i * 50,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    }

    this.input.on('drag', (pointer, obj, dragX, dragY) => {
      if (obj.geplaatst) return;
      obj.x = dragX;
      obj.y = dragY;
      obj.setDepth(10);
    });

    this.input.on('dragstart', (pointer, obj) => {
      if (obj.geplaatst) return;
      this.tweens.killTweensOf(obj);
      obj.setScale(1.7);
    });

    this.input.on('dragend', (pointer, obj) => {
      if (obj.geplaatst) return;
      obj.setScale(1.5);
      const dx = obj.x - this.bodem.x;
      const dy = obj.y - this.bodem.y;
      const opBodem = (dx * dx) / (this.bodemRadius * this.bodemRadius) + (dy * dy) / ((this.bodemRadius * 0.5) * (this.bodemRadius * 0.5)) <= 1;

      if (opBodem) {
        obj.geplaatst = true;
        obj.disableInteractive();
        obj.setDepth(3);

        const idx = this.geplaatst.length;
        const totaal = Math.max(this.aantalAppels, 2);
        const hoek = (idx / totaal) * Math.PI * 2 - Math.PI / 2;
        const r = Math.min(48, this.bodemRadius - 30);
        const doelX = this.bodem.x + Math.cos(hoek) * r;
        const doelY = this.bodem.y + Math.sin(hoek) * r * 0.55;

        this.tweens.add({
          targets: obj,
          x: doelX,
          y: doelY,
          scale: 1.1,
          duration: 200,
          ease: 'Back.Out',
        });
        this.geplaatst.push(obj);
        if (typeof Geluid !== 'undefined') Geluid.appel();

        if (this.geplaatst.length === this.aantalAppels) {
          this.time.delayedCall(300, () => this.toonBakKnop());
        }
      } else {
        this.tweens.add({
          targets: obj,
          x: obj.startX,
          y: obj.startY,
          duration: 250,
          ease: 'Back.Out',
          onComplete: () => {
            this.tweens.add({
              targets: obj,
              y: obj.startY - 6,
              duration: 900,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.InOut',
            });
          },
        });
      }
    });
  }

  tekenKok(x, y) {
    const muts = this.add.graphics().setDepth(6);
    const roeltje = this.add.image(x, y, 'roeltje-idle').setOrigin(0.5, 1).setScale(1.4).setDepth(5);

    const mx = x;
    const my = roeltje.y - roeltje.displayHeight + 6;
    muts.fillStyle(0xffffff);
    muts.fillRect(mx - 18, my, 36, 8);
    muts.fillCircle(mx - 10, my - 6, 10);
    muts.fillCircle(mx + 6, my - 10, 12);
    muts.fillCircle(mx + 16, my - 4, 8);
    muts.lineStyle(1.5, 0x888888);
    muts.strokeCircle(mx - 10, my - 6, 10);
    muts.strokeCircle(mx + 6, my - 10, 12);
    muts.strokeCircle(mx + 16, my - 4, 8);

    this.tweens.add({
      targets: [roeltje, muts],
      y: '-=8',
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
  }

  toonBakKnop() {
    if (this.bakklaar) return;
    this.instructie.setVisible(false);

    const b = this.scale.width;
    const x = b / 2;
    const y = 110;

    const knop = this.add.rectangle(x, y, 260, 64, 0xff8040)
      .setStrokeStyle(5, 0x2b1a10)
      .setInteractive({ useHandCursor: true })
      .setDepth(20);
    this.add.rectangle(x, y - 22, 240, 10, 0xffb060).setDepth(21);
    const tekst = this.add.text(x, y, 'Bak de taart!', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#2b1a10',
    }).setOrigin(0.5).setDepth(22);

    knop.on('pointerover', () => knop.setScale(1.05));
    knop.on('pointerout', () => knop.setScale(1));
    knop.on('pointerdown', () => {
      this.bakklaar = true;
      knop.destroy();
      tekst.destroy();
      this.bak();
    });

    this.tweens.add({
      targets: knop,
      scale: { from: 0.8, to: 1 },
      duration: 300,
      ease: 'Back.Out',
    });
  }

  bak() {
    const b = this.scale.width;
    const h = this.scale.height;

    this.instructie.setVisible(true);
    this.instructie.setText('In de oven...');

    const oven = this.add.image(b / 2, h - 60, 'oven')
      .setOrigin(0.5, 1)
      .setScale(1)
      .setAlpha(0)
      .setDepth(4);
    this.tweens.add({
      targets: oven,
      alpha: 0.85,
      duration: 300,
    });

    const alles = [this.bodem, ...this.geplaatst];
    this.tweens.add({
      targets: alles,
      y: '+=20',
      alpha: 0.6,
      duration: 400,
    });

    let totaalStoom = 0;
    const stoomInterval = this.time.addEvent({
      delay: 150,
      repeat: 14,
      callback: () => {
        const stoom = this.add.image(
          this.bodem.x + Phaser.Math.Between(-50, 50),
          this.bodem.y - 10,
          'stoom'
        ).setScale(Phaser.Math.FloatBetween(0.6, 1.1)).setDepth(15);
        this.tweens.add({
          targets: stoom,
          y: stoom.y - 160,
          alpha: 0,
          scale: stoom.scale * 1.5,
          duration: 1400,
          onComplete: () => stoom.destroy(),
        });
        totaalStoom++;
      },
    });

    if (typeof Geluid !== 'undefined') {
      this.time.addEvent({
        delay: 400,
        repeat: 5,
        callback: () => Geluid.klik(),
      });
    }

    this.time.delayedCall(2500, () => {
      this.bodem.setTexture('taart-klaar');
      this.tweens.add({
        targets: [this.bodem],
        alpha: 1,
        scale: 1.5,
        duration: 500,
        ease: 'Back.Out',
      });
      this.geplaatst.forEach((a) => {
        this.tweens.add({
          targets: a,
          alpha: 0,
          duration: 300,
          onComplete: () => a.destroy(),
        });
      });
      this.tweens.add({
        targets: oven,
        alpha: 0,
        duration: 500,
        onComplete: () => oven.destroy(),
      });
      this.time.delayedCall(700, () => this.klaar());
    });
  }

  klaar() {
    const b = this.scale.width;
    const h = this.scale.height;

    this.instructie.destroy();

    if (typeof Geluid !== 'undefined') Geluid.thuis();

    const hoera = this.add.text(b / 2, 105, 'Hmm, wat een lekkere taart!', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffee66',
      stroke: '#2b1a10',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: hoera,
      scale: { from: 0.3, to: 1 },
      duration: 500,
      ease: 'Back.Out',
    });

    for (let i = 0; i < 15; i++) {
      const ster = this.add.image(
        this.bodem.x + Phaser.Math.Between(-100, 100),
        this.bodem.y + Phaser.Math.Between(-80, 20),
        'ster',
      ).setDepth(10).setAlpha(0);
      this.tweens.add({
        targets: ster,
        alpha: { from: 0, to: 1 },
        scale: { from: 0.5, to: 1.6 },
        angle: 360,
        duration: 1000 + i * 80,
        yoyo: true,
        repeat: -1,
      });
    }

    this.maakKnop(b / 2 - 150, 170, 'Terug naar menu', () => this.scene.start('Menu'));
    this.maakKnop(b / 2 + 150, 170, 'Nog een keer!', () => this.scene.start('Game', { modus: this.modus }));
  }

  maakKnop(x, y, tekst, cb) {
    const knop = this.add.rectangle(x, y, 260, 60, 0xff8040)
      .setStrokeStyle(5, 0x2b1a10)
      .setInteractive({ useHandCursor: true })
      .setDepth(20);
    this.add.rectangle(x, y - 20, 240, 8, 0xffb060).setDepth(21);
    this.add.text(x, y, tekst, {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#2b1a10',
    }).setOrigin(0.5).setDepth(22);

    knop.on('pointerover', () => knop.setScale(1.05));
    knop.on('pointerout', () => knop.setScale(1));
    knop.on('pointerdown', cb);
  }
}
