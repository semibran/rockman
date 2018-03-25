const presets = {
  block: { solid: true }
}

const paths = { src: "tiles.png" }

const images = {
  sky:    { path: paths.src, location: [ 0, 0 ] },
  ground: { path: paths.src, location: [ 0, 3 ] },
  block:  { path: paths.src, location: [ 1, 3 ] },
  brick:  { path: paths.src, location: [ 2, 3 ] },
  question: [
    { path: paths.src, location: [ 0, 2 ] },
    { path: paths.src, location: [ 1, 2 ] },
    { path: paths.src, location: [ 2, 2 ] }
  ],
  pipe: {
    left:  { path: paths.src, location: [ 1, 1 ] },
    right: { path: paths.src, location: [ 2, 1 ] },
    top: {
      left:  { path: paths.src, location: [ 1, 0 ] },
      right: { path: paths.src, location: [ 2, 0 ] }
    }
  },
  bush: {
    left:   { path: paths.src, location: [ 0, 4 ] },
    center: { path: paths.src, location: [ 1, 4 ] },
    right:  { path: paths.src, location: [ 2, 4 ] }
  },
  cloud: {
    left:   { path: paths.src, location: [ 0, 6 ] },
    center: { path: paths.src, location: [ 1, 6 ] },
    right:  { path: paths.src, location: [ 2, 6 ] },
    top: {
      left:   { path: paths.src, location: [ 0, 5 ] },
      center: { path: paths.src, location: [ 1, 5 ] },
      right:  { path: paths.src, location: [ 2, 5 ] }
    }
  }
}

const animations = {
  question: [
    { image: images.question[0], delay: 15 },
    { image: images.question[1], delay: 7 },
    { image: images.question[2], delay: 7 },
    { image: images.question[1], delay: 7 },
  ]
}

exports.gravity = 0.25

exports.tiles = [
  { sprite: images.sky,              traits: null },
  { sprite: images.ground,           traits: presets.block },
  { sprite: images.block,            traits: presets.block },
  { sprite: images.brick,            traits: presets.block },
  { sprite: images.pipe.top.left,    traits: presets.block },
  { sprite: images.pipe.top.right,   traits: presets.block },
  { sprite: images.pipe.left,        traits: presets.block },
  { sprite: images.pipe.right,       traits: presets.block },
  { sprite: images.bush.left,        traits: null },
  { sprite: images.bush.center,      traits: null },
  { sprite: images.bush.right,       traits: null },
  { sprite: images.cloud.top.left,   traits: null },
  { sprite: images.cloud.top.center, traits: null },
  { sprite: images.cloud.top.right,  traits: null },
  { sprite: images.cloud.left,       traits: null },
  { sprite: images.cloud.center,     traits: null },
  { sprite: images.cloud.right,      traits: null }
]

exports.layout = {
  size: [ 32, 15 ],
  data: [
     0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
     0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
     0,  0,  0,  0,  3,  3,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 12, 12, 13,  0,  0,  0,  0,  0,  0,  0,  0,  0,
     0,  0,  0,  0, 14, 15,  2,  2,  0, 11, 12, 12, 13,  0,  0,  0,  0,  0, 14, 15, 15, 15, 16,  0,  0,  0,  0,  0,  0,  0,  0,  0,
     2,  0,  0,  0,  0,  0,  2,  2,  3,  3, 15, 15, 16,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11, 12, 12, 13,  0,  0,
     2,  2, 12, 13,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  0, 14, 15, 15, 16,  0,  0,
     2,  2,  2, 16,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  6,  7,  0,  0,  0,  0,  0,  0,  0,
     2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  6,  7,  0,  0,  0,  0,  0,  0,  0,
     2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  0,  0,  0,  0,  0,  2,  2,  3,  3,  0,  0,  0,  0,  0,
     2,  2,  0,  0,  0,  0,  4,  5,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,
     2,  2,  0,  0,  0,  0,  6,  7,  0,  0,  3,  3,  0,  0,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,
     2,  2,  0,  0,  2,  2,  6,  7,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,
     2,  2,  9, 10,  2,  2,  6,  7,  0,  0,  0,  8,  9,  9,  2,  2,  2,  2,  2,  2,  2,  2,  9,  9, 10,  0,  8,  9,  2,  2,  2,  2,
     1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,
     1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1
  ]
}
