const { VantResolver } = require("unplugin-vue-components/resolvers");
const ComponentsPlugin = require("unplugin-vue-components/webpack");

module.exports = {
  lintOnSave: false,
  publicPath: "/", // 将打包路径修改为根路径
  
  configureWebpack: {
    resolve: {
      // alias: {
      //   '@assets': '@/assets'
      // }
    },
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver({importStyle: false})],
      }),
    ],
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:5001/api",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "", //请求的时候使用这个api就可以
        },
      },
    },
  },
};
