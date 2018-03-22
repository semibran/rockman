import loadImage from "img-load"
import stringify from "css-string"
import manifest from "@semibran/manifest"
import sourcemap from "../dist/tmp/sprites.json"
import stages from "../dist/tmp/stages.json"

let actor = {
  name: "rockman",
  stats: { speed: 1.296375, jump: 4 },
  hitbox: { halfsize: [ 8, 12 ], position: [ 128, 120 ] },
  velocity: [ 0, 0 ]
}

let app = {
  stage: {
    name: "overworld",
    gravity: 0.25,
    actors: [ actor ],
    blocks: stages.overworld.map(box => {
      let [ x, y, w, h ] = box
      return {
        hitbox: {
          halfsize: [ w * 16 / 2, h * 16 / 2 ],
          position: [ x * 16, y * 16 - 8 ]
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
  let sprites = extract(sheet, sourcemap)
  let tree = render(app, sprites)
  let view = manifest(tree)
  document.body.appendChild(view)
})

function render(app, sprites) {
  let { stage, viewport } = app
  return { tag: "main",
    attributes: {
      class: "stage",
      style: stringify({
        width: viewport.size[0] + "px",
        height: viewport.size[1] + "px"
      })
    },
    children: [
      { tag: "div", attributes: { class: "background layer" }, children: [
        { tag: "div",
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
      { tag: "div", attributes: { class: "foreground layer" }, children: [
        ...stage.actors.map(actor => {
          let [ hw, hh ] = actor.hitbox.halfsize
          let [ x, y ] = actor.hitbox.position
          return { tag: "div",
            attributes: {
              class: "actor",
              style: stringify({
                left: (x - hw) + "px",
                top: (y - hh) + "px",
              })
            },
            children: [
              sprites.actors[actor.name].jump
            ]
          }
        })
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
