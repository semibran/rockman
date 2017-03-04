const Rect = require('rect')

module.exports = function Actor(opts) {

	var actor = Rect(16, 24)
	actor.state = 'idle'
	actor.velocity = null
	actor.spawn = spawn
	actor.update = update

	return actor

	function spawn(stage, x, y) {
		stage.actors.push(actor)
		actor.stage = stage
		actor.x = x
		actor.y = y
		actor.velocity = { x: 0, y: 0 }
	}

	function update() {

	}
}
