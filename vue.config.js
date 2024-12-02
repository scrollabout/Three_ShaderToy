const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
	transpileDependencies: true,
	configureWebpack: config => {
		config.module.rules.push({
			test: /\.(glsl|frag|vert|fs|vs)$/,
			use: [
				// { loader: 'webpack-glsl-loader' },
				{ loader: 'raw-loader' },
				{ loader: 'glslify-loader' },
				{ loader: 'glsl-module-loader', },
			]
		})
	},
	chainWebpack: (config) => {
		config.plugin('define').tap((definitions) => {
			Object.assign(definitions[0], {
				__VUE_OPTIONS_API__: 'true',
				__VUE_PROD_DEVTOOLS__: 'false',
				__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
			})
			return definitions
		})
	}
})
