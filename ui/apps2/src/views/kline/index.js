/* eslint-disable */
import SocketIo from '@/utils/socket';
import Datafeeds from './datafeed';

export default {
  queryData: {},
  widget: null,
  dataFeed: null,
  dataCache: {}, // 缓存数据
  getBarTimer: null,
  resolution: null,
  realtimeCallback: {},
  isSubscribe: false,
  init: function (options, callback) {
    this.vThis = options.self;
    this.dataCache = {};
    this.isSubscribe = false;
    this.queryData = options;
    this.resolution = options.interval;
    this.dataFeed = new Datafeeds(this)
    const widgetConfig_defalut = {
      debug: false,
      autosize: true,
      symbol: options.symbol,
      interval: options.interval,
      container_id: 'tv_chart_container',
      datafeed: this.dataFeed,
      library_path: '/static/chart_library/', // 包文件路径
      timezone: 'Asia/Shanghai',
      // 开启功能
      enabled_features: [
        'keep_left_toolbar_visible_on_small_screens',
        'side_toolbar_in_fullscreen_mode', // 全屏模式启用绘图工具
        'hide_left_toolbar_by_default', // 当用户第一次打开图表时隐藏左工具栏
        'left_toolbar',
        'keep_left_toolbar_visible_on_small_screens', // 防止左侧工具栏在小屏幕上消失
        // 'hide_last_na_study_output', // 隐藏最后一次指标输出
        'move_logo_to_main_pane', // logo 图标位置
        'dont_show_boolean_study_arguments', // 隐藏指标参数
      ],
      // 关闭功能
      disabled_features: [
        'control_bar', // 底部的导航按钮(选择时间周期隐藏)
        'timeframes_toolbar',
        'main_series_scale_menu', // 隐藏图表右下角的设置按钮
        'symbol_search_hot_key', // 商品搜索热键
        // 'header_widget_dom_node', // 隐藏头部的时间选择
        'header_symbol_search',
        'header_resolutions',
        'header_interval_dialog_button',
        'show_interval_dialog_on_key_press',
        'header_chart_type',
        // 'header_settings',
        'header_indicators', // 各种指标功能入口
        'header_compare',
        'header_undo_redo',
        'header_screenshot',
        'header_fullscreen_button',
        'volume_force_overlay',
        // 'save_chart_properties_to_local_storage',
        'use_localstorage_for_settings',
      ],
      studies_overrides: {
        // 'paneProperties.legendProperties.showLegend': false,
        "volume.precision" : 0,
      },
    };
    const widgetConfig = Object.assign(widgetConfig_defalut, options.wgconfig);
    const widget = new TradingView.widget(widgetConfig);
    this.widget = widget;
    this.resetData();
    callback();
  },

  resetData: function () {
    this.dataFrom = 0;
    this.noMoreData = false;
    this.isSubscribe = false;
  },

  getBars: function (symbol, resolution, from, to, callback) {
    let res = this.resolution;  //todo: bug, this.resolution != resolution
    if (this.noMoreData) {
      callback && callback({ s: 'no_data' })
      return;
    }
    if (this.dataFrom >0 && to > this.dataFrom) {
      to = this.dataFrom
    }
    if (from >= to) {
      callback && callback({ s: 'ok', bars: [] })
      return;
    }
    // 请求数据
    const periodArr = [{
      id: '1',
      period: 'minute',
    }, {
      id: '5',
      period: 'minute5',
    }, {
      id: '15',
      period: 'minute15',
    }, {
      id: '30',
      period: 'minute30',
    }, {
      id: '60',
      period: '60',
    }, {
      id: '240',
      period: '240',
    }, {
      id: '1D',
      period: '1D',
    }, {
      id: '1W',
      period: '1W',
    }, {
      id: '1M',
      period: '1M',
    }]
    const periodObj = periodArr.find(v => v.id == this.queryData.interval) || {period: 'day'};
    const period = periodObj.period;
    const mid = this.queryData.market.mid;
    const params = {
      // type: "kline",
      // period,
      // symbol: this.queryData.inSymbol,
      // from: from,
      // to: to,
      // diffDecimal: this.queryData.diffDecimal,

      exchange: 'DFS',
      mid,
      symIn: this.queryData.market.symbol1,
      symOut: this.queryData.market.symbol0,
      resolution: period,
      fromTs: from,
      toTs: to,
    }
    SocketIo.subscribe(params, (wsRes) => {
      this.noMoreData = true;
      callback && callback({ s: 'ok', bars: wsRes })
    })

  },

  subscribeBars: function(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {
    const _listenerGUID = listenerGUID.replace(new RegExp('-', 'g'), '_');
    this.realtimeCallback[_listenerGUID] = onRealtimeCallback
  },

  unsubscribeBars: function(listenerGUID) {
    const _listenerGUID = listenerGUID.replace(new RegExp('-', 'g'), '_');
    delete this.realtimeCallback[_listenerGUID];
  },

  // 设置配置信息
  getConfig: function () {
    // https://b.aitrade.ga/books/tradingview/book/UDF.html
    return {
      'supports_search': true,  //  请修改datafeed的searchSymbols函数
      'supports_group_request': false, // 设置为true将无法进行单个商品解析
      'supports_marks': true,  // 请修改datafeed的getMarks函数
      'supports_timescale_marks': true, // 请修改datafeed的getTimescaleMarks函数
      'supports_time': true,
      'supported_resolutions': ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
    }
  },

  // 默认配置信息
  resolveTVSymbol: function (symbol) {
    // https://b.aitrade.ga/books/tradingview/book/Symbology.html
    
    return {
      'name': this.queryData.name,
      // 'exchange': 'Newdex',
      // 'data_status': 'streaming',
      'data_status': 'streaming',
      'exchange-traded': '',
      'exchange-listed': '',
      'timezone': 'Asia/Shanghai',
      'minmov': 1,
      'minmov2': 0,
      'pointvalue': '', // 点值
      'fractional': false,
      'session': '24x7',
      'has_intraday': true,
      'has_no_volume': false,
      'description': this.queryData.name,
      'pricescale': this.queryData.pricescale, // 保留小数位数 10000 4位
      'ticker': this.queryData.ticker,
      'has_weekly_and_monthly': true,
      // 'supported_resolutions': ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
    }
  },
  
  getServerTime: function () {
    // 暂时由客户端生成时间
    return parseInt(Date.now() / 1000) 
  },

  /*
  * 生成日期分辨率按钮
  * @params name 名称
  * @params active 是否选中
  * @params resolution [1, 5, 15, 30, 60, 1D, 1W]
  */
  createdDataBtn(name, active, resolution) {
    const _this = this;
    const widget = _this.widget;
    const buttonEvent = widget.createButton();
    const button = buttonEvent[0];
    let className = 'button';
    button.innerHTML = button.title = name;
    if (active) className = 'button selected';
    button.className = className;
    button.onclick = function() {
      _this.resolution = resolution;
      _this.resetData();
      const parent = button.parentNode.parentNode;
      const children = parent.getElementsByClassName('button');
      for (let i = 0; i < children.length; i++) {
        children[i].className = 'button';
      }
      button.className = 'button selected';
      widget.chart().setResolution(resolution, function onReadyCallback(){
        console.log(resolution)
        _this.queryData.interval = resolution;
      });
    }
  },

  /*
  * 全屏按钮
  */
  createdFillWinBtn() {
    const _this = this;
    const widget = _this.widget;
    const buttonEvent = widget.createButton({align: "right"});
    const button = buttonEvent[0];
    window.fullscreenBtnEvent = buttonEvent;
    button.title = 'Full';
    button.className = 'button fullscreen iconed apply-common-tooltip';
    button.id = 'fullscreenBtn';
    buttonEvent.append('<svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 586.09999 586.09996"><path d="M172.6 367.9l-97.7 97.7L0 390.7v195.4h195.4l-74.9-74.9 97.7-97.7-45.6-45.6zM195.4 0H0v195.4l74.9-74.9 97.7 97.7 45.6-45.6-97.7-97.7L195.4 0zm195.3 0l74.9 74.9-97.7 97.7 45.6 45.6 97.7-97.7 74.9 74.9V0H390.7zm22.8 367.9l-45.6 45.6 97.7 97.7-74.9 74.9h195.4V390.7l-74.9 74.9-97.7-97.7z"></path></svg>');
    button.onclick = function() {
      const tvid = document.getElementById('tv_chart_container');
      if (tvid.className === 'tv_chart_container_full') {
        tvid.className = '';
        button.innerHTML = '';
        // window.depthBtnEvent[0].setAttribute('style', '');
        button.title = 'Full';
        buttonEvent.append('<svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 586.09999 586.09996"><path d="M172.6 367.9l-97.7 97.7L0 390.7v195.4h195.4l-74.9-74.9 97.7-97.7-45.6-45.6zM195.4 0H0v195.4l74.9-74.9 97.7 97.7 45.6-45.6-97.7-97.7L195.4 0zm195.3 0l74.9 74.9-97.7 97.7 45.6 45.6 97.7-97.7 74.9 74.9V0H390.7zm22.8 367.9l-45.6 45.6 97.7 97.7-74.9 74.9h195.4V390.7l-74.9 74.9-97.7-97.7z"></path></svg>');
        return;
      }
      // window.depthBtnEvent[0].setAttribute('style', 'display: none');
      tvid.className = 'tv_chart_container_full';
      button.innerHTML = '';
      button.title = 'Exit';
      buttonEvent.append('<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4719" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" style="margin-top: -2px;"><defs><style type="text/css"></style></defs><path d="M391 240.9c-0.8-6.6-8.9-9.4-13.6-4.7l-43.7 43.7L200 146.3c-3.1-3.1-8.2-3.1-11.3 0l-42.4 42.3c-3.1 3.1-3.1 8.2 0 11.3L280 333.6l-43.9 43.9c-4.7 4.7-1.9 12.8 4.7 13.6L401 410c5.1 0.6 9.5-3.7 8.9-8.9L391 240.9zM401.1 614.1L240.8 633c-6.6 0.8-9.4 8.9-4.7 13.6l43.9 43.9L146.3 824c-3.1 3.1-3.1 8.2 0 11.3l42.4 42.3c3.1 3.1 8.2 3.1 11.3 0L333.7 744l43.7 43.7c4.7 4.7 12.8 1.9 13.6-4.7l18.9-160.1c0.6-5.1-3.7-9.4-8.8-8.8zM622.9 409.9L783.2 391c6.6-0.8 9.4-8.9 4.7-13.6L744 333.6 877.7 200c3.1-3.1 3.1-8.2 0-11.3l-42.4-42.3c-3.1-3.1-8.2-3.1-11.3 0L690.3 279.9l-43.7-43.7c-4.7-4.7-12.8-1.9-13.6 4.7L614.1 401c-0.6 5.2 3.7 9.5 8.8 8.9zM744 690.4l43.9-43.9c4.7-4.7 1.9-12.8-4.7-13.6L623 614c-5.1-0.6-9.5 3.7-8.9 8.9L633 783.1c0.8 6.6 8.9 9.4 13.6 4.7l43.7-43.7L824 877.7c3.1 3.1 8.2 3.1 11.3 0l42.4-42.3c3.1-3.1 3.1-8.2 0-11.3L744 690.4z" p-id="4720"></path></svg>');
    }
  },

  /*
  * 语言更换
  */
  tvSetLanguage(lang) {
    const _this = this;
    const widget = _this.widget;
    widget.setLanguage(lang);
  },
}