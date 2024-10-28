import { v4 } from 'uuid'
import { initLocalObj, setLocalObj } from './localObjClass.js'

export default {
  data () {
    return {
      _canSetWork: false,
      localInfo: {
        localId: v4(),
        parentLocalInfo: this.parentLocalInfo
      },
      localObject: null
    }
  },
  watch: {
    'localInfo.localId' () {
      this._initLocalValue()
    },
    localObject: {
      handler (nv, ov) {
        if (this._canSetWork) {
          if (ov) {
            this.localObjectChanged()
          }
        }
      },
      deep: true
    }
  },
  created () {
    this._isInjectAfter()
    this._initLocalValue()
  },
  provide () {
    return {
      localInfo: this.localInfo
    }
  },
  methods: {
    _isInjectAfter () {
      this._canSetWork = true
    },
    _initLocalValue () {
      if (this._canSetWork) {
        this.localObject = initLocalObj(this.localInfo.localId)
      }
    },
    setLocalObject (obj) {
      if (this._canSetWork) {
        if (this.localObject) {
          setLocalObj(this.localInfo.localId, obj)
        }
      }
    },
    localObjectChanged () {
    }
  }
}
