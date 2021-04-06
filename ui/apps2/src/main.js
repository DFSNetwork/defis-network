import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import i18n from '@/utils/lang';
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/filters/index'
import './router/action';
import "amfe-flexible";
import VueClipboard from 'vue-clipboard2';
import VueWorker from 'vue-worker';
import './vant'

import api from './api'

// 复制文本插件
Vue.use(VueClipboard)
Vue.use(VueWorker)

Vue.prototype.$api = api
Vue.prototype.$errorImg = 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"';
Vue.prototype.$defaultAccImg = 'this.src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/defaultAcc.png"';
Vue.config.productionTip = false
// 国际化 - 语言
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
