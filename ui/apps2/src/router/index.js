/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/views/layout/Index';

Vue.use(Router);

/**
 * @for meta
 * @param title 标题
 * @param icon 图标
 * @param name 用来匹配路由名称
 */

const constantRouter = [
  // 首页
  {
    path: '/',
    redirect: '/',
    component: Layout,
    meta: { title: 'DeFis-Network' },
    children: [
      {
        path: '/',
        name: 'index',
        component: () => import('@/views/index/Index.vue'),
        meta: { title: 'DeFis-Network' },
      },
      {
        path: '/market/:mid',
        name: 'market',
        component: () => import('@/views/index/Index.vue'),
        meta: { title: 'DeFis-Network' },
      },
      {
        path: '/pools',
        name: 'pools',
        component: () => import(/* webpackChunkName: "pools" */ '@/views/market/childView/PoolsData.vue'),
        meta: { title: 'DeFis-Network' },
      },
      {
        path: '/pools/:mid',
        name: 'poolsMarket',
        component: () => import(/* webpackChunkName: "pools" */ '@/views/market/childView/SymbolData.vue'),
        meta: { title: 'DeFis-Network' },
      },
      {
        path: '/bank',
        name: 'bank',
        component: () => import(/* webpackChunkName: "bank" */ '@/views/bank/Index.vue'),
        meta: { title: 'DeFis-Network' },
      },
      {
        path: '/tutorial',
        name: 'tutorial',
        component: () => import(/* webpackChunkName: "Tutorial" */ '@/views/index/childViews/Tutorial.vue'),
        meta: { title: 'DeFis-Network' },
      }
    ]
  },
  {
    path: '/create-market',
    name: 'createMarket',
    component: () => import(/* webpackChunkName: "createMarket" */ '@/views/index/childViews/CreateMarket.vue'),
    meta: { title: 'DeFis-Network', noTabbar: true },
  },
  // 404
  {
    path: '*',
    name: 'nopage',
    component: () => import(/* webpackChunkName: "nopage" */ '@/views/error-page/404.vue'),
    meta: { title: '404 - stable' },
  },
]

export default new Router({
  base: '/',
  mode: 'history',
  routes: constantRouter,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
});
