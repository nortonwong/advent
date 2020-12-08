/* 2020-8.2: Halting */
(() => {
	const lines = document.body.innerText.trim().split('\n')
		.map(s => {
			const [cmd, arg] = s.split(' ');
			return [cmd, Number(arg)];
		});
	const SWAP = {
		jmp: 'nop',
		nop: 'jmp',
	};
	function simulate(swapdex) {
		let acc = 0;
		let line = 0;
		const path = new Set();
		while (line < lines.length) {
			if (path.has(line)) {
				return [false, acc];
			}
			path.add(line);
			const [cmd, arg] = lines[line];
			switch (line == swapdex ? SWAP[cmd] : cmd) {
				case 'jmp': line += arg; break;
				case 'acc': acc += arg;
				case 'nop': line++; break;
				default: throw new Error(cmd);
			}
		}
		return [true, acc];
	}
	return lines
		.flatMap(([cmd], i) => cmd in SWAP ? [i] : []);
		.flatMap(swapdex => {
			const [complete, acc] = simulate(swapdex);
			return complete ? [acc] : [];
		});
})();
