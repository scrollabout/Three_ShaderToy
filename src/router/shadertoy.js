export default [
	{
		path: '/shadertoy',
		component: () => import('@/views/shaderToy/main.vue'),
		children: [
			{
				path: 'noise',
				meta: {
					title: '噪波',
					icon: 'DoubleLeftOutlined',
				},
				children: [
					{
						path: 'noise01',
						meta: {
							title: '噪波测试1',
							icon: 'DoubleLeftOutlined',
						},
						component: () => import('@/views/shaderToy/noise/noise01')
					},
					{
						path: 'noise02',
						meta: {
							title: '多渲染目标',
							icon: 'DoubleLeftOutlined',
						},
						component: () => import('@/views/shaderToy/noise/noise02')
					},
					{
						path: 'noise03',
						meta: {
							title: '多通道渲染',
							icon: 'DoubleLeftOutlined',
						},
						component: () => import('@/views/shaderToy/noise/noise03')
					}
				]
			}
		],
	}
]
