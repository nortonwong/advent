/* 2020-21 Allergens */
((input = document.body.innerText.trim()) => {
	input = input.split('\n').map(s => s.match(/^([^(]+) \(contains ([^)]+)\)$/).slice(1));
	class Set extends window.Set {
		retainAll(c) {
			c = new Set(c);
			for (const e of this) {
				c.has(e) || this.delete(e);
			}
		}
	}
	const ingredients = new Map();
	const allergens = new Map();
	for (const text of input) {
		const lineIngredients = text[0].split(' ');
		const lineAllergens = text[1].split(', ');
		for (const i of lineIngredients) {
			ingredients.set(i, (ingredients.get(i) ?? 0) + 1);
		}
		for (const a of lineAllergens) {
			if (allergens.has(a)) {
				allergens.get(a).retainAll(lineIngredients);
			} else {
				allergens.set(a, new Set(lineIngredients));
			}
		}
	}
	function narrow() {
		let changed = false;
		for (const [a, av] of allergens.entries()) {
			if (av.size === 1) {
				const [i] = [...av];
				for (const [b, bv] of allergens.entries()) {
					if (a !== b) {
						changed |= bv.delete(i);
					}
				}
			}
		}
		return changed;
	}
	while (narrow()) {
	}
	const dangerousIngredients = new Map();
	for (const [a, aset] of allergens.entries()) {
		if (aset.size !== 1) throw aset;
		const [i] = [...aset];
		dangerousIngredients.set(i, a);
	}
	const safeIngredients = [...ingredients.keys()]
		.filter(i => !dangerousIngredients.has(i));
	const inertScore = safeIngredients.map(i => ingredients.get(i))
		.reduce((a, b) => a + b);
	const dangerList = [...dangerousIngredients.entries()]
		.sort(([, av], [, bv]) => av.localeCompare(bv))
		.map(e => e[0])
		.join(',');
	return [inertScore, dangerList];
})();