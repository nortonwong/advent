/* 2015-9 Distances */
((input = document.body.innerText.trim().split('\n')) => {
	const distances = input.reduce((acc, line) => {
		const [a, b, n] = line.split(/ (?:to|=) /g);
		(acc[a] ??= {})[b] = (acc[b] ??= {})[a] = Number(n);
		return acc;
	}, {});
	const cities = Object.keys(distances);
	const N = cities.length;
	function permutations(elements) {
		if (elements.length <= 1) {
			return [[...elements]];
		}
		const [next, ...rest] = elements;
		const recurse = permutations(rest);
		return recurse.flatMap(p => p.reduce((acc, _, i) => {
			const left = p.slice(0, i + 1);
			const right = p.slice(i + 1);
			acc.push([...left, next, ...right]);
			return acc;
		}, [[next, ...p]]));
	}
	function measure(...path) {
		let d = 0;
		for (let i = 0; i < path.length - 1; i++) {
			const from = path[i];
			const to = path[i + 1];
			d += distances[from][to];
		}
		return d;
	}
	const paths = permutations(cities)
		.map(path => [path, measure(...path)])
		.sort((a, b) => a[1] - b[1]);
	const [shortest] = paths;
	const longest = paths[paths.length - 1];
	return [...shortest, ...longest];
})();