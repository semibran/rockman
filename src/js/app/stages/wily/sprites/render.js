module.exports = function use(sprites) {
	return function render(stage, x, y) {
		if (arguments.length !== 1)
			return renderTile(stage, x, y)
		var canvas = document.createElement('canvas')
		var context = canvas.getContext('2d')
		canvas.width = stage.cols * 16
		canvas.height = stage.rows * 16
		for (let y = stage.rows; y--;)
			for (let x = stage.cols; x--;) {
				let sprite = renderTile(stage, x, y)
				if (sprite)
					context.drawImage(sprite, x * 16, y * 16)
			}
		return canvas
	}

	function renderTile(stage, x, y) {
		var tile   = stage(x, y)
		var left   = stage(x - 1, y)
		var top    = stage(x, y - 1)
		var right  = stage(x + 1, y)
		var bottom = stage(x, y + 1)
		if (!tile)
			return null
		switch (tile.type) {
			case 'sky':
				return sprites.SKY
			case 'cloud':
				if (left && left.type === 'sky')
					return sprites.CLOUD_LEFT
				else if (right && right.type === 'sky')
					return sprites.CLOUD_RIGHT
				else
					return sprites.CLOUD
			case 'ground':
				if (!top || !top.solid)
					if (x % 2)
						return sprites.GROUND_TOP
					else
						return sprites.GROUND_TOP_ALT
				else
					if (x % 2)
						return sprites.GROUND
					else
						return sprites.GROUND_ALT
			case 'brick':
				if (left && left !== tile)
					return sprites.BRICK_LEFT
				else if (right && right !== tile)
					return sprites.BRICK_RIGHT
				else
					return sprites.BRICK
			case 'ladder':
				return sprites.LADDER
			case 'wall':
				if (left && !left.solid)
					return sprites.WALL_LEFT
				else if (right && !right.solid)
					return sprites.WALL_RIGHT
				else if (top && !top.solid)
					return sprites.WALL_TOP
				else
					return sprites.WALL
			case 'wily':
				if (left && left !== tile && top && top !== tile)
					return sprites.WILY_TOP_LEFT
				else if (right && right !== tile && top && top !== tile)
					return sprites.WILY_TOP_RIGHT
				else if (left && left !== tile && bottom && bottom !== tile)
					return sprites.WILY_BOTTOM_LEFT
				else if (right && right !== tile && bottom && bottom !== tile)
					return sprites.WILY_BOTTOM_RIGHT
			case 'bunker':
				if (right === tile && top === tile)
					return sprites.BUNKER_OUTER_UPPER
				else if (right === tile && bottom === tile)
					return sprites.BUNKER_OUTER_LOWER
				else if (bottom === tile)
					return sprites.BUNKER_TOP
				else if (top === tile)
					return sprites.BUNKER_BOTTOM
				else if (left === tile && stage(x - 1, y - 1) === tile)
					return sprites.BUNKER_INNER_UPPER
				else if (left === tile && stage(x - 1, y + 1) === tile)
					return sprites.BUNKER_INNER_LOWER
			case 'fence':
				if (top !== tile)
					return sprites.FENCE_TOP
				else
					return sprites.FENCE
			case 'barrel':
				return sprites.BARREL
			case 'pipe':
				if (!top || !top.solid)
					return sprites.PIPE
				else
					return sprites.PIPE_SHADOW
			case 'pipe-dial':
				return sprites.PIPE_DIAL
		}
		return null
	}
}
