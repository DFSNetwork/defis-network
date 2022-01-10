import { EosModel } from '@/utils/eos';
import store from '@/store';
import { getV3Apr } from '@/utils/logic';
import axios from 'axios';
import moment from 'moment';
function getHost() {
  const baseConfig = store.state.sys.baseConfig;
  return baseConfig.node.url;
}

export function getJson() {
  return new Promise((resolve, reject) => {
    axios.get('https://www.defis.network/coin/coinJson.json').then((res) => {
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
    "limit": 100
  }
  EosModel.getTableRows(params, (res) => {
    const rows = res.rows || [];
    if (!rows.length) {
      return
    }
    store.dispatch('setRankTrade', rows)
    // console.log('setRankTrade', rows)
    const lists = rows.slice(0, 30);
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
    limit: 30,
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
    // console.log('rankInfoV3', rankInfoV3)
    store.dispatch('setRankInfoV3', rankInfoV3)
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
    axios.get('https://api.defis.network/fundation/summary').then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}
// 获取最新 ｜ 最贵 ｜ 最热 留言数据
export function get_new_fundation(params) {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/fundation/new', {params}).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}
export function get_mvd_fundation(params) {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/fundation/mvd', {params}).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}
export function get_hot_fundation(params) {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/fundation/hot', {params}).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

export function get_reply_fundation(params) {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/fundation/reply', {params}).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}
// 获取乐捐记录
export async function get_acc_fund_lists(params) {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/fundation/i', {params}).then((res) => {
      let result = Object.assign(res.data, {});
      // console.log(result)
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

// 获取rex挖矿列表
export async function get_farmers_lists() {
  return new Promise((resolve, reject) => {
    // const params = {};
    axios.get('https://api.defis.network/dfs/tag/farmers').then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

// 获取账户信息
export function get_acc_info(user) {
  return new Promise((resolve, reject) => {
    const scatter = store.state.app.scatter;
    const params = {
      "code":"dfscommunity",
      "scope":"dfscommunity",
      "table":"profiles",
      "json":true,
      "lower_bound": ` ${user}`,
      "upper_bound": ` ${user}`,
    }
    const host = getHost()
    axios.post(`${host}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
      let result = {};
      if (!res.data.rows.length) {
        result = {}
      } else {
        result = Object.assign(res.data.rows[0], {});
        if (scatter && scatter.identity && scatter.identity.accounts[0].name === user) {
          store.dispatch('setAccInfo', result);
        }
      }
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}
// 获取账户访客
// 获取账户关注列表
// ## 关注列表
// cleos -u https://eos.blockeden.cn get table 
// dfscommunity dfsdeveloper followers
export function get_acc_lists(user, type, nextKey) {
  return new Promise((resolve, reject) => {
    const params = {
      "code": "dfscommunity",
      "scope": ` ${user}`,
      "table": type,
      "json": true,
      "limit": 100,
    }
    if (nextKey) {
      params.lower_bound = nextKey;
    }
    const host = getHost()
    axios.post(`${host}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
      let result = Object.assign(res.data, {});
      // console.log(result)
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}
// 获取用户关注数量
export function get_acc_flow_info(user) {
  return new Promise((resolve, reject) => {
    const params = {
      "code": "dfscommunity",
      "scope": "dfscommunity",
      "table": "relations",
      "json": true,
      "lower_bound": ` ${user}`,
      "upper_bound": ` ${user}`
    }
    const host = getHost()
    axios.post(`${host}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
      let result = {};
      if (!res.data.rows.length) {
        result = {}
      } else {
        result = Object.assign(res.data.rows[0], {});
      }
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

// 获取访客记录
export function get_acc_visit(user) {
  return new Promise((resolve, reject) => {
    const params = {
      user,
    }
    axios.get('https://api.defis.network/social/summary', {params}).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}
// 用户访问他人主页
export function acc_visit_other(visitor, user) {
  return new Promise((resolve, reject) => {
    const params = {
      user,
      visitor,
    }
    axios.get('https://api.defis.network/social/visit', {params}).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

// 获取K线数据
export function get_kline_data(params) {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/kline/data', {params}).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}
// 获取K线数据
export function get_kline_data2(params) {
  return new Promise((resolve, reject) => {
    axios.get('https://dfs.defiview.io/api/getBars', {params}).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

// 获取今日最新最热最贵3条置顶数据
export function get_top3_fundation(params) {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/fundation/top3', {params}).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

// 获取公告
export function get_voices() {
  return new Promise((resolve, reject) => {
    // https://api.defis.network/static/swap/voices
    axios.get('https://api.defis.network/static/swap/voices').then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

// 获取bp评价列表
export function get_bp_scores(params) {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/fundation/bp', {params}).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

// 获取节点信息
export function get_bp_info(params) {
  return new Promise((resolve, reject) => {
    const nT = moment().valueOf()
    if (!params && store.state.sys.nodeLists && nT - store.state.sys.nodeListsTamp < 600000) {
      const result = {
        voters: store.state.sys.nodeLists
      };
      resolve({ 
        status: true,
        result
      });
      return
    }
    axios.get('https://api.defis.network/bp/bps', {params}).then((res) => {
      let result = Object.assign(res.data, {});
      store.dispatch('setNodeListsTamp', moment().valueOf())
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

// setTimeout(() => {
//   // get_acc_lists('dfsdeveloper', 'followers')
//   // get_acc_lists('djsja24djdjs', 'fans')
//   // get_acc_flow_info('djsja24djdjs')
//   acc_visit_other('iq3rwbsfcqlv', 'djsja24djdjs')
//   get_acc_visit('iq3rwbsfcqlv')
// }, 2000);