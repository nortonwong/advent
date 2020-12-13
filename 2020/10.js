/* 2020-10.2 Volts */
((input = document.body.innerText.trim()) => {
	input = input.split('\n').map(Number).sort((a, b) => a - b);
	input = [0, ...input];
	const ways = [];
	ways[input.length - 1] = 1;
	function* range(start, end) {
		while (start < end) {
			yield start++;
		}
	}
	function reachFrom(index) {
		if (ways[index] !== undefined) {
			return ways[index];
		}
		const v = input[index];
		const nexts = [...range(index + 1, input.length)].filter(i => input[i] - v <= 3);
		return ways[index] = nexts.map(reachFrom).reduce((a, b) => a + b);
	}
	return reachFrom(0);
})();