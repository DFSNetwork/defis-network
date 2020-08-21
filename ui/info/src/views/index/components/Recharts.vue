<template>
  <div class="chartDiv" :class="{'minScChartDiv': minScreen}">
    <div class="flexb minW" v-if="!minScreen">
      <!-- 折线图 -->
      <div class="chart" id="main"></div>
      <div class="chart" id="secendChart"></div>
    </div>
    <div v-else>
      <div class="check flexb">
        <span class="name">
          <span class="tip" :class="{'checked': checked === 1}" @click="handleChecked(1)">Liq</span>
          <span class="tip" :class="{'checked': checked === 2}" @click="handleChecked(2)">Vol</span>
        </span>
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
      <div class="chart" v-show="checked === 1" id="main"></div>
      <div class="chart" v-show="checked === 2" id="secendChart"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import echarts from 'echarts';
export default {
  data() {
    return {
      chart: null,
      chartSecend: null,
      checked: 2,
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
    }
  },
  computed:{
    ...mapState({
      minScreen: state => state.app.minScreen,
    })
  },
  mounted() {
    this.handleSetChartFirst()
    this.handleSetChartSecend()
    this.test()
  },
  methods: {
    test() {
      const arr = [
        {
          x: 100,
          y: 216
        },
        {
          x: 105,
          y: 216
        },
        {
          x: 1000,
          y: 216
        },
        {
          x: 1004,
          y: 216
        },
        {
          x: 100,
          y: 217
        },
        {
          x: 101,
          y: 217
        },
        {
          x: 110,
          y: 446
        },
        {
          x: 111,
          y: 446
        },
        {
          x: 100,
          y: 448
        },
        {
          x: 100,
          y: 449
        },
      ]
      // const newArr = [];
      // arr.forEach((v, index) => {
      //   if (v.deal) return
      //   newArr.push(v)
      //   for(let i = index + 1; i < arr.length; i++) {
      //     const bJ = arr[i]
      //     if (Math.abs(v.y - bJ.y) < 50 && Math.abs(v.x - bJ.x) < 50) {
      //       arr[i].deal = true;
      //     }
      //   }
      // })
      const newArr = this.test1([], arr)
      console.log(newArr)
    },
    test1(newArr = [], arr = []) {
      // console.log(newArr, arr)
      if (!arr.length) {
        return newArr
      }
      const v = arr[0];
      newArr.push(v);
      v.deal = true;
      for(let i = 1; i < arr.length; i++) {
        const bJ = arr[i]
        if (Math.abs(v.y - bJ.y) < 50 && Math.abs(v.x - bJ.x) < 50) {
          arr[i].deal = true;
        }
      }
      const unDealArr = arr.filter(v => !v.deal)
      // console.log(arr)
      // console.log(unDealArr)
      return this.test1(newArr, unDealArr);
    },
    handleChecked(num) {
      this.checked = num;
      if (num === 1) {
        setTimeout(() => {
          this.handleSetChartFirst()
        }, 200);
        this.$forceUpdate()
        return
      }
      setTimeout(() => {
        this.handleSetChartSecend()
      }, 200);
    },
    handleSetChartFirst() {
      if (this.chart) {
        this.chart.dispose()
      }
      const options = {
        title: {
          text: 'Liq',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          top: '15%',
          left: '0%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['08.11', '08.12', '08.13', '08.14', '08.15', '08.16'],
        },
        yAxis: {
          splitLine: {
            // show: false,
            lineStyle: {
              color: 'rgba(240, 240, 240, .4)'
            }
          },
          axisLabel: {
            formatter: '{value}K'
          },
        },
        series: [{
            name: 'AMT',
            type: 'line',
            sampling: 'average',
            data: [50, 60, 80, 470, 370, 200],
            itemStyle: {
              color: '#07d79b'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#07d79b'
              }, {
                offset: 1,
                color: 'rgba(7, 215, 155, .3)'
              }])
            },
        }]
      }
      if (this.minScreen) {
        delete options.title
      }
      this.chart = echarts.init(document.getElementById('main'));
      // 绘制图表
      this.chart.setOption(options);
    },
    handleSetChartSecend() {
      if (this.chartSecend) {
        this.chartSecend.dispose()
      }
      const options = {
        title: {
          text: 'Vol',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          top: '15%',
          left: '0%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {},
        xAxis: {
          data: ['EOS', 'DFS', 'USDT', 'USDD', 'KEY', 'TPT']
        },
        yAxis: {
          splitLine: {
            // show: false,
            lineStyle: {
              color: 'rgba(240, 240, 240, .4)'
            }
          },
          axisLabel: {
            formatter: '{value}K'
          },
        },
        series: [{
          name: 'Vol',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20],
          itemStyle: {
              color: '#07d79b'
          },
        }]
      }
      if (this.minScreen) {
        delete options.title
      }
      this.chartSecend = echarts.init(document.getElementById('secendChart'));
      this.chartSecend.setOption(options);
    }
  }
}
</script>

<style lang="scss" scoped>
.chartDiv{
  padding: 20px 0;
  background: #07d79b;
  &.minScChartDiv{
    margin: 0 40px;
    padding: 0;
    overflow: hidden;
    border-radius: 20px;
    position: relative;
    .chart{
      height: 500px;
      margin-right: 0;
    }
    .check{
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 1;
      font-size: 34px;
      font-weight: bold;
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
      .name>span{
        margin-right: 20px;
      }
      .checked{
        color: #000;
      }
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
          border: 1px solid transparent;
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
  }
  .minW{
    max-width: 1240px;
    margin:  auto;
  }
  .chart{
    flex: 1;
    height: 300px;
    margin-right: 10px;
    border-radius: 10px;
    // border: 1px solid #e3e3e3;
    padding: 20px;
    background: rgba(255, 255, 255, .4);
    &:last-child{
      margin-right: 0px;
    }
  }
}
</style>
