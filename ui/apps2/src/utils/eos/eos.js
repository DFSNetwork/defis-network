/* eslint-disable */
import axios from 'axios';
import Eos from 'eosjs-without-sort'; // 代签不排序
import store from '@/store';
import scatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';

scatterJS.plugins( new ScatterEOS() );

/*
* 安装 Scatter 与否
* get scatter
*/
let scatterConnected = false;
let scatappOnline = false;
// scatter 最大重连次数
const maxFrequency = 20;
let nowFrequency = 0;
let mobileWalletFrequency = 0;

class model {
  constructor() {
    this.vthis = null;
    this.scatter = null; // 登录、退出对象
    this.scatterEosJs = null; // 登录后的各种操作对象
    this.accountByScatter = null;
    this.chainName = 'eos';
    this.env = process.env.NODE_ENV;
    this.scatapp = null;
    // 配置
    this.EosJs = null;
    this.EosJsUse = null;
    this.network = null;
    this.eosOptions = null;
    this.toAccountJin = store.state.sys.baseConfig.toAccountJin;
    this.toAccountSwap = store.state.sys.baseConfig.toAccountSwap;
    this.actor = this.env === 'production' ? '111.3' : '11111111aaaa'; // 1111
  }
  getToAccount() { // 使用前重新获取最新账户
    this.toAccountJin = store.state.sys.baseConfig.toAccountJin;
    this.toAccountSwap = store.state.sys.baseConfig.toAccountSwap;
  }

  vueThisInit(vt, chain) {
    this.vthis = vt;
    this.chainName = chain;
  }

  scatterInit(vthis, callback) {
    const self = this;
    self.vthis = vthis;
    this.scatapp = store.state.app.scatter || {};
    this.chainName = this.scatapp.chain || 'eos';
    if (scatterConnected) { // 初始化完成 - 直接执行回调
      callback();
      return;
    }
    scatterJS.scatter.connect('jin-network.hodls.cn').then(async connected => {
      scatterConnected = connected;
      if (!connected) {
        nowFrequency += 1;
        if (nowFrequency > maxFrequency) {
          // 退出当前账户
          this.storeAccountOut(this.scatapp);
        }
        this.scatapp.online = false;
        store.dispatch('setScatter', this.scatapp);
        sessionStorage.setItem('scatterInstall', 0);
        setTimeout(() => {
          self.scatterInit(self.vthis, callback);
        }, 500);
        return false;
      };
      scatappOnline = true;
      sessionStorage.setItem('scatterInstall', 1);
      self.scatter = scatterJS.scatter;
      window.scatter = null;
      window.ScatterJS = null;
      self.scatapp.online = true;
      // 获取scatter来源
      let scatterFrom = 'Scatter';
      try {
        // const getVersion = await scatterJS.scatter.getVersion();
        // if (getVersion && getVersion.indexOf(' ') >= 0 && getVersion.split(' ')[0]) {
        //   scatterFrom = getVersion.split(' ')[0].toLowerCase(); // leafwallet 叶子钱包
        // }
        self.scatapp.scatterFrom = scatterFrom;
        store.dispatch('setScatter', self.scatapp);
        self.initNext();
        callback();
      } catch (error) {
        self.scatapp.scatterFrom = scatterFrom;
        store.dispatch('setScatter', self.scatapp);
        self.initNext();
        callback();
      }
    });
  }

  initNext() {
    if (this.scatter && !this.scatter.identity) {
      if (this.scatapp.wallet === 'Scatter') {
        const scatterItem = this.scatapp;
        scatterItem.identity = null;
        scatterItem.wallet = '';
        scatterItem.chain = 'eos';
        store.dispatch('setScatter', scatterItem);
        this.accountByScatter = null;
      }
      return;
    }
    if (this.scatapp && this.scatapp.identity) {
      this.accountByScatter = store.state.app.scatter.identity.accounts[0];
    }
  }

