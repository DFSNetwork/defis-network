// 批量导出文件
const requireApi = require.context(
	// api 目录的相对路径
	'.',
	// 是否查询子目录
	false,
	// 查询文件的一个后缀
	/.js$/
)

let module = {}
requireApi.keys().forEach((key)=>{
	if(key === './index.js' || key === './axios.js') return
	Object.assign(module,requireApi(key))
})

export default module

// 取代
// import { get_list } from './list'
// export default {
//   get_list
// }