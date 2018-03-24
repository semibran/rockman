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
          if (x >= rect.x && x < rect.x + rect.width
          &&  y >= rect.y && y < rect.y + rect.height
          ) {
            break
          }
        }

        if (j === rects.length) {
          var rect = { x: x, y: y, width: 1, height: 1 }
          rects.push(rect)

          while (x + rect.width < width && layout.data[i + rect.width]) {
            rect.width++
          }

          while (true) {
            var j = i + rect.height * width
            for (var p = 0; p < rect.width; p++) {
              if (!layout.data[j + p]) {
                break
              }
            }
            if (p === rect.width) {
              rect.height++
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
