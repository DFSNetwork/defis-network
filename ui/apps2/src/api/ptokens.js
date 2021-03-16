
import axios from 'axios';

// pTokens 接口请求部分
export function ptoken_get_address(params) {
  return new Promise((resolve, reject) => {
    if (!params.token) {
      return
    }
    const token = params.token.toLowerCase();
    const oneos = `${params.token1.toLowerCase()}oneos`
    axios.post(`https://${oneos}-node-1a.ngrok.io/v1/${token}-on-eos`, params).then((res) => {
      let result = Object.assign(res.data, {});
      resolve({ status: res.status === 200, result });
    }, err => {
      reject(err)
    })
  })
}