import {get_table_rows} from '@/api/list';
import {toFixed, toLocalTime} from '@/utils/public'
// 获取可获得多少
export function ogx_get_num(tab, data) {
  if (!tab.length) {
    return {}
  }
  // aboutPrice: "60.643543"
  // aboutPriceSym0: "0.0164898014"
  // getNum: "0.01644036"
  // minOut: "0.01627594"
  // payNum: "1"
  // price: 0.016489821327133794
  // priceRate: "0.00"
  // thisCoinsPath: "eosio.token:EOS-tagtokenmain:TAG"
  // thisMidsPath: "602"
  // type: "pay"
  const sym0 = data.sym0;
  const sym1 = data.sym1;
  const tab0 = tab.find(v => v.symbol === sym0)
  const tab1 = tab.find(v => v.symbol === sym1)
  const price = tab0.rate / tab1.rate;
  // const payNum = data.payNum;
  // const getNum = payNum * price;
  const backData = {
    aboutPrice: toFixed(tab1.rate / tab0.rate, 10),
    aboutPriceSym0: toFixed(price, 8),
    price,
    priceRate: "0.00",
    type: data.type,
  }
  if (data.type === 'pay') {
    const payNum = data.payNum;
    const getNum = toFixed(payNum * price, 8);
    backData.payNum = payNum;
    backData.getNum = getNum;
    backData.minOut = getNum;
  } else {
    const getNum = data.getNum;
    const payNum = toFixed(getNum / price, 8);
    backData.payNum = payNum;
    backData.getNum = getNum;
    backData.minOut = getNum;
  }
  return backData;
}

// 获取ogx价格列表
export async function ogx_get_prices_table(cb) {
  const params = {
    code: "core.ogx",
    json: true,
    limit: -1,
    scope: "core.ogx",
    table: "currrundrate",
  }
  const {status, result} = await get_table_rows(params);
  if (!status) {
    return
  }
  const rows = result.rows || [];
  rows.forEach(v => {
    const arr = v.sym.split(',')
    v.decimal = arr[0]
    v.symbol = arr[1]
    const time = toLocalTime(v.timestamp * 1000)
    v.time = time;
  });
  cb(rows)
}