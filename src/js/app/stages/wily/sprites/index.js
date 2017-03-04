const Image = require('image')
const names = require('./names')
const render = require('./render')

module.exports = function load(callback) {
	var sprites = {}
	Image.load(__dirname + '/tileset.png', function (err, tileset) {
		var cols = Math.floor(tileset.width  / 16)
		var rows = Math.floor(tileset.height / 16)
		for (let i = names.length; i--;) {
			let name = names[i]
			if (!name)
				continue
			let x = i % cols
			let y = (i - x) / cols
			let canvas = sprites[name] = document.createElement('canvas')
			let context = canvas.getContext('2d')
			canvas.width = 16
			canvas.height = 16
			context.drawImage(tileset, -x * 16, -y * 16)
		}
		sprites.render = render(sprites)
		sprites.tileset = tileset
		callback(null, sprites)
	})
	return sprites
}
