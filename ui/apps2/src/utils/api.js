import { EosModel } from '@/utils/eos';
import store from '@/store';
import { getV3Apr } from '@/utils/logic';
import axios from 'axios';
function getHost() {
  const baseConfig = store.state.sys.baseConfig;
  // console.log(baseConfig)
  return baseConfig.node.url;
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
    getVoteRankConf(lists);
    getVoteRankConfV3(lists);
  })
}

// 获取矿池排名配置
export function getVoteRankConf(lists) {
  const params = {
    "code": "miningpool11",
    "scope": "miningpool11",
    "json": true,
    "table": "poolslots",
    limit: 21,
  }
  EosModel.getTableRows(params, (res) => {
    const rows = res.rows || [];
    if (!rows.length) {
      return
    }
    // console.log(rows)
    const rankInfo = [];
    lists.forEach((v, index) => {
      const t = Object.assign({}, v, rows[index])
      rankInfo.push(t)
    })
    // console.log(rankInfo)
    store.dispatch('setRankInfo', rankInfo)
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
    const rankInfo = [];
    lists.forEach((v, index) => {
      const deal = getV3Apr(v.mid, rows[index])
      const t = Object.assign({}, v, rows[index], deal)
      rankInfo.push(t)
    })
    // console.log(rankInfo)
    store.dispatch('setRankInfoV3', rankInfo)
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