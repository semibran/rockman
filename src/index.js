import sourcemap from "../dist/tmp/sprites.json"
import stages from "../dist/tmp/stages.json"
import actors from "./actors"
import Stage from "./stage"
import controls from "./controls.json"
import manifest from "@semibran/manifest"
import loadImage from "img-load"
import stringify from "css-string"
import listen from "key-state"

let rockman = {
  name: "rockman",
  state: { id: "fall", time: 0 },
  stats: actors.rockman.stats,
  hitbox: {
    halfsize: actors.rockman.size.map(x => x / 2),
    position: [ 112, 132 ]
  },
  velocity: [ 0, 0 ],
  facing: 1,
  ground: null,
  view: manifest({
    tag: "canvas",
    attributes: { class: "actor rockman" },
    children: []
  })
}

let app = {
  stage: {
    name: "overworld",
    gravity: stages.overworld.gravity,
    blocks: stages.overworld.blocks.map(([ x, y, w, h ]) => ({
      hitbox: {
        halfsize: [ w * 16 / 2, h * 16 / 2 ],
        position: [ (x + w / 2) * 16, (y + h / 2) * 16 ]
      }
    })),
    actors: [ rockman ]
  },
  viewport: {
    size: [ 256, 240 ],
    position: [ 0, 0 ]
  },
  input: {
    held: listen(window, controls),
    prev: {}
  }
}

let sprites = null
let viewport = null

loadImage("sprites.png").then(sheet => {
  sprites = extract(sheet, sourcemap)
  for (let name in actors) {
    for (let entry of actors[name].sprites) {
      let sprite = sprites.actors[name][entry.id]
      let canvas = document.createElement("canvas")
      let context = canvas.getContext("2d")
      canvas.width = sprite.width
      canvas.height = sprite.height
      context.scale(-1, 1)
      context.drawImage(sprite, -sprite.width, 0)
      sprites.actors[name][entry.id] = {
        right: {
          image: sprite,
          offset: entry.offset
        },
        left: {
          image: canvas,
          offset: [
            -sprite.width - entry.offset[0] + actors.rockman.size[0],
            entry.offset[1] // ^ hacky flipped offset calculation
          ]
        }
      }
    }
  }

  for (let actor of app.stage.actors) {
    actors[actor.name].actions.render(actor, sprites.actors[actor.name])
  }

  let tree = render(app, sprites)
  let view = manifest(tree)
  document.body.appendChild(view)
  requestAnimationFrame(loop)

  viewport = view.children[0]

  window.addEventListener("resize", resize)

  function resize(e) {
    view.style.transform = `scale(${
      window.innerWidth <= window.innerHeight
        ? window.innerWidth / app.viewport.size[0]
        : window.innerHeight / app.viewport.size[1]
    })`
  }

  resize()
})

function loop() {
  let stage = app.stage
  let actor = stage.actors[0]
  let commands = Input.resolve(app.input)
  for (let command of commands) {
    actors[actor.name].actions[command.type](actor, ...command.args)
  }

  Stage.update(stage)

  for (let actor of stage.actors) {
    actors[actor.name].actions.update(actor)
    actors[actor.name].actions.render(actor, sprites.actors[actor.name])
  }

  let left = -Math.round(actor.hitbox.position[0] - app.viewport.size[0] / 2)
  if (left >= 0) left = 0
  if (left < -256) left = -256
  viewport.style.left = left + "px"

  Input.update(app.input)
  requestAnimationFrame(loop)
}

const Input = {
  update(input) {
    Object.assign(input.prev, input.held)
  },
  resolve(input) {
    let commands = []
    if (input.held.left && !input.held.right) {
      commands.push({ type: "move", args: [ "left" ] })
    } else if (input.held.right && !input.held.left) {
      commands.push({ type: "move", args: [ "right" ] })
    } else if ((input.prev.left || input.prev.right) && !input.held.left && !input.held.right
    || (input.prev.left && !input.prev.right || input.prev.right && !input.prev.left) && input.held.left && input.held.right
    ) {
      commands.push({ type: "stop", args: [] })
    }

    if (input.held.jump && !input.prev.jump) {
      commands.push({ type: "jump", args: [] })
    } else if (!input.held.jump) {
      commands.push({ type: "fall", args: [] })
    }

    return commands
  }
}


function render(app, sprites) {
  let { stage, viewport } = app
  return {
    tag: "div",
    attributes: {
      class: "viewport",
      style: stringify({
        width: viewport.size[0] + "px",
        height: viewport.size[1] + "px"
      })
    },
    children: [
      { tag: "div", attributes: { class: "viewport-inner" }, children: [
        { tag: "div", attributes: { class: "stage" }, children: [
          { tag: "div", attributes: { class: "layer background" }, children: [
            sprites.stages[stage.name].backdrop
          ] },
          { tag: "div", attributes: { class: "layer foreground" }, children: [
            ...stage.actors.map(actor => actor.view)
          ] }
        ] }
      ] }
    ]
  }
}

function extract(image, sourcemap) {
  let sprites = {}
  for (let id in sourcemap) {
    let [ x, y, w, h ] = sourcemap[id]
    let canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h

    let context = canvas.getContext("2d")
    context.drawImage(image, -x, -y)

    let path = id.split("/")
    let ref = sprites
    let key = null

    for (var i = 0; i < path.length - 1; i++) {
      key = path[i]
      if (!ref[key]) {
        ref[key] = {}
      }
      ref = ref[key]
    }
    key = path[i]
    ref[key] = canvas
  }
  return sprites
}
