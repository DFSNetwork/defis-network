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
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/home/Index.vue'),
        meta: { title: 'DeFis-Network' },
      },
      {
        path: '/swap',
        name: 'index',
        component: () => import(/* webpackChunkName: "home" */ '@/views/index/Index.vue'),
        meta: { title: 'DeFis-Network' },
      },
      {
        path: '/swap/history/:mid',
        name: 'history',
        component: () => import(/* webpackChunkName: "home" */ '@/views/swappage/comp/TradeHistory.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noFooter: true },
      },
      {
        path: '/market/:mid',
        name: 'market',
        component: () => import(/* webpackChunkName: "home" */ '@/views/index/Index.vue'),
        meta: { title: 'DeFis-Network' },
      },
      {
        path: '/market-list',
        name: 'myMarketList',
        component: () => import(/* webpackChunkName: "home" */ '@/views/market/comp/MarketLists.vue'),
        meta: { title: 'DeFis-Network', noAcc: true },
      },
      {
        path: '/market-record/:mid',
        name: 'MarketHis',
        component: () => import(/* webpackChunkName: "home" */ '@/views/market/comp/MarketHis.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noFooter: true },
      },
      {
        path: 'withdraw/:mid',
        name: 'withdraw',
        component: () => import(/* webpackChunkName: "home" */ '@/views/market/comp/Withdraw.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noTab: true },
      },
      {
        path: '/pools',
        name: 'pools',
        component: () => import(/* webpackChunkName: "home" */ '@/views/market/childView/PoolsData.vue'),
        meta: { title: 'DeFis-Network', noAcc: true },
      },
      {
        path: '/pools/:mid',
        name: 'poolsMarket',
        component: () => import(/* webpackChunkName: "home" */ '@/views/market/childView/SymbolData.vue'),
        meta: { title: 'DeFis-Network', noAcc: true },
      },
      {
        path: '/bank',
        name: 'bank',
        component: () => import(/* webpackChunkName: "home" */ '@/views/bank/Index.vue'),
        meta: { title: 'DeFis-Network' },
      },
      {
        path: '/tutorial',
        name: 'tutorial',
        component: () => import(/* webpackChunkName: "home" */ '@/views/index/childViews/Tutorial.vue'),
        meta: { title: 'DeFis-Network', noAcc: true},
      },
      {
        path: '/dss',
        name: 'dss',
        component: () => import(/* webpackChunkName: "home" */ '@/views/dsr/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true },
      },
      {
        path: '/total',
        name: 'total',
        component: () => import(/* webpackChunkName: "home" */ '@/views/total/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true },
      },
      {
        path: '/create-market',
        name: 'createMarket',
        component: () => import(/* webpackChunkName: "home" */ '@/views/index/childViews/CreateMarket.vue'),
        meta: { title: 'DeFis-Network', noNav: true, noHeader: true, noFooter: true },
      },
      {
        path: '/farms',
        name: 'farms',
        component: () => import(/* webpackChunkName: "home" */ '@/views/farms/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true },
      },
      {
        path: '/coin-views/:mid',
        name: 'coinViews',
        component: () => import(/* webpackChunkName: "home" */ '@/views/coinViews/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true},
      },
      { // 乐捐系统
        path: '/fundation',
        name: 'fundation',
        component: () => import(/* webpackChunkName: "home" */ '@/views/fundation/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true },
      },
      { // 节点挖矿
        path: '/node-pools',
        name: 'nodePools',
        component: () => import(/* webpackChunkName: "home" */ '@/views/nodePools/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noTab: true },
      },
      { // 节点挖矿详情
        path: '/pool-detail/:type/:sym',
        name: 'poolDetail',
        component: () => import(/* webpackChunkName: "home" */ '@/views/nodePools/childView/DetailLists.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noTab: true },
      },
      { // 我的页面
        path: '/my-center',
        name: 'myCenter',
        component: () => import(/* webpackChunkName: "home" */ '@/views/my/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true },
      },
      { // 编辑资料
        path: '/my-center/set-edit',
        name: 'setInfo',
        component: () => import(/* webpackChunkName: "home" */ '@/views/my/childView/SetInfo.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
      { // 关注
        path: '/my-center/follow',
        name: 'follow',
        component: () => import(/* webpackChunkName: "home" */ '@/views/my/childView/AccLists.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
      { // 粉丝
        path: '/my-center/fans',
        name: 'fans',
        component: () => import(/* webpackChunkName: "home" */ '@/views/my/childView/AccLists.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
      { // 访客
        path: '/my-center/visitors',
        name: 'visitors',
        component: () => import(/* webpackChunkName: "home" */ '@/views/my/childView/AccLists.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
      { // 他人的个人中心
        path: '/other-acc-info/:id',
        name: 'otherInfo',
        component: () => import(/* webpackChunkName: "home" */ '@/views/otherInfo/Index.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
      { // 他人的粉丝
        path: '/other-acc-info/:id/fans',
        name: 'otherFans',
        component: () => import(/* webpackChunkName: "home" */ '@/views/my/childView/AccLists.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
      { // 他人的关注
        path: '/other-acc-info/:id/follow',
        name: 'otherFollow',
        component: () => import(/* webpackChunkName: "home" */ '@/views/my/childView/AccLists.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
      { // 他人的访客
        path: '/other-acc-info/:id/visitors',
        name: 'otherVisitors',
        component: () => import(/* webpackChunkName: "home" */ '@/views/my/childView/AccLists.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
      { // 创建矿池
        path: '/create-pool',
        name: 'createPool',
        component: () => import(/* webpackChunkName: "home" */ '@/views/nodePools/childView/CreatePool.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
    ]
  },
  {
    path: '/financial',
    component: Layout,
    redirect: '/',
    children: [
      {
        path: '/',
        name: 'financial',
        component: () => import(/* webpackChunkName: "home" */ '@/views/financial/Index'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, },
      },
      {
        path: '/financial/detail',
        name: 'financialDetail',
        component: () => import(/* webpackChunkName: "home" */ '@/views/financial/childViews/Detail'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true,  noTab: true },
      }
    ],
  },
  {
    path: '/bp-info',
    component: Layout,
    redirect: '/',
    children: [
      {
        path: '/',
        name: 'bpInfo',
        component: () => import(/* webpackChunkName: "home" */ '@/views/bpInfo/Index'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
      {
        path: ':bpname',
        name: 'detailInfo',
        component: () => import(/* webpackChunkName: "home" */ '@/views/bpInfo/childViews/DetailInfo'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
      {
        path: 'update-info/:bpname',
        name: 'updateInfo',
        component: () => import(/* webpackChunkName: "home" */ '@/views/bpInfo/childViews/UpdateInfo'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
    ],
  },
  // Pddex
  {
    path: '/pddex',
    component: Layout,
    redirect: '/',
    children: [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "home" */ '@/views/pddex/Index'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true },
        children: [
          {
            path: 'ranks',
            name: 'pddex',
            component: () => import(/* webpackChunkName: "home" */ '@/views/pddex/comp/PddexRanks'),
            meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true },
          },
          // {
          //   path: 'trade/:symbol',
          //   name: 'pddexTrade',
          //   component: () => import(/* webpackChunkName: "pddexTrade" */ '@/views/pddex/trade/Index'),
          //   meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true },
          // },
          {
            path: 'order',
            name: 'pddexOrder',
            component: () => import(/* webpackChunkName: "home" */ '@/views/pddex/order/Index'),
            meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
          },
          {
            path: 'k-line/:symbol',
            name: 'kLine',
            component: () => import(/* webpackChunkName: "home" */ '@/views/kline/Index.vue'),
            meta: { title: 'Order-book', noAcc: true, noFooter: true, noTab: true, noHeader: true, noTab: true },
          },
          {
            path: 'trade/:symbol',
            name: 'pddexTrade',
            component: () => import(/* webpackChunkName: "home" */ '@/views/index/Index.vue'),
            meta: { title: 'DeFis-Network' },
          },
        ]
      },
    ],
  },
  // dss for tag
  {
    path: '/dss-tag',
    component: Layout,
    redirect: '/',
    children: [
      {
        path: '/',
        name: 'dssForTag',
        component: () => import(/* webpackChunkName: "home" */ '@/views/dssForTag/Index'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noTab: true },
      },
    ],
  },
  {
    path: '/invite',
    component: Layout,
    redirect: '/',
    children: [
      {
        path: '/',
        name: 'invite',
        component: () => import(/* webpackChunkName: "home" */ '@/views/invite/Index'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true },
      },
      {
        path: 'farm/:name',
        name: 'farmDetail',
        component: () => import(/* webpackChunkName: "home" */ '@/views/invite/childViews/Detail'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noTab: true },
      },
      {
        path: 'create',
        name: 'farmCreate',
        component: () => import(/* webpackChunkName: "home" */ '@/views/invite/childViews/Create'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
      {
        path: 'edit',
        name: 'farmEdit',
        component: () => import(/* webpackChunkName: "home" */ '@/views/invite/childViews/Edit'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
      {
        path: 'farm/:name/sign-in',
        name: 'signIn',
        component: () => import(/* webpackChunkName: "home" */ '@/views/invite/childViews/SignIn'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
      {
        path: 'set-sign',
        name: 'setSign',
        component: () => import(/* webpackChunkName: "home" */ '@/views/invite/setting/SetCoin'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
      {
        path: 'add-sign-coin',
        name: 'addSignCoin',
        component: () => import(/* webpackChunkName: "home" */ '@/views/invite/setting/AddCoin'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
      {
        path: 'set-sign-coin/:coin',
        name: 'setSignCoin',
        component: () => import(/* webpackChunkName: "home" */ '@/views/invite/setting/AddCoin'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true, noTab: true },
      },
    ],
  },
  // voteHome
  {
    path: '/votes',
    component: Layout,
    redirect: '/',
    children: [
      {
        path: '/',
        component: () => import(/* webpackChunkName: "home" */ '@/views/voteHome/Index'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noHeader: true },
        children: [
          {
            path: '/vote',
            name: 'vote',
            component: () => import(/* webpackChunkName: "home" */ '@/views/voteHome/vote/Index.vue'),
            meta: { title: 'DeFis-Network', noAcc: true, noFooter: true, noTab: true, noHeader: true },
          },
          { // 节点投票
            path: '/node-vote',
            name: 'nodeVote',
            component: () => import(/* webpackChunkName: "home" */ '@/views/voteHome/nodeVote/Index.vue'),
            meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noTab: true, noHeader: true },
          },
          {
            path: '/vote-tag',
            name: 'voteForTag',
            component: () => import(/* webpackChunkName: "home" */ '@/views/voteHome/voteForTag/Index'),
            meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noTab: true, noHeader: true },
          },
          {
            path: '/vote-params',
            name: 'sysParams',
            component: () => import(/* webpackChunkName: "home" */ '@/views/voteHome/sysParams/Index'),
            meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noTab: true, noHeader: true },
          },
        ]
      },
      {
        path: '/vote/:mid',
        name: 'voteDetail',
        component: () => import(/* webpackChunkName: "home" */ '@/views/voteHome/vote/comp/Detail.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noFooter: true },
      },
      { // 节点DFS投票详情
        path: '/node-detail/:owner',
        name: 'nodeDetail',
        component: () => import(/* webpackChunkName: "home" */ '@/views/voteHome/nodeVote/comp/NodeDetail.vue'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noTab: true },
      },
      {
        path: 'vote-tag/detail-tag/:mid',
        name: 'tagVoteDetail',
        component: () => import(/* webpackChunkName: "home" */ '@/views/voteHome/voteForTag/comp/Detail'),
        meta: { title: 'DeFis-Network',  noAcc: true, noFooter: true },
      },
    ],
  },
  // 新版本 DFS 挖矿
  {
    path: '/dfs-mine',
    component: Layout,
    redirect: '/',
    children: [
      {
        path: '/',
        name: 'dfsMine',
        component: () => import(/* webpackChunkName: "home" */ '@/views/dfsMine/Index'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noTab: true },
      },
      {
        path: ':mid',
        name: 'dfsMinePool',
        component: () => import(/* webpackChunkName: "home" */ '@/views/dfsMine/childView/PoolMarket'),
        meta: { title: 'DeFis-Network', noAcc: true, noNav: true, noFooter: true, noTab: true },
      },
    ],
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
