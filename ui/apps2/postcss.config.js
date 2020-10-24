const AutoPrefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
module.exports = ({ file }) => {
  let remUnit;
  if (file && file.dirname && file.dirname.indexOf('vant') > -1) {
    remUnit = 37.5;
  } else {
    remUnit = 75;
  }
  return {
    plugins: [
      AutoPrefixer({
        overrideBrowserslist: ['iOS >= 7', 'android >= 4.0'],
      }),
      pxtorem({
        rootValue: remUnit,
        propList: ['*'],
        minPixelValue: 1.0001,
      }),
    ],
  };
};