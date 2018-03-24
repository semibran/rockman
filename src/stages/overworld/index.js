const presets = {
  block: { solid: true }
}

const paths = { src: "tiles.png" }

const images = {
  sky:    { path: paths.src, location: [ 0, 0 ] },
  ground: { path: paths.src, location: [ 0, 3 ] },
  block:  { path: paths.src, location: [ 1, 3 ] },
  brick:  { path: paths.src, location: [ 2, 3 ] },
  pipe: {
    left:  { path: paths.src, location: [ 1, 1 ] },
    right: { path: paths.src, location: [ 2, 1 ] },
    top: {
      left:  { path: paths.src, location: [ 1, 0 ] },
      right: { path: paths.src, location: [ 2, 0 ] }
    }
  }
}

exports.gravity = 0.25

exports.tiles = [
  { sprite: images.sky,            traits: null },
  { sprite: images.ground,         traits: presets.block },
  { sprite: images.block,          traits: presets.block },
  { sprite: images.brick,          traits: presets.block },
  { sprite: images.pipe.top.left,  traits: presets.block },
  { sprite: images.pipe.top.right, traits: presets.block },
  { sprite: images.pipe.left,      traits: presets.block },
  { sprite: images.pipe.right,     traits: presets.block }
]

exports.layout = {
  size: [ 16, 15 ],
  data: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 3, 3, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0,
    2, 0, 0, 0, 0, 0, 2, 2, 3, 3, 0, 0, 0, 0, 0, 0,
    2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2,
    2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2,
    2, 2, 0, 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 2, 2,
    2, 2, 0, 0, 0, 0, 6, 7, 0, 0, 3, 3, 0, 0, 2, 2,
    2, 2, 0, 0, 2, 2, 6, 7, 0, 0, 0, 0, 0, 0, 2, 2,
    2, 2, 0, 0, 2, 2, 6, 7, 0, 0, 0, 0, 0, 0, 2, 2,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
  ]
}
