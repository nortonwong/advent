/* 2015-19 Molecule */
((input = document.body.innerText.trim().split('\n')) => {
	const goal = input.pop();
	const [forward, backward] = input.filter(s => s).reduce(([forward, backward], rule) => {
		const [from, to] = rule.split(' => ');
		(forward[from] ??= []).push(to);
		(backward[to] ??= []).push(from);
		return [forward, backward];
	}, [{}, {}]);
	function go(state, direction) {
		const targets = Object.keys(direction);
		const result = new Set();
		for (const possibility of state) {
			for (let i = 0; i < possibility.length; i++) {
				if (possibility[i] === possibility[i].toLowerCase()) {
					continue;
				}
				const prev = possibility.substring(0, i);
				const rest = possibility.substring(i);
				const hits = targets.filter(t => rest.startsWith(t));
				for (const hit of hits) {
					for (const mark of direction[hit]) {
						const aftermath = prev + mark + rest.substring(hit.length);
						result.add(aftermath);
					}
				}
			}
		}
		return result;
	}
	const answerA = go(new Set([goal]), forward).size;
	const answerB = async () => {
		let state = [[goal, 0]];
		while (state.length) {
			await new Promise(resolve => setTimeout(resolve));
			const [next, turn] = state.pop();
			console.log('Depth-first search with queue of', state.length, '... Turn', turn);
			const result = go([next], backward);
			if (result.has('e')) {
				return turn + 1;
			}
			const history = [...result].map(e => [e, turn + 1]);
			state.push(...history);
		}
	};
	answerB().then(answerB => console.log([answerA, answerB]));
})();