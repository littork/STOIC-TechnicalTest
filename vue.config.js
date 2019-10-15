module.exports = {
  transpileDependencies: ["vuetify"],
  chainWebpack: config => {
    config.module
      .rule("csv")
      .test(/\.(csv|txt)$/)
      .use("csv-loader")
      .loader("csv-loader")
      .end();
  }
};
