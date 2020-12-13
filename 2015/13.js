/* 2015-13 Seating */
((input = document.body.innerText.trim()) => {
	const signs = { gain: 1, lose: -1 };
	input = input.split('\n')
		.map(s => s.match(/(\S+) would (\S+) (\d+) .* (\S+)\./).slice(1))
		.map(([who, sign, value, neighbor]) => ({ who, value: Number(value) * signs[sign], neighbor }));
	const people = [...new Set(input.map(i => i.who))];
	const happinesses = input.reduce((acc, { who, value, neighbor }) => {
		acc[who] ??= {};
		acc[who][neighbor] = value;
		return acc;
	}, {});
	function happiness(seating) {
		const N = people.length;
		let sum = 0;
		for (let i = 0; i < N; i++) {
			const person = seating[i];
			const left = seating[(i - 1 + N) % N];
			const right = seating[(i + 1) % N];
			const { [left]: a, [right]: b } = happinesses[person];
			sum += a + b;
		}
		return sum;
	}
	function* append(element, universes) {
		for (const universe of universes) {
			for (const index in universe) {
				yield [...universe.slice(0, index), element, ...universe.slice(index)];
			}
			yield [...universe, element];
		}
	}
	const permutationsWithout = people.reduce((acc, person) => [...append(person, acc)], [[]]);
	const maxWithout = permutationsWithout.map(happiness).reduce((a, b) => Math.max(a, b));
	people.forEach(person => {
		happinesses.You ??= {};
		happinesses.You[person] = 0;
		happinesses[person].You = 0;
	});
	people.push('You');
 	const permutationsWith = people.reduce((acc, person) => [...append(person, acc)], [[]]);
	const maxWith = permutationsWith.map(happiness).reduce((a, b) => Math.max(a, b));
	return [maxWithout, maxWith];
})();