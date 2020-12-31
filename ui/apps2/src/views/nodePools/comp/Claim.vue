<template>
  <div class="allClaim flexb flexs" v-loading="waiting">
    <img class="bgImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/bg/myReward.png" alt="">
    <div>
      <div class="subTitle flexa tip">
        <span>{{ $t('mine.waitClaim') }}</span>
        <img class="tipIcon ml10" @click="showRules = true" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt="">
        <span class="about tip">({{ $t('nodePools.allReward') }} ≈ {{ allReward }} EOS)</span>
      </div>
      <template v-for="(v) in lpPoolsMid">
        <div class="claimNum" :key="v" v-if="accLpData[v] && parseFloat(accLpData[v].showReward)">
          <span class="dinBold">{{ accLpData[v] ? accLpData[v].showReward || '0.00000000' : '0.00000000' }} TAG</span>
          <span class="tip small">/{{ accLpData[v].symbol0 }}</span>
          <span class="tip dinReg"> ≈ {{ accLpData[v] ? accLpData[v].aboutEos || '0.0000' : '0.0000' }} EOS</span>
        </div>
      </template>
      <template v-for="(v, index) in nKeys">
        <div class="claimNum" v-if="poolsData[v].showReward" :key="index">
          <span class="dinBold">{{ poolsData[v].showReward || '0.00000000' }} {{ poolsData[v].sym }}</span>
          <span class="tip dinReg"> ≈ {{ poolsData[v].aboutEos || '0.0000' }} EOS</span>
        </div>
      </template>
    </div>
    <div class="flexb">
      <div class="allClaimBtn" v-loading="claim" @click="handleClaimAll">{{ $t('bonus.claim') }}</div>
    </div>

    <el-dialog
      class="myDialog"
      :visible.sync="showRules">
      <ClaimRules />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import ClaimRules from '@/views/nodePools/dialog/ClaimRules' 

// import { getClaimActions } from '../js/nodePools';

export default {
  name: 'claim',
  components: {
    ClaimRules
  },
  props: {
    lpPoolsMid: {
      type: Array,
      default: function avd() {
        return []
      }
    },
    poolsData: {
      type: Object,
      default: function pd() {
        return {}
      }
    },
    accVoteData: {
      type: Object,
      default: function avd() {
        return {}
      }
    },
    accLpData: {
      type: Object,
      default: function avd() {
        return {}
      }
    }
  },
  data() {
    return {
      claim: false,
      nKeys: [],
      showRules: false,
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig,
    }),
    allReward() {
      // console.log(this.accLpData)
      const mids = Object.keys(this.accLpData);
      let all = 0;
      mids.forEach(v => {
        all = parseFloat(this.accLpData[v].aboutEos || 0) + Number(all)
      })
      const keys = Object.keys(this.poolsData);
      keys.forEach(v => {
        all += parseFloat(this.poolsData[v].aboutEos || 0)
      })
      return Number(all || 0).toFixed(4)
    },
    waiting() {
      if (this.lpPoolsMid.length || this.nKeys.length) {
        return false
      }
      return true
    }
  },
  watch: {
    poolsData: {
      handler: function psd() {
        this.nKeys = Object.keys(this.poolsData)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleClaimAll() {
      if (!this.scatter || !this.scatter.identity || this.claim) {
        return
      }
      this.claim = true;
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      // const params = getClaimActions(this.accVoteData)
      const params = {
        actions: [
          { // 收获
            account: this.baseConfig.nodeMiner,
            name: 'harvest',
            authorization: [{ 
              actor: formName,
              permission,
            }],
            data: {
              farmer: formName,
            },
          }
        ]
      }
      this.lpPoolsMid.forEach(v => {
        const lpAction = {
          account: this.baseConfig.nodeMiner,
          name: 'claim',
          authorization: [{ 
            actor: formName,
            permission,
          }],
          data: {
            user: formName,
            mid: v
          },
        }
        if (this.accLpData[v] && Number(this.accLpData[v].showReward)) {
          params.actions.push(lpAction)
        }
      })
      EosModel.toTransaction(params, (res) => {
        this.claim = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
        setTimeout(() => {
          console.log('12345')
          // 查询代理账户数据
          this.$emit('listenUpdata', 'acc')
        }, 1500);
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.allClaim{
  position: relative;
  margin: 30px 32px;
  border-radius: 12px;
  color: #333;
  padding: 28px;
  box-sizing: border-box;
  background: #FFF;
  box-shadow: 0px 4px 8px 4px rgba(220,220,220,0.5);
  .bgImg{
    position: absolute;
    left: -10px;
    top: -10;
    width: 103%;
    // height: 170px;
    z-index: -1;
  }
  .ml10{
    margin: 0 10px;
  }
  .subTitle{
    font-size: 26px;
  }
  .claimNum{
    text-align: left;
    font-size: 30px;
    font-weight: 500;
    margin-top: 8px;
    .small{
      font-size: 24px;
    }
  }
  .allClaimBtn{
    background: #29D4B0;
    border-radius: 30px;
    color: #FFF;
    font-size: 28px;
    padding: 10px 36px;
  }
}
.myDialog{
  /deep/ .el-dialog{
    position: relative;
    margin: auto;
    width: 590px;
    border-radius: 20px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
}
</style>