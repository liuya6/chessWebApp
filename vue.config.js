const CompressionPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports = {
  // 部署应用包时的基本 URL
  // baseUrl 从 Vue CLI 3.3 起已弃用，请使用publicPath
  publicPath: "/",

  // 生产环境构建文件的目录
  outputDir: "dist",

  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: "",

  // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径
  indexPath: "index.html",

  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,

  configureWebpack: {
    plugins: [
      //gzip 压缩
      new CompressionPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: productionGzipExtensions, //匹配文件名
        threshold: 10240, //对超过10k的数据压缩
        minRatio: 0.8,
        deleteOriginalAssets: false //删除源文件
      })
    ]
  },
  chainWebpack: config => {
    // 移除 prefetch 插件 路由懒加载失效的原因
    config.plugins.delete("prefetch");
    // 打包压缩图片
    config.module
      .rule("images")
      .use("image-webpack-loader")
      .loader("image-webpack-loader")
      .options({
        bypassOnDebug: true
      })
      .end();
  },
  devServer: {
    host: "0.0.0.0",
    hot: true,
    disableHostCheck: true,
    proxy: {
      "/api": {
        // ws: true, // proxy 开启websockets
        changeOrigin: true, // needed for virtual hosted sites
        target: "http://chess.678678666.com" // target host
        // target: "http://tp.agilephp.com", // target host
        /* 调用线上接口不需要重定向 */
        // pathRewrite: {
        //   "^/api/common": "/common", // rewrite path
        //   "^/api": "/game" // rewrite path
        // }
      }
    }
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
};
