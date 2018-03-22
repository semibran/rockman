const join = require("path").join
const fs = require("fs")
const rectify = require("../lib/rectify")
const src = join(__dirname, "../src/stages/")
const dest = join(__dirname, "../dist/tmp/")
const stages = fs.readdirSync(src)
const data = {}

for (let name of stages) {
  let stage = require(join(src, name))
  let boxes = rectify(stage.layout)
    .map(({ x, y, w, h }) => [ x, y, w, h])
  data[name] = boxes
}

fs.writeFileSync(join(dest, "stages.json"), JSON.stringify(data))
