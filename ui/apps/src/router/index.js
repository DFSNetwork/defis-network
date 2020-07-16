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
    meta: { title: 'stable' },
    children: [
      {
        path: '/bank',
        name: 'bank',
        // component: () => import('@/views/index/Index'),
        component: () => import(/* webpackChunkName: "nopage" */ '@/views/index/Index.vue'),
        meta: { title: 'bank' },
      },
      {
        path: '/',
        name: 'dex',
        component: () => import(/* webpackChunkName: "nopage" */ '@/views/dex/Index.vue'),
        meta: { title: 'dex' },
      },
      {
        path: '/pools',
        name: 'pools',
        component: () => import(/* webpackChunkName: "nopage" */ '@/views/pools/Index.vue'),
        meta: { title: 'pools' },
      },
      {
        path: '/hyk',
        name: 'hyk',
        component: () => import(/* webpackChunkName: "nopage" */ '@/views/hyk/Index.vue'),
        meta: { title: 'hyk' },
      },
      {
        path: '/tutorial',
        name: 'tutorial',
        component: () => import(/* webpackChunkName: "nopage" */ '@/views/index/childViews/Tutorial.vue'),
        meta: { title: 'bank' },
      },
    ]
  },
  {
    path: '/dex/create-market',
    name: 'createMarket',
    // component: () => import('@/views/index/Index'),
    component: () => import(/* webpackChunkName: "nopage" */ '@/views/dex/childViews/CreateMarket.vue'),
    meta: { title: 'bank', noTabbar: true },
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
