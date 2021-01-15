/*
	This class implements interaction with UDF-compatible datafeed.
	See UDF protocol reference at
	https://github.com/tradingview/charting_library/wiki/UDF
*/
/* eslint-disable */
class Datafeeds {
  constructor(mgr, updateFrequency) {
    this._mgr = mgr
    this._configuration = undefined

    this._enableLogging = false
    this._initializationFinished = false
    this._callbacks = {}

    this._initialize()
  }
  /**
   * 默认配置
   */
  defaultConfiguration() {
    return {
      supports_search: true,
      supports_group_request: false,
      supported_resolutions: ['1', '5', '15', '30', '60', '1D', '2D', '3D', '1W', '1M'],
      supports_marks: true,
      supports_timescale_marks: true,
      supports_time: true,
      exchanges: [{
        value: '',
        name: 'All Exchanges',
        desc: ''
      }],
      symbols_types: [{
        name: 'All types',
        value: ''
      }]
    }
  }
  /**
   * 获取服务端时间
   * @param {*Function 回调函数} callback 
   */
  getServerTime(callback) {
    if (this._configuration.supports_time) {
      const self = this
      setTimeout(function () {
        callback(self._mgr.getServerTime())
      }, 10)
    }
  }
  /**
   * 绑定事件
   * @param {*String 事件名} event 
   * @param {*Function 回调函数} callback 
   */
  on(event, callback) {
    if (!this._callbacks.hasOwnProperty(event)) {
      this._callbacks[event] = []
    }

    this._callbacks[event].push(callback)
    return this
  }
  /**
   * 运行事件
   * @param {*String 事件名} event 
   * @param {*Undefined 参数} argument 
   */
  _fireEvent(event, argument) {
    if (this._callbacks.hasOwnProperty(event)) {
      const callbacksChain = this._callbacks[event]
      for (let i = 0; i < callbacksChain.length; ++i) {
        callbacksChain[i](argument)
      }

      this._callbacks[event] = []
    }
  }
  /**
   * 初始化结束
   */
  onInitialized() {
    this._initializationFinished = true
    this._fireEvent('initialized')
  }
  /**
   * 打印信息
   * @param {*String 信息} message 
   */
  _logMessage(message) {
    if (this._enableLogging) {
      console.log(new Date().toLocaleTimeString() + ' >> ', message)
    }
  }
  /**
   * 初始化
   */
  _initialize() {
    const configurationData = this._mgr.getConfig()
    const defaultConfig = this.defaultConfiguration()
    if (configurationData) {
      const conf = Object.assign({}, defaultConfig, configurationData)
      this._setupWithConfiguration(conf)
    } else {
      this._setupWithConfiguration(defaultConfig)
    }
  }
  /**
   * 填充配置数据
   * @param {*Function 回调函数} callback 
   */
  onReady(callback) {
    const that = this
    if (this._configuration) {
      setTimeout(function () {
        callback(that._configuration)
      }, 0)
    } else {
      this.on('configuration_ready', function () {
        callback(that._configuration)
      })
    }
  }
  /**
   * 安装配置数据
   * @param {*Object 配置数据} configurationData 
   */
  _setupWithConfiguration(configurationData) {
    this._configuration = configurationData

    if (!this._configuration.exchanges) {
      this._configuration.exchanges = []
    }

    if (this._configuration.supports_group_request) {
      console.error(' >> ：Sorry unsupports group request')
      return
    }
    this.onInitialized()
    this._fireEvent('configuration_ready')
    this._logMessage('Initialized with ' + JSON.stringify(configurationData))
  }
  /**
   * 通过商品名称解析商品信息
   * @param {*String 商品名称或ticker} symbolName 
   * @param {*Function(SymbolInfo)} onSymbolResolvedCallback 
   * @param {*Function(reason)} onResolveErrorCallback 
   */
  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    const that = this

    if (!this._initializationFinished) {
      this.on('initialized', function () {
        that.resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback)
      })

