const { Stage, Actor, stages, actors } = require('./app')
const sprites = require('./app/sprites')(setup)
const Display = require('./display')

const controls = require('./controls')
const input = require('./input')(controls, function update(keys, actor) {
	if (keys.left && (!keys.right || keys.left < keys.right))
		actor.move(-1)
	else if (keys.right && (!keys.left || keys.right < keys.left))
		actor.move(1)
})
const keys = require('keys')(window)

var stage, actor
var display = Display(sprites)
document.body.appendChild(display.element)

function setup() {
	stage = Stage(stages.wily)
	actor = Actor(actors.rock)
	actor.spawn(stage, ...stage.spawns[0])
	display.render(stage)
	requestAnimationFrame(loop)
}

function loop() {
	requestAnimationFrame(loop)
	input(keys, actor)
	stage.update()
	display.render(stage)
}
