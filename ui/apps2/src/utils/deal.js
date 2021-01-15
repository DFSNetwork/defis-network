
// import store from '@/store';
// 设定价格
// let newPrice = '272';
import { dealPrice } from '@/utils/public';

const loop = (market, newPrice) => {
  const liq = market;
  if (!liq) {
    return {}
  }
  // 计算现价
  // const price = parseFloat(liq.reserve0) / parseFloat(liq.reserve1);
  // console.log('price = ', price)

  // 计算定植 K
  const K = parseFloat(liq.reserve1) * parseFloat(liq.reserve0);

  // x: 支付数量 ｜ y: 得到数量 | newPrice: 设定价格(已知)
  // 算式1： (r0 + x) / (r1 + y) = newPrice
  // 算式2： (r0 + x) * (r1 + y) = K
  // 推导1: y = Math.sqrt(K / newPrice) - r1
  // 推导2: x = Math.sqrt(newPrice * K) - r0

  let x = Math.sqrt(K * newPrice)
  // console.log('xR0 = ', x)
  x = x - parseFloat(liq.reserve0)
  x = Math.abs(x).toFixed(liq.decimal0)
  // console.log('x = ', x)

  let y = Math.sqrt(K / newPrice)
  // console.log('yR1 = ', y)
  y = y - parseFloat(liq.reserve1)
  y = Math.abs(y).toFixed(liq.decimal1)
  // console.log('y = ', y)
  // console.log(newPrice)
  return {
    x, y, price: dealPrice(newPrice),
  }
}

// function getMaxMulNum(inPrecent) {
//   let max = 1;
//   if (inPrecent >= 1) {
//     max = 1000
//   } else if (inPrecent >= 0.1) {
//     max = 100
//   } else if (inPrecent >= 0.01) {
//     max = inPrecent * 1000
//   }
//   return max
// }

export function runPrice(market, nowPrice, inPrecent = 0.001) {
  if (!parseFloat(market.reserve0)) {
    return [];
  }
  const sellArr = [];
  const buyArr = []
  let maxMul = inPrecent * 1000;
  for (let i = 0; i < parseInt(maxMul / inPrecent); i++) {
    const addPrice = (parseFloat(nowPrice) + 0.000001) * (1 + inPrecent * i);
    // console.log(addPrice)
    let t = loop(market, addPrice)
    sellArr.push(t)

    // console.log(' ------- ')

    const dicPrice = (nowPrice - 0.000001) / (1 + inPrecent * i);
    // console.log(dicPrice)
    let b = loop(market, dicPrice)
    buyArr.push(b)
  }
  const kLine = {
    sellArr,
    buyArr,
  }
  // console.log(kLine)
  return kLine
}
// runPrice(price)