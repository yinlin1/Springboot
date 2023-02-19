import Vue from 'vue'
import VueRouter from 'vue-router'
import Manage from "@/views/Manage";
import store from "@/store";
import Login from "@/views/Login.Vue"
import Register from "@/views/Register";
// import User from "@/views/User";

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/front',
    name: 'Front',
    component: () => import('../views/front/Front.vue'),
    children:[
      {path: 'home', name: 'Front', component: () => import('../views/front/Home.vue')},
      {path: '/front/video',name: 'Video',component: () => import('../views/front/Video.vue')},
      {path: '/front/videodetail',name: 'VideoDetail',component: () => import('../views/front/VideoDetail')},
      {path: '/front/article',name: 'FrontArticle',component: () => import('../views/front/Article.vue')},
      {path: '/front/articledetail',name: 'FrontArticleDetail',component: () => import('../views/front/ArticleDetail.vue')},
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export const setRoutes = () => {
  const StarMenus = localStorage.getItem("menus")
  if (StarMenus){
    const ManageRouter = {path: '/',name: 'Manage',component: Manage,redirect: "/login",children:[]}
    const menus = JSON.parse(StarMenus)
    let PersonRouter = [{path: '/person', name: '个人信息', component: () => import('../views/Person.vue')}];
    PersonRouter.push({path: '/password', name: '修改密码', component: () => import('../views/Repassword.vue')})
    PersonRouter.forEach(item => {
      ManageRouter.children.push(item)
    })
    menus.forEach(item => {
      if (item.path){
        let itemMenu = {path:item.path.replace('/',''),name:item.name,component:() => import('../views/'+ item.pagePath +'.vue')}
        ManageRouter.children.push(itemMenu)
      }else if (item.children.length){
        item.children.forEach(item => {
          if (item.path){
            let itemMenu = {path:item.path.replace('/',''),name:item.name,component:() => import('../views/'+ item.pagePath +'.vue')}
            ManageRouter.children.push(itemMenu)
          }
        })
      }
    })
    router.addRoute(ManageRouter)
  }
}
setRoutes()
// 路由守卫
router.beforeEach((to,from,next)=> {
  localStorage.setItem("currentPathName",to.name) // 设置当前路由名称
  store.commit("setPath") // 触发store的数据更
  if (!to.matched.length) {
    const nextRouter = localStorage.getItem("menus")
    if (nextRouter){
      next('/home') // 放行路由
    }else {
      next('/front/home')
    }
  }
  next()
})

export default router
