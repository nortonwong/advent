/* 2015-15 Cookie */
((input = document.body.innerText.trim()) => {
	const scorer = input.split('\n').map(s => {
		const [name, bonuses] = s.split(': ');
		const ingredient = [];
		ingredient.name = name;
		for (const bonus of bonuses.split(', ')) {
			const [type, value] = bonus.split(' ');
			ingredient.push(ingredient[type] = Number(value));
		}
		ingredient.calories = ingredient.pop();
		return ingredient;
	});
	const attributes = scorer[0].map((_, i) => i);
	function score(calories, ...args) {
		const sum = args.reduce((a, b) => a + b, 0);
		if (sum !== 100) {
			throw new Error(sum);
		}
		if (args.length !== scorer.length) {
			throw new Error(args.length);
		}
		if (calories) {
			const c = scorer.map((e, i) => e.calories * args[i]).reduce((a, b) => a + b);
			if (c !== calories) {
				return 0;
			}
		}
		return attributes
			.map(attr => scorer.reduce((acc, ingredient, i) => acc + ingredient[attr] * args[i], 0))
			.map(n => Math.max(n, 0))
			.reduce((a, b) => a * b);
	}
	let a = 0, b = 0;
	for (let i = 0; i <= 100; i++) {
		for (let j = 0; j <= 100 - i; j++) {
			for (let k = 0; k <= 100 - i - j; k++) {
				const l = 100 - i - j - k;
				a = Math.max(a, score(false, i, j, k, l));
				b = Math.max(b, score(500, i, j, k, l));
			}
		}
	}
	return [a, b];
})();