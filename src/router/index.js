import Vue from 'vue'
import Router from 'vue-router'
//import Recommend from '@/components/recommend/recommend.vue'
Vue.use(Router)

const Recommend = (resolve) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}


export default new Router({
  routes: [
    // {
    //   path: '/',
    //   redirect: '/recommend',
    //   //component: (resolve) => require(['@/components/recommend/recommend'], resolve)
    //   component:Recommend
    // }
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [{
         path:':id',
         component:(resolve) => require(['@/components/recom-detail/recom-detail'], resolve)
      }]
    },
    {
      path: '/singer',
      component: (resolve) => require(['@/components/singer/singer.vue'], resolve),
      children: [{
        path:':id',
        component:(resolve) => require(['@/components/singer-detail/singer-detail'], resolve)
      }]
    },
    {
      path: '/rank',
      component: (resolve) => require(['@/components/rank/rank'], resolve),
      children: [{
        path:':id',
        component:(resolve) => require(['@/components/top-list/top-list'], resolve)
      }]
    },
      {
      path: '/search',
      name: 'Search',
      component: (resolve) => require(['@/components/search/search'], resolve),
      children: [{
        path: ':id',
        component: (resolve) => require(['@/components/singer-detail/singer-detail'], resolve)
      }]
    },
    {
      path: '/user',
      name: 'User',
      component: (resolve) => require(['@/components/user-center/user-center'], resolve)
    }
  ]
})
