import axios from 'axios'
import { useUserStore } from '../../store/user.js'

export default{
	common:{
		method:'GET',
		data:{},
		params:{},
		headers:{}
	},
	$axios(options={}){
		
		const userStore = useUserStore()
		
		options.method=options.method || this.common.method
		options.data=options.data || this.common.data
		options.params=options.params || this.common.params
		options.headers=options.headers || this.common.headers
		
		//加载动画，请求前
		
		if( options.headers.token ){
			options.headers.token = userStore.token
			if(!userStore.token){
				console.log('用户未登录')
			}
		}
		
		return axios(options).then(v=>{
			let data = v.data.data
			return new Promise((res,rej)=>{
				if(!v) return rej()
				
				//请求结束，关闭加载动画
				
				res(data)
			})
		})
	}
}

/*import axios from 'axios'
import { useUserStore } from '../../store/user.js'

// 替换为你的云服务器公网IP（确保包含端口3000）
const baseURL = 'http://118.195.143.106:3000'

export default {
  common: {
    method: 'GET',
    data: {},
    params: {},
    headers: {}
  },
  $axios(options = {}) {
    const userStore = useUserStore()

    // 合并配置，自动拼接基础地址
    options = {
      baseURL: baseURL, // 统一使用云服务器地址
      method: options.method || this.common.method,
      data: options.data || this.common.data,
      params: options.params || this.common.params,
      headers: options.headers || this.common.headers,
      url: options.url // 调用时只需传接口路径（如 '/api/index'）
    }

    // 处理 token 头部（如果需要）
    if (options.headers.token) {
      options.headers.token = userStore.token || ''
      if (!userStore.token) {
        console.log('提示：用户未登录，token 为空')
      }
    }

    // 发起请求并处理响应
    return axios(options)
      .then(response => {
        // 假设后端返回格式为 { code: 200, data: ..., msg: ... }
        const { data } = response
        return new Promise((resolve, reject) => {
          if (response.status === 200) {
            // 仅返回业务数据（根据后端实际格式调整）
            resolve(data.data || data)
          } else {
            reject(new Error(`请求失败：${data.msg || '未知错误'}`))
          }
        })
      })
      .catch(error => {
        // 捕获网络错误或后端异常
        console.error('接口请求错误：', error.message)
        return Promise.reject(error)
      })
  }
}*/