  // 节点配置 / 节点切换
  async chainNodeInit(chainVal) {
    let chain = chainVal || 'eos';
    chain = chain.toLowerCase();
    const envobj = this.returnChainInfo(chain);
    this.scatter = scatterJS.scatter;
    
    let blockchain = 'eos';
    let newObj = Eos({
      httpEndpoint: envobj.url,
      chainId: envobj.chainId,
      verbose: false,
    });
    if (chain === 'eos') {
      this.EosJsUse = newObj;
    }
    this.network = {
      blockchain,
      protocol: envobj.protocol,
      host: envobj.host,
      port: envobj.port,
      chainId: envobj.chainId,
    };
    this.eosOptions = {
      broadcast: true,
      sign: true,
      chainId: envobj.chainId,
    };
    if (chain === this.chainName) {
      this.EosJs = newObj;
    }
    if (this.scatter && this.scatter.identity) {
      this.scatterEosJs = await this.scatter.eos(this.network, Eos, this.eosOptions);
    }
  }

  // 节点信息获取
  returnChainInfo() {
    let envobj = store.state.sys.baseConfig.node;
    return envobj;
  }

  /*
  * 获取钱包身份
  * get scatter identityInfo => publicKey
  */
  async getIdentity(chain, callback) {
    const self = this;
    this.chainName = chain.toLowerCase();
    await this.chainNodeInit(this.chainName);
    const requiredFields = { accounts:[this.network] };
    if (!this.scatter) {
      this.scatterInit(this.vthis, () => {});
      return;
    }
    this.scatter.getIdentity(requiredFields).then((identity) => {
      // 登录成功
      const item = {
        identity,
        wallet: 'Scatter',
        chain: this.chainName,
      }
      this.scatterEosJs = this.scatter.eos(this.network, Eos, this.eosOptions);

      this.conserveAccount(item, callback);
      // self.vthis.$message({
      //   message: 'Login Success',
      //   type: 'success'
      // });
    }).catch((error) => {
      if (self.vthis.loading) self.vthis.loading = false;
      callback(error);
      // 未解锁
      if (error.code === 423) {
        self.vthis.$confirm(self.vthis.$t('public.scatterlouck'), self.vthis.$t('public.reTip'), {
          confirmButtonText: self.vthis.$t('public.louckOk'),
          cancelButtonText: self.vthis.$t('public.louckCancel'),
          type: 'warning',
        }).then(() => {
          self.getIdentity(this.chainName, callback);
        }).catch(() => {
          callback('cancel');
        });
        return false;
      }
      this.errorCall(error, (res) => {
        self.vthis.$message.error(`${res.message} ${res.code}`);
      });
      return '';
    })
  }

  conserveAccount(item, callback) {
    const scatterItem = store.state.app.scatter;
    this.accountByScatter = item.identity.accounts[0];
    const { identity = null, wallet, chain, online = true } = item;
    scatterItem.identity = identity;
    scatterItem.wallet = wallet;
    scatterItem.chain = chain;
    scatterItem.online = online;
    // test 账户
    // scatterItem.identity.accounts[0].name = 'xiaohuzi1a2a';
    store.dispatch('setScatter', scatterItem);
    localStorage.setItem('Frontend-Token', '');
    callback()
  }

  // 退出账户
  accountLoginOut(callback) {
    let scat = store.state.app.scatter;
    if (this.scatter && this.scatter.identity) {
      this.scatter.forgetIdentity().then(() => callback());
      this.storeAccountOut(scat);
      return;
    }
    this.storeAccountOut(scat);
    callback();
  }

  // 清除账号缓存 
  storeAccountOut(scat) {
    if (scat && scat.identity) {
      scat.wallet = '';
      scat.identity = null;
      scat.chain = 'eos';
      scat.online = false;
      scat.by = '';
      localStorage.setItem('Frontend-Token', '');
      this.accountByScatter = null;
      store.dispatch('setScatter', scat);
    }
  }

