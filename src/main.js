import Vue from 'vue'
import router from './router'
// 引入Element组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
// 引入自己的css样式
import './styles/index.less'
// 引入进度条第三方包
import 'nprogress/nprogress.css'
import axios from 'axios'

// 配置基础路由
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

// Axios请求拦截器
// 所有使用axios发起的请求都要先经过这里
axios.interceptors.request.use(config => {
  // const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  console.log('有请求经过了')
  // return config就是允许通过的方式
  console.log(config)
  // config.headers.Authorization = `Bearer ${userInfo.token}`
  return config
}, error => {
  // 如果有错误
  return Promise.reject(error)
})

// Axios响应拦截器
axios.interceptors.response.use(response => {
  // 状态码大于等于200的小于400的状态码进入这里
  console.log(response)
  // 统一处理响应的格式
  return response.data.data
}, error => {
  // 大于等于400的状态码进入这里
  return Promise.reject(error)
})
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
