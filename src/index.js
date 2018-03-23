import sourcemap from "../dist/tmp/sprites.json"
import actors from "../dist/tmp/actors.json"
import stages from "../dist/tmp/stages.json"
import controls from "./controls.json"
import manifest from "@semibran/manifest"
import stringify from "css-string"
import loadImage from "img-load"
import listen from "key-state"
import {
  left, right, top, bottom,
  intersects2D as intersects
} from "hitbox"

let rockman = {
  name: "rockman",
  state: { id: "fall", time: 0 },
  stats: actors.rockman.stats,
  hitbox: {
    halfsize: actors.rockman.size.map(x => x / 2),
    position: [ 128, 120 ]
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
let offsets = null

loadImage("sprites.png").then(sheet => {
  sprites = extract(sheet, sourcemap)
  offsets = {}
  for (let name in actors) {
    offsets[name] = {}
    for (let entry of actors[name].sprites) {
      let sprite = sprites.actors[name][entry.id]
      offsets[name][entry.id] = {
        right: entry.offset,
        left: [
          -sprite.left.width - entry.offset[0] + actors.rockman.size[0],
          entry.offset[1] // ^ complicated hack for flipped offsets
        ]
      }
    }
  }

  for (let actor of app.stage.actors) {
    Actor.render(actor, sprites.actors[actor.name])
  }

  let tree = render(app, sprites)
  let view = manifest(tree)
  document.body.appendChild(view)
  requestAnimationFrame(loop)

  window.addEventListener("resize", e => {
    view.style.transform = `scale(${
      window.innerWidth <= window.innerHeight
        ? window.innerWidth / app.viewport.size[0]
        : window.innerHeight / app.viewport.size[1]
    })`
  })
})

function loop() {
  let stage = app.stage
  let rockman = stage.actors[0]
  let commands = Input.resolve(app.input)
  for (let command of commands) {
    Actor[command.type](rockman, ...command.args)
  }

  Actor.update(rockman)
  Stage.update(stage)
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
    } else {
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

const Actor = {
  update(rockman) {
    if (rockman.state.id === "run-start") {
      if (rockman.state.time === 7) {
        rockman.state.id = "run"
        rockman.state.time = 0
      } else if (rockman.state.time > 0) {
        rockman.velocity[0] = 0
      }
    }

    if (rockman.state.id === "run-stop" && rockman.state.time === 7) {
      rockman.state.id = "idle"
      rockman.state.time = 0
    }

    if (rockman.state.id === "land") {
      rockman.state.id = "idle"
      rockman.state.time = 0
    }
  },
  move(rockman, direction) {
    let delta = 0
    if (direction === "left") {
      delta = -1
    } else if (direction === "right") {
      delta = 1
    } else {
      return
    }
    rockman.facing = delta
    if (rockman.ground) {
      if (rockman.state.id === "idle") {
        rockman.velocity[0] = delta
        rockman.state.id = "run-start"
        rockman.state.time = 0
      } else if (rockman.state.id === "land" || rockman.state.id === "run-stop") {
        rockman.state.id = "run"
        rockman.state.time = 0
      }
    }
    if (!rockman.ground || rockman.state.id === "run") {
      rockman.velocity[0] = rockman.stats.speed * delta
    }
  },
  stop(rockman) {
    if (rockman.ground) {
      if (rockman.state.id !== "run-stop") {
        if (rockman.state.id === "run-start") {
          rockman.state.id = "idle"
          rockman.state.time = 0
        } else if (rockman.state.id === "run") {
          rockman.state.id = "run-stop"
          rockman.state.time = 0
        }
      }
    }
    rockman.velocity[0] = 0
  },
  jump(rockman) {
    if (rockman.ground) {
      rockman.velocity[1] = -rockman.stats.jump
      rockman.state.id = "jump"
      rockman.state.time = 0
    }
  },
  fall(rockman) {
    if (!rockman.ground && rockman.velocity[1] < 0) {
      rockman.velocity[1] = 0
    }
  },
  render(rockman, sprites) {
    let id = Actor.resolve(rockman, sprites)
    let direction = rockman.facing === -1 ? "left" : "right"
    let sprite = sprites[id][direction]
    let offset = offsets.rockman[id][direction]
    let canvas = rockman.view
    let hitbox = rockman.hitbox
    let [ x, y ] = hitbox.position
    let [ halfwidth, halfheight ] = hitbox.halfsize
    let left = Math.round((x - halfwidth) + offset[0])
    let top = Math.round((y - halfheight) + offset[1])

    canvas.width = sprite.width
    canvas.height = sprite.height
    canvas.style.left = left + "px"
    canvas.style.top = top + "px"

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
      } else if (rockman.state.id === "run-start"
      || rockman.state.id === "run-stop"
      ) {
        return "run-step"
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
      Actor.render(actor, sprites.actors[actor.name])
    }
  },
  move(stage, actor, delta) {
    actor.hitbox.position[0] += delta[0]
    actor.hitbox.position[1] += delta[1]

    if (left(actor.hitbox) < 0) {
      left(actor.hitbox, 0)
    } else if (right(actor.hitbox) > 256) {
      right(actor.hitbox, 256)
    }

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
        height: viewport.size[1] + "px",
        transform: `scale(${
          window.innerWidth <= window.innerHeight
            ? window.innerWidth / viewport.size[0]
            : window.innerHeight / viewport.size[1]
        })`
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