      return
    }

    var resolveRequestStartTime = Date.now()
    that._logMessage('Resolve requested')

    function onResultReady(data) {
      let postProcessedData = data
      if (that.postProcessSymbolInfo) {
        postProcessedData = that.postProcessSymbolInfo(postProcessedData)
      }

      that._logMessage('Symbol resolved: ' + (Date.now() - resolveRequestStartTime))

      onSymbolResolvedCallback(postProcessedData)
    }

    if (!this._configuration.supports_group_request) {
      setTimeout(function () {
        const data = that._mgr.resolveTVSymbol(symbolName ? symbolName.toUpperCase() : '')
        if (data) {
          onResultReady(data)
        } else {
          that._logMessage('Error resolving symbol: ' + symbolName)
          onResolveErrorCallback('unknown_symbol')
        }
      }, 10)
    }
  }
  /**
   * 搜索商品
   * @param {*String 用户在商品搜索框中输入的文字} userInput 
   * @param {*String 请求的交易所（由用户选择）。空值表示没有指定} exchange 
   * @param {*String 请求的商品类型：指数、股票、外汇等等（由用户选择）。空值表示没有指定} symbolType 
   * @param {*Function 回调函数} onResultReadyCallback 
   */
  searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    if (this._configuration.supports_search) {
      console.log(' >> 搜索商品：', userInput, exchange, symbolType)
      // step 1：向服务端发起请求
      // your code
      // step 2：返回结果
      onResultReadyCallback([
        // https://b.aitrade.ga/books/tradingview/book/JS-Api.html#searchSymbolsuserinput-exchange-symboltype-onresultreadycallback
        {
          "symbol": 'AAFR',
          "full_name": 'BTCUSD',
          "description": '',
          "exchange": '',
          "ticker": '',
          "type": "stock" | "futures" | "bitcoin" | "forex" | "index"
        }
      ])
    }
  }
  /**
   * 获取时间刻度
   * @param {*Object 商品信息} symbolInfo 
   * @param {*Number unix时间戳 (UTC)} startDate 
   * @param {*Number unix时间戳 (UTC)} endDate 
   * @param {*Function 回调函数} onDataCallback 
   * @param {*String 分辨率} resolution 
   */
  getTimescaleMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {
    if (this._configuration.supports_timescale_marks) {
      // console.log(' >> 获取时间刻度：', symbolInfo, startDate, endDate, resolution)
      // step 1：向服务端发起请求
      // your code
      // step 2：返回结果
      onDataCallback([
      ])
    }
  }
  /**
   * 获取K线标记
   * @param {*Object 商品信息} symbolInfo 
   * @param {*Number unix时间戳 (UTC)} startDate 
   * @param {*Number unix时间戳 (UTC)} endDate 
   * @param {*Function 回调函数} onDataCallback 
   * @param {*String 分辨率} resolution 
   */
  getMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {
    if (this._configuration.supports_marks) {
      // console.log(' >> 获取K线标记：', symbolInfo, startDate, endDate, resolution)
      // step 1：向服务端发起请求
      // your code
      // step 2：返回结果
      onDataCallback([
        {
          color: 'red',
          id: 'tsm1',
          text: 'AAA',
          label: 'A',
          time: 1492041600,
          labelFontColor: '',
          minSize: 28
        }
      ])
    }
  }
  /**
   * 
   * @param {*Object 商品信息对象} symbolInfo 
   * @param {*String 分辨率} resolution 
   * @param {*Number 时间戳、最左边请求的K线时间} rangeStartDate 
   * @param {*Number 时间戳、最右边请求的K线时间} rangeEndDate 
   * @param {*Function 回调函数} onDataCallback 
   * @param {*Function 回调函数} onErrorCallback 
   */
  getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback) {
    if (rangeStartDate > 0 && (rangeStartDate + '').length > 10) {
      throw new Error(['Got a JS time instead of Unix one.', rangeStartDate, rangeEndDate])
    }

    const onLoadedCallback = function (data) {

      if (data) {
        const nodata = data.s === 'no_data'

        if (data.s !== 'ok' && !nodata) {
          if (!!onErrorCallback) {
            onErrorCallback(data.s)
          }
          return
        }

        const bars = data.bars || []
        onDataCallback(bars, { noData: nodata, nextTime: data.nextTime })
      } else {
        console.warn(['getBars(): error'])
        if (!!onErrorCallback) {
          onErrorCallback(' error: ')
        }
      }
    }

    this._mgr.getBars(symbolInfo.ticker.toUpperCase(), resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
  }
  /**
   * 订阅K线数据
   * @param {*Object 商品信息对象} symbolInfo 
   * @param {*String 分辨率} resolution 
   * @param {*Function 回调函数} onRealtimeCallback 
   * @param {*String 监听的唯一标识符} listenerGUID 
   * @param {*Function 回调函数} onResetCacheNeededCallback 
   */
  subscribeBars(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {
    // console.log('subscribeBars: ' + symbolInfo + ', ' + resolution + ', ' + listenerGUID);
    this._mgr.subscribeBars(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback)
  }
  /**
   * 取消订阅K线数据
   * @param {*String 监听的唯一标识符} listenerGUID 
   */
  unsubscribeBars(listenerGUID) {
    this._mgr.unsubscribeBars(listenerGUID)
  }
}


export default Datafeeds