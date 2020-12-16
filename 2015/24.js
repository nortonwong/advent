/* 2015-24 Sleigh Balance */
((input = document.body.innerText.trim()) => {
	input = input.split('\n').map(Number).reverse();
	function compute(divisions) {
		const goal = input.reduce((a, b) => a + b) / divisions;
		function combine(n, c) {
			if (n < c) {
				throw new Error(`n < c: ${n} < ${c}`);
			}
			if (c === 0) {
				return [0];
			}
			if (n === c) {
				return [2**n - 1];
			}
			const el = 2**(n-1);
			const inclusions = combine(n - 1, c - 1).map(e => e | el);
			const exclusions = combine(n - 1, c);
			return [...inclusions, ...exclusions];
		}
		const minimum = input
			.map((e, i, a) => a.slice(0, i + 1).reduce(((a, b) => a + b)))
			.findIndex(sum => sum > goal) + 1;
		const N = input.length;
		function extract(combination, array, negate = false) {
			return array.filter((_, i) => {
				const match = (combination >> i) & 1;
				return negate ? !match : match;
			});
		}
		let solution = Number.MAX_SAFE_INTEGER;
		for (let c = minimum; c < N; c++) {
			if (solution !== Number.MAX_SAFE_INTEGER) {
				return solution;
			}
			const combinations = combine(N, c);
			for (const combination of combinations) {
				const selection = extract(combination, input);
				const sum = selection.reduce((a, b) => a + b);
				if (sum !== goal) {
					continue;
				}
				const quantum = selection.reduce((a, b) => a * b);
				solution = Math.min(quantum, solution);
			}
		}
	}
	return [compute(3), compute(4)];
})();