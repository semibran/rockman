const symbols = {
	' ': { type: 'sky' },
	'%': { type: 'cloud' },
	'#': { type: 'ground', solid: true },
	'=': { type: 'brick',  solid: true },
	'|': { type: 'ladder', ladder: true },
	'-': { type: 'wall',   solid: true },
	'W': { type: 'wily',   solid: true },
	'C': { type: 'bunker', solid: true },
	'S': { type: 'satellite' },
	'X': { type: 'fence' },
	'E': { type: 'barrel' },
	'.': { type: 'pipe' },
	',': { type: 'pipe-dial' }
}

module.exports = (
	'%%%%% %%========' +
	'  %%   %==.....=' +
	'       C==..,,.=' +
	'S      CC....,.=' +
	'S       .......=' +
	'SS      ..,....=' +
	'---|   CC===|===' +
	'---|   C====|===' +
	'W--|XXXX==..|..=' +
	'W--|XXXX==..|,.=' +
	'---|EXXX.......=' +
	'---|EEXE....,..=' +
	'################' +
	'################' +
	'################'
).split('').map(item => symbols[item])
