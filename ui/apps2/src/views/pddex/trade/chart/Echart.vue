<template>
  <div>
    <div id="echart" class="echart"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
import Io from '@/utils/socket/index';
import {toLocalTime} from '@/utils/public'
import moment from 'moment';
export default {
  name: 'echartKLine',
  data() {
    return {
      myChart: null,
      wsData: [],
      data0: {},
      thisMarket: {
        decimal1: 4,
      }
    }
  },
  beforeDestroy() {
    Io.disconnect()
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById('echart'));
    const now = parseInt(moment().valueOf() / 1000)
    const params = {
      type: "kline",
      period: "minute5",
      symbol: "DFS-39",
      from: now - 5 * 2000,
      to: now,
    }
    console.log(params)
    Io.subscribe(params, (res) => {
      console.log(Array.isArray(res))
      const isArr = Array.isArray(res);
      // let list = res
      if (!isArr) {
        const index = this.wsData.findIndex(v => v[0] === res.id)
        if (index !== -1) {
          this.wsData[index] = [
            res.id, res.open, res.high, res.low, res.close
          ];
        } else {
          this.wsData.push([
            res.id, res.open, res.high, res.low, res.close
          ])
        }
        const tData = JSON.parse(JSON.stringify(this.wsData));
        this.data0 = this.handleSplitData(tData);
        this.handleSetOption()
        return
      }
      console.log(res)
      this.wsData = res;
      const tData = JSON.parse(JSON.stringify(res));
      this.data0 = this.handleSplitData(tData);
      this.handleSetOption()
    })
  },
  methods: {
    handleSplitData(rawData) {
      var categoryData = [];
      var values = [];
      for (var i = 0; i < rawData.length; i++) {
        //splice 返回每组数组中被删除的第一项，即返回数组中被删除的日期 
        //alert(rawData[i].splice(0, 1)[0]);
        //categoryData 日期 把返回的日期放到categoryData[]数组中
        const date = rawData[i].splice(0, 1)[0]
        categoryData.push(toLocalTime(date * 1000));
        //alert(categoryData);
        //数据数组，即数组中除日期外的数据
        // alert(rawData[i]);
        // 价格处理
        const newArr = [
          rawData[i][0] * (10 ** (this.thisMarket.decimal1 - 4)) / (10 ** 4),
          rawData[i][1] * (10 ** (this.thisMarket.decimal1 - 4)) / (10 ** 4),
          rawData[i][2] * (10 ** (this.thisMarket.decimal1 - 4)) / (10 ** 4),
          rawData[i][3] * (10 ** (this.thisMarket.decimal1 - 4)) / (10 ** 4),
        ]
        values.push(newArr)
      }
      console.log(categoryData, values)
      return {
        categoryData: categoryData, //数组中的日期 x轴对应的日期
        values: values //数组中的数据 y轴对应的数据
      };
    },
    //计算MA平均线，N日移动平均线=N日收盘价之和/N dayCount要计算的天数(5,10,20,30)
    calculateMA(dayCount) {
      var result = [];
      for (var i = 0, len = this.data0.values.length; i < len; i++) {
        if (i < dayCount) {
          result.push('-');
          //alert(result);
          continue; //结束单次循环，即不输出本次结果
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
          //收盘价总和
          sum += this.data0.values[i - j][1];
          //alert(sum);
        }
        result.push((sum / dayCount).toFixed(4));
        // alert(result);
      }
      return result;
    },
    handleSetOption() {
      const option = {
        title: { //标题
          text: '',
          left: 0
        },
        tooltip: { //提示框
          trigger: 'axis', //触发类型：坐标轴触发
          axisPointer: { //坐标轴指示器配置项
            type: 'cross' //指示器类型，十字准星
          }
        },
        legend: { //图例控件，点击图例控制哪些系列不现实
          // data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
          data: ['日K', 'MA5', 'MA10']
        },
        grid: { //直角坐标系
          show:true,
          top: '15%',
          left: '15%', //grid组件离容器左侧的距离
          right: '15%',
          bottom: '15%',
          // backgroundColor:'#ccc'
        },
        xAxis: {
          ype: 'category', //坐标轴类型，类目轴
          data: this.data0.categoryData,
          //scale: true, //只在数字轴中有效
          boundaryGap : false, //刻度作为分割线，标签和数据点会在两个刻度上
          axisLine: {onZero: false},
          // splitLine: {show: false}, //是否显示坐标轴轴线
          //splitNumber: 20, //坐标轴的分割段数，预估值，在类目轴中无效
          min: 'dataMin', //特殊值，数轴上的最小值作为最小刻度
          max: 'dataMax' //特殊值，数轴上的最大值作为最大刻度
        },
        yAxis: {
          scale: true, //坐标刻度不强制包含零刻度
          splitArea: {
            show: true //显示分割区域
          }
        },
        //用于区域缩放
        dataZoom: [{
          filterMode:'filter', //当前数据窗口外的数据被过滤掉来达到数据窗口缩放的效果 默认值filter
          type: 'inside', //内置型数据区域缩放组件
          start: 50, //数据窗口范围的起始百分比
          end: 100 //数据窗口范围的结束百分比
        }, {
          show: true,
          type: 'slider', //滑动条型数据区域缩放组件
          y: '90%',
          start: 50,
          end: 100
        }],
        //图表类型
        series: [{
          name: '日K',
          type: 'candlestick', //K线图
          data: this.data0.values, //y轴对应的数据
          markPoint: { //图表标注
            // label: { //标注的文本
            //   normal: { //默认不显示标注
            //     show:true,
            //     //position:['20%','30%'],
            //     formatter: function (param) { //标签内容控制器
            //       return param != null ? Math.round(param.value) : '';
            //     }
            //   }
            // },
            // data: [ //标注的数据数组
            //   {
            //     name: 'highest value',
            //     type: 'max', //最大值
            //     valueDim: 'highest' //在highest维度上的最大值 最高价
            //   }, {
            //     name: 'lowest value',
            //     type: 'min',
            //     valueDim: 'lowest' //最低价
            //   },
            // ],
            tooltip: { //提示框
              formatter: function (param) {
                return param.name + '<br>' + (param.data.coord || '');
              }
            }
          },
          // markLine: {
          //   symbol: ['none', 'none'], //标线两端的标记类型
          //   data: [
          //     [{
          //       name: 'from lowest to highest',
          //       type: 'min', //设置该标线为最小值的线
          //       valueDim: 'lowest', //指定在哪个维度上的最小值
          //       symbol: 'circle',
          //       symbolSize: 10, //起点标记的大小
          //       label: { //normal默认，emphasis高亮
          //         normal: {show: false}, //不显示标签
          //         emphasis: {show: false} //不显示标签
          //       }
          //     }, {
          //       type: 'max',
          //       valueDim: 'highest',
          //       symbol: 'circle',
          //       symbolSize: 10,
          //       label: {
          //         normal: {show: false},
          //         emphasis: {show: false}
          //       }
          //     }],
          //     {
          //       name: 'min line on close',
          //       type: 'min',
          //       valueDim: 'close'
          //     }, {
          //       name: 'max line on close',
          //       type: 'max',
          //       valueDim: 'close'
          //     }
          //   ]}
          },
          { //MA5 5天内的收盘价之和/5
            name: 'MA5',
            type: 'line',
            data: this.calculateMA(5),
            smooth: true,
            lineStyle: {
              normal: {opacity: 0.5}
            }
          },
          {
            name: 'MA10',
            type: 'line',
            data: this.calculateMA(10),
            smooth: true,
            lineStyle: { //标线的样式
              normal: {opacity: 0.5}
            }
          },
          // {
          //   name: 'MA20',
          //   type: 'line',
          //   data: this.calculateMA(20),
          //   smooth: true,
          //   lineStyle: {
          //     normal: {opacity: 0.5}
          //   }
          // },
          // {
          //   name: 'MA30',
          //   type: 'line',
          //   data: this.calculateMA(30),
          //   smooth: true,
          //   lineStyle: {
          //   normal: {opacity: 0.5}
          //   }
          // }
        ]
      };
      // console.log(JSON.stringify(option))
      // 使用刚指定的配置项和数据显示图表
      this.myChart.setOption(option);
    }
  },
}
</script>

<style lang="scss" scoped>
.echart{
  width: 750px;
  height: 750px;
}
</style>