/* 2015-14 Race */
((input = document.body.innerText.trim()) => {
	const timer = 2503;
	input = input.split('\n')
		.map(s => s.match(/(\S+) can fly (\d+) km\/s for (\d+) .* (\d+) seconds\./).slice(1))
		.map(([who, rate, duration, rest]) => ({ who, rate: Number(rate), duration: Number(duration), rest: Number(rest) }));
	function race(timer) {
		return input.map(({ who, rate, duration, rest }) => {
			const cycle = duration + rest;
			const cycles = Math.floor(timer / cycle);
			let dist = cycles * rate * duration;
			const remainder = Math.min(timer % cycle, duration);
			dist += remainder * rate;
			return { who, dist };
		}).reduce((a, b) => a.dist > b.dist ? a : b);
	}
	const winner = race(timer);
	const cumulativeWins = {};
	let time = 0;
	while (time++ < timer) {
		const { who } = race(time);
		cumulativeWins[who] ??= 0;
		cumulativeWins[who]++;
	}
	return [winner, cumulativeWins];
})();