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
        component: () => import(/* webpackChunkName: "index" */ '@/views/index/Index.vue'),
        meta: { title: 'DeFis-Network' },
      },
      {
        path: '/swap/history/:mid',
        name: 'history',
        component: () => import(/* webpackChunkName: "history" */ '@/views/swappage/comp/TradeHistory.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noFooter: true },
      },
      {
        path: '/market/:mid',
        name: 'market',
        component: () => import(/* webpackChunkName: "market" */ '@/views/index/Index.vue'),
        meta: { title: 'DeFis-Network' },
      },
      {
        path: '/market-list',
        name: 'myMarketList',
        component: () => import(/* webpackChunkName: "myMarketList" */ '@/views/market/comp/MarketLists.vue'),
        meta: { title: 'DeFis-Network', noAcc: true },
      },
      {
        path: '/market-record/:mid',
        name: 'MarketHis',
        component: () => import(/* webpackChunkName: "MarketHis" */ '@/views/market/comp/MarketHis.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noFooter: true },
      },
      {
        path: 'withdraw/:mid',
        name: 'withdraw',
        component: () => import(/* webpackChunkName: "withdraw" */ '@/views/market/comp/Withdraw.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noTab: true },
      },
      {
        path: '/pools',
        name: 'pools',
        component: () => import(/* webpackChunkName: "pools" */ '@/views/market/childView/PoolsData.vue'),
        meta: { title: 'DeFis-Network', noAcc: true },
      },
      {
        path: '/pools/:mid',
        name: 'poolsMarket',
        component: () => import(/* webpackChunkName: "poolsMarket" */ '@/views/market/childView/SymbolData.vue'),
        meta: { title: 'DeFis-Network', noAcc: true },
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
        meta: { title: 'DeFis-Network', noAcc: true},
      },
      {
        path: '/dss',
        name: 'dss',
        component: () => import(/* webpackChunkName: "dsr" */ '@/views/dsr/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true },
      },
      {
        path: '/vote',
        name: 'vote',
        component: () => import(/* webpackChunkName: "vote" */ '@/views/vote/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noFooter: true, noTab: true },
      },
      {
        path: '/vote/:mid',
        name: 'voteDetail',
        component: () => import(/* webpackChunkName: "voteDetail" */ '@/views/vote/comp/Detail.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noFooter: true },
      },
      {
        path: '/total',
        name: 'total',
        component: () => import(/* webpackChunkName: "total" */ '@/views/total/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true },
      },
      {
        path: '/create-market',
        name: 'createMarket',
        component: () => import(/* webpackChunkName: "createMarket" */ '@/views/index/childViews/CreateMarket.vue'),
        meta: { title: 'DeFis-Network', noNav: true, noHeader: true, noFooter: true },
      },
      {
        path: '/farms',
        name: 'farms',
        component: () => import(/* webpackChunkName: "farms" */ '@/views/farms/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true },
      },
      {
        path: '/coin-views/:mid',
        name: 'coinViews',
        component: () => import(/* webpackChunkName: "largeTrade" */ '@/views/coinViews/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true},
      },
      { // 节点投票
        path: '/node-vote',
        name: 'nodeVote',
        component: () => import(/* webpackChunkName: "nodeVote" */ '@/views/nodeVote/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noTab: true },
      },
      { // 节点DFS投票详情
        path: '/node-detail/:owner',
        name: 'nodeDetail',
        component: () => import(/* webpackChunkName: "nodeDetail" */ '@/views/nodeVote/comp/NodeDetail.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noTab: true },
      },
      { // 乐捐系统
        path: '/fundation',
        name: 'fundation',
        component: () => import(/* webpackChunkName: "fundation" */ '@/views/fundation/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noTab: true },
      },
      { // 节点挖矿
        path: '/node-pools',
        name: 'nodePools',
        component: () => import(/* webpackChunkName: "nodePools" */ '@/views/nodePools/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noTab: true },
      },
      { // 节点挖矿详情
        path: '/pool-detail/:type/:sym',
        name: 'poolDetail',
        component: () => import(/* webpackChunkName: "poolDetail" */ '@/views/nodePools/childView/DetailLists.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noTab: true },
      },
      { // 我的页面
        path: '/my-center',
        name: 'myCenter',
        component: () => import(/* webpackChunkName: "myCenter" */ '@/views/my/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true },
      },
      { // 编辑资料
        path: '/my-center/set-edit',
        name: 'setInfo',
        component: () => import(/* webpackChunkName: "myCenter" */ '@/views/my/childView/SetInfo.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
    ]
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
