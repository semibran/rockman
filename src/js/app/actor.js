const Rect = require('rect')
const cell = x => Math.floor(x / 16)

module.exports = function Actor(opts) {

	var actor = Rect(16, 24)
	actor.RUN_SPEED = 1.296875
	actor.GRAVITY = 0.25
	actor.TERMINAL_VELOCITY = 7
	Object.assign(actor, opts)
	actor.state = 'idle'
	actor.facing = 0
	actor.velocity = null
	actor.spawn = spawn
	actor.update = update
	actor.move = move

	return actor

	function spawn(stage, x, y, facing) {
		if (!facing)
			facing = 1
		stage.actors.push(actor)
		actor.stage = stage
		actor.x = x * 16 + 8
		actor.y = y * 16 + 8
		actor.facing = facing
		actor.velocity = { x: 0, y: 0 }
	}

	function update() {

		if (!actor.stage)
			return

		moveAxis(actor.velocity.x, 0)
		moveAxis(0, actor.velocity.y)

		actor.velocity.x = 0
		actor.velocity.y += actor.GRAVITY
		if (actor.velocity.y > actor.TERMINAL_VELOCITY)
			actor.velocity.y = actor.TERMINAL_VELOCITY

	}

	function move(direction) {
		actor.facing = direction
		actor.velocity.x = actor.RUN_SPEED * direction
	}

	function moveAxis(directionX, directionY) {

		actor.x += directionX
		actor.y += directionY

		var { x, y } = actor
		var left   = cell(actor.left)
		var top    = cell(actor.top)
		var right  = cell(actor.right)
		var bottom = cell(actor.bottom)
		var grounded = false

		for (let y = top; y <= bottom; y++) {
			for (let x = left; x <= right; x++) {
				let tile = actor.stage(x, y)
				if (!tile || !tile.solid)
					continue
				tile = Rect(x * 16, y * 16, 16, 16)
				if (Rect.intersects(actor, tile)) {
					if (directionX < 0)
						actor.left = tile.right
					else if (directionX > 0)
						actor.right = tile.left
					if (directionY < 0)
						actor.top = tile.bottom
					else if (directionY > 0) {
						actor.bottom = tile.top
						grounded = true
					}
				}
			}
		}

		if (grounded)
			actor.grounded = true
		else if (directionY)
			actor.grounded = false

		if (actor.x < actor.stage.rect.left)
			actor.x = actor.stage.rect.left
		else if (actor.x > actor.stage.rect.right)
			actor.x = actor.stage.rect.right

		if (actor.x !== x)
			actor.velocity.x = 0

		if (actor.y !== y)
			actor.velocity.y = 0

	}
}
