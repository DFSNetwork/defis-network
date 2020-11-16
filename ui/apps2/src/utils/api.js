import { EosModel } from '@/utils/eos';
import store from '@/store';
import { getV3Apr } from '@/utils/logic';
import axios from 'axios';
function getHost() {
  const baseConfig = store.state.sys.baseConfig;
  // console.log(baseConfig)
  return baseConfig.node.url;
}

export function getJson() {
  return new Promise((resolve, reject) => {
    axios.get('https://cdn.jsdelivr.net/gh/defis-net/material/coin/coinJson.json').then((res) => {
      // let result = Object.assign(res.data, {});
      let result = res.data;
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

// 获取投票矿池排名
export function getVotePools() {
  const params = {
    "code":"dfspoolsvote",
    "scope":"dfspoolsvote",
    "table":"pools",
    "json":true,
    "index_position": 2,
    "key_type": "float64",
    "limit": 21
  }
  EosModel.getTableRows(params, (res) => {
    const rows = res.rows || [];
    if (!rows.length) {
      return
    }
    store.dispatch('setRankTrade', rows)
    // console.log(rows)
    const lists = rows.slice(0, 21);
    getVoteRankConfV3(lists);
  })
}

// 获取矿池排名配置
export function getVoteRankConfV3(lists) {
  const params = {
    "code": "miningpool11",
    "scope": "miningpool11",
    "json": true,
    "table": "poolslots2",
    limit: 21,
  }
  EosModel.getTableRows(params, (res) => {
    const rows = res.rows || [];
    if (!rows.length) {
      return
    }
    // console.log(rows)
    const rankInfoV3 = [];
    lists.forEach((v, index) => {
      const deal = getV3Apr(v.mid, rows[index])
      const t = Object.assign({}, v, rows[index], deal)
      rankInfoV3.push(t)
    })
    // console.log(rankInfoV3)
    store.dispatch('setRankInfoV3', rankInfoV3)
  })
}

// 链上查表
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

// 链上查表
export function get_balance(params) {
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

// 获取代理
export function get_producers() {
  return new Promise((resolve, reject) => {
    axios.get('https://www.api.bloks.io/producers?pageNum=1&perPage=500').then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

// 获取乐捐数据
export function get_fundation(params) {
  // https://api.defis.network/history/fundation?page=1&limit=15
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/history/fundation', {params}).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}
// 获取乐捐总价值
export function get_summary() {
  // https://api.defis.network/history/fundation?page=1&limit=15
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/history/fundation/summary').then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}