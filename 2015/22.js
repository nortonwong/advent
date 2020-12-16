/* 2015-22 Wizard */
((input = document.body.innerText.trim()) => {
	class Effects extends Array {
		sum(key) {
			return this.filter(effect => key in effect).reduce((acc, e) => acc + e[key], 0);
		}
		has(name) {
			return this.some(effect => effect.name.startsWith(name));
		}
	}
	class Stats {
		constructor(hp = 0, dmg = 0, def = 0, mana = 0, spells = [], effects = []) {
			effects = new Effects(...effects);
			Object.assign(this, { hp, dmg, def, mana, spells, effects });
		}
		alive() {
			return this.hp > 0 && this.mana >= 0;
		}
		suffer(dmg) {
			if (typeof dmg !== 'number') {
				throw new Error(dmg);
			}
			if (dmg === 0) {
				return this;
			}
			const def = this.def + this.effects.sum('def');
			return this.math({ hp: -Math.max(1, dmg - def) });
		}
		elapse() {
			const mana = this.effects.sum('mana');
			const effects = this.effects
				.map(({ dur, ...rest }) => ({ dur: dur - 1, ...rest }))
				.filter(effect => effect.dur);
			return this.math({ mana }).replace({ effects });
		}
		cast(name, other) {
			if (this.effects.has(name)) {
				return false;
			}
			const spell = this.spells.find(spell => spell.name.startsWith(name));
			const mana = this.mana - spell.cost;
			if (mana < 0) {
				return false;
			}
			const effects = spell.dur()
				? [...this.effects, spell.spawn()]
				: this.effects;
			const dmg = spell.instant('dmg');
			const hp = spell.instant('hp');
			const self = this.math({ hp }).replace({ mana, effects });
			other = other?.suffer(dmg);
			return other ? [self, other] : self;
		}
		math({ hp = 0, dmg = 0, def = 0, mana = 0 }) {
			return this.replace({ hp: this.hp + hp, dmg: this.dmg + dmg, def: this.def + def, mana: this.mana + mana });
		}
		replace(stats) {
			return new Stats(...['hp', 'dmg', 'def', 'mana', 'spells', 'effects'].map(k => stats[k] ?? this[k]));
		}
		battle(other, history = ['', 0], hard = false) {
			const dmg = this.dmg + this.effects.sum('dmg');
			let self = this;
			if (hard) {
				self = self.suffer(1);
			}
			if (!self.alive()) {
				return [];
			}
			self = self.elapse();
			other = other.suffer(dmg);
			const selfTurn = self.spells
				.map(({ name, cost }) => {
					const next = self.cast(name, other);
					if (!next) {
						return false;
					}
					const [nextSelf, nextOther] = next;
					return {
						choice: name,
						history: [history[0] + name.charAt(0), history[1] + cost],
						nextSelf,
						nextOther,
						win: !nextOther.alive(),
					};
				})
				.filter(future => future);
			const otherTurn = selfTurn
				.map(future => {
					let { win, nextSelf, nextOther } = future;
					if (win) {
						return future;
					}
					nextSelf = nextSelf.elapse();
					nextOther = nextOther.suffer(nextSelf.effects.sum('dmg'));
					if (!nextOther.alive()) {
						return {
							...future,
							nextSelf,
							nextOther,
							win: true,
						};
					}
					nextSelf = nextSelf.suffer(nextOther.dmg);
					if (!nextSelf.alive()) {
						return false;
					}
					return {
						...future,
						nextSelf,
						nextOther,
						win: false,
					};
				})
				.filter(future => future);
			return otherTurn;
		}
	}
	const boss = new Stats(...input.split('\n').map(attr => attr.split(': ')[1]).map(Number));
	class Spell {
		constructor(name, cost, stats) {
			Object.assign(this, { name, cost, stats });
		}
		dur() {
			return 'dur' in this.stats;
		}
		instant(key) {
			return this.dur() ? 0 : this.stats[key] ?? 0;
		}
		spawn() {
			if (!this.dur()) {
				throw new Error(this);
			}
			return { name: this.name, ...this.stats };
		}
	}
	const player = new Stats(50, 0, 0, 500, [
		new Spell('missile',   53, { dmg: 4 }),
		new Spell('drain',     73, { dmg: 2, hp: 2 }),
		new Spell('shield',   113, { dur: 6, def: 7 }),
		new Spell('poison',   173, { dur: 6, dmg: 3 }),
		new Spell('recharge', 229, { dur: 5, mana: 101 }),
	]);
	function simulate(player, boss, hard = false) {
		let futures = player.battle(boss, undefined, hard);
		let win;
		let limit = Number.MAX_SAFE_INTEGER;
		while (true) {
			const newWins = futures.filter(f => f.win);
			for (const forecast of newWins) {
				const cost = forecast.history[1];
				if (cost < limit) {
					limit = cost;
					win = forecast;
				}
			}
			if (futures.every(f => f.history[1] > limit)) {
				return win;
			}
			futures = futures.flatMap(f => f.nextSelf.battle(f.nextOther, f.history, hard));
		}
	};
	const example1 = function () {
		let self = new Stats(10, 0, 0, 250, player.spells);
		let boss = new Stats(13, 8);
		return simulate(self, boss).history[0] === 'pm';
	}();
	const example2 = function () {
		let self = new Stats(10, 0, 0, 250, player.spells);
		let boss = new Stats(14, 8);
		return simulate(self, boss).history[0] === 'rsdpm';
	}();
	return [example1, example2, simulate(player, boss), simulate(player, boss, true)];
})(`Hit Points: 51
Damage: 9`);