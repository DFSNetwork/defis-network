// vue.config.js
module.exports = {
  // 配置项
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/', // 资源文件目录
  // 开启esLint
  lintOnSave: process.env.NODE_ENV !== 'production',
  // 开发服务配置
  devServer: {
    open: true,
    port: 8888,
    proxy: { // 代理控制
      '/api': {
        target: `http://192.168.8.253:8080`,
        ws: false,
        changeOrigin: true
      },
    }
  },
  css: { // 样式相关配置
    extract: false, // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
    requireModuleExtension: true, // 去掉文件名中的 .module
    sourceMap: false,
    loaderOptions: {
    }
  },
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
  },
  // 将构建好的文件输出到位置
  outputDir: 'dist',
  // 是否为生产环境构建生成 source map？
  productionSourceMap: process.env.NODE_ENV !== 'production',

  // 三方插件的选项
  pluginOptions: {
    // ...
  },
}