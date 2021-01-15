<template>
  <div class="flexc deepDiv">
    <!-- 折线图 -->
    <div class="chart" id="buy"></div>
    <div class="chart" id="sell"></div>
    <div class="price flexb">
      <div class="flexb">
        <span>{{ buyMinPrice }}</span>
        <span>{{ buyMaxPrice }}</span>
      </div>
      <div class="flexb">
        <span>{{ sellMinPrice }}</span>
        <span>{{ sellMaxPrice }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {runPrice} from '@/utils/deal.js'
import echarts from 'echarts';
export default {
  name: 'deep',
  props: {
    checkedMarket: {
      type: Object,
      default: function cmt(){
        return {}
      }
    },
    price: {
      type: String,
      default: '0',
    }
  },
  data() {
    return {
      arr: [],
      chartBuy: null,
      chartSell: null,
      buyMinPrice: '-',
      buyMaxPrice: '-',
      sellMinPrice: '-',
      sellMaxPrice: '-',
    }
  },
  watch: {
    price: {
      handler: function pr() {
        setTimeout(() => {
          this.handleRunPrice();
        }, 100);
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    handleRunPrice() {
      if (!Number(this.price)) {
        return
      }
      const arr = runPrice(this.checkedMarket, this.price, 0.005)
      // this.arr = arr.sellArr;
      const buy = [];
      const sell = [];
      arr.buyArr.forEach((v, i) => {
        if ( i % 9 === 0) {
          buy.push(v)
        }
        if (i === 0) {
          this.buyMaxPrice = v.price
        }
        if (i === arr.buyArr.length - 1) {
          this.buyMinPrice = v.price
        }
      })
      arr.sellArr.forEach((v, i) => {
        if ( i % 9 === 0) {
          sell.push(v)
        }
        if (i === 0) {
          this.sellMinPrice = v.price
        }
        if (i === arr.sellArr.length - 1) {
          this.sellMaxPrice = v.price
        }
      })
      this.handleSetChartFirst(buy.reverse(), 'buy')
      this.handleSetChartFirst(sell, 'sell')
    },
    handleSetChartFirst(arr, type = 'buy') {
      // const self = this;
      if (this.chartBuy && type === 'buy') {
        this.chartBuy.dispose()
      } else if (this.chartSell && type === 'sell') {
        this.chartSell.dispose()
      }
      const areaStyle = type === 'buy' ? {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: '#07d79b'
        }, {
          offset: 1,
          color: 'rgba(7, 215, 155, .3)'
        }])
      } : {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: '#f94b5f'
        }, {
          offset: 1,
          color: '#f9b1c0'
        }])
      }
      // const position = type === 'buy' ? 'left' : 'right';
      const showY = type === 'buy';
      const p = []
      const x = []
      const y = []
      arr.forEach(v => {
        p.push(v.price + '')
        x.push(v.x)
        y.push(v.y/1000)
        return
      })
      const options = {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) { // 格式化hove值
            const valuePrice = params[0].axisValue;
            try {
              const price = arr.find(v => v.price === valuePrice);
              const html = 'Price: ' + price.price + '<br />' +
                           'Val: ' + price.y + '<br />' +
                           'Tal: ' + price.x;
              return html;
            } catch (error) {
              console.log(error);
            }
          },
        },
        animation: false,
        grid: {
          top: '15%',
          left: '0%',
          right: '0%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: p,
          dataMax: 2,
          axisTick: { // 轴刻度
            show: false,
          },
          nameTextStyle: {
            align: "right"
          },
          axisLabel: { // 轴数字
            color: '#000',
            formatter: function (val) {
              return Number(val || 0)
            },
            showMinLabel: false,
            show: false,
          },
          axisLine: { // 轴线
            lineStyle: {
              color: '#000'
            }
          },
          splitLine: { // 网格
            show: false,
          },
        },
        yAxis: {
          show: showY,
          splitLine: {
            lineStyle: {
              color: 'rgba(240, 240, 240, .4)'
            }
          },
          axisLabel: {
            inside: true,
            showMinLabel: false,
            formatter: '{value}K'
          },
        },
        series: [{
          name: 'NDX',
          type: 'line',
          sampling: 'average',
          // data: [50, 60, 80, 470, 370, 200],
          data: y,
          itemStyle: {
            color:  type === 'buy' ? '#07d79b' : '#f94b5f'
          },
          areaStyle
        }]
      }
      const chart = echarts.init(document.getElementById(type));
      // 绘制图表
      chart.setOption(options);

      type === 'buy' ? this.chartBuy = chart : this.chartSell = chart;
    },
  }
}
</script>

<style lang="scss" scoped>
.deepDiv{
  align-items: flex-end;
  position: relative;
  margin: 0 20px;
}
.chart{
  flex: 1;
  height: 500px;
  // margin-right: 10px;
  border-radius: 10px;
  // border: 1px solid #e3e3e3;
  // padding: 20px;
  background: rgba(255, 255, 255, .4);
  &:last-child{
    margin-right: 0px;
    z-index: 1;
  }
}
.price{
  position: absolute;
  bottom: -20px;
  font-size: 24px;
  width: 100%;
  color: #000;
  &>div{
    flex: 1;
    padding-right: 10px;
    &:last-child{
      padding-right: 0px;
    }
  }
}
</style>
