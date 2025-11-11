import {
	defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	//配置根路径 @
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	// 添加 server 配置
	server: {
		// 设置代理
		proxy: {
			'/api': {
				target: 'http://localhost:3000', // 目标服务器地址
				changeOrigin: true, // 是否改变请求头中的 Origin，默认为 false
				rewrite: (path) => path.replace(/^\/api/, '/api'), // 重写路径
			},
		},
	}
	/*server: {
		proxy: {
		  '/api': {
			target: 'http://118.195.143.106:3000', // 替换为你的云服务器公网IP
			changeOrigin: true,
			rewrite: (path) => path.replace(/^\/api/, ''), // 按需调整重写规则
		  },
		}
	  }*/
})