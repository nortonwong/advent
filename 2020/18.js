/* 2020-18 Math Homework */
((precedence = false, input = document.body.innerText.trim().split('\n')) => {
	function leftToRight(math) {
		let n;
		[n, ...math] = math.split(/ (?=[*+])/);
		n = Number(n);
		for (const cmd of math) {
			const [op, arg] = cmd.split(' ');
			switch (op) {
				case '+': n += Number(arg); break;
				case '*': n *= Number(arg); break;
				default: throw cmd;
			}
		}
		return n;
	}
	function addThenMult(math) {
		return math.split(' * ').map(leftToRight).reduce((a, b) => a * b);
	}
	const compute = precedence ? addThenMult : leftToRight;
	const values = input.map(line => {
		let parens;
		while (parens = /\([^()]+\)/.exec(line)) {
			const [match] = parens;
			const value = compute(match.substring(1, match.length - 1));
			line = line.replace(match, value);
		}
		return compute(line);
	})
	return values.reduce((a, b) => a + b);
})(true);