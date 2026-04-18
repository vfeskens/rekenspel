class BakScene extends Phaser.Scene {
  constructor() {
    super('Bak');
  }

  init(data) {
    this.aantalAppels = (data && data.aantalAppels) || 0;
    this.modus = (data && data.modus) || 'kleuter';
    this.wedges = [];
    this.geslepen = 0;
    this.bakklaar = false;
    this.huidigeAppelOpPlank = null;
  }

  create() {
    const b = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(0, 0, b, h, 0xfde4b8).setOrigin(0, 0);
    this.add.rectangle(0, h - 160, b, 160, 0x8a5a2a).setOrigin(0, 0);
    this.add.rectangle(0, h - 160, b, 6, 0x6a3a18).setOrigin(0, 0);

    this.add.text(b / 2, 36, 'Roeltje bakt een appeltaart!', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffee66',
      stroke: '#2b1a10',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.instructie = this.add.text(b / 2, 76, 'Tik op een appel (of sleep \'m naar de snijplank)!', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '20px',
      color: '#2b1a10',
    }).setOrigin(0.5);

    this.snijplank = this.add.image(b / 2 - 180, h - 250, 'snijplank').setDepth(2);
    this.plankX = this.snijplank.x;
    this.plankY = this.snijplank.y;

    this.mes = this.add.image(this.plankX + 50, this.plankY - 70, 'mes').setScale(0.7).setDepth(4);
    this.mes.setVisible(false);

    this.bodem = this.add.image(b / 2 + 180, h - 250, 'taartbodem').setScale(1.3).setDepth(2);
    this.bodemX = this.bodem.x;
    this.bodemY = this.bodem.y;
    this.bodemRadius = 92;

    this.add.text(this.plankX, this.plankY + 75, 'snijplank', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '14px',
      color: '#6a3a18',
    }).setOrigin(0.5);
    this.add.text(this.bodemX, this.bodemY + 60, 'taartbodem', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '14px',
      color: '#6a3a18',
    }).setOrigin(0.5);

    this.tekenKok(60, h - 70);

    if (this.aantalAppels === 0) {
      this.time.delayedCall(200, () => {
        this.scene.start('Win', { aantalAppels: 0 });
      });
      return;
    }

    this.appels = [];
    for (let i = 0; i < this.aantalAppels; i++) {
      const startX = 180 + (i % 6) * 100;
      const startY = 140 + Math.floor(i / 6) * 70;
      const appel = this.add.image(startX, startY, 'appel').setScale(1.5).setDepth(5);
      appel.startX = startX;
      appel.startY = startY;
      appel.status = 'heel';
      appel.wasGedragged = false;
      appel.setInteractive({ draggable: true, useHandCursor: true });
      this.appels.push(appel);

      appel.on('pointerdown', (pointer) => {
        appel._downX = pointer.x;
        appel._downY = pointer.y;
        appel._downTime = pointer.downTime;
        appel.wasGedragged = false;
      });

      appel.on('pointerup', (pointer) => {
        if (appel.status !== 'heel') return;
        if (this.huidigeAppelOpPlank) return;
        if (appel.wasGedragged) return;
        const dx = pointer.x - (appel._downX || pointer.x);
        const dy = pointer.y - (appel._downY || pointer.y);
        if (dx * dx + dy * dy < 200) {
          this.legOpPlank(appel);
        }
      });

      const dans = this.tweens.add({
        targets: appel,
        y: startY - 6,
        duration: 900 + i * 50,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
      appel.dans = dans;
    }

    this.input.on('drag', (pointer, obj, dragX, dragY) => {
      if (obj.status !== 'heel') return;
      if (this.huidigeAppelOpPlank && this.huidigeAppelOpPlank !== obj) return;
      obj.x = dragX;
      obj.y = dragY;
      obj.setDepth(10);
    });

    this.input.on('dragstart', (pointer, obj) => {
      if (obj.status !== 'heel') return;
      obj.wasGedragged = true;
      if (obj.dans) obj.dans.stop();
      obj.setScale(1.7);
    });

    this.input.on('dragend', (pointer, obj) => {
      if (obj.status !== 'heel') return;
      obj.setScale(1.5);

      const dx = obj.x - this.plankX;
      const dy = obj.y - this.plankY;
      const opPlank = Math.abs(dx) < 100 && Math.abs(dy) < 55;

      if (opPlank && !this.huidigeAppelOpPlank) {
        this.legOpPlank(obj);
      } else {
        this.tweens.add({
          targets: obj,
          x: obj.startX,
          y: obj.startY,
          scale: 1.5,
          duration: 250,
          ease: 'Back.Out',
          onComplete: () => {
            if (obj.status === 'heel') {
              obj.dans = this.tweens.add({
                targets: obj,
                y: obj.startY - 6,
                duration: 900,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.InOut',
              });
            }
          },
        });
      }
    });
  }

  legOpPlank(appel) {
    this.huidigeAppelOpPlank = appel;
    appel.status = 'opplank';
    appel.disableInteractive();
    this.tweens.add({
      targets: appel,
      x: this.plankX,
      y: this.plankY - 6,
      scale: 1.6,
      duration: 250,
      ease: 'Back.Out',
      onComplete: () => this.toonMes(appel),
    });
    this.instructie.setText('Tik op de appel om te snijden!');
  }

  toonMes(appel) {
    this.mes.setVisible(true);
    this.mes.y = this.plankY - 80;
    this.mes.x = this.plankX;
    this.mes.setAngle(-15);
    appel.chops = 0;
    appel.crackGrafiek = this.add.graphics().setDepth(7);
    this.mesZweef = this.tweens.add({
      targets: this.mes,
      y: this.plankY - 68,
      angle: { from: -15, to: -5 },
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });

    appel.setInteractive({ useHandCursor: true });
    appel.on('pointerdown', () => this.hakken(appel));
  }

  hakken(appel) {
    if (appel.bezig) return;
    appel.bezig = true;
    appel.chops = (appel.chops || 0) + 1;

    if (this.mesZweef) this.mesZweef.stop();

    this.tweens.add({
      targets: this.mes,
      y: this.plankY - 16,
      angle: 25,
      duration: 110,
      ease: 'Quad.In',
      onComplete: () => {
        this.cameras.main.shake(140, 0.008);
        if (typeof Geluid !== 'undefined') Geluid.klik();

        this.tweens.add({
          targets: appel,
          angle: { from: -6, to: 6 },
          duration: 80,
          yoyo: true,
          repeat: 1,
          onComplete: () => appel.setAngle(0),
        });

        this.tekenCrack(appel);

        for (let i = 0; i < 4; i++) {
          const stof = this.add.circle(
            appel.x + Phaser.Math.Between(-20, 20),
            appel.y + Phaser.Math.Between(-10, 10),
            Phaser.Math.Between(2, 3),
            0xfff4d0, 0.8
          ).setDepth(8);
          this.tweens.add({
            targets: stof,
            y: stof.y - 20,
            alpha: 0,
            duration: 400,
            onComplete: () => stof.destroy(),
          });
        }

        if (appel.chops >= 3) {
          appel.disableInteractive();
          this.tweens.add({
            targets: this.mes,
            y: this.plankY - 80,
            angle: -5,
            duration: 180,
            onComplete: () => this.splitsInWedges(appel),
          });
        } else {
          this.tweens.add({
            targets: this.mes,
            y: this.plankY - 68,
            angle: -5,
            duration: 160,
            onComplete: () => {
              appel.bezig = false;
              this.mesZweef = this.tweens.add({
                targets: this.mes,
                y: this.plankY - 68,
                angle: { from: -15, to: -5 },
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.InOut',
              });
            },
          });
        }
      },
    });
  }

  tekenCrack(appel) {
    const g = appel.crackGrafiek;
    if (!g) return;
    g.lineStyle(2, 0x2b1a10);
    const ax = appel.x;
    const ay = appel.y;
    const chop = appel.chops;
    if (chop === 1) {
      g.beginPath();
      g.moveTo(ax - 12, ay - 6);
      g.lineTo(ax - 4, ay);
      g.lineTo(ax - 6, ay + 6);
      g.lineTo(ax + 2, ay + 12);
      g.strokePath();
    } else if (chop === 2) {
      g.beginPath();
      g.moveTo(ax + 12, ay - 8);
      g.lineTo(ax + 4, ay - 2);
      g.lineTo(ax + 8, ay + 4);
      g.lineTo(ax - 2, ay + 14);
      g.strokePath();
    }
  }

  splitsInWedges(appel) {
    const aantalWedges = 3;
    for (let i = 0; i < aantalWedges; i++) {
      const wedgeIdx = this.wedges.length;
      const wedge = this.add.image(appel.x, appel.y, 'wedge').setScale(1.3).setDepth(6);
      const angleDeg = -90 + (i - (aantalWedges - 1) / 2) * 40;
      wedge.setAngle(angleDeg);

      const hoekRad = Phaser.Math.DegToRad(angleDeg);
      const burstX = appel.x + Math.cos(hoekRad) * 40;
      const burstY = appel.y + Math.sin(hoekRad) * 40;

      this.wedges.push(wedge);

      this.tweens.add({
        targets: wedge,
        x: burstX,
        y: burstY,
        duration: 250,
        ease: 'Quad.Out',
        onComplete: () => this.wedgeNaarTaart(wedge, wedgeIdx),
      });
    }

    if (appel.crackGrafiek) {
      this.tweens.add({
        targets: appel.crackGrafiek,
        alpha: 0,
        duration: 200,
        onComplete: () => appel.crackGrafiek.destroy(),
      });
    }
    this.tweens.add({
      targets: appel,
      alpha: 0,
      scale: 0,
      duration: 200,
      onComplete: () => appel.destroy(),
    });

    this.mes.setVisible(false);

    this.time.delayedCall(900, () => this.appelKlaar());
  }

  wedgeNaarTaart(wedge, index) {
    const ring = Math.floor(index / 6);
    const posInRing = index % 6;
    const radius = 42 - ring * 14;
    const hoek = (posInRing / 6) * Math.PI * 2 + ring * 0.35;
    const doelX = this.bodemX + Math.cos(hoek) * radius;
    const doelY = this.bodemY + Math.sin(hoek) * radius * 0.45 - ring * 4;

    const doelAngle = Phaser.Math.RadToDeg(hoek) + 90;

    this.tweens.add({
      targets: wedge,
      x: doelX,
      y: doelY,
      angle: doelAngle,
      scale: 1.0,
      duration: 450,
      ease: 'Quad.InOut',
      delay: (index % 3) * 60,
    });
  }

  appelKlaar() {
    this.huidigeAppelOpPlank = null;
    this.geslepen++;
    if (typeof Geluid !== 'undefined') Geluid.appel();

    if (this.geslepen === this.aantalAppels) {
      this.time.delayedCall(400, () => this.toonSuikerPhase());
    } else {
      this.instructie.setText('Sleep de volgende appel!');
    }
  }

  toonSuikerPhase() {
    this.instructie.setText('Strooi suiker over de taart! (3x tikken)');

    this.suikerpot = this.add.image(this.bodemX, this.bodemY - 120, 'suikerpot')
      .setInteractive({ useHandCursor: true })
      .setDepth(15);

    this.suikerTeller = 0;
    this.suikerMax = 3;

    this.suikerBob = this.tweens.add({
      targets: this.suikerpot,
      y: this.bodemY - 128,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });

    const pijl = this.add.text(this.bodemX + 60, this.bodemY - 120, '← tik!', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ff4422',
      stroke: '#2b1a10',
      strokeThickness: 3,
    }).setOrigin(0, 0.5).setDepth(15);
    this.tweens.add({
      targets: pijl,
      x: this.bodemX + 70,
      duration: 400,
      yoyo: true,
      repeat: -1,
    });
    this.suikerpot.pijl = pijl;

    this.suikerpot.on('pointerdown', () => this.sprenkelSuiker());
  }

  sprenkelSuiker() {
    this.suikerTeller++;

    if (this.suikerpot.pijl) {
      this.suikerpot.pijl.destroy();
      this.suikerpot.pijl = null;
    }

    this.tweens.add({
      targets: this.suikerpot,
      angle: { from: -25, to: 25 },
      duration: 120,
      yoyo: true,
      repeat: 1,
      onComplete: () => this.suikerpot.setAngle(0),
    });

    const aantalDeeltjes = 14;
    for (let i = 0; i < aantalDeeltjes; i++) {
      const startX = this.suikerpot.x + Phaser.Math.Between(-28, 28);
      const startY = this.suikerpot.y + 40;
      const deeltje = this.add.circle(
        startX,
        startY,
        Phaser.Math.FloatBetween(1.5, 2.8),
        0xffffff
      ).setDepth(16).setAlpha(0.95);

      const doelX = startX + Phaser.Math.Between(-30, 30);
      const doelY = this.bodemY + Phaser.Math.Between(-15, 5);

      this.tweens.add({
        targets: deeltje,
        x: doelX,
        y: doelY,
        duration: Phaser.Math.Between(500, 800),
        ease: 'Quad.In',
        delay: i * 15,
        onComplete: () => {
          this.tweens.add({
            targets: deeltje,
            alpha: 0,
            duration: 400,
            delay: 200,
            onComplete: () => deeltje.destroy(),
          });
        },
      });
    }

    if (typeof Geluid !== 'undefined') Geluid.klik();

    if (this.suikerTeller >= this.suikerMax) {
      this.suikerpot.disableInteractive();
      if (this.suikerBob) this.suikerBob.stop();
      this.tweens.add({
        targets: this.suikerpot,
        y: this.suikerpot.y - 40,
        alpha: 0,
        duration: 500,
        onComplete: () => this.suikerpot.destroy(),
      });
      this.time.delayedCall(600, () => this.toonBakKnop());
    }
  }

  tekenKok(x, y) {
    const roeltje = this.add.image(x, y, 'roeltje-idle').setOrigin(0.5, 1).setScale(1.3).setDepth(5);
    const muts = this.add.graphics().setDepth(6);
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

    const oven = this.add.image(this.bodemX, h - 60, 'oven')
      .setOrigin(0.5, 1)
      .setScale(0.9)
      .setAlpha(0)
      .setDepth(4);
    this.tweens.add({
      targets: oven,
      alpha: 0.85,
      duration: 300,
    });

    const alles = [this.bodem, ...this.wedges];
    this.tweens.add({
      targets: alles,
      y: '+=20',
      alpha: 0.6,
      duration: 400,
    });

    this.time.addEvent({
      delay: 150,
      repeat: 20,
      callback: () => {
        const stoom = this.add.image(
          this.bodemX + Phaser.Math.Between(-50, 50),
          this.bodemY - 10,
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
      },
    });

    if (typeof Geluid !== 'undefined') {
      this.time.addEvent({
        delay: 400,
        repeat: 7,
        callback: () => Geluid.klik(),
      });
    }

    const toonCountdown = (n, delay) => {
      this.time.delayedCall(delay, () => {
        const t = this.add.text(b / 2, 260, String(n), {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: '120px',
          fontStyle: 'bold',
          color: '#ffee66',
          stroke: '#2b1a10',
          strokeThickness: 10,
        }).setOrigin(0.5).setDepth(30).setAlpha(0);
        this.tweens.add({
          targets: t,
          alpha: { from: 0, to: 1 },
          scale: { from: 0.3, to: 1.4 },
          duration: 300,
          ease: 'Back.Out',
        });
        this.tweens.add({
          targets: t,
          alpha: 0,
          scale: 2.2,
          duration: 400,
          delay: 600,
          onComplete: () => t.destroy(),
        });
        if (typeof Geluid !== 'undefined') Geluid.klik();
      });
    };
    toonCountdown(3, 300);
    toonCountdown(2, 1300);
    toonCountdown(1, 2300);

    this.time.delayedCall(3300, () => {
      this.bodem.setTexture('taart-klaar');
      this.tweens.add({
        targets: [this.bodem],
        alpha: 1,
        scale: 1.5,
        duration: 500,
        ease: 'Back.Out',
      });
      this.wedges.forEach((w) => {
        this.tweens.add({
          targets: w,
          alpha: 0,
          duration: 300,
          onComplete: () => w.destroy(),
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

    const hoera = this.add.text(b / 2, 90, 'Hmm, wat een lekkere taart!', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffee66',
      stroke: '#2b1a10',
      strokeThickness: 6,
    }).setOrigin(0.5).setDepth(20);

    this.tweens.add({
      targets: hoera,
      scale: { from: 0.3, to: 1 },
      duration: 500,
      ease: 'Back.Out',
    });

    for (let i = 0; i < 12; i++) {
      const ster = this.add.image(
        this.bodemX + Phaser.Math.Between(-100, 100),
        this.bodemY + Phaser.Math.Between(-80, 20),
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

    this.maakKnop(b / 2 - 150, 160, 'Terug naar menu', () => this.scene.start('Menu'));
    this.maakKnop(b / 2 + 150, 160, 'Nog een keer!', () => this.scene.start('Game', { modus: this.modus }));
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
