<template>
  <div class="dsrList">
    <div class="list flexb">
      <div>
        <div class="flexa header">
          <!-- <div>币种</div> -->
          <div>我的存款(DFS)</div>
          <div>存款占比</div>
          <div></div>
        </div>
        <div class="flexb content">
          <!-- <div class="flexa">
            <img class="coinImg" src="https://ndi.340wan.com/eos/minedfstoken-dfs.png" />
            <span>DFS</span>
          </div> -->
          <div>
            0.0000
          </div>
          <div>
            0.00%
          </div>
          <!-- <div class="flexa tools">
            <div class="btn flexc">存款</div>
            <div class="btn backBtn flexc">取回</div>
          </div> -->
        </div>
      </div>
      <div class="flexb tools">
        <div class="flexa">
          <div class="btn flexc">存款</div>
          <div class="btn backBtn flexc">取回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'dsrList',
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      // baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      weightList: state => state.sys.weightList, // 交易对权重列表
      aprs: state => state.sys.aprs,
      damping: state => state.sys.damping,
      scatter: state => state.app.scatter,
      dfsPrice: state => state.sys.dfsPrice,
    }),
  },
}
</script>

<style lang="scss" scoped>
.dsrList{
  font-size: 28px;
  margin: 40px;
  .list{
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0px 20px 40px 0px rgba(220,220,220,0.5);
    .header,.content{
      margin-bottom: 10px;
      text-align: left;
      &>div{
        // flex: 2;
        &:first-child{
          min-width: 200px;
        }
        &:nth-child(2){
          min-width: 120px;
          margin: 0 20px;
        }
        &:nth-child(3){
          flex: 1;
          text-align: right;
        }
      }
    }
    .content{
      margin-bottom: 0;
    }
    .tools{
      justify-content: flex-end;
      .btn{
        font-size: 24px;
        background:rgba(7,215,155,1);
        border-radius: 30px;
        color: #fff;
        padding: 14px 25px;
        &:active{
          background:rgba(2,198,152,1);
        }
        &.backBtn{
          background:rgba(192,93,93,1);
          margin-left: 15px;
          &:active{
            background:rgba(185,78,90,1);
          }
        }
      }
    }
  }
  .coinImg{
    width: 60px;
    margin-right: 5px;
  }
}
</style>
