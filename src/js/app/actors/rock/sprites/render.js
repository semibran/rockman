module.exports = function use(sprites) {
	return function render(actor) {
		if (!actor.grounded)
			return sprites.JUMP
		else
			return sprites.IDLE
		return null
	}
}
