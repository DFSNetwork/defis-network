import Vue from 'vue'
import moment from 'moment';
import numeral from 'numeral';
import { toFixed, accSub, accMul } from "@/utils/public"
import store from '@/store'

// 位数分割 128,373,883
Vue.filter('numeralFormat', (value, p) => {
  let xstr = '0';
  if (p) {
    xstr = '0.';
    for (var i = 0; i < p; i++) { // eslint-disable-line
      xstr += '0';  // eslint-disable-line
    }
  }
  return numeral(value).format(`0,${xstr}`);
});

// unix 时间戳、 utc Data类型
Vue.filter('dateFormat', value => moment.utc(value).format('YYYY-MM-DD'));
Vue.filter('dateFormatYMDF', value => moment(value).format('YYYY-MM-DD HH:mm'));
Vue.filter('dateFormatAll', value => moment(value).format('YYYY-MM-DD HH:mm:ss'));
Vue.filter('dateFormatMonth', value => moment.utc(value).format('MM-DD'));

Vue.filter('dateFormatBIH', value => moment(value).format('YYYY-MM-DD HH:mm:ss'));
Vue.filter('dateFormatBIHM', value => moment(value).format('YYYY-MM-DD HH:mm'));
Vue.filter('dateFormatTimeBIH', value => moment(value).format('HH:mm:ss'));
Vue.filter('dateFormatMonthHour', value => moment(value).format('MM-DD HH:mm:ss'));
Vue.filter('dateFormatT', (value) => {
  const zone = moment().zone() / 60; // 时区
  return moment(value).add(0 - zone, 'hours').format('MM-DD HH:mm:ss');
});
Vue.filter('dateFormatTYear', (value) => {
  const zone = moment().zone() / 60; // 时区
  return moment(value).add(0 - zone, 'hours').format('YYYY-MM-DD HH:mm:ss');
});

// 截取小数四位数
Vue.filter('numberTofixed', value => toFixed(value, 4));

// 英文下显示折扣按照百分比
Vue.filter('englishPercent', value => {
  if (store.state.app.language === 'en' || store.state.app.language === 'ko') {
    const data = accSub(10, Number(value));
    return `${accMul(data, 10)}%`
  }
  return value
})
