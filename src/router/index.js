import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [{
    // name：‘layout’由于它有默认子路由，所以它的名字没有意义，否则 Vue 会给你发黄牌警告
    name: 'layout',
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

export default router
