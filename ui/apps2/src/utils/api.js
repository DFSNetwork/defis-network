import { EosModel } from '@/utils/eos';
import store from '@/store';
import { getV3Apr } from '@/utils/logic';

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
export function getVoteRankConfV3() {
  const params = {
    "code": "eosio",
    "scope": "eosio",
    "json": true,
    "table": "producers",
    limit: 100,
  }
  EosModel.getTableRows(params, (res) => {
    const rows = res.rows || [];
    if (!rows.length) {
      return
    }
    console.log(rows)
    // console.log(rankInfo)
    store.dispatch('setRankInfoV3', rankInfo)
  })
}