import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import i18n from '@/utils/lang';
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/filters/index'
import "amfe-flexible";
import VueClipboard from 'vue-clipboard2';

// 复制文本插件
Vue.use(VueClipboard)

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
