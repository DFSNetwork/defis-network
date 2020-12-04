<template>
  <div class="updateInfo">
    <div class="title flexc">
      <span class="back flexa"></span>
      <span>{{ $t('bpInfo.edtInfo') }}</span>
      <span class="changeLang flexa">
        <van-popover
          v-model="showPopover"
          trigger="click"
          :actions="actions"
          @select="onSelect"
          placement="bottom"
        >
          <template #reference>
            <div @click.stop="showPopover = !showPopover">{{ $t('bpInfo.lang') }}</div>
          </template>
        </van-popover>
      </span>
    </div>

    <!-- tab 切换 -->
    <div class="tabDiv flexb">
      <span class="tab flexc" :class="{'act': act === 0}" @click="act = 0">{{ $t('bpInfo.baseInfo') }}</span>
      <span class="tab flexc" :class="{'act': act === 1}" @click="act = 1">{{ $t('bpInfo.qusAns') }}</span>
      <span class="tab null"></span>
    </div>

    <SetBaseInfo v-if="act === 0" />
    <SetQusAns v-else-if="act === 1" />
  </div>
</template>

<script>
import SetBaseInfo from './comp/SetBaseInfo'
import SetQusAns from './comp/SetQusAns'
export default {
  name: 'updateInfo',
  components: {
    SetBaseInfo,
    SetQusAns,
  },
  data() {
    return {
      showPopover: false,
      actions: [{
        text: '简体中文',
        lang: 'zh-CN',
      }, {
        text: 'English',
        lang: 'en',
      }],
      act: 0,
    }
  },
  methods: {
    onSelect(action) {
      console.log(action)
      const lang = action.lang;
      this.$i18n.locale = lang;
      this.$store.dispatch('setLanguage', lang);
    },
  }
}
</script>

<style lang="scss" scoped>
.updateInfo{
  color: #333;
  font-size: 32px;
  .title{
    font-size: 40px;
    font-weight: 500;
    position: relative;
    height: 90px;
    margin: 0 30px;

    .back{
      position: absolute;
      height: 90px;
      width: 90px;
      left: 0px;
      top: 0px;
    }
    .changeLang{
      height: 90px;
      position: absolute;
      right: 0px;
      top: 0px;
      font-size: 32px;
      font-weight: normal;
      color: #29D4B0;
      /deep/ .van-popove{
        display: block !important;
      }
    }
  }
  .tabDiv{
    padding: 20px 28px;
    .tab{
      width: 200px;
      background: rgba(#DCDCDC, .2);
      height: 76px;
      border-radius: 8px;
      &.null{
        background: transparent;
      }
      &.act{
        color: #29D4B0;
        background: rgba(#29D4B0, .2);
      }
    }
  }
}
</style>
