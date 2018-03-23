const join = require("path").join
const fs = require("fs")
const src = join(__dirname, "../src/actors/")
const dest = join(__dirname, "../dist/tmp/")
const names = fs.readdirSync(src)
const actors = {}

for (let name of names) {
  let actor = require(join(src, name))
  actors[name] = actor
}

fs.writeFileSync(join(dest, "actors.json"), JSON.stringify(actors))
