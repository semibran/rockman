import {
  left, right, top, bottom,
  intersects2D as intersects
} from "hitbox"

export default { update }

function update(stage) {
  for (let actor of stage.actors) {
    move(stage, actor, [ actor.velocity[0], 0 ])
    move(stage, actor, [ 0, actor.velocity[1] ])
    actor.velocity[1] += stage.gravity
    actor.state.time++
  }
}

function move(stage, actor, delta) {
  actor.hitbox.position[0] += delta[0]
  actor.hitbox.position[1] += delta[1]

  if (left(actor.hitbox) < 0) {
    left(actor.hitbox, 0)
  } else if (right(actor.hitbox) > 256) {
    right(actor.hitbox, 256)
  }

  let ground = null
  for (let block of stage.blocks) {
    if (intersects(actor.hitbox, block.hitbox)) {
      if (delta[0] < 0) {
        left(actor.hitbox, right(block.hitbox))
        actor.velocity[0] = 0
      } else if (delta[0] > 0) {
        right(actor.hitbox, left(block.hitbox))
        actor.velocity[0] = 0
      }
      if (delta[1] < 0) {
        top(actor.hitbox, bottom(block.hitbox))
        actor.velocity[1] = 0
      } else if (delta[1] > 0) {
        bottom(actor.hitbox, top(block.hitbox))
        actor.velocity[1] = 0
        ground = block
      }
    }
  }
  if (delta[1]) {
    if (!actor.ground) {
      actor.state.id = "land"
      actor.state.time = 0
    }
    actor.ground = ground
  }
}
