/* 2020-20 Map */
((input = document.body.innerText.trim().split('\n\n')) => {
	function range(n) {
		return Array.from({ length: n }).map((_, i) => i);
	}
	const rotations = range(4);
	function flip(s) {
		return [...s].reverse().join('');
	}
	function matchEdge(edge, matchable) {
		return !matchable
			|| (matchable instanceof Array && matchable.includes(edge))
			|| (matchable instanceof Set && matchable.has(edge))
			|| matchable === edge;
	}
	const map = range(12).map(() => []);
	map.toString = () => '\n' + map.map(row => row.map(tile => (
		tile instanceof Tile
			? `#${tile.id}`.padStart(5)
			: tile instanceof Set
				? `(${tile.size})`.padStart(5)
				: '???'
	)).join(' ')).join('\n') + '\n';
	const solved = new Set();
	class Transformable extends Array {
		generateTransformations() {
			// 4 rotations (0, 90, 180, 270)
			// 2 orientations (cw, ccw)
			const rotated = rotations.map(n => this.rotate(n));
			const orientations = rotated.flatMap(r => [r, r.flip()]);
			return orientations;
		}
		rotate(n) {
			const s = this.length;
			if (this.some(row => row.length !== s)) {
				throw this;
			}
			const data = new Array(s).fill('');
			switch (n) {
				case 0: return this;
				case 1: {
					for (let r = 0; r < s; r++) {
						for (let c = 0; c < s; c++) {
							data[r] += this[c][s - 1 - r];
						}
					}
					return new this.__proto__.constructor(...data);
				}
				case 2: {
					for (let r = 0; r < s; r++) {
						for (let c = 0; c < s; c++) {
							data[r] += this[s - 1 - r][s - 1 - c];
						}
					}
					return new this.__proto__.constructor(...data);
				};
				case 3: {
					for (let r = 0; r < s; r++) {
						for (let c = 0; c < s; c++) {
							data[r] += this[s - 1 - c][r];
						}
					}
					return new this.__proto__.constructor(...data);
				};
			}
		}
		flip() {
			return this.map(flip);
		}
	}
	class Variant extends Transformable {
		get t() {
			return this[0];
		}
		get r() {
			return this._r || (this._r = range(10).map(r => this[r][9]).join(''));
		}
		get b() {
			return this[9];
		}
		get l() {
			return this._l || (this._l = range(10).map(r => this[r][0]).join(''));
		}
		matches(condition) {
			if (this === condition) {
				return true;
			}
			const [top, right, bottom, left] = condition;
			const { t, r, b, l } = this;
			return matchEdge(t, top) && matchEdge(r, right) && matchEdge(b, bottom) && matchEdge(l, left);
		}
		unwrap(dest, x, y) {
			for (let r = 0; r < 8; r++) {
				for (let c = 0; c < 8; c++) {
					dest[x + r] ??= [];
					dest[x + r][y + c] = this[r + 1][c + 1];
				}
			}
		}
	}
	class Tile {
		constructor(id, variants) {
			Object.assign(this, { id, variants });
		}
		locate(r, c) {
			this.unambiguous();
			const choices = map[r][c];
			if (!choices.has(this)) {
				throw choices;
			}
			if (this.r !== undefined || this.c !== undefined || solved.has(this)) {
				throw [this.r, this.c];
			}
			Object.assign(this, { r, c });
			map[r][c] = this;
			solved.add(this);
			choices.delete(this);
			const above = map[r-1]?.[c]?.bottom;
			const rightward = map[r]?.[c+1]?.left;
			const below = map[r+1]?.[c]?.top;
			const leftward = map[r]?.[c-1]?.right;
			if (above && this.top !== above) {
				throw above;
			}
			if (rightward && this.right !== rightward) {
				throw rightward;
			}
			if (below && this.bottom !== below) {
				throw below;
			}
			if (leftward && this.left !== leftward) {
				throw leftward;
			}
		}
		assign(conditionEdges) {
			this.variants = this.variants.filter(v => v.matches(conditionEdges));
			if (!this.variants.length) {
				throw conditionEdges;
			}
			if (this.variants.length === 1) {
				return true;
			}
		}
		unambiguous() {
			if (this.variants.length !== 1) {
				throw this.variants;
			}
		}
		get variantEdges() {
			return this.variants.flatMap(({ t, r, b, l }) => [t, r, b, l]);
		}
		get top() {
			return this.variant.t;
		}
		get right() {
			return this.variant.r;
		}
		get bottom() {
			return this.variant.b;
		}
		get left() {
			return this.variant.l;
		}
		get variant() {
			this.unambiguous();
			return this.variants[0];
		}
		get variants() {
			return this._variants;
		}
		set variants(variants) {
			if (!variants.every(v => v instanceof Variant)) {
				throw variants;
			}
			this._variants = variants;
		}
	}
	const tiles = input.map((section) => {
		const [header, ...tile] = section.split('\n');
		const id = Number(header.match(/\d+/)[0]);
		return new Tile(id, new Variant(...tile).generateTransformations());
	});
	function match(variantA, variantB) {
		return variantA.filter(edge => variantB.includes(edge));
	}
	function matchAny(tile, ignore = new Set()) {
		const others = new Set(tiles.filter((_, i) => !ignore.has(i)).flatMap(tile => tile.variantEdges));
		const edges = new Set(tile.variantEdges);
		return [...edges].filter(edge => others.has(edge));
	}
	const connectionScores = tiles.map((tile, i) => ({ tile, matches: matchAny(tile, new Set([i])) }));
	const corners = connectionScores.filter(({ matches }) => matches.length === 4);
	const borders = connectionScores.filter(({ matches }) => matches.length === 6);
	const interiors = connectionScores.filter(({ matches }) => matches.length === 8);
	for (const array of [corners, borders, interiors]) {
		array.tiles = new Set(array.map(({ tile }) => tile));
	}
	for (let r = 0; r < 12; r++) {
		for (let c = 0; c < 12; c++) {
			map[r][c] = interiors.tiles;
		}
	}
	for (let n = 1; n < 11; n++) {
		map[n][0] = map[n][11] = borders.tiles;
		map[0][n] = map[11][n] = borders.tiles;
	}
	map[0][0] = map[0][11] = map[11][11] = map[11][0] = corners.tiles;
	const answerA = [...corners.tiles].map(tile => tile.id).reduce((a, b) => a * b);
	// arbitrarily pick a corner and orientation
	const { tile: topLeft, matches: innerEdges } = corners[0];
	topLeft.assign([, innerEdges, innerEdges, ]);
	topLeft.assign(topLeft.variants[0]);
	topLeft.locate(0, 0);
	function findVariant(conditionEdges, candidates) {
		return [...candidates]
			.filter(tile => !solved.has(tile))
			.map(tile => [tile, tile.variants.filter(v => v.matches(conditionEdges))])
			.filter(([tile, variants]) => variants.length);
	}
	function narrow(r, c) {
		const above = map[r-1]?.[c]?.bottom;
		const rightward = map[r]?.[c+1]?.left;
		const below = map[r+1]?.[c]?.top;
		const leftward = map[r]?.[c-1]?.right;
		const choices = map[r][c];
		if (!(choices instanceof Set)) {
			return;
		}
		const conditionEdges = [above, rightward, below, leftward];
		const adjacencies = findVariant(conditionEdges, choices);
		if (adjacencies.length !== 1) {
			return;
		}
		const [[neighbor]] = adjacencies;
		if (neighbor.assign(conditionEdges)) {
			neighbor.locate(r, c);
			return true;
		}
	}
	function narrowAll() {
		let changed = false;
		for (let n = 0; n < 12; n++) {
			for (let m = 0; m < 12; m++) {
				changed |= narrow(n, m);
				changed |= narrow(m, n);
			}
		}
		return changed;
	}
	while (narrowAll()) {
	}
	const text = [];
	map.forEach((row, mr) => row.forEach((tile, mc) => tile.variant.unwrap(text, mr * 8, mc * 8)));
	const monster = `..................#.
#....##....##....###
.#..#..#..#..#..#...`.split('\n');
	const monsterHeight = monster.length;
	const monsterWidth = monster[0].length;
	const monsterCoords = range(monsterHeight)
		.flatMap(r => range(monsterWidth).map(c => [r, c]))
		.filter(([r, c]) => monster[r][c] === '#');
	monsterCoords.shift = (dr, dc) => monsterCoords.map(([r, c]) => [r + dr, c + dc]);
	class MonsterSearcher extends Transformable {
		flaggedCoords = [];
		countMonsters() {
			let count = 0;
			for (let r = 0; r < this.length - monsterHeight; r++) {
				for (let c = 0; c < this[r].length - monsterWidth; c++) {
					const coords = monsterCoords.shift(r, c);
					if (coords.every(([mr, mc]) => this[mr][mc] === '#')) {
						count++;
						this.flaggedCoords.push(...coords);
					}
				}
			}
			return count;
		}
		countWater() {
			const flags = new Set(this.flaggedCoords.map(c => c.join()));
			return [...this.join('')].filter(c => c === '#').length - flags.size;
		}
	}
	const searcher = new MonsterSearcher(...text.map(row => row.join('')));
	const waterScores = searcher.generateTransformations()
		.map(searcher => [searcher.countMonsters(), searcher.countWater()]);
	const answerB = waterScores.filter(([monsters]) => monsters)[0][1];
	return [answerA, answerB];
})();