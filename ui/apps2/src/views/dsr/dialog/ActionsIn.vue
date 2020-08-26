<template>
  <div class="inset">
    <div class="title">存款</div>
    <div class="content">
      <div class="item">
        <div class="info flexb">
          <span @click="handleClickBalan('pay')">{{ $t('public.balance') }}: {{ balance }} {{ thisMarket.symbol }}</span>
          <span class="type">存款</span>
        </div>
        <div class="iptDiv flexb">
          <div class="coinInfo flex" @click="listenShowDrawer('start')">
            <div class="coinImg"><img width="100%" :src="thisMarket.imgUrl" :onerror="errorCoinImg" alt=""></div>
            <div>
              <div class="coin">{{ thisMarket.symbol }}</div>
              <div class="contract tip">{{ thisMarket.contract }}</div>
            </div>
          </div>
          <div class="inputDiv">
            <el-input class="elIpt" type="number" v-model="payNum" placeholder="0.0"
              @input="handleInBy('pay')"
              @focus="handleFocus('pay')"
              @blur="handleBlur('pay')"></el-input>
          </div>
        </div>
        <div class="time flexb">
          <span>存款时间</span>
          <el-select
            class="select"
            v-model="value" clearable placeholder="请选择"
            :popper-append-to-body="false"
            :popper-class="'mySelectItem'">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="about tip">
        预计年化收益: {{timeApr}}%
      </div>
    </div>
    <div class="btnDiv">
      <div class="btn flexc">确认</div>
    </div>

    <div class="rules">
      <div class="subTitle">存款规则</div>
      <div class="rules">1. 基本年化收益: 5%</div>
      <div class="rules">
        <div>2. 存款时-，可以选择存款时间，目前有以下五档可供选择</div>
        <div class="subRules">
          <div>1. 随存随取，年化5%</div>
          <div>2. 1月，年化 5.25%</div>
          <div>3. 3月，年化 5.5%</div>
          <div>4. 6月，年化 6.0%</div>
          <div>5. 1年，年化 7.5%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toFixed, accMul, accAdd } from '@/utils/public';

export default {
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      payNum: '',
      balance: '0.0000',
      apr: 5,
      thisMarket: {
        symbol: 'DFS',
        contract: 'minedfstoken',
        imgUrl: 'https://ndi.340wan.com/eos/minedfstoken-dfs.png'
      },
      options: [{
        value: '0',
        label: '随存随取'
      }, {
        value: '1',
        label: '1月'
      }, {
        value: '2',
        label: '3月'
      }, {
        value: '3',
        label: '6月'
      }, {
        value: '4',
        label: '1年'
      }],
      value: '0'
    }
  },
  computed: {
    timeApr() {
      if (!this.value) {
        return this.apr;
      }
      const buff = [0, 0.05, 0.1, 0.2, 0.5]
      const newApr = accMul(this.apr, buff[Number(this.value)]);
      return accAdd(newApr, this.apr)
    }
  },
  methods: {
    handleInBy() {

    },
    handleFocus() {
      const n = Number(this.payNum);
      n > 0 ? this.payNum = n : this.payNum = '';
    },
    handleBlur() {
      const n = Number(this.payNum);
      n > 0 ? this.payNum = toFixed(n, 4) : this.payNum = '';
    }
  }
}
</script>

<style lang="scss" scoped>
.inset{
  padding: 40px;
  .title{
    font-size: 32px;
    color: rgba(7,215,155,1);
    margin-bottom: 20px;
  }
  .item{
    padding: 20px;
    border: 1px solid #f3f3f3;
    border-radius: 30px;
    &.focus{
      border:1px solid rgba(7,215,155,1);
    }
    &.pdb10{
      padding-bottom: 28px;
    }
    .info{
      font-size: 24px;
      margin-bottom: 24px;
      .type{
        font-size: 28px;
      }
    }
    .iptDiv{
      .coinInfo{
        text-align: left;
        flex: 3;
        .coinImg{
          width: 60px;
          height: 60px;
          margin-right: 10px;
        }
        .coin{
          font-size: 28px;
          font-weight: 500;;
          line-height: 30px;
        }
        .contract{
          line-height: 30px;
        }
        .ableGet{
          color: #2F3F52;
        }
      }
      .inputDiv{
        flex: 4;
        .elIpt{
          /deep/ .el-input__inner{
            color: $color-black;
            border: 0px;text-align: right;
            font-size: 52px;
            padding: 0 0 0 20px;
            height: 62px;
          }
        }
      }
    }
    .time{
      margin: 20px 0 0;
      .select{
        height: 60px
      }
      /deep/ .el-select{
        .el-input__suffix-inner{
          display: flex;
          align-items: center;
          height: 60px;
        }
        .el-input__inner{
          height: 60px;
          font-size: 16px;
          text-align: right;
          width: 160px;
          border: 0px;
          padding-right: 38px;
          &:focus{
            border-color: #07d79b;
          }
        }
      }
      /deep/ .el-scrollbar{
        .el-select-dropdown__item{
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          font-weight: normal;
          &.selected{
            font-weight: bold;
            color: #07d79b;
          }
        }
      }
    }
  }
  .about{
    margin: 20px;
    text-align: left;
  }
}
.btnDiv{
  margin: 40px 0;
  font-size: 32px;
  font-weight: 500;
  .btn{
    height: 88px;
    background:rgba(7,215,155,1);
    border-radius:30px;
    color: #fff;
    &:active{
      background:rgba(2,198,152,1);
    }
  }
}
.rules{
  text-align: left;
  font-size: 26px;
  .subTitle{
    font-size: 28px;
    font-weight: bold;
    color: #000;
  }
  .rules{
    padding: 5px 0;
    &:last-child{
      padding-bottom: 0;
    }
    .subRules{
      padding: 5px 0 5px 20px;
    }
  }
}
</style>
