import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入FastClick
import FastClick from 'fastclick'
// 导入VueLazyLoad
import VueLazyLoad from 'vue-lazyload'

import toast from 'components/common/toast'

Vue.config.productionTip = false
// 添加事件总线对象
Vue.prototype.$bus = new Vue()
// 安装toast插件
Vue.use(toast)

// 解决移动端300ms延迟
FastClick.attach(document.body)

// 使用图片懒加载的插件
Vue.use(VueLazyLoad, {
  loading: require('./assets/img/common/placeholder.png') // 占位符，当图片还没加载出来显示
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
