import { left, right, top, bottom, intersects } from "hitbox"
import listen from "key-state"
import stringify from "css-string"
import loadImage from "img-load"
import manifest from "@semibran/manifest"
import sourcemap from "../dist/tmp/sprites.json"
import stages from "../dist/tmp/stages.json"

let sprites = null

let rockman = {
  name: "rockman",
  stats: { speed: 1.296375, jump: 4 },
  hitbox: { halfsize: [ 8, 12 ], position: [ 128, 120 ] },
  velocity: [ 0, 0 ],
  view: manifest({
    tag: "canvas",
    attributes: { class: "actor rockman" },
    children: []
  })
}

let app = {
  stage: {
    name: "overworld",
    gravity: 0.25,
    actors: [ rockman ],
    blocks: stages.overworld.map(box => {
      let [ x, y, w, h ] = box
      return {
        hitbox: {
          halfsize: [ w * 16 / 2, h * 16 / 2 ],
          position: [ (x + w / 2) * 16, (y + h / 2 - 0.5) * 16 ]
        }
      }
    })
  },
  viewport: {
    size: [ 256, 240 ],
    position: [ 0, 0 ]
  }
}

loadImage("sprites.png").then(sheet => {
  sprites = extract(sheet, sourcemap)
  Actor.render(rockman, sprites.actors.rockman)

  let tree = render(app, sprites)
  let view = manifest(tree)
  document.body.appendChild(view)
  requestAnimationFrame(loop)
})

function loop() {
  let stage = app.stage
  let actor = stage.actors[0]
  Stage.update(stage)
  Actor.render(actor, sprites.actors.rockman)
  requestAnimationFrame(loop)
}

const Actor = {
  render(rockman, sprites) {
    let [ hw, hh ] = rockman.hitbox.halfsize
    let [ x, y ] = rockman.hitbox.position
    let canvas = rockman.view
    let sprite = Actor.resolve(rockman, sprites)

    canvas.width = sprite.width
    canvas.height = sprite.height
    canvas.style.left = (x - hw) + "px"
    canvas.style.top = (y - hh) + "px"

    let context = canvas.getContext("2d")
    context.drawImage(sprite, 0, 0)
  },
  resolve(rockman, sprites) {
    return sprites.jump
  }
}

const Stage = {
  update(stage) {
    for (let actor of stage.actors) {
      Stage.move(stage, actor, [ actor.velocity[0], 0 ])
      Stage.move(stage, actor, [ 0, actor.velocity[1] ])
      actor.velocity[1] += stage.gravity
    }
  },
  move(stage, actor, delta) {
    actor.hitbox.position[0] += delta[0]
    actor.hitbox.position[1] += delta[1]
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
        }
      }
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
        {
          tag: "div",
          attributes: {
            class: "backdrop",
            style: stringify({
              transform: "translateY(-8px)"
            })
          },
          children: [
            sprites.stages[stage.name].backdrop
          ]
        }
      ] },
      { tag: "div", attributes: { class: "layer foreground"  }, children: [
        ...stage.actors.map(actor => actor.view)
      ] }
    ]
  }
}

function extract(sheet, sourcemap) {
  let sprites = {}
  for (let id in sourcemap) {
    let [ x, y, w, h ] = sourcemap[id]
    let canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h

    let context = canvas.getContext("2d")
    context.drawImage(sheet, -x, -y)

    let path = id.split(".")
    let ref = sprites
    let key = null

    for (var i = 0; i < path.length - 1; i++) {
      key = path[i]
      ref = ref[key] =
        !!ref[key]
          ? ref[key]
          : isNaN(path[i + 1])
            ? {}
            : []
    }
    key = path[i]
    key = isNaN(key) ? key : parseInt(key)
    ref[key] = canvas
  }
  return sprites
}
