# three_shadertoy

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Info
1.node version 20.10.0

2.使用antv-design作为基础的UI库

3.结合vue3和three.js对shadertoy的渲染流程进行复刻

4.从shadertoy复制过来的shader还需要以下操作才可以显示

    mainImage改成main
    fragCoord改成gl_FragCoord.xy
    fragColor改成gl_FragColor

5.运行完成后访问 http://localhost:8080/#/shadertoy

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
