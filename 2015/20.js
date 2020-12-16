/* 2015-20 Presents */
((goal, start = 1, lazy = false) => {
	goal /= (lazy ? 11 : 10);
	function sumOfDivisors(n) {
		if (n === 1) {
			return 1;
		}
		let sum = 1 + n;
		let i = 2;
		const max = n / 2;
		while (i <= max) {
			if (n % i === 0 && (!lazy || n / i <= 5)) {
				sum += i;
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
	function ok(n) {
		return (lazy ? sumOfLazyDivisors : sumOfDivisors)(n) >= goal;
	}
	const fmt = new Intl.NumberFormat().format;
	async function check(start, length) {
		await new Promise(resolve => setTimeout(resolve, 10));
		console.log(`Checking ${fmt(start)} to ${fmt(start + length - 1)}...`.replaceAll(',', '_'));
		for (let i = start; i < start + length; i++) {
			if (ok(i)) {
				return i;
			}
		}
		return check(start + length, length)
	}
	return check(start, 1000);
})(34_000_000).then(console.log);