import { getLocalObj, setLocalObj } from './localObjClass.js'

export default {
  inject: {
    parentLocalInfo: {
      from: 'localInfo'
    }
  },
  data () {
    return {
      parentLocalObject: getLocalObj(this.parentLocalInfo.localId)
    }
  },
  watch: {
    'parentLocalInfo.localId' () {
      this.parentLocalObject = getLocalObj(this.parentLocalInfo.localId)
    },
    parentLocalObject: {
      handler () {
        this.localParentObjectChanged()
      },
      deep: true
    }
  },
  methods: {
    _isInjectAfter () {
      throw new Error('在mixins中应将localProvideMixins放于localInjectMixins后面')
    },
    setParentLocalObject (obj) {
      if (this.parentLocalObject) {
        setLocalObj(this.parentLocalInfo.localId, obj)
      }
    },
    localParentObjectChanged () {
    }
  }
}
