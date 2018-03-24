const join = require("path").join
const fs = require("fs")
const rectify = require("../lib/rectify")
const src = join(__dirname, "../src/stages/")
const dest = join(__dirname, "../dist/tmp/")
const names = fs.readdirSync(src)
const stages = {}

for (let name of names) {
  let stage = require(join(src, name))
  let layout = {
    size: stage.layout.size,
    data: stage.layout.data.map(id => {
      let tile = stage.tiles[id]
      return !!(tile.traits && tile.traits.solid) ? 1 : 0
    })
  }
  stages[name] = {
    gravity: stage.gravity,
    blocks: rectify(layout)
      .map(({ x, y, width, height }) => [ x, y, width, height ])
  }
}

fs.writeFileSync(join(dest, "stages.json"), JSON.stringify(stages))
