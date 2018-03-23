module.exports = function rectify(layout) {
  var rects = []
  var width = layout.size[0]
  var height = layout.size[1]
  var i = 0
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      if (layout.data[i]) {
        for (var j = 0; j < rects.length; j++) {
          var rect = rects[j]
          if (x >= rect.x && x < rect.x + rect.w
          &&  y >= rect.y && y < rect.y + rect.h
          ) {
            break
          }
        }

        if (j === rects.length) {
          var rect = { x: x, y: y, w: 1, h: 1 }
          rects.push(rect)

          while (x + rect.w < width && layout.data[i + rect.w]) {
            rect.w++
          }

          while (true) {
            var j = i + rect.h * width
            for (var p = 0; p < rect.w; p++) {
              if (!layout.data[j + p]) {
                break
              }
            }
            if (p === rect.w) {
              rect.h++
            } else {
              break
            }
          }
        }
      }
      i++
    }
  }
  return rects
}
