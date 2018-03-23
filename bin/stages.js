const join = require("path").join
const fs = require("fs")
const rectify = require("../lib/rectify")
const src = join(__dirname, "../src/stages/")
const dest = join(__dirname, "../dist/tmp/")
const names = fs.readdirSync(src)
const stages = {}

for (let name of names) {
  let stage = require(join(src, name))
  stages[name] = {
    gravity: stage.gravity,
    blocks: rectify(stage.layout)
      .map(({ x, y, w, h }) => [ x, y, w, h ])
  }
  console.log(stages[name].blocks)
}

fs.writeFileSync(join(dest, "stages.json"), JSON.stringify(stages))
