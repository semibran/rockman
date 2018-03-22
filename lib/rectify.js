module.exports = function merge(layout) {
  var rects = []
  var width = layout.size[0]
  var height = layout.size[1]
  var index = 0
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var solid = layout.data[index]
      if (solid) {
        for (var i = 0; i < rects.length; i++) {
          var rect = rects[i]
          if (x >= rect.x && x < rect.x + rect.w
          &&  y >= rect.y && y < rect.y + rect.h
          ) {
            break
          }
        }

        if (i < rects.length) {
          continue
        }

        var rect = { x: x, y: y, w: 1, h: 1 }
        while (x + rect.w < width && layout.data[index + rect.w]) {
          rect.w++
        }

        do {
          for (var j = 0; j < rect.w; j++) {
            if (!layout.data[index + rect.h * width + j]) {
              break
            }
          }
          if (j === rect.w) {
            rect.h++
          }
        } while (j === rect.w)
        rects.push(rect)
      }
      index++
    }
  }
  return rects
}
