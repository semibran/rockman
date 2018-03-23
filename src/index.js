import sourcemap from "../dist/tmp/sprites.json"
import actors from "../dist/tmp/actors.json"
import stages from "../dist/tmp/stages.json"
import manifest from "@semibran/manifest"
import stringify from "css-string"
import loadImage from "img-load"
import listen from "key-state"
import {
  left, right, top, bottom,
  intersects2D as intersects
} from "hitbox"

const keys = listen(window, {
  left:  [ "ArrowLeft",  "KeyA" ],
  right: [ "ArrowRight", "KeyD" ],
  jump:  [ "ArrowUp",    "KeyW" ]
})

let rockman = {
  name: "rockman",
  state: { id: "fall", timer: 0 },
  stats: actors.rockman.stats,
  hitbox: {
    halfsize: actors.rockman.size.map(x => x / 2),
    position: [ 128, 120 ]
  },
  velocity: [ 0, 0 ],
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
  }
}

let sprites = null
let offsets = actors.rockman.sprites.reduce((offsets, entry) => {
  offsets[entry.id] = entry.offset
  return offsets
}, {})

loadImage("sprites.png").then(sheet => {
  sprites = extract(sheet, sourcemap)
  Actor.render(app.stage.actors[0], sprites.actors.rockman)

  let tree = render(app, sprites)
  let view = manifest(tree)
  document.body.appendChild(view)
  requestAnimationFrame(loop)
})

function loop() {
  let stage = app.stage
  let actor = stage.actors[0]
  if (keys.left && !keys.right) {
    actor.velocity[0] = -actor.stats.speed
    if (actor.state.id !== "run") {
      actor.state.id = "run"
      actor.state.time = 0
    }
  } else if (keys.right && !keys.left) {
    actor.velocity[0] = actor.stats.speed
    if (actor.state.id !== "run") {
      actor.state.id = "run"
      actor.state.time = 0
    }
  } else {
    actor.velocity[0] = 0
    if (actor.state.id !== "idle") {
      actor.state.id = "idle"
      actor.state.time = 0
    }
  }
  if (keys.jump === 1) {
    if (actor.ground) {
      actor.velocity[1] = -actor.stats.jump
      actor.state.id = "jump"
      actor.state.time = 0
    }
  }
  if (actor.state.id === "land" && actor.state.time === 7) {
    actor.state.id = "idle"
    actor.state.time = 0
  }
  Stage.update(stage)
  Actor.render(actor, sprites.actors.rockman)
  requestAnimationFrame(loop)
}

const Actor = {
  render(rockman, sprites) {
    let id = Actor.resolve(rockman, sprites)
    let sprite = sprites[id]
    let offset = offsets[id]
    let canvas = rockman.view
    let hitbox = rockman.hitbox
    let [ x, y ] = hitbox.position
    let [ halfwidth, halfheight ] = hitbox.halfsize

    canvas.width = sprite.width
    canvas.height = sprite.height
    canvas.style.left = Math.round((x - halfwidth) + offset[0]) + "px"
    canvas.style.top = Math.round((y - halfheight) + offset[1]) + "px"

    let context = canvas.getContext("2d")
    context.drawImage(sprite, 0, 0)
  },
  resolve(rockman, sprites) {
    if (rockman.ground) {
      if (rockman.state.id === "idle") {
        if (rockman.state.time % 60 === 59) {
          return "idle-blink"
        } else {
          return "idle"
        }
      } else if (rockman.state.id === "run") {
        let index = Math.floor(rockman.state.time / 7) % 4
        if (index === 3) {
          return "run-1"
        } else {
          return `run-${index}`
        }
      } else if (rockman.state.id === "land") {
        return "run-0"
      }
    } else {
      return "jump"
    }
  },
  restate(rockman, id) {
    rockman.state.id = id
    rockman.state.time = 0
  }
}

const Stage = {
  update(stage) {
    for (let actor of stage.actors) {
      Stage.move(stage, actor, [ actor.velocity[0], 0 ])
      Stage.move(stage, actor, [ 0, actor.velocity[1] ])
      actor.velocity[1] += stage.gravity
      actor.state.time++
    }
  },
  move(stage, actor, delta) {
    actor.hitbox.position[0] += delta[0]
    actor.hitbox.position[1] += delta[1]
    let ground = null
    for (let block of stage.blocks) {
      if (intersects(actor.hitbox, block.hitbox)) {
        if (delta[0] < 0) {
          left(actor.hitbox, right(block.hitbox))
          actor.velocity[0] = 0
        } else if (delta[0] > 0) {
          right(actor.hitbox, left(block.hitbox))
          actor.velocity[0] = 0
        }
        if (delta[1] < 0) {
          top(actor.hitbox, bottom(block.hitbox))
          actor.velocity[1] = 0
        } else if (delta[1] > 0) {
          bottom(actor.hitbox, top(block.hitbox))
          actor.velocity[1] = 0
          ground = block
        }
      }
    }
    if (delta[1]) {
      if (!actor.ground) {
        actor.state.id = "land"
        actor.state.time = 0
      }
      actor.ground = ground
    }
  }
}

function render(app, sprites) {
  let { stage, viewport } = app
  return {
    tag: "div",
    attributes: {
      class: "stage",
      style: stringify({
        width: viewport.size[0] + "px",
        height: viewport.size[1] + "px"
      })
    },
    children: [
      { tag: "div", attributes: { class: "layer background" }, children: [
        sprites.stages[stage.name].backdrop
      ] },
      { tag: "div", attributes: { class: "layer foreground" }, children: [
        ...stage.actors.map(actor => actor.view)
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
