import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as THREE from 'three'
// import baseMixins from '@/views/mixins/baseMixins'
import * as glMatix from 'gl-matrix'
import 'ant-design-vue/dist/reset.css'
import Antd from 'ant-design-vue'
import * as antIcons from '@ant-design/icons-vue'
import './assets/main.scss'
import _ from 'lodash'

window.THREE = THREE
window.glMatix = glMatix
const app = createApp(App)

app.config.globalProperties.lodash = _

Object.keys(antIcons).forEach(key => {
	app.component(key, antIcons[key])
})

app.use(Antd)
// app.use(baseMixins)
app.use(store)
app.use(router)
app.mount('#app')
