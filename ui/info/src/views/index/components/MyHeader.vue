<template>
  <div class="header">
    <!-- <div class="emDiv"></div> -->
    <div class="flexb">
      <img class="logo" src="@/assets/img/dex/logo.svg" alt="">
      <div class="total" :class="{'minSTotal': minScreen}">
        <span>Combined Liquidity: $269.23M </span>
        <span> Combined Vol: $156.20M</span>
      </div>
    </div>
    <div class="search" v-if="false">
      <el-select v-model="search" filterable placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'myHeader',
  data() {
    return {
      search: '',
      options: [{
        value: 'EOS',
        label: 'EOS'
      }, {
        value: 'USDD',
        label: 'USDD'
      }, {
        value: 'USDT',
        label: 'USDT'
      }]
    }
  },
  computed:{
    ...mapState({
      // 箭头函数可使代码更简练
      language: state => state.app.language,
      minScreen: state => state.app.minScreen,
    })
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.header{
  color: #000;
  padding: 20px 40px;
  box-sizing: border-box;
  font-size: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  position: relative;
  .emDiv{
    height: 57px;
  }
  .fixed{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    padding: 20px 40px;
    box-sizing: border-box;
    background: #FFF;
    z-index: 10;
  }
  .logo{
    width: 150px;
  }
  .search{
    max-width: 1240px;
    margin: 20px auto;

    .el-select{
      width: 100%;
    }
  }

  .minSTotal{
    text-align: right;
    &>span{
      display: block;
    }
  }
}
</style>