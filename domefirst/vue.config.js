module.exports = {
  devServer: {
    proxy: {
      '/qvq': {
      target: "https://api.naccl.top/vue/shop/api/private/v1/",//后端服务器地址
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        "^/qvq": "" //这里理解成用'/api'代替target里面的地址,比如我要调用'http://localhost:2000/infoadd'，直接写'/api/infoadd'即可
        }   
      }
    }
  }
}
