/* 2020-7.1: Bags Containing */
(() => {
	const goal = 'shiny gold';
	const empty = 'no other bags.';
	const lines = document.body.innerText.trim().split('\n')
		.map(s => {
			const [type, rest] = s.split(/ bags contain /);
			const info = rest !== empty
				? rest.split(', ').map(s => s.split(' bag')[0])
				: [];
			const nums = info.map(s => s.split(/(?<=\d) /)).map(([num, type]) => ({ num: Number(num), type }));
			return [type, nums];
		});
	let edited = true;
	while (edited) {
		edited = false;
		const known = lines.filter(([type, info]) => type === goal || info === true).map(([type]) => type);
		for (const entry of lines) {
			const [type, info] = entry;
			if (info === true) {
				continue;
			}
			if (known.some(k => info.some(s => s.type === k))) {
				edited = true;
				entry[1] = true;
			}
		}
	}
	return lines.filter(([, info]) => info === true).map(([type]) => type);
})();

/* 2020-7.2: Bags Contained */
(() => {
	const goal = 'shiny gold';
	const empty = 'no other bags.';
	const lines = document.body.innerText.trim().split('\n')
		.map(s => {
			const [type, rest] = s.split(/ bags contain /);
			const info = rest !== empty
				? rest.split(', ').map(s => s.split(' bag')[0])
				: 0;
			if (info === 0) {
				return [type, 0];
			} else {
				const nums = info.map(s => s.split(/(?<=\d) /)).map(([num, type]) => ({ num: Number(num), type }));
				return [type, nums];
			}
		});
	while (true) {
		const known = new Map(lines.filter(([, info]) => typeof info === 'number'));
		for (const entry of lines) {
			const [type, info] = entry;
			if (typeof info === 'number') {
				if (type === goal) {
					return info;
				}
				continue;
			}
			if (info.every(s => known.has(s.type))) {
				entry[1] = info
					.map(s => s.num * (1 + known.get(s.type)))
					.reduce((a, b) => a + b);
			}
		}
	}
})();