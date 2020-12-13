/* 2020-11 Game of Life */
((input = document.body.innerText.trim().split('\n').map(s => [...s])) => {
	function equal(boardA, boardB) {
		return boardA?.join('\n') == boardB?.join('\n');
	}
	function adjacency(board, r, c) {
		const neighbors = [
			board[r-1]?.[c-1], board[r-1]?.[c], board[r-1]?.[c+1],
			board[r  ]  [c-1],                  board[r  ]  [c+1],
			board[r+1]?.[c-1], board[r+1]?.[c], board[r+1]?.[c+1],
		];
		return neighbors.filter(seat => seat === '#').length;
	}
	adjacency.limit = 4;
	function sight(board, r, c) {
		function look(dr, dc) {
			let d = 1;
			let seat;
			while (true) {
				seat = board[r + d*dr]?.[c + d*dc];
				switch (seat) {
					case '#': case 'L': case undefined: return seat;
				}
				d++;
			}
		}
		const seen = [
			look(-1, -1), look(-1, 0), look(-1, +1),
			look( 0, -1),              look( 0, +1),
			look(+1, -1), look(+1, 0), look(+1, +1),
		];
		return seen.filter(seat => seat === '#').length;
	}
	sight.limit = 5;
	function equilibrium(countFn) {
		let prev;
		let current = input;
		do {
			prev = current;
			current = prev.map((row, r) => row.map((seat, c) => {
				const crowd = countFn(prev, r, c);
				switch (seat) {
					case 'L': return crowd ? 'L' : '#';
					case '#': return crowd >= countFn.limit ? 'L' : '#';
					case '.': return '.';
					default: throw new Error(seat);
				}
			}));
		} while (!equal(prev, current))
		return current.flatMap(row => row).filter(seat => seat === '#').length;
	}
	return [equilibrium(adjacency), equilibrium(sight)];
})();