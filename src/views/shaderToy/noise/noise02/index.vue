<template>
  <div
    id="renderView"
    ref="renderView"
    class="full-view"
  />
</template>

<script setup>
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useTemplateRef, onBeforeUnmount, onMounted, nextTick } from 'vue'
import { ShadertoyPass } from '@/views/pass/ShadertoyPass'
import LonglowCommon from '@/views/shaders/ShadertoyPassTest/LonglowCommon.frag'
import LonglowImage from '@/views/shaders/ShadertoyPassTest/LonglowImage.frag'
import LonglowBufferA from '@/views/shaders/ShadertoyPassTest/LonglowBufferA.frag'

let composer = null
let containerSize = {
  width: 1,
  height: 1
}
let container = null
let renderer = null
let controls = null
let scene = null
let camera = null
let shadertoyPass = null

const $refs = useTemplateRef('renderView')

window.addEventListener('resize', onWindowResize)

onMounted(() => {
  nextTick(() => {
    updateContainerSize()
    init()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  renderer.setAnimationLoop(null)
})

function init () {
  container = document.getElementById('renderView')
  createRender()
  container.appendChild(renderer.domElement)
  createScene()
  createCamera()
  createCameraControl()
  composer = new EffectComposer(renderer)
  shadertoyPass = new ShadertoyPass(
    renderer,
    {
      fragmentShader: LonglowImage
    },
    LonglowCommon,
    {
      fragmentShader: LonglowBufferA
    }
  )
  composer.addPass(shadertoyPass)
}

// 创建渲染器
function createRender () {
  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(containerSize.width, containerSize.height)
  renderer.setAnimationLoop(render)
  // renderer.toneMapping = THREE.NoToneMapping
  // renderer.toneMappingExposure = 0.5
}

// 创建场景
function createScene () {
  scene = new THREE.Scene()
  const axesHelper = new THREE.AxesHelper(2000)
  axesHelper.layers.enableAll()
  scene.add(axesHelper)
}

// 创建摄像机
function createCamera () {
  camera = new THREE.PerspectiveCamera(55, containerSize.width / containerSize.height, 1, 20000)
  camera.position.set(0, 0, 60)
}

// 创建摄像机控制器
function createCameraControl () {
  controls = new OrbitControls(camera, renderer.domElement)
  // controls.maxPolarAngle = Math.PI * 0.495
  controls.target.set(0, 0, 0)
  // controls.minDistance = 40.0
  // controls.maxDistance = 200.0
  controls.update()
}

// 更新渲染框的大小
function updateContainerSize () {
  const width = $refs.value ? $refs.value.offsetWidth : 1
  const height = $refs.value ? $refs.value.offsetHeight : 1
  containerSize.width = width
  containerSize.height = height
  return {
    width,
    height
  }
}

// 窗口变化
function onWindowResize () {
  const size = updateContainerSize()
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()
  renderer.setSize(size.width, size.height)
  composer.setSize(size.width, size.height)
}

// 渲染
function render () {
  shadertoyPass.setIChannel(0, 0, shadertoyPass.getBufferRenderTarget(1).texture)
  composer.render()
}
</script>

<!--
参考代码
<template>
  <div
    id="renderView"
    ref="renderView"
    class="full-view"
  />
</template>

<script setup>
/**
 * x,y 鼠标位置
 * z 鼠标是否按下
 * w click
 */
const iMouse = new THREE.Vector4()

const { width, height } = helper.renderer.getSize(new THREE.Vector2())
/**
 * x,y canvas width height
 * z renderer的像素比
 */
const iResolution = new THREE.Vector3(width, height, helper.renderer.pixelRatio)

const common = `

    #define dt 0.15
    #define USE_VORTICITY_CONFINEMENT
    //#define MOUSE_ONLY

    //Recommended values between 0.03 and 0.2
    //higher values simulate lower viscosity fluids (think billowing smoke)
    #define VORTICITY_AMOUNT 0.11

    float mag2(vec2 p){return dot(p,p);}
    vec2 point1(float t) {
        t *= 0.62;
        return vec2(0.12,0.5 + sin(t)*0.2);
    }
    vec2 point2(float t) {
        t *= 0.62;
        return vec2(0.88,0.5 + cos(t + 1.5708)*0.2);
    }

    vec4 solveFluid(sampler2D smp, vec2 uv, vec2 w, float time, vec3 mouse, vec3 lastMouse)
    {
        const float K = 0.2;
        const float v = 0.55;

        vec4 data = textureLod(smp, uv, 0.0);
        vec4 tr = textureLod(smp, uv + vec2(w.x , 0), 0.0);
        vec4 tl = textureLod(smp, uv - vec2(w.x , 0), 0.0);
        vec4 tu = textureLod(smp, uv + vec2(0 , w.y), 0.0);
        vec4 td = textureLod(smp, uv - vec2(0 , w.y), 0.0);

        vec3 dx = (tr.xyz - tl.xyz)*0.5;
        vec3 dy = (tu.xyz - td.xyz)*0.5;
        vec2 densDif = vec2(dx.z ,dy.z);

        data.z -= dt*dot(vec3(densDif, dx.x + dy.y) ,data.xyz); //density
        vec2 laplacian = tu.xy + td.xy + tr.xy + tl.xy - 4.0*data.xy;
        vec2 viscForce = vec2(v)*laplacian;
        data.xyw = textureLod(smp, uv - dt*data.xy*w, 0.).xyw; //advection

        vec2 newForce = vec2(0);
        #ifndef MOUSE_ONLY
        #if 1
        newForce.xy += 0.75*vec2(.0003, 0.00015)/(mag2(uv-point1(time))+0.0001);
        newForce.xy -= 0.75*vec2(.0003, 0.00015)/(mag2(uv-point2(time))+0.0001);
        #else
        newForce.xy += 0.9*vec2(.0003, 0.00015)/(mag2(uv-point1(time))+0.0002);
        newForce.xy -= 0.9*vec2(.0003, 0.00015)/(mag2(uv-point2(time))+0.0002);
        #endif
        #endif

        if (mouse.z > 1. && lastMouse.z > 1.)
        {
            vec2 vv = clamp(vec2(mouse.xy*w - lastMouse.xy*w)*400., -6., 6.);
            newForce.xy += .001/(mag2(uv - mouse.xy*w)+0.001)*vv;
        }

        data.xy += dt*(viscForce.xy - K/dt*densDif + newForce); //update velocity
        data.xy = max(vec2(0), abs(data.xy)-1e-4)*sign(data.xy); //linear velocity decay

        #ifdef USE_VORTICITY_CONFINEMENT
        data.w = (tr.y - tl.y - tu.x + td.x);
        vec2 vort = vec2(abs(tu.w) - abs(td.w), abs(tl.w) - abs(tr.w));
        vort *= VORTICITY_AMOUNT/length(vort + 1e-9)*data.w;
        data.xy += vort;
        #endif

        data.y *= smoothstep(.5,.48,abs(uv.y-0.5)); //Boundaries

        data = clamp(data, vec4(vec2(-10), 0.5 , -10.), vec4(vec2(10), 3.0 , 10.));

        return data;
    }
    `

const bufferAFragment = `
    uniform float iTime;
    uniform vec3 iResolution;
    uniform vec4 iMouse;
    uniform float iFrame;
    uniform sampler2D iChannel0;

    ${common}
    //Chimera's Breath
    //by nimitz 2018 (twitter: @stormoid)

    //see "Common" tab for fluid simulation code

    float length2(vec2 p){return dot(p,p);}
    mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}

    void main()
    {
        vec2 uv = gl_FragCoord.xy/iResolution.xy;
        vec2 w = 1.0/iResolution.xy;

        vec4 lastMouse = texelFetch(iChannel0, ivec2(0,0), 0);
        vec4 data = solveFluid(iChannel0, uv, w, iTime, iMouse.xyz, lastMouse.xyz);

        if (iFrame < 20.)
        {
            data = vec4(0.5,0,0,0);
        }

        if (gl_FragCoord.y < 1.)
            data = iMouse;

        gl_FragColor = data;

    }
    `

const bufferA = new BufferShader(
  helper.renderer,
  helper.camera,
  bufferAFragment,
  {
    iTime: { value: 0 },
    iFrame: { value: 0 },
    iMouse: { value: iMouse },
    iResolution: { value: iResolution },
    iChannel0: { value: null },
  },
  iResolution.x,
  iResolution.y
)
const bufferB = new BufferShader(
  helper.renderer,
  helper.camera,
  bufferAFragment,
  {
    iTime: { value: 0 },
    iFrame: { value: 0 },
    iMouse: { value: iMouse },
    iResolution: { value: iResolution },
    iChannel0: { value: null },
  },
  iResolution.x,
  iResolution.y
)
const bufferC = new BufferShader(
  helper.renderer,
  helper.camera,
  bufferAFragment,
  {
    iTime: { value: 0 },
    iFrame: { value: 0 },
    iMouse: { value: iMouse },
    iResolution: { value: iResolution },
    iChannel0: { value: null },
  },
  iResolution.x,
  iResolution.y
)

const bufferDFragment = `
    uniform float iTime;
    uniform vec3 iResolution;
    uniform vec4 iMouse;
    uniform float iFrame;
    uniform sampler2D iChannel0;
    uniform sampler2D iChannel1;

    ${common}
    mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}

    //shader incoming relating to this palette
    vec3 getPalette(float x, vec3 c1, vec3 c2, vec3 p1, vec3 p2)
    {
        float x2 = fract(x/2.0);
        x = fract(x);
        mat3 m = mat3(c1, p1, c2);
        mat3 m2 = mat3(c2, p2, c1);
        float omx = 1.0-x;
        vec3 pws = vec3(omx*omx, 2.0*omx*x, x*x);
        return clamp(mix(m*pws, m2*pws, step(x2,0.5)),0.,1.);
    }

    vec4 pal(float x)
    {
        vec3 pal = getPalette(-x, vec3(0.2, 0.5, .7), vec3(.9, 0.4, 0.1), vec3(1., 1.2, .5), vec3(1., -0.4, -.0));
        return vec4(pal, 1.);
    }

    vec4 pal2(float x)
    {
        vec3 pal = getPalette(-x, vec3(0.4, 0.3, .5), vec3(.9, 0.75, 0.4), vec3(.1, .8, 1.3), vec3(1.25, -0.1, .1));
        return vec4(pal, 1.);
    }

    void main()
    {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        vec2 mo = iMouse.xy / iResolution.xy;
        vec2 w = 1.0/iResolution.xy;

        vec2 velo = textureLod(iChannel0, uv, 0.).xy;
        vec4 col = textureLod(iChannel1, uv - dt*velo*w*3., 0.); //advection
        if (gl_FragCoord.y < 1. && gl_FragCoord.x < 1.)
            col = vec4(0);
        vec4 lastMouse = texelFetch(iChannel1, ivec2(0,0), 0).xyzw;

        if (iMouse.z > 1. && lastMouse.z > 1.)
        {
            float str = smoothstep(-.5,1.,length(mo - lastMouse.xy/iResolution.xy));
            col += str*0.0009/(pow(length(uv - mo),1.7)+0.002)*pal2(-iTime*0.7);
        }

        #ifndef MOUSE_ONLY
        col += .0025/(0.0005+pow(length(uv - point1(iTime)),1.75))*dt*0.12*pal(iTime*0.05 - .0);
        col += .0025/(0.0005+pow(length(uv - point2(iTime)),1.75))*dt*0.12*pal2(iTime*0.05 + 0.675);
        #endif


        if (iFrame < 20.)
        {
            col = vec4(0.);
        }

        col = clamp(col, 0.,5.);
        col = max(col - (0.0001 + col*0.004)*.5, 0.); //decay

        if (gl_FragCoord.y < 1. && gl_FragCoord.x < 1.)
            col = iMouse;

        gl_FragColor = col;

    }

    `

const bufferD = new BufferShader(
  helper.renderer,
  helper.camera,
  bufferDFragment,
  {
    iTime: { value: 0 },
    iFrame: { value: 0 },
    iMouse: { value: iMouse },
    iResolution: { value: iResolution },
    iChannel0: { value: null },
    iChannel1: { value: null },
  },
  iResolution.x,
  iResolution.y
)

const mainBuffer = new BufferShader(
  helper.renderer,
  helper.camera,
  `
        uniform vec3 iResolution;
        uniform sampler2D iChannel0;
        uniform sampler2D iChannel1;


        void main()
        {
            vec4 col = textureLod(iChannel0, gl_FragCoord.xy/iResolution.xy, 0.);
            if (gl_FragCoord.y < 1. || gl_FragCoord.y >= (iResolution.y-1.))
                col = vec4(0);
            gl_FragColor = col;
        }
        `,
  {
    iResolution: { value: iResolution },
    iChannel0: { value: null },
  },
  iResolution.x,
  iResolution.y
)

helper.controls.dispose()

const handleMove = (e) => {
  iMouse.x = e.pageX
  iMouse.y = innerHeight - e.pageY
}
document.addEventListener('mousedown', (e) => {
  iMouse.z = 2
  iMouse.w = 2

  document.addEventListener('mousemove', handleMove)

  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', handleMove)
    iMouse.z = 0
    iMouse.w = 0
  })
})

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 2),
  new THREE.MeshBasicMaterial({ map: mainBuffer.readBuffer.texture })
)

helper.animation(() => {
  const delta = helper.clock.getDelta()
  bufferA.uniforms['iChannel0'].value = bufferC.readBuffer.texture
  bufferA.uniforms['iFrame'].value++
  bufferA.uniforms['iTime'].value += delta
  bufferA.render()

  bufferB.uniforms['iChannel0'].value = bufferA.readBuffer.texture
  bufferB.uniforms['iFrame'].value++
  bufferB.uniforms['iTime'].value += delta
  bufferB.render()

  bufferC.uniforms['iChannel0'].value = bufferB.readBuffer.texture
  bufferC.uniforms['iFrame'].value++
  bufferC.uniforms['iTime'].value += delta
  bufferC.render()

  bufferD.uniforms['iChannel0'].value = bufferA.readBuffer.texture
  bufferD.uniforms['iChannel1'].value = bufferD.readBuffer.texture
  bufferD.uniforms['iFrame'].value++
  bufferD.uniforms['iTime'].value += delta
  bufferD.render()

  mainBuffer.uniforms['iChannel0'].value = bufferD.readBuffer.texture
  mainBuffer.render()
})
</script>

<style
  scoped
  lang="scss"
>

</style>
-->
