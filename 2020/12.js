/* 2020-12.1 Ship */
((input = document.body.innerText.trim().split('\n')) => {
	let x = 0, y = 0, dir = 0;
	const toRadians = Math.PI / 180;
	for (const cmd of input) {
		const n = Number(cmd.substring(1));
		switch (cmd.charAt(0)) {
			case 'N': x += n; break;
			case 'S': x -= n; break;
			case 'W': y -= n; break;
			case 'E': y += n; break;
			case 'L': dir += n * toRadians; break;
			case 'R': dir -= n * toRadians; break;
			case 'F':
				x += Math.round(Math.sin(dir)) * n;
				y += Math.round(Math.cos(dir)) * n;
				break;
		}
	}
	return Math.abs(x) + Math.abs(y);
})();

/* 2020-12.2 Waypoint */
((input = document.body.innerText.trim().split('\n')) => {
	let [x, y] = [1, 10];
	let [a, b] = [0, 0];
	for (const cmd of input) {
		const n = Number(cmd.substring(1));
		switch (cmd.charAt(0)) {
			case 'N': x += n; break;
			case 'S': x -= n; break;
			case 'W': y -= n; break;
			case 'E': y += n; break;
			case 'L':
				switch (n) {
					case 90: [x, y] = [y, -x]; break;
					case 180: [x, y] = [-x, -y]; break;
					case 270: [x, y] = [-y, x]; break;
				};
				break;
			case 'R':
				switch (n) {
					case 270: [x, y] = [y, -x]; break;
					case 180: [x, y] = [-x, -y]; break;
					case 90: [x, y] = [-y, x]; break;
				};
				break;
			case 'F': a += x * n; b += y * n; break;
		}
	}
	return Math.abs(a) + Math.abs(b);
})();