<template>
  <div class="farms">
    <div class="title">{{ $t('invite.dfsFarms') }}</div>
    <div class="lists">
      <div class="li flexb" v-for="(v, i) in lists" :key="i" @click="handleTo('farmDetail', {name: v.owner || 'test'})">
        <div class="flexa">
          <div class="flexc bgImgDiv">
            <img class="bgImg" width="100%" :src="v.avatar">
          </div>
          <div>
            <div class="farmName">{{ v.farm_name }}</div>
            <div class="tip num">{{ v.slogon }}</div>
          </div>
        </div>
        <div class="btn flexc" @click.stop="handleAddFarm(v)"
          v-if="v.owner !== nJoinInfo.owner">{{ $t('invite.join') }}</div>
        <div class="btn flexc joined" @click.stop=""
          v-else>{{ $t('invite.joined') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { DApp } from '@/utils/wallet';
export default {
  name: 'farms',
  props: {
    lists: {
      type: Array,
      default: function ls() {
        return []
      }
    },
    joinInfo: {
      type: Object,
      default: function ls() {
        return {}
      }
    },
  },
  data() {
    return {
      nJoinInfo: {},
    }
  },
  watch: {
    joinInfo: {
      handler: function ji() {
        this.nJoinInfo = this.joinInfo;
      },
      deep: true,
      immediate: true,
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.app.account,
    }),
  },
  methods: {
    handleTo(name, params) {
      this.$router.push({
        name, params
      })
    },
    handleAddFarm(v) {
      if (this.nJoinInfo.owner) {
        this.$toast.fail(this.$t('invite.errTip1'))
        return
      }
      const name = this.account.name;
      const permission = this.account.permissions;
      const params = {
        actions: [{
          account: 'farms.tag',
          name: 'join',
          authorization: [{
            actor: name, // 转账者
            permission,
          }],
          data: {
            farmer: name,
            farm: v.owner,
          }
        }]
      }
      DApp.toTransaction(params, (err) => {
        if (err && err.code === 402) {
          return;
        }
        if (err) {
          this.$toast({
            type: 'fail',
            message: err.message,
          })
          return;
        }
        this.$toast({
          type: 'success',
          message: 'Success'
        })
        this.nJoinInfo = v
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.farms{
  color: #333;
  margin: 28px;
  text-align: left;
  font-size: 26px;
  .title{
    text-align: left;
    font-weight: 400;
    font-size: 36px;
    margin-bottom: 10px;
  }
  .lists{
    .li{
      border-bottom: 1px solid $color-border;
      padding: 20px 0;
      &:last-child{
        border-bottom: 0px solid $color-border;
      }
      .bgImgDiv{
        width: 100px;
        height: 100px;
        margin-right: 20px;
        border-radius: 4px;
      }
      .farmName{
        font-size: 30px;
      }
      .btn{
        background: $color-main;
        color: #FFF;
        width: 160px;
        height: 76px;
        border-radius: 4px;
        &.joined{
          color: $color-main;
          background: #FFF;
          border: 1px solid $color-main;
        }
      }
    }
  }
}
</style>
