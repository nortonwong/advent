/* 2015-3.2: Grid */
(() => {
	const input = document.body.innerText.trim();
	let x = 0, y = 0,
		a = 0, b = 0,
		which = true;
	const houses = new Set(['0,0']);
	for (const c of input) {
		switch (c) {
			case '>': which ? x++ : a++; break;
			case '<': which ? x-- : a--; break;
			case '^': which ? y++ : b++; break;
			case 'v': which ? y-- : b--; break;
			default: throw new Error(c);
		}
		which = !which;
		houses.add(`${x},${y}`).add(`${a},${b}`);
	}
	return houses.size;
})();
