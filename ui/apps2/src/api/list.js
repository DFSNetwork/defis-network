
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
