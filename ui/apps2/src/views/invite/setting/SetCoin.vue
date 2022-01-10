<template>
  <div class="setCoin">
    <div class="title flexb">
      <span class="back flexa" @click="$router.back()">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/back.png" />
      </span>
      <span>{{ $t('invite.coinSet') }}</span>
      <span class="back"></span>
    </div>
    <div class="lists">
      <div class="noData_p" v-if="!lists.length && !this.loading">{{ $t('public.noData') }}</div>
      <div class="list" v-for="(v, i) in lists" :key="i">
        <div class="flexb">
          <div>
            <div class="flexa">
              <img class="coinImg" :src="v.coinImg || $errorImg" :onerror="$errorImg"/>
              <span class="coinName">{{ v.symbol }}</span>
            </div>
            <div class="dinBold num">{{ v.bal }}</div>
          </div>
          <van-switch
            class="switch"
            :value="v.isDefault"
            fon
            active-color="#29D4B0"
            @input="handleCheckSwitch(v)"
          />
        </div>
        <div class="flexb btnDiv">
          <div class="btn flexc" @click="handleShowDeposit(v)">
            <img src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/deposit.png" />
            <span>{{ $t('invite.deposit') }}</span>
          </div>
          <div class="btn flexc" @click="handleEdit(v)">
            <img src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/edit.png" />
            <span>{{ $t('invite.edit') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="nullDiv"></div>
    <div class="addBtn flexc" @click="handleTo('addSignCoin')">{{ $t('invite.addCoin') }}</div>

    <van-popup class="popup_p" v-model="showDeposit">
      <Deposit v-if="showDeposit" @listenClose="handleClose" :info="info"/>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { DApp } from '@/utils/wallet';
import Deposit from "./Deposit";
import { getCoin } from '@/utils/public';

export default {
  name: "setCoin",
  components: {
    Deposit,
  },
  data() {
    return {
      rSwitch: false,
      showDeposit: false,
      lists: [],
      loading: true,
      maxWeight: 0,
      info: {},
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.app.account,
    }),
  },
  watch: {
    account: {
      handler: function at(newVal) {
        if (!newVal.name) {
          return
        }
        this.handleGetLists()
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    handleShowDeposit(v) {
      this.info = v;
      this.showDeposit = true;
    },
    handleEdit(v) {
      this.$router.push({
        name: 'setSignCoin',
        params: {
          coin: v.symbol
        }
      })
    },
    async handleGetLists() {
      const name = this.account.name;
      if (!this.account.name) {
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
      this.lists = rows;
    },
    handleCheckSwitch(v) {
      if (v.isDefault) {
        this.$toast({
          type: 'fail',
          message: '至少选择一种代币作为奖励',
        })
        return
      }
      const name = this.account.name;
      const permission = this.account.permissions;
      const weight = this.maxWeight + 1;
      const params = {
        actions: [{
          account: 'farms.tag',
          name: 'setreward',
          authorization: [{
            actor: name, // 转账者
            permission,
          }],
          data: {
            farmer: name,
            cnt: v.cnt,
            limit: v.limit,
            reward: v.reward,
            weight,
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
        setTimeout(() => {
          this.handleGetLists()
        }, 2000);
      })
    },
    // 关闭弹窗
    handleClose(type) {
      this.showDeposit = false;
      if (type) {
        setTimeout(() => {
          this.handleGetLists()
        }, 2000);
      }
    },
    handleTo(name) {
      this.$router.push({
        name,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.setCoin {
  padding-bottom: 80px;
  font-size: 36px;
  .title {
    font-size: 36px;
    height: 80px;
    padding: 0 28px;
    .back {
      width: 50px;
      height: 50px;
      img {
        display: block;
        width: 18px;
      }
    }
  }
  .lists {
    margin: 30px;
    .list {
      border: 1px solid $color-border;
      border-radius: 12px;
      padding: 30px 24px 0;
      margin-bottom: 30px;
      .coinImg {
        width: 56px;
        height: 56px;
        border-radius: 30px;
        overflow: hidden;
        margin-right: 20px;
      }
      .name {
        font-size: 36px;
      }
      .num {
        font-size: 40px;
        margin-top: 8px;
        text-align: left;
      }
      .btnDiv {
        border-top: 1px solid #eaeaea;
        margin-top: 20px;
      }
      .btn {
        flex: 1;
        margin-right: 30px;
        height: 118px;
        font-size: 36px;
        &:last-child {
          position: relative;
          margin-right: 0;
          &::before {
            content: "";
            position: absolute;
            left: 0px;
            top: 50%;
            transform: translateY(-50%);
            height: 58px;
            width: 2px;
            background: #eaeaea;
          }
        }
        img {
          width: 48px;
          margin-right: 20px;
        }
      }
    }
  }
  .nullDiv {
    height: 96px;
  }
  .addBtn {
    background: $color-main;
    color: #fff;
    height: 96px;
    position: fixed;
    bottom: 60px;
    border-radius: 12px;
    width: 690px;
    margin: 0 30px;
  }
}
</style>
