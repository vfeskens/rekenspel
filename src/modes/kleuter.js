const Kleuter = {
  volgendeSom() {
    const juist = Phaser.Math.Between(1, 10);
    const opties = new Set([juist]);
    while (opties.size < 3) {
      const offset = Phaser.Math.Between(-2, 2);
      const kandidaat = juist + offset;
      if (kandidaat >= 1 && kandidaat <= 10 && kandidaat !== juist) {
        opties.add(kandidaat);
      }
    }
    return {
      vraag: 'Hoeveel appels zie je?',
      plaatjes: juist,
      juist,
      opties: Phaser.Utils.Array.Shuffle([...opties]),
    };
  },
};
