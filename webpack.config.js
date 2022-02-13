const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: [
    './app/main.js'
  ],
  devServer: {
    hot: true, // 它是热更新：只更新改变的组件或者模块，不会整体刷新页面
    open: true, // 是否自动打开浏览器
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 8080,
    // webpack中的proxy就是解决前端跨域的方法之一。跨越问题：协议、域名、端口 三者只要有一个与服务端的不一致，就会报跨域错误
    proxy: {
      '/ongdb-graphene': {
        target: 'http://localhost:8081/', // 接口服务地址
        changeOrigin: true, // 加了这个属性，那后端收到的请求头中的host是目标地址 target
        pathRewrite: { '^/': '/' },
        secure: false, // 若代理的地址是https协议，需要配置这个属性false
      }
    },
  },
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/build/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new UglifyJSPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ],
  node: {
    fs: 'empty'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
};
