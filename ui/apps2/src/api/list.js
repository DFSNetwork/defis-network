
import axios from 'axios';
import store from '@/store';
function getHost() {
  const baseConfig = store.state.sys.baseConfig;
  return baseConfig.node.url;
}
export function get_table_rows(params) {
  return new Promise((resolve, reject) => {
    const host = getHost()
    axios.post(`${host}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

export function get_swap_summary() {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/basic/swap/summary').then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}


// 获取账户关注列表
export function get_acc_follow() {
  return new Promise((resolve, reject) => {
    const host = getHost()
    const name = store.state.app.scatter.identity.accounts[0].name;
    const params = {
      "code":"dfsusersinfo",
      "scope": ` ${name}`,
      "table":"likes",
      "json":true,
      "limit":1000
    }
    axios.post(`${host}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
      let result = Object.assign(res.data, {});
      const rows = result.rows || []
      store.dispatch('setAccFollow', rows);
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}