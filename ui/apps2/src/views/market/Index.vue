<template>
  <div class="tabView">
    <div class="marketData">
      <tabs />
      <div class="direction flexb">
        <span class="flexc" :class="{'act': act === 1}" @click="act = 1">存入</span>
        <span class="flexc" :class="{'act actBack': act === 2}" @click="act = 2">取回</span>
      </div>
      <div v-if="act === 1">
        <div class="sym0Data" :class="{'focus': true}">
          <div class="info flexb">
            <span>余额: {{ balanceSym0 }} {{ thisMarket.symbol0 }}</span>
            <span class="type"></span>
          </div>
          <div class="iptDiv flexb">
            <div class="coinInfo flex" @click="listenShowDrawer('start')">
              <div class="coinImg"><img width="100%" :src="handleGetCoinImg('sym0')" :onerror="errorCoinImg" alt=""></div>
              <div>
                <div class="coin">{{ thisMarket.symbol0 }} <i class="el-icon-arrow-down"></i></div>
                <div class="contract tip">{{ thisMarket.contract0 }}</div>
              </div>
            </div>
            <div class="inputDiv">
              <el-input class="elIpt" type="number" v-model="payNum1" placeholder="0.0"
                @input="handleInBy('sym0')"
                @focus="handleFocus('sym0')"
                @blur="handleBlur('sym0')"></el-input>
            </div>
          </div>
        </div>
        <div class="exchange">
          <div class="border flexc" :class="{'payFocus': true, 'getFocus': false}">
            <img class="iconImg" src="@/assets/img/dex/switch_down.svg">
          </div>
        </div>
        <div class="sym0Data pdb10" :class="{'focus': false}">
          <div class="info flexb">
            <span class="ableGet">余额: {{ balanceSym1 }} {{ thisMarket.symbol1 }}</span>
            <span class="type"></span>
          </div>
          <div class="iptDiv flexb">
            <div class="coinInfo flex" @click="listenShowDrawer('end')">
              <div class="coinImg"><img width="100%" :src="handleGetCoinImg('sym1')" :onerror="errorCoinImg" alt=""></div>
              <div>
                <div class="coin">{{ thisMarket.symbol1 }} <i class="el-icon-arrow-down"></i></div>
                <div class="contract tip">{{ thisMarket.contract1 }}</div>
              </div>
            </div>
            <div class="inputDiv">
              <el-input class="elIpt" type="number" v-model="payNum2" placeholder="0.0"
                @input="handleInBy('sym1')"
                @focus="handleFocus('sym1')"
                @blur="handleBlur('sym1')"></el-input>
            </div>
          </div>
        </div>
        <div class="rate flexb">
          <span class="tip">兑换比率</span>
          <span class="flex">
            <span v-if="!exRate">1EOS = {{ '2.3333' || '-' }}DFS</span>
            <span v-else>1DFS = {{ '0.1234' || '-' }}EOS</span>
            <span @click="exRate =!exRate">
              <img class="iconImg" v-if="!exRate" src="@/assets/img/dex/price_switch_icon_btn_left.svg" alt="">
              <img class="iconImg" v-else src="@/assets/img/dex/price_switch_icon_btn_right.svg" alt="">
            </span>
          </span>
        </div>
      </div>

      <div v-else>
        <div class="marketChecked flexb">
          <div class="checkedData">
            <div class="symbols">EOS / USDD</div>
            <div class="contracts tip">Eosio.Token / Minedfstoken</div>
          </div>
          <div class="flexc">
            <span class="el-icon-arrow-down more"></span>
          </div>
        </div>
        <div class="backData" :class="{'focus': tokenFocus}">
          <div class="flexb token">
            <span>凭证</span>
            <span>可用凭证: 0.00</span>
          </div>
          <div class="inputDiv">
            <el-input class="elIpt" type="number" v-model="payNum1" placeholder="0"
              @input="handleInBy('sym0')"
              @focus="handleFocus('sym0')"
              @blur="handleBlur('sym0')"></el-input>
          </div>
        </div>
        <div class="backNum flex">
          <span class="tip">取回</span>
          <span>0.0034 EOS + 0.0265 DFS</span>
        </div>
      </div>
    </div>

    <div class="liquidity" v-if="act === 1">
      <div class="subTitle">流动池数量</div>
      <div class="num">15117.3884 EOS  /  41348407.5014 USDD</div>
      <div class="subTitle">您的做市 (占比2.55%)</div>
      <div class="num">15117.3884 EOS  /  41348407.5014 USDD</div>
      <div class="subTitle">预计获得凭证</div>
      <div class="num">1213665</div>
    </div>

    <div class="btnDiv">
      <div v-if="act === 1" class="btn flexc">确 定</div>
      <div v-else class="btn flexc backBtn">取 回</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Tabs from '../index/components/Tabs';
