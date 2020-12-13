/* 2020-13.1 Earliest Bus */
((input = document.body.innerText.trim().split('\n')) => {
	const start = Number(input[0]);
	const buses = input[1].split(',').filter(b => b !== 'x').map(Number).sort((a, b) => a - b);
	return buses
		.map(b => {
			const t = Math.ceil(start / b) * b;
			const wait = t - start;
			return { id: b, wait };
		})
		.sort((a, b) => a.wait - b.wait)
		.map(e => e.id * e.wait)[0];
})();

/* 2020-13.2 Bus Cycles */
((input = document.body.innerText.trim().split('\n')) => {
	const buses = input[1].split(',')
		.map((id, offset) => ({ id, offset }))
		.filter(b => b.id !== 'x')
		.map(({ id, offset }) => ({
			id: Number(id),
			offset,
			verify: n => (n + offset) % id === 0,
		}))
		.sort((a, b) => b.id - a.id);
	// Assuming relatively prime
	const [estimate] = buses.reduce(([start, increment], bus) => {
		for (let n = start; ; n += increment) {
			if (bus.verify(n)) {
				return [n, increment * bus.id];
			}
		}
	}, [100000000000000, 1]);
	// In case not relatively prime
	function factorize(n) {
		if (n < 1 || n % 1) {
			throw new Error(n);
		}
		const factors = [];
		let current = n;
		let f = 2;
		while (f <= n && n > 1) {
			if (n % f === 0) {
				factors.push(f);
				n /= f;
			} else {
				f++;
			}
		}
		return factors;
	}
	function lcm(...ns) {
		function toMap(list) {
			return list.reduce((acc, f) => {
				acc.set(f, (acc.get(f) ?? 0) + 1);
				return acc;
			}, new Map());
		}
		const multiFactors = ns.map(factorize).map(toMap);
		const uniqueFactors = new Set(multiFactors.flatMap(fs => [...fs.keys()]));
		const maxFactors = [...uniqueFactors].reduce((acc, f) => {
			acc.set(f, multiFactors.map(fs => fs.get(f) ?? 0).reduce((a, b) => Math.max(a, b)));
			return acc;
		}, new Map());
		return [...maxFactors.entries()].map(([k, v]) => k ** v).reduce((a, b) => a * b, 1);
	}
	const exact = buses.reduce((start, bus, i) => {
		const increment = lcm(...buses.slice(0, i).map(b => b.id));
		for (let n = start; ; n += increment) {
			if (bus.verify(n)) {
				return n;
			}
		}
	}, 100000000000000);
	return new Set([estimate, exact]);
})();