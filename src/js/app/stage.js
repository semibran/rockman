const Grid = require('grid')
const Rect = require('rect')

var cols = 16
var rows = 15

module.exports = function Stage(opts) {

	var stage = Grid(null, cols, rows)
	Object.assign(stage, opts)
	stage.rect = Rect(cols * 16, rows * 16)
	stage.actors = []
	stage.update = update

	return stage

	function update() {
		for (let actor of stage.actors)
			actor.update()
	}
}
