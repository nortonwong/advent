/* 2020-15 Van Eck */
((...input) => {
	function compute(until) {
		const state = input.reduce((acc, n, i) => {
			acc[n] = i + 1;
			return acc;
		}, {});
		let turn = input.length;
		let n = input[turn - 1];
		while (turn < until) {
			const start = state[n];
			const since = start ? turn - start : 0;
			state[n] = turn;
			n = since;
			turn++;
		}
		return n;
	}
	return [compute(2020), compute(30_000_000)];
})(19, 20, 14, 0, 9, 1);