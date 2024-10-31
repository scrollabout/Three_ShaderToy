import { ref, onMounted } from 'vue'

export function useBaseMixins () {

	let temp = 0

	function test (str = '') {
		console.log(str + '-' + temp)
		temp += 1
	}

	onMounted(() => {
		window.addEventListener('resize', test)
		console.log('asdasd')
		temp += 1
	})

	return {
		temp
	}
}
