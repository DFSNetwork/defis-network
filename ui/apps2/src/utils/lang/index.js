import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from '@/store';
import elEnLocale from 'element-ui/lib/locale/lang/en';
import elZhLocale from 'element-ui/lib/locale/lang/zh-CN';
import enLocale from './en';
import zhLocale from './zh-CN';

// apps Language
import fundation from './appsLang/fundation'
import nodePools from './appsLang/nodePools'
import financial from './appsLang/financial'
import bpInfo from './appsLang/bpInfo'
import sys from './appsLang/sys'
import sysParams from './appsLang/sysParams'
import pddex from './appsLang/pddex'
import home from './appsLang/home'
import invite from './appsLang/invite'
import dfsMine from './appsLang/dfsMine'
import my from './appsLang/my'

Vue.use(VueI18n);

const messages = {
  'zh-CN': { // 中文简体包
    ...zhLocale,
    ...elZhLocale,
    ...fundation['zh-CN'],
    ...nodePools['zh-CN'],
    ...financial['zh-CN'],
    ...bpInfo['zh-CN'],
    ...sysParams['zh-CN'],
    ...pddex['zh-CN'],
    ...home['zh-CN'],
    ...invite['zh-CN'],
    ...dfsMine['zh-CN'],
    ...my['zh-CN'],
    ...sys['zh-CN']
  },
  en: { // 英文包
    ...enLocale,
    ...elEnLocale,
    ...fundation['en'],
    ...nodePools['en'],
    ...bpInfo['en'],
    ...financial['en'],
    ...sysParams['en'],
    ...pddex['en'],
    ...home['en'],
    ...invite['en'],
    ...dfsMine['en'],
    ...my['en'],
    ...sys['en']
  },
};
const i18n = new VueI18n({
  locale: store.state.app.language, // set locale
  messages // locale messages
});

export default i18n;
