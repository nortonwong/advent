/* 2020-23 Crab Cups */
(async (input, part) => {
	let [turns, extend, pause] = [, [100, 0, 10], [10_000_000, 1_000_000, 500_000]][part];
	let state = input.split('').map(Number);
	while (state.length < extend) {
		state.push(state.length + 1);
	}
	const N = state.length;
	state = state.reduce((acc, el, i, a) => {
		acc[el % N] = {
			id: el,
			nextId: a[i + 1] ?? a[0],
			get nextNode() {
				return get(this.nextId);
			},
		};
		return acc;
	}, []);
	function get(i) {
		return state[i % N];
	}
	let currentNode = get(input[0]);
	let progress = 0;
	while (turns--) {
		if (progress >= pause) {
			await new Promise(resolve => setTimeout(resolve));
			console.debug(`----------------- Turn`, turns);
			progress = 0;
		}
		progress++;
		const removed = [
			currentNode.nextId,
			currentNode.nextNode.nextId,
			currentNode.nextNode.nextNode.nextId,
		];
		currentNode.nextId = currentNode.nextNode.nextNode.nextNode.nextId;
		let destN = currentNode.id - 1;
		while (destN === 0 || removed.includes(destN)) {
			if (destN === 0) {
				destN += N;
			} else {
				destN--;
			}
		}
		const cut = get(destN).nextId;
		get(destN).nextId = removed[0];
		get(removed[2]).nextId = cut;
		currentNode = currentNode.nextNode;
	}
	function toString(start = 1) {
		let currentNode = get(start);
		let s = '';
		const seen = new Set();
		do {
			if (s) {
				s += ', ';
			}
			s += currentNode.id;
			if (seen.has(currentNode.id)) {
				throw ['loop', s, currentNode.id];
			}
			seen.add(currentNode.id);
			currentNode = currentNode.nextNode;
		} while (currentNode.id !== start);
		return s;
	}
	switch (part) {
		case 1:	return toString().split(', ').slice(1).join('');
		case 2:	return get(1).nextId * get(1).nextNode.nextId;
	}
})(`925176834`, 2).then(console.log);