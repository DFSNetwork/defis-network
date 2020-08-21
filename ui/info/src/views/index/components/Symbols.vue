<template>
  <div class="symbols" :class="{'minScSymbols': minScreen}">
    <div class="minW" v-if="!minScreen">
      <div class="title flexb">
        <span>Pairs</span>
        <span>
          <el-select class="select" v-model="value" placeholder="请选择"
            :popper-class="'mySelectItem'"
            :popper-append-to-body="false">
            <el-option
              v-for="item in cities"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span>{{ item.label }}</span>
            </el-option>
          </el-select>
        </span>
      </div>
      <div class="tables">
        <div class="listHeard flexb">
          <span>Name</span>
          <span>Liquidity </span>
          <span>Volume</span>
          <span>Volume</span>
          <span>Fees</span>
          <span></span>
        </div>
        <div class="list flexb">
          <span>EOS-DFS</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>
            <span class="add">Add Liquidity</span>
            <span class="trade">Trade</span>
          </span>
        </div>
        <div class="list flexb">
          <span>EOS-DFS</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>
            <span class="add">Add Liquidity</span>
            <span class="trade">Trade</span>
          </span>
        </div>
        <div class="list flexb">
          <span>EOS-DFS</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>
            <span class="add">Add Liquidity</span>
            <span class="trade">Trade</span>
          </span>
        </div>
        <div class="list flexb">
          <span>EOS-DFS</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>
            <span class="add">Add Liquidity</span>
            <span class="trade">Trade</span>
          </span>
        </div>
        <div class="list flexb">
          <span>EOS-DFS</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>
            <span class="add">Add Liquidity</span>
            <span class="trade">Trade</span>
          </span>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="title flexb">
        <span class="act">Pairs</span>
        <span>
          <el-select class="select" v-model="value" placeholder="请选择"
            :popper-class="'mySelectItem'"
            :popper-append-to-body="false">
            <el-option
              v-for="item in cities"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span>{{ item.label }}</span>
            </el-option>
          </el-select>
        </span>
      </div>
      <div class="tables">
        <el-table
          :row-class-name="'list'"
          :data="tableData">
          <el-table-column
            fixed
            width="70rem"
            prop="name"
            label="Name">
          </el-table-column>
          <el-table-column
            width="60rem"
            prop="liq"
            label="Liquidity">
            <template slot-scope="scope">
              <span>{{ handleShowNum(scope.row.liq) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="60rem"
            prop="vol"
            label="Volume">
            <template slot-scope="scope">
              <span>{{ handleShowNum(scope.row.vol) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="60rem"
            prop="fees"
            label="Fees">
            <template slot-scope="scope">
              <span>{{ handleShowNum(scope.row.fees) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="60rem"
            prop="apr"
            label="APR">
          </el-table-column>
          <!-- <el-table-column
            prop="zip"
            label="">
          </el-table-column> -->
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {accDiv, toFixed} from '@/utils/public'
export default {
  data() {
    return {
      cities: [
        {
          value: '1',
          label: '最近24H'
        }, {
          value: '2',
          label: '最近3天'
        }, {
          value: '3',
          label: '最近7天'
        }
      ],
      value: '1',
      tableData: [
        {
          name: 'EOS-DFS',
          liq: '100000',
          vol: '5000',
          fees: '15000',
          apr: '700%',
        }, {
          name: 'EOS-OGX',
          liq: '100000000',
          vol: '5000',
          fees: '15000',
          apr: '700%',
        }, {
          name: 'EOS-KEY',
          liq: '100000',
          vol: '50000000',
          fees: '15000',
          apr: '700%',
        }, {
          name: 'EOS-TPT',
          liq: '1000',
          vol: '500',
          fees: '15000',
          apr: '700%',
        }, {
          name: 'EOS-DFS',
          liq: '100000',
          vol: '500000',
          fees: '15000',
          apr: '700%',
        }, {
          name: 'EOS-DFS',
          liq: '100000',
          vol: '500000',
          fees: '15000',
          apr: '700%',
        }, {
          name: 'EOS-DFS',
          liq: '100000',
          vol: '500000',
          fees: '15000',
          apr: '700%',
        }
      ]
    }
  },
  computed:{
    ...mapState({
      minScreen: state => state.app.minScreen,
    })
  },
  methods: {
    handleShowNum(num) {
      if (!Number(num)) {
        return 0
      }
      if (Number(num) >= 1000000) {
        let rNum = accDiv(num, 1000000);
        rNum = toFixed(rNum, 1)
        return `${rNum}M`
      }
      if (Number(num) >= 1000) {
        let rNum = accDiv(num, 1000);
        rNum = toFixed(rNum, 1)
        return `${rNum}K`
      }
      return num
    }
  }
}
</script>

<style lang="scss" scoped>
.symbols{
  margin: 20px 0;
  text-align: left;
  .minW{
    max-width: 1240px;
    margin: auto;
  }

  .title{
    font-size: 26px;
    font-weight: bold;
    .select{
      text-align: center;
    }
    /deep/ .el-select{
      .is-focus{
        .el-input__inner{
          border-color: #07d79b;
        }
      }
      .el-input__suffix-inner{
        display: flex;
        align-items: center;
      }
      .el-input__inner{
        font-size: 16px;
        text-align: center;
        width: 160px;
        &:focus{
          border-color: #07d79b;
        }
      }
    }
    /deep/ .mySelectItem{
      .el-scrollbar{
        .el-select-dropdown__item{
          // height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: normal;
          &.selected{
            font-weight: bold;
            color: #07d79b;
          }
        }
      }
    }
  }
  .tables{
    font-size: 16px;
    box-shadow: 0 0 5px 1px rgba(200, 200, 200, .3);
    padding: 0px 20px;
    border-radius: 10px;
    margin-top: 10px;
    .listHeard, /deep/ .list{
      height: 50px;
      &>span{
        flex: 1;
      }
    }
    /deep/ .list{
      color: #000;
      height: 60px;
      border-top: 1px solid #eee;;
      .trade{
        padding: 4px 15px;
        border-radius: 20px;
        background: #07d79b;
        color: #FFF;
        margin-left: 10px;
      }
      .add{
        color: #07d79b;
      }
    }
  }

  &.minScSymbols{
    margin: 40px;
    .title{
      font-size: 32px;
      /deep/ .el-select{
        .is-focus{
          .el-input__inner{
            border-color: #07d79b;
          }
        }
        .el-input__inner{
          font-size: 24px;
          line-height: 26px;
          text-align: center;
          height: 50px;
          width: 160px;
          &:focus{
            border-color: #07d79b;
          }
        }
      }
      /deep/ .mySelectItem{
        .el-scrollbar{
          .el-select-dropdown__item{
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: normal;
            &.selected{
              font-weight: bold;
              color: #07d79b;
            }
          }
        }
      }
    }
    /deep/ .el-table__header .is-leaf{
      color: #000;
      font-weight: normal;
      height: 50px;
      &>span{
        flex: 1;
      }
    }
    /deep/ .volCss{
      width: 280px;
      min-width: 280px;
      max-width: 280px;
    }
  }
}
</style>
