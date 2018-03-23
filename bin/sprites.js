const join = require("path").join
const fs = require("fs")
const Jimp = require("jimp")
const pack = require("pack")
const src = join(__dirname, "../src")
const dest = join(__dirname, "../dist")
const actors = fs.readdirSync(join(src, "actors"))
const stages = fs.readdirSync(join(src, "stages"))
let sprites = {}
let sourcemap = {}

async function main() {
  for (let id of actors) {
    let path = join(src, "actors", id)
    let actor = require(path)
    for (let sprite of actor.sprites) {
      let slash = sprite.path.lastIndexOf("/") + 1
      if (!slash) slash = 0

      let dot = sprite.path.lastIndexOf(".")
      if (dot === -1) dot = sprite.path.length

      let name = sprite.path.slice(slash, dot)
      let image = await Jimp.read(join(path, sprite.path))
      sprites[`actors/${id}/${name}`] = image
    }
  }

  for (let id of stages) {
    let path = join(src, "stages", id)
    let stage = require(path)
    let [ w, h ] = stage.layout.size
    let backdrop = await new Jimp(w * 16, h * 16)

    let images = []
    for (let tile of stage.tiles) {
      let path = join(src, "stages", id, "sprites", tile.name + ".png")
      let image = await Jimp.read(path)
      images.push(image)
    }

    let i = 0
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let index = stage.layout.data[i]
        let image = images[index]
        backdrop.blit(image, x * 16, y * 16)
        i++
      }
    }

    sprites[`stages/${id}/backdrop`] = backdrop
  }

  let names = Object.keys(sprites)
  let images = Object.values(sprites)
  let sizes = images.map(image => [ image.bitmap.width, image.bitmap.height ])
  let layout = pack(sizes)
  let sheet = await new Jimp(layout.size[0], layout.size[1])
  for (let i = 0; i < names.length; i++) {
    let name = names[i]
    let image = images[i]
    let box = layout.boxes[i]
    let [ x, y ] = box.position
    let [ w, h ] = box.size
    sheet.blit(image, x, y)
    sourcemap[name] = [ x, y, w, h ]
  }

  sheet.write(join(dest, "sprites.png"))
  fs.writeFileSync(join(dest, "tmp", "sprites.json"), JSON.stringify(sourcemap))
}

main()
