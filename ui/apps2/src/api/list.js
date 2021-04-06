
import axios from 'axios';
import store from '@/store';
const zlib = require('zlib');
function getHost() {
  const baseConfig = store.state.sys.baseConfig;
  return baseConfig.node.url;
}
export function unZip(deflated) {
  const inflated = zlib.inflateSync(new Buffer(deflated, 'base64')).toString();
  return inflated
}
export function dealZip(data) {
  var input = JSON.stringify(data);
  const deflated = zlib.deflateSync(input).toString('base64');
  return deflated
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
// 获取24H数据 - 多数据
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
// 获取24H数据 - 基础数据
export function get_swap_counter() {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/basic/swap/counter').then((res) => {
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

// 获取全部订单列表
export function get_all_orders() {
  return new Promise((resolve, reject) => {
    // const name = store.state.app.scatter.identity.accounts[0].name;
    const params = {
      // "code":"dfsusersinfo",
      // "scope": ` ${name}`,
      // "table":"likes",
      // "json":true,
      // "limit":1000
    }
    axios.get('https://api.defis.network/pddex2/orders', JSON.stringify(params)).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}
// 节点延时接口
export function get_info(host) {
  return new Promise((resolve, reject) => {
    axios.get(`${host}/v1/chain/get_info`, {
      timeout: 10000,
    }).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}
// 获取markets压缩数据
export function get_markets() {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/common/markets').then((res) => {
      var deflated = res.data;
      var inflated = unZip(deflated)
      const result = {
        rows: JSON.parse(inflated)
      }
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

// 获取常用币种价格
export function get_price() {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/common/get_price').then((res) => {
      const result = res.data;
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

// 查询当前发行量
export function get_currency_stats(params) {
  return new Promise((resolve, reject) => {
    const host = getHost()
    axios.post(`${host}/v1/chain/get_currency_stats`, JSON.stringify(params)).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}
// 链上查表
export function get_currency_balance(params) {
  return new Promise((resolve, reject) => {
    const host = getHost()
    axios.post(`${host}/v1/chain/get_currency_balance`, JSON.stringify(params)).then((res) => {
      // let result = Object.assign(res.data, {});
      let result = res.data;
      if (!result.length) {
        result = [`${Number(0).toFixed(params.decimal || 4)} ${params.symbol}`]
      }
      resolve({ status: res.status === 200, result: result[0] });
    }, err => {
      reject(err)
    })
  })
}
