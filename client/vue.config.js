const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    hot: false,
    liveReload: true
  },
  lintOnSave: false,
  configureWebpack: {
    target: 'electron-renderer'
  }
})
