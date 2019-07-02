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
// 引入JSONbig处理不安全整数范围
import JSONbig from 'json-bigint'
// 引入vuex
import store from './store'

// 配置基础路由
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'

// 使用JSONbig处理返回数据中超出JS安全整数范围会导致整数无法精确表示
axios.defaults.transformResponse = [function (data) {
  // 这里的data是未经处理的后端响应数据：JSON格式字符串
  try {
    // data数据可能不是标准的JSON格式字符串，否则会导致JSON.parse(data)转换报错
    return JSONbig.parse(data)
  } catch (err) {
    // 无法转换的数据直接原样返回
    return data
  }
}]

// Axios请求拦截器
// 所有使用axios发起的请求都要先经过这里
axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  // console.log('有请求经过了')
  // return config就是允许通过的方式
  // console.log(config)
  // 如果登录了，才给那些需要 token 的接口统一添加 token 令牌
  // 登录相关接口不需要添加 token 令牌，想要也没有
  if (userInfo) {
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  return config
}, error => {
  // 如果有错误
  return Promise.reject(error)
})

// Axios响应拦截器
axios.interceptors.response.use(response => {
  // 状态码大于等于200的小于400的状态码进入这里
  // console.log(response)
  // 统一处理响应的格式
  // 如果返回的格式是对象
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, error => {
  // 大于等于400的状态码进入这里
  // console.log(error)
  const status = error.response.status
  // 401代表401 token过期或未传，防小人伪造user_info
  if (status === 401) {
    // 要记得删除本地存储中的用户信息数据
    window.localStorage.removeItem('user_info')
    // 跳转到登录页面
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
