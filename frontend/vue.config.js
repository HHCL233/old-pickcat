const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  publicPath: '/',
  outputDir: 'dist',
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://pickcat.dao3.fun',
        changeOrigin: true
      }
    }
  },
  css: {
    loaderOptions: {
      // 样式中的图片地址都指向 public 目录，交给浏览器按绝对路径加载
      css: {
        url: false
      }
    }
  },
  configureWebpack: {
    // Webpack 运行时代码也必须是 ES5，IE11 才能解析
    target: ['web', 'es5'],
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  }
})
