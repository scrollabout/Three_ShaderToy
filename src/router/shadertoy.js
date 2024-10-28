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
					}
				]
			}
		],
	}
]
