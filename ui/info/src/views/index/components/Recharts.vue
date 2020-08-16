<template>
  <div class="chartDiv">
    <div class="flexb minW">
      <!-- 折线图 -->
      <div class="chart" id="main"></div>
      <div class="chart" id="secendChart"></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
export default {
  data() {
    return {
      chart: null,
      chartSecend: null,
    }
  },
  mounted() {
    this.handleSetShartSecend()
    this.chart = echarts.init(document.getElementById('main'));
    // 绘制图表
    this.chart.setOption({
        title: {
          text: 'Liq',
          left: 'center',
        },
        tooltip: {},
        xAxis: {
            data: ['08.11', '08.12', '08.13', '08.14', '08.15', '08.16']
        },
        yAxis: {},
        series: [{
            name: 'AMT',
            type: 'line',
            sampling: 'average',
            data: [50000, 60000, 80000, 470000, 370000, 200000],
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
    });
  },
  methods: {
    handleSetShartSecend() {
      this.chartSecend = echarts.init(document.getElementById('secendChart'));
      this.chartSecend.setOption({
        title: {
          text: 'Vol',
          left: 'center',
        },
        tooltip: {},
        xAxis: {
            data: ['EOS', 'DFS', 'USDT', 'USDD', 'KEY', 'TPT']
        },
        yAxis: {},
        series: [{
            name: 'Vol',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20],
            itemStyle: {
                color: '#07d79b'
            },
        }]
    });
    }
  }
}
</script>

<style lang="scss" scoped>
.chartDiv{
  padding: 20px 0;
  background: #07d79b;
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
