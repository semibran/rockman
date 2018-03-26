const { join, basename, extname } = require("path")
const fs = require("fs")
const Jimp = require("jimp")
const pack = require("pack")
const src = join(__dirname, "../src")
const dest = join(__dirname, "../dist")
const actors = fs.readdirSync(join(src, "actors"))
const stages = fs.readdirSync(join(src, "stages"))
let ids = []
let cache = {}
let sourcemap = {}

async function main() {
  for (let actor of actors) {
    let path = join(src, "actors", actor)
    let data = require(path)
    for (let sprite of data.sprites) {
      let path = join(src, "actors", actor, sprite.path)
      let name = basename(path, extname(path))
      let id = `actors/${actor}/${name}`
      ids.push(id)

      if (!cache[id]) {
        cache[id] = await Jimp.read(path)
      }
    }
  }

  for (let stage of stages) {
    let path = join(src, "stages", stage)
    let data = require(path)
    for (let tile of data.tiles) {
      let path = join(src, "stages", stage, tile.sprite.path)
      let name = basename(path, extname(path))
      if (!cache[path]) {
        cache[path] = await Jimp.read(path)
      }

      let source = cache[path]
      let location = tile.sprite.location
      let [ x, y, i ] = [ 0, 0, 0 ]
      if (location) {
        let cols = Math.ceil(source.bitmap.width / 16)
        if (Array.isArray(location)) {
          [ x, y ] = location
          i = y * cols + x
        } else {
          i = location
          x = i % cols
          y = (i - x) / cols
        }
      }

      let id = `stages/${stage}/${i}`
      ids.push(id)

      if (!cache[id]) {
        let image = await new Jimp(16, 16)
        image.blit(source, 0, 0, x * 16, y * 16, 16, 16)
        cache[id] = image
      }
    }
  }

  let images = ids.map(id => cache[id])
  let sizes = images.map(image => [ image.bitmap.width, image.bitmap.height ])
  let layout = pack(sizes)
  let sheet = await new Jimp(layout.size[0], layout.size[1])
  for (let i = 0; i < ids.length; i++) {
    let id = ids[i]
    let image = images[i]
    let box = layout.boxes[i]
    let [ x, y ] = box.position
    let [ w, h ] = box.size
    sheet.blit(image, x, y)
    sourcemap[id] = [ x, y, w, h ]
  }

  sheet.write(join(dest, "sprites.png"))
  fs.writeFileSync(join(dest, "tmp", "sprites.json"), JSON.stringify(sourcemap))
}

main()
