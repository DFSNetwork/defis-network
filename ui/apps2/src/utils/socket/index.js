
// import io from 'socket.io-client';
import {toLocalTime} from '@/utils/public'
import {get_kline_data, get_kline_data2} from '@/utils/api'; // eslint-disable-line
class WsIo {
  constructor() {
    this.connect = false;
    this.socket = null;
  }
  init(cb) {
    cb ? cb() : null;
  }
  /**
   * 获取K线历史数据
   * @param {*} params 
   * {
   *  tyep: 'kline',
   *  period: 'minute', // minute | minute5 | minute10
   *  symbol: 'DFS-39', // coin-mid
   *  from: 1602123180, // 开始时间
   *  to: 1602124440, // 结束时间
   * }
   */
  async subscribe(params, cb) {
    const {status, result} = await get_kline_data2(params)
    if (!status) {
      cb([])
      return
    }
    const decimal = params.diffDecimal; // eslint-disable-line
    let wsRes = result;
    if (!Array.isArray(wsRes)) {
      const item = {
        open: wsRes.open,
        high: wsRes.high,
        low: wsRes.low,
        close: wsRes.close,
        volume: 0,
        time: wsRes.id * 1000,
        date: toLocalTime(wsRes.id * 1000),
        isBarClosed: true,
        isLastBar: true
      }
      cb([item])
      return
    }
    const dealArr = [];
    wsRes.forEach((v, index) => {
      // const item = {
      //   open: v[1] * 10 ** decimal / 10000,
      //   high: v[3] * 10 ** decimal / 10000,
      //   low: v[4] * 10 ** decimal / 10000,
      //   close: v[2] * 10 ** decimal / 10000,
      //   volume: 0,
      //   time: v[0] * 1000,
      //   date: toLocalTime(v[0] * 1000),
      //   isBarClosed: true,
      //   isLastBar: index === wsRes.length - 1,
      // }
      const item = {
        open: v.open,
        high: v.high,
        low: v.low,
        close: v.close,
        volume: v.base_amount,
        time: v.time * 1000,
        date: toLocalTime(v.time * 1000),
        isBarClosed: true,
        isLastBar: index === wsRes.length - 1,
      }
      dealArr.push(item)
    });
    cb(dealArr)
  }
  subscribeOld(params, cb) {
    if (!this.connect) {
      this.init(() => {
        this.subscribe(params, cb)
      })
      return
    }
    // 发送请求
    const action = 'request';
    this.socket.emit(action, params);
    // 监听数据返回
    const listen = `${params.type}.${params.period}.${params.symbol}`
    const decimal = params.diffDecimal;
    this.socket.on(listen, function (msg) {
      // console.log(listen, msg)
      let wsRes = msg;
      if (!Array.isArray(wsRes)) {
        const item = {
          open: wsRes.open,
          high: wsRes.high,
          low: wsRes.low,
          close: wsRes.close,
          volume: 0,
          time: wsRes.id * 1000,
          date: toLocalTime(wsRes.id * 1000),
          isBarClosed: true,
          isLastBar: true
        }
        cb([item])
        return
      }
      const dealArr = [];
      wsRes.forEach((v, index) => {
        // if (v[0] === 1599235200 && v[1] > 20000000) {
        //   return
        // }
        const item = {
          open: v[1] * 10 ** decimal / 10000,
          high: v[3] * 10 ** decimal / 10000,
          low: v[4] * 10 ** decimal / 10000,
          close: v[2] * 10 ** decimal / 10000,
          volume: 0,
          time: v[0] * 1000,
          date: toLocalTime(v[0] * 1000),
          isBarClosed: true,
          isLastBar: index === wsRes.length - 1,
        }
        dealArr.push(item)
      });
      cb(dealArr)
    });
  }

  disconnect() {
    this.socket.on('disconnect', function () {
      console.log('ws disconnect')
    });
  }
}

const Io = new WsIo()

export default Io;
