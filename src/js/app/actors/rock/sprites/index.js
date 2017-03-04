const Image = require('image')
const names = require('./names')
const render = require('./render')

module.exports = function load(callback) {
	var sprites = {}
	Image.load(__dirname + '/rock.png', function (err, image) {
		for (let name in names) {
			let index = names[name]
			if (!Array.isArray(index))
				sprites[name] = extract(image, index)
			else {
				sprites[name] = []
				let indexes = index
				for (let i = indexes.length; i--;) {
					let index = indexes[i]
					sprites[name][i] = extract(image, index)
				}
			}
		}
		sprites.render = render(sprites)
		sprites.image = image
		callback(null, sprites)
	})
	return sprites
}

function extract(image, index) {
	var size = image.height
	var canvas = document.createElement('canvas')
	var context = canvas.getContext('2d')
	canvas.width = size
	canvas.height = size
	context.drawImage(image, -index * size, 0)
	return canvas
}
