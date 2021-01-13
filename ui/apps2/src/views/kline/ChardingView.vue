<template>
  <div class="kline">
    <div id="tv_chart_container"></div>
    <div class="hide"></div>
    <div class="hide2"></div>
  </div>
</template>

<script>
import Tv from './index'
export default {
  data () {
    return {
      lang: '',
      loading: false,
      theme: '',
      tradName: '', // 交易对 ABC/ECS
      ticker: '', //  请求标示ABC_ECS
      trad: null,
      interval: '240', // 分辨率，时间
    }
  },
  props: {
    forwhat: {
      type: String,
      default: 'kline', // kline、ram、rex
    },
    checkedMarket: {
      type: Object,
      default: function mls() {
        return {
          mid: 39,
          symbol0: 'EOS',
          symbol1: 'DFS',
          decimal0: 4,
          decimal1: 4,
        }
      }
    }
  },
  computed: {
  },
  watch: {
    '$store.state.app.language': function change(val) {
      this.lang = this.handleFormatLang(val);
      this.handleLoadTradingView();
    },
    checkedMarket: {
      handler: function cm(newVal, oldVal) {
        if (!newVal.mid) {
          return
        }
        if (oldVal && newVal.mid !== oldVal.mid) {
          this.handleLoadTradingView();
        }
      },
      deep: true,
      immediate: true,
    }
  },
  created() {
  },
  mounted() {
    if (!this.loading) {
      this.handleLoadTradingView();
    }
  },
  beforeDestroy () {
  },
  methods: {
    handleLoadTradingView() {
      if (!this.checkedMarket.mid) {
        return
      }
      let theme_str = 'white';
      let params = {
        interval: this.interval, // 分辨率（时间周期）
        wgconfig: this.handleGetThemeConfig(theme_str),
        self: this,
      };
      const cmt = this.checkedMarket;
      const name = `${cmt.symbol1}/${cmt.symbol0}`
      const inSymbol = `${this.checkedMarket.symbol1}-${this.checkedMarket.mid}`
      const diffDecimal = this.checkedMarket.decimal1 - this.checkedMarket.decimal0;

      params = Object.assign(params, {
        name: name, // k线显示的交易对
        ticker: 'contract', // 后台请求币种对
        pricescale: 10 ** 6, // 保留小数位位数
        market: this.checkedMarket,
        inSymbol,
        diffDecimal,
      });
      Tv.init(params, () => {
        this.loading = true;
        this.handleChartReady();
      });
    },

    handleGetThemeConfig(str) {
      const themeobj = {
        'black': {
          locale: this.lang, // 多语言
          custom_css_url: '/static/chart_library/static/theme/black.css',
          toolbar_bg: '#152247', // 工具栏背景色
          // 加载背景色, 加载条颜色
          loading_screen: { backgroundColor: "#152247", foregroundColor: '#fff' },
          overrides: {
						"paneProperties.background": "#152247", // 背景色
            "paneProperties.vertGridProperties.color": "RGBA(153, 153, 156, 0.06)", //横线
            "paneProperties.horzGridProperties.color": "RGBA(153, 153, 156, 0.06)", //竖线
            "scalesProperties.textColor" : "#AAA", // 字体颜色
          },
        },
        'white': {
          locale: this.lang, // 多语言
          custom_css_url: '/static/chart_library/static/theme/white.css',
          toolbar_bg: '#fff', // 工具栏背景色
          // 加载背景色, 加载条颜色
          loading_screen: { backgroundColor: "#fff", foregroundColor: 'RGBA(0, 148, 213, 1)' },
          overrides: {
						"paneProperties.background": "#ffffff",
            "paneProperties.vertGridProperties.color": "RGBA(153, 153, 156, 0.18)",
            "paneProperties.horzGridProperties.color": "RGBA(153, 153, 156, 0.18)",
            "scalesProperties.textColor" : "#333",
          },
          // .header-chart-panel-sizer
        }
      };
      const overrides = {
        // "mainSeriesProperties.candleStyle.upColor": "#14A670", // 涨、蜡烛图的颜色
        // "mainSeriesProperties.candleStyle.downColor": "#F83F3F", // 跌、蜡烛图的颜色
        "mainSeriesProperties.candleStyle.drawBorder": true, // 是否显示蜡烛图的边框
        "mainSeriesProperties.candleStyle.borderUpColor": "#40A771", // 蜡烛图的边框颜色
        "mainSeriesProperties.candleStyle.borderDownColor": "#E53A48",
        "mainSeriesProperties.candleStyle.wickUpColor": "#40A771", // 蜡烛图中间线的颜色
        "mainSeriesProperties.candleStyle.wickDownColor": "#E53A48",
        "volumePaneSize": "medium", // 成交量显示大小 支持的值: large, medium, small, tiny
        "timeScale.rightOffset": 2, // 蜡烛图最右边的那条与Y轴的距离
        // "paneProperties.legendProperties.showLegend": false, // 是否显示 交易对和分辨率（时间周期）
        // "paneProperties.legendProperties.showSeriesTitle": true, // // 是否显示 交易对和分辨率（时间周期）
        "paneProperties.legendProperties.showStudyArguments": false, // 是否显示成交量右上角Volume -> (20)
        "paneProperties.legendProperties.showStudyTitles": true, // 是否显示成交量右上角Volume
        "paneProperties.legendProperties.showStudyValues": true, // 是否显示成交量 数字
        "mainSeriesProperties.lineStyle.color": "#6ba583", // 折线图的颜色
      }
      themeobj.white.overrides = Object.assign(themeobj.white.overrides, overrides);
      themeobj.black.overrides = Object.assign(themeobj.black.overrides, overrides);
      return themeobj[str];
    },

    // TradingView 语言调整
    handleFormatLang(val) {
      let lang = val;
      if (lang === 'zh-TW') {
        lang = 'zh_TW';
      }
      if (lang === 'zh-CN') {
        lang = 'zh';
      }
      return lang;
    },

    handleChartReady(){
      Tv.widget.onChartReady(() => {
        // Tv.createdDataBtn('1分钟', this.interval === '1', '1');
        // Tv.createdDataBtn('5分钟', this.interval === '5', '5');
        // Tv.createdDataBtn('15分钟', this.interval === '15', '15');
        // Tv.createdDataBtn('30分钟', this.interval === '30', '30');
        Tv.createdDataBtn('1小时', this.interval === '60', '60');
        Tv.createdDataBtn('4小时', this.interval === '240', '240');
        Tv.createdDataBtn('1天', this.interval === '1D', '1D');
        Tv.createdDataBtn('1周', this.interval === '1W', '1W');
        Tv.createdDataBtn('1月', this.interval === '1M', '1M');
        Tv.createdFillWinBtn();
        // 退出全屏K线
        Tv.widget.onShortcut('esc', function(){
          const tvid = document.getElementById('tv_chart_container');
          if (tvid.className === 'tv_chart_container_full') {
            tvid.className = '';
            const buttonEvent = window.fullscreenBtnEvent;
            const button = buttonEvent[0];
            button.innerHTML = '';
            button.title = 'Full';
            buttonEvent.append('<svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 586.09999 586.09996"><path d="M172.6 367.9l-97.7 97.7L0 390.7v195.4h195.4l-74.9-74.9 97.7-97.7-45.6-45.6zM195.4 0H0v195.4l74.9-74.9 97.7 97.7 45.6-45.6-97.7-97.7L195.4 0zm195.3 0l74.9 74.9-97.7 97.7 45.6 45.6 97.7-97.7 74.9 74.9V0H390.7zm22.8 367.9l-45.6 45.6 97.7 97.7-74.9 74.9h195.4V390.7l-74.9 74.9-97.7-97.7z"></path></svg>');
            return;
          }
        });
      });
    },
    // 切换深度图
    handleDepthAction() {
      this.$emit('listenDepthAction');
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  transform: translate(-50%);
  z-index: 999;
  text-align: center;

  /deep/ .mint-spinner-snake {
    margin: auto;
  }
}
.kline{
  position: relative;
  .hide{
    position: absolute;
    top: 60px;
    right: 0px;
    height: calc(100% - 60px);
    width: 150px;
  }
  .hide2{
    position: absolute;
    bottom: 0px;
    left: 0px;
    height: 300px;
    width: 200px;
  }
}
.tradeView{
  width: 100%;
  height: 50vh;
}
#tv_chart_container {
  width: 750px;
  height: 50vh;
}
.tv_chart_container_full {
    position: fixed !important;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100% !important;
    z-index: 99999;
}
.theme-278EDA #tv_chart_container {
  background: #fff;
}
.theme-1B1D27 #tv_chart_container {
  background: #000;
}
</style>