/* 2020-5.2: Seats */
(() => {
	function fromBinary(s, chars) {
		s = s.replace(/./g, c => chars.indexOf(c));
		return parseInt(s, 2);
	};
	function fromSeatNotation(r, c) {
		if (typeof r === 'string') {
			return fromSeatNotation(
				fromBinary(r.substring(0, 7), 'FB'),
				fromBinary(r.substring(7), 'LR'),
			);
		}
		return 8 * r + c;
	};
	const lines = document.body.innerText.trim().split('\n').map(fromSeatNotation);
	function count(length) {
		return Object.keys(Array.from({ length: length })).map(Number);
	};
	const potential = new Set(count(2 ** 10));
	for (const used of lines) {
		potential.delete(used);
	}
	function toSeatNotation(n) {
		if (n < 0 || n > 2 ** 10) {
			throw new Error('Illegal seat: ' + n);
		}
		const binary = n.toString(2).padStart(10, '0');
		return binary.replace(/./g, (c, i) => (i < 7 ? 'FB' : 'LR')[c]);
	}
	let edgedex = 0;
	while (potential.size > 1) {
		const edges = count(8).flatMap(c => [edgedex, 2 ** 7-1-edgedex].map(r => fromSeatNotation(r, c)));
		for (const nonexistent of edges) {
			potential.delete(nonexistent);
		}
		edgedex++;
	}
	return potential;
})();
