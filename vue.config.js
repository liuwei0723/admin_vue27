module.exports = {
    // 显示声明 webpack打包的时候，别忘记把vue-echarts打包进去了
    transpileDependencies: [
        'vue-echarts',
        'resize-detector'
    ],
    lintOnSave:false, //设置为false代表eslint不工作了
    publicPath:'./', // 设置加载的路径，从当前路径加载
    productionSourceMap:false,// 不生成map文件
    configureWebpack:{
      // 下面配置的这几个第三方包，不需要从内部node_modules打包
      // 而是从外部的cdn上面加载
      externals: {
          // 左边的名字是 import xx from '包名'  包名
          // 右边的名字是 cdn中导入的第三方包js的名字
          vue: 'Vue',
          axios: 'axios',
          'vue-router': 'VueRouter',
      }
  }
}