module.exports = function render(rockman, sprites) {
  let id = resolve(rockman)
  let direction = rockman.facing === -1 ? "left" : "right"
  let sprite = sprites[id][direction].image
  let offset = sprites[id][direction].offset
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
}

function resolve(rockman) {
  if (rockman.ground) {
    if (rockman.state.id === "idle") {
      if (rockman.state.time % 60 >= 58) {
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
    } else if (rockman.state.id === "run-start" || rockman.state.id === "run-stop") {
      return "run-step"
    } else if (rockman.state.id === "land") {
      return "run-0"
    }
  } else {
    return "jump"
  }
}
