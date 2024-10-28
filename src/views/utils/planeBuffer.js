export default class planeBuffer {
  constructor (width = 1, height = 1) {
    Object.defineProperty(this, 'type', {value: 'planeBuffer', configurable: true})
    this.width = width
    this.height = height
    this.attributes = {}
    this.index = []

    const indices = [
      0, 1, 2,
      3, 0, 2
    ]
    const vertices = [
      width / 2, height / 2, 0,
      -width / 2, height / 2, 0,
      -width / 2, -height / 2, 0,
      width / 2, -height / 2, 0
    ]

    const colors = [
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, 1.0
    ]
    this.setIndex(indices)
    this.setAttribute('position', vertices)
    this.setAttribute('color', colors)
  }

  setAttribute (type, data) {
    this.attributes[type] = {
      array: data,
      itemSize: 3,
      count: data.length / 3
    }
  }

  setIndex (data) {
    this.index = {
      array: data,
      itemSize: 1,
      count: data.length / 1
    }
  }
}
