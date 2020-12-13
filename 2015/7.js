/* 2015-7.2 Circuit */
(() => {
	const input = document.body.innerText.trim().split('\n')
		.map(s => s.split(/ -> /))
	let circuit = {};
	let todo = new Set(input);
	function get(key) {
		return key.match(/^\d+$/) ? Number(key) : circuit[key];
	}
	function connect(...deny) {
		while (todo.size) {
			for (const entry of todo) {
				const [cmd, dest] = entry;
				if (deny.includes(dest)) {
					todo.delete(entry);
					continue;
				}
				const v = function () {
					if (cmd.match(/^\S+$/)) {
						return get(cmd);
					} else if (cmd.match(/^NOT /)) {
						const src = cmd.substring(4);
						const v = get(src);
						if (v !== undefined) {
							return Number(BigInt.asUintN(16, BigInt(~v)));
						}
					} else if (cmd.match(/ [A-Z]+ /)) {
						const [op] = cmd.match(/[A-Z]+/);
						const [a, b] = cmd.split(` ${op} `).map(get);
						if (a !== undefined && b !== undefined) {
							switch (op) {
								case 'AND': return a & b;
								case 'OR': return a | b;
								case 'LSHIFT': return a << b;
								case 'RSHIFT': return a >> b;
							}
						}
					} else {
						throw new Error('Invalid command: ' + cmd);
					}
				}();
				if (v !== undefined) {
					circuit[dest] = v;
					todo.delete(entry);
				}
			}
		}
	}
	connect();
	circuit = { b: circuit.a };
	todo = new Set(input);
	connect('b');
	return circuit.a;
})();