const html = require('bel')
const Draw = require('canvas-draw')

module.exports = function Display(sprites) {

	var element = html`<main></main>`
	var display = { element, drawn: new Map, stage: null, render }

	return display

	function render(stage) {
		if (stage !== display.stage) {
			while (element.lastChild)
				element.removeChild(element.lastChild)
			display.stage = stage
			let width  = stage.cols * 16
			let height = stage.rows * 16
			let canvas = html`<canvas class='stage' width=${width} height=${height} />`
			canvas.style.width  = width + 'em'
			canvas.style.height = height + 'em'
			display.element.appendChild(canvas)
			let sprite = sprites.stages.wily.render(stage)
			Draw(canvas).image(sprite)(0, 0)
		}
		for (let actor of stage.actors) {
			let drawn = display.drawn.get(actor)
			if (!drawn) {
				let canvas = html`<canvas class='actor' width=32 height=32 />`
				canvas.style.width = 32 + 'em'
				canvas.style.height = 32 + 'em'
				drawn = { canvas, sprite: null }
				display.drawn.set(actor, drawn)
				display.element.appendChild(canvas)
			}
			let sprite = sprites.actors[actor.type].render(actor)
			if (sprite !== drawn.sprite) {
				drawn.sprite = sprite
				Draw(drawn.canvas)
					.clear()
					.image(sprite)(0, 0)
			}
			let x = (actor.x - sprite.width / 2)
			let y = (actor.y - 14)
			drawn.canvas.style.left = Math.round(x) + 'em'
			drawn.canvas.style.top  = Math.round(y) + 'em'
			drawn.canvas.style.transform = `scaleX(${actor.facing})`
		}
	}
}
