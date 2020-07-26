module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ["Android >= 4.0", "iOS >= 7"]
    },
    "postcss-pxtorem": {
      rootValue: 75,
      propList: ["*"],
      // selectorBlackList: ["#app"],
      minPixelValue: 1.0001 //忽略 1px转rem
    }
  }
};