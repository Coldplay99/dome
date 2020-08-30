import Vue from 'vue'
import VueRouter from 'vue-router'

import login from '@/components/login/Login.vue'
import home from '@/components/home/home.vue'
import users from '@/components/home/main/users.vue'
import rights from '@/components/home/main/rights.vue'
import roles from '@/components/home/main/roles.vue'
import goods from '@/components/home/main/goods.vue'
import goodsadd from '@/components/home/main/goodsAdd.vue'
import params from '@/components/home/main/params.vue'
import categories from '@/components/home/main/categories.vue'
import orders from '@/components/home/main/orders.vue'
import reports from '@/components/home/main/reports.vue'


import { Message } from 'element-ui'

Vue.use(VueRouter)

  const routes = [
    // {
    //   path: '/',
    //   redirect:'/Login'
    // },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/',
    name: 'home',
    component: home,
    children:[
      {
      name:'users',
      path:'users',
      component: users
      },
      {
      name:'rights',
      path:'rights',
      component: rights
      },
      {
      name:'roles',
      path:'roles',
      component: roles
      },
      {
        name:'goods',
        path:'goods',
        component: goods
      },
      {
        name:'goodsAdd',
        path:'goodsAdd',
        component: goodsadd
      },
      {
        name:'params',
        path:'params',
        component: params
      },
      {
        name:'categories',
        path:'categories',
        component: categories
      },
      {
        name:'orders',
        path:'orders',
        component: orders
      },
      {
        name:'reports',
        path:'reports',
        component: reports
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 全局路由守卫 判断是否存在token 就不用在home组件等每个组件中判断
router.beforeEach((to, from, next) => {
  // ... 
    if( to.path === '/login'){
      next()
    }else{
      const token = localStorage.getItem('token')
      if(!token){
        router.push({name:'login'})
        Message.warning('请先登录')
        return
      }
    } 
    next()
  }
)

export default router
