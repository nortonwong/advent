/* 2020-3.2: Trees */
(() => {
	const lines = document.body.innerText.trim().split('\n');
	function count(dy, dx = 1) {
		let trees = 0, x = 0, y = 0;
		while (lines[x]) {
			if (lines[x][y] === '#') {
				trees++;
			}
			x += dx; y += dy; y %= lines[0].length;
		}
		return trees;
	};
	return count(1) * count(3) * count(5) * count(7) * count(1, 2);
})();