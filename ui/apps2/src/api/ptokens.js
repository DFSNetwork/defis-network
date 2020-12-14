
import axios from 'axios';

// pTokens 接口请求部分
export function ptoken_get_address(params) {
  return new Promise((resolve, reject) => {
    axios.post('https://pbtconeos-node-1a.ngrok.io/v1/pbtc-on-eos', params).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}