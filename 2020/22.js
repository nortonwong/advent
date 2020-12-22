/* 2020-22 Crab Combat */
((recursive = false, input = document.body.innerText.trim()) => {
	const [[, ...p1], [, ...p2]] = input.split('\n\n').map(deck => deck.split('\n').map(Number));
	function turn(p1, p2, history = new Set()) {
		const id = [p1, p2].map(p => p.join()).join(' - ');
		if (history.has(id)) {
			return 1;
		}
		history.add(id);
		const a = p1.shift();
		const b = p2.shift();
		if (recursive && a <= p1.length && b <= p2.length) {
			const winner = turn(p1.slice(0, a), p2.slice(0, b));
			if (winner === 1) {
				p1.push(a, b);
			} else if (winner === 2) {
				p2.push(b, a);
			} else {
				throw winner;
			}
		} else if (a > b) {
			p1.push(a, b);
		} else if (b > a) {
			p2.push(b, a);
		} else {
			throw [a, b];
		}
		return !p1.length ? 2 : !p2.length ? 1 : turn(p1, p2, history);
	}
	const winner = turn(p1, p2);
	const score = [, p1, p2][winner].reverse().reduce((acc, e, i) => acc + (e * (i + 1)), 0);
	return score;
})(true);