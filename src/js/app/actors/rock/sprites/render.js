module.exports = function use(sprites) {
	return function render(actor) {
		switch (actor.state) {
			case 'idle':
				return sprites.IDLE
		}
		return null
	}
}
