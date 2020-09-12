import Vue from 'vue'
import moment from 'moment';
import numeral from 'numeral';
import { toFixed } from "@/utils/public"

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

// 截取 ’1.0000000 DMD‘ 这类数据为4位小数
Vue.filter('numToShot', value => {
  const arr = value.toString().split(' ');
  if (!arr.length) {
    return 0
  }
  const numArr = arr[0].split('.');
  let num = arr[0];
  if (numArr.length > 1 && numArr[1].length > 4) {
    num = toFixed(arr[0], 4)
  }
  if (arr.length > 1) {
    return `${num} ${arr[1]}`;
  }
  return num;
})