class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    const g = this.add.graphics();

    this.tekenRoeltje(g, 'idle'); g.generateTexture('roeltje-idle', 64, 48);
    this.tekenRoeltje(g, 'walk1'); g.generateTexture('roeltje-walk1', 64, 48);
    this.tekenRoeltje(g, 'walk2'); g.generateTexture('roeltje-walk2', 64, 48);
    this.tekenRoeltje(g, 'jump'); g.generateTexture('roeltje-spring', 64, 48);
    this.tekenRoeltjeBukken(g); g.generateTexture('roeltje-bukken', 64, 40);

    this.tekenBeer(g); g.generateTexture('beer', 112, 56);
    this.tekenAppel(g); g.generateTexture('appel', 28, 32);
    this.tekenHuisje(g); g.generateTexture('huisje', 112, 112);
    this.tekenBoom(g); g.generateTexture('boom', 64, 120);
    this.tekenGrond(g); g.generateTexture('grond', 32, 32);
    this.tekenTak(g); g.generateTexture('tak', 120, 20);
    this.tekenHeuvel(g); g.generateTexture('heuvel', 240, 140);
    this.tekenWolk(g); g.generateTexture('wolk', 80, 40);
    this.tekenMaan(g); g.generateTexture('maan', 64, 64);
    this.tekenSter(g); g.generateTexture('ster', 12, 12);
    this.tekenZz(g); g.generateTexture('zz', 80, 40);

    this.tekenTaartBodem(g); g.generateTexture('taartbodem', 160, 80);
    this.tekenTaartKlaar(g); g.generateTexture('taart-klaar', 160, 80);
    this.tekenStoom(g); g.generateTexture('stoom', 48, 48);
    this.tekenOven(g); g.generateTexture('oven', 260, 200);

    g.destroy();
  }

  create() {
    this.anims.create({
      key: 'roeltje-lopen',
      frames: [
        { key: 'roeltje-walk1' },
        { key: 'roeltje-idle' },
        { key: 'roeltje-walk2' },
        { key: 'roeltje-idle' },
      ],
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'roeltje-stil',
      frames: [{ key: 'roeltje-idle' }],
      frameRate: 1,
    });

    this.scene.start('Menu');
  }

  tekenRoeltje(g, type) {
    const O = 0xff7a1a;
    const L = 0xff9a3a;
    const D = 0xb04510;
    const W = 0xffffff;
    const K = 0x2b1a10;
    const P = 0xff8ea8;

    g.clear();

    g.fillStyle(O);
    g.fillEllipse(14, 36, 14, 10);
    g.fillEllipse(8, 26, 12, 14);
    g.fillEllipse(4, 16, 10, 12);
    g.fillStyle(W);
    g.fillCircle(3, 11, 5);
    g.lineStyle(2, K);
    g.strokeEllipse(14, 36, 14, 10);
    g.strokeEllipse(8, 26, 12, 14);
    g.strokeEllipse(4, 16, 10, 12);

    g.fillStyle(O);
    g.fillEllipse(32, 32, 40, 20);
    g.fillStyle(L);
    g.fillEllipse(32, 26, 32, 6);
    g.fillStyle(W);
    g.fillEllipse(32, 38, 26, 8);
    g.lineStyle(2, K);
    g.strokeEllipse(32, 32, 40, 20);

    let a = 4, b = 4, c = 4, d = 4;
    if (type === 'walk1') { a = 6; b = 2; c = 2; d = 6; }
    else if (type === 'walk2') { a = 2; b = 6; c = 6; d = 2; }
    else if (type === 'jump') { a = 0; b = 0; c = 0; d = 0; }

    const leg = (x, extra) => {
      g.fillStyle(O);
      g.fillRect(x, 40, 5, 4 + extra);
      g.fillStyle(K);
      g.fillRect(x, 42 + extra, 5, 2);
      g.lineStyle(1.5, K);
      g.strokeRect(x, 40, 5, 4 + extra);
    };
    leg(20, a);
    leg(28, b);
    leg(40, c);
    leg(48, d);

    g.fillStyle(O);
    g.fillCircle(50, 22, 11);
    g.fillStyle(L);
    g.fillEllipse(50, 16, 14, 4);
    g.lineStyle(2, K);
    g.strokeCircle(50, 22, 11);

    g.fillStyle(O);
    g.fillTriangle(41, 16, 44, 2, 50, 16);
    g.fillTriangle(53, 16, 58, 2, 60, 15);
    g.fillStyle(P);
    g.fillTriangle(44, 15, 46, 6, 48, 14);
    g.fillTriangle(55, 15, 57, 6, 59, 14);
    g.lineStyle(1.5, K);
    g.strokeTriangle(41, 16, 44, 2, 50, 16);
    g.strokeTriangle(53, 16, 58, 2, 60, 15);

    g.fillStyle(W);
    g.fillCircle(57, 26, 5);
    g.lineStyle(1, K);
    g.strokeCircle(57, 26, 5);

    g.fillStyle(K);
    g.fillCircle(60, 24, 1.8);

    g.lineStyle(1.8, K);
    g.beginPath();
    g.arc(57, 27, 2.8, 0.1, Math.PI - 0.1);
    g.strokePath();

    g.lineStyle(2, K);
    g.beginPath();
    g.arc(48, 20, 2.6, Math.PI + 0.2, Math.PI * 2 - 0.2);
    g.strokePath();

    g.fillStyle(K);
    g.fillCircle(48.2, 18.7, 0.6);

    g.fillStyle(P, 0.85);
    g.fillCircle(44, 25, 2.4);
  }

  tekenRoeltjeBukken(g) {
    const O = 0xff7a1a;
    const L = 0xff9a3a;
    const D = 0xb04510;
    const W = 0xffffff;
    const K = 0x2b1a10;
    const P = 0xff8ea8;

    g.clear();

    g.fillStyle(O);
    g.fillEllipse(8, 30, 12, 8);
    g.fillEllipse(3, 23, 8, 10);
    g.fillStyle(W);
    g.fillCircle(2, 19, 4);
    g.lineStyle(1.5, K);
    g.strokeEllipse(8, 30, 12, 8);
    g.strokeEllipse(3, 23, 8, 10);

    g.fillStyle(O);
    g.fillEllipse(30, 30, 48, 14);
    g.fillStyle(L);
    g.fillEllipse(30, 25, 36, 4);
    g.fillStyle(W);
    g.fillEllipse(30, 33, 32, 6);
    g.lineStyle(2, K);
    g.strokeEllipse(30, 30, 48, 14);

    g.fillStyle(O);
    g.fillCircle(52, 24, 9);
    g.lineStyle(1.5, K);
    g.strokeCircle(52, 24, 9);

    g.fillStyle(O);
    g.fillTriangle(45, 20, 48, 10, 52, 22);
    g.fillTriangle(54, 22, 58, 10, 61, 20);
    g.fillStyle(P);
    g.fillTriangle(47, 19, 48, 13, 50, 21);
    g.fillTriangle(55, 21, 57, 13, 59, 19);
    g.lineStyle(1.5, K);
    g.strokeTriangle(45, 20, 48, 10, 52, 22);
    g.strokeTriangle(54, 22, 58, 10, 61, 20);

    g.fillStyle(W);
    g.fillCircle(58, 28, 4);
    g.lineStyle(1, K);
    g.strokeCircle(58, 28, 4);

    g.fillStyle(K);
    g.fillCircle(60, 26, 1.5);

    g.lineStyle(1.5, K);
    g.beginPath();
    g.arc(58, 29, 2.4, 0.1, Math.PI - 0.1);
    g.strokePath();

    g.lineStyle(2, K);
    g.beginPath();
    g.arc(50, 22, 2.2, Math.PI + 0.2, Math.PI * 2 - 0.2);
    g.strokePath();

    g.fillStyle(P, 0.85);
    g.fillCircle(46, 26, 2);

    g.fillStyle(O);
    g.fillEllipse(18, 36, 10, 6);
    g.fillEllipse(44, 36, 10, 6);
    g.lineStyle(1.5, K);
    g.strokeEllipse(18, 36, 10, 6);
    g.strokeEllipse(44, 36, 10, 6);
  }

  tekenBeer(g) {
    const B = 0x8a5a3a;
    const L = 0xa07a4a;
    const D = 0x5a3820;
    const S = 0xf0d0a0;
    const K = 0x2b1a10;
    const W = 0xffffff;

    g.clear();

    g.fillStyle(B);
    g.fillEllipse(56, 36, 96, 32);
    g.fillStyle(L);
    g.fillEllipse(56, 26, 72, 10);
    g.fillStyle(D);
    g.fillEllipse(56, 46, 88, 10);
    g.lineStyle(2, K);
    g.strokeEllipse(56, 36, 96, 32);

    g.fillStyle(B);
    g.fillCircle(92, 26, 16);
    g.fillStyle(L);
    g.fillEllipse(92, 18, 18, 4);
    g.lineStyle(2, K);
    g.strokeCircle(92, 26, 16);

    g.fillStyle(B);
    g.fillCircle(84, 12, 5);
    g.fillCircle(100, 12, 5);
    g.fillStyle(D);
    g.fillCircle(84, 13, 2.5);
    g.fillCircle(100, 13, 2.5);
    g.lineStyle(1.5, K);
    g.strokeCircle(84, 12, 5);
    g.strokeCircle(100, 12, 5);

    g.fillStyle(S);
    g.fillCircle(100, 32, 6);
    g.lineStyle(1.5, K);
    g.strokeCircle(100, 32, 6);

    g.fillStyle(K);
    g.fillCircle(102, 30, 2.5);

    g.lineStyle(2, K);
    g.lineBetween(82, 24, 88, 24);
    g.lineBetween(83, 25, 87, 25);

    g.fillStyle(B);
    g.fillEllipse(20, 52, 16, 8);
    g.fillEllipse(38, 52, 16, 8);
    g.fillEllipse(68, 52, 16, 8);
    g.lineStyle(1.5, K);
    g.strokeEllipse(20, 52, 16, 8);
    g.strokeEllipse(38, 52, 16, 8);
    g.strokeEllipse(68, 52, 16, 8);
  }

  tekenAppel(g) {
    const R = 0xdd2020;
    const L = 0xff5040;
    const DR = 0x8a1010;
    const G = 0x2a8a2a;
    const T = 0x4a2810;
    const K = 0x2b1a10;
    const W = 0xffffff;

    g.clear();

    g.fillStyle(G);
    g.fillTriangle(16, 2, 24, 6, 18, 10);
    g.lineStyle(1, K);
    g.strokeTriangle(16, 2, 24, 6, 18, 10);

    g.fillStyle(T);
    g.fillRect(13, 4, 2, 6);

    g.fillStyle(R);
    g.fillCircle(14, 20, 11);
    g.fillStyle(L);
    g.fillEllipse(10, 15, 7, 4);
    g.fillStyle(DR);
    g.fillEllipse(18, 26, 6, 3);
    g.lineStyle(1.5, K);
    g.strokeCircle(14, 20, 11);
  }

  tekenHuisje(g) {
    const Wa = 0xf4c070;
    const Wb = 0xd4a050;
    const Ro = 0xc03020;
    const Ra = 0x801818;
    const Do = 0x6a3010;
    const Di = 0x3a1800;
    const Ch = 0x8a5030;
    const Sk = 0xe8e8e8;
    const Gl = 0x3090e0;
    const Gd = 0x1a4a80;
    const Kn = 0xffd900;
    const K = 0x2b1a10;

    g.clear();

    g.fillStyle(Ch);
    g.fillRect(72, 20, 12, 20);
    g.lineStyle(2, K);
    g.strokeRect(72, 20, 12, 20);

    g.fillStyle(Sk);
    g.fillCircle(78, 14, 5);
    g.fillCircle(86, 8, 4);
    g.fillCircle(92, 2, 3);

    g.fillStyle(Ro);
    g.fillTriangle(8, 52, 104, 52, 56, 12);
    g.fillStyle(Ra);
    g.fillTriangle(8, 52, 56, 52, 56, 12);
    g.lineStyle(2, K);
    g.strokeTriangle(8, 52, 104, 52, 56, 12);

    g.fillStyle(Wa);
    g.fillRect(16, 52, 80, 52);
    g.fillStyle(Wb);
    g.fillRect(16, 94, 80, 10);
    g.lineStyle(2, K);
    g.strokeRect(16, 52, 80, 52);

    for (let y = 58; y < 100; y += 12) {
      g.lineStyle(1, 0xd4a050, 0.6);
      g.lineBetween(18, y, 94, y);
    }

    g.fillStyle(Do);
    g.fillRect(48, 68, 16, 36);
    g.fillStyle(Di);
    g.fillRect(48, 68, 4, 36);
    g.lineStyle(1.5, K);
    g.strokeRect(48, 68, 16, 36);
    g.fillStyle(Kn);
    g.fillCircle(60, 86, 1.5);

    const raam = (x, y) => {
      g.fillStyle(Gl);
      g.fillRect(x, y, 14, 14);
      g.fillStyle(Gd);
      g.fillRect(x, y, 14, 4);
      g.fillStyle(Wa);
      g.fillRect(x + 6, y, 2, 14);
      g.fillRect(x, y + 6, 14, 2);
      g.lineStyle(1.5, K);
      g.strokeRect(x, y, 14, 14);
    };
    raam(22, 62);
    raam(76, 62);
  }

  tekenBoom(g) {
    const T = 0x5a3818;
    const Ts = 0x3a2008;
    const Pl = 0x3a9030;
    const Pd = 0x1a5a1a;
    const Sn = 0xffffff;
    const K = 0x2b1a10;

    g.clear();

    g.fillStyle(T);
    g.fillRect(26, 96, 12, 24);
    g.fillStyle(Ts);
    g.fillRect(26, 96, 3, 24);
    g.lineStyle(2, K);
    g.strokeRect(26, 96, 12, 24);

    const trian = (cx, topY, botY, w) => {
      g.fillStyle(Pl);
      g.fillTriangle(cx - w, botY, cx + w, botY, cx, topY);
      g.fillStyle(Pd);
      g.fillTriangle(cx - w, botY, cx - w / 3, botY, cx - w * 0.5, (topY + botY) / 2);
      g.lineStyle(2, K);
      g.strokeTriangle(cx - w, botY, cx + w, botY, cx, topY);
    };
    trian(32, 0, 48, 28);
    trian(32, 24, 72, 26);
    trian(32, 52, 100, 24);
  }

  tekenGrond(g) {
    const G1 = 0x5ec030;
    const G2 = 0x3a9020;
    const G3 = 0x70d03a;
    const Da = 0x8a5a2a;
    const Db = 0x6a3a1a;
    const Dc = 0x4a2810;
    const K = 0x2b1a10;

    g.clear();

    g.fillStyle(G2);
    g.fillRect(0, 0, 32, 6);
    g.fillStyle(G1);
    g.fillRect(0, 0, 32, 3);
    g.fillStyle(G3);
    for (let i = 0; i < 4; i++) {
      g.fillRect(2 + i * 8, 0, 2, 2);
    }

    g.fillStyle(Da);
    g.fillRect(0, 6, 32, 26);
    g.fillStyle(Db);
    g.fillRect(0, 22, 32, 10);
    g.fillStyle(Dc);
    const stenen = [[5, 12], [18, 14], [10, 20], [24, 24], [14, 28], [4, 26]];
    stenen.forEach(([x, y]) => g.fillRect(x, y, 3, 3));
    g.fillStyle(0xaa7a40);
    stenen.forEach(([x, y]) => g.fillRect(x, y, 1, 1));

    g.fillStyle(K);
    g.fillRect(0, 30, 32, 2);
  }

  tekenTak(g) {
    const Wl = 0x8a5020;
    const Wd = 0x6a3818;
    const L1 = 0x3a9030;
    const L2 = 0x1a5a1a;
    const K = 0x2b1a10;

    g.clear();

    g.fillStyle(Wl);
    g.fillRect(0, 6, 120, 10);
    g.fillStyle(Wd);
    g.fillRect(0, 12, 120, 4);
    g.fillRect(10, 8, 30, 1);
    g.fillRect(50, 10, 20, 1);
    g.fillRect(80, 9, 25, 1);
    g.lineStyle(1.5, K);
    g.strokeRect(0, 6, 120, 10);

    g.fillStyle(L1);
    g.fillCircle(15, 6, 6);
    g.fillCircle(40, 4, 8);
    g.fillCircle(70, 6, 7);
    g.fillCircle(100, 4, 8);
    g.fillStyle(L2);
    g.fillCircle(15, 7, 3);
    g.fillCircle(40, 6, 4);
    g.fillCircle(70, 7, 3);
    g.fillCircle(100, 6, 4);
  }

  tekenHeuvel(g) {
    const H1 = 0x60b840;
    const H2 = 0x3a8a2a;
    const H3 = 0x2a6a1a;
    const K = 0x2b1a10;

    g.clear();

    g.fillStyle(H2);
    g.fillEllipse(120, 140, 240, 180);
    g.fillStyle(H1);
    g.fillEllipse(120, 130, 220, 160);
    g.fillStyle(H3);
    g.fillCircle(60, 80, 8);
    g.fillCircle(90, 70, 6);
    g.fillCircle(150, 75, 7);
    g.fillCircle(180, 85, 6);
  }

  tekenWolk(g) {
    g.clear();
    g.fillStyle(0xffffff);
    g.fillRoundedRect(4, 10, 72, 24, { tl: 14, tr: 14, bl: 12, br: 12 });
    g.fillCircle(20, 14, 12);
    g.fillCircle(40, 8, 14);
    g.fillCircle(58, 14, 11);
    g.fillStyle(0xe8f0ff);
    g.fillRoundedRect(4, 24, 72, 10, { tl: 0, tr: 0, bl: 12, br: 12 });
  }

  tekenMaan(g) {
    g.clear();
    g.fillStyle(0xfff0a0);
    g.fillCircle(32, 32, 26);
    g.fillStyle(0x1a2a4a);
    g.fillCircle(24, 26, 24);
    g.fillStyle(0xffffff);
    g.fillCircle(44, 22, 1.5);
    g.fillCircle(40, 36, 1.2);
    g.lineStyle(1.5, 0x2b1a10);
    g.strokeCircle(32, 32, 26);
  }

  tekenSter(g) {
    g.clear();
    g.fillStyle(0xffee66);
    g.fillTriangle(6, 0, 10, 7, 2, 7);
    g.fillTriangle(6, 12, 10, 5, 2, 5);
    g.fillTriangle(0, 6, 7, 10, 7, 2);
    g.fillTriangle(12, 6, 5, 10, 5, 2);
  }

  tekenTaartBodem(g) {
    g.clear();
    g.fillStyle(0x8a5a2a);
    g.fillEllipse(80, 40, 150, 70);
    for (let i = 0; i < 18; i++) {
      const ang = (i / 18) * Math.PI * 2;
      const cx = 80 + Math.cos(ang) * 72;
      const cy = 40 + Math.sin(ang) * 32;
      g.fillCircle(cx, cy, 6);
    }
    g.fillStyle(0xf5d99c);
    g.fillEllipse(80, 40, 118, 48);
    g.fillStyle(0xe8c070);
    g.fillEllipse(80, 48, 100, 10);
    g.lineStyle(2, 0x2b1a10);
    g.strokeEllipse(80, 40, 150, 70);
  }

  tekenTaartKlaar(g) {
    g.clear();
    g.fillStyle(0x8a5020);
    g.fillEllipse(80, 40, 150, 70);
    for (let i = 0; i < 18; i++) {
      const ang = (i / 18) * Math.PI * 2;
      const cx = 80 + Math.cos(ang) * 72;
      const cy = 40 + Math.sin(ang) * 32;
      g.fillCircle(cx, cy, 6);
    }
    g.fillStyle(0xcc6a30);
    g.fillEllipse(80, 40, 118, 48);
    g.fillStyle(0xb85020);
    g.fillEllipse(80, 50, 100, 10);
    g.fillStyle(0xd8904a);
    for (let i = -2; i <= 2; i++) {
      g.fillRect(28 + (i + 2) * 22, 18, 8, 44);
    }
    for (let j = 0; j < 3; j++) {
      g.fillRect(28, 18 + j * 15, 110, 6);
    }
    g.lineStyle(2, 0x2b1a10);
    g.strokeEllipse(80, 40, 150, 70);
  }

  tekenStoom(g) {
    g.clear();
    g.fillStyle(0xffffff, 0.85);
    g.fillCircle(24, 28, 14);
    g.fillCircle(16, 20, 10);
    g.fillCircle(32, 20, 11);
    g.fillCircle(24, 14, 9);
  }

  tekenOven(g) {
    g.clear();
    g.fillStyle(0x6a6a6a);
    g.fillRect(0, 0, 260, 200);
    g.fillStyle(0x4a4a4a);
    g.fillRect(0, 0, 260, 20);
    g.fillStyle(0x2a2a2a);
    g.fillRect(20, 40, 220, 140);
    g.fillStyle(0xffb060);
    g.fillRect(30, 50, 200, 120);
    g.fillStyle(0x6a3010);
    g.fillRect(30, 160, 200, 10);
    g.fillStyle(0x8a8a8a);
    g.fillRect(80, 8, 100, 6);
    g.lineStyle(3, 0x2b1a10);
    g.strokeRect(0, 0, 260, 200);
    g.strokeRect(20, 40, 220, 140);
  }

  tekenZz(g) {
    const K = 0x2b1a10;
    g.clear();

    const tekenZ = (x, y, size) => {
      g.fillStyle(0xffffff);
      g.fillRect(x, y, size, size * 0.25);
      g.fillRect(x + size * 0.75, y, size * 0.25, size * 0.5);
      g.fillRect(x + size * 0.5, y + size * 0.25, size * 0.25, size * 0.5);
      g.fillRect(x + size * 0.25, y + size * 0.5, size * 0.25, size * 0.25);
      g.fillRect(x, y + size * 0.75, size, size * 0.25);
      g.lineStyle(1, K);
      g.strokeRect(x, y, size, size);
    };
    tekenZ(2, 22, 12);
    tekenZ(22, 12, 16);
    tekenZ(46, 2, 22);
  }
}
