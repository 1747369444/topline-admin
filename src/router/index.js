import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'

Vue.use(Router)

const router = new Router({
  routes: [{
    // name：‘layout’由于它有默认子路由，所以它的名字没有意义，否则 Vue 会给你发黄牌警告
    // name: 'layout',
    path: '/',
    component: () => import('@/views/layout'),
    // 子路由
    children: [{
      name: 'home',
      path: '', // 为空为默认子路由，默认渲染到layout中
      component: () => import('@/views/home')
    },
    {
      name: 'publish',
      path: '/publish',
      component: () => import('@/views/publish')
    }
    ]
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login')
  }
  ]
})

/**
 * 所有路由导航都要经过这里
 * to 去哪儿
 * from 来自哪里
 * next 允许通过的方法
 */

router.beforeEach((to, from, next) => {
  nprogress.start()
  const userInfo = window.localStorage.getItem('user_info')
  // 如果是非 /login 页面，判断其登录状态
  if (to.name !== 'login') {
    // 如果没有登录，让其跳转到登录页
    if (!userInfo) {
      next({
        name: 'login'
      })
    } else {
      // 如果登录了则允许通过
      next()
    }
  } else {
    // 如果登录了不允许访问登录页了
    if (userInfo) {
      next(false)
    } else {
      // 没有访问才能访问登录页
      next()
    }
  }
})
// 路由导航完成后进入这里
router.afterEach((to, from) => {
  nprogress.done()
})
// 导出router
export default router
