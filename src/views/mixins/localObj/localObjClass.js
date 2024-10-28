// 替代vuex用于局部状态管理
import Vue from 'vue'
import { cloneDeep } from 'lodash'

class LocalObjClass {
  constructor () {
    this.localValue = Vue.observable({})
    this.singletonObj = new Proxy(this.localValue, {
      get (target, prop, receiver) {
        if (prop === '__target__') {
          return target
        }
        return Reflect.get(target, prop, receiver)
      },
      set: () => {
        throw new Error('请使用setLocalObj为单例赋值')
      }
    })
  }

  getLocalObj () {
    return this.singletonObj
  }

  setLocalObj (obj = {}) {
    Object.keys(obj).forEach(key => {
      if (this.singletonObj[key]) {
        this.localValue[key] = cloneDeep(obj[key])
      } else {
        Vue.set(this.localValue, key, cloneDeep(obj[key]))
      }
    })
  }
}

const localObjMap = new Map()

export function initLocalObj (id) {
  const maplocalObj = new LocalObjClass()
  if (localObjMap.has(id)) {
    localObjMap.delete(id)
  }
  localObjMap.set(id, maplocalObj)
  return maplocalObj.getLocalObj()
}

export function getLocalObj (id) {
  if (localObjMap.has(id)) {
    return localObjMap.get(id).getLocalObj()
  }
  return null
}

export function setLocalObj (id, obj) {
  if (localObjMap.has(id)) {
    return localObjMap.get(id).setLocalObj(obj)
  }
}
