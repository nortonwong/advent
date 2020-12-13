/* 2015-21 RPG */
((input = document.body.innerText.trim(), store) => {
	class Stats {
		constructor(hp = 0, dmg = 0, def = 0) {
			Object.assign(this, { hp, dmg, def });
		}
		alive() {
			return this.hp > 0;
		}
		suffer(dmg) {
			return this.equip({ hp: -Math.max(1, dmg - this.def) });
		}
		equip({ hp = 0, dmg = 0, def = 0 }) {
			return new Stats(this.hp + hp, this.dmg + dmg, this.def + def);
		}
		battle(other) {
			let self = this;
			while (true) {
				other = other.suffer(self.dmg);
				if (!other.alive()) {
					return true;
				}
				self = self.suffer(other.dmg);
				if (!self.alive()) {
					return false;
				}
			}
		}
	}
	const boss = new Stats(...input.split('\n').map(attr => attr.split(': ')[1]).map(Number));
	const player = new Stats(100);
	class Item {
		constructor(name, cost, dmg, def) {
			Object.assign(this, { name, cost, dmg, def });
		}
	}
	store = store.split('\n\n').map(shelf => {
		const [header, ...items] = shelf.split('\n');
		const [type] = header.split(': ');
		return {
			type,
			min: { Weapons: 1, Armor: 0, Rings: 0 }[type],
			max: { Weapons: 1, Armor: 1, Rings: 2 }[type],
			items: items.map(item => item.split(/\s\s+/)).map(([name, ...stats]) => new Item(name, ...stats.map(Number))),
		};
	});
	function combinationsOf(n, c) {
		if (typeof n != 'number' || typeof c != 'number') {
			throw new Error(`n, c: ${n}, ${c}`);
		}
		if (n < c) {
			throw new Error(`n < c: ${n} < ${c}`);
		}
		if (c == 0) {
			return [0];
		}
		if (n == c) {
			return [2**n - 1];
		}
		const current = 2**(n-1);
		const inclusive = combinationsOf(n - 1, c - 1).map(s => s | current);
		const exclusive = combinationsOf(n - 1, c);
		return [...inclusive, ...exclusive];
	}
	const options = store.map(shelf => {
		const combinations = [];
		combinations.type = shelf.type;
		const N = shelf.items.length;
		for (let ambition = shelf.min; ambition <= shelf.max; ambition++) {
			for (const possibility of combinationsOf(N, ambition)) {
					combinations.push(shelf.items.filter((item, i) => (possibility >> (N-1)-i) & 1));
			}
		}
		return combinations;
	});
	const ensembles = options.reduce((a, b) => a.flatMap(aa => b.map(bb => [...aa, ...bb]))).map(e => {
		e.cost = e.map(i => i.cost).reduce((a, b) => a + b);
		e.player = e.reduce((acc, i) => acc.equip(i), player);
		e.win = e.player.battle(boss);
		return e;
	}).sort((a, b) => a.cost - b.cost);
	const cheapestWin = ensembles.find(e => e.win);
	const costliestLoss = ensembles.reverse().find(e => !e.win);
	return [cheapestWin, costliestLoss];
})(`Hit Points: 109
Damage: 8
Armor: 2`, `Weapons:    Cost  Damage  Armor
Dagger        8     4       0
Shortsword   10     5       0
Warhammer    25     6       0
Longsword    40     7       0
Greataxe     74     8       0

Armor:      Cost  Damage  Armor
Leather      13     0       1
Chainmail    31     0       2
Splintmail   53     0       3
Bandedmail   75     0       4
Platemail   102     0       5

Rings:      Cost  Damage  Armor
Damage +1    25     1       0
Damage +2    50     2       0
Damage +3   100     3       0
Defense +1   20     0       1
Defense +2   40     0       2
Defense +3   80     0       3`);