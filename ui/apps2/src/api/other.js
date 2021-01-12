
import axios from 'axios';

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

export function dfsdata() {
  return new Promise((resolve, reject) => {
    axios.post('https://dfsinfoapi.sgxiang.com/dapi/dfsdata').then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

export function orderLists(params) {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/dfs/pddex/tradelog', {params}).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

export function transferLog(params) {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/dfs/history/transfer', {params}).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

// 获取支持Box的交易对 & 当前委托数据
export function boxMidsAndOrder() {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/pddex/info').then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

// 获取节点tag标签
export function getBpTags() {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/bp/recommends').then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}

// 获取PDDEX行情列表
export function getPddexMarkets() {
  return new Promise((resolve, reject) => {
    axios.get('https://api.defis.network/market/tops').then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}