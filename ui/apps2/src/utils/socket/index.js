
import io from 'socket.io-client';
import {toLocalTime} from '@/utils/public'
class WsIo {
  constructor() {
    this.connect = false;
    this.socket = null;
  }
  init(cb) {
    const self = this;
    self.socket = io('https://api.defis.network');
    self.socket.on('connect', function () {
      console.log('ws connect')
      self.connect = true;
      cb ? cb() : null;
    })
    console.log(self.connect)
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
  // DFS
  // socket.emit("request", {
  //   type: "kline",
  //   period: "minute5",
  //   symbol: "DFS-39",
  //   from: 1602123180,
  //   to: 1602124440,
  // });
  // YFC
  // socket.emit("request", {
  //   type: "kline",
  //   period: "minute",
  //   symbol: "YFC-329",
  //   from: 1602123180,
  //   to: 1602124440,
  // });
  subscribe(params, cb) {
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
    this.socket.on(listen, function (msg) {
      console.log(listen, msg)
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
        const item = {
          open: v[1] / 10000,
          high: v[4] / 10000,
          low: v[3] / 10000,
          close: v[2] / 10000,
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
