import { onMounted } from 'vue'

export function useBaseMixins () {

	let temp = 0

	const override = {
		test (str = '') {
			console.log(str + '-' + temp)
			temp += 1
		}
	}

	onMounted(() => {
		window.addEventListener('resize', override.test)
		override.test()
	})

	return {
		override,
		...override
	}
}
