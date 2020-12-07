import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import Comclass from '../components/stores/Comclass.vue'
import Parmars from '../components/stores/parmas.vue'
import goodList from '../components/stores/list.vue'
import AddPage from '../components/stores/add.vue'
import Order from '../components/order/order.vue'



Vue.use(VueRouter)

const routes = [
  {
    path:'/Login',
    component:Login
  },
  {
    path:'/',
    redirect:"/Login" //重定向到login
  },
  {
    path:'/home',
    component:home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:welcome
      },
      {
        path:'/users',
        component:users
      },
      {
        path:'/rights',
        component:rights
      },
      {
        path:'/roles',
        component:roles
      },
      {
        path:'/categories',
        component:Comclass
      },
      {
        path:'/params',
        component:Parmars
      },
      {
        path:'/goods',
        component:goodList
      },
      {
        path:'/goods/add',
        component:AddPage
      },
      {
        path:'/orders',
        component:Order
      }
    ]
  }
]


const router = new VueRouter({
  routes
})

// 挂载路由守卫
router.beforeEach((to,from,next)=>{
  //to 代表将要访问的路径
  //from 代表那个路径跳来
  //next 是一个函数表示放行
  //next()放行 next(/login 强制跳转)
  if(to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})


export default router
