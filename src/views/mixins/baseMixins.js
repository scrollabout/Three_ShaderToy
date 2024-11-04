import { onMounted, onUnmounted } from 'vue'

export function useBaseMixins () {
	this.currentTest = (str = '') => {
		console.log(str + '-0') // 初始实现
	}

	onMounted(() => {
		window.addEventListener('resize', this.currentTest)
	})
	console.log(this)
	return {}
}
