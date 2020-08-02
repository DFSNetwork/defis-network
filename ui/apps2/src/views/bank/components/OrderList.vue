<template>
  <div>
    <div class="title">
      <span class="act">{{ $t('bank.record') }}</span>
    </div>
    <div class="lists">
      <div class="noData" v-if="!tableData.length">{{ $t('public.noData') }}</div>
      <div class="list" v-for="(item, index) in tableData" :key="index">
        <div class="time flexb">
          <span>{{ item.ctime }}</span>
          <span class="redeem">{{ $t('bank.redeem') }}</span>
        </div>
        <div class="numData flexb">
          <div class="left">
            <div class="num">{{ item.pledge }}</div>
            <div>
              <span>{{ $t('bank.stakeNum') }}</span>
              <!-- <span>抵押物挖矿</span> -->
            </div>
          </div>
          <div class="right">
            <div class="num">{{ item.issue }}</div>
            <div>{{ $t('bank.borrowNum') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EosModel } from '@/utils/eos';
import { toLocalTime } from '@/utils/public';
import { mapState } from 'vuex';
import moment from 'moment';
export default {
  data() {
    return {
      tableData: [],
      timer: null,
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
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleRowsMint()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    // 生成列表
    handleRowsMint() {
      clearTimeout(this.timer)
      const params = {
        code: this.baseConfig.toAccountJin,
        scope: this.baseConfig.toAccountJin,
        table: 'debts',
        limit: 1000,
        lower_bound: this.scatter.identity.accounts[0].name,
        upper_bound: this.scatter.identity.accounts[0].name,
        key_type: 'i64',
        index_position: 2,
        table_key: 'byname',
        json: true
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || [];
        const list = rows.filter(v => v.owner === this.scatter.identity.accounts[0].name)
        list.forEach((v) => {
          v.ctime = toLocalTime(`${v.create_time}.000+0000`);
          v.staked = !!Number(v.rex_received.split(' ')[0]);
          v.ableRedeemDate = toLocalTime(`${v.rex_maturity}.000+0000`);
          const redeemTime = moment(v.ableRedeemDate).valueOf(); // 解锁时间
          const nowTime = moment().valueOf(); // 当前时间
          v.ableRedeem = redeemTime <= nowTime;
        });
        this.tableData = list.reverse();
        this.timer = setTimeout(() => {
          this.handleRowsMint();
        }, 20000);
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.title{
  font-size: 32px;
  text-align: left;
  margin: 0 0 40px;
  &>span{
    margin-right: 60px;;
  }
  .act{
    color: $color-black;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      width:60px;
      height:8px;
      background:rgba(2,198,152,1);
      border-radius:4px;
      bottom: -20px;
      left: 50%;
      transform: translateX(-45%);
    }
  }
}
.lists{
  .noData{
    margin-top: 100px;
    color: #A6A6A6;
    font-size: 24px;
  }
  .list{
    margin-bottom: 20px;
    padding: 32px 28px;
    color: #111;
    font-size: 28px;
    background:rgba(255,255,255,1);
    border-radius:20px;
    border:2px solid rgba(224,224,224,1);
    .time{
      margin-bottom: 16px;
      .redeem{
        color: #42B48F;
      }
    }
    .numData{
      text-align: left;
      .num{
        font-size: 32px;
        font-weight: 500;
        margin-bottom: 8px;
      }
      .right{
        text-align: right;
      }
    }
  }
}
</style>