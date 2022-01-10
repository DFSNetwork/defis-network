import {get_table_rows} from '@/api/list'

export async function gat_apys(cb) {
  const params = {
    "code":"yfcpayoutone",
    "scope":"yfcpayoutone",
    "table":"args",
    "json":true,
  }
  const {status, result} = await get_table_rows(params)
  if (!status) {
    cb({})
    return
  }
  const rows = result.rows || [];
  if (!rows.length) {
    cb({})
    return
  }
  const apy = (Math.pow(rows[0].aprs, 365 * 86400) - 1) * 100;
  rows[0].apy = apy.toFixed(2)
  cb(rows[0])
  return
}