module.exports = { // px2vw插件配置
  plugins: {
    autoprefixer: {},
    "postcss-px-to-viewport": {
      viewportWidth: 375, // 视窗的宽度，对应的是我们设计稿的宽度(750 retina 高清型)
      viewportHeight: 667, // 视窗的高度，对应的是我们设计稿的宽度(也可以不配置)
      unitPrecision: 5, // 指定'px'转换为视窗的单位值的小数数位(很多时候无法整除)
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: ['ignore', 'tab-bar', 'tab-bar-item', 'bottom-bar'], // 指定不需要转换的类
      minPixelValue: 1, // 小于或等于'1px'不转换为视窗单位
      mediaQuery: false, // 允许在媒体查询中转换'px'
      // exclude: [/NavBar\.vue/] // 查找不需要转换的元素 在js中使用正则：/正则相关规则/ exclude中存放的元素必须是正则表达式 按照排除的文件写对应的正则
    }
  }
}