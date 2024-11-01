export default [
	{
		path: '/shadertoy',
		component: () => import('@/views/shaderToy/main.vue'),
		children: [
			{
				path: 'noise',
				meta: {
					title: '测试',
					icon: 'DoubleLeftOutlined',
				},
				children: [
					{
						path: 'noise01',
						meta: {
							title: '基础渲染测试',
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
					},
					{
						path: 'noise04',
						meta: {
							title: '多通道渲染封装',
							icon: 'DoubleLeftOutlined',
						},
						component: () => import('@/views/shaderToy/noise/noise04')
					},
					{
						path: 'noise05',
						meta: {
							title: '暂停',
							icon: 'DoubleLeftOutlined',
						},
						component: () => import('@/views/shaderToy/noise/noise05')
					},
					{
						path: 'noise06',
						meta: {
							title: '渲染流程分解',
							icon: 'DoubleLeftOutlined',
						},
						component: () => import('@/views/shaderToy/noise/noise06')
					}
				]
			}
		],
	}
]
