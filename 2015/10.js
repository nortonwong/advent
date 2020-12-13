/* 2015-10.2 Look'n'Say */
((input, steps) => {
	let current = input.toString();
	while (steps--) {
		let next = '';
		const re = /(\d)\1*/y;
		let exec;
		while (exec = re.exec(current)) {
			const [match] = exec;
			next += match.length;
			next += match[0];
		}
		current = next;
	}
	return current.length;
})(1113222113, 50);