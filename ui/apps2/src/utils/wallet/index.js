// scatter 链接钱包
import ScatterJS from 'scatterjs-core';
// import ScatterEOS from 'scatterjs-plugin-eosjs2';
import ScatterEOS from 'scatterjs-plugin-eosjs';
// import Eos from 'eosjs';

import axios from 'axios';
import store from '@/store';

ScatterJS.plugins( new ScatterEOS() );
import { EosModel } from '@/utils/eos';

class ScatterClass {
  constructor() {
    this.vthis = null;
    this.scatter = null;
    this.scatterEosJs = null;
    this.eosJs = null;
    this.connectCount = 0; // 重连次数
    this.isConnect = false;
  }
  // scatter 初始化
  scatterInit(vthis, callback) {
    this.vthis = vthis;
    const self = this;
    if (self.isConnect) {
      callback();
      return
    }
    self.isConnect = !!EosModel.scatter && !!EosModel.scatterEosJs;
    // console.log(self.isConnect)
    if (!self.isConnect) {
      // console.log(self.connectCount)
      self.connectCount += 1;
      if (self.connectCount > 10) {
        return false;
      }
      setTimeout(() => {
        self.scatterInit(self.vthis, callback);
      }, 500);
      return false;
    }
    self.scatter = EosModel.scatter;
    self.eosJs = EosModel.scatterEosJs;
    // console.log(self.isConnect)
    // console.log(self.scatter)
    // console.log(self.eosJs)
    callback();
    // const networkOpt = {
    //   blockchain: 'eos',
    //   protocol: 'https',
    //   host: 'eos.blockeden.cn',
    //   port: 443,
    //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    // }
    // const network = ScatterJS.Network.fromJson(networkOpt);
    // ScatterJS.connect('DeFis-Network',{network}).then(async connected => {
    //   self.isConnect = connected;
    //   // console.log(connected)
    //   if (!connected) {
    //     self.connectCount += 1;
    //     if (self.connectCount > 10) {
    //       return false;
    //     }
    //     setTimeout(() => {
    //       self.scatterInit(self.vthis, callback);
    //     }, 500);
    //     return false;
    //   }
    //   self.scatter = ScatterJS.scatter;
    //   // console.log(self.scatter)
    //   self.eosJs = ScatterJS.eos(network, Eos, {});
    //   callback();
    // });
  }
  loginOut() {
    const self = this;
    self.scatter.forgetIdentity()
    location.reload()
  }
  // login
  login(callback) {
    const self = this;
    if (!self.isConnect) {
      self.scatterInit(self.vthis, () => {
        self.login();
      })
      return;
    }
    self.scatter.login().then(id => {
      if(!id) return console.error('no identity');
      const account = ScatterJS.account('eos');
      const newAccount = {
        name: account.name,
        permissions: account.authority,
        publicKey: account.publicKey,
      }
      callback(newAccount)
    });
  }
  /* -------- 获取余额 start -------- */
  getCurrencyBalance(params, callback) {
    const newParams = {
      code: params.code || 'eosio.token',
      symbol: params.coin || 'EOS',
      account: params.account || store.state.app.account.name,
    }
    const https = store.state.sys.baseConfig.node.url;
    // console.log(https)
    axios.post(`${https}/v1/chain/get_currency_balance`, JSON.stringify(newParams)).then((res) => {
      if (!res.data.length) {
        callback(`${Number(0).toFixed(params.decimal)} ${params.symbol}`);
        return;
      }
      const returnData = res.data[0];
      callback(returnData);
    }).catch((e) => {
      console.log(`e: ${e}`); // eslint-disable-line
    })
  }
  /* -------- 获取余额 end -------- */

  transfer(obj, callback) {
    console.log(obj)
    const formName = store.state.app.account.name;
    const permission = store.state.app.account.permissions;
    const params = {
      actions: [
        {
          account: obj.code,
          name: 'transfer',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            from: formName,
            to: obj.toAccount,
            quantity: obj.quantity,
            memo: obj.memo || 'test'
          }
        }
      ]
    }
    this.eosJs.transaction(params, {
      blocksBehind: 3,
      expireSeconds: 30,
    }).then((res) => {
      callback(null, res)
    }).catch((e) => {
      this.dealError(e, callback);
    });
  }

  // transaction 操作
  toTransaction(obj, callback) {
    const params = obj;
    const self = this;
    if (!self.isConnect) {
      self.toTransaction(obj, callback)
      return
    }
    self.eosJs.transaction(params, {
      blocksBehind: 3,
      expireSeconds: 30,
    }).then((res) => {
      callback(null, res);
    }).catch((e) => {
      self.dealError(e, callback);
    });
  }

  dealError(e, callback) {
    console.log(e)
    //  catch 错误回调 ---- code: 3080004 - cpu不足 | 3080002 - net不足 | 3080001 - ram不足
    let back = {
      code: 999,
      message: 'fails!',
    };
    try {
      if (typeof (e) === 'object') {
        if (e.code === 402) {
          back = {
            code: '402',
            message: 'User rejected the signature request',
          }
        }
      }
      if (typeof (e) === 'string') {
        const err = JSON.parse(e);
        // CPU 不足
        if (err.error.code === 3080004) {
          back = {
            code: 3080004,
            message: 'Insufficient CPU resources',
          }
        }
        // NET 不足
        if (err.error.code === 3080002) {
          back = {
            code: 3080002,
            message: 'Insufficient Net resources',
          }
        }
        // RAM 不足
        if (err.error.code === 3080001) {
          back = {
            code: 3080001,
            message: 'Insufficient RAM resources',
          }
        }
        if (err.error.code === 3050003 || err.error.code === 3010010) {
          // 滑点过高导致
          const detail = err.error.details;
          if (detail[0].message.indexOf('INSUFFICIENT_OUTPUT_AMOUNT') !== -1) {
            back = {
              code: 3050003,
              // message: this.vthis.$t('dex.heightSlip'),
              message: '滑点过高',
            }
          } else if (detail[0].message.indexOf('Invalid packed transaction') !== -1) { // 用户取消操作
            back = {
              code: 402,
              // message: this.vthis.$t('error.cancel'),
              message: '用户取消',
            }
          } else {
            back = {
              code: err.error.code,
              message: detail[0].message,
            }
          }
        }
      }
      callback(back, null);
    } catch (error) {
      if (e === '操作已取消') {
        back = {
          code: 402,
          message: 'Cancel',
        }
      }
      callback(back, null);
    }
  }
}
export const DApp = new ScatterClass();