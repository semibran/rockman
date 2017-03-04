const Grid = require('grid')
const Rect = require('rect')

var cols = 16
var rows = 15

module.exports = function Stage(data) {

	var stage = Grid(data, cols, rows)
	stage.actors = []
	stage.update = update

	return stage

	function update() {
		for (let actor of stage.actors)
			actor.update()
	}
}