export default {
  components: {
    Tabs,
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      act: 1,
      payNum1: '',
      payNum2: '',
      balanceSym0: '0.0000',
      balanceSym1: '0.0000',
      exRate: false,
      tokenFocus: true,
      thisMarket: {
        symbol0: 'EOS',
        symbol1: 'DFS',
        contract0: "eosio.token",
        contract1: "minedfstoken",
      },
    }
  },
  props: {
    marketLists: {
      type: Array,
      default: function lists() {
        return []
      }
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      slipPoint: state => state.app.slipPoint,
      baseConfig: state => state.sys.baseConfig,
    }),
  },
  watch: {
    marketLists(newVal) {
      console.log(newVal)
    }
  },
  methods: {
    handleInBy(type = 'sym0') {

    },
    handleFocus(type = 'sym0') {
      
    },
    handleBlur(type = 'sym0') {
      
    },
    handleGetCoinImg(type = 'sym0') {
      const market = this.thisMarket;
      if (type === 'sym0') {
        return `https://ndi.340wan.com/eos/${market.contract0}-${market.symbol0.toLowerCase()}.png`
      }
      return `https://ndi.340wan.com/eos/${market.contract1}-${market.symbol1.toLowerCase()}.png`
    }
  },
}
</script>

<style lang="scss" scoped>
.tabView{
  background: #FFF;
  font-size: 24px;
  text-align: left;
  position: relative;
  .direction{
    font-size: 28px;
    height: 84px;
    box-sizing: border-box;
    box-shadow: 0 0 1px 1px #F3F3F3;
    // border: 1px solid #F3F3F3;
    border-radius: 30px;
    margin-bottom: 32px;

    &>span{
      height: 100%;
      flex: 1;
      border: 1px solid transparent;
      border-radius: 30px;
      font-weight: 500;
    }

    .act{
      border: 1px solid #07D79B;
      color: #07D79B;
    }
    .actBack{
      border: 1px solid #C05D5D;
      color: #C05D5D;
    }
  }

  .marketData{
    border-radius:30px;
    border: 1px solid rgba(224,224,224,1);
    background: #FFF;
    border-radius: 25px;
    position: relative;
    padding: 32px 20px;
  }
  .sym0Data{
    padding: 26px 40px 52px;
    border-radius:30px;
    border: 1px solid #F3F3F3;
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
        flex: 1;
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
        flex: 2;;
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
  }
  .exchange{
    height: 20px;
    position: relative;
    .border{
      width: 100px;
      height: 100px;
      border-radius: 50px;
      // border: 1px solid #07D79B;
      position: absolute;
      background: $color-bgcolor;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-image: url('../../assets/img/dex/enter_solid_default.svg');
      background-repeat: no-repeat;
      background-size: cover;
      &.payFocus{
        background-image: url('../../assets/img/dex/enter_solid_up.svg');
        background-repeat: no-repeat;
        background-size: cover;
      }
      &.getFocus{
        background-image: url('../../assets/img/dex/enter_solid_down.svg');
        background-repeat: no-repeat;
        background-size: cover;
      }
      .iconImg{
        width: 72px;
      }
    }
  }
  .rate{
    color: $color-black;
    padding: 0 20px;
    margin-top: 28px;
    font-size: 28px;
    .iconImg{
      width: 36px;
      margin-left: 12px;
    }
  }
  .marketChecked{
    margin: 20px 0;
    padding: 20px 40px;
    border-radius:30px;
    border:2px solid rgba(243,243,243,1);
    .symbols{
      font-size:36px;
      font-weight: 500;
    }
    .contracts{
      margin-top: 6px;
      font-size: 24px;
      font-weight: 300;
    }
    .more{
      font-weight: bold;
      font-size: 32px;
    }
  }
  .backData{
    padding: 42px 36px 28px;
    border-radius:30px;
    border: 1px solid rgba(243,243,243,1);
    &.focus{
      border: 1px solid rgba(192,93,93,1);
    }
    .token{
      font-size: 24px;
      margin-bottom: 32px;
    }
    .inputDiv{
      flex: 2;
      .elIpt{
        /deep/ .el-input__inner{
          color: $color-black;
          border: 0px;text-align: right;
          font-size: 52px;
          padding: 0 20px 0 0px;
          height: 62px;
          text-align: left;
        }
      }
    }
  }
  .backNum{
    font-size: 28px;
    margin: 28px 20px 0;
    align-items: center;
    .tip{
      margin-right: 20px;
    }
  }

  .liquidity{
    margin-top: 40px;
    padding: 20px 40px 0;
    font-size: 28px;
    text-align: left;
    border-radius:20px;
    background: #FFF;
    border: 1px solid rgba(224,224,224,1);
    .subTitle{
      color:rgba(166,166,166,1);
      line-height:34px;
    }
    .num{
      margin: 10px 0 20px;
    }
  }

  .btnDiv{
    margin-top: 40px;
    .btn{
      height:88px;
      background:rgba(7,215,155,1);
      border-radius:30px;
      font-size:32px;
      color: #FFF;

      &.backBtn{
        background:rgba(192,93,93,1);
      }
    }
  }
}
</style>
