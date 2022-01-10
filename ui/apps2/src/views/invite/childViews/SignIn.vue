<template>
  <div class="signIn">
    <div class="title flexb">
      <span class="back flexa" @click="$router.back()">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/back.png" alt="">
      </span>
      <span>{{ $t('invite.signReward') }}</span>
      <span class="back"></span>
    </div>

    <div class="banner">
      <div class="signNum flexc">
        <span>{{ $t('invite.has1') }}</span>
        <span class="bgNum dinBold flexc">{{ thousand }}</span>
        <span class="bgNum dinBold flexc">{{ hundred }}</span>
        <span class="bgNum dinBold flexc">{{ ten }}</span>
        <span class="bgNum dinBold flexc">{{ one }}</span>
        <span>{{ $t('invite.has2') }}</span>
      </div>
      <div class="signTip flexc">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/rewardIcon.png">
        <div>{{ $t('invite.subTip') }}</div>
      </div>
    </div>

    <SignMain :rewardInfo="rewardInfo"/>
    <Lists :rewardInfo="rewardInfo" :allLists="allLists"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SignMain from '../signIn/SignMain';
import Lists from '../signIn/Lists';
import { getCoin, getMarketTimeLp, toLocalTime } from '@/utils/public';
export default {
  name: 'signIn',
  components: {
    SignMain,
    Lists,
  },
  data() {
    return {
      thousand: '0',
      hundred: '0',
      ten: '0',
      one: '0',
      rewardInfo: {},
      allLists: [],
      isSignNum: 0,
      dName: '',
    }
  },
  created() {
    this.dName = this.$route.params.name;
  },
  mounted() {
    this.handleGetLists()
    this.handleGetSubFarms();
  },
  computed: {
    ...mapState({
      account: (state) => state.app.account,
    }),
  },
  watch: {
    isSignNum: {
      handler: function at(newVal) {
        let n = newVal + '';
        let nArr = n.split('').reverse();
        nArr.forEach((v, i) => {
          if (i === 0) {
            this.one = v;
          } else if (i === 1) {
            this.ten = v;
          } else if (i === 2) {
            this.hundred = v;
          } else if (i === 3) {
            this.thousand = v;
          }
        })
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    async handleGetLists() {
      const name = this.dName;
      if (!name) {
        return
      }
      const params = {
        code: "farms.tag",
        scope: ` ${name}`,
        table: "rewards",
        json: true,
      };
      const {status, result} = await this.$api.get_table_rows(params);
      this.loading = false;
      if (!status) {
        return
      }
      let rows = result.rows || [];
      rows.sort((a, b) => {
        return b.weight - a.weight
      })
      rows.forEach((v, i) => {
        if (i === 0) {
          this.$set(v, 'isDefault', true)
          this.maxWeight = v.weight;
        } else {
          this.$set(v, 'isDefault', false)
        }
        const sym = v.balance.split(' ');
        this.$set(v, 'symbol', sym[1])
        this.$set(v, 'bal', sym[0])
        const decimal = sym[0].split('.')[1].length;
        this.$set(v, 'decimal', decimal)
        const coinImg = getCoin(v.cnt, v.symbol)
        this.$set(v, 'coinImg', coinImg)
      });
      this.rewardInfo = rows[0];
    },
    // 获取全部农场成员列表
    async handleGetSubFarms() {
      this.allLists = [];
      const dName = this.$route.params.name;
      let more = true;
      let next_key = '';
      this.isSignNum = 0;
      while(more) {
        const params = {
          json: true,
          limit: 100,
          code: "farms.tag",
          scope: ` ${dName}`,
          table: "members",
          upper_bound: next_key,
          index_position: 2,
          key_type: "i64",
          reverse: true
        };
        const { status, result } = await this.$api.get_table_rows(params);
        if (!status) {
          this.more = false;
          continue;
        }
        more = result.more;
        if (result.next_key === '0') {
          more = false;
        }
        next_key = result.next_key;
        const rows = result.rows || [];
        rows.forEach((v) => {
          const time = toLocalTime(`${v.update_time}.000+0000`)
          const times = getMarketTimeLp(time)
          // 刚加入
          if (v.update_time === v.join_time) {
            this.$set(v, 'joinNow', true)
          }
          // 已签到
          if (times.total < 3600 * 23 * 1000) {
            this.$set(v, 'isSigned', true)
            if (v.update_time !== v.join_time) {
              this.isSignNum += 1;
            }
          }
          // 可签到
          if (times.total > 3600 * 23 * 1000) {
            this.$set(v, 'abledSign', true)
          }
          // 可代签
          if (times.total > 3600 * 27 * 1000) {
            this.$set(v, 'abledSignForOther', true)
          }
        })
        this.allLists.push(...rows)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.signIn{
  padding-bottom: 80px;
  .title{
    font-size: 36px;
    height: 80px;
    padding: 0 28px;
    .back{
      width: 50px;
      height: 50px;
      img{
        display: block;
        width: 18px;
      }
    }
  }
  .banner{
    background: #FFAC00;
    height: 592px;
    padding: 88px 0 0;
    color: #FFF;
    font-size: 36px;
    box-sizing: border-box;
    .signNum{
      margin-bottom: 60px;
    }
    .bgNum{
      font-size: 65px;
      color: #FFAB00;
      background: #FFF;
      border-radius: 12px;
      box-shadow: 0px 4px 8px 0px rgba(230,154,16,1);
      width: 80px;
      height: 110px;
      margin: 0 14px;
    }
    .signTip{
      font-size: 32px;
      color: #FFF;
      background: rgba(255, 255, 255, 0.3);
      padding: 18px 48px;
      width: 640px;
      box-sizing: border-box;
      margin: auto;
      border-radius: 90px;
      img{
        width: 60px;
        margin-right: 20px;
      }
    }
  }
}
</style>