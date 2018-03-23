exports.move = move
exports.stop = stop
exports.jump = jump
exports.fall = fall
exports.update = update
exports.render = render

function move(rockman, direction) {
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
}

function stop(rockman) {
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
}

function jump(rockman) {
  if (rockman.ground) {
    rockman.velocity[1] = -rockman.stats.jump
    rockman.state.id = "jump"
    rockman.state.time = 0
  }
}

function fall(rockman) {
  if (!rockman.ground && rockman.velocity[1] < 0) {
    rockman.velocity[1] = 0
  }
}

function update(rockman) {
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

  if (rockman.state.id === "land" && rockman.state.time === 2) {
    rockman.state.id = "idle"
    rockman.state.time = 0
  }
}

function render(rockman, sprites) {
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
