/* 2020-19 Message Rules */
((input = document.body.innerText.trim().split('\n\n')) => {
	function main(finite = true) {
		let [rules, messages] = input.map(part => part.split('\n'));
		rules = rules.map((r, i) => {
			const [k, v] = r.split(': ');
			const char = v.match(/\"(.+)\"/)?.[1];
			const branch = v.split(' | ').map(vv => vv.split(' ').map(Number));
			return [k, char ? [[char]] : branch];
		}).reduce((acc, [k, v]) => (acc[k] = v, acc), []); // Map<Number, (String | Number)[][]>
		if (!finite) {
			delete rules[8];
			delete rules[11];
		}
		const leaves = {}; // Map<Number, String[]>
		function cartesianProduct(...args) {
			return args.reduce((acc, el) => acc.flatMap(a => el.map(e => [...a, e])), [[]]);
		}
		const history = [];
		function narrow() {
			let changed = false;
			const resolutions = [];
			for (const [i, rule] of Object.entries(rules)) {
				if (rule.every(branch => branch.every(twig => typeof twig === 'string'))) {
					leaves[i] = rule.map(branch => branch.join(''));
					delete rules[i];
					resolutions.push(i);
					changed = true;
				}
			}
			if (changed) {
				const resolved = resolutions.join(' ');
				console.debug(`Resolved ${resolved}.`);
				history.push(resolved);
			}
			for (const [i, rule] of Object.entries(rules)) {
				rules[i] = rule.flatMap(branch => {
					changed |= branch.some(twig => leaves[twig]);
					return cartesianProduct(...branch.map(twig => leaves[twig] ?? [twig]));
				});
			}
			return changed;
		}
		while (narrow()) {
		}
		if (finite) {
			const set0 = new Set(leaves[0]);
			return messages.filter(m => set0.has(m)).length;
		}
		// 0: 8 11
		// 8: 42 | 42 8
		// 11: 42 31 | 42 11 31
		const head42 = new RegExp(`^(?:${leaves[42].join('|')})+`);
		const tail31 = new RegExp(`(?:${leaves[31].join('|')})+$`);
		const rule0 = s => {
			if (s.length % 8) {
				return false;
			};
			const head = head42.exec(s)?.[0]?.length;
			const tail = tail31.exec(s)?.[0]?.length;
			return head && tail && (head > tail) && (head + tail === s.length);
		}
		return messages.filter(m => rule0(m)).length;
	}
	return [main(), main(false)];
})();