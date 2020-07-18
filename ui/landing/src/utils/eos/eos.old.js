/* eslint-disable */
import axios from 'axios';
// import Eos from 'eosjs';
import Eos from 'eosjs-without-sort';
import Ecc from 'eosjs-ecc';
import Fcbuffer from 'fcbuffer';
import store from '@/store';
import Io from '@/utils/socket';
import scatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';

scatterJS.plugins( new ScatterEOS() );
// const abi = require("./eosio.system.json");

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
    this.chainName = null;
    this.env = process.env.NODE_ENV;
    this.scatapp = null;
    // 配置
    this.EosJs = null;
    this.EosJsUse = null;
    this.network = null;
    this.eosOptions = null;
    this.actor = this.env === 'production' ? '111.3' : '11111111aaaa'; // 1111
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
    scatterJS.scatter.connect('newdex.io').then(async connected => {
      if (self.scatapp.wallet === 'Ironman') return;
      scatterConnected = connected;
      if (!connected) {
        nowFrequency += 1;
        if (nowFrequency > maxFrequency
          && this.scatapp.by !== 'mobileWallet'
          && this.scatapp.wallet !== 'cloudWallet') {
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
      if (self.scatapp.wallet === 'Ironman') return;
      self.scatter = scatterJS.scatter;
      window.scatter = null;
      window.ScatterJS = null;
      self.scatapp.online = true;
      // 获取scatter来源
      let scatterFrom = 'Scatter';
      try {
        const getVersion = await scatterJS.scatter.getVersion();
        if (getVersion && getVersion.indexOf(' ') >= 0 && getVersion.split(' ')[0]) {
          scatterFrom = getVersion.split(' ')[0].toLowerCase(); // leafwallet 叶子钱包
        }
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
    if (location.pathname.indexOf('embed-trade') >= 0) return;
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
    // 如果是扫码登录的用户
    this.scatapp = store.state.app.scatter;
    if (this.scatapp && this.scatapp.by === 'mobileWallet' && mobileWalletFrequency >= 3) {
      this.vthis.$message.error(this.vthis.$t('public.walletDesktop'));
    }
    if (mobileWalletFrequency <= 4) {
      mobileWalletFrequency += 1
    }
  }

  // 节点信息获取
  returnChainInfo(cname) {
    const chainName = cname.toLowerCase();
    let envobj = store.state.app.nodeChecked[chainName];
    if (!envobj){
      return {
        area: 'Hongkong, HK',
        chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        host: 'eos.newdex.one',
        port: '443',
        protocol: 'https',
        url: 'https://eos.newdex.one'
      };
    }
    // if (chainName === 'eos') {
    //   switch (this.env) {
    //     case 'test':
    //     case 'test2':
    //     case 'development':
    //       // envobj.chainId = 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f';
    //       envobj.chainId = '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191';
    //       break;
    //     case 'production':
    //       envobj.chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
    //       break;
    //     default:
    //       break;
    //   }
    // }
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

      this.conserveAccount(item);
      // if (!this.scatter.identity) {
      //   window.location.reload();
      // }
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

  conserveAccount(item) {
    const scatterItem = store.state.app.scatter;
    this.accountByScatter = item.identity.accounts[0];
    const { identity = null, wallet, chain, online = true } = item;
    scatterItem.identity = identity;
    scatterItem.wallet = wallet;
    scatterItem.chain = chain;
    scatterItem.online = online;
    store.dispatch('setUserInfo', scatterItem.identity.accounts[0]);
    store.dispatch('setScatter', scatterItem);
    Io.accountBind(this.accountByScatter.name);
    localStorage.setItem('Frontend-Token', '');
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
      Io.accountOut(scat.identity.accounts[0].name);
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
    if (obj.embed) { // 内嵌
      const postParams = {
        action: 'eosTransaction',
        data: params,
        useFreeCpu: obj.useFreeCpu
      }
      window.parent.postMessage(JSON.stringify(postParams), obj.targetOrigin);
      return;
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
  * 签名 - 合约签名
  */
  async arbitrarySignature(vthis, timestamp, callback) {
    this.vthis = vthis;
    const data = (Math.floor(timestamp / 1000)).toString();
    const formName = this.accountReset();
    const permission = this.accountByScatter.authority;
    const chainId = this.returnChainInfo(this.chainName).chainId;
    const back = {
      account: formName,
      timestamp: data,
      type: 'web'
    }
    
    const params = {
      actions: [
        {
          account: this.chainName === 'meetone' ? 'newdexsign.m' : 'newdexverify',
          name: 'verify',
          authorization: [{
            actor: formName,
            permission,
          }],
          data: {
            data: data.toString()
          }
        }
      ]
    }
    if (!this.scatterEosJs) {
      await this.chainNodeInit(this.chainName);
    }
    this.scatterEosJs.transaction(params, {
      broadcast: !1, // 是否广播
      sign: !0,
    }).then(async (res) => {
      if (res.processed || res.transaction_id) {
        const Transaction = this.scatterEosJs.fc.structs.transaction; 
        const txObject = Transaction.fromObject(res.transaction.transaction);
        const buf = Fcbuffer.toBuffer(Transaction, txObject);
        const chainIdBuf = Buffer.from(chainId, 'hex');
        const packedContextFreeData = Buffer.from(new Uint8Array(32));
        const signBuf = Buffer.concat([chainIdBuf, buf, packedContextFreeData]);
        const signature = res.transaction.signatures[0];
        // const verified = Ecc.verify(signature, signBuf, 'EOS6VPY5WayTY1gBsGz1yStG9UL991iwz9tTZoTqfKNDm5jZUqc8N');
        back.signature = signature;
        back.signBase64 = Buffer.from(signBuf).toString('base64');
        callback(back);
        return;
      }
      this.handleScatterErrorBack(res);
    }).catch((e) => {
      this.errorCall(e, callback);
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

  // NDX抵押信息
  async newdexStakexInfo(obj, callback) {
    const userName = Eos.modules.format.encodeName(this.accountReset(), false);
    let actor = obj.actor === 'account' ? userName : obj.actor;
    const params = {
      "json": true,
      "code": "newdexstaked",
      "scope": actor,
      "table": obj.name
    };
    if (obj.name === 'stakeddetail') {
      params.table = 'stake2others';
      params.limit = 500;
    }
    if (obj.name === 'stake') {
      params.lower_bound = obj.chain;
      params.upper_bound = obj.chain;
      params.table = 'stakes';
    }
    // 配置
    if (!this.EosJsUse) {
      await this.chainNodeInit('eos')
    }
    this.EosJsUse.getTableRows(params).then(callback).catch((e) => {
      this.errorCall(e, callback);
    });
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
      account: this.accountReset()
    };
    if (!this.EosJs) {
      await this.chainNodeInit(this.chainName)
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

  /*
  * 获取eos账号信息
  * @params eosAccount
  * @return 账户信息
  */
  async getAccount(params, callback) {
    if (!this.EosJs) {
      await this.chainNodeInit(this.chainName)
    }
    this.EosJs.getAccount(params).then(callback).catch((e) => {
      this.errorCall(e, callback);
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

  /*
   * 稳定币 债仓 预警
   * @params tableKey、indexPosition(3债仓\2预警)、limit
   * 债仓（tableKey: "byissue"， indexPosition: 3）
   * 预警 (tableKey: "byrisk"， indexPosition: 2）
  */
  async getStablecoinInfo(obj, callback) {
    const params = {
      json: true,
      code: 'danchorsmart',
      scope: 'danchorsmart',
      table: "accounts",
      table_key: obj.tableKey,
      index_position: obj.indexPosition,
      key_type: "i64",
      // lower_bound: key,
      // upper_bound: key,
      limit: obj.limit // 条数
    }
    if (!this.EosJsUse) {
      await this.chainNodeInit(this.chainName)
    }
    this.EosJsUse.getTableRows(params).then(res => callback(res)).catch((e) => {
      // this.errorCall(e, callback);
    });
  }

  async eosTransactionByEmbed(obj, callback) {
    const params = obj.data;
    if (!this.scatterEosJs) {
      await this.chainNodeInit(this.chainName);
    }
    if (!obj.useFreeCpu) {
      this.scatterEosJs.transaction(params).then(callback).catch((e) => {
        this.errorCall(e, callback);
      });
      return;
    }
    // 没有定义默认免cpu
    if ((obj.useFreeCpu && this.chainName === 'eos') || (obj.useFreeCpu === undefined && this.chainName === 'eos')) {
      this.freeCpuTransaction(params, callback);
    }
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

  /* -------- 生成USN - 减少抵押比率生成USN start -------- */
  async generateUsn(obj, callback) {
    const fromName = this.accountReset();
    const permission = this.accountByScatter.authority;
    const params = {
      actions: [
        {
          account: 'danchorsmart', // 合约账户
          name: 'adjust', // adjust - 下调质押率
          authorization: [{
            actor: fromName, // 转账者
            permission, // 权限 active | owner
          }],
          data: {
            owner: fromName,
            rate: parseInt(obj.percent * 100),
            issue: obj.issue, // 1 - 生成 USN || 0 - 取出EOS
          }
        }
      ]
    };
    if (obj.embed) { // 内嵌
      const postParams = {
        action: 'eosTransaction',
        data: params,
        useFreeCpu: obj.useFreeCpu
      }
      window.parent.postMessage(JSON.stringify(postParams), obj.targetOrigin);
      return;
    }
    if (!this.scatterEosJs) {
      await this.chainNodeInit(this.chainName);
    }
    if (obj.useFreeCpu) {
      this.freeCpuTransaction(params, callback)
      return;
    }
    this.scatterEosJs.transaction(params).then((res) => {
      callback(res);
    }).catch((e) => {
      // alert(e); // eslint-disable-line
      this.errorCall(e, callback)
    });
  }
  /* -------- 生成USN - 减少抵押比率生成USN end -------- */

  /* -------- 管理抵押量 - 减少抵押量 start -------- */
  async manageStake(obj, callback) {
    const fromName = this.accountReset();
    const permission = this.accountByScatter.authority;
    const params = {
      actions: [
        {
          account: 'danchorsmart', // 合约账户
          name: 'withdraw', // adjust - 下调质押率
          authorization: [{
            actor: fromName, // 转账者
            permission, // 权限 active | owner
          }],
          data: {
            owner: fromName,
            quantity: obj.quantity,
          }
        }
      ]
    };
    if (obj.embed) { // 内嵌
      const postParams = {
        action: 'eosTransaction',
        data: params,
      }
      window.parent.postMessage(JSON.stringify(postParams), obj.targetOrigin);
      return;
    }
    if (!this.scatterEosJs) {
      await this.chainNodeInit(this.chainName);
    }
    if (obj.useFreeCpu) {
      this.freeCpuTransaction(params, callback)
      return;
    }
    this.scatterEosJs.transaction(params).then((res) => {
      callback(res);
    }).catch((e) => {
      this.errorCall(e, callback)
    });
  }
  /* -------- 管理抵押量 - 减少抵押量 end -------- */

  //  catch 错误回调
  errorCall(e, callback) {
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
    self.vthis.$message.error(`${back.message} ${back.code}`);
    callback(back);
  }
}

export const ChainModel = new model();
export const model2 = model;
export const EosModel = new model();
