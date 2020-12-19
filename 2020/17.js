/* 2020-17.1 Cube */
((input = document.body.innerText.trim().split('\n')) => {
	const initial = [input.map(r => r.split('').map(c => c === '#'))];
	function dimensions(state) {
		return [state.length, state[0].length, state[0][0].length];
	}
	const deltas = [-1, 0, 1];
	function neighbors(state, x, y, z) {
		let neighbors = 0;
		for (const dx of deltas) {
			for (const dy of deltas) {
				for (const dz of deltas) {
					if (dx === 0 && dy === 0 && dz === 0) {
						continue;
					}
					neighbors += Number(state[x + dx]?.[y + dy]?.[z + dz] ?? 0);
				}
			}
		}
		return neighbors;
	}
	function step(state, turns = 1) {
		if (!turns) {
			return state;
		}
		const [X, Y, Z] = dimensions(state).map(n => n + 2);
		const next = [];
		for (let x = 0; x < X; x++) {
			next[x] = [];
			for (let y = 0; y < Y; y++) {
				next[x][y] = [];
				for (let z = 0; z < Z; z++) {
					const [ox, oy, oz] = [x - 1, y - 1, z - 1];
					const active = state[ox]?.[oy]?.[oz];
					const crowd = neighbors(state, ox, oy, oz);
					next[x][y][z] = active
						? (crowd === 2 || crowd === 3)
						: crowd === 3;
				}
			}
		}
		return step(next, turns - 1);
	}
	function active(state) {
		return state
			.reduce((ax, px) => ax + px
				.reduce((ay, py) => ay + py
					.reduce((az, pz) => az + Number(pz),
					0),
				0),
			0);
	}
	const toChar = { true: '#', false: '.' };
	function toString(state) {
		return state
			.map(x => x
				 .map(y => y
					.map(z => toChar[z])
					.join(''))
				 .join('\n'))
			.join('\n\n');
	}
	return [active(initial), active(step(initial, 6))];
})();

/* 2020-17.2 Tesseract */
(async (input = document.body.innerText.trim().split('\n')) => {
	async function main(space = 3) {
		let initial = input.map(r => r.split('').map(c => c === '#'));
		function dimensions(state) {
			const dims = [];
			while (state instanceof Array) {
				dims.push(state.length);
				state = state[0];
			}
			return dims;
		}
		while (dimensions(initial).length < space) {
			initial = [initial];
		}
		if (dimensions(initial).length > space) {
			throw dimensions(initial);
		}
		function* range(start, stop, inclusive = false) {
			while (start < stop) {
				yield start++;
			}
			if (inclusive) {
				yield stop;
			}
		}
		const deltas = [...range(-1, 1, true)];
		function get(state, p) {
			return p.reduce((space, dim) => space?.[dim], state);
		}
		function count(state, p) {
			return Number(get(state, p) ?? false);
		}
		function assign(state, p, value) {
			const dim = p
				.slice(0, p.length - 1)
				.reduce((space, dim, i) => (space[dim] ??= []), state);
			dim[p[p.length - 1]] = value;
		}
		function cartesianProduct(a_n, b) {
			return a_n.flatMap(aa => b.map(bb => [...aa, bb]));
		}
		function neighbors(state, p) {
			const block = p
				.reduce((space, dim) => cartesianProduct(space, deltas.map(dd => dim + dd)), [[]]);
			const crowd = block
				.map(n => count(state, n))
				.reduce((acc, e) => acc + e, 0);
			const self = count(state, p);
			return crowd - self;
		}
		async function step(state, turns = 1) {
			if (!turns) {
				return state;
			}
			await new Promise(resolve => setTimeout(resolve));
			console.log(`Solving in space^${space}; turn T-${turns}...`);
			const dims = dimensions(state).map(d => d + 2);
			const points = dims.reduce((space, dim) => cartesianProduct(space, [...range(0, dim)]), [[]]);
			const next = [];
			for (const p of points) {
				const po = p.map(d => d - 1);
				const active = get(state, po);
				const crowd = neighbors(state, po);
				assign(next, p, active
					? (crowd === 2 || crowd === 3)
					: crowd === 3);
			}
			return step(next, turns - 1);
		}
		function active(state) {
			return state.flat(dimensions(state).length - 1)
				.reduce((acc, e) => acc + Number(e), 0);
		}
		return { space, active: active(await step(initial, 6)) };
	}
	for await (const { space, active } of [main(), main(4)]) {
		console.log(`Solution in space^${space}: ${active} active`);
	}
})();