const CompressionWebpackPlugin = require('compression-webpack-plugin');
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
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
      sass: {
        prependData: `@import "~@/assets/css/common.scss";`
      }
    }
  },
  configureWebpack: config => {
    // 开启gzip压缩
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\.js$|\.html$|\.json$|\.css/,
        threshold: 512,
        minRatio: 0.8
      }));
      // 开启分离js
      config.optimization = {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'async',
          maxInitialRequests: Infinity,
          minSize: 20000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name (module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace('@', '')}`
              }
            }
          }
        }
      };
      // 取消webpack警告的性能提示
      config.performance = {
        hints:'warning',
            //入口起点的最大体积
            maxEntrypointSize: 50000000,
            //生成文件的最大体积
            maxAssetSize: 30000000,
            //只给出 js 文件的性能提示
            assetFilter: function(assetFilename) {
          return assetFilename.endsWith('.js');
        }
      }
    }
  },
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // only package third parties that are initially dependent
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, // minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single');
    });
  },
  // 将构建好的文件输出到位置
  outputDir: 'dist',
  // 是否为生产环境构建生成 source map？
  productionSourceMap: process.env.NODE_ENV !== 'production',
}