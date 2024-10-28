import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import baseMixins from '@/views/mixins/baseMixins'
import * as THREE from 'three'
import * as glMatix from 'gl-matrix'

import './assets/main.scss'

window.THREE = THREE
window.glMatix = glMatix
const app = createApp(App)

app.use(ElementPlus, { size: 'default', zIndex: 2000 })
// app.use(baseMixins)
app.use(store)
app.use(router)
app.mount('#app')
