/* 2020-24 Hexagons */
(async (turns = 0, input = document.body.innerText.trim()) => {
	input = input.split('\n').map(cmd => cmd.split(/(?<=[ew])/));
	const dirs = {
		w: [-2, 0],
		e: [+2, 0],
		nw: [-1, -1],
		se: [+1, +1],
		ne: [+1, -1],
		sw: [-1, +1],
	};
	function parity(n) {
		return Math.abs(n % 2);
	}
	function checkParity(expected, key) {
		key = Number(key);
		if (Number.isNaN(key)) {
			return;
		}
		if (parity(expected) !== parity(key)) {
			throw ['bad parity', expected, key];
		}
	}
	const tiles = {};
 	let minX = Infinity, maxX = -Infinity;
	let minY = Infinity, maxY = -Infinity;
	function assign(x, y, v) {
		minX = Math.min(minX, x);
		maxX = Math.max(maxX, x);
		minY = Math.min(minY, y);
		maxY = Math.max(maxY, y);
		tiles[x] ??= new Proxy({}, {
			get(target, key) {
				checkParity(x, key);
				return target[key];
			},
			set(target, key, value) {
				checkParity(x, key);
				return target[key] = value;
			},
		});
		tiles[x][y] = v;
	}
	function get(x, y) {
		return Boolean(tiles[x]?.[y]);
	}
	function flip(x, y) {
		assign(x, y, !get(x, y));
	}
	function neighbors(x, y) {
		return Object.values(dirs)
			.filter(([dx, dy]) => get(x + dx, y + dy))
			.length;
	}
	function toString(neighborMode = false) {
		let s = '\n';
		for (let x = minX; x <= maxX; x++) {
			for (let y = minY; y <= maxY; y++) {
				if (parity(x) !== parity(y)) {
					s += '.';
				} else {
					s += neighborMode ? neighbors(x, y) : get(x, y) ? '■' : '□';
				}
			}
			s += '\n';
		}
		return s + '\n';
	}
	for (const cmd of input) {
		let x = 0, y = 0;
		for (const dir of cmd) {
			const [dx, dy] = dirs[dir];
			x += dx;
			y += dy;
		}
		flip(x, y);
	}
	function count() {
		return Object.values(tiles)
			.flatMap(x => Object.values(x))
			.filter(y => y)
			.length;
	}
	const initial = count();
	while (turns--) {
		await new Promise(resolve => setTimeout(resolve));
		console.debug('Turn', turns, '...');
		const queue = [];
		for (let x = minX - 1; x <= maxX + 1; x++) {
			for (let y = minY - 1; y <= maxY + 1; y++) {
				if (parity(x) !== parity(y)) {
					continue;
				}
				const self = get(x, y);
				const crowd = neighbors(x, y);
				if (!self && crowd === 2) {
					queue.push([x, y]);
				} else if (self && (crowd === 0 || crowd > 2)) {
					queue.push([x, y]);
				}
			}
		}
		queue.forEach(([x, y]) => flip(x, y));
	}
	return [initial, count()];
})(100).then(console.log);