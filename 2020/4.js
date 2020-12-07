/* 2020-4.2: Passports */
(() => {
	const lines = document.body.innerText.trim().split('\n\n')
		.map(s => new Map(s.split(/\s+/g)
			.map(s => s.split(':'))
		));
	const fields = Object.entries({
		byr: s => s.match(/^\d{4}$/) && Number(s) >= 1920 && Number(s) <= 2002,
		iyr: s => s.match(/^\d{4}$/) && Number(s) >= 2010 && Number(s) <= 2020,
		eyr: s => s.match(/^\d{4}$/) && Number(s) >= 2020 && Number(s) <= 2030,
		hgt: s => {
			const [, n, type] = s.match(/^(\d+)(cm|in)$/) ?? [];
			return {
				cm: n => n >= 150 && n <= 193,
				in: n => n >= 59 && n <= 76,
			}[type]?.(Number(n));
		},
		hcl: s => s.match(/^#[0-9a-f]{6}$/),
		ecl: s => 'amb blu brn gry grn hzl oth'.includes(s),
		pid: s => s.match(/^\d{9}$/),
	});
	return lines
		.filter(l => l.size >= 7)
		.map(l => [l, fields.find(([field, test]) => !l.has(field) || !test(l.get(field)))])
		.filter(([, e]) => !e)
		.map(([l]) => Object.fromEntries(l))
		.map(({ byr, iyr, eyr, hgt, hcl, ecl, pid }) => `${byr}/${iyr}/${eyr}  ${hgt.padStart(5)}  ${hcl}:${ecl}  --  ${pid}`);
})();
