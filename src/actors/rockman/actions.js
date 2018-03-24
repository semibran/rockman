exports.move = move
exports.stop = stop
exports.jump = jump
exports.fall = fall
exports.update = update
exports.render = require("./render")

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
