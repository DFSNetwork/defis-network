import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from '@/store';
import elEnLocale from 'element-ui/lib/locale/lang/en';
import elZhLocale from 'element-ui/lib/locale/lang/zh-CN';
import enLocale from './en';
import zhLocale from './zh-CN';

Vue.use(VueI18n);

const messages = {
  'zh-CN': { // 中文简体包
    ...zhLocale,
    ...elZhLocale
  },
  en: { // 英文包
    ...enLocale,
    ...elEnLocale
  },
};
const i18n = new VueI18n({
  locale: store.state.app.language, // set locale
  messages // locale messages
});

export default i18n;
