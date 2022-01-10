
import Tp from 'tp-eosjs'; // tokenpocket JS

export function walletConnected() {
  if (Tp.isConnected()) {
    return true
  }
  return false;
}

export function fullScreen(type) {
  if (!walletConnected()) {
    return
  }
  Tp.fullScreen({
    fullScreen: type
  })
}
export function isTpWallet() {
  if (Tp.isConnected()) {
    return true
  }
  return false;
}