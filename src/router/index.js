import Vue from 'vue'
import Router from 'vue-router'
import home from '../views/home.vue'
import login from '../views/login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: home
    },
    {
      path: '/login',
      component: login
    }
  ]
})
