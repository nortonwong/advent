/* 2020-25 RFID */
(async (input = document.body.innerText.trim()) => {
	const [cardPub, doorPub] = input.split('\n').map(Number);
	function computeKey(subject, loops) {
		let value = 1;
		while (loops--) {
			value *= subject;
			value %= 20201227;
		}
		return value;
	}
	async function inferLoops(key, subject, pause = 100_000) {
		let value = 1;
		let loops = 0;
		let progress = 0;
		while (true) {
			if (progress >= pause) {
				await new Promise(resolve => setTimeout(resolve));
				console.debug('Infer', key, 'loop', loops, '...');
				progress = 0;
			} else {
				progress++;
			}
			value *= subject;
			value %= 20201227;
			loops++;
			if (value === key) {
				return loops;
			}
		}
	}
	const cardLoops = await inferLoops(cardPub, 7);
	const doorLoops = await inferLoops(doorPub, 7);
	const finalKey = new Set([
		computeKey(doorPub, cardLoops),
		computeKey(cardPub, doorLoops),
	]);
	if (finalKey.size > 1) {
		throw finalKey;
	}
	return finalKey;
})(`11349501
5107328`).then(console.log);