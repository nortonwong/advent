/* 2015-20 Presents (O(n) Space, O(n*log(n)) Time) */
((goal, lazy = false) => {
	const time = Date.now();
	goal /= (lazy ? 11 : 10);
	const until = Math.ceil(goal);
	const sums = new Array(until + 1).fill(0);
	for (let d = 1; d <= until; d++) {
		let i = d;
		const sum = sums[i] += d;
		if (sum >= goal) {
			console.log(`Took ${(Date.now() - time) / 1000}s to find ${i} in mode lazy=${lazy}.`);
			return i;
		}
		const end = lazy ? 50 * d : until;
		for (i += d; i <= end; i += d) {
			sums[i] += d;
		}
	}
})(34_000_000, true);

/* 2015-20 Presents (O(1) Space, O(n*sqrt(n)) Time) */
(async (goal, start = 1, lazy = false) => {
	const time = Date.now();
	goal /= (lazy ? 11 : 10);
	function sumOfDivisors(n) {
		if (n === 1) {
			return 1;
		}
		let sum = 1 + n;
		let i = 2;
		const max = Math.ceil(Math.sqrt(n));
		while (i <= max) {
			if (n % i === 0) {
				sum += i;
				const pair = n / i;
				if (i !== pair) {
					sum += pair;
				}
			}
			i++;
		}
		return sum;
	}
	function range(start, end) {
		return Array.from({ length: end - start }).map((_, i) => start + i);
	}
	const fifty = range(1, 51);
	function sumOfLazyDivisors(n) {
		return fifty
			.filter(d => n % d === 0)
			.map(d => n / d)
			.reduce((a, b) => a + b, 0);
	}
	const summer = lazy ? sumOfLazyDivisors : sumOfDivisors;
	function ok(n) {
		return summer(n) >= goal;
	}
	const format = new Intl.NumberFormat().format;
	const fmt = n => format(n).replaceAll(',', '_');
	async function check(start, length) {
		await new Promise(resolve => setTimeout(resolve));
		console.debug(`Checking ${fmt(start)} to ${fmt(start + length - 1)}...`);
		for (let i = start; i < start + length; i++) {
			if (ok(i)) {
				return i;
			}
		}
		return check(start + length, length)
	}
	const answer = await check(start, 1000);
	console.log(`Took ${(Date.now() - time) / 1000}s to find ${fmt(answer)} in mode lazy=${lazy}.`);
	return answer;
})(34_000_000, 1, false);