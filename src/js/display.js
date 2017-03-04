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
			let canvas = html`<canvas class='stage' width=${stage.cols * 16} height=${stage.rows * 16} />`
			let sprite = sprites.stages.wily.render(stage)
			Draw(canvas).image(sprite)(0, 0)
			display.element.appendChild(canvas)
		}
		for (let actor of stage.actors) {
			let drawn = display.drawn.get(actor)
			if (!drawn) {
				let canvas = html`<canvas class='actor' width=32 height=32 />`
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
			drawn.canvas.style.left = Math.round(x) + 'px'
			drawn.canvas.style.top  = Math.round(y) + 'px'
			drawn.canvas.style.transform = `scaleX(${actor.facing})`
		}
	}
}