  /*
  * 转账/交易 操作
  * @params code 智能合约
  * @params toAccount 收款者
  * @params quantity  转账额度x
  * @memo 转账备注
  */
  async transfer(obj, callback) {
    const formName = this.accountReset();
    const permission = this.accountByScatter.authority;
    const quantity = obj.quantity;
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
            quantity,
            memo: obj.memo
          }
        }
      ]
    }
    if (!this.scatterEosJs) {
      await this.chainNodeInit(this.chainName);
    }
    // 免费CPU
    if (obj.useFreeCpu && this.chainName === 'eos') {
      this.freeCpuTransaction(params, callback);
      return;
    }
    this.scatterEosJs.transaction(params).then(callback).catch((e) => {
      this.errorCall(e, callback);
    });
  }

/*
* 获取 getTableRows
*/
async getTableRows(obj, callback) {
  // const formName = this.accountReset();
  const params = obj;
  // 配置
  if (!this.EosJsUse) {
    await this.chainNodeInit('eos')
  }
  this.EosJsUse.getTableRows(params).then((rammarket) => {
    callback(rammarket)
  })
  .catch((e) => {
    console.log(e);
    // this.errorCall(e, callback);
  });
}

  // 免CPU合约执行
  freeCpuTransaction(params, callback) {
    if (params.actions.length === 0) {
      params.actions[0].authorization.unshift({ actor: this.actor, permission: 'active' });
    } else {
      params.actions.forEach((item) => {
        item.authorization.unshift({
          actor: this.actor,
          permission: 'active',
        })
      })
    }
    this.scatterEosJs.transaction(params, {
      broadcast: !1, // 是否广播
      sign: !0,
    }).then((res) => {
      if (res.processed || res.transaction_id) {
        const p = res;
        const l = p.transaction.transaction;
        l.signatures = p.transaction.signatures;
        l.context_free_data = [];
        const signed = JSON.stringify(l);
        // callback(signed)
        this.handleFreeCpuSend(signed, callback);
        return;
      }
      this.handleScatterErrorBack(res);
    }).catch((e) => {
      this.errorCall(e, callback);
    });
  }

  // 服务端广播免费CPU
  handleFreeCpuSend(signed, callback) {
    try {
      const host = location.origin;
      let url = `${host}/cpu/pushTxWithoutCPU`;
      if (this.env !== 'production') {
        url = `http://${process.env.VUE_APP_BASEURL}:${process.env.VUE_APP_PORT2}/cpu/pushTxWithoutCPU`;
      }
      axios.post(url, { signed }, {
        headers: {
          accept: 'application/json, text/plain, */*',
        },
      }).then((res) => {
        if (res.data.code === 200) {
          callback({processed: true, transaction_id: true});
          return;
        }
        callback(res.data);
      });
    } catch (err) {
      this.$message.error(JSON.stringify(err));
    }
  }

  /*
  * 获取eos账号余额
  * @params code
  * @params symbol
  * @params eosAccount
  * @return Balance
  */
  async getCurrencyBalance(obj, callback) {
    const params = {
      code: obj.code,
      symbol: obj.coin,
      account: obj.account || this.accountReset()
    };
    if (!this.EosJs) {
      await this.chainNodeInit(this.chainName || 'eos')
    }
    this.EosJs.getCurrencyBalance(params).then((results, error) => {
      if (results) {
        callback(results[0]);
        return
      }
      callback(`${Number(0).toFixed(obj.decimal)} ${obj.coin}`);
    }).catch((e) => {
      // this.errorCall(e, callback);
    });
  }

  // 账号重置
  accountReset() {
    const item = {
      name: '',
      authority: '',
    }
    const identity = store.state.app.scatter.identity;
    if (!identity) return item.name;
    this.accountByScatter = identity.accounts[0];
    return this.accountByScatter.name;
  }

  // 挖矿
  async stake(obj, callback) {
    this.getToAccount()
    const formName = this.accountReset();
    const permission = this.accountByScatter.authority;
    const params = {
      actions: [
        {
          account: this.toAccountJin,
          name: 'stake',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            debtid: obj.id,
          }
        }
      ]
    }
    if (!this.scatterEosJs) {
      await this.chainNodeInit(this.chainName);
    }
    // 免费CPU
    if (obj.useFreeCpu && this.chainName === 'eos') {
      this.freeCpuTransaction(params, callback);
      return;
    }
    this.scatterEosJs.transaction(params).then(callback).catch((e) => {
      this.errorCall(e, callback);
    });
  }

  // REX 操作
  rexActions(obj, callback) {
    this.getToAccount()
    const formName = this.accountReset();
    const permission = this.accountByScatter.authority;
    let amount = obj.amount;
    const params = {
      actions: [{ // 投票
        account: 'eosio',
        name: 'voteproducer',
        authorization: [{ 
          actor: formName,
          permission,
        }],
        data: {
          voter: formName,
          proxy: obj.proxy || 'dfsbpsproxy1', // 投票的节点名称
          producers: [],
        },
      }]
    }
    if (obj.type === 'buyRex') {
      const buyRex = [{ // 充值
        account: 'eosio',
        name: 'deposit',
        authorization: [{
          actor: formName,
          permission,
        }],
        data: {
          owner: formName,
          amount, // eos 数量
        },
      },
      { // 买入：buyrex
        account: 'eosio',
        name: 'buyrex',
        authorization: [{
          actor: formName,
          permission,
        }],
        data: {
          from: formName,
          amount, // eos 数量
        },
      }]
      params.actions.push(...buyRex)
    } else {
      const sellRex = [{ // 卖出：sellrex
        account: 'eosio',
        name: 'sellrex',
        authorization: [{
          actor: formName,
          permission,
        }],
        data: {
          from: formName,
          rex: obj.rex
        },
      },
      { // 提现
        account: 'eosio',
        name: 'withdraw',
        authorization: [{
          actor: formName,
          permission,
        }],
        data: {
          owner: formName,
          amount: obj.getEos
        },
      }]
      params.actions.push(...sellRex)
    }
    
    console.log(params)
    this.toTransaction(params, callback)
  }

  // 直接执行操作
  async toTransaction(obj, callback) {
    const params = obj;
    if (!this.scatterEosJs) {
      await this.chainNodeInit(this.chainName);
    }
    // 免费CPU
    if (obj.useFreeCpu && this.chainName === 'eos') {
      delete params.useFreeCpu;
      this.freeCpuTransaction(params, callback);
      return;
    }
    this.scatterEosJs.transaction(params).then(callback).catch((e) => {
      this.errorCall(e, callback);
    });
  }

  // scatter操作回调
  handleScatterErrorBack(res) {
    if (res.code || res.error) {
      let code = res.code;
      if (code === 500 && res.error) {
        code = res.error.code;
      }
      if (res.error && res.error.details && res.error.details.length > 0
        && code !== 3080001
        && code !== 3080002
        && code !== 3080004
        && code !== 3040005) {
        const errorDetails = res.error.details[0].message.split(':')[1] || res.error.details[0].message;
        if (errorDetails && errorDetails.indexOf('your orders has exceeded') >= 0) {
          const arr = errorDetails.trim().split(' ');
          const amount = arr[arr.length - 2];
          this.vthis.$message.error(`${this.vthis.$t('tronExchange.entrustmentTip3', {amount})}`);
          return;
        }
        if (errorDetails === ' no account found') {
          this.vthis.$message.error(this.vthis.$t('usn.usn451'));
          return;
        }
        this.vthis.$message.error(`${errorDetails}【${code}】`);
        return;
      }
      switch (code) {
        case 3080001:
          this.vthis.$message.error(`${this.vthis.$t('error.error3080001')}【${code}】`);
          break;
        case 3080002:
          this.vthis.$message.error(`${this.vthis.$t('error.error3080002')}【${code}】`);
          break;
        case 3080004:
          this.vthis.$message.error(`${this.vthis.$t('error.error3080004')}【${code}】`);
          break;
        case 3040005:
          this.vthis.$message.error(`${this.vthis.$t('error.error3040005')}【${code}】`);
          break;
        case 3050003:
          this.vthis.$message.error(`${this.vthis.$t('error.error3050003')}【${code}】`);
          break;
        default:
          if (res.code && res.message) {
            this.vthis.$message.error(`${res.message} 【${res.code}】`);
            return;
          }
          this.vthis.$message.error(`${res.message} 【${code}】`);
          break;
      }
      return;
    }
    if (res.data && res.data.code === 500 && typeof(res.data.message) === 'string') {
      const fjres = eval('('+res.data.message+')');
      this.handleScatterErrorBack(fjres);
      return;
    }
    this.vthis.$message.error(`Unknow Error!【${res}】`);
  }

  errorCall(e, callback) {
    let back = {
      code: '0001',
      message: JSON.stringify(e),
    };
    console.log(e)
    try {
      if (typeof (e) === 'object') {
        if (e.code === 402) {
          back = {
            code: 402,
            message: this.vthis.$t('error.cancel'),
          }
        }
      }
      if (typeof (e) === 'string') {
        const err = JSON.parse(e);
        // CPU 不足
        if (err.error.code === 3080004) {
          back = {
            code: 3080004,
            message: this.vthis.$t('error.insufficient', {res: 'CPU'}),
          }
        }
        // NET 不足
        if (err.error.code === 3080002) {
          back = {
            code: 3080002,
            message: this.vthis.$t('error.insufficient', {res: 'NET'}),
          }
        }
        // RAM 不足
        if (err.error.code === 3080001) {
          back = {
            code: 3080001,
            message: this.vthis.$t('error.insufficient', {res: 'RAM'}),
          }
        }
        if (err.error.code === 3050003 || err.error.code === 3010010) {
          // 滑点过高导致
          const detail = err.error.details;
          if (detail[0].message.indexOf('INSUFFICIENT_OUTPUT_AMOUNT') !== -1) {
            back = {
              code: 3050003,
              message: this.vthis.$t('dex.heightSlip'),
            }
          } else if (detail[0].message.indexOf('Invalid packed transaction') !== -1) { // 用户取消操作
            back = {
              code: 402,
              message: this.vthis.$t('error.cancel'),
            }
          } else {
            back = {
              code: err.error.code,
              message: detail[0].message,
            }
          }
        }
      }
      callback(back);
    } catch (error) {
      console.log(error)
      if (e === '操作已取消') {
        back = {
          code: 402,
          message: this.vthis.$t('error.cancel'),
        }
      }
      callback(back);
    }
  }

  //  catch 错误回调
  errorCallOld(e, callback) {
    console.log(e)
    const self = this;
    const scatapp = store.state.app.scatter;
    let back = {
      code: 100001,
      error: {
        code: 100001
      },
      message: 'Unknown anomaly',
    };
    if (typeof (e) === 'object') {
      back = {
        code: '402',
        error: {
          code: '402',
        },
        message: e.message || 'Privileges have been lost. Please log in again.',
      }
      if (e.code === 402) {
        back.message = e.message;
      }
      if (e.code === 'Scatter') {
        // ${this.vthis.$t('error.error3040005')}
        back.code = '100002'
        back.message = this.vthis.$t('public.scatterDesktop');
      }
      if (e.Error && typeof (e.Error) === 'string' && e.Error.indexOf('No Identity') >= 0) {
        back.message = 'Privileges have been lost. Please log in again.';
        self.accountLoginOut(() => {
          self.getIdentity(self.chainName, () => {});
        });
      }
      if (scatapp && scatapp.identity && !scatterConnected) {
        self.initNext();
      }
      if (e.name === "AssertionError") {
        back.code = '500';
        back.message = e.message;
      }
    }
    if (typeof (e) === 'string') {
      if (e.indexOf('code') >= 0) {
        back = JSON.parse(e);
      } else {
        back = {
          code: '0002',
          error: {
            code: '0002',
          },
          message: 'Failed to get the balance',
        }
      }
    }
    // self.vthis.$message.error(`${back.message} ${back.code}`);
    back = {
      code: 9999,
      message: JSON.stringify(e)
    }
    callback(back);
  }
}

export const ChainModel = new model();
export const model2 = model;
export const EosModel = new model();
