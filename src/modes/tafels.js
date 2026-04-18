const Tafels = {
  volgendeSom() {
    const a = Phaser.Utils.Array.GetRandom([1, 2, 5, 10]);
    const b = Phaser.Math.Between(1, 10);
    const juist = a * b;
    const opties = new Set([juist]);
    while (opties.size < 3) {
      const offset = Phaser.Math.Between(-3, 3);
      const kandidaat = juist + offset;
      if (kandidaat > 0 && kandidaat !== juist) {
        opties.add(kandidaat);
      }
    }
    return {
      vraag: `${a} × ${b} = ?`,
      plaatjes: 0,
      juist,
      opties: Phaser.Utils.Array.Shuffle([...opties]),
    };
  },
};
