import { EosModel } from '@/utils/eos';
import store from '@/store';

// 获取投票矿池排名
export function getVotePools() {
  const params = {
    "code":"dfspoolsvote",
    "scope":"dfspoolsvote",
    "table":"pools",
    "json":true,
    "index_position": 2,
    "key_type": "float64",
    "limit": 20
  }
  EosModel.getTableRows(params, (res) => {
    const rows = res.rows || [];
    if (!rows.length) {
      return
    }
    const lists = rows.slice(0, 20);
    getVoteRankConf(lists);
  })
}

// 获取矿池排名配置
export function getVoteRankConf(lists) {
  const params = {
    "code": "miningpool11",
    "scope": "miningpool11",
    "json": true,
    "table": "poolslots",
    limit: 20,
  }
  EosModel.getTableRows(params, (res) => {
    const rows = res.rows || [];
    if (!rows.length) {
      return
    }
    const rankInfo = [];
    rows.forEach((v, index) => {
      const t = Object.assign({}, v, lists[index])
      rankInfo.push(t)
    })
    store.dispatch('setRankInfo', rankInfo)
  })
}

// 获取交易挖矿投票前21名
export function getVoteTradeRank(cb) {
  const params = {
    "code": "dfspoolsvote",
    "scope": "dfspoolsvote",
    "json": true,
    "table": "pools",
    limit: 21,
    "index_position": 2,
    "key_type": "float64",
  }
  EosModel.getTableRows(params, (res) => {
    const rows = res.rows || [];
    if (!rows.length) {
      return
    }
    store.dispatch('setRankTrade', rows)
    cb ? cb(rows) : null
  })
}