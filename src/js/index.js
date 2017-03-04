const { Stage, Actor, stages, actors } = require('./app')
const sprites = require('./app/sprites')(setup)
const html = require('bel')
const Draw = require('canvas-draw')

var stage, actor

function setup() {

	stage = Stage(stages.wily.data)
	actor = Actor(actors.rock.data)
	actor.spawn(stage, ...stages.wily.spawns[0])

	var background = sprites.stages.wily.render(stage)
	background.className = 'stage'

	var sprite = sprites.actors.rock.render(actor)
	var canvas = html`<canvas width=${sprite.width} height=${sprite.height} />`
	canvas.className = 'actor'
	canvas.style.left = 0
	canvas.style.top = 0
	Draw(canvas).image(sprite)(0, 0)

	document.body.appendChild(html`
		<main>
			${background}
			${canvas}
		</main>`)

}
