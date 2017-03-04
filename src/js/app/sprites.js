const bulk = require('bulk-require')

module.exports = function load(callback) {

	var stages = bulk(__dirname + '/stages', '*/sprites/index.js')
	var actors = bulk(__dirname + '/actors', '*/sprites/index.js')
	var sprites = { stages, actors }
	var loaders = []
	var index

	for (let name in stages)
		loaders.push({ name, load: stages[name].sprites, type: 'stage' })

	for (let name in actors)
		loaders.push({ name, load: actors[name].sprites, type: 'actor' })

	next()

	return sprites

	function next(err, result) {
		if (!isNaN(index)) {
			let { name, type } = loaders[index]
			if (type === 'stage')
				stages[name] = result
			else if (type === 'actor')
				actors[name] = result
			if (++index === loaders.length)
				return callback(null, sprites)
		} else
			index = 0
		var { load } = loaders[index]
		load(next)
	}
}
