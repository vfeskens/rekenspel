class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init(data) {
    this.modus = (data && data.modus) || 'kleuter';
    this.aantalAppels = 0;
    this.beerWakker = false;
    this.bereikt = false;
  }

  create() {
    const wereldBreedte = 2400;
    const wereldHoogte = 540;

    this.physics.world.setBounds(0, 0, wereldBreedte, wereldHoogte);
    this.cameras.main.setBounds(0, 0, wereldBreedte, wereldHoogte);

    this.add.rectangle(0, 0, wereldBreedte, 540, 0x7ec8f0).setOrigin(0, 0).setScrollFactor(0);
    this.add.rectangle(0, 380, wereldBreedte, 160, 0xa8e0f0).setOrigin(0, 0).setScrollFactor(0);

    this.tekenWolken(wereldBreedte);

    for (let i = 0; i < 8; i++) {
      this.add.image(i * 380, 502, 'heuvel')
        .setOrigin(0, 1)
        .setAlpha(0.7)
        .setScale(0.6)
        .setScrollFactor(0.4)
        .setDepth(0);
    }

    for (let i = 0; i < 12; i++) {
      this.add.image(80 + i * 210, 500, 'boom')
        .setOrigin(0.5, 1)
        .setScale(0.6)
        .setAlpha(0.85)
        .setScrollFactor(0.75)
        .setDepth(1);
    }

    this.grond = this.physics.add.staticGroup();
    for (let x = 0; x < wereldBreedte; x += 32) {
      this.grond.create(x, 500, 'grond').setOrigin(0, 0).refreshBody();
    }
    for (let x = 0; x < wereldBreedte; x += 32) {
      this.add.rectangle(x, 532, 32, 8, 0x3a2010).setOrigin(0, 0).setDepth(0);
    }

    const level = this.genereerLevel();

    const platform = (x, y, tegels) => {
      for (let i = 0; i < tegels; i++) {
        this.grond.create(x + i * 32, y, 'grond').setOrigin(0, 0).refreshBody();
      }
    };
    level.platforms.forEach((p) => platform(p.x, p.y, p.tegels));

    level.taks.forEach((t) => {
      this.grond.create(t.x, t.y, 'tak').setOrigin(0, 0).refreshBody();
    });

    const voorgrondBomen = [
      { x: Phaser.Math.Between(280, 360), y: 500, schaal: 0.9 },
      { x: Phaser.Math.Between(980, 1060), y: 500, schaal: 1.0 },
      { x: Phaser.Math.Between(2120, 2200), y: 500, schaal: 0.95 },
    ];
    voorgrondBomen.forEach((b) => {
      this.add.image(b.x, b.y, 'boom').setOrigin(0.5, 1).setScale(b.schaal).setDepth(2);
    });

    this.appels = this.physics.add.group({ allowGravity: false });
    level.appels.forEach((pos) => {
      const appel = this.appels.create(pos.x, pos.y, 'appel');
      appel.body.setSize(22, 22).setOffset(3, 8);
      appel.inPuzzle = false;
      appel.setDepth(3);
      this.tweens.add({
        targets: appel,
        y: pos.y - 8,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    });

    this.beer = this.add.image(level.beerX, 500, 'beer').setOrigin(0.5, 1).setDepth(3);
    this.beerZone = new Phaser.Geom.Rectangle(level.beerX - 70, 460, 140, 40);
    this.zz = this.add.text(level.beerX + 40, 410, 'z Z z', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '32px',
      fontStyle: 'bold italic',
      color: '#ffffff',
      stroke: '#2b1a10',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(3);
    this.tweens.add({
      targets: this.zz,
      y: 395,
      alpha: { from: 0.6, to: 1 },
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });

    this.huisje = this.physics.add.staticImage(2290, 500, 'huisje').setOrigin(0.5, 1);
    this.huisje.body.setSize(80, 100).setOffset(16, 12);
    this.huisje.setDepth(2);

    this.roeltje = this.physics.add.sprite(100, 400, 'roeltje-idle');
    this.roeltje.setScale(1.3);
    this.roeltje.body.setSize(42, 34).setOffset(14, 10);
    this.roeltje.setCollideWorldBounds(true);
    this.roeltje.setDepth(5);
    this.roeltje.aanHetBukken = false;
    this.roeltje.huidigeStand = 'idle';

    this.physics.add.collider(this.roeltje, this.grond);
    this.physics.add.overlap(this.roeltje, this.appels, this.pakAppel, null, this);
    this.physics.add.overlap(this.roeltje, this.huisje, this.bereikHuis, null, this);

    this.cameras.main.startFollow(this.roeltje, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(200, 80);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    this.touch = { links: false, rechts: false, spring: false, buk: false };
    this.input.addPointer(3);
    this.maakTouchKnoppen();

    this.hudAppel = this.add.image(35, 35, 'appel')
      .setScrollFactor(0)
      .setScale(1.1)
      .setDepth(100);
    this.hudTekst = this.add.text(70, 35, 'x 0', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#2b1a10',
      strokeThickness: 4,
    }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(100);

    this.modusLabel = this.add.text(this.scale.width - 180, 35,
      this.modus === 'tafels' ? 'Tafels' : 'Tellen', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '20px',
        color: '#ffffff',
        stroke: '#2b1a10',
        strokeThickness: 3,
      }).setOrigin(1, 0.5).setScrollFactor(0).setDepth(100);

    this.maakGeluidKnoppenHud();

    this.events.on('puzzleGoed', (appel) => {
      if (appel && appel.active) {
        this.tweens.add({
          targets: appel,
          scale: 0,
          alpha: 0,
          y: appel.y - 30,
          duration: 250,
          onComplete: () => appel.destroy(),
        });
      }
      this.aantalAppels++;
      this.hudTekst.setText('x ' + this.aantalAppels);
      this.cameras.main.flash(120, 140, 255, 140);
      if (typeof Geluid !== 'undefined') Geluid.appel();
    });
    this.events.on('puzzleFout', (appel) => {
      if (appel) appel.inPuzzle = false;
    });

    this.events.once('shutdown', () => {
      this.events.off('puzzleGoed');
      this.events.off('puzzleFout');
    });

    this.kanSpringen = true;

    this.time.addEvent({
      delay: 2800,
      callback: this.snurkLoop,
      callbackScope: this,
      loop: true,
    });
  }

  snurkLoop() {
    if (this.beerWakker || this.bereikt) return;
    if (typeof Geluid === 'undefined' || !Geluid.sfxActief) return;
    if (!this.roeltje || !this.beer) return;
    const dx = this.roeltje.x - this.beer.x;
    const dy = this.roeltje.y - this.beer.y;
    const afstand = Math.sqrt(dx * dx + dy * dy);
    const volume = Phaser.Math.Clamp(1 - afstand / 500, 0, 1) * 0.28;
    Geluid.snurk(volume);
  }

  tekenWolken(breedte) {
    for (let i = 0; i < 9; i++) {
      this.add.image(100 + i * 280, 50 + (i % 3) * 40, 'wolk')
        .setScale(0.8 + (i % 2) * 0.3)
        .setScrollFactor(0.25)
        .setDepth(0);
    }
  }

  genereerLevel() {
    const r = Phaser.Math.Between;
    const platforms = [];
    const taks = [];
    const appels = [];

    appels.push({ x: r(200, 340), y: 460 });

    const p1x = r(400, 500);
    const p1y = r(370, 430);
    const p1tegels = r(3, 5);
    platforms.push({ x: p1x, y: p1y, tegels: p1tegels });
    appels.push({ x: p1x + p1tegels * 16, y: p1y - 30 });

    const p2x = r(Math.max(p1x + p1tegels * 32 + 120, 720), 900);
    const p2y = r(320, 420);
    const p2tegels = r(3, 5);
    platforms.push({ x: p2x, y: p2y, tegels: p2tegels });
    appels.push({ x: p2x + p2tegels * 16, y: p2y - 30 });

    const extra = r(0, 1);
    if (extra) {
      const p3x = r(1000, 1080);
      const p3y = r(360, 420);
      platforms.push({ x: p3x, y: p3y, tegels: 3 });
      appels.push({ x: p3x + 48, y: p3y - 30 });
    }

    const takX = r(1180, 1280);
    taks.push({ x: takX, y: 440 });
    appels.push({ x: takX + 60, y: 478 });

    const beerX = r(1520, 1650);

    appels.push({ x: r(1740, 1850), y: 460 });

    if (!extra) {
      appels.push({ x: r(2030, 2170), y: 460 });
    }

    return { platforms, taks, appels, beerX };
  }

  update() {
    if (this.beerWakker) return;

    this.updateTouch();

    const r = this.roeltje;
    const links = this.cursors.left.isDown || this.keyA.isDown || this.touch.links;
    const rechts = this.cursors.right.isDown || this.keyD.isDown || this.touch.rechts;
    const springInput = this.cursors.up.isDown || this.keySpace.isDown || this.keyW.isDown || this.touch.spring;
    const bukInput = this.cursors.down.isDown || this.keyS.isDown || this.touch.buk;

    const opDeGrond = r.body.blocked.down || r.body.touching.down;

    if (bukInput && !r.aanHetBukken) {
      r.aanHetBukken = true;
      r.setTexture('roeltje-bukken');
      r.body.setSize(54, 22).setOffset(5, 18);
      r.anims.stop();
    } else if (!bukInput && r.aanHetBukken) {
      r.aanHetBukken = false;
      r.setTexture('roeltje-idle');
      r.body.setSize(42, 34).setOffset(14, 10);
    }

    const snelheid = r.aanHetBukken ? 110 : 230;
    if (links) {
      r.setVelocityX(-snelheid);
      r.setFlipX(true);
    } else if (rechts) {
      r.setVelocityX(snelheid);
      r.setFlipX(false);
    } else {
      r.setVelocityX(0);
    }

    if (springInput && opDeGrond && !r.aanHetBukken && this.kanSpringen) {
      r.setVelocityY(-700);
      this.kanSpringen = false;
      if (typeof Geluid !== 'undefined') Geluid.spring();
    }
    if (!springInput && opDeGrond) {
      this.kanSpringen = true;
    }

    this.updateStand(r, opDeGrond, links, rechts);

    if (Phaser.Geom.Rectangle.Contains(this.beerZone, r.x, r.y) && !r.aanHetBukken) {
      this.beerWakkerMaken();
    }
  }

  updateStand(r, opDeGrond, links, rechts) {
    if (r.aanHetBukken) {
      if (r.huidigeStand !== 'bukken') r.huidigeStand = 'bukken';
      return;
    }
    if (!opDeGrond) {
      if (r.huidigeStand !== 'spring') {
        r.huidigeStand = 'spring';
        r.anims.stop();
        r.setTexture('roeltje-spring');
      }
      return;
    }
    if (links || rechts) {
      if (r.huidigeStand !== 'lopen') {
        r.huidigeStand = 'lopen';
        r.anims.play('roeltje-lopen', true);
      }
    } else {
      if (r.huidigeStand !== 'idle') {
        r.huidigeStand = 'idle';
        r.anims.stop();
        r.setTexture('roeltje-idle');
      }
    }
  }

  pakAppel(roeltje, appel) {
    if (appel.inPuzzle) return;
    appel.inPuzzle = true;
    this.scene.pause();
    this.scene.launch('Puzzle', { modus: this.modus, appel });
  }

  bereikHuis() {
    if (this.bereikt) return;
    this.bereikt = true;
    this.scene.stop('Puzzle');
    if (typeof Geluid !== 'undefined') Geluid.thuis();
    if (this.aantalAppels > 0) {
      this.scene.start('Bak', { aantalAppels: this.aantalAppels, modus: this.modus });
    } else {
      this.scene.start('Win', { aantalAppels: 0 });
    }
  }

  beerWakkerMaken() {
    this.beerWakker = true;
    this.roeltje.setVelocity(0, 0);
    this.roeltje.anims.stop();
    this.cameras.main.shake(500, 0.012);
    this.zz.setVisible(false);
    const grr = this.add.text(1560, 390, 'GRRR!', {
      fontFamily: 'Trebuchet MS, Arial, sans-serif',
      fontSize: '40px',
      fontStyle: 'bold',
      color: '#ff3030',
      stroke: '#2b1a10',
      strokeThickness: 5,
    }).setOrigin(0.5).setDepth(5);
    this.tweens.add({
      targets: grr,
      scale: { from: 0.5, to: 1.3 },
      duration: 300,
      ease: 'Back.Out',
    });
    if (typeof Geluid !== 'undefined') Geluid.beer();
    this.time.delayedCall(900, () => {
      this.scene.restart({ modus: this.modus });
    });
  }

  maakTouchKnoppen() {
    const touchApparaat = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (!touchApparaat) return;

    const h = this.scale.height;
    const b = this.scale.width;
    const r = 48;
    const y = h - 62;

    this._touchKnoppen = [
      { x: 75, y, r, key: 'links', kleur: 0xffb060, pijl: 'left' },
      { x: 185, y, r, key: 'rechts', kleur: 0xffb060, pijl: 'right' },
      { x: b - 185, y, r, key: 'buk', kleur: 0xffb060, pijl: 'down' },
      { x: b - 75, y, r, key: 'spring', kleur: 0xff8040, pijl: 'up' },
    ];

    this._touchKnoppen.forEach((btn) => {
      btn.cirkel = this.add.circle(btn.x, btn.y, btn.r, btn.kleur, 0.55)
        .setScrollFactor(0)
        .setStrokeStyle(5, 0x2b1a10)
        .setDepth(100);
      const g = this.add.graphics().setScrollFactor(0).setDepth(101);
      g.fillStyle(0x2b1a10);
      const s = 20;
      const cx = btn.x;
      const cy = btn.y;
      if (btn.pijl === 'left') {
        g.fillTriangle(cx - s, cy, cx + s * 0.4, cy - s, cx + s * 0.4, cy + s);
      } else if (btn.pijl === 'right') {
        g.fillTriangle(cx + s, cy, cx - s * 0.4, cy - s, cx - s * 0.4, cy + s);
      } else if (btn.pijl === 'up') {
        g.fillTriangle(cx, cy - s, cx - s, cy + s * 0.4, cx + s, cy + s * 0.4);
      } else if (btn.pijl === 'down') {
        g.fillTriangle(cx, cy + s, cx - s, cy - s * 0.4, cx + s, cy - s * 0.4);
      }
    });
  }

  updateTouch() {
    if (!this._touchKnoppen) return;

    this.touch.links = false;
    this.touch.rechts = false;
    this.touch.spring = false;
    this.touch.buk = false;

    const pointers = this.input.manager.pointers;
    for (let i = 0; i < pointers.length; i++) {
      const p = pointers[i];
      if (!p.isDown) continue;
      for (const btn of this._touchKnoppen) {
        const dx = p.x - btn.x;
        const dy = p.y - btn.y;
        if (dx * dx + dy * dy <= btn.r * btn.r) {
          this.touch[btn.key] = true;
          break;
        }
      }
    }

    this._touchKnoppen.forEach((btn) => {
      const ingedrukt = this.touch[btn.key];
      btn.cirkel.setFillStyle(btn.kleur, ingedrukt ? 0.85 : 0.55);
    });
  }

  maakGeluidKnoppenHud() {
    if (typeof Geluid === 'undefined') return;
    const b = this.scale.width;

    const maak = (x, label, actief, onClick) => {
      const knop = this.add.rectangle(x, 35, 72, 26, 0xffffff, 0.85)
        .setStrokeStyle(2, 0x2b1a10)
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true })
        .setDepth(100);
      const tekst = this.add.text(x, 35, `${label}: ${actief() ? 'aan' : 'uit'}`, {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '12px',
        fontStyle: 'bold',
        color: '#2b1a10',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
      knop.on('pointerdown', () => {
        const nieuw = onClick();
        tekst.setText(`${label}: ${nieuw ? 'aan' : 'uit'}`);
      });
    };

    maak(b - 120, 'Muziek', () => Geluid.muziekActief, () => Geluid.toggleMuziek());
    maak(b - 40, 'Geluid', () => Geluid.sfxActief, () => Geluid.toggleSfx());
  }
}
