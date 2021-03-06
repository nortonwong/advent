/* 2020-14.1 Bitmask Value */
((input = document.body.innerText.trim()) => {
	input = input.split('\n').map(s => s.split(' = '));
	let masks;
	const mem = {};
	for (let [key, value] of input) {
		if (key === 'mask') {
			const and = BigInt(`0b${value.replace(/[^0]/g, 1)}`);
			const or = BigInt(`0b${value.replace(/[^1]/g, 0)}`);
			masks = { and, or };
		} else if (key.startsWith('mem[')) {
			key = Number(key.match(/\d+/)[0]);
			value = BigInt(value);
			mem[key] = (value & masks.and) | masks.or;
		} else {
			throw new Error(key);
		}
	}
	return Object.values(mem).reduce((a, b) => a + b, 0n).valueOf();
})();

/* 2020-14.2 Bitmask Address */
((input = document.body.innerText.trim()) => {
	input = input.split('\n').map(s => s.split(' = '));
	let masks = [];
	const mem = {};
	for (let [key, value] of input) {
		if (key === 'mask') {
			const [init, ...parts] = value.split('').map(m => ({
				0: '-',
				1: '1',
				X: '?',
			})[m]).join('').split('?');
			masks = parts.reduce((acc, el) => acc.flatMap(a => [`${a}0${el}`, `${a}1${el}`]), [init]);
		} else if (key.startsWith('mem[')) {
			key = Number(key.match(/\d+/)).toString(2).padStart(36, '0').split('');
			value = Number(value);
			for (const mask of masks) {
				let maskedKey = key.map((c, i) => '01'[mask[i]] ?? c).join('');
				maskedKey = parseInt(maskedKey, 2);
				mem[maskedKey] = value;
			}
		} else {
			throw new Error(key);
		}
	}
	return Object.values(mem).reduce((a, b) => a + b, 0);
})();