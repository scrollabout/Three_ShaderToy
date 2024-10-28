export default [
	{
		path: '/shadertoy',
		component: () => import('@/views/shaderToy/main.vue'),
		children: [
			{
				path: 'userstest1',
				meta: {
					title: '测试2',
					icon: 'DoubleLeftOutlined',
				},
				children: [
					{
						path: 'test1',
						meta: {
							title: '测试2.1',
							icon: 'DoubleLeftOutlined',
						},
						children: [
							{
								path: 'test2',
								meta: {
									title: '测试2.1.1',
									icon: 'DoubleLeftOutlined',
								},
								component: () => import('@/views/shaderToy/test4.vue')
							},
						]
					}
				]
			},
			{
				path: 'userstest2',
				meta: {
					title: '测试3',
					icon: 'DoubleLeftOutlined',
				},
				component: () => import('@/views/shaderToy/test3.vue')
			},
		],
	}
]
