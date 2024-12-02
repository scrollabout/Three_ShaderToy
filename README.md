# three_shadertoy

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### 项目信息
一、node version 20.10.0

二、使用antv-design作为基础的UI库

三、结合vue3和three.js对shadertoy的渲染流程进行复刻

四、从shadertoy复制过来的shader还需要以下操作才可以显示
```
1. mainImage改成main
2. fragCoord改成gl_FragCoord.xy
3. fragColor改成gl_FragColor
```
五、运行完成后访问 http://localhost:8080/#/shadertoy

### OpenGL的最基本流程
一、创建着色器
```
1. 编写顶点着色器（vertexShader）和片段着色器（fragmentShader）代码
2. 创建着色器 glCreateShader
3. 将着色器代码和着色器关联 glShaderSource
4. 编译着色器 glCompileShader
5. 创建着色器程序 glCreateProgram
6. 把第二步创建的着色器关联到着色器程序上 glAttachShader
7. 链接着色器程序 glLinkProgram
8. 如果着色器不再用到其它地方可删除着色器以节省资源  glDeleteShader
```
二、链接顶点属性
```
基础有三种缓冲区类型：
顶点数组对象：Vertex Array Object，VAO
顶点缓冲对象：Vertex Buffer Object，VBO
元素缓冲对象：Element Buffer Object，EBO 或 索引缓冲对象 Index Buffer Object，IBO

1. 创建VAO glGenVertexArrays
2. 绑定VAO，任何随后的顶点属性调用都会储存在这个VAO中 glBindVertexArray
3. 创建VBO glGenBuffers
4. 绑定VBO glBindBuffer
5. 复制顶点数据到VBO glBufferData
6. 设置如何解析VBO数据 glVertexAttribPointer
7. 启用VBO数据 glEnableVertexAttribArray
8. 解绑VBO glBindBuffer
9. 解绑VAO glBindVertexArray
10. 创建IBO glGenBuffers
11. 绑定IBO glBindBuffer
12. 复制数据到IBO glBufferData
13. 解绑IBO glBindBuffer
```
三、渲染
```
1. 开始渲染循环
2. 使用着色器程序 glUseProgram
3. 绑定VAO glBindVertexArray
4. 绑定IBO glBindBuffer
5. 通过IBO开始渲染 glDrawElements
6. 开始下一次渲染循环
```
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
