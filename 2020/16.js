/* 2020-16 Train */
(async (input = document.body.innerText.trim().split('\n\n')) => {
	const [fields, [ , self], [ , ...others]] = input.map(i => i.split('\n'));
	const predicates = fields.map(field => {
		const [name, desc] = field.split(': ');
		const ranges = desc.split(' or ').map(range => {
			const [min, max] = range.split('-').map(Number);
			return d => d >= min && d <= max;
		});
		const test = d => ranges.some(test => test(d));
		test.fieldName = name;
		return test;
	});
	function obviousErrors(ticket) {
		ticket = ticket.split(',').map(Number);
		return ticket.filter(t => !predicates.some(test => test(t)));
	}
	const errorScore = others.flatMap(obviousErrors).reduce((a, b) => a + b, 0);
	const tickets = [self, ...others.filter(t => !obviousErrors(t).length)]
		.map(t => t.split(',').map(Number));
	function correlates(fi, tfi) {
		const test = predicates[fi];
		return tickets.every(t => test(t[tfi]));
	}
	const N = fields.length;
	const range = Array.from({ length: N }).map((_, i) => i);
	const unsolved = new Set(range); // Set<FI>
	let solved = []; // Map<FI, TFI>
	while (unsolved.size) {
		console.log('Solving', ...unsolved, '...');
		async function narrow() {
			for (const fi of unsolved) {
				const tfis = [];
				for (const tfi of range) {
					if (solved.includes(tfi)) {
						continue;
					}
					await new Promise(resolve => setTimeout(resolve));
					if (correlates(fi, tfi)) {
						tfis.push(tfi);
					}
				}
				if (tfis.length === 1) {
					unsolved.delete(fi);
					solved[fi] = tfis[0];
					return true;
				}
			}
		}
		if (!(await narrow())) {
			throw unsolved;
		}
	}
	const departureScore = solved
		.filter((tfi, fi) => predicates[fi].fieldName.startsWith('departure '))
		.map(tfi => tickets[0][tfi])
		.reduce((a, b) => a * b);
	return [errorScore, departureScore]
})().then(console.log);