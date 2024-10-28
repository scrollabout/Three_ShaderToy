import * as THREE from 'three'
import {getElMainPadding, getElSubmenuWidth} from './globalValue'

let getIntersects = function (point, camera, objects) {
  let mouse = THREE.Vector2()
  let raycaster = THREE.Raycaster()
  mouse.set((point.x * 2) - 1, -(point.y * 2) + 1)
  raycaster.setFromCamera(mouse, camera)
  return raycaster.intersectObjects(objects)
}

let getContainSize = function () {
  let windowWidth = window.innerWidth
  let windowHeight = window.innerHeight
  let elSubmenuWidth = getElSubmenuWidth()
  let elMainPadding = getElMainPadding()
  return {
    width: windowWidth - elSubmenuWidth - elMainPadding * 2,
    height: windowHeight - elMainPadding * 2
  }
}

// let RGBToColor = function (R, G, B) {
//   // RGB颜色值的正则
//   let reg = /^(rgb|RGB)/
//   let color = this
//   if (reg.test(color)) {
//     let strHex = '#'
//     // 把RGB的3个数值变成数组
//     let colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')
//     // 转成16进制
//     for (let i = 0; i < colorArr.length; i++) {
//       let hex = Number(colorArr[i]).toString(16)
//       if (hex === '0') {
//         hex += hex
//       }
//       strHex += hex
//     }
//     return strHex
//   } else {
//     return String(color)
//   }
// }

export {
  getIntersects,
  getContainSize
}
